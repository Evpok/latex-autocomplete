"use strict"
const completer = require("./completer.js")

const completed_editors = new Map()

function complete_if_latex(editor){
    if (editor.getGrammar().name == 'LaTeX' && !completed_editors.has(editor)){
        const comp =  new completer.Completer(editor)
        completed_editors.set(editor, comp)
        comp.on_destroyed =  () => {completed_editors.delete(editor)}
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

module.exports = {
    activate: function() {
        atom.workspace.observeTextEditors(hook_editor)
    },
    deactivate: function() {
        for (let editor of completed_editors.keys()){
            completed_editors.get(editor).destroy()
        }
   },
    completed_editors,
}
