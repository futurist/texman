import m from 'mithril'
import * as Global from './global'
import LayerBaseClass from './LayerBaseClass'

export default class WidgetDiv extends LayerBaseClass {

	constructor(parent, prop, options) {
		super(parent, prop, options);

    this.options = options = Global._extend({
      tool:Global.curTool,
      mode:'edit'
    }, options)

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
    var isInput = data.type=='inputText';
    var isRadio = data.type=='radio';
    var isCheckbox = data.type=='checkbox';
    var isSelect = data.type=='select';
    var isTextarea = data.type=='textarea';
    var dom, contentProp={ style:{} }
    var name = data.attrs.name;

    if(typeof data.children=='object'){
      data.children.attrs = data.children.attrs || {}
      data.children.attrs.style = data.children.attrs.style||{}
      data.children.attrs.title = data.attrs.title||''
      data.children.attrs.table = data.attrs.table||''
      data.children.attrs.tkey = data.attrs.tkey||''
      // var oldKeyPressFunc = data.children.attrs.onkeypress;
      // data.children.attrs.onkeypress = function(){ Global.mSkipRedraw(); if(typeof oldKeyPressFunc=='function') oldKeyPressFunc.apply(this, arguments); }
      if(data.attrs.table){
        if(isInput){
          data.children.attrs.readOnly = false;
          data.children.attrs.onfocus = function(){
            console.log(data.type, data.children.attrs.table, data.children.attrs.tkey)
          }
        }
      }else if(isTextarea){
        data.children.attrs.oninput = function(){ data.children.children = ( $(this).val() ) }
      }else{
        data.children.attrs.oninput = function(){ data.children.attrs.value = ( $(this).val() ) }
      }
      data.children.attrs.config = function(el,old,context){ context.retain = true; }
      Global.applyStyle( data.children.attrs, Global._pluck(data.style, ['fontFamily', 'fontSize', 'color', 'textAlign', 'fontStyle', 'fontWeight']) );
      Global.applyStyle( contentProp, Global._pluck(data.style, ['alignItems', 'justifyContent']) );
    }

    if( isSelect ) {
        data.children.attrs['name'] = name;
        var options = data.children.children.map(function(v){ return m('option', v) });
        if( data.children.attrs.placeholder ) options.unshift( m('option', {disabled:true, value:''}, data.children.attrs.placeholder ) );
        dom = Global._extend( {}, data.children )
        dom.children = options
    } else if( isCheckbox ) {
        var options = data.children.children.map(function(v){
          let checked = v==data.children.attrs.value?'[checked]':'';
          return m('label', [ v, m(`input.checkbox[type=checkbox][value=${v}][name=${name}]${checked}`, v) ] );
        });
        dom = Global._extend( {}, data.children )
        dom.children = options
    } else if( isRadio ) {
        var options = data.children.children.map(function(v){
          let checked = v==data.children.attrs.value?'[checked]':'';
          return m('label', [ v, m(`input.radio[type=radio][value=${v}][name=${name}]${checked}`, v) ] );
        });
        dom = Global._extend( {}, data.children )
        dom.children = options
    } else {
      data.children.attrs['name'] = name;
      dom = Global._extend( {}, data.children )
      dom.children = dom.html? m.trust(dom.children) : dom.children;
    }
    return m('.content', Global._extend( { key:'key_'+name, config: function(el,isInit,context){context.retain=true} }, contentProp ), [dom] );

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

        // if not edit mode, do nothing
        self.options.mode=='edit'
          ? [m('.bbox', {config: function(el,isInit,context){context.retain=true} } ),this.buildControlPoint()]
          : []

      ] )
		return this.isValidRect()
		? dom
		: []
	}

  getView(){
    return this.view( new this.controller() );
  }

}
