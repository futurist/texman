/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _canvas = __webpack_require__(1);

	var _canvas2 = _interopRequireDefault(_canvas);

	var _addEditorDom = __webpack_require__(17);

	var _addEditorDom2 = _interopRequireDefault(_addEditorDom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	new _canvas2.default();

	// import editor from './editor'
	// new editor()

	(0, _addEditorDom2.default)();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	var _global = __webpack_require__(4);

	var Global = _interopRequireWildcard(_global);

	var _WidgetDiv = __webpack_require__(5);

	var _WidgetDiv2 = _interopRequireDefault(_WidgetDiv);

	var _WidgetCanvas = __webpack_require__(13);

	var _WidgetCanvas2 = _interopRequireDefault(_WidgetCanvas);

	var _JsonEditor = __webpack_require__(11);

	var _JsonEditor2 = _interopRequireDefault(_JsonEditor);

	var _Events = __webpack_require__(15);

	var _Events2 = _interopRequireDefault(_Events);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Canvas = function Canvas() {
	  _classCallCheck(this, Canvas);

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
	    var isInput = isInputElementActive();
	    if (isInput) return;
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
	    if (isInput) return;

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

	          _Events2.default.emit('remove', evt);
	          handled = true;
	          break;

	        case 37:
	          // left
	          _Events2.default.emit('moveBy', { x: -Global.GRID_SIZE, y: 0 });
	          handled = true;
	          break;

	        case 38:
	          // up
	          _Events2.default.emit('moveBy', { x: 0, y: -Global.GRID_SIZE });
	          handled = true;
	          break;

	        case 39:
	          // right
	          _Events2.default.emit('moveBy', { x: Global.GRID_SIZE, y: 0 });
	          handled = true;
	          break;

	        case 40:
	          // down
	          _Events2.default.emit('moveBy', { x: 0, y: Global.GRID_SIZE });
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
	          _Events2.default.emit('duplicate', evt);
	          handled = true;
	          break;

	        case 37:
	          // left
	          _Events2.default.emit('moveBy', { x: -1, y: 0 });
	          handled = true;
	          break;

	        case 38:
	          // up
	          _Events2.default.emit('moveBy', { x: 0, y: -1 });
	          handled = true;
	          break;

	        case 39:
	          // right
	          _Events2.default.emit('moveBy', { x: 1, y: 0 });
	          handled = true;
	          break;

	        case 40:
	          // down
	          _Events2.default.emit('moveBy', { x: 0, y: 1 });
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
	          // left
	          _Events2.default.emit('resizeBy', { w: -Global.GRID_SIZE, h: 0 });
	          handled = true;
	          break;

	        case 38:
	          // up
	          _Events2.default.emit('resizeBy', { w: 0, h: -Global.GRID_SIZE });
	          handled = true;
	          break;

	        case 39:
	          // right
	          _Events2.default.emit('resizeBy', { w: Global.GRID_SIZE, h: 0 });
	          handled = true;
	          break;

	        case 40:
	          // down
	          _Events2.default.emit('resizeBy', { w: 0, h: Global.GRID_SIZE });
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
	          // left
	          _Events2.default.emit('resizeBy', { w: -1, h: 0 });
	          handled = true;
	          break;

	        case 38:
	          // up
	          _Events2.default.emit('resizeBy', { w: 0, h: -1 });
	          handled = true;
	          break;

	        case 39:
	          // right
	          _Events2.default.emit('resizeBy', { w: 1, h: 0 });
	          handled = true;
	          break;

	        case 40:
	          // down
	          _Events2.default.emit('resizeBy', { w: 0, h: 1 });
	          handled = true;
	          break;

	      }
	    }

	    if (handled) {
	      evt.preventDefault();
	      return;
	    }
	  }
	};

	exports.default = Canvas;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {var m = (function app(window, undefined) {
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
							if (data[j] && data[j].attrs && data[j].attrs.key == null) data[j].attrs.key = data[j].attrs['data-key'] = "__mithril__" + guid++
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
	else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {return m}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

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
	exports.objectPath = objectPath;
	exports.removeClass = removeClass;
	exports.addClass = addClass;
	exports.RandomColor = RandomColor;
	exports.NewID = NewID;
	exports.applyStyle = applyStyle;

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

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
	var BORDER_BOX = exports.BORDER_BOX = window.getComputedStyle(document.body).boxSizing === "border-box";
	var MIN_WIDTH = exports.MIN_WIDTH = 2;
	var GRID_SIZE = exports.GRID_SIZE = 5;
	var POINT_WIDTH = exports.POINT_WIDTH = 10;
	var POINT_HEIGHT = exports.POINT_HEIGHT = 10;

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
	        var dest = arguments[i];
	        for (var prop in dest) {
	            if (dest.hasOwnProperty(prop)) {
	                var type = Object.prototype.toString.call(dest[prop]);
	                if (type === '[object Object]') {
	                    obj[prop] = obj[prop] || {};
	                    _deepCopy(obj[prop], dest[prop]);
	                } else if (type === '[object Array]') {
	                    obj[prop] = obj[prop] || [];
	                    _deepCopy(obj[prop], dest[prop]);
	                } else {
	                    obj[prop] = clone(dest[prop]);
	                }
	            }
	        }
	    }
	    return obj;
	}

	function _extend(obj) {
	    obj = obj || {};
	    if (arguments.length < 2) return obj;
	    for (var i = 1; i < arguments.length; i++) {
	        var dest = arguments[i];
	        for (var prop in dest) {
	            if (dest.hasOwnProperty(prop)) {
	                var type = Object.prototype.toString.call(dest[prop]);
	                if (type === '[object Object]') {
	                    obj[prop] = obj[prop] || {};
	                    _extend(obj[prop], dest[prop]);
	                } else if (type === '[object Array]') {
	                    obj[prop] = obj[prop] || [];
	                    _extend(obj[prop], dest[prop]);
	                } else {
	                    obj[prop] = dest[prop];
	                }
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

	function objectPath(obj, is, value) {
	    if (typeof is == 'string') return objectPath(obj, is.split('.'), value);else if (is.length == 1 && value !== undefined) return obj[is[0]] = value;else if (is.length == 0) return obj;else return objectPath(obj[is[0]], is.slice(1), value);
	}

	var addToObject = exports.addToObject = function addToObject(obj, key, value) {
	    if (Object.prototype.toString.call(obj) == "[object Array]") {
	        if (obj.indexOf(key) < 0) obj.push(key);
	    } else {
	        if (!(key in obj)) {
	            obj[key] = value;
	        }
	    }
	};

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
	    var pxReg = /^padding|^margin|size$|width$|height$|radius$|left$|top$|right$|bottom$/i;
	    var quoteReg = /family$/i;
	    // try{ el.style = el.style||{} } catch(e){}
	    for (var i in styleObj) {
	        var attr = styleObj[i];
	        attr = pxReg.test(i) ? attr + 'px' : attr;
	        attr = quoteReg.test(i) ? '"' + attr + '"' : attr;
	        el.style[i] = attr;
	    }
	}
	var rectsIntersect = exports.rectsIntersect = function rectsIntersect(r1, r2) {
	    return r2.left <= r1.left + r1.width && r2.left + r2.width >= r1.left && r2.top <= r1.top + r1.height && r2.top + r2.height >= r1.top;
	};

	var debug = exports.debug = function debug(msg) {
	    document.querySelector('#debug').innerHTML = msg;
	};

	var _exlucdeJsonStyle = exports._exlucdeJsonStyle = function _exlucdeJsonStyle(propStyle) {
	    return _exclude(propStyle, ['borderWidth', 'borderStyle', 'borderColor', 'backgroundColor', 'padding']);
	};
	/**
	 * applyProp from this.Prop, remove unused props, and apply style to int width/height etc.
	 * @param  {[type]} thisProp [description]
	 * @return {[type]}          [description]
	 */
	var applyProp = exports.applyProp = function applyProp(thisProp) {
	    var Prop = _exclude(thisProp, ['eventData', 'isNew']);
	    Prop.style = clone(thisProp.style);
	    if (thisProp.style.borderWidth && thisProp.style.borderStyle && thisProp.style.borderColor) {
	        Prop.style.border = thisProp.style.borderWidth + 'px ' + thisProp.style.borderStyle + ' ' + thisProp.style.borderColor;
	    }
	    applyStyle(Prop, thisProp.style);
	    Prop.style = _exlucdeJsonStyle(Prop.style);
	    if (Prop.class) Prop.class = Prop.class.replace(/\s+/, ' ').trim();
	    if (Prop.className) Prop.className = Prop.className.replace(/\s+/, ' ').trim();
	    return Prop;
	};

	/**
	 * get outer rect of div/container that had a border style
	 * @param  {[type]} style [description]
	 * @return {[type]}       [description]
	 */
	var getOuterRect = exports.getOuterRect = function getOuterRect(style) {
	    return {
	        left: style.left,
	        top: style.top,
	        width: BORDER_BOX ? style.width : style.width + (style.borderLeftWidth || 0) + (style.borderRightWidth || 0),
	        height: BORDER_BOX ? style.height : style.height + (style.borderTopWidth || 0) + (style.borderBottomWidth || 0)
	    };
	};

	/**
	 * curTool for canvas & layer to determine type
	 * @type {String}
	 */
	var curTool = exports.curTool = 'plain';

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	var _global = __webpack_require__(4);

	var Global = _interopRequireWildcard(_global);

	var _LayerBaseClass2 = __webpack_require__(6);

	var _LayerBaseClass3 = _interopRequireDefault(_LayerBaseClass2);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

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
	    key: 'onRectChange',
	    value: function onRectChange() {
	      _get(Object.getPrototypeOf(WidgetDiv.prototype), 'onRectChange', this).call(this);
	    }
	  }, {
	    key: 'onSelected',
	    value: function onSelected() {
	      _get(Object.getPrototypeOf(WidgetDiv.prototype), 'onSelected', this).call(this);
	    }
	  }, {
	    key: 'onUnSelected',
	    value: function onUnSelected() {
	      _mithril2.default.mount(document.querySelector('.editor'), null);
	      _get(Object.getPrototypeOf(WidgetDiv.prototype), 'onUnSelected', this).call(this);
	    }
	  }, {
	    key: 'getChildren',
	    value: function getChildren() {
	      var data = this.jsonData();
	      var isRadio = data.type == 'radio';
	      var isCheckbox = data.type == 'checkbox';
	      var isSelect = data.type == 'select';
	      var dom,
	          contentProp = { style: {} };

	      if (_typeof(data.children) == 'object') {
	        data.children.attrs = data.children.attrs || {};
	        data.children.attrs.style = data.children.attrs.style || {};
	        Global.applyStyle(data.children.attrs, Global._pluck(data.style, ['fontFamily', 'fontSize', 'color', 'textAlign', 'fontStyle', 'fontWeight']));
	        Global.applyStyle(contentProp, Global._pluck(data.style, ['alignItems', 'justifyContent']));
	      }

	      if (isSelect) {
	        var options = data.children.children.map(function (v) {
	          return (0, _mithril2.default)('option', v);
	        });
	        if (data.children.attrs.placeholder) options.unshift((0, _mithril2.default)('option', { disabled: true, value: '' }, data.children.attrs.placeholder));
	        dom = Global._extend({}, data.children);
	        dom.children = options;
	      } else if (isCheckbox) {
	        var options = data.children.children.map(function (v) {
	          var checked = v == data.children.attrs.value ? '[checked]' : '';
	          return (0, _mithril2.default)('label', [v, (0, _mithril2.default)('input.checkbox[type=checkbox]' + checked, v)]);
	        });
	        dom = Global._extend({}, data.children);
	        dom.children = options;
	      } else if (isRadio) {
	        var options = data.children.children.map(function (v) {
	          var checked = v == data.children.attrs.value ? '[checked]' : '';
	          return (0, _mithril2.default)('label', [v, (0, _mithril2.default)('input.radio[type=radio]' + checked, v)]);
	        });
	        dom = Global._extend({}, data.children);
	        dom.children = options;
	      } else {
	        dom = data.children;
	      }

	      return (0, _mithril2.default)('.content', Global._extend({ key: Global.NewID(), config: function config(el, isInit, context) {
	          context.retain = false;
	        } }, contentProp), [dom]);
	    }
	  }, {
	    key: 'controller',
	    value: function controller() {
	      this.onunload = function () {};
	    }
	  }, {
	    key: 'view',
	    value: function view(ctrl) {
	      var self = this;
	      var Prop = Global.applyProp(this.Prop);
	      var dom = (0, _mithril2.default)('div.layer', Prop, [this.getChildren(), (0, _mithril2.default)('.bbox', { config: function config(el, isInit, context) {
	          context.retain = true;
	        } }), this.buildControlPoint()]);
	      return this.isValidRect() ? dom : [];
	    }
	  }]);

	  return WidgetDiv;
	})(_LayerBaseClass3.default);

	exports.default = WidgetDiv;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	var _global = __webpack_require__(4);

	var Global = _interopRequireWildcard(_global);

	var _ControlPoint = __webpack_require__(7);

	var _ControlPoint2 = _interopRequireDefault(_ControlPoint);

	var _addEditorToLayerBase = __webpack_require__(8);

	var _addEditorToLayerBase2 = _interopRequireDefault(_addEditorToLayerBase);

	var _DataTemplate = __webpack_require__(10);

	var DataTemplate = _interopRequireWildcard(_DataTemplate);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LayerBaseClass = (function () {
		function LayerBaseClass(parent, prop) {
			var _this = this;

			_classCallCheck(this, LayerBaseClass);

			this.parent = parent;
			this.ID = Global.NewID();
			this.Prop = {};
			this.Prop.key = this.ID;
			this.Prop.className = '';
			// var curTool = parent&&parent.children.length%2 ? 'select' : 'inputText'
			DataTemplate.initDataTemplate.call(this, Global.curTool);

			this.Prop = Global._deepCopy(this.Prop, prop || {});

			this.Prop.config = function (el, isInit, context) {
				Global.applyStyle(el, _this.Prop.style);context.retain = true;
			};
			this.Prop.onkeypress = function (e) {
				console.log(e, this);
			};
			this.ControlPoints = [];
			this.activeControlPoint = undefined;
			(0, _addEditorToLayerBase2.default)();
		}

		_createClass(LayerBaseClass, [{
			key: 'getPageOffset',
			value: function getPageOffset() {
				var cur = this,
				    parent,
				    offset = { left: this.Prop.style.left + (this.Prop.style.borderLeftWidth || 0), top: this.Prop.style.top + (this.Prop.style.borderLeftWidth || 0), path: [this.Prop.key] };
				while (parent = cur.parent) {
					offset.left += parent.Prop.style.left + (parent.Prop.style.borderLeftWidth || 0);
					offset.top += parent.Prop.style.top + (parent.Prop.style.borderTopWidth || 0);
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
			key: 'isValidRect',
			value: function isValidRect() {
				return this.Prop.style.width && this.Prop.style.height;
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
					var pWidth = parent.width + (Global.BORDER_BOX ? 0 : parent.borderLeftWidth || 0) + (Global.BORDER_BOX ? 0 : parent.borderRightWidth || 0);
					var pHeight = parent.height + (Global.BORDER_BOX ? 0 : parent.borderTopWidth || 0) + (Global.BORDER_BOX ? 0 : parent.borderBottomWidth || 0);
					this[0] = this.LT = [-child.width / 2, -child.height / 2]; //Left Top
					this[1] = this.CT = [pWidth / 2 - child.width / 2, -child.height / 2]; //top center
					this[2] = this.RT = [pWidth - child.width / 2, -child.height / 2]; //right top

					this[6] = this.LB = [-child.width / 2, pHeight - child.height / 2]; //Left Top
					this[5] = this.CB = [pWidth / 2 - child.width / 2, pHeight - child.height / 2]; //top center
					this[4] = this.RB = [pWidth - child.width / 2, pHeight - child.height / 2]; //right top

					this[7] = this.LM = [-child.width / 2, pHeight / 2 - child.height / 2]; //Left Top
					this[3] = this.RM = [pWidth - child.width / 2, pHeight / 2 - child.height / 2]; //left center
				};
				this.ControlPoints = [];

				var pointProp = { width: Global.POINT_WIDTH, height: Global.POINT_HEIGHT };
				var pointPosition = new ControlPosition(this.Prop.style, pointProp);

				for (var i = 0; i < 8; i++) {
					var point = new _ControlPoint2.default(this, { style: pointProp, position: i });
					point.Prop.style.left = pointPosition[i][0] - (this.Prop.style.borderLeftWidth || 0);
					point.Prop.style.top = pointPosition[i][1] - (this.Prop.style.borderTopWidth || 0);
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
			key: 'onRectChange',
			value: function onRectChange() {}
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
				rect.left -= this.Prop.style.left + (this.Prop.style.borderLeftWidth || 0);
				rect.top -= this.Prop.style.top + (this.Prop.style.borderTopWidth || 0);
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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	var _global = __webpack_require__(4);

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
				this.Prop.config = function (el, isInit, context) {
					Global.applyStyle(el, self.Prop.style);context.retain = true;
				};

				var dom = (0, _mithril2.default)('div.controlPoint', Global.applyProp(this.Prop));

				return dom;
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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = addEditorToLayerBase;

	var _extend = __webpack_require__(9);

	var _LayerBaseClass = __webpack_require__(6);

	var _LayerBaseClass2 = _interopRequireDefault(_LayerBaseClass);

	var _DataTemplate = __webpack_require__(10);

	var DataTemplate = _interopRequireWildcard(_DataTemplate);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function addEditorToLayerBase() {
		(0, _extend.override)(_LayerBaseClass2.default.prototype, 'onRectChange', function (original) {
			original();
			DataTemplate.renderJsonEditor.apply(this);
		});

		(0, _extend.override)(_LayerBaseClass2.default.prototype, 'onSelected', function (original) {
			original();
			DataTemplate.renderJsonEditor.apply(this);
		});
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.extend = extend;
	exports.override = override;

	var _global = __webpack_require__(4);

	var Global = _interopRequireWildcard(_global);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/**
	 * Below is from Flarum
	 * Extend an object's method by running its output through a mutating callback
	 * every time it is called.
	 *
	 * The callback accepts the method's return value and should perform any
	 * mutations directly on this value. For this reason, this function will not be
	 * effective on methods which return scalar values (numbers, strings, booleans).
	 *
	 * Care should be taken to extend the correct object – in most cases, a class'
	 * prototype will be the desired target of extension, not the class itself.
	 *
	 * @example
	 * extend(Discussion.prototype, 'badges', function(badges) {
	 *   // do something with `badges`
	 * });
	 *
	 * @param {Object} object The object that owns the method
	 * @param {String} method The name of the method to extend
	 * @param {function} callback A callback which mutates the method's output
	 */
	function extend(object, method, callback) {
	  var original = object[method];

	  object[method] = function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    var value = original ? original.apply(this, args) : undefined;

	    callback.apply(this, [value].concat(args));

	    return value;
	  };

	  Global._extend(object[method], original);
	}

	/**
	 * Override an object's method by replacing it with a new function, so that the
	 * new function will be run every time the object's method is called.
	 *
	 * The replacement function accepts the original method as its first argument,
	 * which is like a call to 'super'. Any arguments passed to the original method
	 * are also passed to the replacement.
	 *
	 * Care should be taken to extend the correct object – in most cases, a class'
	 * prototype will be the desired target of extension, not the class itself.
	 *
	 * @example
	 * override(Discussion.prototype, 'badges', function(original) {
	 *   const badges = original();
	 *   // do something with badges
	 *   return badges;
	 * });
	 *
	 * @param {Object} object The object that owns the method
	 * @param {String} method The name of the method to override
	 * @param {function} newMethod The method to replace it with
	 */
	function override(object, method, newMethod) {
	  var original = object[method];

	  object[method] = function () {
	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }

	    return newMethod.apply(this, [original.bind(this)].concat(args));
	  };

	  Global._extend(object[method], original);
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.jsonSchema = exports.jsonData = exports.jsonTypeSchema = exports.jsonType = undefined;
	exports.renderJsonEditor = renderJsonEditor;
	exports.initDataTemplate = initDataTemplate;

	var _global = __webpack_require__(4);

	var Global = _interopRequireWildcard(_global);

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	var _JsonEditor = __webpack_require__(11);

	var _JsonEditor2 = _interopRequireDefault(_JsonEditor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var jsonType = exports.jsonType = {
	  plain: { type: 'plain', attrs: { title: 'plain text' }, children: { tag: 'span', html: false, children: "文字" }, style: {} },
	  inputText: { type: 'inputText', attrs: { title: 'input text' }, children: { tag: 'input', attrs: { value: '输入文字', type: 'text' } },
	    style: {
	      "borderWidth": 1, "borderTopWidth": 1, "borderRightWidth": 1, "borderBottomWidth": 1, "borderLeftWidth": 1,
	      "padding": 2, "paddingTop": 2, "paddingBottom": 2, "paddingRight": 2, "paddingLeft": 2
	    }
	  },
	  select: { type: 'select', attrs: {}, children: { tag: 'select', attrs: { placeholder: 'select client...', value: '', required: true, multiple: false }, children: [] },
	    style: {
	      "borderWidth": 1, "borderTopWidth": 1, "borderRightWidth": 1, "borderBottomWidth": 1, "borderLeftWidth": 1,
	      "padding": 2, "paddingTop": 2, "paddingBottom": 2, "paddingRight": 2, "paddingLeft": 2
	    }
	  },
	  checkbox: { type: 'checkbox', attrs: {}, children: { tag: 'span', attrs: { type: 'checkbox', value: '下拉' }, children: ['下拉', '下拉2', '下拉3'] },
	    style: {}
	  },
	  radio: { type: 'radio', attrs: {}, children: { tag: 'span', attrs: { type: 'radio', value: '下拉' }, children: ['下拉', '下拉2', '下拉3'] },
	    style: {}
	  }

	};
	var jsonTypeSchema = exports.jsonTypeSchema = {
	  plain: {
	    "title": "文字",
	    "properties": {
	      attrs: {
	        "title": "attrs",
	        "type": "object",
	        "properties": {}
	      },

	      "children": {
	        "title": "children",
	        "type": "object",
	        "properties": {
	          "html": {
	            "title": "is html",
	            "type": "boolean",
	            "default": false
	          },
	          "children": {
	            "title": "children",
	            "type": "string",
	            "default": ""
	          }
	        }
	      }

	    }
	  },
	  inputText: {
	    "title": "输入",
	    "properties": {
	      "attrs": {
	        "title": "attrs",
	        "type": "object",
	        "properties": {}

	      },
	      "children": {
	        "title": "children",
	        "type": "object",
	        "properties": {
	          "attrs": {
	            "title": "attrs",
	            "type": "object",
	            "properties": {
	              "type": {
	                "title": "input type",
	                "type": "string",
	                "enum": ["text", "password", "number", "color"],
	                "default": "text"
	              },
	              "value": {
	                "title": "value",
	                "type": "string",
	                "default": ""
	              }
	            }
	          }
	        }
	      }

	    }
	  },

	  select: {
	    "title": "选择",
	    "properties": {
	      "attrs": {
	        "title": "attrs",
	        "type": "object",
	        "properties": {}

	      },
	      "children": {
	        "title": "children",
	        "type": "object",
	        "properties": {
	          "attrs": {
	            "title": "attrs",
	            "type": "object",
	            "properties": {
	              "multiple": {
	                "title": "multiple",
	                "type": "boolean",
	                "default": false
	              },
	              "value": {
	                "title": "value",
	                "type": "string",
	                "default": ""
	              }

	            }
	          },

	          "children": {
	            "title": "Options",
	            "type": "array",
	            "items": {
	              "title": "value",
	              "type": "string",
	              "format": "search",
	              "default": ""
	            }
	          }

	          // "children":{

	          //     "title": "Options",
	          //     "type": "array",
	          //     "items": {
	          //       "type": "object",
	          //       "properties": {
	          //         "option": {
	          //           "type": "string",
	          //         },
	          //         "value": {
	          //           "type": "string"
	          //         },
	          //       },
	          //       "default":{
	          //         "option":"",
	          //         "value":''
	          //       }
	          //     }
	          // }

	        }
	      }

	    }
	  },

	  checkbox: {
	    "title": "选择",
	    "properties": {
	      "attrs": {
	        "title": "attrs",
	        "type": "object",
	        "properties": {}

	      },
	      "children": {
	        "title": "children",
	        "type": "object",
	        "properties": {
	          "attrs": {
	            "title": "attrs",
	            "type": "object",
	            "properties": {
	              "value": {
	                "title": "value",
	                "type": "string",
	                "default": ""
	              }

	            }
	          },
	          "children": {
	            "title": "Options",
	            "type": "array",
	            "items": {
	              "title": "value",
	              "type": "string",
	              "format": "search",
	              "default": ""
	            }
	          }
	        }
	      }

	    }
	  },

	  radio: {
	    "title": "选择",
	    "properties": {
	      "attrs": {
	        "title": "attrs",
	        "type": "object",
	        "properties": {}

	      },
	      "children": {
	        "title": "children",
	        "type": "object",
	        "properties": {
	          "attrs": {
	            "title": "attrs",
	            "type": "object",
	            "properties": {
	              "value": {
	                "title": "value",
	                "type": "string",
	                "default": ""
	              }

	            }
	          },
	          "children": {
	            "title": "Options",
	            "type": "array",
	            "items": {
	              "title": "value",
	              "type": "string",
	              "format": "search",
	              "default": ""
	            }
	          }
	        }
	      }

	    }
	  }

	};

	var jsonData = exports.jsonData = {
	  "attrs": { title: '', name: '', required: false },
	  "children": {},
	  "style": {
	    "fontFamily": "宋体",
	    "fontSize": 12,
	    "color": "#000000",
	    "left": 0,
	    "top": 0,
	    "width": 100,
	    "height": 100,

	    "padding": 0,
	    "paddingTop": 0,
	    "paddingBottom": 0,
	    "paddingRight": 0,
	    "paddingLeft": 0,

	    "borderWidth": 0,
	    "borderTopWidth": 0,
	    "borderRightWidth": 0,
	    "borderBottomWidth": 0,
	    "borderLeftWidth": 0,

	    "borderStyle": "solid",
	    "borderTopStyle": "solid",
	    "borderRightStyle": "solid",
	    "borderBottomStyle": "solid",
	    "borderLeftStyle": "solid",

	    "borderColor": "#666666",
	    "borderTopColor": "#666666",
	    "borderRightColor": "#666666",
	    "borderBottomColor": "#666666",
	    "borderLeftColor": "#666666",

	    "backgroundType": "none",
	    "backgroundColor": "#aaaaaa",
	    "background": "none"
	  }
	};

	var jsonSchema = exports.jsonSchema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "CONTROL_NAME",
	  "type": "object",
	  "properties": {
	    "attrs": {
	      "title": "attrs",
	      "type": "object",
	      "properties": {
	        "title": {
	          "title": "title",
	          "type": "string",
	          "default": ""
	        },
	        "name": {
	          "title": "name",
	          "type": "string"
	        },
	        // "template":"{{=3245}}"
	        "required": {
	          "title": "required",
	          "type": "boolean",
	          "default": false
	        }

	      }
	    },
	    "children": {},
	    "style": {
	      "title": "style",
	      "type": "object",
	      "properties": {
	        "fontFamily": {
	          "title": "font name",
	          "type": "string",
	          "enum": ["宋体", "黑体", "微软雅黑", "Arial", "Verdana", "Times New Roman", "Tahoma"],
	          "default": "宋体"
	        },
	        "fontSize": {
	          "title": "font size",
	          "type": "integer",
	          "default": 12
	        },
	        "color": {
	          "title": "color",
	          "type": "string",
	          "format": "color",
	          "default": "#000000"
	        },

	        "fontStyle": {
	          "title": "font style",
	          "type": "string",
	          "enum": ["normal", "italic"],
	          "default": "normal"
	        },

	        "fontWeight": {
	          "title": "font weight",
	          "type": "string",
	          "enum": ["normal", "bold", "bolder"],
	          "default": "normal"
	        },

	        "textAlign": {
	          "title": "text align",
	          "type": "string",
	          "enum": ["left", "center", "right"],
	          "default": "left"
	        },

	        "alignItems": {
	          "title": "align items",
	          "type": "string",
	          "enum": ["flex-start", "center", "flex-end"],
	          "default": "center"
	        },

	        "justifyContent": {
	          "title": "justify content",
	          "type": "string",
	          "enum": ["flex-start", "center", "flex-end"],
	          "default": "flex-start"
	        },

	        "left": {
	          "title": "left",
	          "type": "integer",
	          "default": 100
	        },
	        "top": {
	          "title": "top",
	          "type": "integer",
	          "default": 100
	        },
	        "width": {
	          "title": "width",
	          "type": "integer",
	          "minimum": 0,
	          "default": 100
	        },
	        "height": {
	          "title": "height",
	          "type": "integer",
	          "minimum": 0,
	          "default": 100
	        },
	        "padding": {
	          "title": "padding",
	          "type": "integer",
	          "minimum": 0,
	          "default": 0
	        },
	        "paddingLeft": {
	          "title": "padding Left",
	          "inherit": "padding"
	        },
	        "paddingTop": {
	          "title": "padding top",
	          "inherit": "padding"
	        },
	        "paddingRight": {
	          "title": "padding Right",
	          "inherit": "padding"
	        },
	        "paddingBottom": {
	          "title": "padding Bottom",
	          "inherit": "padding"
	        },

	        "borderWidth": {
	          "title": "border width",
	          "type": "integer",
	          "minimum": 0,
	          "default": 1
	        },
	        "borderStyle": {
	          "title": "border style",
	          "type": "string",
	          "enum": ["", "none", "solid", "dotted", "dashed"],
	          "default": "solid"
	        },
	        "borderColor": {
	          "title": "border color",
	          "format": "color",
	          "type": "string",
	          "default": "#993333",
	          "empty": "#000000"
	        },
	        "borderLeftWidth": {
	          "title": "border left width",
	          "inherit": "borderWidth"
	        },
	        "borderLeftStyle": {
	          "title": "border left style",
	          "inherit": "borderStyle"
	        },
	        "borderLeftColor": {
	          "title": "border left color",
	          "inherit": "borderColor"
	        },
	        "borderTopWidth": {
	          "title": "border top width",
	          "inherit": "borderWidth"
	        },
	        "borderTopStyle": {
	          "title": "border top style",
	          "inherit": "borderStyle"
	        },
	        "borderTopColor": {
	          "title": "border top color",
	          "inherit": "borderColor"
	        },
	        "borderRightWidth": {
	          "title": "border right width",
	          "inherit": "borderWidth"
	        },
	        "borderRightStyle": {
	          "title": "border right style",
	          "inherit": "borderStyle"
	        },
	        "borderRightColor": {
	          "title": "border right color",
	          "inherit": "borderColor"
	        },
	        "borderBottomWidth": {
	          "title": "border bottom width",
	          "inherit": "borderWidth"
	        },
	        "borderBottomStyle": {
	          "title": "border bottom style",
	          "inherit": "borderStyle"
	        },
	        "borderBottomColor": {
	          "title": "border bottom color",
	          "inherit": "borderColor"
	        },

	        "backgroundType": {
	          "title": "background type",
	          "type": "string",
	          "enum": ["none", "color", "transparent"],
	          "default": "none"
	        },

	        "backgroundColor": {
	          "title": "background color",
	          "type": "string",
	          "format": "color",
	          "default": "#ffffff"
	        },

	        "background": {
	          "title": "background",
	          "type": "string",
	          "template": "{{=it.backgroundType=='none'?'none': (it.backgroundType=='color'?it.backgroundColor:'') }}"
	        }

	      }
	    }
	  }
	};

	function renderJsonEditor() {
	  var _this = this;

	  var self = this;
	  if (this.isValidRect() && this.jsonData && this.jsonSchema) {
	    Global._extend(this.jsonData().style, this.Prop.style);
	    _mithril2.default.mount(document.querySelector('.editor'), new _JsonEditor2.default(this.jsonSchema, this.jsonData, { config: function config(el) {
	        // below add drag&drop function to change array item order
	        $(el).find('.array .props .row').each(function () {});
	        if (!_this.jsonData().attrs.name) _this.jsonData().attrs.name = _this.jsonData().type + _this.parent.children.length;
	        // below move all inherit to it's parent, wrap into .inheritCon, hide, and show when click
	        $(el).find('.inherit').each(function () {
	          var inheritClass = $(this).attr('class').split(/\s+/).filter(function (v) {
	            return v.indexOf('inherit-') >= 0;
	          }).pop();
	          if (inheritClass) {
	            var parentClass = inheritClass.split('-').pop();
	            var pEl = $('[data-key="' + parentClass + '"]');
	            var con = pEl.next('.inheritCon');
	            if (!con.length) {
	              con = $('<div class="inheritCon"></div>');
	              pEl.after(con);
	              $('.' + inheritClass).appendTo(con);
	            }
	            // $(`.${inheritClass}`).after(pEl)
	            pEl.addClass('plus').off().on('click', '.itemTitle', function (e) {
	              pEl.toggleClass('minus');
	              con.toggleClass('visible');
	            });
	          }
	        });
	      } }, function (path, value, getData, data) {
	      path = path.replace(/^root\./, '');
	      var _path = path.split('.');
	      // if borderStyle is none/'', set width to 0
	      if (/(border\w+)Style$/i.test(path) && (value == 'none' || !value) || /(border\w+)Width$/i.test(path) && /^$|none/.test(Global.objectPath(data, path.replace(/Width$/, 'Style')))) {
	        Global.objectPath(data, path.replace(/Style$/, 'Width'), 0);
	      }

	      if (self.parent) {
	        self.parent.selectedWidget.forEach(function (v) {
	          // v.jsonData() is like {attrs:{}, style:{}, children:{}}
	          // v.Prop is like { key:key, className:..., style:{} }
	          // so we lookup _path[0] for which part of jsonData changed and update
	          if (_path[0] == 'style') Global.objectPath(v.Prop, _path, Global.objectPath(data, _path));else if (_path[0] == 'attrs') {
	            Global.objectPath(v.Prop, _path.slice(1), Global.objectPath(data, _path));
	            Global.objectPath(v.jsonData(), _path, Global.objectPath(data, _path));
	          } else if (_path[0] == 'children') Global.objectPath(v.jsonData(), _path, Global.objectPath(data, _path));
	          v.getChildren();
	        });
	      }
	      _mithril2.default.redraw();
	    }));
	  }
	}

	/**
	 * init this.jsonSchema & this.jsonData from DataTemplate Data for LayerBaseClass and inherited
	 * @param  {String} curTool toolset of jsonType, like 'plain', 'inputText' etc.
	 * Usage: initDataTemplate.call(this, 'plain')
	 */
	function initDataTemplate() {
	  var curTool = arguments.length <= 0 || arguments[0] === undefined ? 'plain' : arguments[0];

	  var newJsonData = Global._deepCopy({}, jsonData, jsonType[curTool]);
	  var newJsonSchema = Global._deepCopy({}, jsonSchema, jsonTypeSchema[curTool]);
	  this.Prop = Global._deepCopy(this.Prop, newJsonData.attrs);
	  this.Prop.style = Global._exlucdeJsonStyle(Global._deepCopy({}, newJsonData.style));
	  this.jsonSchema = _mithril2.default.prop(newJsonSchema);
	  this.jsonData = _mithril2.default.prop(newJsonData);
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.initEditor = undefined;

	var _global = __webpack_require__(4);

	var Global = _interopRequireWildcard(_global);

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	var _doT = __webpack_require__(12);

	var _doT2 = _interopRequireDefault(_doT);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var JsonEditor = function JsonEditor(SCHEMA, DATA) {
		var PROPS = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var CALLBACK = arguments.length <= 3 || arguments[3] === undefined ? function () {} : arguments[3];

		_classCallCheck(this, JsonEditor);

		var orgData = Global.clone(DATA());
		var schemaObjects = {};
		var schemaDefaultValue = {};
		var templateFieldValue = {};
		var inheritFieldValue = {};

		var getOriginalKeyVal = function getOriginalKeyVal(objectToBeCloned, originDATA) {
			// Basis.
			if (!(objectToBeCloned instanceof Object)) {
				return objectToBeCloned;
			}
			var objectClone = new objectToBeCloned.constructor();
			for (var prop in objectToBeCloned) {
				if (originDATA && prop in originDATA) objectClone[prop] = getOriginalKeyVal(objectToBeCloned[prop], originDATA[prop]);
			}
			return objectClone;
		};

		/**
	  * getter/setter Schema Object using dot path
	  * @param  {array} path  do path array
	  * @param  {any} value   value to set, if not present, it's a getter
	  * @return {any}       the value for getter/setter
	  */
		function schemaPathValue(path, value) {
			if (typeof path == 'string') path = path.split('.');
			var val = _dotPathValue(schemaDefaultValue, path);
			if (arguments.length < 2) return val;else return val === undefined ? _dotPathValue(schemaDefaultValue, path, value) : value;
		}

		/**
	  * getter/setter DATA Object using dot path
	  * @param  {array} path  do path array
	  * @param  {any} value   value for setter; null for getter
	  * @return {any}       the value for getter/setter
	  */
		function dataPathValue(path, value) {
			if (typeof path == 'string') path = path.split('.');
			if (arguments.length < 2) {
				var val = _dotPathValue(DATA(), path);
				return val === undefined ? schemaPathValue(path) || '' : val;
			} else {
				var temp = DATA();
				_dotPathValue(temp, path, value === null ? schemaObjects[path.join('.')].empty || '' : value);
				DATA(temp);
				var callback = function callback(p, v) {
					CALLBACK(p || path.join('.'), v || value, getOriginalKeyVal(temp, orgData), temp, templateFieldValue, inheritFieldValue, schemaObjects);
				};
				// below line will update the key for force update view
				var shouldCallback = true;
				for (var i in templateFieldValue) {
					if (i == path.join('.')) shouldCallback = false;
					var updated = templateFieldValue[i].some(function (watchPath) {
						if (watchPath == path.join('.')) {
							var updateFunc = templateFieldValue[i][0];
							updateFunc();
							return true;
						}
					});
				}
				for (var i in inheritFieldValue) {
					if (i !== path.join('.') || value === null) continue;
					inheritFieldValue[i].forEach(function (path) {
						_dotPathValue(temp, path.split('.'), value);
						callback(path);
					});
				}
				// only callback when it's not update the template
				if (shouldCallback) {
					if (temp.attrs) temp.attrs.key = +new Date();
					callback();
				}
				return value;
			}
		}

		/**
	  * dot path value helper function
	  * @param  {object} obj   the object to check for dot path
	  * @param  {array} path  dot path array
	  * @param  {any} value  value for setter; null for getter
	  * @return {any}       the value for getter/setter
	  */
		function _dotPathValue(obj, path, value) {
			if (path.length < 2) {
				return obj;
			}
			var data = obj;
			for (var v, i = 1; v = path[i], i < path.length; i++) {
				if (arguments.length >= 3) {
					if (data === undefined) {
						data = Global.clone(schemaPathValue(path.slice(0, i)));
						if (data === undefined) data = {};
						_dotPathValue(obj, path.slice(0, i), data);
					}
					if (i == path.length - 1) {
						if (value !== undefined) data[v] = value;
						// else delete data[v]
					}
				}
				data = data && data[v];
			}
			return data;
		}

		var JSON_SCHEMA_MAP = (function () {
			var obj = {};
			obj.template = function template(path, obj, key) {
				function replacer(match, placeholder, offset, string) {
					var watchPath = path.slice(0, -1).join('.') + '.' + placeholder;
					if (!templateFieldValue[path.join('.')]) templateFieldValue[path.join('.')] = [updateValue];
					Global.addToObject(templateFieldValue[path.join('.')], watchPath);
					return dataPathValue(watchPath);
				}
				var attrs = ['value', '', 'disabled', true];
				(obj[key].match(/it\.(\w+)/g) || []).forEach(function (v) {
					var watchPath = path.slice(0, -1).join('.') + '.' + v.replace('it.', '');
					if (!templateFieldValue[path.join('.')]) templateFieldValue[path.join('.')] = [updateValue];
					Global.addToObject(templateFieldValue[path.join('.')], watchPath);
				});
				function updateValue() {
					var value = _doT2.default.template(obj[key])(dataPathValue(path.slice(0, -1).join('.')));
					dataPathValue(path.join('.'), value);
					attrs[1] = value;
				}
				updateValue();
				return attrs;
			};
			obj.minLength = function (path, obj, key) {
				return ['pattern', '.{' + obj[key] + ',}'];
			};
			obj.minimum = 'min';
			obj.maximum = 'max';
			obj.description = 'placeholder';
			// obj.default = 'defaultValue'
			return obj;
		})();

		/**
	  * build m attrs from JSON schema property
	  * see JSON_SCHEMA_MAP format
	  * @param  {array} path     Object property in json dot path, {a:{b:{c:1}}} -> ['root', 'a','b','c'] == 1
	  * @param  {object} schema   JSON schema object, undefined value will be ''
	  * @param  {object} include  include value to overwrite specified attrs
	  * @param  {array} exclude  array that exclude in returned attrs
	  * @return {object}         m attrs object
	  */
		function buildAttrs(path, schema, include, exclude) {
			var obj = {},
			    include = include || {},
			    exclude = exclude || [];
			Object.keys(schema).forEach(function (v) {
				var map = JSON_SCHEMA_MAP[v];
				if (typeof map == 'function') {
					for (var i = 0, val = map(path, schema, v); i < val.length; i += 2) {
						obj[val[i]] = val[i + 1] || '';
					}
				} else {
					obj[map || v] = schema[v] === undefined ? '' : schema[v];
				}
			});
			for (var i in include) {
				obj[i] = include[i];
			}
			exclude.forEach(function (v) {
				delete obj[v];
			});
			if (!('value' in obj)) {
				if (schema.type !== 'boolean') obj['value'] = dataPathValue(path);else obj['checked'] = dataPathValue(path);
			}
			return obj;
		}

		this.parseSchema = function parseSchema(schema, key, path) {
			var _this = this;

			var getAttrs = function getAttrs() {
				var attrs = {};
				var classObj = {};
				classObj['level' + level] = true;
				if (schema.class) classObj[schema.class] = true;
				if (schema.template) classObj.isTemplate = true;
				if (schema.format == 'color') classObj.isColor = true;
				if (orgSchema.inherit) classObj['inherit inherit-' + orgSchema.inherit] = true;
				attrs['className'] = Object.keys(classObj).filter(function (v) {
					return classObj[v];
				}).join(' ');
				attrs['data-key'] = key;
				attrs['key'] = path.join('.');
				return attrs;
			};
			var addArrayItem = function addArrayItem() {
				dataPathValue(path).push(Global.clone(schema.items.default || ''));
			};
			var swapArrayItems = function swapArrayItems(i, itemSchema) {
				return function (e) {
					// if( !e.ctrlKey ) return
					var a,
					    b,
					    data = dataPathValue(path);
					if (e.keyCode == 38) b = i, a = i - 1;
					if (e.keyCode == 40) b = i, a = i + 1;
					if (a >= data.length) data.push(Global.clone(itemSchema.default));else if (a < 0) data.unshift(Global.clone(itemSchema.default));else if (a >= 0 && b >= 0) data[a] = data.splice(b, 1, data[a]).shift();else return;
					setTimeout(function () {
						if (a >= 0 && a < data.length) {
							var f = $(e.target).closest('.array').find('.arrayItem').eq(a).find('.row').find('input,select,textarea').get(0);
							if (f) f.focus();
						}
					}, 0);
				};
			};
			var _helper_notEmpty = function _helper_notEmpty(v) {
				if (v === null) return false;
				if (v === 0) return true;
				if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) == 'object') {
					for (var i in v) {
						if (_helper_notEmpty(v[i])) return true;
					}
					return false;
				} else {
					return !!v;
				}
			};
			var onInputBlur = function onInputBlur(index) {
				return function (e) {
					var data = dataPathValue(path);
					if (_helper_notEmpty(data[index])) return;
					data = data.filter(_helper_notEmpty);
					dataPathValue(path, data);
				};
			};

			path = path || [key];
			var level = path.length - 1;
			var initAttrs = level == 0 ? Global._extend({ key: +new Date() }, PROPS) : {};
			schemaObjects[path.join('.')] = schema;
			var orgSchema = schema;
			var inheritPath;
			if (schema.inherit) {
				inheritPath = path.slice(0, -1).join('.') + '.' + schema.inherit;
				if (!inheritFieldValue[inheritPath]) inheritFieldValue[inheritPath] = [];
				Global.addToObject(inheritFieldValue[inheritPath], path.join('.'));
				schema = Global.clone(schemaObjects[inheritPath]);
				schema = Global._extend(schema, orgSchema);
			}
			switch (schema.type) {
				case 'array':
					schemaPathValue(path, schema.default || []);
					return (0, _mithril2.default)('div.array', Global._extend(initAttrs, getAttrs()), [(0, _mithril2.default)('h2.arrayTitle', { onclick: function onclick(e) {
							addArrayItem();
							setTimeout(function () {
								var f = $(e.target).closest('.array').find('.arrayItem').eq(dataPathValue(path).length - 1).find('input,select,textarea').get(0);
								if (f) f.focus();
							});
						} }, schema.title), (0, _mithril2.default)('div.props', [schema.items.type == 'object' ? (function () {
						var keys = Object.keys(schema.items.properties);
						return dataPathValue(path).map(function (v, i) {
							return (0, _mithril2.default)('.arrayItem', [keys.map(function (key, index) {
								var dom = _this.parseSchema(schema.items.properties[key], i + " " + key, path.concat(i, key));
								dom.attrs['data-array-index'] = index;
								dom.attrs.onkeydown = swapArrayItems(i, schema.items);
								function interDom(dom) {
									if (dom.tag == 'input') dom.attrs.onblur = onInputBlur(i);
									dom.children && dom.children.forEach(interDom);
								}
								interDom(dom);
								return dom;
							})]);
						});
					})() : (function () {
						return dataPathValue(path).map(function (v, i) {
							var dom = _this.parseSchema(schema.items, i, path.concat(i));
							dom.attrs.onkeydown = swapArrayItems(i, schema.items);
							function interDom(dom) {
								if (dom.tag == 'input') dom.attrs.onblur = onInputBlur(i);
								dom.children && dom.children.forEach(interDom);
							}
							interDom(dom);
							return (0, _mithril2.default)('.arrayItem', [dom]);
						});
					})()])]);
					break;
				case 'object':
					schemaPathValue(path, schema.default || {});
					var keys = Object.keys(schema.properties);
					return (0, _mithril2.default)('div.object', Global._extend(initAttrs, getAttrs()), [(0, _mithril2.default)('h2.objectTitle', schema.title), (0, _mithril2.default)('div.props', [keys.map(function (v) {
						return _this.parseSchema(schema.properties[v], v, path.concat(v));
					})])]);

					break;

				case 'number':
				case 'integer':
					schemaPathValue(path, schema.default);
					return (0, _mithril2.default)('div.row', Global._extend(initAttrs, getAttrs()), [(0, _mithril2.default)('strong.itemTitle', schema.title || key), (0, _mithril2.default)('.itemValue', [(0, _mithril2.default)('input', buildAttrs(path, schema, { type: 'number', oninput: function oninput() {
							dataPathValue(path, schema.type == 'number' ? this.value : parseInt(this.value, 10));
							if (inheritPath) dataPathValue(inheritPath, null);
						} }))])]);

					break;

				case 'boolean':
					schemaPathValue(path, schema.default);
					return (0, _mithril2.default)('div.row', Global._extend(initAttrs, getAttrs()), [(0, _mithril2.default)('strong.itemTitle', schema.title || key), (0, _mithril2.default)('.itemValue', [(0, _mithril2.default)('input', buildAttrs(path, schema, { type: 'checkbox', onchange: function onchange() {
							dataPathValue(path, this.checked);
							if (inheritPath) dataPathValue(inheritPath, null);
						} }))])]);

					break;
				case 'string':
					schemaPathValue(path, schema.default);
					return (0, _mithril2.default)('div.row', Global._extend(initAttrs, getAttrs()), [(0, _mithril2.default)('strong.itemTitle', schema.title || key), (0, _mithril2.default)('.itemValue', [schema.enum ? (0, _mithril2.default)('select', buildAttrs(path, schema, {
						oninput: function oninput() {
							dataPathValue(path, this.value);
							if (inheritPath) dataPathValue(inheritPath, null);
						} }, ['enum', 'type']), schema.enum.map(function (v) {
						return (0, _mithril2.default)('option', v);
					})) : (0, _mithril2.default)(schema.format == 'textarea' ? 'textarea' : 'input', buildAttrs(path, schema, {
						type: schema.format || 'text',
						oninput: function oninput() {
							dataPathValue(path, this.value);
							if (inheritPath) dataPathValue(inheritPath, null);
						} }))])]);

					break;
			}
		};

		this.getVal = function (args) {
			return getOriginalKeyVal(DATA(), orgData);
		};
		this.controller = function (args) {};
		this.view = function (ctrl) {
			return this.parseSchema(SCHEMA(), 'root');
		};
		this.getView = function () {
			return this.view(new this.controller());
		};
	};

	exports.default = JsonEditor;

	var editorComp = (function () {
		var obj = {};
		obj.view = function (args) {
			obj.schema = _mithril2.default.prop(args.schema);
			obj.json = _mithril2.default.prop(args.json);
			obj.prop = _mithril2.default.prop(args.prop);
			obj.changeCallback = _mithril2.default.prop(args.changeCallback);
			return new JsonEditor(obj.schema, obj.json, obj.prop, obj.changeCallback);
		}, obj.view2 = function (ctrl, args) {
			console.log(args);
			return ctrl;
		};
		return obj;
	})();

	var initEditor = exports.initEditor = function initEditor(root, schema, data) {
		_mithril2.default.mount(root, _mithril2.default.component(editorComp, { schema: schema, json: data }));
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	// doT.js
	// 2011-2014, Laura Doktorova, https://github.com/olado/doT
	// Licensed under the MIT license.

	(function () {
		"use strict";

		var doT = {
			version: "1.0.3",
			templateSettings: {
				evaluate: /\{\{([\s\S]+?(\}?)+)\}\}/g,
				interpolate: /\{\{=([\s\S]+?)\}\}/g,
				encode: /\{\{!([\s\S]+?)\}\}/g,
				use: /\{\{#([\s\S]+?)\}\}/g,
				useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
				define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
				defineParams: /^\s*([\w$]+):([\s\S]+)/,
				conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
				iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
				varname: "it",
				strip: true,
				append: true,
				selfcontained: false,
				doNotSkipEncoded: false
			},
			template: undefined, //fn, compile template
			compile: undefined //fn, for express
		},
		    _globals;

		doT.encodeHTMLSource = function (doNotSkipEncoded) {
			var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			    matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
			return function (code) {
				return code ? code.toString().replace(matchHTML, function (m) {
					return encodeHTMLRules[m] || m;
				}) : "";
			};
		};

		_globals = (function () {
			return this || (0, eval)("this");
		})();

		if (typeof module !== "undefined" && module.exports) {
			module.exports = doT;
		} else if (true) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return doT;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			_globals.doT = doT;
		}

		var startend = {
			append: { start: "'+(", end: ")+'", startencode: "'+encodeHTML(" },
			split: { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML(" }
		},
		    skip = /$^/;

		function resolveDefs(c, block, def) {
			return (typeof block === "string" ? block : block.toString()).replace(c.define || skip, function (m, code, assign, value) {
				if (code.indexOf("def.") === 0) {
					code = code.substring(4);
				}
				if (!(code in def)) {
					if (assign === ":") {
						if (c.defineParams) value.replace(c.defineParams, function (m, param, v) {
							def[code] = { arg: param, text: v };
						});
						if (!(code in def)) def[code] = value;
					} else {
						new Function("def", "def['" + code + "']=" + value)(def);
					}
				}
				return "";
			}).replace(c.use || skip, function (m, code) {
				if (c.useParams) code = code.replace(c.useParams, function (m, s, d, param) {
					if (def[d] && def[d].arg && param) {
						var rw = (d + ":" + param).replace(/'|\\/g, "_");
						def.__exp = def.__exp || {};
						def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
						return s + "def.__exp['" + rw + "']";
					}
				});
				var v = new Function("def", "return " + code)(def);
				return v ? resolveDefs(c, v, def) : v;
			});
		}

		function unescape(code) {
			return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
		}

		doT.template = function (tmpl, c, def) {
			c = c || doT.templateSettings;
			var cse = c.append ? startend.append : startend.split,
			    needhtmlencode,
			    sid = 0,
			    indv,
			    str = c.use || c.define ? resolveDefs(c, tmpl, def || {}) : tmpl;

			str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, " ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, "") : str).replace(/'|\\/g, "\\$&").replace(c.interpolate || skip, function (m, code) {
				return cse.start + unescape(code) + cse.end;
			}).replace(c.encode || skip, function (m, code) {
				needhtmlencode = true;
				return cse.startencode + unescape(code) + cse.end;
			}).replace(c.conditional || skip, function (m, elsecase, code) {
				return elsecase ? code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='" : code ? "';if(" + unescape(code) + "){out+='" : "';}out+='";
			}).replace(c.iterate || skip, function (m, iterate, vname, iname) {
				if (!iterate) return "';} } out+='";
				sid += 1;indv = iname || "i" + sid;iterate = unescape(iterate);
				return "';var arr" + sid + "=" + iterate + ";if(arr" + sid + "){var " + vname + "," + indv + "=-1,l" + sid + "=arr" + sid + ".length-1;while(" + indv + "<l" + sid + "){" + vname + "=arr" + sid + "[" + indv + "+=1];out+='";
			}).replace(c.evaluate || skip, function (m, code) {
				return "';" + unescape(code) + "out+='";
			}) + "';return out;").replace(/\n/g, "\\n").replace(/\t/g, '\\t').replace(/\r/g, "\\r").replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, "");
			//.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

			if (needhtmlencode) {
				if (!c.selfcontained && _globals && !_globals._encodeHTML) _globals._encodeHTML = doT.encodeHTMLSource(c.doNotSkipEncoded);
				str = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : (" + doT.encodeHTMLSource.toString() + "(" + (c.doNotSkipEncoded || '') + "));" + str;
			}
			try {
				return new Function(c.varname, str);
			} catch (e) {
				if (typeof console !== "undefined") console.log("Could not create a template function: " + str);
				throw e;
			}
		};

		doT.compile = function (tmpl, def) {
			return doT.template(tmpl, null, def);
		};
	})();

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	var _global = __webpack_require__(4);

	var Global = _interopRequireWildcard(_global);

	var _ContainerBaseClass2 = __webpack_require__(14);

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
			_this.ID = Global.NewID();
			_this.Prop.key = _this.ID;
			return _this;
		}

		_createClass(WidgetCanvas, [{
			key: 'controller',
			value: function controller() {}
		}, {
			key: 'view',
			value: function view(ctrl) {
				var self = this;

				var dom = (0, _mithril2.default)('.canvas', Global.applyProp(this.Prop), [(0, _mithril2.default)('.content', { config: function config(el, isInit, context) {
						context.retain = true;
					} }, [(function () {
					return self.children.map(function (v) {
						return v.getView();
					});
				})()]), this.buildControlPoint()]);

				return this.isValidRect() ? dom : [];
			}
		}]);

		return WidgetCanvas;
	})(_ContainerBaseClass3.default);

	exports.default = WidgetCanvas;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	var _global = __webpack_require__(4);

	var Global = _interopRequireWildcard(_global);

	var _LayerBaseClass2 = __webpack_require__(6);

	var _LayerBaseClass3 = _interopRequireDefault(_LayerBaseClass2);

	var _WidgetDiv = __webpack_require__(5);

	var _WidgetDiv2 = _interopRequireDefault(_WidgetDiv);

	var _WidgetCanvas = __webpack_require__(13);

	var _WidgetCanvas2 = _interopRequireDefault(_WidgetCanvas);

	var _Events = __webpack_require__(15);

	var _Events2 = _interopRequireDefault(_Events);

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
			_this.setupShortKeyEvent();
			return _this;
		}

		_createClass(ContainerBaseClass, [{
			key: 'setupShortKeyEvent',
			value: function setupShortKeyEvent() {
				var _this2 = this;

				_Events2.default.on('duplicate', function (evt) {
					if (!_this2.isContainerMode()) return;
					_this2.duplicateSelected();
				});
				_Events2.default.on('remove', function (evt) {
					if (!_this2.isContainerMode()) return;
					_this2.removeSelectedItem();
				});
				_Events2.default.on('moveBy', function (data) {
					if (!_this2.isContainerMode()) return;
					_this2.moveSelectedBy(data.x, data.y);
				});
				_Events2.default.on('resizeBy', function (data) {
					if (!_this2.isContainerMode()) return;
					_this2.resizeSelectedBy(data.w, data.h);
				});
			}
		}, {
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
				var _this3 = this;

				src.children && src.children.forEach(function (child) {
					var newChild = new child.constructor(dest, { style: child.Prop.style });
					dest.children.push(newChild);
					_this3.duplicateChild(child, newChild);
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
					if (Global.rectsIntersect(rect, Global.getOuterRect(v.Prop.style))) {
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
					var Left = Global.BORDER_BOX ? editingStyle.left : editingStyle.left + (editingStyle.borderLeftWidth || 0);
					var Top = Global.BORDER_BOX ? editingStyle.top : editingStyle.top + (editingStyle.borderTopWidth || 0);
					if (offsetX < Left || offsetY < Top || offsetX > Left + editingStyle.width || offsetY > Top + editingStyle.height) {
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
						widget = !evt.shiftKey ? new _WidgetDiv2.default(self) : new _WidgetCanvas2.default(self);
						// Global._extend( widget.Prop.style, { backgroundColor:Global.RandomColor() } )
						PropLayer = widget.Prop;
						PropLayer.style.left = offsetX - (Global.BORDER_BOX ? 0 : PropLayer.style.borderLeftWidth || 0);
						PropLayer.style.top = offsetY - (Global.BORDER_BOX ? 0 : PropLayer.style.borderTopWidth || 0);
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
						_mithril2.default.redraw.strategy('none');
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

						widget.onRectChange();
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

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _eventKeeper = __webpack_require__(16);

	var _eventKeeper2 = _interopRequireDefault(_eventKeeper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = new _eventKeeper2.default();

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	/**
	 * Event Emitter
	 *
	 * @author Thomas Mosey [tom@thomasmosey.com]
	 * @version 1.0.14
	 */

	var EventEmitter = (function () {

		/**
	  * Initializes the Event Emitter.
	  */

		function EventEmitter() {
			_classCallCheck(this, EventEmitter);

			this._events = {};
			this._middleware = {};
		}

		_createClass(EventEmitter, {
			middleware: {

				/**
	    * Assign Middleware to an Event, and the Event will only fire if the Middleware allows it.
	    *
	    * @param {string|Array} event
	    * @param {function} func
	    */

				value: function middleware(event, func) {
					if (Array.isArray(event)) {
						for (var e = 0; e < event.length; e++) {
							this.middleware(event[e], func);
						}
					} else {
						if (!Array.isArray(this._middleware[event])) {
							this._middleware[event] = [];
						}

						this._middleware[event].push(func);
					}
				}
			},
			removeListeners: {

				/**
	    * Removes all Listeners for an Event and, optionally, all Middleware for the Event.
	    *
	    * @param {string|Array|null} [event]
	    * @param {boolean} [middleware]
	    */

				value: function removeListeners() {
					var event = arguments[0] === undefined ? null : arguments[0];
					var middleware = arguments[1] === undefined ? false : arguments[1];

					if (event != null) {
						if (Array.isArray(event)) {
							for (var e = 0; e < event.length; e++) {
								this.removeListeners(event[e], middleware);
							}
						} else {
							delete this._events[event];

							if (middleware) {
								this.removeMiddleware(event);
							}
						}
					} else {
						this._events = {};
					}
				}
			},
			removeMiddleware: {

				/**
	    * Removes all Middleware from an Event.
	    *
	    * @param {string|Array|null} [event]
	    */

				value: function removeMiddleware(event) {
					if (event != null) {
						if (Array.isArray(event)) {
							for (var e = 0; e < event.length; e++) {
								this.removeMiddleware(event[e]);
							}
						} else {
							delete this._middleware[event];
						}
					} else {
						this._middleware = {};
					}
				}
			},
			emit: {

				/**
	    * Emit an Event to Listeners.
	    *
	    * @param {string} event
	    * @param {*} [data]
	    * @param {boolean} [silent]
	    */

				value: function emit(event) {
					var data = arguments[1] === undefined ? null : arguments[1];
					var silent = arguments[2] === undefined ? false : arguments[2];

					event = event.toString();

					var listeners = this._events[event],
					    listener = null,
					    middleware = null,
					    doneCount = 0,
					    execute = silent;

					if (Array.isArray(listeners) && listeners.length > 0) {
						for (var l = 0; l < listeners.length; l++) {
							listener = listeners[l];

							/* Start Middleware checks unless we're doing a silent emit */
							if (!silent) {
								middleware = this._middleware[event];

								/* Check and execute Middleware */
								if (Array.isArray(middleware) && middleware.length > 0) {
									for (var m = 0; m < middleware.length; m++) {
										middleware[m](data, function () {
											var newData = arguments[0] === undefined ? null : arguments[0];

											if (newData != null) {
												data = newData;
											}

											doneCount++;
										}, event);
									}

									if (doneCount >= middleware.length) {
										execute = true;
									}
								} else {
									execute = true;
								}
							}

							/* If Middleware checks have been passed, execute */
							if (execute) {
								if (listener.once) {
									listeners[l] = null;
								}

								listener.callback(data);
							}
						}

						/* Dirty way of removing used Events */
						while (listeners.indexOf(null) !== -1) {
							listeners.splice(listeners.indexOf(null), 1);
						}
					}
				}
			},
			on: {

				/**
	    * Set callbacks for an event(s).
	    *
	    * @param {string|Array} event
	    * @param {function} callback
	    * @param {boolean} [once]
	    */

				value: function on(event, callback) {
					var once = arguments[2] === undefined ? false : arguments[2];

					if (Array.isArray(event)) {
						for (var e = 0; e < event.length; e++) {
							this.on(event[e], callback);
						}
					} else {
						event = event.toString();
						var split = event.split(/,|, | /);

						if (split.length > 1) {
							for (var e = 0; e < split.length; e++) {
								this.on(split[e], callback);
							}
						} else {
							if (!Array.isArray(this._events[event])) {
								this._events[event] = [];
							}

							this._events[event].push({
								once: once,
								callback: callback
							});
						}
					}
				}
			},
			once: {

				/**
	    * Same as "on", but will only be executed once.
	    *
	    * @param {string|Array} event
	    * @param {function} callback
	    */

				value: function once(event, callback) {
					this.on(event, callback, true);
				}
			}
		});

		return EventEmitter;
	})();

	module.exports = EventEmitter;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function () {
		// editor container & resize bar
		var dragFunc = DragFactory();
		var initEditorWidth = 400;
		var downFunc = dragFunc('resizeBar', { width: initEditorWidth }, function (e, data) {
			if (data.data.width + data.dx <= 40) return false;
			con.style.width = data.data.width + data.dx + 'px';
		}, function (e, data) {
			data.data.width += data.dx;
		});
		document.querySelector('.resizeBar').onmousedown = downFunc;

		var con = document.querySelector('.editorContainer');
		con.style.width = initEditorWidth + 'px';

		// add toolbox
		_mithril2.default.mount(document.querySelector('.toolbarContainer'), { view: function view() {
				return (0, _mithril2.default)('.toolSet', Object.keys(DataTemplate.jsonType).map(function (v) {
					return (0, _mithril2.default)('.tool', {
						className: v == Global.curTool ? 'active' : '',
						onclick: function onclick() {
							Global.curTool = v;
						}
					}, v);
				}));
			} });
	};

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	var _global = __webpack_require__(4);

	var Global = _interopRequireWildcard(_global);

	var _DataTemplate = __webpack_require__(10);

	var DataTemplate = _interopRequireWildcard(_DataTemplate);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }
/******/ ]);