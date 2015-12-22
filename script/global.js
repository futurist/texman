
/**
 * Polyfill functions
 */
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}


/**
 * Helper functions
 */

// html {
//   box-sizing: border-box;
// }
// *, *:before, *:after {
//   box-sizing: inherit;
// }
// add above css code in HTML page to enable BORDER_BOX mode
export var BORDER_BOX = window.getComputedStyle(document.body).boxSizing==="border-box";
export var MIN_WIDTH = 2;
export var GRID_SIZE = 5;
export var POINT_WIDTH = 10;
export var POINT_HEIGHT = 10;

export var SELECTED_CLASSNAME = 'selected';
export var EDITING_CLASSNAME = 'editing';

export var isAndroid = /(android)/i.test(navigator.userAgent);
export var isWeiXin = navigator.userAgent.match(/MicroMessenger\/([\d.]+)/i);
export var isiOS = /iPhone/i.test(navigator.userAgent) || /iPod/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent);
export var isMobile = isAndroid||isWeiXin||isiOS;

// whether it's touch screen
export var isTouch = ('ontouchstart' in window) || ('DocumentTouch' in window && document instanceof DocumentTouch);

// touch event uniform to touchscreen & PC
export var downE = isMobile? 'touchstart' :'mousedown';
export var moveE = isMobile? 'touchmove' :'mousemove';
export var upE = isMobile? 'touchend' :'mouseup';
export var leaveE = isMobile? 'touchcancel' :'mouseleave';
export var clickE = isMobile? 'touchstart' :'click';

// http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric?rq=1
export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function clone(item) {
    if (!item) { return item; } // null, undefined values check

    var types = [ Number, String, Boolean ],
        result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function(type) {
        if (item instanceof type) {
            result = type( item );
        }
    });

    if (typeof result == "undefined") {
        if (Object.prototype.toString.call( item ) === "[object Array]") {
            result = [];
            item.forEach(function(child, index, array) {
                result[index] = clone( child );
            });
        } else if (typeof item == "object") {
            // testing that this is DOM
            if (item.nodeType && typeof item.cloneNode == "function") {
                var result = item.cloneNode( true );
            } else if (!item.prototype) { // check that this is a literal
                if (item instanceof Date) {
                    result = new Date(item);
                } else {
                    // it is an object literal
                    result = {};
                    for (var i in item) {
                        result[i] = clone( item[i] );
                    }
                }
            } else {
                // depending what you would like here,
                // just keep the reference, or create new object
                if (item.constructor) {
                    result = new item.constructor();
                } else {
                    result = item;
                }
            }
        } else {
            result = item;
        }
    }
    return result;
}

/**
 * COPY First Layer, and Reference sub child
 * @param  {obj:obj}, ...args
 * @return {obj}
 */
export function _deepCopy(obj) {
    obj = obj || {};
    if(arguments.length<2) return obj;
    for(var i=1; i<arguments.length; i++){
        var dest = arguments[i];
        for(var prop in dest) {
            if( dest.hasOwnProperty(prop) ) {
                var type = Object.prototype.toString.call( dest[prop] );
                if( type==='[object Object]' ){
                    obj[prop]= obj[prop] || {}
                    _deepCopy(obj[prop], dest[prop]);
                } else if( type==='[object Array]' ){
                    obj[prop]= obj[prop] || []
                    _deepCopy(obj[prop], dest[prop]);
                } else {
                    obj[prop] = clone(dest[prop]);
                }
            }
        }
    }
    return obj;
}

export function _extend(obj) {
    obj = obj || {};
    if(arguments.length<2) return obj;
    for(var i=1; i<arguments.length; i++){
        var dest = arguments[i];
        for(var prop in dest) {
            if( dest.hasOwnProperty(prop) ) {
                var type = Object.prototype.toString.call( dest[prop] );
                if( type==='[object Object]' ){
                    obj[prop]= obj[prop] || {}
                    _extend(obj[prop], dest[prop]);
                } else if( type==='[object Array]' ){
                    obj[prop]= obj[prop] || []
                    _extend(obj[prop], dest[prop]);
                } else {
                    obj[prop] = (dest[prop]);
                }
            }
        }
    }
    return obj;
}

export function _iterate(obj, condition, valueCallback){
	var list = {};
	for(var name in obj)
	{
	    if (obj.hasOwnProperty(name) && condition?condition(name):true )
	    {
	       list[name] = valueCallback?valueCallback(obj[name]):obj[name];
	    }
	}
	return list;
}
export function _pluck(obj, propArr){
	if(!propArr||propArr.constructor!=Array) return obj;
	return _iterate(obj, function(name) { return propArr.indexOf(name)>=0 });
}
export function _exclude(obj, propArr){
	if(!propArr||propArr.constructor!=Array) return obj;
	return _iterate(obj, function(name) { return propArr.indexOf(name)<0 });
}
export function _addToSet(){
	var i, isFirst, args = Array.prototype.slice.call(arguments, 0);
	if(typeof args[0]=='boolean') isFirst = args.shift();
	var arr = args.shift();
	if(arr===null || typeof arr!=='object') arr = [];
	for(i in args) {
		if( arr.indexOf( args[i] )<0 ){
			isFirst?arr.unshift(args[i]):arr.push(args[i])
		}
	}
	return arr
}

export function objectPath(obj, is, value) {
    if (typeof is == 'string')
        return objectPath(obj,is.split('.'), value);
    else if (is.length==1 && value!==undefined)
        return obj[is[0]] = value;
    else if (is.length==0)
        return obj;
    else
        return objectPath(obj[is[0]],is.slice(1), value);
}

export var addToObject = function addToObject( obj, key, value ){
    if(Object.prototype.toString.call(obj)=="[object Array]"){
        if( obj.indexOf(key)<0 ) obj.push(key)
    }else{
        if( !(key in obj) ){
            obj[key] = value;
        }
    }
}

export function removeClass(classProp, class1, class2, etc) {
	var list =classProp.split(/\s+/)
	var args = Array.prototype.slice.call(arguments, 1);
	return list.filter(function(v){ return args.indexOf(v)==-1 }).join(' ')
}

export function addClass(classProp, class1, class2, etc) {
	var args = Array.prototype.slice.call(arguments, 0);
	args[0] = args[0].split(/\s+/)
	_addToSet.apply(null, args)
	return args[0].join(' ')
}

export function RandomColor(){
	return '#'+Math.random().toString(16).slice(-6);
}

export function NewID(){
    return +new Date() + "_" + (Math.round(Math.random() * 1e6)).toString(36)
}

export function applyStyle(el, styleObj){
    var pxReg = /^padding|^margin|size$|width$|height$|radius$|left$|top$|right$|bottom$/i
	var quoteReg = /family$/i
    // try{ el.style = el.style||{} } catch(e){}
	for(var i in styleObj){
        var attr = styleObj[i];
        attr = pxReg.test(i) ? attr + 'px': attr ;
		attr = quoteReg.test(i) ? '"'+ attr + '"': attr ;
		el.style[i] = attr;
	}
}
export var rectsIntersect = function (r1, r2) {
  return r2.left <= (r1.left + r1.width) &&
    (r2.left + r2.width) >= r1.left &&
    r2.top <= (r1.top + r1.height) &&
    (r2.top + r2.height) >= r1.top;
};

export var debug = function( msg ){
    document.querySelector('#debug').innerHTML = msg
}


export var _excludeJsonStyle = function( propStyle ){
    return _exclude( propStyle, ['borderWidth','borderStyle', 'borderColor', 'backgroundColor', 'padding'] )
}
/**
 * applyProp from this.Prop, remove unused props, and apply style to int width/height etc.
 * @param  {[type]} thisProp [description]
 * @return {[type]}          [description]
 */
export var applyProp = function( thisProp ){
	var Prop = _exclude( thisProp, ['eventData','isNew'] )
    Prop.style = clone(thisProp.style)
    if(thisProp.style.borderWidth && thisProp.style.borderStyle && thisProp.style.borderColor){
        Prop.style.border = thisProp.style.borderWidth+'px '+thisProp.style.borderStyle+' '+thisProp.style.borderColor
    }
    applyStyle( Prop, thisProp.style )
    Prop.style = _excludeJsonStyle( Prop.style )
    if(Prop.class) Prop.class = Prop.class.replace(/\s+/, ' ').trim()
    if(Prop.className) Prop.className = Prop.className.replace(/\s+/, ' ').trim()
    return Prop
}

/**
 * get outer rect of div/container that had a border style
 * @param  {[type]} style [description]
 * @return {[type]}       [description]
 */
export var getOuterRect = function( style ){
    return {
        left: style.left ,
        top: style.top ,
        width: BORDER_BOX? style.width: style.width + (style.borderLeftWidth||0) + (style.borderRightWidth||0),
        height: BORDER_BOX? style.height: style.height + (style.borderTopWidth||0) + (style.borderBottomWidth||0),
    }
}

/**
 * curTool for canvas & layer to determine type
 * @type {String}
 */
export var curTool = 'stage'

