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
    var schema = this.jsonSchema();
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
      data.children.attrs.order = parseInt(data.attrs.order)||0
      data.children.attrs.title = data.attrs.title||''
      data.children.attrs.description = data.attrs.description||''
      data.children.attrs.table = data.attrs.table||''
      data.children.attrs.tkey = data.attrs.tkey||''
      data.children.meta = data.children.meta||{}
      data.children.meta.version = data.children.meta.version||0
      // var oldKeyPressFunc = data.children.attrs.onkeypress;
      // data.children.attrs.onkeypress = function(){ Global.mSkipRedraw(); if(typeof oldKeyPressFunc=='function') oldKeyPressFunc.apply(this, arguments); }
      if(data.attrs.table){
        if(isInput){
          data.children.attrs.readOnly = false;
          data.children.attrs.onfocus = function(){
          }
        }
      }
      if(isTextarea){
        data.children.attrs.oninput = function(){ data.children.meta.version++; data.children.children = ( $(this).val() ) }
      }else{
        data.children.attrs.oninput = function(){ data.children.meta.version++; data.children.attrs.value = ( $(this).val() ) }
      }
      data.children.attrs.config = function(el,old,context){ context.retain = true; }
      Global.applyStyle( data.children.attrs, Global._pluck(data.style, ['fontFamily', 'fontSize', 'color', 'textAlign', 'fontStyle', 'fontWeight']) );
      Global.applyStyle( contentProp, Global._pluck(data.style, ['alignItems', 'justifyContent']) );
    }

    if( isSelect ) {
        data.children.attrs['name'] = name;
        let defaultVal = data.children.attrs.value
        let isMultiple = data.children.attrs.multiple
        if(isMultiple) data.children.attrs.title ='按CTRL键点击可多选\n'+ (data.children.attrs.title||'')
        data.children.children = typeof data.children.children!='object'?[ data.children.children ]:data.children.children
        var options = data.children.children.map(function(v){
          let checked = defaultVal.split('||').indexOf(v)>-1?'[selected]':'';
          let value =v, text=v
          if(typeof v=='object'&&v)value=v.value, text=v.text
          return m('option'+checked, {value:value}, text)
        });
        if( data.children.attrs.placeholder && !isMultiple ) options.unshift( m('option', { value:''}, data.children.attrs.placeholder ) );
        dom = Global._extend( {}, data.children )
        dom.children = options
    } else if( isCheckbox ) {
        let defaultVal = data.children.attrs.value
        data.children.children = typeof data.children.children!='object'?[ data.children.children ]:data.children.children
        var options = data.children.children.map(function(v){
          let checked = defaultVal.split('||').indexOf(v)>-1?'[checked]':'';
          let value =v, text=v
          if(typeof v=='object'&&v)value=v.value, text=v.text
          return m('label', [ m(`input.checkbox[type=checkbox][value=${value}][name=${name}]${checked}`), text ] );
        });
        dom = Global._extend( {}, data.children )
        dom.children = options
    } else if( isRadio ) {
        let defaultVal = data.children.attrs.value
        data.children.children = typeof data.children.children!='object'?[ data.children.children ]:data.children.children
        var options = data.children.children.map(function(v){
          let checked = v==defaultVal?'[checked]':'';
          let value =v, text=v
          if(typeof v=='object'&&v)value=v.value, text=v.text
          return m('label', [ m(`input.radio[type=radio][value=${value}][name=${name}]${checked}`), text ] );
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
