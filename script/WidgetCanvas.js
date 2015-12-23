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

		var index=0, template={};
		function getJsonData( widget ) {
			index++;
			var obj = { classType: widget.constructor==WidgetCanvas?'canvas':'layer' }
			var jsonData = widget.jsonData();
			obj.jsonData = jsonData;
			if( !/stage|plain/i.test(jsonData.type) && jsonData.attrs && jsonData.attrs.name ) {
				template[jsonData.attrs.name] = jsonData.children;
			}
			obj.childWidget = (widget.children||[]).map(function(v, i){
				return getJsonData(v)
			})
			return obj;
		}
		return {
			name: this.Prop.name,
			title: this.Prop.title,
			desc: this.Prop.desc||'',
			template:template,
			dom: getJsonData(this)
		}
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
