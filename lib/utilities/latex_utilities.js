const strip_comments = function(code){
    const re = /((\\\\)*[^\\])(%.*)$/gm
    return code.replace(re, '$1')
}

module.exports = {strip_comments}
