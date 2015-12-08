import m from 'mithril'
import * as Global from './global'
import ControlPoint from './ControlPoint'
import addEditorToLayerBase from './addEditorToLayerBase'


export default class LayerBaseClass {
	constructor(parent, prop){
		this.parent = parent;
		this.generateID = Global.NewID();
		this.Prop = Global._deepCopy( { key:this.generateID, className:'', style:{left:0, top:0, width:0, height:0, backgroundColor:'#eee', border:'0px solid #fff' } }, prop||{} );
		this.Prop.config = (el)=> { Global.applyStyle(el, this.Prop.style) }
		this.Prop.onkeypress = function(e){ console.log(e,this)  }
		this.ControlPoints = []
		this.activeControlPoint = undefined;
	    addEditorToLayerBase()
	}

	getPageOffset () {
		var cur=this, parent, offset={left:this.Prop.style.left, top:this.Prop.style.top, path:[ this.Prop.key ]};
		while(parent = cur.parent) {
			offset.left+=parent.Prop.style.left;
			offset.top+=parent.Prop.style.top;
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
			this[0] = this.LT = [-child.width/2, -child.height/2] 	//Left Top
			this[1] = this.CT = [parent.width/2 - child.width/2, -child.height/2] 	//top center
			this[2] = this.RT = [ parent.width - child.width/2, -child.height/2] 	//right top

			this[6] = this.LB = [-child.width/2, parent.height-child.height/2] 	//Left Top
			this[5] = this.CB = [parent.width/2 - child.width/2, parent.height-child.height/2] 	//top center
			this[4] = this.RB = [ parent.width - child.width/2, parent.height-child.height/2] 	//right top

			this[7] = this.LM = [-child.width/2, parent.height/2-child.height/2] 	//Left Top
			this[3] = this.RM = [parent.width - child.width/2, parent.height/2-child.height/2] 	//left center
		}
		this.ControlPoints = []

		var pointProp = { width:Global.POINT_WIDTH, height:Global.POINT_HEIGHT };
		var pointPosition = new ControlPosition( this.Prop.style, pointProp )
		// var positionShift = this.isSelected() ? -BORDER_WIDTH : 0;

		for(var i=0; i<8; i++){
			var point = new ControlPoint( this, {style: pointProp, position:i } )
			point.Prop.style.left = pointPosition[i][0]
			point.Prop.style.top = pointPosition[i][1]
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
		rect.left -= this.Prop.style.left
		rect.top -= this.Prop.style.top
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
