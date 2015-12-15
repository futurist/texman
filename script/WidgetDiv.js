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

  getChildren(){
    var data = this.jsonData();
    var isRadio = data.type=='radio';
    var isCheckbox = data.type=='checkbox';
    var isSelect = data.type=='select';

    Global.applyStyle( data.children.attrs, Global._pluck(data.style, ['fontFamily', 'fontSize']) );

    if( isSelect ) {
        var options = data.children.children.map(function(v){ return m('option', v) });
        if( data.children.attrs.placeholder ) options.unshift( m('option', {disabled:true, value:''}, data.children.attrs.placeholder ) );
        var dom = Global._extend( {}, data.children )
        dom.children = options
        return dom;
    } else if( isCheckbox ) {

    } else if( isRadio ) {

    } else {
      return data.children;
    }


  }

	controller (){
		this.onunload = function(){

		}
	}

	view (ctrl) {
    var self = this;
    var Prop = Global.applyProp(this.Prop)
    var dom = m('div.layer', Prop, [
        m('.content', {key:Global.NewID(), config: function(el,isInit,context){context.retain=false} }, this.getChildren() ),
        m('.bbox', {config: function(el,isInit,context){context.retain=true} } ),
        this.buildControlPoint()
      ] )
		return this.isValidRect()
		? dom
		: []
	}
}
