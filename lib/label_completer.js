"use strict"

const atom = require('atom')
const lu = require('./latex_utilities')
const escape_regex = require('escape-regexp')

const provider = {
    selector: '.text.tex.latex',
    // disableForSelector: '',

    // This will take priority over the default provider, which has a priority of 0.
    // `excludeLowerPriority` will suppress any providers with a lower priority
    // i.e. The default provider will be suppressed
    inclusionPriority: 1,
    excludeLowerPriority: true,

    // Required: Return a promise, an array of suggestions, or null.
    // request = {editor, bufferPosition, scopeDescriptor, prefix, activatedManually}
    // TODO: Please give us destructured function call already !
    getSuggestions: function (request) {
        const prefix_match = this.getPrefix(request.editor, request.bufferPosition)
        if (!prefix_match){
            return []
        }
        // TODO: Please give us destructured assignments already !
        const prefix = prefix_match[0]
        const macro = prefix_match[1]
        const label_prefix = prefix_match[2]
        
        const matching_labels = find_labels(lu.strip_comments(request.editor.getBuffer().getText()), escape_regex(label_prefix))
        if (!matching_labels){
            return []
        }
        const suggestions = matching_labels.map((l) => {
            return ({
                text: `${macro}{${l}}`,
                replacementPrefix: prefix
            })
        })
        return suggestions
    },
    
    getPrefix: function (editor, bufferPosition) {
        // FIXME: Document this!
        const regex = /(\\ref){?([^}\s]*)$/
        // Get the text for the line up to the triggered buffer position
        const line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])
        // Match the regex to the line, and return the match
        const pref = line.match(regex)
        if (pref){
            return pref
        }
        return ''
    }
    
    

    // (optional): called _after_ the suggestion `replacementPrefix` is replaced
    // by the suggestion `text` in the buffer
    // onDidInsertSuggestion: ({editor, triggerPosition, suggestion}) => {},

    // (optional): called when your provider needs to be cleaned up. Unsubscribe
    // from things, kill any processes, etc.
    // dispose: () => {}
    
}

const find_labels = function(latex, prefix){
    const re = RegExp(`\\\\label{(${prefix}[^}]+)}`, 'g')
    const result = []
    let m
    while ((m = re.exec(latex)) !== null) {
        result.push(m[1])
    }
    return result
}

module.exports = {
    provider
}
