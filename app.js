(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

var _global = require('./global');

var Global = _interopRequireWildcard(_global);

var _LayerBaseClass2 = require('./LayerBaseClass');

var _LayerBaseClass3 = _interopRequireDefault(_LayerBaseClass2);

var _WidgetDiv = require('./WidgetDiv');

var _WidgetDiv2 = _interopRequireDefault(_WidgetDiv);

var _WidgetCanvas = require('./WidgetCanvas');

var _WidgetCanvas2 = _interopRequireDefault(_WidgetCanvas);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContainerBaseClass = (function (_LayerBaseClass) {
	_inherits(ContainerBaseClass, _LayerBaseClass);

	function ContainerBaseClass(parent, prop) {
		_classCallCheck(this, ContainerBaseClass);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ContainerBaseClass).call(this, parent, prop));

		_this.parent = parent;
		_this.editingContainer = undefined;
		_this.children = [];
		_this.selectedWidget = [];
		_this.resetAllEvent();
		_this.setupContainerMode();
		_this.setupContainerEvent();
		return _this;
	}

	_createClass(ContainerBaseClass, [{
		key: 'resetAllEvent',
		value: function resetAllEvent(el) {
			el = el || this;
			el.Prop['on' + Global.downE] = null;
			el.Prop['on' + Global.moveE] = null;
			el.Prop['on' + Global.upE] = null;
			el.Prop['ondblclick'] = null;
		}
	}, {
		key: 'resizeSelectedBy',
		value: function resizeSelectedBy(x, y) {
			var editing = this.getRoot().editingContainer;
			for (var i = 0, v; v = editing.selectedWidget[i]; i++) {
				v.Prop.style.width += x;
				v.Prop.style.height += y;
				v.Prop.style.width = Math.max(Global.MIN_WIDTH, v.Prop.style.width);
				v.Prop.style.height = Math.max(Global.MIN_WIDTH, v.Prop.style.height);
			}
			_mithril2.default.redraw();
		}
	}, {
		key: 'moveSelectedBy',
		value: function moveSelectedBy(x, y) {
			var editing = this.getRoot().editingContainer;
			for (var i = 0, v; v = editing.selectedWidget[i]; i++) {
				v.Prop.style.left += x;
				v.Prop.style.top += y;
			}
			_mithril2.default.redraw();
		}
	}, {
		key: 'duplicateChild',
		value: function duplicateChild(src, dest) {
			var _this2 = this;

			src.children && src.children.forEach(function (child) {
				var newChild = new child.constructor(dest, { style: child.Prop.style });
				dest.children.push(newChild);
				_this2.duplicateChild(child, newChild);
			});
		}
	}, {
		key: 'duplicateSelected',
		value: function duplicateSelected() {
			var editing = this.getRoot().editingContainer;
			var newWidget = [];
			for (var i = 0, v; v = editing.selectedWidget[i]; i++) {
				var widget = new v.constructor(v.parent, { style: v.Prop.style });
				this.duplicateChild(v, widget);
				editing.children.push(widget);
				newWidget.push(widget);
				if (v.isSelected()) {
					v.onUnSelected();
					widget.onSelected();
					widget.Prop.style.left += 20;
					widget.Prop.style.top += 20;
				}
			}
			editing.selectedWidget = newWidget;
			_mithril2.default.redraw();
		}
	}, {
		key: 'removeSelectedItem',
		value: function removeSelectedItem() {
			var editing = this.getRoot().editingContainer;
			for (var i = 0, v; v = editing.selectedWidget[i]; i++) {
				var index = editing.children.indexOf(v);
				if (index >= 0) editing.children.splice(index, 1);
				// if( v.isSelected() ) v.remove();
			}
			editing.selectedWidget = [];
			_mithril2.default.redraw();
		}
	}, {
		key: 'checkSelectElement',
		value: function checkSelectElement(rect) {
			var elArray = {};
			var pointArray = {};
			this.children.forEach(function (v, i) {

				if (Global.rectsIntersect(rect, v.Prop.style)) {
					elArray[i] = v;
				}

				var point = v.getElementInside(rect).pop();
				if (point) {
					pointArray[i] = point;
				}
			});

			return { layer: elArray, point: pointArray, selfPoint: this.getElementInside(rect).pop() };
		}
	}, {
		key: 'isChild',
		value: function isChild(obj) {
			return this.children.some(function (v, i) {
				return v.Prop.key == obj.Prop.key;
			});
		}
	}, {
		key: 'isContainerMode',
		value: function isContainerMode() {
			return this.Prop.key == this.getRoot().editingContainer.Prop.key;
		}
	}, {
		key: 'onExitEditing',
		value: function onExitEditing() {
			this.Prop.className = Global.removeClass(this.Prop.className, Global.EDITING_CLASSNAME);
			console.log('onExitEditing', this.Prop, this.selectedWidget.length);
			this.children.forEach(function (v) {
				v.onUnSelected();
			});
			this.selectedWidget = [];
		}
	}, {
		key: 'onUnSelected',
		value: function onUnSelected() {
			this.selectedWidget.forEach(function (v) {
				v.onUnSelected();
			});
			this.selectedWidget = [];
			_get(Object.getPrototypeOf(ContainerBaseClass.prototype), 'onUnSelected', this).call(this);
		}

		/**
   * setup Event for Canvas, only it's the current editing
   * @return {none}
   */

	}, {
		key: 'mouseUpFunc',
		value: function mouseUpFunc(evt) {

			var e = /touch/.test(evt.type) ? evt.changedTouches[0] : evt;

			// this.Prop['on'+Global.moveE] = this.Prop['on'+Global.upE] = null;

			delete this.Prop.eventData;

			if (!this.selectedWidget.length) return;

			this.selectedWidget.forEach(function (widget) {
				if (widget.Prop.isNew && widget.Prop.style.width < Math.max(20, Global.MIN_WIDTH * 2) && widget.Prop.style.height < Math.max(20, Global.MIN_WIDTH * 2)) {
					widget.remove();
				}
				delete widget.Prop.eventData;
				if (widget.Prop.isNew) {
					delete widget.Prop.isNew;
				}
			});
		}
	}, {
		key: 'setupContainerEvent',
		value: function setupContainerEvent() {

			var self = this;
			// console.log( 'setupContainerEvent', self.Prop.key , self.getRoot().editingContainer.Prop.key  )

			/**
    * enter Container Mode, to move, resize etc.
    */

			var PropCanvas = self.Prop;

			var checkChildMoveOut = function checkChildMoveOut(evt) {
				var e = /touch/.test(evt.type) ? evt.touches[0] : evt;
				var offsetX = e.pageX - self.getPageOffset().left;
				var offsetY = e.pageY - self.getPageOffset().top;

				var editingStyle = self.getRoot().editingContainer.Prop.style;

				if (offsetX < editingStyle.left || offsetY < editingStyle.top || offsetX > editingStyle.left + editingStyle.width || offsetY > editingStyle.top + editingStyle.height) {
					console.log('move out');
					return self.getRoot().editingContainer.mouseUpFunc(evt);
				}
			};

			// http://stackoverflow.com/questions/6593447/snapping-to-grid-in-javascript
			var snapToGrip = function snapToGrip(val) {
				var snap_candidate = Global.GRID_SIZE * Math.round(val / Global.GRID_SIZE);
				if (Math.abs(val - snap_candidate) <= Global.GRID_SIZE / 2) {
					return snap_candidate;
				} else {
					return null;
				}
			};

			// when mouse down
			self.Prop['on' + Global.downE] = function (evt) {
				// check: move, resize, create only apply to current editing container
				if (!self.isContainerMode()) {
					return;
				}
				var e = /touch/.test(evt.type) ? evt.touches[0] : evt;
				var offsetX = e.pageX - self.getPageOffset().left;
				var offsetY = e.pageY - self.getPageOffset().top;

				// console.log('ondown', offsetX, offsetY, self.Prop.key, self.getPageOffset().path )
				var PropLayer;

				var hitObject = self.checkSelectElement({ left: offsetX, top: offsetY, width: 0, height: 0 });

				offsetX = snapToGrip(offsetX);
				offsetY = snapToGrip(offsetY);

				// widget
				var widget = null;
				// controlPoint
				var point = null;

				// widget index
				var index = Object.keys(hitObject.point).pop();

				if (index) {
					point = hitObject.point[index];
					widget = self.children[index];
				} else {
					point = null;
					index = Object.keys(hitObject.layer).pop();
					widget = hitObject.layer[index];
				}

				if (index == undefined) {
					widget = evt.shiftKey ? new _WidgetDiv2.default(self, { style: { backgroundColor: Global.RandomColor() } }) : new _WidgetCanvas2.default(self, { style: { backgroundColor: Global.RandomColor() } });
					PropLayer = widget.Prop;
					PropLayer.style.left = offsetX;
					PropLayer.style.top = offsetY;
					PropLayer.style.width = 0;
					PropLayer.style.height = 0;
					PropLayer.key = Global.NewID();
					PropLayer.isNew = true;
					PropLayer.eventData = { el: e.target, type: evt.type, prevX: PropLayer.style.left, prevY: PropLayer.style.top, timeStamp: e.timeStamp };
					self.onUnSelected();
					self.selectedWidget = [widget];
					self.children.push(widget);
				} else {
					if (e.shiftKey || self.selectedWidget.indexOf(widget) >= 0) {
						if (self.selectedWidget.indexOf(widget) == -1) self.selectedWidget.push(widget);
					} else if (!point) {
						self.onUnSelected();
						self.selectedWidget = [widget];
					}
					self.children.splice(index, 1);
					self.children.push(widget);
				}

				self.children.forEach(function (widget) {
					widget.onUnSelected();
				});

				// on selected
				self.selectedWidget.forEach(function (widget) {
					widget.activeControlPoint = undefined;
					PropLayer = widget.Prop;
					widget.onSelected();
					PropLayer.eventData = { el: e.target, type: evt.type, prevX: PropLayer.style.left, prevY: PropLayer.style.top, prevW: PropLayer.style.width, prevH: PropLayer.style.height, timeStamp: e.timeStamp };
				});

				if (point && widget) {
					widget.activeControlPoint = point.Prop.position;
				}

				PropCanvas.eventData = { el: e.target, type: evt.type, widget: widget, point: point, prevX: PropCanvas.style.left, prevY: PropCanvas.style.top, prevW: PropCanvas.style.width, prevH: PropCanvas.style.height, startX: offsetX, startY: offsetY, timeStamp: e.timeStamp };
			};

			// set up move and up event
			//
			self.Prop['on' + Global.moveE] = function (evt) {

				if (!self.isContainerMode()) {
					if (self.isChild(self.getRoot().editingContainer)) checkChildMoveOut(evt);
					return;
				}

				var e = /touch/.test(evt.type) ? evt.touches[0] : evt;
				evt.preventDefault();

				// check child mouse move out and info child to stop move
				var offsetX = e.pageX - self.getPageOffset().left;
				var offsetY = e.pageY - self.getPageOffset().top;

				if (Global.downE !== (PropCanvas.eventData && PropCanvas.eventData.type)) return;

				var width = offsetX - PropCanvas.eventData.startX;
				var height = offsetY - PropCanvas.eventData.startY;

				width = snapToGrip(width);
				height = snapToGrip(height);

				var point = PropCanvas.eventData.point;

				self.selectedWidget.forEach(function (widget) {
					var PropLayer = widget.Prop;
					if (point) {
						// PropLayer = point.parent.Prop;
						// a number 0-7
						var pointPosition = point.Prop.position;
						// control point to resize layer
						if ([0, 6, 7].indexOf(pointPosition) >= 0) {
							width = Math.min(PropLayer.eventData.prevW - Global.MIN_WIDTH, width);
							PropLayer.style.width = PropLayer.eventData.prevW - width;
							PropLayer.style.left = PropLayer.eventData.prevX + width;
						}
						if ([2, 3, 4].indexOf(pointPosition) >= 0) {
							PropLayer.style.width = PropLayer.eventData.prevW + width;
						}

						if ([0, 1, 2].indexOf(pointPosition) >= 0) {
							height = Math.min(PropLayer.eventData.prevH - Global.MIN_WIDTH, height);
							PropLayer.style.height = PropLayer.eventData.prevH - height;
							if (PropLayer.style.height > 0) PropLayer.style.top = PropLayer.eventData.prevY + height;
						}
						if ([4, 5, 6].indexOf(pointPosition) >= 0) {
							PropLayer.style.height = PropLayer.eventData.prevH + height;
						}

						PropLayer.style.width = Math.max(Global.MIN_WIDTH, PropLayer.style.width);
						PropLayer.style.height = Math.max(Global.MIN_WIDTH, PropLayer.style.height);
					} else if (PropLayer.isNew) {
						// create new layer
						if (width >= 0) {
							PropLayer.style.width = width;
						} else {
							PropLayer.style.left = PropLayer.eventData.prevX + width;
							PropLayer.style.width = -width;
						}
						if (height >= 0) {
							PropLayer.style.height = height;
						} else {
							PropLayer.style.top = PropLayer.eventData.prevY + height;
							PropLayer.style.height = -height;
						}
					} else {
						// move layer
						PropLayer.style.left = PropLayer.eventData.prevX + width;
						PropLayer.style.top = PropLayer.eventData.prevY + height;
					}
				});
			};

			self.Prop['on' + Global.upE] = function (e) {
				return self.mouseUpFunc(e);
			};

			if (self.isContainerMode()) self.Prop.className = Global.addClass(self.Prop.className, Global.EDITING_CLASSNAME);
		}
	}, {
		key: 'setupContainerMode',
		value: function setupContainerMode() {
			var self = this;
			if (!self.getRoot().editingContainer) {
				self.getRoot().editingContainer = self.getRoot();
			}

			/**
    * enter Container Mode
    */
			if (!self.isContainerMode()) {
				self.Prop['ondblclick'] = function enterContainerMode(evt) {
					// we are already in container mode, don't enter again
					console.log('after', self.Prop.key, self.getRoot().editingContainer.Prop.key);
					if (self.isContainerMode()) return;
					var editing = self.getRoot().editingContainer;
					editing.onExitEditing();
					self.Prop.className = Global.addClass(self.Prop.className, Global.EDITING_CLASSNAME);
					self.getRoot().editingContainer = self;
					self.setupContainerMode();
					editing.setupContainerMode();
				};
			} else {
				self.Prop['ondblclick'] = null;
			}
		}
	}]);

	return ContainerBaseClass;
})(_LayerBaseClass3.default);

exports.default = ContainerBaseClass;
},{"./LayerBaseClass":3,"./WidgetCanvas":4,"./WidgetDiv":5,"./global":7,"mithril":8}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

var _global = require('./global');

var Global = _interopRequireWildcard(_global);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ControlPoint = (function () {
	function ControlPoint(parent, prop) {
		_classCallCheck(this, ControlPoint);

		this.parent = parent;
		this.Prop = Global._deepCopy({ style: { width: 10, height: 10 } }, prop || {});
	}

	_createClass(ControlPoint, [{
		key: 'controller',
		value: function controller() {
			// this will bind to controller()
			this.onunload = function () {};
		}
	}, {
		key: 'view',
		value: function view(ctrl) {
			var self = this;
			// this will bind to Class this
			this.Prop.config = function (el) {
				Global.applyStyle(el, self.Prop.style);
			};
			return (0, _mithril2.default)('div.controlPoint', this.Prop);
		}
	}, {
		key: 'getView',
		value: function getView() {
			return this.view(new this.controller());
		}
	}]);

	return ControlPoint;
})();

exports.default = ControlPoint;
},{"./global":7,"mithril":8}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

var _global = require('./global');

var Global = _interopRequireWildcard(_global);

var _ControlPoint = require('./ControlPoint');

var _ControlPoint2 = _interopRequireDefault(_ControlPoint);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LayerBaseClass = (function () {
	function LayerBaseClass(parent, prop) {
		var _this = this;

		_classCallCheck(this, LayerBaseClass);

		this.parent = parent;
		this.generateID = Global.NewID();
		this.Prop = Global._deepCopy({ key: this.generateID, className: '', style: { left: 0, top: 0, width: 0, height: 0, 'backgroundColor': '#eee' } }, prop || {});
		this.Prop.config = function (el) {
			Global.applyStyle(el, _this.Prop.style);
		};
		this.Prop.onkeypress = function (e) {
			console.log(e, this);
		};
		this.ControlPoints = [];
		this.activeControlPoint = undefined;
	}

	_createClass(LayerBaseClass, [{
		key: 'getPageOffset',
		value: function getPageOffset() {
			var cur = this,
			    parent,
			    offset = { left: this.Prop.style.left, top: this.Prop.style.top, path: [this.Prop.key] };
			while (parent = cur.parent) {
				offset.left += parent.Prop.style.left;
				offset.top += parent.Prop.style.top;
				offset.path.push(parent.Prop.key);
				cur = parent;
			}
			offset.path.reverse();
			return offset;
		}
	}, {
		key: 'getRoot',
		value: function getRoot() {
			var cur = this,
			    parent;
			while (parent = cur.parent) {
				cur = parent;
			}
			return cur;
		}
	}, {
		key: 'iterateParent',
		value: function iterateParent(callback) {
			var cur = this,
			    parent;
			while (parent = cur.parent) {
				callback && callback(parent);
				cur = parent;
			}
			return cur;
		}
	}, {
		key: 'buildControlPoint',
		value: function buildControlPoint() {

			var ControlPosition = function ControlPosition(parent, child) {
				this[0] = this.LT = [-child.width / 2, -child.height / 2]; //Left Top
				this[1] = this.CT = [parent.width / 2 - child.width / 2, -child.height / 2]; //top center
				this[2] = this.RT = [parent.width - child.width / 2, -child.height / 2]; //right top

				this[6] = this.LB = [-child.width / 2, parent.height - child.height / 2]; //Left Top
				this[5] = this.CB = [parent.width / 2 - child.width / 2, parent.height - child.height / 2]; //top center
				this[4] = this.RB = [parent.width - child.width / 2, parent.height - child.height / 2]; //right top

				this[7] = this.LM = [-child.width / 2, parent.height / 2 - child.height / 2]; //Left Top
				this[3] = this.RM = [parent.width - child.width / 2, parent.height / 2 - child.height / 2]; //left center
			};
			this.ControlPoints = [];

			var pointProp = { width: Global.POINT_WIDTH, height: Global.POINT_HEIGHT };
			var pointPosition = new ControlPosition(this.Prop.style, pointProp);
			// var positionShift = this.isSelected() ? -BORDER_WIDTH : 0;

			for (var i = 0; i < 8; i++) {
				var point = new _ControlPoint2.default(this, { style: pointProp, position: i });
				point.Prop.style.left = pointPosition[i][0];
				point.Prop.style.top = pointPosition[i][1];
				this.ControlPoints.push(point);
			}

			// move control point to top
			if (Global.isNumeric(this.activeControlPoint)) {
				var point = this.ControlPoints[this.activeControlPoint];
				point.Prop.className = 'activePoint';
				this.ControlPoints.splice(this.activeControlPoint, 1);
				this.ControlPoints.push(point);
			}

			return this.ControlPoints.map(function (v) {
				return v.getView();
			});
		}
	}, {
		key: 'remove',
		value: function remove() {
			this.parent.selectedWidget.splice(this.parent.selectedWidget.indexOf(this), 1);
			this.parent.children.splice(this.parent.children.indexOf(this), 1);
		}
	}, {
		key: 'isSelected',
		value: function isSelected() {
			return this.Prop.className.indexOf(Global.SELECTED_CLASSNAME) >= 0;
		}
	}, {
		key: 'onSelected',
		value: function onSelected() {
			this.Prop.className = Global.addClass(this.Prop.className, Global.SELECTED_CLASSNAME);
		}
	}, {
		key: 'onUnSelected',
		value: function onUnSelected() {
			this.Prop.className = Global.removeClass(this.Prop.className, Global.SELECTED_CLASSNAME);
			this.activeControlPoint = undefined;
		}
	}, {
		key: 'getElementInside',
		value: function getElementInside(rect) {
			if (!this.isSelected()) return [];
			rect = Global._deepCopy({}, rect);
			rect.left -= this.Prop.style.left;
			rect.top -= this.Prop.style.top;
			return this.ControlPoints.filter(function (v) {
				if (Global.rectsIntersect(rect, v.Prop.style)) {
					return true;
				}
			});
		}
	}, {
		key: 'controller',
		value: function controller() {
			return;
		}
	}, {
		key: 'view',
		value: function view() {
			return;
		}
	}, {
		key: 'getView',
		value: function getView() {
			return this.view(new this.controller());
		}
	}]);

	return LayerBaseClass;
})();

exports.default = LayerBaseClass;
},{"./ControlPoint":2,"./global":7,"mithril":8}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

var _global = require('./global');

var Global = _interopRequireWildcard(_global);

var _ContainerBaseClass2 = require('./ContainerBaseClass');

var _ContainerBaseClass3 = _interopRequireDefault(_ContainerBaseClass2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WidgetCanvas = (function (_ContainerBaseClass) {
	_inherits(WidgetCanvas, _ContainerBaseClass);

	function WidgetCanvas(parent, prop) {
		_classCallCheck(this, WidgetCanvas);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WidgetCanvas).call(this, parent, prop));

		_this.parent = parent;
		return _this;
	}

	_createClass(WidgetCanvas, [{
		key: 'controller',
		value: function controller() {}
	}, {
		key: 'view',
		value: function view(ctrl) {
			var self = this;
			return (0, _mithril2.default)('.canvas', Global._exclude(this.Prop, ['eventData', 'isNew']), [(0, _mithril2.default)('.content', [(function () {
				return self.children.map(function (v) {
					return v.getView();
				});
			})()]), this.buildControlPoint()]);
		}
	}]);

	return WidgetCanvas;
})(_ContainerBaseClass3.default);

exports.default = WidgetCanvas;
},{"./ContainerBaseClass":1,"./global":7,"mithril":8}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

var _global = require('./global');

var Global = _interopRequireWildcard(_global);

var _LayerBaseClass2 = require('./LayerBaseClass');

var _LayerBaseClass3 = _interopRequireDefault(_LayerBaseClass2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WidgetDiv = (function (_LayerBaseClass) {
	_inherits(WidgetDiv, _LayerBaseClass);

	function WidgetDiv(parent, prop) {
		_classCallCheck(this, WidgetDiv);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WidgetDiv).call(this, parent, prop));

		_this.parent = parent;
		return _this;
	}

	_createClass(WidgetDiv, [{
		key: 'controller',
		value: function controller() {
			this.onunload = function () {};
		}
	}, {
		key: 'view',
		value: function view(ctrl) {
			var Prop = Global._exclude(this.Prop, ['eventData', 'isNew']);
			return Prop.style.width && Prop.style.height ? (0, _mithril2.default)('div.layer', Prop, [(0, _mithril2.default)('.content'), (0, _mithril2.default)('.bbox'), this.buildControlPoint()]) : [];
		}
	}]);

	return WidgetDiv;
})(_LayerBaseClass3.default);

exports.default = WidgetDiv;
},{"./LayerBaseClass":3,"./global":7,"mithril":8}],6:[function(require,module,exports){
'use strict';

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

var _global = require('./global');

var Global = _interopRequireWildcard(_global);

var _WidgetDiv = require('./WidgetDiv');

var _WidgetDiv2 = _interopRequireDefault(_WidgetDiv);

var _WidgetCanvas = require('./WidgetCanvas');

var _WidgetCanvas2 = _interopRequireDefault(_WidgetCanvas);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Main Code below
 */

var container = document.querySelector('#container');
var Canvas1 = new _WidgetCanvas2.default(null, { style: { left: 100, top: 100, width: 800, height: 500, backgroundColor: '#eee' } });
_mithril2.default.mount(container, Canvas1);

/**
 * DOM EVENT BELOW
 */
// check mouse out of Main Canvas, to prevent mouse out problem
container.onmouseover = function (e) {
  if (e.target.id == 'container') Canvas1.mouseUpFunc(e);
};

// short key event
window.addEventListener('keydown', handleShortKeyDown);
window.addEventListener('keyup', handleShortKeyUp);

var SHIFT_KEY_DOWN = 0;
var CTRL_KEY_DOWN = 0;
var META_KEY_DOWN = 0;

function isInputElementActive() {

  var isInput = false;
  // Some shortcuts should not get handled if a control/input element
  // is selected.
  var curElement = document.activeElement || document.querySelector(':focus');

  var curElementTagName = curElement && curElement.tagName.toUpperCase();
  if (curElementTagName === 'INPUT' || curElementTagName === 'TEXTAREA' || curElementTagName === 'SELECT') {

    isInput = true;
  }
  return isInput;
}

function handleShortKeyUp(evt) {
  var cmd = (evt.ctrlKey ? 1 : 0) | (evt.altKey ? 2 : 0) | (evt.shiftKey ? 4 : 0) | (evt.metaKey ? 8 : 0);

  if (/control/i.test(evt.keyIdentifier)) {
    //ctrl key
    CTRL_KEY_DOWN = 0;
  }
  if (/shift/i.test(evt.keyIdentifier)) {
    //ctrl key
    SHIFT_KEY_DOWN = 0;
  }

  if (/meta/i.test(evt.keyIdentifier)) {
    //ctrl key
    META_KEY_DOWN = 0;
  }
}

function handleShortKeyDown(evt) {
  var handled = false;
  var isInput = isInputElementActive();

  var cmd = (evt.ctrlKey ? 1 : 0) | (evt.altKey ? 2 : 0) | (evt.shiftKey ? 4 : 0) | (evt.metaKey ? 8 : 0);

  if (cmd === 8) {
    // meta
    META_KEY_DOWN = 1;
  }
  if (cmd === 0) {
    // no control key pressed at all.

    // console.log(evt, evt.keyCode);
    switch (evt.keyCode) {
      case 8: //backspace key : Delete the shape
      case 46:
        //delete key : Delete the shape

        if (isInput) break;
        Canvas1.removeSelectedItem();
        handled = true;
        break;

      case 37:
        // left
        Canvas1.moveSelectedBy(-GRID_SIZE, 0);
        handled = true;
        break;

      case 38:
        // up
        Canvas1.moveSelectedBy(0, -GRID_SIZE);
        handled = true;
        break;

      case 39:
        // right
        Canvas1.moveSelectedBy(GRID_SIZE, 0);
        handled = true;
        break;

      case 40:
        // down
        Canvas1.moveSelectedBy(0, GRID_SIZE);
        handled = true;
        break;

    }
  }

  if (cmd === 1 || cmd === 8) {
    //ctrl key
    CTRL_KEY_DOWN = 1;
    switch (evt.keyCode) {

      case 68:
        //Ctrl+D
        Canvas1.duplicateSelected();
        handled = true;
        break;

      case 37:
        // ctrl+left
        Canvas1.moveSelectedBy(-1, 0);
        handled = true;
        break;

      case 38:
        // ctrl+up
        Canvas1.moveSelectedBy(0, -1);
        handled = true;
        break;

      case 39:
        // ctrl+right
        Canvas1.moveSelectedBy(1, 0);
        handled = true;
        break;

      case 40:
        // ctrl+down
        Canvas1.moveSelectedBy(0, 1);
        handled = true;
        break;

      case 90:
        //Ctrl+Z
        handled = true;
        break;
    }
  }

  if (cmd === 4) {
    // shift
    SHIFT_KEY_DOWN = 1;
    switch (evt.keyCode) {

      case 37:
        // shift+left
        Canvas1.resizeSelectedBy(-GRID_SIZE, 0);
        handled = true;
        break;

      case 38:
        // shift+up
        Canvas1.resizeSelectedBy(0, -GRID_SIZE);
        handled = true;
        break;

      case 39:
        // shift+right
        Canvas1.resizeSelectedBy(GRID_SIZE, 0);
        handled = true;
        break;

      case 40:
        // shift+down
        Canvas1.resizeSelectedBy(0, GRID_SIZE);
        handled = true;
        break;

    }
  }

  if (cmd === 5 || cmd === 12) {
    // ctrl+shift
    SHIFT_KEY_DOWN = 1;
    CTRL_KEY_DOWN = 1;

    switch (evt.keyCode) {

      case 37:
        // ctrl+shift+left
        Canvas1.resizeSelectedBy(-1, 0);
        handled = true;
        break;

      case 38:
        // ctrl+shift+up
        Canvas1.resizeSelectedBy(0, -1);
        handled = true;
        break;

      case 39:
        // ctrl+shift+right
        Canvas1.resizeSelectedBy(1, 0);
        handled = true;
        break;

      case 40:
        // ctrl+shift+down
        Canvas1.resizeSelectedBy(0, 1);
        handled = true;
        break;

    }
  }

  if (handled) {
    evt.preventDefault();
    return;
  }
}
},{"./WidgetCanvas":4,"./WidgetDiv":5,"./global":7,"mithril":8}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isNumeric = isNumeric;
exports.clone = clone;
exports._deepCopy = _deepCopy;
exports._extend = _extend;
exports._iterate = _iterate;
exports._pluck = _pluck;
exports._exclude = _exclude;
exports._addToSet = _addToSet;
exports.removeClass = removeClass;
exports.addClass = addClass;
exports.RandomColor = RandomColor;
exports.NewID = NewID;
exports.applyStyle = applyStyle;

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/**
 * Helper functions
 */
var MIN_WIDTH = exports.MIN_WIDTH = 2;
var GRID_SIZE = exports.GRID_SIZE = 5;

var POINT_WIDTH = exports.POINT_WIDTH = 10;
var POINT_HEIGHT = exports.POINT_HEIGHT = 10;
var BORDER_WIDTH = exports.BORDER_WIDTH = 1;

var SELECTED_CLASSNAME = exports.SELECTED_CLASSNAME = 'selected';
var EDITING_CLASSNAME = exports.EDITING_CLASSNAME = 'editing';

var isAndroid = exports.isAndroid = /(android)/i.test(navigator.userAgent);
var isWeiXin = exports.isWeiXin = navigator.userAgent.match(/MicroMessenger\/([\d.]+)/i);
var isiOS = exports.isiOS = /iPhone/i.test(navigator.userAgent) || /iPod/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent);
var isMobile = exports.isMobile = isAndroid || isWeiXin || isiOS;

// whether it's touch screen
var isTouch = exports.isTouch = 'ontouchstart' in window || 'DocumentTouch' in window && document instanceof DocumentTouch;

// touch event uniform to touchscreen & PC
var downE = exports.downE = isMobile ? 'touchstart' : 'mousedown';
var moveE = exports.moveE = isMobile ? 'touchmove' : 'mousemove';
var upE = exports.upE = isMobile ? 'touchend' : 'mouseup';
var leaveE = exports.leaveE = isMobile ? 'touchcancel' : 'mouseleave';
var clickE = exports.clickE = isMobile ? 'touchstart' : 'click';

// http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric?rq=1
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function clone(item) {
    if (!item) {
        return item;
    } // null, undefined values check

    var types = [Number, String, Boolean],
        result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function (type) {
        if (item instanceof type) {
            result = type(item);
        }
    });

    if (typeof result == "undefined") {
        if (Object.prototype.toString.call(item) === "[object Array]") {
            result = [];
            item.forEach(function (child, index, array) {
                result[index] = clone(child);
            });
        } else if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) == "object") {
            // testing that this is DOM
            if (item.nodeType && typeof item.cloneNode == "function") {
                var result = item.cloneNode(true);
            } else if (!item.prototype) {
                // check that this is a literal
                if (item instanceof Date) {
                    result = new Date(item);
                } else {
                    // it is an object literal
                    result = {};
                    for (var i in item) {
                        result[i] = clone(item[i]);
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
    if (arguments.length < 2) return obj;
    for (var i = 1; i < arguments.length; i++) {
        var props = arguments[i];
        for (var prop in props) {
            if (props.hasOwnProperty(prop)) {
                obj[prop] = clone(props[prop]);
            }
        }
    }
    return obj;
}
function _extend(obj) {
    obj = obj || {};
    if (arguments.length < 2) return obj;
    for (var i = 1; i < arguments.length; i++) {
        var props = arguments[i];
        for (var prop in props) {
            if (props.hasOwnProperty(prop)) {
                obj[prop] = props[prop];
            }
        }
    }
    return obj;
}

function _iterate(obj, condition, valueCallback) {
    var list = {};
    for (var name in obj) {
        if (obj.hasOwnProperty(name) && condition ? condition(name) : true) {
            list[name] = valueCallback ? valueCallback(obj[name]) : obj[name];
        }
    }
    return list;
}
function _pluck(obj, propArr) {
    if (!propArr || propArr.constructor != Array) return obj;
    return _iterate(obj, function (name) {
        return propArr.indexOf(name) >= 0;
    });
}
function _exclude(obj, propArr) {
    if (!propArr || propArr.constructor != Array) return obj;
    return _iterate(obj, function (name) {
        return propArr.indexOf(name) < 0;
    });
}
function _addToSet() {
    var i,
        isFirst,
        args = Array.prototype.slice.call(arguments, 0);
    if (typeof args[0] == 'boolean') isFirst = args.shift();
    var arr = args.shift();
    if (arr === null || (typeof arr === 'undefined' ? 'undefined' : _typeof(arr)) !== 'object') arr = [];
    for (i in args) {
        if (arr.indexOf(args[i]) < 0) {
            isFirst ? arr.unshift(args[i]) : arr.push(args[i]);
        }
    }
    return arr;
}

function removeClass(classProp, class1, class2, etc) {
    var list = classProp.split(/\s+/);
    var args = Array.prototype.slice.call(arguments, 1);
    return list.filter(function (v) {
        return args.indexOf(v) == -1;
    }).join(' ');
}

function addClass(classProp, class1, class2, etc) {
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = args[0].split(/\s+/);
    _addToSet.apply(null, args);
    return args[0].join(' ');
}

function RandomColor() {
    return '#' + Math.random().toString(16).slice(-6);
}

function NewID() {
    return +new Date() + "_" + Math.round(Math.random() * 1e6).toString(36);
}

function applyStyle(el, styleObj) {
    var pxArray = ['width', 'height', 'left', 'top'];
    for (var i in styleObj) {
        var attr = pxArray.indexOf(i) > -1 ? styleObj[i] + 'px' : styleObj[i];
        el.style[i] = attr;
    }
}
var rectsIntersect = exports.rectsIntersect = function rectsIntersect(r1, r2) {
    return r2.left <= r1.left + r1.width && r2.left + r2.width >= r1.left && r2.top <= r1.top + r1.height && r2.top + r2.height >= r1.top;
};

var debug = exports.debug = function debug(msg) {
    document.querySelector('#debug').innerHTML = msg;
};
},{}],8:[function(require,module,exports){
var m = (function app(window, undefined) {
	var OBJECT = "[object Object]", ARRAY = "[object Array]", STRING = "[object String]", FUNCTION = "function";
	var type = {}.toString;
	var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g, attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
	var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
	var noop = function() {}

	// caching commonly used variables
	var $document, $location, $requestAnimationFrame, $cancelAnimationFrame;

	// self invoking function needed because of the way mocks work
	function initialize(window){
		$document = window.document;
		$location = window.location;
		$cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
		$requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
	}

	initialize(window);


	/**
	 * @typedef {String} Tag
	 * A string that looks like -> div.classname#id[param=one][param2=two]
	 * Which describes a DOM node
	 */

	/**
	 *
	 * @param {Tag} The DOM node tag
	 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
	 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array, or splat (optional)
	 *
	 */
	function m() {
		var args = [].slice.call(arguments);
		var hasAttrs = args[1] != null && type.call(args[1]) === OBJECT && !("tag" in args[1] || "view" in args[1]) && !("subtree" in args[1]);
		var attrs = hasAttrs ? args[1] : {};
		var classAttrName = "class" in attrs ? "class" : "className";
		var cell = {tag: "div", attrs: {}};
		var match, classes = [];
		if (type.call(args[0]) != STRING) throw new Error("selector in m(selector, attrs, children) should be a string")
		while (match = parser.exec(args[0])) {
			if (match[1] === "" && match[2]) cell.tag = match[2];
			else if (match[1] === "#") cell.attrs.id = match[2];
			else if (match[1] === ".") classes.push(match[2]);
			else if (match[3][0] === "[") {
				var pair = attrParser.exec(match[3]);
				cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" :true)
			}
		}

		var children = hasAttrs ? args.slice(2) : args.slice(1);
		if (children.length === 1 && type.call(children[0]) === ARRAY) {
			cell.children = children[0]
		}
		else {
			cell.children = children
		}
		
		for (var attrName in attrs) {
			if (attrs.hasOwnProperty(attrName)) {
				if (attrName === classAttrName && attrs[attrName] != null && attrs[attrName] !== "") {
					classes.push(attrs[attrName])
					cell.attrs[attrName] = "" //create key in correct iteration order
				}
				else cell.attrs[attrName] = attrs[attrName]
			}
		}
		if (classes.length > 0) cell.attrs[classAttrName] = classes.join(" ");
		
		return cell
	}
	function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
		//`build` is a recursive function that manages creation/diffing/removal of DOM elements based on comparison between `data` and `cached`
		//the diff algorithm can be summarized as this:
		//1 - compare `data` and `cached`
		//2 - if they are different, copy `data` to `cached` and update the DOM based on what the difference is
		//3 - recursively apply this algorithm for every array and for the children of every virtual element

		//the `cached` data structure is essentially the same as the previous redraw's `data` data structure, with a few additions:
		//- `cached` always has a property called `nodes`, which is a list of DOM elements that correspond to the data represented by the respective virtual element
		//- in order to support attaching `nodes` as a property of `cached`, `cached` is *always* a non-primitive object, i.e. if the data was a string, then cached is a String instance. If data was `null` or `undefined`, cached is `new String("")`
		//- `cached also has a `configContext` property, which is the state storage object exposed by config(element, isInitialized, context)
		//- when `cached` is an Object, it represents a virtual element; when it's an Array, it represents a list of elements; when it's a String, Number or Boolean, it represents a text node

		//`parentElement` is a DOM element used for W3C DOM API calls
		//`parentTag` is only used for handling a corner case for textarea values
		//`parentCache` is used to remove nodes in some multi-node cases
		//`parentIndex` and `index` are used to figure out the offset of nodes. They're artifacts from before arrays started being flattened and are likely refactorable
		//`data` and `cached` are, respectively, the new and old nodes being diffed
		//`shouldReattach` is a flag indicating whether a parent node was recreated (if so, and if this node is reused, then this node must reattach itself to the new parent)
		//`editable` is a flag that indicates whether an ancestor is contenteditable
		//`namespace` indicates the closest HTML namespace as it cascades down from an ancestor
		//`configs` is a list of config functions to run after the topmost `build` call finishes running

		//there's logic that relies on the assumption that null and undefined data are equivalent to empty strings
		//- this prevents lifecycle surprises from procedural helpers that mix implicit and explicit return statements (e.g. function foo() {if (cond) return m("div")}
		//- it simplifies diffing code
		//data.toString() might throw or return null if data is the return value of Console.log in Firefox (behavior depends on version)
		try {if (data == null || data.toString() == null) data = "";} catch (e) {data = ""}
		if (data.subtree === "retain") return cached;
		var cachedType = type.call(cached), dataType = type.call(data);
		if (cached == null || cachedType !== dataType) {
			if (cached != null) {
				if (parentCache && parentCache.nodes) {
					var offset = index - parentIndex;
					var end = offset + (dataType === ARRAY ? data : cached.nodes).length;
					clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end))
				}
				else if (cached.nodes) clear(cached.nodes, cached)
			}
			cached = new data.constructor;
			if (cached.tag) cached = {}; //if constructor creates a virtual dom element, use a blank object as the base cached node instead of copying the virtual el (#277)
			cached.nodes = []
		}

		if (dataType === ARRAY) {
			//recursively flatten array
			for (var i = 0, len = data.length; i < len; i++) {
				if (type.call(data[i]) === ARRAY) {
					data = data.concat.apply([], data);
					i-- //check current index again and flatten until there are no more nested arrays at that index
					len = data.length
				}
			}
			
			var nodes = [], intact = cached.length === data.length, subArrayCount = 0;

			//keys algorithm: sort elements without recreating them if keys are present
			//1) create a map of all existing keys, and mark all for deletion
			//2) add new keys to map and mark them for addition
			//3) if key exists in new list, change action from deletion to a move
			//4) for each key, handle its corresponding action as marked in previous steps
			var DELETION = 1, INSERTION = 2 , MOVE = 3;
			var existing = {}, shouldMaintainIdentities = false;
			for (var i = 0; i < cached.length; i++) {
				if (cached[i] && cached[i].attrs && cached[i].attrs.key != null) {
					shouldMaintainIdentities = true;
					existing[cached[i].attrs.key] = {action: DELETION, index: i}
				}
			}
			
			var guid = 0
			for (var i = 0, len = data.length; i < len; i++) {
				if (data[i] && data[i].attrs && data[i].attrs.key != null) {
					for (var j = 0, len = data.length; j < len; j++) {
						if (data[j] && data[j].attrs && data[j].attrs.key == null) data[j].attrs.key = "__mithril__" + guid++
					}
					break
				}
			}
			
			if (shouldMaintainIdentities) {
				var keysDiffer = false
				if (data.length != cached.length) keysDiffer = true
				else for (var i = 0, cachedCell, dataCell; cachedCell = cached[i], dataCell = data[i]; i++) {
					if (cachedCell.attrs && dataCell.attrs && cachedCell.attrs.key != dataCell.attrs.key) {
						keysDiffer = true
						break
					}
				}
				
				if (keysDiffer) {
					for (var i = 0, len = data.length; i < len; i++) {
						if (data[i] && data[i].attrs) {
							if (data[i].attrs.key != null) {
								var key = data[i].attrs.key;
								if (!existing[key]) existing[key] = {action: INSERTION, index: i};
								else existing[key] = {
									action: MOVE,
									index: i,
									from: existing[key].index,
									element: cached.nodes[existing[key].index] || $document.createElement("div")
								}
							}
						}
					}
					var actions = []
					for (var prop in existing) actions.push(existing[prop])
					var changes = actions.sort(sortChanges);
					var newCached = new Array(cached.length)
					newCached.nodes = cached.nodes.slice()

					for (var i = 0, change; change = changes[i]; i++) {
						if (change.action === DELETION) {
							clear(cached[change.index].nodes, cached[change.index]);
							newCached.splice(change.index, 1)
						}
						if (change.action === INSERTION) {
							var dummy = $document.createElement("div");
							dummy.key = data[change.index].attrs.key;
							parentElement.insertBefore(dummy, parentElement.childNodes[change.index] || null);
							newCached.splice(change.index, 0, {attrs: {key: data[change.index].attrs.key}, nodes: [dummy]})
							newCached.nodes[change.index] = dummy
						}

						if (change.action === MOVE) {
							if (parentElement.childNodes[change.index] !== change.element && change.element !== null) {
								parentElement.insertBefore(change.element, parentElement.childNodes[change.index] || null)
							}
							newCached[change.index] = cached[change.from]
							newCached.nodes[change.index] = change.element
						}
					}
					cached = newCached;
				}
			}
			//end key algorithm

			for (var i = 0, cacheCount = 0, len = data.length; i < len; i++) {
				//diff each item in the array
				var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);
				if (item === undefined) continue;
				if (!item.nodes.intact) intact = false;
				if (item.$trusted) {
					//fix offset of next element if item was a trusted string w/ more than one html element
					//the first clause in the regexp matches elements
					//the second clause (after the pipe) matches text nodes
					subArrayCount += (item.match(/<[^\/]|\>\s*[^<]/g) || [0]).length
				}
				else subArrayCount += type.call(item) === ARRAY ? item.length : 1;
				cached[cacheCount++] = item
			}
			if (!intact) {
				//diff the array itself
				
				//update the list of DOM nodes by collecting the nodes from each item
				for (var i = 0, len = data.length; i < len; i++) {
					if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes)
				}
				//remove items from the end of the array if the new array is shorter than the old one
				//if errors ever happen here, the issue is most likely a bug in the construction of the `cached` data structure somewhere earlier in the program
				for (var i = 0, node; node = cached.nodes[i]; i++) {
					if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]])
				}
				if (data.length < cached.length) cached.length = data.length;
				cached.nodes = nodes
			}
		}
		else if (data != null && dataType === OBJECT) {
			var views = [], controllers = []
			while (data.view) {
				var view = data.view.$original || data.view
				var controllerIndex = m.redraw.strategy() == "diff" && cached.views ? cached.views.indexOf(view) : -1
				var controller = controllerIndex > -1 ? cached.controllers[controllerIndex] : new (data.controller || noop)
				var key = data && data.attrs && data.attrs.key
				data = pendingRequests == 0 || (cached && cached.controllers && cached.controllers.indexOf(controller) > -1) ? data.view(controller) : {tag: "placeholder"}
				if (data.subtree === "retain") return cached;
				if (key) {
					if (!data.attrs) data.attrs = {}
					data.attrs.key = key
				}
				if (controller.onunload) unloaders.push({controller: controller, handler: controller.onunload})
				views.push(view)
				controllers.push(controller)
			}
			if (!data.tag && controllers.length) throw new Error("Component template must return a virtual element, not an array, string, etc.")
			if (!data.attrs) data.attrs = {};
			if (!cached.attrs) cached.attrs = {};

			var dataAttrKeys = Object.keys(data.attrs)
			var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0)
			//if an element is different enough from the one in cache, recreate it
			if (data.tag != cached.tag || dataAttrKeys.sort().join() != Object.keys(cached.attrs).sort().join() || data.attrs.id != cached.attrs.id || data.attrs.key != cached.attrs.key || (m.redraw.strategy() == "all" && (!cached.configContext || cached.configContext.retain !== true)) || (m.redraw.strategy() == "diff" && cached.configContext && cached.configContext.retain === false)) {
				if (cached.nodes.length) clear(cached.nodes);
				if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) cached.configContext.onunload()
				if (cached.controllers) {
					for (var i = 0, controller; controller = cached.controllers[i]; i++) {
						if (typeof controller.onunload === FUNCTION) controller.onunload({preventDefault: noop})
					}
				}
			}
			if (type.call(data.tag) != STRING) return;

			var node, isNew = cached.nodes.length === 0;
			if (data.attrs.xmlns) namespace = data.attrs.xmlns;
			else if (data.tag === "svg") namespace = "http://www.w3.org/2000/svg";
			else if (data.tag === "math") namespace = "http://www.w3.org/1998/Math/MathML";
			
			if (isNew) {
				if (data.attrs.is) node = namespace === undefined ? $document.createElement(data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag, data.attrs.is);
				else node = namespace === undefined ? $document.createElement(data.tag) : $document.createElementNS(namespace, data.tag);
				cached = {
					tag: data.tag,
					//set attributes first, then create children
					attrs: hasKeys ? setAttributes(node, data.tag, data.attrs, {}, namespace) : data.attrs,
					children: data.children != null && data.children.length > 0 ?
						build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) :
						data.children,
					nodes: [node]
				};
				if (controllers.length) {
					cached.views = views
					cached.controllers = controllers
					for (var i = 0, controller; controller = controllers[i]; i++) {
						if (controller.onunload && controller.onunload.$old) controller.onunload = controller.onunload.$old
						if (pendingRequests && controller.onunload) {
							var onunload = controller.onunload
							controller.onunload = noop
							controller.onunload.$old = onunload
						}
					}
				}
				
				if (cached.children && !cached.children.nodes) cached.children.nodes = [];
				//edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
				if (data.tag === "select" && "value" in data.attrs) setAttributes(node, data.tag, {value: data.attrs.value}, {}, namespace);
				parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			else {
				node = cached.nodes[0];
				if (hasKeys) setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
				cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
				cached.nodes.intact = true;
				if (controllers.length) {
					cached.views = views
					cached.controllers = controllers
				}
				if (shouldReattach === true && node != null) parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			//schedule configs to be called. They are called after `build` finishes running
			if (typeof data.attrs["config"] === FUNCTION) {
				var context = cached.configContext = cached.configContext || {};

				// bind
				var callback = function(data, args) {
					return function() {
						return data.attrs["config"].apply(data, args)
					}
				};
				configs.push(callback(data, [node, !isNew, context, cached]))
			}
		}
		else if (typeof data != FUNCTION) {
			//handle text nodes
			var nodes;
			if (cached.nodes.length === 0) {
				if (data.$trusted) {
					nodes = injectHTML(parentElement, index, data)
				}
				else {
					nodes = [$document.createTextNode(data)];
					if (!parentElement.nodeName.match(voidElements)) parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null)
				}
				cached = "string number boolean".indexOf(typeof data) > -1 ? new data.constructor(data) : data;
				cached.nodes = nodes
			}
			else if (cached.valueOf() !== data.valueOf() || shouldReattach === true) {
				nodes = cached.nodes;
				if (!editable || editable !== $document.activeElement) {
					if (data.$trusted) {
						clear(nodes, cached);
						nodes = injectHTML(parentElement, index, data)
					}
					else {
						//corner case: replacing the nodeValue of a text node that is a child of a textarea/contenteditable doesn't work
						//we need to update the value property of the parent textarea or the innerHTML of the contenteditable element instead
						if (parentTag === "textarea") parentElement.value = data;
						else if (editable) editable.innerHTML = data;
						else {
							if (nodes[0].nodeType === 1 || nodes.length > 1) { //was a trusted string
								clear(cached.nodes, cached);
								nodes = [$document.createTextNode(data)]
							}
							parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null);
							nodes[0].nodeValue = data
						}
					}
				}
				cached = new data.constructor(data);
				cached.nodes = nodes
			}
			else cached.nodes.intact = true
		}

		return cached
	}
	function sortChanges(a, b) {return a.action - b.action || a.index - b.index}
	function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
		for (var attrName in dataAttrs) {
			var dataAttr = dataAttrs[attrName];
			var cachedAttr = cachedAttrs[attrName];
			if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {
				cachedAttrs[attrName] = dataAttr;
				try {
					//`config` isn't a real attributes, so ignore it
					if (attrName === "config" || attrName == "key") continue;
					//hook event handlers to the auto-redrawing system
					else if (typeof dataAttr === FUNCTION && attrName.indexOf("on") === 0) {
						node[attrName] = autoredraw(dataAttr, node)
					}
					//handle `style: {...}`
					else if (attrName === "style" && dataAttr != null && type.call(dataAttr) === OBJECT) {
						for (var rule in dataAttr) {
							if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule]
						}
						for (var rule in cachedAttr) {
							if (!(rule in dataAttr)) node.style[rule] = ""
						}
					}
					//handle SVG
					else if (namespace != null) {
						if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr);
						else if (attrName === "className") node.setAttribute("class", dataAttr);
						else node.setAttribute(attrName, dataAttr)
					}
					//handle cases that are properties (but ignore cases where we should use setAttribute instead)
					//- list and form are typically used as strings, but are DOM element references in js
					//- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
					else if (attrName in node && !(attrName === "list" || attrName === "style" || attrName === "form" || attrName === "type" || attrName === "width" || attrName === "height")) {
						//#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
						if (tag !== "input" || node[attrName] !== dataAttr) node[attrName] = dataAttr
					}
					else node.setAttribute(attrName, dataAttr)
				}
				catch (e) {
					//swallow IE's invalid argument errors to mimic HTML's fallback-to-doing-nothing-on-invalid-attributes behavior
					if (e.message.indexOf("Invalid argument") < 0) throw e
				}
			}
			//#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
			else if (attrName === "value" && tag === "input" && node.value != dataAttr) {
				node.value = dataAttr
			}
		}
		return cachedAttrs
	}
	function clear(nodes, cached) {
		for (var i = nodes.length - 1; i > -1; i--) {
			if (nodes[i] && nodes[i].parentNode) {
				try {nodes[i].parentNode.removeChild(nodes[i])}
				catch (e) {} //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
				cached = [].concat(cached);
				if (cached[i]) unload(cached[i])
			}
		}
		if (nodes.length != 0) nodes.length = 0
	}
	function unload(cached) {
		if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) {
			cached.configContext.onunload();
			cached.configContext.onunload = null
		}
		if (cached.controllers) {
			for (var i = 0, controller; controller = cached.controllers[i]; i++) {
				if (typeof controller.onunload === FUNCTION) controller.onunload({preventDefault: noop});
			}
		}
		if (cached.children) {
			if (type.call(cached.children) === ARRAY) {
				for (var i = 0, child; child = cached.children[i]; i++) unload(child)
			}
			else if (cached.children.tag) unload(cached.children)
		}
	}
	function injectHTML(parentElement, index, data) {
		var nextSibling = parentElement.childNodes[index];
		if (nextSibling) {
			var isElement = nextSibling.nodeType != 1;
			var placeholder = $document.createElement("span");
			if (isElement) {
				parentElement.insertBefore(placeholder, nextSibling || null);
				placeholder.insertAdjacentHTML("beforebegin", data);
				parentElement.removeChild(placeholder)
			}
			else nextSibling.insertAdjacentHTML("beforebegin", data)
		}
		else parentElement.insertAdjacentHTML("beforeend", data);
		var nodes = [];
		while (parentElement.childNodes[index] !== nextSibling) {
			nodes.push(parentElement.childNodes[index]);
			index++
		}
		return nodes
	}
	function autoredraw(callback, object) {
		return function(e) {
			e = e || event;
			m.redraw.strategy("diff");
			m.startComputation();
			try {return callback.call(object, e)}
			finally {
				endFirstComputation()
			}
		}
	}

	var html;
	var documentNode = {
		appendChild: function(node) {
			if (html === undefined) html = $document.createElement("html");
			if ($document.documentElement && $document.documentElement !== node) {
				$document.replaceChild(node, $document.documentElement)
			}
			else $document.appendChild(node);
			this.childNodes = $document.childNodes
		},
		insertBefore: function(node) {
			this.appendChild(node)
		},
		childNodes: []
	};
	var nodeCache = [], cellCache = {};
	m.render = function(root, cell, forceRecreation) {
		var configs = [];
		if (!root) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.");
		var id = getCellCacheKey(root);
		var isDocumentRoot = root === $document;
		var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
		if (isDocumentRoot && cell.tag != "html") cell = {tag: "html", attrs: {}, children: cell};
		if (cellCache[id] === undefined) clear(node.childNodes);
		if (forceRecreation === true) reset(root);
		cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs);
		for (var i = 0, len = configs.length; i < len; i++) configs[i]()
	};
	function getCellCacheKey(element) {
		var index = nodeCache.indexOf(element);
		return index < 0 ? nodeCache.push(element) - 1 : index
	}

	m.trust = function(value) {
		value = new String(value);
		value.$trusted = true;
		return value
	};

	function gettersetter(store) {
		var prop = function() {
			if (arguments.length) store = arguments[0];
			return store
		};

		prop.toJSON = function() {
			return store
		};

		return prop
	}

	m.prop = function (store) {
		//note: using non-strict equality check here because we're checking if store is null OR undefined
		if (((store != null && type.call(store) === OBJECT) || typeof store === FUNCTION) && typeof store.then === FUNCTION) {
			return propify(store)
		}

		return gettersetter(store)
	};

	var roots = [], components = [], controllers = [], lastRedrawId = null, lastRedrawCallTime = 0, computePreRedrawHook = null, computePostRedrawHook = null, prevented = false, topComponent, unloaders = [];
	var FRAME_BUDGET = 16; //60 frames per second = 1 call per 16 ms
	function parameterize(component, args) {
		var controller = function() {
			return (component.controller || noop).apply(this, args) || this
		}
		var view = function(ctrl) {
			if (arguments.length > 1) args = args.concat([].slice.call(arguments, 1))
			return component.view.apply(component, args ? [ctrl].concat(args) : [ctrl])
		}
		view.$original = component.view
		var output = {controller: controller, view: view}
		if (args[0] && args[0].key != null) output.attrs = {key: args[0].key}
		return output
	}
	m.component = function(component) {
		return parameterize(component, [].slice.call(arguments, 1))
	}
	m.mount = m.module = function(root, component) {
		if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
		var index = roots.indexOf(root);
		if (index < 0) index = roots.length;
		
		var isPrevented = false;
		var event = {preventDefault: function() {
			isPrevented = true;
			computePreRedrawHook = computePostRedrawHook = null;
		}};
		for (var i = 0, unloader; unloader = unloaders[i]; i++) {
			unloader.handler.call(unloader.controller, event)
			unloader.controller.onunload = null
		}
		if (isPrevented) {
			for (var i = 0, unloader; unloader = unloaders[i]; i++) unloader.controller.onunload = unloader.handler
		}
		else unloaders = []
		
		if (controllers[index] && typeof controllers[index].onunload === FUNCTION) {
			controllers[index].onunload(event)
		}
		
		if (!isPrevented) {
			m.redraw.strategy("all");
			m.startComputation();
			roots[index] = root;
			if (arguments.length > 2) component = subcomponent(component, [].slice.call(arguments, 2))
			var currentComponent = topComponent = component = component || {controller: function() {}};
			var constructor = component.controller || noop
			var controller = new constructor;
			//controllers may call m.mount recursively (via m.route redirects, for example)
			//this conditional ensures only the last recursive m.mount call is applied
			if (currentComponent === topComponent) {
				controllers[index] = controller;
				components[index] = component
			}
			endFirstComputation();
			return controllers[index]
		}
	};
	var redrawing = false
	m.redraw = function(force) {
		if (redrawing) return
		redrawing = true
		//lastRedrawId is a positive number if a second redraw is requested before the next animation frame
		//lastRedrawID is null if it's the first redraw and not an event handler
		if (lastRedrawId && force !== true) {
			//when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
			//when rAF: always reschedule redraw
			if ($requestAnimationFrame === window.requestAnimationFrame || new Date - lastRedrawCallTime > FRAME_BUDGET) {
				if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId);
				lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET)
			}
		}
		else {
			redraw();
			lastRedrawId = $requestAnimationFrame(function() {lastRedrawId = null}, FRAME_BUDGET)
		}
		redrawing = false
	};
	m.redraw.strategy = m.prop();
	function redraw() {
		if (computePreRedrawHook) {
			computePreRedrawHook()
			computePreRedrawHook = null
		}
		for (var i = 0, root; root = roots[i]; i++) {
			if (controllers[i]) {
				var args = components[i].controller && components[i].controller.$$args ? [controllers[i]].concat(components[i].controller.$$args) : [controllers[i]]
				m.render(root, components[i].view ? components[i].view(controllers[i], args) : "")
			}
		}
		//after rendering within a routed context, we need to scroll back to the top, and fetch the document title for history.pushState
		if (computePostRedrawHook) {
			computePostRedrawHook();
			computePostRedrawHook = null
		}
		lastRedrawId = null;
		lastRedrawCallTime = new Date;
		m.redraw.strategy("diff")
	}

	var pendingRequests = 0;
	m.startComputation = function() {pendingRequests++};
	m.endComputation = function() {
		pendingRequests = Math.max(pendingRequests - 1, 0);
		if (pendingRequests === 0) m.redraw()
	};
	var endFirstComputation = function() {
		if (m.redraw.strategy() == "none") {
			pendingRequests--
			m.redraw.strategy("diff")
		}
		else m.endComputation();
	}

	m.withAttr = function(prop, withAttrCallback) {
		return function(e) {
			e = e || event;
			var currentTarget = e.currentTarget || this;
			withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
		}
	};

	//routing
	var modes = {pathname: "", hash: "#", search: "?"};
	var redirect = noop, routeParams, currentRoute, isDefaultRoute = false;
	m.route = function() {
		//m.route()
		if (arguments.length === 0) return currentRoute;
		//m.route(el, defaultRoute, routes)
		else if (arguments.length === 3 && type.call(arguments[1]) === STRING) {
			var root = arguments[0], defaultRoute = arguments[1], router = arguments[2];
			redirect = function(source) {
				var path = currentRoute = normalizeRoute(source);
				if (!routeByValue(root, router, path)) {
					if (isDefaultRoute) throw new Error("Ensure the default route matches one of the routes defined in m.route")
					isDefaultRoute = true
					m.route(defaultRoute, true)
					isDefaultRoute = false
				}
			};
			var listener = m.route.mode === "hash" ? "onhashchange" : "onpopstate";
			window[listener] = function() {
				var path = $location[m.route.mode]
				if (m.route.mode === "pathname") path += $location.search
				if (currentRoute != normalizeRoute(path)) {
					redirect(path)
				}
			};
			computePreRedrawHook = setScroll;
			window[listener]()
		}
		//config: m.route
		else if (arguments[0].addEventListener || arguments[0].attachEvent) {
			var element = arguments[0];
			var isInitialized = arguments[1];
			var context = arguments[2];
			var vdom = arguments[3];
			element.href = (m.route.mode !== 'pathname' ? $location.pathname : '') + modes[m.route.mode] + vdom.attrs.href;
			if (element.addEventListener) {
				element.removeEventListener("click", routeUnobtrusive);
				element.addEventListener("click", routeUnobtrusive)
			}
			else {
				element.detachEvent("onclick", routeUnobtrusive);
				element.attachEvent("onclick", routeUnobtrusive)
			}
		}
		//m.route(route, params, shouldReplaceHistoryEntry)
		else if (type.call(arguments[0]) === STRING) {
			var oldRoute = currentRoute;
			currentRoute = arguments[0];
			var args = arguments[1] || {}
			var queryIndex = currentRoute.indexOf("?")
			var params = queryIndex > -1 ? parseQueryString(currentRoute.slice(queryIndex + 1)) : {}
			for (var i in args) params[i] = args[i]
			var querystring = buildQueryString(params)
			var currentPath = queryIndex > -1 ? currentRoute.slice(0, queryIndex) : currentRoute
			if (querystring) currentRoute = currentPath + (currentPath.indexOf("?") === -1 ? "?" : "&") + querystring;

			var shouldReplaceHistoryEntry = (arguments.length === 3 ? arguments[2] : arguments[1]) === true || oldRoute === arguments[0];

			if (window.history.pushState) {
				computePreRedrawHook = setScroll
				computePostRedrawHook = function() {
					window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, $document.title, modes[m.route.mode] + currentRoute);
				};
				redirect(modes[m.route.mode] + currentRoute)
			}
			else {
				$location[m.route.mode] = currentRoute
				redirect(modes[m.route.mode] + currentRoute)
			}
		}
	};
	m.route.param = function(key) {
		if (!routeParams) throw new Error("You must call m.route(element, defaultRoute, routes) before calling m.route.param()")
		return routeParams[key]
	};
	m.route.mode = "search";
	function normalizeRoute(route) {
		return route.slice(modes[m.route.mode].length)
	}
	function routeByValue(root, router, path) {
		routeParams = {};

		var queryStart = path.indexOf("?");
		if (queryStart !== -1) {
			routeParams = parseQueryString(path.substr(queryStart + 1, path.length));
			path = path.substr(0, queryStart)
		}

		// Get all routes and check if there's
		// an exact match for the current path
		var keys = Object.keys(router);
		var index = keys.indexOf(path);
		if(index !== -1){
			m.mount(root, router[keys [index]]);
			return true;
		}

		for (var route in router) {
			if (route === path) {
				m.mount(root, router[route]);
				return true
			}

			var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");

			if (matcher.test(path)) {
				path.replace(matcher, function() {
					var keys = route.match(/:[^\/]+/g) || [];
					var values = [].slice.call(arguments, 1, -2);
					for (var i = 0, len = keys.length; i < len; i++) routeParams[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
					m.mount(root, router[route])
				});
				return true
			}
		}
	}
	function routeUnobtrusive(e) {
		e = e || event;
		if (e.ctrlKey || e.metaKey || e.which === 2) return;
		if (e.preventDefault) e.preventDefault();
		else e.returnValue = false;
		var currentTarget = e.currentTarget || e.srcElement;
		var args = m.route.mode === "pathname" && currentTarget.search ? parseQueryString(currentTarget.search.slice(1)) : {};
		while (currentTarget && currentTarget.nodeName.toUpperCase() != "A") currentTarget = currentTarget.parentNode
		m.route(currentTarget[m.route.mode].slice(modes[m.route.mode].length), args)
	}
	function setScroll() {
		if (m.route.mode != "hash" && $location.hash) $location.hash = $location.hash;
		else window.scrollTo(0, 0)
	}
	function buildQueryString(object, prefix) {
		var duplicates = {}
		var str = []
		for (var prop in object) {
			var key = prefix ? prefix + "[" + prop + "]" : prop
			var value = object[prop]
			var valueType = type.call(value)
			var pair = (value === null) ? encodeURIComponent(key) :
				valueType === OBJECT ? buildQueryString(value, key) :
				valueType === ARRAY ? value.reduce(function(memo, item) {
					if (!duplicates[key]) duplicates[key] = {}
					if (!duplicates[key][item]) {
						duplicates[key][item] = true
						return memo.concat(encodeURIComponent(key) + "=" + encodeURIComponent(item))
					}
					return memo
				}, []).join("&") :
				encodeURIComponent(key) + "=" + encodeURIComponent(value)
			if (value !== undefined) str.push(pair)
		}
		return str.join("&")
	}
	function parseQueryString(str) {
		if (str.charAt(0) === "?") str = str.substring(1);
		
		var pairs = str.split("&"), params = {};
		for (var i = 0, len = pairs.length; i < len; i++) {
			var pair = pairs[i].split("=");
			var key = decodeURIComponent(pair[0])
			var value = pair.length == 2 ? decodeURIComponent(pair[1]) : null
			if (params[key] != null) {
				if (type.call(params[key]) !== ARRAY) params[key] = [params[key]]
				params[key].push(value)
			}
			else params[key] = value
		}
		return params
	}
	m.route.buildQueryString = buildQueryString
	m.route.parseQueryString = parseQueryString
	
	function reset(root) {
		var cacheKey = getCellCacheKey(root);
		clear(root.childNodes, cellCache[cacheKey]);
		cellCache[cacheKey] = undefined
	}

	m.deferred = function () {
		var deferred = new Deferred();
		deferred.promise = propify(deferred.promise);
		return deferred
	};
	function propify(promise, initialValue) {
		var prop = m.prop(initialValue);
		promise.then(prop);
		prop.then = function(resolve, reject) {
			return propify(promise.then(resolve, reject), initialValue)
		};
		return prop
	}
	//Promiz.mithril.js | Zolmeister | MIT
	//a modified version of Promiz.js, which does not conform to Promises/A+ for two reasons:
	//1) `then` callbacks are called synchronously (because setTimeout is too slow, and the setImmediate polyfill is too big
	//2) throwing subclasses of Error cause the error to be bubbled up instead of triggering rejection (because the spec does not account for the important use case of default browser error handling, i.e. message w/ line number)
	function Deferred(successCallback, failureCallback) {
		var RESOLVING = 1, REJECTING = 2, RESOLVED = 3, REJECTED = 4;
		var self = this, state = 0, promiseValue = 0, next = [];

		self["promise"] = {};

		self["resolve"] = function(value) {
			if (!state) {
				promiseValue = value;
				state = RESOLVING;

				fire()
			}
			return this
		};

		self["reject"] = function(value) {
			if (!state) {
				promiseValue = value;
				state = REJECTING;

				fire()
			}
			return this
		};

		self.promise["then"] = function(successCallback, failureCallback) {
			var deferred = new Deferred(successCallback, failureCallback);
			if (state === RESOLVED) {
				deferred.resolve(promiseValue)
			}
			else if (state === REJECTED) {
				deferred.reject(promiseValue)
			}
			else {
				next.push(deferred)
			}
			return deferred.promise
		};

		function finish(type) {
			state = type || REJECTED;
			next.map(function(deferred) {
				state === RESOLVED && deferred.resolve(promiseValue) || deferred.reject(promiseValue)
			})
		}

		function thennable(then, successCallback, failureCallback, notThennableCallback) {
			if (((promiseValue != null && type.call(promiseValue) === OBJECT) || typeof promiseValue === FUNCTION) && typeof then === FUNCTION) {
				try {
					// count protects against abuse calls from spec checker
					var count = 0;
					then.call(promiseValue, function(value) {
						if (count++) return;
						promiseValue = value;
						successCallback()
					}, function (value) {
						if (count++) return;
						promiseValue = value;
						failureCallback()
					})
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					failureCallback()
				}
			} else {
				notThennableCallback()
			}
		}

		function fire() {
			// check if it's a thenable
			var then;
			try {
				then = promiseValue && promiseValue.then
			}
			catch (e) {
				m.deferred.onerror(e);
				promiseValue = e;
				state = REJECTING;
				return fire()
			}
			thennable(then, function() {
				state = RESOLVING;
				fire()
			}, function() {
				state = REJECTING;
				fire()
			}, function() {
				try {
					if (state === RESOLVING && typeof successCallback === FUNCTION) {
						promiseValue = successCallback(promiseValue)
					}
					else if (state === REJECTING && typeof failureCallback === "function") {
						promiseValue = failureCallback(promiseValue);
						state = RESOLVING
					}
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					return finish()
				}

				if (promiseValue === self) {
					promiseValue = TypeError();
					finish()
				}
				else {
					thennable(then, function () {
						finish(RESOLVED)
					}, finish, function () {
						finish(state === RESOLVING && RESOLVED)
					})
				}
			})
		}
	}
	m.deferred.onerror = function(e) {
		if (type.call(e) === "[object Error]" && !e.constructor.toString().match(/ Error/)) throw e
	};

	m.sync = function(args) {
		var method = "resolve";
		function synchronizer(pos, resolved) {
			return function(value) {
				results[pos] = value;
				if (!resolved) method = "reject";
				if (--outstanding === 0) {
					deferred.promise(results);
					deferred[method](results)
				}
				return value
			}
		}

		var deferred = m.deferred();
		var outstanding = args.length;
		var results = new Array(outstanding);
		if (args.length > 0) {
			for (var i = 0; i < args.length; i++) {
				args[i].then(synchronizer(i, true), synchronizer(i, false))
			}
		}
		else deferred.resolve([]);

		return deferred.promise
	};
	function identity(value) {return value}

	function ajax(options) {
		if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
			var callbackKey = "mithril_callback_" + new Date().getTime() + "_" + (Math.round(Math.random() * 1e16)).toString(36);
			var script = $document.createElement("script");

			window[callbackKey] = function(resp) {
				script.parentNode.removeChild(script);
				options.onload({
					type: "load",
					target: {
						responseText: resp
					}
				});
				window[callbackKey] = undefined
			};

			script.onerror = function(e) {
				script.parentNode.removeChild(script);

				options.onerror({
					type: "error",
					target: {
						status: 500,
						responseText: JSON.stringify({error: "Error making jsonp request"})
					}
				});
				window[callbackKey] = undefined;

				return false
			};

			script.onload = function(e) {
				return false
			};

			script.src = options.url
				+ (options.url.indexOf("?") > 0 ? "&" : "?")
				+ (options.callbackKey ? options.callbackKey : "callback")
				+ "=" + callbackKey
				+ "&" + buildQueryString(options.data || {});
			$document.body.appendChild(script)
		}
		else {
			var xhr = new window.XMLHttpRequest;
			xhr.open(options.method, options.url, true, options.user, options.password);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status < 300) options.onload({type: "load", target: xhr});
					else options.onerror({type: "error", target: xhr})
				}
			};
			if (options.serialize === JSON.stringify && options.data && options.method !== "GET") {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (options.deserialize === JSON.parse) {
				xhr.setRequestHeader("Accept", "application/json, text/*");
			}
			if (typeof options.config === FUNCTION) {
				var maybeXhr = options.config(xhr, options);
				if (maybeXhr != null) xhr = maybeXhr
			}

			var data = options.method === "GET" || !options.data ? "" : options.data
			if (data && (type.call(data) != STRING && data.constructor != window.FormData)) {
				throw "Request data should be either be a string or FormData. Check the `serialize` option in `m.request`";
			}
			xhr.send(data);
			return xhr
		}
	}
	function bindData(xhrOptions, data, serialize) {
		if (xhrOptions.method === "GET" && xhrOptions.dataType != "jsonp") {
			var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&";
			var querystring = buildQueryString(data);
			xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : "")
		}
		else xhrOptions.data = serialize(data);
		return xhrOptions
	}
	function parameterizeUrl(url, data) {
		var tokens = url.match(/:[a-z]\w+/gi);
		if (tokens && data) {
			for (var i = 0; i < tokens.length; i++) {
				var key = tokens[i].slice(1);
				url = url.replace(tokens[i], data[key]);
				delete data[key]
			}
		}
		return url
	}

	m.request = function(xhrOptions) {
		if (xhrOptions.background !== true) m.startComputation();
		var deferred = new Deferred();
		var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === "jsonp";
		var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
		var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
		var extract = isJSONP ? function(jsonp) {return jsonp.responseText} : xhrOptions.extract || function(xhr) {
			return xhr.responseText.length === 0 && deserialize === JSON.parse ? null : xhr.responseText
		};
		xhrOptions.method = (xhrOptions.method || 'GET').toUpperCase();
		xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
		xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
		xhrOptions.onload = xhrOptions.onerror = function(e) {
			try {
				e = e || event;
				var unwrap = (e.type === "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
				var response = unwrap(deserialize(extract(e.target, xhrOptions)), e.target);
				if (e.type === "load") {
					if (type.call(response) === ARRAY && xhrOptions.type) {
						for (var i = 0; i < response.length; i++) response[i] = new xhrOptions.type(response[i])
					}
					else if (xhrOptions.type) response = new xhrOptions.type(response)
				}
				deferred[e.type === "load" ? "resolve" : "reject"](response)
			}
			catch (e) {
				m.deferred.onerror(e);
				deferred.reject(e)
			}
			if (xhrOptions.background !== true) m.endComputation()
		};
		ajax(xhrOptions);
		deferred.promise = propify(deferred.promise, xhrOptions.initialValue);
		return deferred.promise
	};

	//testing API
	m.deps = function(mock) {
		initialize(window = mock || window);
		return window;
	};
	//for internal testing only, do not use `m.deps.factory`
	m.deps.factory = app;

	return m
})(typeof window != "undefined" ? window : {});

if (typeof module != "undefined" && module !== null && module.exports) module.exports = m;
else if (typeof define === "function" && define.amd) define(function() {return m});

},{}]},{},[6]);
