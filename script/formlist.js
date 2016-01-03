import m from 'mithril'
import * as Global from './global'
import WidgetDiv from './WidgetDiv'
import WidgetCanvas from './WidgetCanvas'

export class formList {
	constructor(){
		var self = this;

		this.controller=function (args) {
			this.updateList = function(){
				this.forms = self.getList()
			}
			this.updateList()
		}

		this.view = function(ctrl){
			var forms = ctrl.forms();
			var data = forms&&forms.data || [];
			return m('.list',
					[
						m('.operat', m('a[href="cane.html"][target=_blank]','添加')),
						m('ul',
							data.map((v,i)=>{
								return m('li',
									[
										m('.name', { onclick:function(){ getForm(v.id) } }, v.attributes.name),
										m('.title', v.attributes.title),
										m('.createAt', v.attributes.createAt),
										m('a.action[href="cane.html#id='+v.id+'&ret='+window.location.href+'"][target=_blank]', '编辑'),
										m(`a.action[href="#${v.id}"]`, { onclick: function(){
											self.deleteItem(v.id, ctrl)
										} }, '删除'),
									]
								)
							})
						)
					]
				)
		}
	}

	getList(){
		var field = '?fields[formtype]=name,title,createAt'
		return Global.mRequestApi('GET', Global.APIHOST+'/formtype'+field)
	}

	deleteItem(id, ctrl){
		Global.mRequestApi('DELETE', Global.APIHOST+'/formtype/'+id).then(function(ret){
			if(ctrl) ctrl.updateList()
		})
	}

}


m.mount( $('#formlist').get(0), new formList )


// get a form when click
function getForm(id) {
	var container = document.querySelector('#container')
	m.mount( container , null )
	Global.mRequestApi('GET', Global.APIHOST+'/formtype/'+id).then(function(savedData){
		var Canvas1 = buildStageFromData(savedData.data.attributes.dom)
		m.mount(container,
		{
		  view: function(){
		    return m('.mainCanvas', { config:function(el, isInit, context){ context.retain=true } }, [
		      m('h2', Canvas1.Prop.title),
		      Canvas1.getView()
		    ])
		  }
		}
		);
	})
}

function buildStageFromData(data, parent=null) {
  var widget = data.classType=='canvas'
  ? new WidgetCanvas(parent, data.jsonData, {mode:'present'} )
  : new WidgetDiv(parent, data.jsonData, {tool:data.jsonData.type, mode:'present' } )
  widget.children = data.childWidget.map(v=>{
    return buildStageFromData( v, widget )
  })
  return widget;
}




