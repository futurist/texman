
/**
 * Helper functions
 */
export var MIN_WIDTH = 2;
export var GRID_SIZE = 5;

export var POINT_WIDTH = 10;
export var POINT_HEIGHT = 10;
export var BORDER_WIDTH = 1;

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
        var props = arguments[i];
        for(var prop in props) {
            if( props.hasOwnProperty(prop) ) {
                obj[prop] = clone(props[prop]);
            }
        }
    }
    return obj;
}
export function _extend(obj) {
    obj = obj || {};
    if(arguments.length<2) return obj;
    for(var i=1; i<arguments.length; i++){
        var props = arguments[i];
        for(var prop in props) {
            if( props.hasOwnProperty(prop) ) {
                obj[prop] = (props[prop]);
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
	var pxArray = ['width', 'height', 'left', 'top']
	for(var i in styleObj){
		var attr = pxArray.indexOf(i)>-1 ? styleObj[i]+ 'px': styleObj[i] ;
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

