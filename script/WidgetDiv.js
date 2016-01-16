import m from 'mithril'
import * as Global from './global'
import LayerBaseClass from './LayerBaseClass'

export default class WidgetDiv extends LayerBaseClass {

	constructor(parent, prop, options) {
		super(parent, prop, options);

    this.options = options = Global._extend({
      tool:Global.curTool,
      mode:'edit' //'edit', 'present'
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

  getChildren(ctrl){
    var self = this;
    var data = this.jsonData();
    var schema = this.jsonSchema();
    if(!data.children) return []
    var editMode = !!this.options.rowData
    var rowData = this.options.rowData||{};
    var isInput = data.type=='inputText';
    var isRadio = data.type=='radio';
    var isCheckbox = data.type=='checkbox';
    var isSelect = data.type=='select';
    var isTextarea = data.type=='textarea';
    var dom, contentProp={ style:{} }
    var name = data.attrs.name;
    data.children.attrs = data.children.attrs || {}
    let isMultiple = isCheckbox || data.children.attrs.multiple

    var getValue = function(){
      if(editMode) return rowData[name]||'';
      else{
	      var str =  (isTextarea)? data.children.children: data.children.attrs.value
      	  return str
      }
    }
    var setValue = function(val){
		var str = val
    	if(editMode){
	    	if(isMultiple && val.constructor==String) str=val.split('||');
    		rowData[name]=str;
    	}else{
	    	if(isMultiple && val.constructor==Array) str=val.join('||');
    		(isTextarea)? data.children.children=str: data.children.attrs.value=str
    	}
    }
    var setInputValue=function(){
    	data.children.meta.version++;
    	var val = (isCheckbox)
    		? [].slice.apply(document.querySelectorAll('[name="'+name+'"]:checked')).map(v=>v.value) 
    		: $('[name="'+name+'"]').val()
    	setValue( val );
    	return val
    }
    if(!editMode) setValue(  (isTextarea)? data.children.children: data.children.attrs.value  )

    if(typeof data.children=='object'){
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
      if(!isCheckbox && !isRadio) {
	      data.children.attrs.oninput = setInputValue
      }
      data.children.attrs.config = function(el,old,context){ context.retain = true; }
      Global.applyStyle( data.children.attrs, Global._pluck(data.style, ['fontFamily', 'fontSize', 'color', 'textAlign', 'fontStyle', 'fontWeight']) );
      Global.applyStyle( contentProp, Global._pluck(data.style, ['alignItems', 'justifyContent']) );
    }

    if( isSelect ) {
        data.children.attrs['name'] = name;
        let title = (data.children.attrs.title||'')
        let defaultVal = getValue()||''
        if(isMultiple && typeof defaultVal=='string') defaultVal = defaultVal.split('||');
        if(isMultiple) title ='按CTRL键点击可多选\n'+ title
        data.children.children = {}.toString.call(data.children.children)!=="[object Array]"?[ data.children.children ]:data.children.children
        var options = data.children.children.map(function(v){
          let value =v, text=v
          if(typeof v=='object'&&v)value=v.value, text=v.text
          let checked = (isMultiple?defaultVal.indexOf(value)>-1:defaultVal==value)?'[selected]':'';
          return m('option'+checked, {value:value}, text)
        });
        if( data.children.attrs.placeholder && !isMultiple ) options.unshift( m('option', { value:''}, data.children.attrs.placeholder ) );
        dom = Global._extend( {config: Global._retain}, data.children )
        dom.attrs.title = title
        dom.children = options
    } else if( isCheckbox ) {
        let defaultVal = getValue()||''
        if(typeof defaultVal=='string') defaultVal = defaultVal.split('||');
        data.children.children = {}.toString.call(data.children.children)!=="[object Array]"?[ data.children.children ]:data.children.children
        var options = data.children.children.map(function(v, idx){
          let checked = defaultVal.indexOf(v)>-1?'[checked]':'';
          let value =v, text=v
          if(typeof v=='object'&&v)value=v.value, text=v.text
          return m('label', {key:idx+1, config: Global._retain }, [ m(`input.checkbox[type=checkbox][value=${value}][name=${name}]${checked}`, { onchange:setInputValue } ), text ] );
        });
        dom = Global._extend( {}, data.children )
        dom.children = options
    } else if( isRadio ) {
        let defaultVal = getValue()||''
        data.children.children = {}.toString.call(data.children.children)!=="[object Array]"?[ data.children.children ]:data.children.children
        var options = data.children.children.map(function(v,idx){
          let checked = v===defaultVal;
          let value =v, text=v
          if(typeof v=='object'&&v)value=v.value, text=v.text
          return m('label', {key:idx+1, config: Global._retain }, [ m(`input.radio[type=radio][value=${value}][name=${name}]`, {
            checked: checked,
            onchange:setInputValue}), text ] );
        });
        dom = Global._extend( {}, data.children )
        dom.children = options
    } else {
      data.children.attrs['name'] = name;
      dom = Global._extend( {}, data.children )
      dom.children = dom.html? m.trust(dom.children) : dom.children;
    }
    if(isSelect||isRadio||isCheckbox||isTextarea) delete dom.attrs.value;
    else dom.attrs.value = getValue()
    return m('.content', Global._extend( { key:'key_'+name, config: Global._retain }, contentProp ), [dom] );

  }

	controller (){
    var ctrl = this
		ctrl.onunload = function(){

		}
	}

	view (ctrl) {
    var self = this;
    var Prop = Global.applyProp(this.Prop)
    var dom = m('div.layer', Global._extend({}, Prop, { key: self.key(), 'data-key': self.key()} ), [
        this.getChildren(ctrl),

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
