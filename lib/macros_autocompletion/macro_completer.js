"use strict"
const lu = require('../utilities/latex_utilities')
const escape_regex = require('escape-regexp')

const fs = require('fs')
const path = require('path')

const provider = {
    selector: '.text.tex.latex',
    // disableForSelector: '',

    // This will take priority over the default provider, which has a priority of 0.
    // `excludeLowerPriority` will suppress any providers with a lower priority
    // i.e. The default provider will be suppressed
    inclusionPriority: 1,

    // Required: Return a promise, an array of suggestions, or null.
    // request = {editor, bufferPosition, scopeDescriptor, prefix, activatedManually}
    // TODO: Please give us destructured function call already !
    getSuggestions: function (request) {
        const prefix_match = this.getPrefix(request.editor, request.bufferPosition)
        if (!prefix_match){
            return null
        }

        const [prefix, macro_name_prefix, obrace] = prefix_match

        let text = request.editor.getBuffer().getText() //By default we take macros from the current buffer
        let matching_macros = find_macros(lu.strip_comments(text), escape_regex(macro_name_prefix))

        const bufferFileFullPath = atom.workspace.getActivePaneItem().buffer.file.path // We the path to the buffer's file
        const bufferFileDir = path.resolve(bufferFileFullPath,"..") // Remove the file from the path
        const texRootRex = /%(\s+)?!TEX macros(\s+)?=(\s+)?(.+)/g // LaTeX comment including the path to the macros file

        // We look for the varible containing the path to the macros file
        let match
        let macrosFile
        while(match = texRootRex.exec(request.editor.getBuffer().getText())) {
          macrosFile = path.resolve(bufferFileDir,match[4])
        }

        // If the macros file is specified we look for macros and concatenate them to the ones defined in the curren file
        if (macrosFile != undefined) {
          try {
            text = fs.readFileSync(macrosFile, 'utf-8')
            matching_macros = matching_macros.concat(find_macros(lu.strip_comments(text), escape_regex(macro_name_prefix)))
          } catch (e) { // If the file specified cannot be read, we show an error message
            atom.notifications.addError('Macros file not found. Please, check the specified path.')
          }
        }

        if (!matching_macros){
            return null
        }

        const suggestions = matching_macros.map((m) => {
            return {
                snippet: snippet_from_macro_desc(m),
                replacementPrefix: prefix
            }
        })
        return suggestions
    },

    getPrefix: function (editor, bufferPosition) {
        // FIXME: Document this!
        // Get the text for the line up to the triggered buffer position
        const line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])
        const pref = line.match(/(\\\w+)({)?$/)
        if (!pref){
            return false
        }
        return pref
    }
}

const find_macros = function(latex, prefix){
    const re = RegExp(String.raw`\\newcommand\*?{(${prefix}[^}]*)}(?:\[(\d)](?:\[([^\]]*)\])?)?`, 'g')
    const result = []
    for (let m = re.exec(latex); m!== null; m = re.exec(latex)) {
        const nargs = parseInt(m[2])
        if (Number.isNaN(nargs)){
            // Macro without argument
            result.push([m[1], []])
        } else if (m[3] !== undefined) {
            // Macro with an optional first argument
            result.push([m[1], [[true, m[3]], ...Array(nargs-1).fill([false, undefined])]])
        } else {
            // Macro with only mandatory arguments
            result.push([m[1], Array(nargs).fill([false, undefined])])
        }
    }
    return result
}

const snippet_from_macro_desc = function(macro_desc){
    const argsline = macro_desc[1].map((arg, index) => {
        if (arg[0]){
            if (arg[1] === undefined){
                return `[\${${index+1}:#${index+1}}]`
            }
            return `[\${${index+1}:#${index+1} (default: '${arg[1]}')}]`
        }
        return `{\${${index+1}:#${index+1}}}`
    })
    const snippet = macro_desc[0] + argsline.join('')
    // Due to [snippet idiosyncrasies](https://github.com/atom/snippets/issues/127),
    // don't forget to double our backslashes.
    return snippet.replace('\\', '\\\\')
}

module.exports = {
    provider,
    find_macros,
    snippet_from_macro_desc
}
