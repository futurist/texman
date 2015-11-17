class ClickCounter
  constructor: ->
    @value = 0

class Parent
  constructor: (counter) ->
    @counter=counter
    @childA = new ChildA(@counter)
    @childB = new ChildB(@counter)
  view: => [
    @childA.view()
    @childB.view()
  ]

class ChildA
  constructor: (counter) -> @counter=counter
  click: => @counter.value++
  view: => m('button', { onclick: @click }, "Click me")

class ChildB
  constructor: (@counter) ->
  view: => m 'div', "Button clicked " + @counter.value + ' times'

# Create the Parent with a model
m.mount document.body, new Parent(new ClickCounter )

