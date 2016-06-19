"use strict"

const lu = require('../utilities/latex_utilities')

// Test if there is an `\end{@environment}` in `@code_after` that is not
// matched by a `\begin{@environment}` in `@code_before`.
//
// Pretty forgiving, as it ignore nesting incoherences and suerflous
// `\end{@environment}` in `@code_before`.
const is_closed = function(environment, code_before, code_after){
    const begin_macro = String.raw`\\begin{${environment}}`
    const end_macro = String.raw`\\end{${environment}}`
    const re = RegExp(String.raw`(${begin_macro}|${end_macro})`, 'g')

    // We start at 1, for the `\begin{@environment}` we are trying to match
    let count = 1
    // First, let's see how deep we are in nested environments
    let m =lu.strip_comments(code_before).match(re)
    if (m){
        for (let macro of m){
            if (macro.match(end_macro)){
                count--
            }else if (macro.match(begin_macro)){
                count++
            }
        }
    }
    // Let's be nice and forget about what's before if there are more endings than beginnings
    count = Math.max(count, 1)
    // And now let's see if we are closed somewhere
    m =lu.strip_comments(code_after).match(re)
    if (!m){return false}
    for (let macro of m){
        if (macro.match(end_macro)){
            count--
        }else if (macro.match(begin_macro)){
            count++
        }
        if (count == 0){return true}
    }
    return false
}

const has_beginners = function(line){
    const re = /\\begin{([^}]+)}/g
    return line.match(re)
}

// Return a list of the environments started in the current line
// that have to be closed
const to_close = function(line, code_before, code_after){
    const l =lu.strip_comments(line)
    const re = /\\begin{([^}]+)}/g
    let res = []
    let m
    while ((m = re.exec(l)) !== null) {
        // First check if it isn't closed in the current line
        // in that case we are greedy and grab the first `\end{…}` we see
        // disregarding `\begin{…}` there might be before`as we won't
        // insert anything inside `line. This prevents mistake if the same
        // env is opened several times on the same line.
        const line_remains = l.slice(re.lastIndex)
        if(is_closed(m[1], '', line_remains)){continue}

        // If not, apply the usual check
        const before = code_before + l.slice(0, m.index+1)
        const after = line_remains + code_after
        if (!is_closed(m[1], before, after)){res.push(m[1])}
    }
    return res.reverse()
}

// Return a string that should be inserted at the beginning of a new line
// immediatly following `\begin{@environment}`.
const additions = function(environment){
    const lists = new Set(['itemize', 'enumerate', 'description'])
    if (lists.has(environment)){return String.raw`\item `}
    return ''
}

// Return an array containing the `\end{...}` corredsponding to the
// environments in `@environments`.
const closers = function(environments){
    return environments.map(a=>String.raw`\end{${a}}`).join('')
}

module.exports={is_closed, to_close, closers, has_beginners, additions}
