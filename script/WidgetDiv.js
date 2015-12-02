import m from 'mithril'
import * as Global from './global'
import LayerBaseClass from './LayerBaseClass'

export default class WidgetDiv extends LayerBaseClass {

	constructor(parent, prop) {
		super(parent, prop);
		this.parent = parent;
	}

	controller (){
		this.onunload = function(){

		}
	}

	view (ctrl) {
		var Prop = Global._exclude( this.Prop, ['eventData','isNew'] );
		return Prop.style.width&&Prop.style.height
		? m('div.layer', Prop, [
				m('.content'),
				m('.bbox'),
				this.buildControlPoint()
			] )
		: []
	}
}
