const strip_comments = function(code){
    const re = RegExp(String.raw`((\\\\)*[^\\])(%.*)$`,'gm')
    return code.replace(re, '$1')
}

module.exports = {strip_comments}
