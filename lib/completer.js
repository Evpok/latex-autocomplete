"use strict"
const closer = require('./libcloser.js')
const atom = require('atom')

module.exports = {
    Completer: class{
        constructor(editor){
            this.editor = editor
            this.disposables = [
                this.editor.getBuffer().onDidChange((event) => {
                    if (event.newText == '\n'){
                        const buff = this.editor.getBuffer()
                        const prevline = buff.lineForRow(event.newRange.end.row-1)
                        if (closer.has_beginners(prevline)){
                            const currow = event.newRange.end.row
                            const before = buff.getTextInRange(new atom.Range([0,0],[currow-1,0]))
                            const after = buff.getTextInRange(new atom.Range([currow+1,0], buff.getEndPosition()))
                            const close = closer.to_close(prevline, before, after)
                            if (close.length){
                                buff.insert([currow+1,0],closer.closers(close)+'\n')
                                this.editor.setIndentationForBufferRow(currow+1, this.editor.indentationForBufferRow(currow-1))
                            }
                        }
                    }
                })
            ]
        }
    }
}
