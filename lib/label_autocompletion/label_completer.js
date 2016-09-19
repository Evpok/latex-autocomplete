"use strict"

const lu = require('../utilities/latex_utilities')
const escape_regex = require('escape-regexp')

// From http://tex.stackexchange.com/a/36312/8547
const ref_commands = ['ref', 'cref', 'Cref', 'cpageref', 'Cpageref', 'autoref', 'thref', 'vref', 'vpageref', 'eqref', 'refeq', 'prettyref', 'fref', 'Fref', 'tref', 'pref', 'zref']

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

        // TODO: Please give us destructured assignments already !
        const prefix = prefix_match[0]
        const macro = prefix_match[1]
        const obrace = prefix_match[2]
        const label_prefix = prefix_match[3] || ''

        let matching_commands = []
        if (obrace){
            matching_commands = ref_commands.filter((c) => c == macro)
        } else {
            matching_commands = ref_commands.filter((c) => c.startsWith(macro))
        }
        if (!matching_commands){
            return null
        }

        const matching_labels = find_labels(lu.strip_comments(request.editor.getBuffer().getText()), escape_regex(label_prefix))
        if (!matching_labels){
            return null
        }

        const suggestions =  [].concat(...matching_commands.map((c) => {
            return matching_labels.map((l) => {
                return {
                    text: `\\${c}{${l}}`,
                    replacementPrefix: prefix
                }
            })
        }))
        return suggestions
    },

    getPrefix: function (editor, bufferPosition) {
        // FIXME: Document this!
        // Get the text for the line up to the triggered buffer position
        const line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])
        const regex =/\\(\w+)(?:({)([^}\s]*))?$/
        const pref = line.match(regex)
        if (!pref){
            return ''
        }
        return pref
    }
}

const find_labels = function(latex, prefix){
    // TODO: Document this !
    const re = RegExp(String.raw`\\label{(${prefix}[^}]+)}`, 'g')
    const result = []
    for (let m = re.exec(latex); m!== null; m = re.exec(latex)) {
        result.push(m[1])
    }
    return result
}

module.exports = {
    provider,
    find_labels
}
