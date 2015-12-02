import m from 'mithril'
import * as Global from './global'

export default class ControlPoint {
	constructor(parent, prop){
		this.parent=parent;
		this.Prop = Global._deepCopy( { style:{ width:10, height:10 } }, prop||{} )
	}

	controller() {
		// this will bind to controller()
		this.onunload = function(){
		}
	}

	view(ctrl){
		var self = this;
		// this will bind to Class this
		this.Prop.config = function(el){ Global.applyStyle(el,self.Prop.style ) };
		return m('div.controlPoint', this.Prop )
	}

	getView(){
		return this.view( new this.controller() );
	}
}

