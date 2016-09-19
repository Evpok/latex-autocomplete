"use strict"

const latexautocomplete = require('../lib/latexautocomplete.js')
const libenvcloser = require('../lib/environment_autocompletion/libenvcloser.js')
const labelcompleter = require('../lib/label_autocompletion/label_completer.js')
const macrocompleter = require('../lib/macros_autocompletion/macro_completer.js')
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

    describe('completing environments', () => {
        it('detects beginners in a single line', () => {
            const single_line = String.raw`\begin{spam}`
            expect(libenvcloser.has_beginners(single_line)).toBeTruthy()
        })

        it('detects which environments should be closed in that line', () => {
            const sample_line = String.raw`\begin{hello}\end{hello}\begin{spam}\begin{ham}`
            const envs = libenvcloser.to_close(sample_line, '', '')
            expect(envs).toEqual(['ham', 'spam'])
        })

        it("doesn't close environments that are already closed", () =>{
            const sample_line = String.raw`\begin{ham}`
            const sample_after = String.raw`Some text and a closer \end{ham}`
            const envs = libenvcloser.to_close(sample_line, '', sample_after)
            expect(envs).toEqual([])
        })

        it("close environments that are only closed in a comment", () =>{
            const sample_line = String.raw`\begin{ham}`
            const sample_after = String.raw`Some text and a comment %\end{ham}`
            const envs = libenvcloser.to_close(sample_line, '', sample_after)
            expect(envs).toEqual(['ham'])
        })

        it("closes enviroments followed by unmatching \end's", () => {
            const sample_before = String.raw`A beginning \begin{ham} and some text`
            const sample_line = String.raw`\begin{ham}`
            const sample_after = String.raw`Some text and a closer \end{ham}`
            const envs = libenvcloser.to_close(sample_line, sample_before, sample_after)
            expect(envs).toEqual(['ham'])
        })
    })

    describe('autocompleting labels', () => {
        it('detects labels', () => {
            const l = String.raw`\begin{equation}\label{Z/2Z}1+1=4\end{equation}`
            const labels = labelcompleter.find_labels(l, '')
            expect(labels).toEqual(['Z/2Z'])
        })
    })

    describe('autocompleting macros', () => {
        describe('macro definition detections', () => {
            it('detects macro with no argument', () => {
                const l = String.raw`Spam spam spam \newcommand{\spam}{sausages} eggs eggs eggs`
                const macros = macrocompleter.find_macros(l, '')
                expect(macros).toEqual([['\\spam', []]])
            })
            it('detects macros with mandatory arguments', () => {
                const l = String.raw`Spam spam spam \newcommand{\spam}[2]{#1 sausages #2} eggs eggs eggs`
                const macros = macrocompleter.find_macros(l, '')
                expect(macros).toEqual([['\\spam', [[false, undefined], [false, undefined]]]])
            })
            it('detects macros with an optional argument', () => {
                const l = String.raw`Spam spam spam \newcommand{\spam}[2][Camelot]{#1 sausages #2} eggs eggs eggs`
                const macros = macrocompleter.find_macros(l, '')
                expect(macros).toEqual([['\\spam', [[true, 'Camelot'], [false, undefined]]]])
            })
        })
        describe('snippet generation', () => {
            it('generates snippets for macros with no argument', () => {
                const desc = ['\\spam', []]
                const snippet = macrocompleter.snippet_from_macro_desc(desc)
                expect(snippet).toEqual('\\\\spam')
            })
            it('generates snippets for macros with mandaory arguments', () => {
                const desc = ['\\spam', [[false, undefined], [false, undefined]]]
                const snippet = macrocompleter.snippet_from_macro_desc(desc)
                expect(snippet).toEqual(`\\\\spam{\${1:#1}}{\${2:#2}}`)
            })
            it('generates snippets for macros with an optional argument', () => {
                const desc = ['\\spam', [[true, 'Camelot'], [false, undefined]]]
                const snippet = macrocompleter.snippet_from_macro_desc(desc)
                expect(snippet).toEqual(`\\\\spam[\${1:#1 (default: 'Camelot')}]{\${2:#2}}`)
            })
        })
    })
})
