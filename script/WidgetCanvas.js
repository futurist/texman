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

	getDomTree(){
		function interDom(v){  
			for(var i in v.attrs){ if(/^on|^config$|^key$|^data-key$/.test(i))delete v.attrs[i] }; 
			v.children && v.children.forEach(interDom)
		}

		var index=0, self = this;
		function getJsonData( widget ) {
			index++;
			var obj = { data:[ {type: widget.constructor==WidgetCanvas?'canvas':'layer', id: String(index)  } ] }
			obj.data[0].attributes = widget.jsonData();
			obj.included = (widget.children||[]).map(function(v, i){
				return getJsonData(v)
			})
			return obj;
		}
		return getJsonData(self)
	}

	view (ctrl) {
		var self = this;
		var Prop = Global.applyProp(self.Prop)
		var dom = m('.canvas', Global._extend({}, Prop, { key: self.key(), 'data-key': self.key()} ) ,
			[
					m('.content', {config: function(el,isInit,context){context.retain=true} }, [
						function(){
				            return self.children.map((v)=>{ return v.getView() })
						}()
					]),
					self.buildControlPoint(),
			]
		);
		return self.isValidRect() ? dom : []
	}
}
