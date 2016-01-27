"use strict"
const closer = require('./libcloser.js')
const atom = require('atom')

module.exports = {
    Completer: class{
        constructor(editor){
            this.editor = editor

            // For future evolutions : keep a list of all the observers
            this.disposables = [
                // Observe text buffer changes
                this.editor.getBuffer().onDidChange((event) => {
                    // Get out early if we are not breaking line to avoid dragging typing
                    if (event.newText != '\n'){return}

                    const buff = this.editor.getBuffer()
                    const prevline = buff.lineForRow(event.newRange.end.row-1)
                    // Get out early if there are no environments beginnings too
                    if (!closer.has_beginners(prevline)){return}

                    // Real stuff happens here
                    const currow = event.newRange.end.row
                    const after = buff.getTextInRange(new atom.Range([currow+1,0], buff.getEndPosition()))
                    const close = closer.to_close(prevline, after)
                    // Get out if there is nothing to close
                    if (!close.length){return}

                    // Elsewise, do the magic
                    buff.insert([currow+1,0],closer.closers(close)+'\n')
                    this.editor.setIndentationForBufferRow(currow+1, this.editor.indentationForBufferRow(currow-1))
                    // Optional `\item` addition
                    buff.insert([currow,0], closer.additions(close[0]))
                })
            ]
        }
    }
}
