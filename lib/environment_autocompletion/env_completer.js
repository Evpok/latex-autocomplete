"use strict"
const closer = require('./libenvcloser.js')
const atom = require('atom')

module.exports = {
    Completer: class{
        constructor(editor, addItemToListEnvironments){
            this.editor = editor
            this.on_destroyed = () => {}
            this.addItemToListEnvironments = addItemToListEnvironments

            //  keep a list of all the observers
            this.disposables = new atom.CompositeDisposable()

            // Environment completion
            this.disposables.add(
                // Observe text buffer changes
                this.editor.getBuffer().onDidChange((event) => {
                    // Get out early if we are not breaking line to avoid dragging typing
                    if (!event.newText.endsWith('\n') && !event.newText.endsWith('\r')){return}

                    const buff = this.editor.getBuffer()
                    const currow = event.newRange.end.row
                    const prevline = buff.lineForRow(currow-1)
                    // Get out early if there are no environments beginnings too
                    if (!closer.has_beginners(prevline)){return}

                    // Real stuff happens here
                    const before = buff.getTextInRange(new atom.Range([0, 0], [currow-1, 0]))
                    const after = buff.getTextInRange(new atom.Range([currow+1, 0], buff.getEndPosition()))
                    const close = closer.to_close(prevline, before, after)
                    // Get out if there is nothing to close
                    if (!close.length){return}

                    // Elsewise, do the magic
                    buff.insert([currow, buff.lineLengthForRow(currow)], '\n'+closer.closers(close))
                    this.editor.moveUp()
                    this.editor.setIndentationForBufferRow(currow+1, this.editor.indentationForBufferRow(currow-1))
                    // Optional `\item` addition
                    if (this.addItemToListEnvironments){
                        buff.insert([currow, 0], closer.additions(close[0]))
                    }
                })
            )

            // Clean up on editor destruction
            this.disposables.add(
                this.editor.onDidDestroy(() =>{
                    this.destroy()
                })
            )
        }

        destroy(){
            this.disposables.dispose()
            this.on_destroyed()
        }
    }
}
