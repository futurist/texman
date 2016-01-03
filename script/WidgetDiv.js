import m from 'mithril'
import * as Global from './global'
import LayerBaseClass from './LayerBaseClass'

export default class WidgetDiv extends LayerBaseClass {

	constructor(parent, prop, options) {
		super(parent, prop, options);
		this.parent = parent;
    this.key = m.prop( Global.NewID() );
	}
  onRectChange(){
    super.onRectChange()
  }
  onSelected(){
    super.onSelected()
  }
  onUnSelected () {
    var editorDom = document.querySelector('.editor');
    if(editorDom) m.mount(editorDom, null)
    super.onUnSelected()
  }

  getChildren(){
    var self = this;
    var data = this.jsonData();
    var isRadio = data.type=='radio';
    var isCheckbox = data.type=='checkbox';
    var isSelect = data.type=='select';
    var dom, contentProp={ style:{} }

    if(typeof data.children=='object'){
      data.children.attrs = data.children.attrs || {}
      data.children.attrs.style = data.children.attrs.style||{}
      Global.applyStyle( data.children.attrs, Global._pluck(data.style, ['fontFamily', 'fontSize', 'color', 'textAlign', 'fontStyle', 'fontWeight']) );
      Global.applyStyle( contentProp, Global._pluck(data.style, ['alignItems', 'justifyContent']) );
    }

    if( isSelect ) {
        var options = data.children.children.map(function(v){ return m('option', v) });
        if( data.children.attrs.placeholder ) options.unshift( m('option', {disabled:true, value:''}, data.children.attrs.placeholder ) );
        dom = Global._extend( {}, data.children )
        dom.children = options
    } else if( isCheckbox ) {
        var options = data.children.children.map(function(v){
          let checked = v==data.children.attrs.value?'[checked]':'';
          return m('label', [ v, m(`input.checkbox[type=checkbox]${checked}`, v) ] );
        });
        dom = Global._extend( {}, data.children )
        dom.children = options
    } else if( isRadio ) {
        var options = data.children.children.map(function(v){
          let checked = v==data.children.attrs.value?'[checked]':'';
          return m('label', [ v, m(`input.radio[type=radio]${checked}`, v) ] );
        });
        dom = Global._extend( {}, data.children )
        dom.children = options
    } else {
      dom = Global._extend( {}, data.children )
      dom.children = dom.html? m.trust(dom.children) : dom.children;
    }

    return m('.content', Global._extend( { config: function(el,isInit,context){context.retain=false} }, contentProp ), [dom] );

  }

	controller (){
		this.onunload = function(){

		}
	}

	view (ctrl) {
    var self = this;
    var Prop = Global.applyProp(this.Prop)
    var dom = m('div.layer', Global._extend({}, Prop, { key: self.key(), 'data-key': self.key()} ), [
        this.getChildren(),
        m('.bbox', {config: function(el,isInit,context){context.retain=true} } ),
        this.buildControlPoint()
      ] )
		return this.isValidRect()
		? dom
		: []
	}

  getView(){
    return this.view( new this.controller() );
  }

}
