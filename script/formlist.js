import m from 'mithril'
import * as Global from './global'

export class formList {
	constructor(){
		var self = this;

		this.controller=function (args) {
			var forms = self.getList()
			console.log(  )
			return {
				forms:forms
			}
		}

		this.view = function(ctrl){
			var data = ctrl.forms().data || [];
			return m('ul',
					data.map((v,i)=>{
						console.log(v,i)
						return m('li',
							[
								m('.name', v.attributes.name),
								m('.title', v.attributes.title),
								m('.createAt', v.attributes.createAt),
								m('a.action[href="cane.html#id='+v.id+'&ret='+window.location.href+'"][target=_blank]', '编辑'),
								m('a.action[href="#"]', { onclick: self.deleteItem(v.id) }, '删除'),
							]
						)
					})
				)
		}
	}

	getList(){
		var field = '?fields[formtype]=name,title,createAt'
		return Global.mRequestApi('GET', Global.APIHOST+'/formtype'+field)
	}

	deleteItem(id){
		Global.mRequestApi('DELETE', Global.APIHOST+'/formtype/'+id)
	}
	
}


m.mount( $('#container').get(0), new formList )
