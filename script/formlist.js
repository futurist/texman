import m from 'mithril'
import m_j2c from 'm_j2c'
import * as Global from './global'
import WidgetDiv from './WidgetDiv'
import WidgetCanvas from './WidgetCanvas'
import {buildStageFromData} from './canvas'

export class formList {
	constructor(){
		var self = this;
		self.css = {
			':global(.list)':{
				' .item':{
					cursor: 'pointer',
					color: '#666'
				},
				' .name':{ color:'red' },
				' .title':{},
				' .createAt':{},
			}
		}
		self.controller=function (args) {
			this.updateStyle = function(){
				m_j2c.add('formlist', self.css);
				m_j2c.add('<head>', { ' body':{color:'black'} } );
				// m_j2c.remove('formlist', {':global(.list)':{ ' .item':{cursor:'hand'} } } )
				// m_j2c.add('formlist', {':global(.list)':{ ' .item':{cursor:'hand'} } } )
				console.log( m_j2c() )
			}
			this.updateList = function(){
				this.forms = self.getList()
			}
			this.updateList()
			this.updateStyle()
		}

		self.view = function(ctrl){
			var forms = ctrl.forms();
			var data = forms&&forms.data || [];

			var dom = m('.global(list)', { config:function(el, isInit, ctx, vdom){  }  },
					[
						m('.global(operate)', m('a[href="cane.html"][target=_blank]','添加')),
						m('ul',
							data.map((v,i)=>{
								return m('li',
									[
										m('.item', { onclick:function(){ showForm(v.id) } }, [
											m('.name', v.attributes.name),
											m('.title', v.attributes.title),
											m('.createAt', v.attributes.createAt),
										]),
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

			return m_j2c('formlist', dom)
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
function showDataList(formID) {
	var container = document.querySelector('#container')
	m.mount(container, new DataListView(formID) );
}

// get a form when click
function showForm(formID) {
	var container = document.querySelector('#container')
	m.mount(container, new CanvasView(formID) );
}

class DataListView {
	constructor(formID) {
		var self = this;
		this.getCanvasData = function() {
			return Global.mRequestApi('GET', Global.APIHOST+'/formtype/'+formID)
		}

		this.controller = function(){
			var ctrl = this;
		}

		this.view = function(ctrl){
			return m();
		}
	}
}


class CanvasView {
	constructor(formID){
		var self = this;
		this.getCanvasData = function() {
			return Global.mRequestApi('GET', Global.APIHOST+'/formtype/'+formID)
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
		  	if( !ctrl.Canvas1() ) return;
		    return m('.mainCanvas', { config:function(el, isInit, context){ context.retain=true } }, [
		      m('h2', ctrl.Canvas1().Prop.title),
		      m('.canvasOp', [
		      	m('input[type=button][value=提交]', {onclick:function(){
		      		var domData = ctrl.Canvas1().getDomTree();
		      		var userData = {}
		      		for(let i in domData.template){
		      			userData[i] = Global.getInputVal(i, '.canvas') ;
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



