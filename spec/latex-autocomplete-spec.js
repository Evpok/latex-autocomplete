"use strict"
const latexautocomplete = require('../lib/latexautocomplete.js')
const libenvcloser = require('../lib/libenvcloser')
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

        it("closes enviroments followed by unmatching \end's", () => {
            const sample_before = String.raw`A beginning \begin{ham} and some text`
            const sample_line = String.raw`\begin{ham}`
            const sample_after = String.raw`Some text and a closer \end{ham}`
            const envs = libenvcloser.to_close(sample_line, sample_before, sample_after)
            expect(envs).toEqual(['ham'])
        })
    })
})
