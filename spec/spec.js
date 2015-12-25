let sample_before =
String.raw`This is some \LaTeX code
That may contain
\begin{emphasize}
To find unbalanced blocs
\end{emphasize}
Some nesting \begin{spam}
\end{emphasize}`

let sample_after = String.raw`This is some \LaTeX code
That I will parse
\begin{emphasize}
To find unbalanced blocs
\end{emphasize}
is this one? \end{spam}\end{ham}
\end{emphasize}`

let line = String.raw`\begin{hello}\begin{spam}\end{hello}`

console.log(closers(to_close(line, sample_before, sample_after)))
console.log(is_closed('ham', sample_before, sample_after))

let s = "Ceci est une ligne\nCeci une autre%aec des commentaires\nceci une sans\n%et que des commentaires"
