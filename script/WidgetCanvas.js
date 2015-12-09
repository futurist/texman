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

		var dom = m('.canvas', Global.applyProp(this.Prop) , 
			[
					m('.content', {config: function(el,isInit,context){context.retain=true} }, [
						function(){
				            return self.children.map((v)=>{ return v.getView() })
						}()
					]),
					this.buildControlPoint(),
			]
		);

		return this.isValidRect() ? dom : []
	}
}
