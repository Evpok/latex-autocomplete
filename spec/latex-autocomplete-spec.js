latexautocomplete = require('../lib/latexautocomplete.js')
path = require('path')

describe("latex autocomplete", () => {
    describe("activation", () => {
        it("can be loaded", () => {
            atom.packages.loadPackage('latex-autocomplete')
            expect(atom.packages.isPackageLoaded("latex-autocomplete")).toBeTruthy()
        })

        it("hooks to LaTeX editors", () => {
            workspaceElement = atom.views.getView(atom.workspace)
            jasmine.attachToDOM(workspaceElement)

            let flag = false
            let editor = null
            runs(() => {
                atom.packages.activatePackage('language-latex')
                .then(() => {
                   atom.packages.activatePackage('latex-autocomplete')
                    test_file = path.join('test.tex')
                    return atom.workspace.open(test_file)
                })
                .then((e) => {
                    editor = e
                    flag = true
                }, (error) => {
                    console.log(error)
                    expect(false).toBeTrue() // Until such time as we can use Jasmine 2
                    flag = true
                })
            })
            waitsFor(() => {
                return flag
            }, 'Hooking timed out', 2000)

            runs(() => {
                expect(latexautocomplete.completed_editors.get(editor)).toBeDefined()
            })
        })
    })

    // describe('works as expected', () => {
    //     beforeEach(() => {
    //         workspaceElement = atom.views.getView(atom.workspace)
    //         jasmine.attachToDOM(workspaceElement)
    //
    //         let flag = false
    //         runs(() => {
    //             atom.packages.activatePackage('language-latex')
    //             .then(() => {
    //                 atom.packages.activatePackage('latex-autocomplete')
    //             })
    //             .then(() => {
    //                 flag = true
    //             })
    //             .catch((error) => {
    //                 console.log(error)
    //                 flag = true
    //             })
    //         })
    //         waitsFor(() => {
    //             return flag
    //         }, 'activating latex-autocomplete timed out', 2000)
    //
    //         runs(() => {})
    //     })
    //     it("latches a Completer files whose grammar is LaTeX", (done) =>{
    //         let flag = false
    //         spyOn(latexautocomplete, 'hook_editor').andReturn(5)
    //         console.log(latexautocomplete.hook_editor)
    //         runs(() => {
    //             test_file = path.join('test.tex')
    //             atom.workspace.open(test_file)
    //             .then((editor) => {
    //                 console.log(editor)
    //                 latexautocomplete.activate() // It isn't activated otherwise. Might be an issue with activationHooks
    //                 editor.setGrammar(atom.grammars.grammarForScopeName('text.tex.latex'))
    //                 flag = true
    //             })
    //             .catch((error) => {
    //                 console.log(error)
    //                 flag = true
    //             })
    //         })
    //         waitsFor(() => {
    //             return flag
    //         }, 'opening test.tex timed out', 2000)
    //         runs(() => {
    //             expect(true).toBe(true)
    //
    //             expect(latexautocomplete.hook_editor).toHaveBeenCalled()
    //         })
    //
    //
    //     })
    //     it("triggers a completion on newline if there is something to be completed")
    //     it("actually completes the opened enviroments")
    //     it("adds \\items to some lists environments")
//     })
})

// let sample_before =
// String.raw`This is some \LaTeX code
// That may contain
// \begin{emphasize}
// To find unbalanced blocs
// \end{emphasize}
// Some nesting \begin{spam}
// \end{emphasize}`
//
// let sample_after = String.raw`This is some \LaTeX code
// That I will parse
// \begin{emphasize}
// To find unbalanced blocs
// \end{emphasize}
// is this one? \end{spam}\end{ham}
// \end{emphasize}`
//
// let line = String.raw`\begin{hello}\begin{spam}\end{hello}`
//
// console.log(closers(to_close(line, sample_before, sample_after)))
// console.log(is_closed('ham', sample_before, sample_after))
//
// let s = "Ceci est une ligne\nCeci une autre%aec des commentaires\nceci une sans\n%et que des commentaires"
