"use strict"
/* global atom */

const env_completer = require("./environment_autocompletion/env_completer.js")
const label_completer = require("./label_autocompletion/label_completer.js")
const macro_completer = require('./macros_autocompletion/macro_completer.js')

const completed_editors = new Map()

function complete_if_latex(editor){
    if (editor.getGrammar().name == 'LaTeX' && !completed_editors.has(editor)){
        const comp =  new env_completer.Completer(editor, atom.config.get('latex-autocomplete.addItemToListEnvironments'))
        completed_editors.set(editor, comp)
        comp.on_destroyed = (() => completed_editors.delete(editor))
    } else if (editor.getGrammar().name != 'LaTeX' && completed_editors.has(editor)){
        completed_editors.get(editor).destroy()
    }
}
function hook_editor(editor){
    complete_if_latex(editor)

    // Give a second chance to editors on grammar change
    editor.observeGrammar((grammar) => {
        complete_if_latex(editor)
    })
}

const get_autocomplete_providers = () => {
    const res = []
    if (atom.config.get('latex-autocomplete.autocompleteLabels')){
        res.push(label_completer.provider)
    }
    if (atom.config.get('latex-autocomplete.autocompleteMacros')){
        res.push(macro_completer.provider)
    }
    return res
}

module.exports = {
    activate: function() {
        // Register environments completers
        if (atom.config.get('latex-autocomplete.automaticallyCloseEnvironments')){
            atom.workspace.observeTextEditors(hook_editor)
        }

        // Reflect `\item` addition setting in editor already observed for environment closing
        atom.config.onDidChange('latex-autocomplete.addItemToListEnvironments', (event) => {
            for (let editor of completed_editors.keys()){
                completed_editors.get(editor).addItemToListEnvironments = event.newValue
            }
        })

        // If the environment auto closing setting changes, either destroy all completers or register
        // new completers, depending on the new value of the setting
        atom.config.onDidChange('latex-autocomplete.automaticallyCloseEnvironments', (event) => {
            if (event.newValue){
                atom.workspace.observeTextEditors(hook_editor)
            } else {
                for (let editor of completed_editors.keys()){
                    completed_editors.get(editor).destroy()
                }
            }
        })

        // TODO: find a way to hot-toggle label autocompletion according to `latex-autocomplete.autocompleteLabels`
    },
    deactivate: function() {
        for (let editor of completed_editors.keys()){
            completed_editors.get(editor).destroy()
        }
    },
    get_autocomplete_providers,
    completed_editors,
    config:{
        automaticallyCloseEnvironments:{
            type: 'boolean',
            default: true
        },
        addItemToListEnvironments:{
            title: 'Add `\\item` to list environments',
            type: 'boolean',
            default: true
        },
        autocompleteLabels:{
            type: 'boolean',
            default: true
        },
        autocompleteMacros:{
            type: 'boolean',
            default: true
        }
    }
}
