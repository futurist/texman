import m from 'mithril'
import * as Global from './global'

export class formList {
	constructor(){
		var self = this;
		this.controller=function (args) {
			var forms = self.getList()
			return {
				forms:forms.data
			}
		}

		this.view = function(ctrl){

			return m('div',
					ctrl.forms.map((v,i)=>{
						console.log(v,i)
					})
				)
		}
	}

	getList(){
		console.log(Global.APIHOST)
		return Global.mRequestApi('GET', Global.APIHOST)
	}

}


m.mount( $('#container').get(0), new formList )
