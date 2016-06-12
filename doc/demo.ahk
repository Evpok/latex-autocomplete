SetKeyDelay, 40

#p::Pause

#t::Reload

^j::
    Send, {Enter}{Enter}
    SendRaw,
    (
I will add environments to this.

\begin{em}
    )
    Sleep, 500
    Send, {Enter}
    Sleep, 500
    SendRaw, They are automatically closed !
    Sleep 500
    Send, {Space}
    SendRaw, Ain't it neat ?
    Sleep 1000
    Send, {Down}{End}{Enter}{Enter}

    SendRaw, Sometimes you want to refer to things.
    Sleep, 500
    Send, {Enter}
    SendRaw,
    (
\begin{equation}\label{Z/2Z}
1 + 1 = 4
    )
    Send, {Down}{End}{Enter}{Enter}
    Sleep, 500
    SendRaw, And I will help you do it :
    Sleep, 500
    Send, {Space}
    SendRaw, see equation~
    Send, {Space}{BS}
    SendRaw, \ref{
    Sleep, 1000.
    Send, {Tab}{}}{End}
    Sleep, 1000
    Send, {Enter}{Enter}

    SendRaw, I will also add items to your lists
    Sleep, 500
    Send, {Enter}
    SendRaw,
    (
\begin{enumerate}
Like this
    )
    Sleep, 500
    Send, {Enter}
    SendRaw,
    (
    \begin{enumerate}
Even nested ones
    )
    Sleep, 1000
    Send, {Down}{Down}{End}{Enter}{Enter}

    SendRaw,
    (
And even this trick
\begin{em} `% \end{em}
    )
    Sleep, 1000
    Send, {Enter}
    SendRaw,
    (
won't fool me!
    )
    Sleep, 1000
    Send, {Down}{End}{Enter}{Enter}
    SendRaw, So, are you convinced ?
Return
