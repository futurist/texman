import m from 'mithril'
import * as Global from './global'
import LayerBaseClass from './LayerBaseClass'

export default class WidgetDiv extends LayerBaseClass {

	constructor(parent, prop) {
		super(parent, prop);
		this.parent = parent;
	}
  onRectChange(){
    super.onRectChange()
  }
  onSelected(){
    super.onSelected()
  }
  onUnSelected () {
    m.mount(document.querySelector('.editor'), null)
    super.onUnSelected()
  }
	controller (){
		this.onunload = function(){

		}
	}

	view (ctrl) {
    var self = this;
    var Prop = Global.applyProp(this.Prop)
    var dom = m('div.layer', Prop, [
        m('.content', {config: function(el,isInit,context){context.retain=true} } ),
        m('.bbox', {config: function(el,isInit,context){context.retain=true} } ),
        this.buildControlPoint()
      ] )
		return this.isValidRect()
		? dom
		: []
	}
}
