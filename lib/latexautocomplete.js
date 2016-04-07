"use strict"
const completer = require("./completer.js")

const completed_editors = new Map()

function completer_if_latex(editor, grammar){
    if (completed_editors.has(editor)){
        return completed_editors.get(editor)
    } else if (grammar.name == "LaTeX"){
        const comp = new completer.Completer(editor)
        completed_editors.set(editor, comp)
        return comp
    }
    return null
}

function hook_editor(editor){
    // Only hook the completer to LaTeX files
    completer_if_latex(editor, editor.getGrammar()) // May be absurd

    // Give a second chance to editors on grammar change
    editor.observeGrammar((grammar) => {
        const newcomp = completer_if_latex(editor, grammar)
        // If it is no longer LaTeX, dispose of the completer
        if (!newcomp && completed_editors.has(editor)){
            completed_editors.get(editor).destroy()
            completed_editors.delete(editor)
        }
    })
}

module.exports = {
    activate: function() {
        atom.workspace.observeTextEditors(hook_editor)
    },
    completed_editors,
}
