import m from 'mithril'
import m_j2c from 'm_j2c'
import * as Global from './global'
import WidgetDiv from './WidgetDiv'
import WidgetCanvas from './WidgetCanvas'
import {buildStageFromData} from './canvas'

export class formList {
	constructor(){
		// config m_j2c
		m_j2c.setM(m)
		m_j2c.setNS('formlist')

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
				m_j2c.add('<head>', { ' body':{color:'black'}, '.text':{font_size:'12px'} } );
				// m_j2c.remove('formlist', {':global(.list)':{ ' .item':{cursor:'hand'} } } )
				// m_j2c.add('formlist', {':global(.list)':{ ' .item':{cursor:'hand'} } } )
				console.log( m_j2c() )

				m_j2c.setNS('abc')
				m_j2c.add('formlist', {'.list': {color:'green'}, '.add':{color:'red'} } );
				console.log( m_j2c() )

				m_j2c.setNS('formlist')
				console.log( m_j2c() )

				// m_j2c.setNS('abc')
				// console.log( m_j2c() )

				// m_j2c.setNS('formlist')

				window.mm = m_j2c
				window.m = m
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

			var dom = m('.global(list)',
					{ config:function(el, old, ctx, vdom){
						var cls=m_j2c.getClass('formlist')
						// ctx.retain = true;
						// console.log( old, cls, $( ('.'+cls.list) ) )
					}  },
					[
						m('.global(operate)', m('a.add[href="cane.html"][target=_blank]','添加')),
						m('ul',
							data.map((v,i)=>{
								return m('li',
									[
										m('.item', [
											m('.name', { onclick:function(){ m_j2c.setNS('abc'); showForm(v.id) } }, v.attributes.name),
											m('.title', {onclick:function(){ showDataList(v) }}, v.attributes.title),
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
		field = ''
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
function showDataList(formType) {
	var container = document.querySelector('#container')
	m.mount(container, new DataListView(formType) );
}

// get a form when click
function showForm(formID) {
	var container = document.querySelector('#container')
	m.mount(container, new CanvasView(formID) );
}

class DataListView {
	constructor(formType) {
		var self = this;
		var name = formType.attributes.name;
		var id = formType.attributes.id;
		var version = formType.attributes.version;
		m_j2c.add('data_table', {
			'.table':{display:'table', table_layout: 'fixed'},
			'.row':{display:'table-row'},
			'.cell':{display:'table-cell',  width: '2%'},
		})
		this.getList = function() {
			var query = '&filter[meta_ver]=<='+ version +'&include=meta_form&fields[formtype]=template'
			return Global.mRequestApi('GET', Global.APIHOST+'/userform_'+name+'?' + query)
		}

		this.controller = function(){
			var ctrl = this;
		  	ctrl.savedData = m.prop()
		  	ctrl.updateListView = function(){
		  		self.getList().then( function(data){
		  			ctrl.savedData(data)
					ctrl.tableRows = buildTableRows( data )
				})
		  	}
		  	ctrl.updateListView()
		}

		this.view = function(ctrl){
			return m_j2c('data_table', m('table.table', ctrl.tableRows) )
		}
	}
}

function buildTableRows(data){
	return data.data.map(function(v){
		return m('tr.row', [
				Object.keys(v.attributes).map(key=>{
					return m('td.cell.'+key, v.attributes[key])
				})
			] )
	})
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
		      		userData.meta_form = {type:'formtype', id:formID}
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



