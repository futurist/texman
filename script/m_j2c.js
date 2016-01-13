import j2c from './j2c.es6'
import util from 'util_extend_exclude'
import m from 'mithril'

var DEFAULT_NS = 'global_j2c'
var namespace = DEFAULT_NS
var j2cGlobal = {}
var domClassMap = []

j2cGlobal[DEFAULT_NS] = {};

var isBrowser = typeof document==='object' && document && document instanceof Node;

function findDom(dom) {
	for(var i=0, n=domClassMap.length; i<n; i++ ){
		if(domClassMap[i].dom === dom) return i
	}
	return -1
}

// check if the given object is HTML element
function isElement(o){return (typeof HTMLElement == "object" ? o instanceof HTMLElement :o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"); }
function isComponent(o){return typeof o=='object'&&o&&typeof o.view=='function' }
function stylize(element, sheet){
	if(!isBrowser) return;
    element.type = 'text/css';
    if (element.styleSheet){
    	element.styleSheet.cssText = sheet;
    } else {
    	// empty all style when re-apply new style
    	while(element.firstChild) element.removeChild(element.firstChild);
    	element.appendChild(document.createTextNode(sheet));
    }
    return element;
}

function addStyleToHead(styleObj) {
	if(!isBrowser) return;
	if(!styleObj.dom){
		var el = document.createElement('style')
		document.head.appendChild(el)
		styleObj.dom = el
	}
	styleObj.dom.setAttribute('data-ns', namespace + '_' + styleObj.version)
	stylize(styleObj.dom, styleObj.sheet)
}

function intervdom (sheet, vdom){
	if(!vdom)return vdom;
	// if it's a mithril compoent return; TODO: change m.component's vdom
	if(isComponent(vdom)){
		return vdom
	}
	if(vdom.attrs&&vdom.attrs.className){
		vdom.attrs.className = vdom.attrs.className.split(/\s+/).map(function(c){
			var g = c.match(/global\((.*)\)/);
			if(g) return g.pop();
			if(sheet[c]) return sheet[c];
			return c
		}).join(' ')
	}
	if( {}.toString.call(vdom.children) ==="[object Array]" ) vdom.children.forEach(function(v){ applyStyle(sheet, v)  } )
	return vdom
}
function applyStyle (sheet, vdom){
	if( {}.toString.call(vdom)==="[object Array]" ) return vdom.map( function(v){ return applyStyle(sheet, v) } );
	return [intervdom(sheet, vdom)]
}

function removeDom (styleObj) {
	if(!isBrowser) return;
	var dom = styleObj.dom;
	dom && dom.parentNode && dom.parentNode.removeChild(dom);
	delete styleObj.dom
}

function m_j2c(ns, name, vdom) {
	var args = arguments;
	// usage: m_j2c() will return all j2cStore
	if(args.length===0) return j2cGlobal;
	if(args.length===1) name=ns, ns=namespace;
	if(typeof args[1]=='object') vdom=name, name=ns, ns=namespace;
	ns=ns||DEFAULT_NS

	if(!name) return j2cGlobal[ns];
	else if(!vdom) return j2cGlobal[ns]&&j2cGlobal[ns][name];

	if( isElement(name)||isElement(vdom) ) return m_j2c.applyClass.call(this, vdom||name, ns, name);
	var j2cStore = j2cGlobal[ns]
	var styleObj = j2cStore[name]
	// usage: m_j2c('name') will return all j2cStore['name']
	if(!vdom) return styleObj;
	// usage: m_j2c('name', mithril_v_dom) will add style to vdom and create <style> for it, cache style_dom
	if( !styleObj || !styleObj.sheet ) return applyStyle({}, vdom);
	if(isComponent(vdom)){
		return vdom
	}
	var sheet = styleObj.sheet;
	var styleDom = m('style', {
		config:function(el, old, context, vdom){
			context.retain = true;
			if(!old) {
                stylize(el, sheet);
                styleObj.dom = el;
            }
		}
	});
	styleDom.attrs[ 'data-'+ namespace + '_' + name+'_'+styleObj.version ] = true;
	// here we can insert into header instead of vdom
	// styleDom = null; addStyleToHead(styleObj)

	// Known Issue: the dom will always re-created when pass to mithril, so we set below to skip next redraw()
	// m.redraw.strategy('none')
	return [ styleDom, applyStyle(sheet, vdom) ]
}
m_j2c.DEFAULT_NS = DEFAULT_NS;
m_j2c.j2c = j2c;
m_j2c.m = m;
m_j2c.removeNS = function( ns ){
	// DEFAULT_NS cannot be removed
	if(!ns||ns===DEFAULT_NS) return;
	if(ns===namespace){
		var j2cStore = j2cGlobal[ns]
		for(var i in j2cStore){
			removeDom( j2cStore[i] )
		}
		m_j2c.applyClass(null,null,false)
		namespace = DEFAULT_NS
		m.redraw()
	}
	delete j2cGlobal[ns]
	return m_j2c
}
m_j2c.getNS = function( ns ){
	return ns ? j2cGlobal[ns] : namespace
}
m_j2c.setNS = function( ns ){
	var j2cStore = j2cGlobal[namespace]
	ns = ns||DEFAULT_NS
	namespace = ns;
	for(var i in j2cStore){
		removeDom( j2cStore[i] )
	}
	m_j2c.applyClass(null,null,false)

	if(!j2cGlobal[namespace]) j2cGlobal[namespace] = j2cStore = {} ;
	else j2cStore = j2cGlobal[namespace];
	for(i in j2cStore){
		m_j2c.add( i, j2cStore[i].cssObj )
	}
	m.redraw()

	return m_j2c
}
m_j2c.get = m_j2c;
m_j2c.add = function( ns, name, cssObj ) {
	var args = arguments;
	if(args.length===0) return j2cGlobal[namespace];
	if(args.length===1) name=ns, ns=namespace;
	if(typeof args[1]=='object') cssObj=name, name=ns, ns=namespace;
	ns=ns||DEFAULT_NS

	if(!name)return j2cGlobal[ns];
	else if(!cssObj)return j2cGlobal[ns]&&j2cGlobal[ns][name];
	
	var j2cStore = j2cGlobal[ns]
	if(!j2cStore) j2cGlobal[ns]={}
	var styleObj
	var isHead = name.indexOf('<head')===0;
	if(!j2cStore[name]){
		styleObj = j2cStore[name] = { cssObj:cssObj, version:0, sheet:j2c.sheet(cssObj) };
	} else {
		styleObj = j2cStore[name]
		util._extend( styleObj.cssObj, cssObj )
		styleObj.sheet = j2c.sheet(styleObj.cssObj);
		styleObj.version++
	}
	if( isHead ) addStyleToHead(styleObj)
	else if( styleObj.dom ) m.redraw();

	return j2cStore[name];
}
m_j2c.remove = function(ns, name, cssObj) {
	var args = arguments;
	if(args.length===0) return j2cGlobal[namespace];
	if(args.length===1) name=ns, ns=namespace;
	if(typeof args[1]=='object') cssObj=name, name=ns, ns=namespace;
	ns=ns||DEFAULT_NS

	if(!name)return j2cGlobal[ns];
	else if(!cssObj)return j2cGlobal[ns]&&j2cGlobal[ns][name];

	var j2cStore = j2cGlobal[ns]
	if(!j2cStore) return;

	var isHead = name.indexOf('<head')===0;
	var styleObj = j2cStore[name];
	if(!cssObj){
		delete j2cStore[name]
	}else{
		util._exclude(styleObj.cssObj, cssObj, null);
		styleObj.sheet = j2c.sheet(styleObj.cssObj);
		styleObj.version++
	}
	if( isHead ) {
		cssObj
		? addStyleToHead(styleObj)
		: removeDom( styleObj )
	}
	else if( styleObj.dom ) m.redraw();

	return styleObj
}
m_j2c.getClass = function (ns, name) {
	var args = arguments
	if(args.length===0) return j2cGlobal[namespace];
	if(args.length===1) name=ns, ns=namespace
	ns=ns||DEFAULT_NS
	var sheet, list = {}, store= j2cGlobal[ns]
	if(!store) return;
	name = name||/./
	for(var i in store){
		// tutpoint: string.match(undefined) ?
		if( (sheet=store[i].sheet) && ( {}.toString.call(name)=="[object RegExp]" ? i.match(name) : i==name ) ){
			for(var key in sheet){ if(sheet.hasOwnProperty(key)&& !key.match(/^\d/) ) list[key]=sheet[key] }
		}
	}
	return list;
}
m_j2c.getClassMap = function () {
	return domClassMap
}
m_j2c.applyClass = function (ns, name, target, isAdd){
	if(! isBrowser) return;
	var args = arguments;
	if(args.length===0) return m_j2c.getClass.apply(this, args);
	if(args.length===1) name=ns, ns=namespace;
	if(typeof args[1]=='object') isAdd=target, target=name, name=ns, ns=namespace;
	ns=ns||DEFAULT_NS

	var list = m_j2c.getClass(name)
	if(!list) return;
	var _addClassToDom = function(dom){
		var pos, c = dom.className&&dom.className.split(/\s+/)
	    if(c) dom.className = c.map(function(v){
	    	if( isAdd===false ) {
	    		if((pos=findDom(dom))!==-1){
		    		var old = domClassMap[pos].original
		    		domClassMap.splice(pos,1)
		    		return old
	    		}else{
	    			return v
	    		}
	    	}else{
		    	var j2cClass = list[v]
		    	if(j2cClass) domClassMap.push( { dom:dom, original:v } );
		    	return j2cClass||v
	    	}
	    }).join(' ')
	}
	if( !isElement(target) ) target=document.body;
	_addClassToDom(target)
	var items = target.getElementsByTagName("*")
	for (var i = items.length; i--;) {
	    _addClassToDom(items[i])
	}
}

export default m_j2c

// exports = module.exports = m_j2c;

// Usage:
// m_j2c.add( '<head abc>', {' body':{font_size:'10px', }} )
// m_j2c.add( '<head def>', {' body':{color:'red', ' .text':{color:'blue'} }  } )

// m_j2c('body_style', m('.list') )
//

