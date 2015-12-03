
/**
 * Helper functions
 */

var isAndroid = /(android)/i.test(navigator.userAgent);
var isWeiXin = navigator.userAgent.match(/MicroMessenger\/([\d.]+)/i);
var isiOS = /iPhone/i.test(navigator.userAgent) || /iPod/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent);
var isMobile = isAndroid||isWeiXin||isiOS;

// whether it's touch screen
var isTouch = ('ontouchstart' in window) || ('DocumentTouch' in window && document instanceof DocumentTouch);

// touch event uniform to touchscreen & PC
var downE = isMobile? 'touchstart' :'mousedown';
var moveE = isMobile? 'touchmove' :'mousemove';
var upE = isMobile? 'touchend' :'mouseup';
var leaveE = isMobile? 'touchcancel' :'mouseleave';
var clickE = isMobile? 'touchstart' :'click';

// http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric?rq=1
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function clone(item) {
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
function _deepCopy(obj) {
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
function _extend(obj) {
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

function _iterate(obj, condition, valueCallback){
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
function _pluck(obj, propArr){
	if(!propArr||propArr.constructor!=Array) return obj;
	return _iterate(obj, function(name) { return propArr.indexOf(name)>=0 });
}
function _exclude(obj, propArr){
	if(!propArr||propArr.constructor!=Array) return obj;
	return _iterate(obj, function(name) { return propArr.indexOf(name)<0 });
}
function _addToSet(){
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

function removeClass(classProp, class1, class2, etc) {
	var list =classProp.split(/\s+/)
	var args = Array.prototype.slice.call(arguments, 1);
	return list.filter(function(v){ return args.indexOf(v)==-1 }).join(' ')
}

function addClass(classProp, class1, class2, etc) {
	var args = Array.prototype.slice.call(arguments, 0);
	args[0] = args[0].split(/\s+/)
	_addToSet.apply(null, args)
	return args[0].join(' ')
}

function RandomColor(){
	return '#'+Math.random().toString(16).slice(-6);
}

function NewID(){
    return +new Date() + "_" + (Math.round(Math.random() * 1e6)).toString(36)
}

function applyStyle(el, styleObj){
	var pxArray = ['width', 'height', 'left', 'top']
	for(var i in styleObj){
		var attr = pxArray.indexOf(i)>-1 ? styleObj[i]+ 'px': styleObj[i] ;
		el.style[i] = attr;
	}
}
var rectsIntersect = function (r1, r2) {
  return r2.left <= (r1.left + r1.width) &&
    (r2.left + r2.width) >= r1.left &&
    r2.top <= (r1.top + r1.height) &&
    (r2.top + r2.height) >= r1.top;
};

var debug = function( msg ){
	document.querySelector('#debug').innerHTML = msg
}

/**
 * Main Code below
 */

var container = document.querySelector('#container');

var PropForm = {}
var curTool = 'div'
var SELECTED_CLASSNAME = 'selected';
var EDITING_CLASSNAME = 'editing';

var MIN_WIDTH = 2;

var GRID_SIZE = 5;


var ControlPoint = function(parent, prop){
	var self=this;
	var POINT_WIDTH = 10;
	var POINT_HEIGHT = 10;
	var BORDER_WIDTH = 1;

	self.parent = parent;
	self.Prop = _deepCopy( { style:{ width:10, height:10 } }, prop||{} )

	self.controller = function(){
		this.onunload = function(){

		}
	}

	self.view = function(ctrl){
		self.Prop.config = function(el){ applyStyle(el,self.Prop.style ) };
		return m('div.controlPoint', self.Prop )
	}

	self.getView = function() {
		return self.view( new self.controller() );
	}
}


var LayerBaseClass = function(parent, prop) {
	var self = this;


	self.parent = parent;
	self.getPageOffset = function getPageOffset() {
		var cur=self, parent, offset={left:self.Prop.style.left, top:self.Prop.style.top, path:[ self.Prop.key ]};
		while(parent = cur.parent) {
			offset.left+=parent.Prop.style.left;
			offset.top+=parent.Prop.style.top;
			offset.path.push(parent.Prop.key);
			cur = parent;
		}
		offset.path.reverse();
		return offset;
	}

	self.getRoot = function getRoot() {
		var cur=self, parent;
		while(parent = cur.parent){ cur = parent; }
		return cur;
	}

	self.iterateParent = function iterateParent(callback){
		var cur=self, parent;
		while( parent=cur.parent ){
			callback&&callback(parent)
			cur = parent
		}
		return cur;
	}

	self.generateID = NewID();
	self.Prop = _deepCopy( { key:self.generateID, className:'', style:{left:0, top:0, width:0, height:0, 'backgroundColor':'#eee' } }, prop||{} );
	self.Prop.config = function(el){ applyStyle(el, self.Prop.style) }
	self.Prop.onkeypress = function(e){ console.log(e)  }

	self.ControlPoints = []
	self.activeControlPoint = undefined;

	self.buildControlPoint = function(){

		var ControlPosition = function(parent, child){
			this[0] = this.LT = [-child.width/2, -child.height/2] 	//Left Top
			this[1] = this.CT = [parent.width/2 - child.width/2, -child.height/2] 	//top center
			this[2] = this.RT = [ parent.width - child.width/2, -child.height/2] 	//right top

			this[6] = this.LB = [-child.width/2, parent.height-child.height/2] 	//Left Top
			this[5] = this.CB = [parent.width/2 - child.width/2, parent.height-child.height/2] 	//top center
			this[4] = this.RB = [ parent.width - child.width/2, parent.height-child.height/2] 	//right top

			this[7] = this.LM = [-child.width/2, parent.height/2-child.height/2] 	//Left Top
			this[3] = this.RM = [parent.width - child.width/2, parent.height/2-child.height/2] 	//left center
		}
		self.ControlPoints = []

		var pointProp = { width:POINT_WIDTH, height:POINT_HEIGHT };
		var pointPosition = new ControlPosition( self.Prop.style, pointProp )
		// var positionShift = self.isSelected() ? -BORDER_WIDTH : 0;

		for(var i=0; i<8; i++){
			var point = new ControlPoint( self, {style: pointProp, position:i } )
			point.Prop.style.left = pointPosition[i][0]
			point.Prop.style.top = pointPosition[i][1]
			self.ControlPoints.push(point)
		}

		// move control point to top
		if( isNumeric(self.activeControlPoint) ) {
			var point = self.ControlPoints[self.activeControlPoint]
			point.Prop.className = 'activePoint'
			self.ControlPoints.splice( self.activeControlPoint , 1 )
			self.ControlPoints.push(point)
		}

		return self.ControlPoints.map(function(v){ return v.getView() })

	}

	self.remove = function(){
		self.parent.selectedWidget.splice( self.parent.selectedWidget.indexOf(self), 1 );
		self.parent.children.splice( self.parent.children.indexOf(self), 1 );
	}

	self.isSelected = function(){
		return self.Prop.className.indexOf(SELECTED_CLASSNAME)>=0;
	}

	self.onSelected = function(){
		self.Prop.className = addClass( self.Prop.className, SELECTED_CLASSNAME);
	}
	self.onUnSelected = function(){
		self.Prop.className = removeClass( self.Prop.className, SELECTED_CLASSNAME);
		self.activeControlPoint = undefined
	}

	self.getElementInside = function( rect ){
		if( !self.isSelected() ) return [];
		rect = _deepCopy({}, rect)
		rect.left -= self.Prop.style.left
		rect.top -= self.Prop.style.top
		return self.ControlPoints.filter(function(v){
			if( rectsIntersect( rect, v.Prop.style) ){
				return true
			}
		})
	}

	self.getView = function() {
		return self.view( new self.controller() );
	}

}

var ContainerBaseClass = function(parent, prop){

	LayerBaseClass.apply(this, arguments);

	var self =this;

	self.parent = parent;
	self.editingContainer = undefined;
	self.children = [];
	self.selectedWidget = [];

	self.resetAllEvent = function resetAllEvent(el){
		el = el||self;
		el.Prop['on'+downE] = null;
		el.Prop['on'+moveE] = null;
		el.Prop['on'+upE] = null;
		el.Prop['ondblclick'] = null;
	}
	self.resetAllEvent()

	self.resizeSelectedBy = function resizeSelectedBy( x, y ){
		var editing = self.getRoot().editingContainer;
		for(var i=0,v; v=editing.selectedWidget[i]; i++ ){
			v.Prop.style.width+=x
			v.Prop.style.height+=y
			v.Prop.style.width=Math.max(MIN_WIDTH, v.Prop.style.width)
			v.Prop.style.height=Math.max(MIN_WIDTH, v.Prop.style.height)
		}
		m.redraw()
	}

	self.moveSelectedBy = function moveSelectedBy( x, y ){
		var editing = self.getRoot().editingContainer;
		for(var i=0,v; v=editing.selectedWidget[i]; i++ ){
			v.Prop.style.left+=x
			v.Prop.style.top+=y
		}
		m.redraw()
	}

	var duplicateChild = function(src, dest){
		src.children && src.children.forEach(function(child){
			var newChild = new child.constructor( dest, {style:child.Prop.style} );
			dest.children.push( newChild )
			duplicateChild( child, newChild )
		})
	}
	
	self.duplicateSelected = function duplicateSelected( ){
		var editing = self.getRoot().editingContainer;
		var newWidget = []
		for(var i=0,v; v=editing.selectedWidget[i]; i++ ) {
			var widget = new v.constructor( v.parent, {style:v.Prop.style} )
			duplicateChild(v, widget)
			editing.children.push(widget);
			newWidget.push(widget)
			if(v.isSelected()) {
				v.onUnSelected()
				widget.onSelected()
				widget.Prop.style.left+=20
				widget.Prop.style.top+=20
			}
		}
		editing.selectedWidget = newWidget
		m.redraw()
	}
	self.removeSelectedItem = function( ){
		var editing = self.getRoot().editingContainer;
		for(var i=0,v; v=editing.selectedWidget[i]; i++ ){
			var index = editing.children.indexOf(v);
			if(index>=0) editing.children.splice( index , 1 );
			// if( v.isSelected() ) v.remove();
		}
		editing.selectedWidget = [];
		m.redraw()
	}

	self.checkSelectElement = function( rect ){
		var elArray = {}
		var pointArray = {}
		self.children.forEach(function(v,i){

			if( rectsIntersect( rect, v.Prop.style) ){
				elArray[i] = (v);
			}

			var point = v.getElementInside( rect ).pop()
			if(point){
				pointArray[i] = point;
			}

		});

		return {layer:elArray, point:pointArray, selfPoint: self.getElementInside(rect).pop() };
	}

	self.isChild = function isChild(obj) {
		return self.children.some(function(v,i){
			return v.Prop.key == obj.Prop.key
		})
	}

	self.isContainerMode = function() {
		return self.Prop.key == self.getRoot().editingContainer.Prop.key;
	}

	self.onExitEditing = function() {
		self.Prop.className = removeClass( self.Prop.className, EDITING_CLASSNAME, SELECTED_CLASSNAME);
		console.log( 'onExitEditing', self.Prop, self.selectedWidget.length )
		self.children.forEach(function(v){
			v.onUnSelected()
		})
		self.selectedWidget = []
	}

	var super_onUnSelected = self.onUnSelected;
	self.onUnSelected = function() {
		self.selectedWidget.forEach(function(v){
			v.onUnSelected()
		})
		self.selectedWidget = []
		super_onUnSelected();
	}

	/**
	 * setup Event for Canvas, only it's the current editing
	 * @return {none}
	 */

	self.mouseUpFunc = function mouseUpFunc(evt) {

		var e = /touch/.test(evt.type) ? evt.changedTouches[0] : evt;

		// self.Prop['on'+moveE] = self.Prop['on'+upE] = null;

		delete self.Prop.eventData

		if( !self.selectedWidget.length ) return;

		self.selectedWidget.forEach(function(widget) {
			if( widget.Prop.isNew && widget.Prop.style.width<Math.max(20,MIN_WIDTH*2) && 
					widget.Prop.style.height<Math.max(20,MIN_WIDTH*2)  ){
				widget.remove();
			}
			delete widget.Prop.eventData
			if( widget.Prop.isNew){
				delete widget.Prop.isNew
			}
		})

	}

	self.setupContainerEvent = function() {

		// console.log( 'setupContainerEvent', self.Prop.key , self.getRoot().editingContainer.Prop.key  )

		/**
		 * enter Container Mode, to move, resize etc.
		 */

			var PropCanvas = self.Prop;

			var checkChildMoveOut = function checkChildMoveOut(evt) {
				var e = /touch/.test(evt.type) ? evt.touches[0] : evt;
				var offsetX = e.pageX - self.getPageOffset().left
				var offsetY = e.pageY - self.getPageOffset().top

				var editingStyle = self.getRoot().editingContainer.Prop.style;

				if(offsetX<editingStyle.left||offsetY<editingStyle.top||
					offsetX>editingStyle.left+editingStyle.width||offsetY>editingStyle.top+editingStyle.height) {
					console.log('move out')
					return self.getRoot().editingContainer.mouseUpFunc(evt);
				}
			}

			// http://stackoverflow.com/questions/6593447/snapping-to-grid-in-javascript
			var snapToGrip = function snapToGrip(val){
			    var snap_candidate = GRID_SIZE * Math.round(val/GRID_SIZE);
			    if (Math.abs(val-snap_candidate) <= GRID_SIZE/2) {
			        return snap_candidate;
			    }
			    else {
			        return null;
			    }
			};

			// when mouse down
			self.Prop['on'+downE] = function(evt) {
				// check: move, resize, create only apply to current editing container
				if( !self.isContainerMode() ) {
					return;
				}
				var e = /touch/.test(evt.type) ? evt.touches[0] : evt;
				var offsetX = e.pageX - self.getPageOffset().left
				var offsetY = e.pageY - self.getPageOffset().top

				// console.log('ondown', offsetX, offsetY, self.Prop.key, self.getPageOffset().path )
				var PropLayer;

				var hitObject = self.checkSelectElement( {left:offsetX, top:offsetY, width:0,height:0} );

				offsetX = snapToGrip(offsetX)
				offsetY = snapToGrip(offsetY)

				// widget
				var widget = null;
				// controlPoint
				var point = null

				// widget index
				var index = Object.keys(hitObject.point).pop();

				if(index){
					point = hitObject.point[index];
					widget = self.children[index];
				} else {
					point = null;
					index = Object.keys(hitObject.layer).pop();
					widget = hitObject.layer[index];
				}

				if(index==undefined){
					widget = evt.shiftKey? new WidgetDiv( self, { style:{ backgroundColor:RandomColor() } } ) : new WidgetCanvas( self, { style:{ backgroundColor:RandomColor() } } );
					PropLayer = widget.Prop
					PropLayer.style.left = offsetX
					PropLayer.style.top = offsetY
					PropLayer.style.width = 0
					PropLayer.style.height = 0
					PropLayer.key = NewID()
					PropLayer.isNew = true
					PropLayer.eventData = { el: e.target, type:evt.type, prevX:PropLayer.style.left, prevY:PropLayer.style.top, timeStamp:e.timeStamp }
					self.onUnSelected();
					self.selectedWidget = [widget]
					self.children.push( widget )
				}else{
					if(e.shiftKey || self.selectedWidget.indexOf(widget)>=0 ){
						if(self.selectedWidget.indexOf(widget)==-1) self.selectedWidget.push( widget );
					} else if(!point) {
						self.onUnSelected();
						self.selectedWidget=[ widget ];
					}
					self.children.splice(index,1);
					self.children.push(widget);
				}

				self.children.forEach(function(widget){
					widget.onUnSelected()
				})

				// on selected
				self.selectedWidget.forEach(function(widget){
					widget.activeControlPoint = undefined
					PropLayer = widget.Prop;
					widget.onSelected()
					PropLayer.eventData = { el: e.target, type:evt.type, prevX:PropLayer.style.left, prevY:PropLayer.style.top, prevW:PropLayer.style.width, prevH:PropLayer.style.height, timeStamp:e.timeStamp }
				})

				if(point && widget){
					widget.activeControlPoint = point.Prop.position;
				}

				PropCanvas.eventData = {el: e.target, type:evt.type, widget:widget, point:point, prevX:PropCanvas.style.left, prevY:PropCanvas.style.top, prevW:PropCanvas.style.width, prevH:PropCanvas.style.height, startX:offsetX, startY:offsetY, timeStamp:e.timeStamp}

			}


			// set up move and up event
			//
			self.Prop['on'+moveE] = function(evt) {

				if( !self.isContainerMode() ){
					if( self.isChild( self.getRoot().editingContainer ) ) checkChildMoveOut(evt);
					return;
				}

				var e = /touch/.test(evt.type) ? evt.touches[0] : evt;
				evt.preventDefault();

				// check child mouse move out and info child to stop move
				var offsetX = e.pageX - self.getPageOffset().left
				var offsetY = e.pageY - self.getPageOffset().top

				if( downE !== (PropCanvas.eventData && PropCanvas.eventData.type) ) return;

				var width = offsetX-PropCanvas.eventData.startX
				var height = offsetY-PropCanvas.eventData.startY

				width = snapToGrip(width)
				height = snapToGrip(height)

				var point = PropCanvas.eventData.point

				self.selectedWidget.forEach(function(widget){
					var PropLayer = widget.Prop;
					if(point) {
						// PropLayer = point.parent.Prop;
						// a number 0-7
						var pointPosition = point.Prop.position;
						// control point to resize layer
						if([0,6,7].indexOf(pointPosition)>=0){
							width = Math.min(PropLayer.eventData.prevW-MIN_WIDTH, width)
							PropLayer.style.width = PropLayer.eventData.prevW - width
							PropLayer.style.left = PropLayer.eventData.prevX + width
						}
						if([2,3,4].indexOf(pointPosition)>=0){
							PropLayer.style.width = PropLayer.eventData.prevW + width
						}


						if([0,1,2].indexOf(pointPosition)>=0){
							height = Math.min(PropLayer.eventData.prevH-MIN_WIDTH, height)
							PropLayer.style.height = PropLayer.eventData.prevH - height
							if( PropLayer.style.height>0 ) PropLayer.style.top = PropLayer.eventData.prevY + height
						}
						if([4,5,6].indexOf(pointPosition)>=0){
							PropLayer.style.height = PropLayer.eventData.prevH + height
						}


						PropLayer.style.width = Math.max(MIN_WIDTH, PropLayer.style.width)
						PropLayer.style.height = Math.max(MIN_WIDTH, PropLayer.style.height)

					}else if( PropLayer.isNew ){
						// create new layer
						if(width>=0){
							PropLayer.style.width = width;
						} else {
							PropLayer.style.left = PropLayer.eventData.prevX+width;
							PropLayer.style.width = -width;
						}
						if(height>=0){
							PropLayer.style.height = height;
						} else {
							PropLayer.style.top = PropLayer.eventData.prevY+height;
							PropLayer.style.height = -height;
						}
					} else {
						// move layer
						PropLayer.style.left = PropLayer.eventData.prevX + width
						PropLayer.style.top = PropLayer.eventData.prevY + height
					}
				})

			}

			self.Prop['on'+upE] = self.mouseUpFunc

			if( self.isContainerMode() ) self.Prop.className = addClass( self.Prop.className, EDITING_CLASSNAME)

	}


	self.setupContainerMode = function(){
		if(!self.getRoot().editingContainer){
			self.getRoot().editingContainer = self.getRoot()
		}

		/**
		 * enter Container Mode
		 */
		if( !self.isContainerMode() ){
			self.Prop['ondblclick'] = function enterContainerMode(evt) {
				// we are already in container mode, don't enter again
				console.log('after', self.Prop.key, self.getRoot().editingContainer.Prop.key )
				if( self.isContainerMode() ) return;
				var editing = self.getRoot().editingContainer;
				editing.onExitEditing();
				self.Prop.className = addClass( self.Prop.className, EDITING_CLASSNAME);
				self.getRoot().editingContainer = self;
				self.setupContainerMode()
				editing.setupContainerMode()
			}
		} else {
			self.Prop['ondblclick'] = null;
		}

	}

	self.setupContainerMode();
	self.setupContainerEvent()

}

var WidgetDiv = function WidgetDiv(parent, prop){

	LayerBaseClass.apply(this, arguments);

	var self = this;

	self.controller = function(){
		this.onunload = function(){

		}
	}

	self.view = function(ctrl) {
		var Prop = _exclude( self.Prop, ['eventData','isNew'] );
		return Prop.style.width&&Prop.style.height
		? m('div.layer', Prop, [
				m('.content'),
				m('.bbox'),
				self.buildControlPoint()
			] )
		: []
	}
}


var WidgetCanvas = function WidgetCanvas(parent, prop){
	var self = this;

	// this will inherit LayerBaseClass
	ContainerBaseClass.apply(this, arguments);

	self.controller=function  () {

	}

	self.view = function  (ctrl) {

		return m('.canvas', _exclude( self.Prop, ['eventData','isNew'] ), [

					m('.content', [
						function(){
				            return self.children.map(function(v){ return v.getView() })
						}()
					]),
					self.buildControlPoint(),
				]
	         )
	}
}

var Canvas1 = new WidgetCanvas(null, { style:{left:100, top:100, width:800, height:500, backgroundColor:'#eee'} } );
m.mount(container, Canvas1);


/**
 * DOM EVENT BELOW
 */
// check mouse out of Main Canvas, to prevent mouse out problem
container.onmouseover = function(e){
	if(e.target.id == 'container') Canvas1.mouseUpFunc(e)
}


// short key event
window.addEventListener('keydown', handleShortKeyDown);
window.addEventListener('keyup', handleShortKeyUp);

var SHIFT_KEY_DOWN = 0;
var CTRL_KEY_DOWN = 0;
var META_KEY_DOWN = 0;

function isInputElementActive(){

  var isInput = false;
  // Some shortcuts should not get handled if a control/input element
  // is selected.
  var curElement = document.activeElement || document.querySelector(':focus');

  var curElementTagName = curElement && curElement.tagName.toUpperCase();
  if (curElementTagName === 'INPUT' ||
      curElementTagName === 'TEXTAREA' ||
      curElementTagName === 'SELECT') {

    isInput = true;
  }
  return isInput;
}

function handleShortKeyUp (evt) {
  var cmd = (evt.ctrlKey ? 1 : 0) |
        (evt.altKey ? 2 : 0) |
        (evt.shiftKey ? 4 : 0) |
        (evt.metaKey ? 8 : 0);

    if ( /control/i.test(evt.keyIdentifier) ) {	//ctrl key
		CTRL_KEY_DOWN = 0;
	}
    if ( /shift/i.test(evt.keyIdentifier) ) {	//ctrl key
		SHIFT_KEY_DOWN = 0;
	}

    if ( /meta/i.test(evt.keyIdentifier) ) {	//ctrl key
		META_KEY_DOWN = 0;
	}

}

function handleShortKeyDown (evt) {
	var handled = false;
	var isInput = isInputElementActive();

	var cmd = (evt.ctrlKey ? 1 : 0) |
	    (evt.altKey ? 2 : 0) |
	    (evt.shiftKey ? 4 : 0) |
	    (evt.metaKey ? 8 : 0);

	if (cmd === 8) { // meta
		META_KEY_DOWN = 1;
	}
	if (cmd === 0) { // no control key pressed at all.

		// console.log(evt, evt.keyCode);
		switch (evt.keyCode) {
		  case 8:  //backspace key : Delete the shape
		  case 46:  //delete key : Delete the shape

		    if(isInput) break;
		    Canvas1.removeSelectedItem();
		    handled = true;
		    break;


          case 37: // left
            Canvas1.moveSelectedBy(-GRID_SIZE,0);
            handled = true;
          break;

          case 38: // up
            Canvas1.moveSelectedBy(0,-GRID_SIZE);
            handled = true;
          break;

          case 39: // right
            Canvas1.moveSelectedBy(GRID_SIZE,0);
            handled = true;
          break;

          case 40: // down
            Canvas1.moveSelectedBy(0,GRID_SIZE);
            handled = true;
          break;


		}
	}


    if (cmd === 1 || cmd === 8) {	//ctrl key
		  CTRL_KEY_DOWN = 1;
      switch (evt.keyCode) {

        case 68:  //Ctrl+D
        	Canvas1.duplicateSelected();
          handled = true;
          break;

          case 37: // ctrl+left
            Canvas1.moveSelectedBy(-1,0);
            handled = true;
          break;

          case 38: // ctrl+up
            Canvas1.moveSelectedBy(0,-1);
            handled = true;
          break;

          case 39: // ctrl+right
            Canvas1.moveSelectedBy(1,0);
            handled = true;
          break;

          case 40: // ctrl+down
            Canvas1.moveSelectedBy(0,1);
            handled = true;
          break;


        case 90:  //Ctrl+Z
            handled = true;
          break;
      }
    }


    if (cmd === 4) {	// shift
    	SHIFT_KEY_DOWN = 1;
      switch (evt.keyCode) {

          case 37: // shift+left
            Canvas1.resizeSelectedBy(-GRID_SIZE,0);
            handled = true;
          break;

          case 38: // shift+up
            Canvas1.resizeSelectedBy(0,-GRID_SIZE);
            handled = true;
          break;

          case 39: // shift+right
            Canvas1.resizeSelectedBy(GRID_SIZE,0);
            handled = true;
          break;

          case 40: // shift+down
            Canvas1.resizeSelectedBy(0,GRID_SIZE);
            handled = true;
          break;


      }
    }


    if (cmd === 5 || cmd === 12) {	// ctrl+shift
    	SHIFT_KEY_DOWN = 1;
    	CTRL_KEY_DOWN = 1;

      switch (evt.keyCode) {


          case 37: // ctrl+shift+left
            Canvas1.resizeSelectedBy(-1,0);
            handled = true;
          break;

          case 38: // ctrl+shift+up
            Canvas1.resizeSelectedBy(0,-1);
            handled = true;
          break;

          case 39: // ctrl+shift+right
            Canvas1.resizeSelectedBy(1,0);
            handled = true;
          break;

          case 40: // ctrl+shift+down
            Canvas1.resizeSelectedBy(0,1);
            handled = true;
          break;

      }
    }


    if(handled){
      evt.preventDefault();
      return;
    }

}