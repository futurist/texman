import m from 'mithril'
import * as Global from './global'
import ContainerBaseClass from './ContainerBaseClass'

export default class WidgetCanvas extends ContainerBaseClass {
	constructor(parent, prop){
		super(parent, prop)
		this.parent = parent
	}

	controller  () {

	}

	view (ctrl) {
		var self = this;
		return m('.canvas', Global._exclude( this.Prop, ['eventData','isNew'] ), 
			[
					m('.content', [
						function(){
				            return self.children.map((v)=>{ return v.getView() })
						}()
					]),
					this.buildControlPoint(),
			]
		)
	}
}
