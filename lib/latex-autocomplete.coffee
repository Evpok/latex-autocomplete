LatexAutocompleteView = require './latex-autocomplete-view'
{CompositeDisposable} = require 'atom'

module.exports = LatexAutocomplete =
  latexAutocompleteView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    atom.notifications.addInfo 'activation-hook-test activated!'
    @panel = atom.workspace.addBottomPanel {
      item: @div = document.createElement 'div'
    }
    @div.textContent = 'activation-hook-test is active!'

  deactivate: ->
    atom.notifications.addInfo 'activation-hook-test deactivated!'
    @panel.destroy()

  serialize: ->
    latexAutocompleteViewState: @latexAutocompleteView.serialize()

  toggle: ->
    console.log 'LatexAutocomplete was toggled!'

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()
