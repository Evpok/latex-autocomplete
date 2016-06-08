"use strict"

const atom = require('atom')
const lu = require('./latex_utilities')

const provider = {
    selector: '.text.tex.latex',
    // disableForSelector: '',

    // This will take priority over the default provider, which has a priority of 0.
    // `excludeLowerPriority` will suppress any providers with a lower priority
    // i.e. The default provider will be suppressed
    inclusionPriority: 1,
    excludeLowerPriority: true,

    // Required: Return a promise, an array of suggestions, or null.
    // args = {editor, bufferPosition, scopeDescriptor, prefix, activatedManually}
    // TODO: Please give us destructured assignments already !
    getSuggestions: (args) => {
        console.log(`Completing "${args["prefix"]}"`)
        return new Promise((resolve) => {
          resolve({text: 'something'})
        })
    },

    // (optional): called _after_ the suggestion `replacementPrefix` is replaced
    // by the suggestion `text` in the buffer
    // onDidInsertSuggestion: ({editor, triggerPosition, suggestion}) => {},

    // (optional): called when your provider needs to be cleaned up. Unsubscribe
    // from things, kill any processes, etc.
    // dispose: () => {}
}

module.exports = {
    provider
}
