## 1.0.0 (2016-09-24
  - Updated README
  - Mostly symbolic graduation, since the number of users is becoming significant. Huzzah and champagne !
## 0.6.0 (2016-09-19)
  - Add autocompletion for user-defined macros. Only support `\newcommand` and `\newcommand*`. Support for `xparse` to be added later.

## 0.5.3 (2016-06-21)
* Fix environment completion with non-UNIX EOLs
* Fix label completion not working for more than one reference per line

## 0.5.2 (2016-06-19)
* Added label autocompletion support for more referencing commands (currently `\ref`, `\cref`, `\Cref`, `\cpageref`, `\Cpageref`, `\autoref`, `\thref`, `\vref`, `\vpageref`, `\eqref`, `\refeq`, `\prettyref`, `\fref`, `\Fref`, `\tref`, `\pref`, `\zref`).
* Otherwise improved label autocompletion.

## 0.5.1
* Various cosmetics

## 0.5.0
* Add autocompletion provider for labels using `autocomplete-plus`](https://atom.io/packages/autocomplete-plus)
* Add settings to selectively enable features
* Several fixes and cosmetics

## 0.4.3
* Now properly destroys itself on activation/deactivation and destroy completers on closed editors and editors whose grammar is no longer LaTeX.

## 0.4.2
* Added an automated build on travis

## 0.4.1
* Updated changelog
* Removed dev clutter from `package.json`

## 0.4.0
* Added proper specs
* Ensure there is one and only one `Completer` hooked to each LaTeX file

## 0.1.0 - First Release
* Every feature added
* Every bug fixed
