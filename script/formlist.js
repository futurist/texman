import m from 'mithril'
import util from 'util_extend_exclude'
import m_j2c from './m_j2c'
import * as Global from './global'
import WidgetDiv from './WidgetDiv'
import WidgetCanvas from './WidgetCanvas'
import {buildStageFromData} from './canvas'

import {canvasForm} from './css/formCSS'

export class formList {
	constructor(){

		// config m_j2c
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
											m('.name', { onclick:function(){ m_j2c.setNS('abc'); showForm(v) } }, v.attributes.name),
											m('.title', {onclick:function(){ 
												showDataList(v ) 
											}}, v.attributes.title),
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
function showDataList(formType, prop) {
	var container = document.querySelector('#container')
	var prop = {width:$(container).width()-300+'px'}
	m.mount(container, new DataListView(formType, container, prop) );
}
function showPopList(formType, prop) {
	var container = $('#poplist').show().get(0)
	m.mount(container, new DataListView(formType, container, prop) );
}

// get a form when click
function showForm(formType, container) {
	container = container||document.querySelector('#container')
	m.mount(container, new CanvasView(formType, container) );
}

class DataListView {
	constructor(formType, container=document.body, prop={}) {
		var self = this;
		var name = formType.attributes.name;
		var id = formType.attributes.id;
		var version = formType.attributes.version;
		m_j2c.add('data_table', {
			'.table': util._extend( {display:'table', table_layout: 'fixed', border_collapse:'collapse' }, prop ),
			'.row':{display:'table-row'},
			'.cell':{display:'table-cell',  width: '2%', padding: '5px', border:'1px solid #ccc'},
		})
		this.getList = function() {
			var query = '&filter[meta_ver]=<='+ version +'&include=meta_form&fields[formtype]=template'
			return Global.mRequestApi('GET', Global.APIHOST+'/form_'+name+'?' + query)
		}

		function buildTableRows(typeInfo, data){
			return data.data.map(function(v){
				return m('tr.row', [
						Object.keys(typeInfo).map(key=>{
							return m('td.cell.'+key, v.attributes[key])
						})
					] )
			})
		}

		function buildTableHeader(typeInfo){
			return m('th.row', [
					Object.keys(typeInfo).map( (v)=>{
						var title = typeInfo[v].attrs&&typeInfo[v].attrs.title||''
						var description = typeInfo[v].attrs&&typeInfo[v].attrs.description||''
						return m('td.cell.'+v, {title:v+'\n'+description}, title||v )
					})
				] )
		}

		this.controller = function(){
			var ctrl = this;
		  	ctrl.savedData = m.prop()
		  	ctrl.updateListView = function(){
		  		self.getList().then( function(data){
		  			ctrl.savedData(data)
		  			var template = data.included[0].attributes.template
					var type = {}
					Object.keys(template)
						.sort(function(a,b){ return template[a].attrs.order - template[a].attrs.order })
						.map(function(v){ type[v] = template[v] })
					type['meta_ver'] = {type:String, attrs:{order:999}}

					ctrl.tableHeader = buildTableHeader( type )
					ctrl.tableRows = buildTableRows( type, data )
				})
		  	}
		  	ctrl.updateListView()
		}

		this.view = function(ctrl){
			return m_j2c('data_table', m('table.table', {
				config:function(el,old,context){
					if(!old){
						// $(el).width( $(el).parent().width() )
					}
				}
			}, [ctrl.tableHeader, ctrl.tableRows] ) )
		}
	}
}




class CanvasView {
	constructor(formType){
		var self = this;
		var template = formType.attributes.template
		
		m_j2c.add('', 'canvasForm', canvasForm)
		var classList = m_j2c.getClass('', '')	// default ns, all class
		var getClass= function(name){ return '.'+(classList[name]||name) }

		var popListOpen = false
		this.setPopListOpen = function( isOpen ) {
			var $canvas = $( getClass('canvas') )
			var $list = $( '#poplist' )
			$list.attr('style', $canvas.length && $canvas.prop('style') && $canvas.prop('style').cssText )
			popListOpen = !!isOpen;

			if(!popListOpen) {
		  		$list.hide()
		  		m.mount( $list.get(0), null )
		  	}else{
		  		$list.show()
		  	}
		}

		this.getCanvasData = function() {
			return Global.mRequestApi('GET', Global.APIHOST+'/formtype/'+formType.id)
		}

		  this.controller = function(){
		  	var ctrl = this;
		  	ctrl.savedData = m.prop()
		  	ctrl.onunload=function(e){
		  		// e.preventDefault()
		  		self.setPopListOpen(false)
		  	}
		  	ctrl.buildCanvas = function(){
		  		ctrl.Canvas1 = self.getCanvasData().then( function(data){
		  			ctrl.savedData(data)
					return buildStageFromData( data.data.attributes.dom, null, {mode:'present'} )
				})
		  	}
		  	// self.setPopListOpen(false)
		  	ctrl.buildCanvas()
		  }

		  this.view = function(ctrl){
		  	if( !ctrl.Canvas1() ) return;
		  	
		    return m_j2c('', 'canvasForm', m('.mainCanvas', { config:function(el, isInit, context){ 
		    	context.retain=true 
		    	if(!isInit){

			    	Object.keys(template).forEach(function(v) {
			    		var $f = $('[name="'+ v +'"]')
			    		var T = template[v].attrs;
			    		var table = T.table;
			    		var tkey = T.tkey;
			    		if( table )
			    		$f.on('focus', v=>{
			    			self.setPopListOpen(true)
			    			showPopList(formType, {width:'auto'} )
			    		})
			    	})
		    	}
		    } }, [
		      m('h2', ctrl.Canvas1().Prop.title),
		      m('.canvasOp', [
		      	m('input[type=button][value=提交]', {onclick:function(){
		      		var domData = ctrl.Canvas1().getDomTree();
		      		var userData = {}
		      		for(let i in domData.template){
		      			userData[i] = Global.getInputVal(i, classList['.canvas'] ) ;
		      		}
		      		userData.meta_form = {type:'formtype', id:formType.id}
		      		let apiData = {
						"data":{
							"type": domData.name ,
							"attributes": userData
						}
					}
		      		Global.mRequestApi('POST', Global.APIHOST+'/form_'+domData.name, apiData, function(ret){
		      			console.log(ret)
		      		} )
		      	}}),
		      	m('input[type=button][value=重置]', {onclick:function(){
		      		ctrl.buildCanvas()
		      	}}),
		     ]),
		     ctrl.Canvas1().getView(),
		    ]) )
		  }
	}
}



