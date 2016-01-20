;(function (root, factory) {
  if(typeof define === "function" && define.amd) {
    define([], factory);
  } else if(typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.m_drag = factory();
  }
}(this, function() {
	return function m_drag(options) {
		var defaultOptions = {mithril:false}, options=options||{}
		for(var i in defaultOptions){ if( !(i in options) ) options[i] = defaultOptions[i] }
		var isTouch = ('ontouchstart' in window) || ('DocumentTouch' in window && document instanceof DocumentTouch);
		var downE = isTouch? 'touchstart' :'mousedown';
		var moveE = isTouch? 'touchmove' :'mousemove';
		var upE = isTouch? 'touchend' :'mouseup';
		var dragRoot={}, stack=[]
		function getDownFunc(name){
			return function downHandle (evt) {
				var e = /touch/.test(evt.type) ? evt.touches[0] : evt;
				var data = dragRoot[name];
				data.ox = e.pageX
				data.oy = e.pageY
				data.type = evt.type
			}
		}
		function moveHandle (evt){
			var e = /touch/.test(evt.type) ? evt.touches[0] : evt;
			var isDown = false;
			for(var name in dragRoot){
				var data = dragRoot[name];
				if( !data.type ) continue;
				isDown = true;
				stack.push(data.pageX, data.pageY, data.dx, data.dy)
				data.pageX = e.pageX
				data.pageY = e.pageY
				data.dx = data.ox - e.pageX
				data.dy = data.oy - e.pageY
				if( data.move && data.move(evt, data, dragRoot)===false ) {
					data.dy = stack.pop()
					data.dx = stack.pop()
					data.pageY = stack.pop()
					data.pageX = stack.pop()
					return upHandle(evt)
				}
			}
			if(isDown) evt.preventDefault()
		}
		function upHandle (evt){
			for(var name in dragRoot){
				var data = dragRoot[name];
				if( !data.type ) continue;
				data.up&&data.up(evt, data, dragRoot)
				data.type = null
				data.dx = data.dy = 0
			}
		}
		document.addEventListener(moveE, moveHandle)
		document.addEventListener(upE, upHandle)
		return function(name, data, moveCB, upCB){
			if(typeof data=='function') upCB = moveCB, moveCB = data, data={};
			dragRoot[name] = { name:name, data:data, move:moveCB, up:upCB };
			return getDownFunc(name)
		}
	}
}));
