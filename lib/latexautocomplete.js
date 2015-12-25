"use strict"
const completer = require("./completer.js")

function completer_if_latex(editor){
    const grammar =  editor.getGrammar().name
    if (grammar == "LaTeX"){
        new completer.Completer(editor)
    }
}

function hook_editor(editor){
    // Only hook the complete to LaTeX editors
    completer_if_latex(editor)
    // Give a second chance to editors on save/rename/move
    editor.onDidChangeTitle(a => completer_if_latex(editor))
    editor.onDidChangePath(a => completer_if_latex(editor))
    editor.onDidSave(a => completer_if_latex(editor))
}

module.exports = {
    activate: function() {
        atom.workspace.observeTextEditors(hook_editor)
    }
};
