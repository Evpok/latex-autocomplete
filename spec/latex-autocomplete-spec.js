"use strict"
const latexautocomplete = require('../lib/latexautocomplete.js')
const libcloser = require('../lib/libcloser')
const path = require('path')

describe("latex autocomplete", () => {
    describe("activation, hooking and deactivation", () => {
        it("can be loaded", () => {
            atom.packages.loadPackage('latex-autocomplete')
            expect(atom.packages.isPackageLoaded("latex-autocomplete")).toBeTruthy()
        })

        it("hooks to LaTeX editors", () => {
            let flag = false
            let editor = null
            runs(() => {
                atom.packages.activatePackage('language-latex')
                .then(() => {
                   atom.packages.activatePackage('latex-autocomplete')
                    const test_file = path.join('test.tex')
                    return atom.workspace.open(test_file)
                })
                .then((e) => {
                    editor = e
                    flag = true
                }, (error) => {
                    console.log(error)
                    // Until such time as we can use Jasmine 2 and get rid of that effing boilerplate
                    expect(false).toBe(true)
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

    describe('works as expected', () => {
const sample_before =
String.raw`This is some \LaTeX code
\begin{emphasize}
That may contain
\begin{emphasize}
To find unbalanced blocs
\end{emphasize}
Some nesting \begin{spam}`

const sample_after = String.raw`This is some \LaTeX code
That I will parse
\begin{emphasize}
To find unbalanced blocs
\end{emphasize}
is this one? \end{spam}
\end{emphasize}`

const sample_line = String.raw`\begin{hello}\end{hello}\begin{spam}\begin{ham}`
        it("correctly detects which environments are to be closed", () =>{
            const envs = libcloser.to_close(sample_line, sample_before, sample_after)
            expect(envs).toEqual(['ham', 'spam'])
        })

    })
})
