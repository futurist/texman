import m from 'mithril'
import * as Global from './global'
import ContainerBaseClass from './ContainerBaseClass'

export default class WidgetCanvas extends ContainerBaseClass {
	constructor(parent, prop){
		super(parent, prop)
		this.parent = parent
	    this.key = m.prop( Global.NewID() );
	}

	controller  () {

	}

	view (ctrl) {
		var self = this;
		var Prop = Global.applyProp(this.Prop)
		var dom = m('.canvas', Global._extend({}, Prop, { key: self.key(), 'data-key': self.key()} ) ,
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

	getView(){
		return this.view( new this.controller() );
	}

}
