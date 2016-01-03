import m from 'mithril'
import * as Global from './global'
import canvas from './canvas'

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
	m.mount( document.querySelector('#container'), null )
	Global.mRequestApi('GET', Global.APIHOST+'/formtype/'+id).then(function(savedData){
		new canvas(savedData)
	})
}





