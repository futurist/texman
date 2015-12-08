import m from 'mithril'
import * as Global from './global'
import ContainerBaseClass from './ContainerBaseClass'

export default class WidgetCanvas extends ContainerBaseClass {
	constructor(parent, prop){
		super(parent, prop)
		this.parent = parent
		this.ID = Global.NewID()
	    this.Prop.key = this.ID
	}

	controller  () {

	}

	view (ctrl) {
		var self = this;
		var Prop = Global._exclude( this.Prop, ['eventData','isNew'] )
		Prop.style = Global._deepCopy( {}, this.Prop.style )
		Global.applyStyle( Prop, Prop.style )
		return m('.canvas', Prop , 
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
