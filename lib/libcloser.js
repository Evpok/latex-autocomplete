"use strict"

const is_closed = function(environment, code_after){
    const begin_macro = String.raw`\\begin{${environment}}`
    const end_macro = String.raw`\\end{${environment}}`
    const re = RegExp(String.raw`(${begin_macro}|${end_macro})`, 'g')

    let count = 1
    const m = strip_comments(code_after).match(re)
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

const strip_comments = function(code){
    const re = RegExp(String.raw`((\\\\)*[^\\])(%.*)$`,'gm')
    return code.replace(re, '$1')
}

const has_beginners = function(line){
    const re = RegExp('\\\\begin{([^}]+)}')
    return line.match(re)
}

const to_close = function(line, code_after){
    // Returns a list of the environments started in the current line
    // that have to be closed
    const l = strip_comments(line)
    const re = RegExp('\\\\begin{([^}]+)}','g')
    let res = []
    let m
    while ((m = re.exec(l)) !== null) {
        let after = l.slice(re.lastIndex) + code_after
        if (!is_closed(m[1], after)){res.push(m[1])}
    }
    return res.reverse()
}

const additions = function(environment){
    const lists = new Set(['itemize', 'enumerate', 'description'])
    if (lists.has(environment)){return String.raw`\item `}
    return ''
}

const closers = function(tags){
    return tags.map(a=>String.raw`\end{${a}}`).join('')
}

module.exports={is_closed, strip_comments, to_close, closers, has_beginners, additions}
