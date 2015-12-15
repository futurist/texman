import m from 'mithril'
import * as Global from './global'
import LayerBaseClass from './LayerBaseClass'
import WidgetDiv from './WidgetDiv'
import WidgetCanvas from './WidgetCanvas'
import EE from './Events'

export default class ContainerBaseClass extends LayerBaseClass {
	constructor(parent, prop) {
		super(parent, prop);
		this.parent = parent;
		this.editingContainer = undefined;
		this.children = [];
		this.selectedWidget = [];
		this.resetAllEvent()
		this.setupContainerMode()
		this.setupContainerEvent()
		this.setupShortKeyEvent()
	}

	setupShortKeyEvent (){
		EE.on('duplicate', (evt)=>{
			if( !this.isContainerMode() ) return;
			this.duplicateSelected();
		})
		EE.on('remove', (evt)=>{
			if( !this.isContainerMode() ) return;
			this.removeSelectedItem();
		})
		EE.on('moveBy', (data)=>{
			if( !this.isContainerMode() ) return;
			this.moveSelectedBy(data.x, data.y);
		})
		EE.on('resizeBy', (data)=>{
			if( !this.isContainerMode() ) return;
			this.resizeSelectedBy(data.w, data.h);
		})
	}

	resetAllEvent(el){
		el = el||this;
		el.Prop['on'+Global.downE] = null;
		el.Prop['on'+Global.moveE] = null;
		el.Prop['on'+Global.upE] = null;
		el.Prop['ondblclick'] = null;
	}

	resizeSelectedBy( x, y ){
		var editing = this.getRoot().editingContainer;
		for(var i=0,v; v=editing.selectedWidget[i]; i++ ){
			v.Prop.style.width+=x
			v.Prop.style.height+=y
			v.Prop.style.width=Math.max(Global.MIN_WIDTH, v.Prop.style.width)
			v.Prop.style.height=Math.max(Global.MIN_WIDTH, v.Prop.style.height)
		}
		m.redraw()
	}

	moveSelectedBy( x, y ){
		var editing = this.getRoot().editingContainer;
		for(var i=0,v; v=editing.selectedWidget[i]; i++ ){
			v.Prop.style.left+=x
			v.Prop.style.top+=y
		}
		m.redraw()
	}

	duplicateChild (src, dest){
		src.children && src.children.forEach((child)=>{
			var newChild = new child.constructor( dest, {style:child.Prop.style} );
			dest.children.push( newChild )
			this.duplicateChild( child, newChild )
		})
	}
	
	duplicateSelected ( ){
		var editing = this.getRoot().editingContainer;
		var newWidget = []
		for(var i=0,v; v=editing.selectedWidget[i]; i++ ) {
			var widget = new v.constructor( v.parent, {style:v.Prop.style} )
			this.duplicateChild(v, widget)
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

	removeSelectedItem ( ){
		var editing = this.getRoot().editingContainer;
		for(var i=0,v; v=editing.selectedWidget[i]; i++ ){
			var index = editing.children.indexOf(v);
			if(index>=0) editing.children.splice( index , 1 );
			// if( v.isSelected() ) v.remove();
		}
		editing.selectedWidget = [];
		m.redraw()
	}

	checkSelectElement ( rect ){
		var elArray = {}
		var pointArray = {}
		this.children.forEach((v,i)=>{
			if( Global.rectsIntersect( rect, Global.getOuterRect( v.Prop.style ) ) ){
				elArray[i] = (v)
			}

			var point = v.getElementInside( rect ).pop()
			if(point){
				pointArray[i] = point;
			}

		});

		return {layer:elArray, point:pointArray, selfPoint: this.getElementInside(rect).pop() };
	}

	isChild (obj) {
		return this.children.some((v,i)=>{
			return v.Prop.key == obj.Prop.key
		})
	}

	isContainerMode () {
		return this.Prop.key == this.getRoot().editingContainer.Prop.key;
	}

	onExitEditing () {
		this.Prop.className = Global.removeClass( this.Prop.className, Global.EDITING_CLASSNAME);
		console.log( 'onExitEditing', this.Prop, this.selectedWidget.length )
		this.children.forEach((v)=>{
			v.onUnSelected()
		})
		this.selectedWidget = []
	}


	onUnSelected () {
		this.selectedWidget.forEach((v)=>{
			v.onUnSelected()
		})
		this.selectedWidget = []
		super.onUnSelected();
	}

	/**
	 * setup Event for Canvas, only it's the current editing
	 * @return {none}
	 */

	mouseUpFunc (evt) {

		var e = /touch/.test(evt.type) ? evt.changedTouches[0] : evt;

		// this.Prop['on'+Global.moveE] = this.Prop['on'+Global.upE] = null;

		delete this.Prop.eventData

		if( !this.selectedWidget.length ) return;

		this.selectedWidget.forEach(function(widget) {
			if( widget.Prop.isNew && widget.Prop.style.width<Math.max(20,Global.MIN_WIDTH*2) && 
					widget.Prop.style.height<Math.max(20,Global.MIN_WIDTH*2)  ){
				widget.remove();
			}
			delete widget.Prop.eventData
			if( widget.Prop.isNew){
				delete widget.Prop.isNew
			}
		})

	}

	setupContainerEvent () {

		var self = this;
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
				var Left = Global.BORDER_BOX? editingStyle.left : editingStyle.left+(editingStyle.borderLeftWidth||0)
				var Top = Global.BORDER_BOX? editingStyle.top : editingStyle.top+(editingStyle.borderTopWidth||0)
				if(offsetX<Left||offsetY<Top||
					offsetX>Left+editingStyle.width||offsetY>Top+editingStyle.height) {
					console.log('move out')
					return self.getRoot().editingContainer.mouseUpFunc(evt);
				}
			}

			// http://stackoverflow.com/questions/6593447/snapping-to-grid-in-javascript
			var snapToGrip = function snapToGrip(val){
			    var snap_candidate = Global.GRID_SIZE * Math.round(val/Global.GRID_SIZE);
			    if (Math.abs(val-snap_candidate) <= Global.GRID_SIZE/2) {
			        return snap_candidate;
			    }
			    else {
			        return null;
			    }
			};

			// when mouse down
			self.Prop['on'+Global.downE] = function(evt) {
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
					widget = !evt.shiftKey? new WidgetDiv( self ) : new WidgetCanvas( self );
					// Global._extend( widget.Prop.style, { backgroundColor:Global.RandomColor() } )
					PropLayer = widget.Prop
					PropLayer.style.left = offsetX-(Global.BORDER_BOX? 0 : PropLayer.style.borderLeftWidth||0)
					PropLayer.style.top = offsetY-(Global.BORDER_BOX? 0 : PropLayer.style.borderTopWidth||0)
					PropLayer.style.width = 0
					PropLayer.style.height = 0
					PropLayer.key = Global.NewID()
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

				self.children.forEach((widget)=>{
					widget.onUnSelected()
				})

				// on selected
				self.selectedWidget.forEach((widget)=>{
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
			self.Prop['on'+Global.moveE] = function(evt) {

				if( !self.isContainerMode() ){
					if( self.isChild( self.getRoot().editingContainer ) ) checkChildMoveOut(evt);
					m.redraw.strategy('none')
					return;
				}

				var e = /touch/.test(evt.type) ? evt.touches[0] : evt;
				evt.preventDefault();

				// check child mouse move out and info child to stop move
				var offsetX = e.pageX - self.getPageOffset().left
				var offsetY = e.pageY - self.getPageOffset().top

				if( Global.downE !== (PropCanvas.eventData && PropCanvas.eventData.type) ) return;

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
							width = Math.min(PropLayer.eventData.prevW-Global.MIN_WIDTH, width)
							PropLayer.style.width = PropLayer.eventData.prevW - width
							PropLayer.style.left = PropLayer.eventData.prevX + width
						}
						if([2,3,4].indexOf(pointPosition)>=0){
							PropLayer.style.width = PropLayer.eventData.prevW + width
						}


						if([0,1,2].indexOf(pointPosition)>=0){
							height = Math.min(PropLayer.eventData.prevH-Global.MIN_WIDTH, height)
							PropLayer.style.height = PropLayer.eventData.prevH - height
							if( PropLayer.style.height>0 ) PropLayer.style.top = PropLayer.eventData.prevY + height
						}
						if([4,5,6].indexOf(pointPosition)>=0){
							PropLayer.style.height = PropLayer.eventData.prevH + height
						}


						PropLayer.style.width = Math.max(Global.MIN_WIDTH, PropLayer.style.width)
						PropLayer.style.height = Math.max(Global.MIN_WIDTH, PropLayer.style.height)

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

					widget.onRectChange()

				})

			}

			self.Prop['on'+Global.upE] = e=> self.mouseUpFunc(e)

			if( self.isContainerMode() ) self.Prop.className = Global.addClass( self.Prop.className, Global.EDITING_CLASSNAME)

	}


	setupContainerMode (){
		var self=this;
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
				self.Prop.className = Global.addClass( self.Prop.className, Global.EDITING_CLASSNAME);
				self.getRoot().editingContainer = self;
				self.setupContainerMode()
				editing.setupContainerMode()
			}
		} else {
			self.Prop['ondblclick'] = null;
		}

	}

}
