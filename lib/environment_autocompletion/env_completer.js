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
                this.editor.getBuffer().onDidChangeText((event) => {
                    event.changes.forEach((e, i, a) => {this.complete(e)})
                })
            )

            // Clean up on editor destruction
            this.disposables.add(
                this.editor.onDidDestroy(() =>{
                    this.destroy()
                })
            )
        }

        complete(change){
            // Get out early if we are not breaking line to avoid dragging typing
            if (!change.newText.startsWith('\n') && !change.newText.startsWith('\r')){return}

            const buff = this.editor.getBuffer()
            const currow = change.newRange.end.row
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
            const currow_length = buff.lineLengthForRow(currow)
            // Defer the mutations to `transact` in order to make the edits atomic
            buff.transact( () => {
                buff.insert([currow, currow_length], '\n'+closer.closers(close))
                this.editor.moveUp()
                const begin_indent = this.editor.indentationForBufferRow(currow-1)
                this.editor.setIndentationForBufferRow(currow+1, begin_indent)
                // Optional `\item` addition
                if (this.addItemToListEnvironments){
                    buff.insert([currow,  currow_length], closer.additions(close[0]))
                }
            })
        }

        destroy(){
            this.disposables.dispose()
            this.on_destroyed()
        }
    }
}
