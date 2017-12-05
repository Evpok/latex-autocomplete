"use strict"
const util = require('util');
const lu = require('../utilities/latex_utilities')
const escape_regex = require('escape-regexp')

const fs = require('fs')
const path = require('path')

// FUTURE: node > 8.0.0
// readFile = util.promisify(fs.readFile)
// WORKAROUND: node < 8.0.0
function readFile(path, encoding) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, encoding, function (error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

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
    getSuggestions: async function(request) {
        const prefix_match = this.getPrefix(request.editor, request.bufferPosition)
        if (!prefix_match){
            return null
        }

        const [prefix, macro_name_prefix, obrace] = prefix_match

        const text = request.editor.getBuffer().getText()
        // Read macros from the buffer itself
        const matching_macros = find_macros(lu.strip_comments(text),
                                            escape_regex(macro_name_prefix))

        // Match the magic comment at the top of the buffer for external macro file
        const magicMacro = /%\s*!TEX macros\s*=\s*(.+)/g
        let match
        while (match = magicMacro.exec(text)) {
            const file = request.editor.getBuffer().file
            if (file) {
                const bufferFileDir = path.dirname(file.path)
                const macroFile = path.join(bufferFileDir, match[1])
                let macroFileText
                try {
                    macroFileText = await readFile(macroFile, 'utf-8')
                } catch (e) {
                    atom.notifications.addError(`Macros file ${macroFile} not found.`)
                    continue
                }

                const external_macros = find_macros(
                    lu.strip_comments(macroFileText),
                    escape_regex(macro_name_prefix))
                matching_macros.push(...external_macros)
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

    getPrefix: (editor, bufferPosition) => {
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
