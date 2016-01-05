import m from 'mithril'
import * as Global from './global'
import WidgetDiv from './WidgetDiv'
import WidgetCanvas from './WidgetCanvas'
import {buildStageFromData} from './canvas'

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
	m.mount(container, new CanvasView(id) );
}

class CanvasView {
	constructor(id){
		var self = this;
		this.getCanvasData = function() {
			return Global.mRequestApi('GET', Global.APIHOST+'/formtype/'+id)
		}

		  this.controller = function(){
		  	var ctrl = this;
		  	ctrl.savedData = m.prop()
		  	ctrl.buildCanvas = function(){
		  		ctrl.Canvas1 = self.getCanvasData().then( function(data){
		  			ctrl.savedData(data)
					return buildStageFromData( data.data.attributes.dom, null, {mode:'present'} )
				})
		  	}
		  	ctrl.buildCanvas()
		  }

		  this.view = function(ctrl){
		    return m('.mainCanvas', { config:function(el, isInit, context){ context.retain=true } }, [
		      m('h2', ctrl.Canvas1().Prop.title),
		      m('.canvasOp', [
		      	m('input[type=button][value=提交]', {onclick:function(){ 
		      		var domData = ctrl.Canvas1().getDomTree();
		      		var userData = {}
		      		for(let i in domData.template){
		      			userData[i] = $(`.canvas [name="${i}"] [data-input]`).val() ;
		      		}
		      		let apiData = {
						"data":{
							"type": domData.name ,
							"attributes": userData
						}
					}
		      		console.log( apiData )
		      		Global.mRequestApi('POST', Global.APIHOST+'/userform_'+domData.name, apiData, function(ret){
		      			console.log(ret)
		      		} )
		      	}}),
		      	m('input[type=button][value=重置]', {onclick:function(){
		      		ctrl.buildCanvas()
		      	}}), 
		      	]),
		      ctrl.Canvas1().getView()
		    ])
		  }
	}
}



