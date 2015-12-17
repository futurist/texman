import m from 'mithril'
import * as Global from './global'
import ControlPoint from './ControlPoint'
import addEditorToLayerBase from './addEditorToLayerBase'
import * as DataTemplate from './DataTemplate'

export default class LayerBaseClass {
	constructor(parent, prop, tool){
		this.parent = parent;
		this.ID = Global.NewID()
		this.Prop = {}
    this.Prop.key = this.ID
    this.Prop.className = ''
    // var curTool = parent&&parent.children.length%2 ? 'select' : 'inputText'
    DataTemplate.initDataTemplate.call(this, tool||Global.curTool, prop)

		// this.Prop = Global._deepCopy( this.Prop, prop||{} );

		this.Prop.config = (el, isInit, context)=> { 
			/**
			 * below will trigger a BUG that background color cannot removed!!!!
			**/
			// Global.applyStyle(el, this.Prop.style); 
			context.retain=true; 
		}
		this.Prop.onkeypress = function(e){ console.log(e,this)  }
		this.ControlPoints = []
		this.activeControlPoint = undefined;
	   addEditorToLayerBase()
	}

	getPageOffset () {
		var cur=this, parent, offset={left:this.Prop.style.left+(this.Prop.style.borderLeftWidth||0), top:this.Prop.style.top+(this.Prop.style.borderLeftWidth||0), path:[ this.Prop.key ]};
		while(parent = cur.parent) {
			offset.left+=parent.Prop.style.left + (parent.Prop.style.borderLeftWidth||0);
			offset.top+=parent.Prop.style.top + (parent.Prop.style.borderTopWidth||0);
			offset.path.push(parent.Prop.key);
			cur = parent;
		}
		offset.path.reverse();
		return offset;
	}

	getRoot () {
		var cur=this, parent;
		while(parent = cur.parent){ cur = parent; }
		return cur;
	}

	isValidRect(){
		return this.Prop.style.width && this.Prop.style.height
	}

	iterateParent (callback){
		var cur=this, parent;
		while( parent=cur.parent ){
			callback&&callback(parent)
			cur = parent
		}
		return cur;
	}

	buildControlPoint (){

		var ControlPosition = function(parent, child){
			var pWidth = parent.width+(Global.BORDER_BOX? 0 : parent.borderLeftWidth||0)+(Global.BORDER_BOX? 0 : parent.borderRightWidth||0);
			var pHeight = parent.height+(Global.BORDER_BOX? 0 : parent.borderTopWidth||0)+(Global.BORDER_BOX? 0 : parent.borderBottomWidth||0);
			this[0] = this.LT = [-child.width/2, -child.height/2] 	//Left Top
			this[1] = this.CT = [pWidth/2 - child.width/2, -child.height/2] 	//top center
			this[2] = this.RT = [ pWidth - child.width/2, -child.height/2] 	//right top

			this[6] = this.LB = [-child.width/2, pHeight-child.height/2] 	//Left Top
			this[5] = this.CB = [pWidth/2 - child.width/2, pHeight-child.height/2] 	//top center
			this[4] = this.RB = [ pWidth - child.width/2, pHeight-child.height/2] 	//right top

			this[7] = this.LM = [-child.width/2, pHeight/2-child.height/2] 	//Left Top
			this[3] = this.RM = [pWidth - child.width/2, pHeight/2-child.height/2] 	//left center
		}
		this.ControlPoints = []

		var pointProp = { width:Global.POINT_WIDTH, height:Global.POINT_HEIGHT };
		var pointPosition = new ControlPosition( this.Prop.style, pointProp )

		for(var i=0; i<8; i++){
			var point = new ControlPoint( this, {style: pointProp, position:i } )
			point.Prop.style.left = pointPosition[i][0] - (this.Prop.style.borderLeftWidth||0)
			point.Prop.style.top = pointPosition[i][1] - (this.Prop.style.borderTopWidth||0)
			this.ControlPoints.push(point)
		}

		// move control point to top
		if( Global.isNumeric(this.activeControlPoint) ) {
			var point = this.ControlPoints[this.activeControlPoint]
			point.Prop.className = 'activePoint'
			this.ControlPoints.splice( this.activeControlPoint , 1 )
			this.ControlPoints.push(point)
		}

		return this.ControlPoints.map( v=>v.getView() )
	}

	remove (){
		this.parent.selectedWidget.splice( this.parent.selectedWidget.indexOf(this), 1 );
		this.parent.children.splice( this.parent.children.indexOf(this), 1 );
	}

	isSelected (){
		return this.Prop.className.indexOf(Global.SELECTED_CLASSNAME)>=0;
	}

	onRectChange(){
		
	}
	onSelected (){
		this.Prop.className = Global.addClass( this.Prop.className, Global.SELECTED_CLASSNAME);
	}
	onUnSelected (){
		this.Prop.className = Global.removeClass( this.Prop.className, Global.SELECTED_CLASSNAME);
		this.activeControlPoint = undefined
	}
	getElementInside ( rect ) {
		if( !this.isSelected() ) return [];
		rect = Global._deepCopy({}, rect)
		rect.left -= this.Prop.style.left+(this.Prop.style.borderLeftWidth||0)
		rect.top -= this.Prop.style.top+(this.Prop.style.borderTopWidth||0)
		return this.ControlPoints.filter( v=> {
			if( Global.rectsIntersect( rect, v.Prop.style) ){
				return true
			}
		} )
	}

	controller(){
		return;
	}

	view(){
		return;
	}
	getView () {
		return this.view( new this.controller() );
	}

}
