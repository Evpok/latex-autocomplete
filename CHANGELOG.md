Changelog
==========
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to
[Semantic Versioning](http://semver.org/).

## [1.0.1] - 2017-11-19
[1.0.1]: https://github.com/Evpok/latex-autocomplete/compare/v1.0.0...v1.0.1
### Fixed
  - Fix behaviour (hopefully) for the new [`TextBuffer.onDidChange`](https://github.com/atom/text-buffer/pull/273) on 1.23+

## [1.0.0] - 2016-09-24
[1.0.0]: https://github.com/Evpok/latex-autocomplete/compare/v0.6.0...v1.0.0
  - Updated README
  - Mostly symbolic graduation, since the number of users is becoming significant. Huzzah and champagne !
  -
## [0.6.0] - 2016-09-19
[0.6.0]: https://github.com/Evpok/latex-autocomplete/compare/v0.5.3...v0.6.0
  - Add autocompletion for user-defined macros. Only support `\newcommand` and `\newcommand*`. Support for `xparse` to be added later.

## [0.5.3] - 2016-06-21
[0.5.3]: https://github.com/Evpok/latex-autocomplete/compare/v0.5.2...v0.5.3
* Fix environment completion with non-UNIX EOLs
* Fix label completion not working for more than one reference per line

## [0.5.2] - 2016-06-19
[0.5.2]: https://github.com/Evpok/latex-autocomplete/compare/v0.5.1...v0.5.2
* Added label autocompletion support for more referencing commands (currently `\ref`, `\cref`, `\Cref`, `\cpageref`, `\Cpageref`, `\autoref`, `\thref`, `\vref`, `\vpageref`, `\eqref`, `\refeq`, `\prettyref`, `\fref`, `\Fref`, `\tref`, `\pref`, `\zref`).
* Otherwise improved label autocompletion.

## [0.5.1]
[0.5.1]: https://github.com/Evpok/latex-autocomplete/compare/v0.5.0...v0.5.1
* Various cosmetics

## [0.5.0]
[0.5.0]: https://github.com/Evpok/latex-autocomplete/compare/v0.4.3...v0.5.0
* Add autocompletion provider for labels using `autocomplete-plus`](https://atom.io/packages/autocomplete-plus)
* Add settings to selectively enable features
* Several fixes and cosmetics

## [0.4.3]
[0.4.3]: https://github.com/Evpok/latex-autocomplete/compare/v0.4.2...v0.4.3
* Now properly destroys itself on activation/deactivation and destroy completers on closed editors and editors whose grammar is no longer LaTeX.

## [0.4.2]
[0.4.2]: https://github.com/Evpok/latex-autocomplete/compare/v0.4.1...v0.4.2
* Added an automated build on travis

## [0.4.1]
[0.4.1]: https://github.com/Evpok/latex-autocomplete/compare/v0.4.0...v0.4.1
* Updated changelog
* Removed dev clutter from `package.json`

## [0.4.0]
[0.4.0]: https://github.com/Evpok/latex-autocomplete/compare/v0.1.0...v0.4.0
* Added proper specs
* Ensure there is one and only one `Completer` hooked to each LaTeX file

## [0.1.0] - First Release
[0.1.0]: https://github.com/Evpok/latex-autocomplete/compare/v1.0.0...v0.1.0
* Every feature added
* Every bug fixed
