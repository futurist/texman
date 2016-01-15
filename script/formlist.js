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
function showDataList(formType, options={}) {
	var container = document.querySelector('#container')
	options.tableStyle = options.tableStyle||{width:$(container).width()-300+'px'}
	options.container = options.container||container;
	m.mount(container, new DataListView(formType, options) );
}
function showPopList(formType, options={}) {
	var container = $('#poplist').show().get(0)
	options.tableStyle = options.tableStyle||{width:'auto'}
	options.container = options.container||container;
	m.mount(container, new DataListView(formType, options) );
}

class SelectComponent{
	// typeDef = {tag:'', attrs:{}, children}
	// row = { type, id, attributes:{key:val,...} }
	constructor(typeInfo, row, key) {
		if(!typeInfo||!typeInfo[key]) return [];
		var typeDef = typeInfo[key]
		var placeholder = typeDef.attrs.placeholder||''
		var isMultiple = typeDef.attrs.type=='checkbox'||typeDef.attrs.multiple
		var title = typeDef.attrs.title||''
		var selVal = row.attributes[key]
		var child = typeDef.children
		selVal = {}.toString.call(selVal)!=="[object Array]" ?[selVal]:selVal
		child = {}.toString.call(child)!=="[object Array]" ?[child]:child
		this.controller=function(){

		}

		this.view=function(){
			var dom  =m('select', Global._extend({}, {
						name: row.id+'_'+key,
						multiple:isMultiple,
						title:isMultiple?'按Ctrl键点击可多选\n'+title:title,
						oninput:function(){
							row.attributes[key] = $(this).val()
					}}),
					[
						!isMultiple? m('option', { value:''} , placeholder): [],
						child.map(v=>{
							let value =v, text=v
				            if(typeof v=='object'&&v) value=v.value, text=v.text;
							return m('option'+( selVal.indexOf(value)>-1 ?'[selected]':''), { value:value }, text)
						})
					]
				)
			return dom
		}
	}
}

class DataListView {
	constructor(formType, options={} ) {
		var self = this;
		var name = options.tableName || formType.attributes.name;
		var id = formType.attributes.id;
		var version = formType.attributes.version;
		var listMode = options.listMode || 'edit'	//'text', 'edit'
		m_j2c.add('data_table', {
			'.table': util._extend( {display:'table', table_layout: 'fixed', border_collapse:'collapse' }, options.tableStyle ),
			'.row':{display:'table-row'},
			'.row:hover':{background:'#ccc'},
			'.cell':{display:'table-cell',  width: '2%', padding: '5px', border:'1px solid #ccc'},
			'.cell textarea':{ width:'100%', height:'100%', border:'none', background:'none', resize:'none' },
			'a.action':{margin:'0 4px'},
			'.listAction input':{ margin:'10px 4px' },
		})

		this.populateRef = function(formName) {
			var query = '&filter[meta_ver]=>=0&include=meta_form&fields[formtype]=template'
			return Global.mRequestApi('GET', Global.APIHOST+'/form_'+formName+'?' + query)
		}
		this.getList = function() {
			var query = '&filter[meta_ver]=<='+ version +'&include=meta_form&fields[formtype]=template'
			return Global.mRequestApi('GET', Global.APIHOST+'/form_'+name+'?' + query)
		}

		this.controller = function(){
			var ctrl = this;
		  	ctrl.savedData = m.prop()

			ctrl.buildTableRows = function(typeInfo, data){
				var renderCell = function(row, key){
					switch(listMode){
						case 'edit':
							var isTextArea = typeInfo[key].tag=='textarea'
							var isSelect = /select|span/.test(typeInfo[key].tag)
							if(isTextArea){
								return m('textarea', Global._extend({}, {name: row.id+'_'+key}), row.attributes[key])
							}

							if(isSelect) {
								return new SelectComponent( typeInfo, row, key )
							}
							return m('input', Global._extend({}, {name: row.id+'_'+key, value:row.attributes[key]}) )
						case 'text':
						default:
							return row.attributes[key]
					}
				}
				var renderAction = function(row){
					return m('td.cell.action',
						[
							m('a.action.edit[href="javascript:;"]', {onclick:function(){ showForm(formType, {row:row} ) }}, '编辑'),
							m('a.action.delete[href="javascript:;"]', {className:'', onclick:function(){
								if($(this).hasClass('deleting'))return;
								ctrl.deleteRow(row);
								$(this).addClass('deleting'); }}, '删除'),
						]
					)
				}

				return data.data.map(function(v){
					return m('tr.row',
							{config: function(el,old,context){
									if(old) return;
									$(el).on('click', function(e){
										options.onRowClick&&options.onRowClick(el, { formType:formType, row:v } )
									})
							}},
							[
							renderAction(v),
							Object.keys(typeInfo).map(key=>{
								var isTextArea = typeInfo[key].tag=='textarea';
								var val = isTextArea
											?m('textarea', m.trust(v.attributes[key]))
											:v.attributes[key]
								return m('td.cell.'+key, {config: function(el,old,context){
									if(old) return;
									$(el).on('click', function(e){
										options.onCellClick&&options.onCellClick(el, { formType:formType, row:v, key:key } )
									})
								}}, renderCell(v, key) )
								// replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')
							})
						] )
				})
			}

			ctrl.buildTableHeader = function(typeInfo){
				return m('th.row', [
						m('td.cell', m('.actionHeader', 'action')),
						Object.keys(typeInfo).map( (v)=>{
							var title = typeInfo[v].attrs&&typeInfo[v].attrs.title||''
							var description = typeInfo[v].attrs&&typeInfo[v].attrs.description||''
							return m('td.cell.'+v, {title:v+'\n'+description}, title||v )
						})
					] )
			}


		  	ctrl.updateListView = function(){
		  		self.getList().then( function(data){
		  			ctrl.savedData(data)
		  			var template = data.included[0].attributes.template
					var type = {}
					Object.keys(template)
						.sort(function(a,b){ return template[a].attrs.order - template[a].attrs.order })
						.map(function(v){ type[v] = template[v] });

					type['meta_ver'] = {type:String, attrs:{order:999}}

					ctrl.tableHeader = ctrl.buildTableHeader( type )
					ctrl.tableRows = ctrl.buildTableRows( type, data )
				})
		  	}
			ctrl.deleteRow = function(row) {
				return Global.mRequestApi('DELETE', Global.APIHOST+'/form_'+name+'/' + row.id).then( ctrl.updateListView )
			}
		  	ctrl.updateListView()
		}

		this.view = function(ctrl){
			return m_j2c('data_table',
				m('.listCon',
				[
					m('.listAction',
						[
							listMode=='edit'
							? [
								m('input[type=button][value='+ '列表模式' +']', {onclick:function(){ listMode='text'; ctrl.updateListView() }}),
								m('input[type=button][value='+ '保存编辑' +']', {onclick:function(){ listMode='text'; ctrl.updateListView() }}),
							  ]
							: m('input[type=button][value='+ '编辑模式' +']', {onclick:function(){ listMode='edit'; ctrl.updateListView() }})
						]
					),
					m('table.table', {
						config:function(el,old,context){
							if(!old){
								// $(el).width( $(el).parent().width() )
							}
						}
					},
					[ctrl.tableHeader, ctrl.tableRows] )
				])
			)
		}
	}
}




// get a form when click
function showForm(formType, options={}) {
	var container = container||document.querySelector('#container')
	options.container = options.container||container;
	m.mount(container, null );
	m.mount(container, new CanvasView(formType, options) );
}

class CanvasView {
	constructor(formType, options){
		var self = this;
		var template = formType.attributes.template
		var rowData = options.row && options.row.attributes
		var rowID = options.row && options.row.id
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

		this.populateRef = function(formName) {
			var query = '&filter[meta_ver]=>=0&include=meta_form&fields[formtype]=template'
			return Global.mRequestApi('GET', Global.APIHOST+'/form_'+formName+'?' + query)
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
		  		window.Canvas1 = ctrl.Canvas1 = self.getCanvasData().then( function(data){
		  			ctrl.savedData(data)
					return buildStageFromData( data.data.attributes.dom, null, {mode:'present', rowData:rowData} )
				})
		  	}
		  	ctrl.setTemplateValue = function(key, val, isOption){
		  		var domData = ctrl.Canvas1().getDomTree();
		  		var template = domData.template[key]
		  		var isTextArea = template.tag==='textarea'
		  		var isSelect = template.tag==='select'
				if(isTextArea) {
					template.children = val
				}else if(isSelect) {
					if(isOption) template.children = val
					else template.attrs.value = val
				}else{
					template.attrs.value = val
				}
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
			    		var T = template[v];
			    		var isSelect = T.tag=='select'
			    		var table = T.attrs.table;
			    		var tkey = T.attrs.tkey;
			    		if( table ){
			    			if(isSelect){
			    				self.populateRef(table).then(function(ret){
			    					var kv = ret.data.map(row=>{
			    						return {value:row.id, text: tkey?row.attributes[tkey]:row.id}
			    					})
			    					ctrl.setTemplateValue( v, kv, true )
			    				})
			    			}
			    			else
					    		$f.on('focus', evt=>{
					    			self.setPopListOpen(true)
					    			showPopList(formType, {
					    				tableName: table,
					    				onCellClick: function(el,data) {
					    					var id = data.row.id
					    					var value = data.row.attributes[tkey||data.key]
					    					self.setPopListOpen(false)
					    					$f.val( value )
					    					ctrl.setTemplateValue( v, value )
					    				},
					    				onRowClick: function(el,data) {
					    					console.log(el, data)
					    				},
					    			})
					    		})

			    		}
			    	})
		    	}
		    } }, [
		      m('h2', ctrl.Canvas1().Prop.title),
		      m('.canvasOp', [
		      	m('input[type=button][value='+ (rowID?'提交保存':'提交新建') +']', {onclick:function(){
		      		var domData = ctrl.Canvas1().getDomTree();
		      		var userData = {}
		      		for(let i in domData.template){
		      			// get only 'dirty input', where version > 0
		      			if(rowID && !domData.template[i].meta.version ) continue;
		      			userData[i] = Global.getInputVal(i, classList['.canvas'] ) ;
		      		}
		      		if(!rowID) userData.meta_form = {type:'formtype', id:formType.id}
		      		let apiData = {
						"data":{
							"type": domData.name ,
							"attributes": userData
						}
					}
					if(rowID){
						apiData.data.id=rowID
			      		Global.mRequestApi('PATCH', Global.APIHOST+'/form_'+domData.name+'/'+rowID, apiData).then(function(ret){
			      			console.log(ret)
			      		} )
					}else{
			      		Global.mRequestApi('POST', Global.APIHOST+'/form_'+domData.name, apiData).then(function(ret){
			      			options.row = ret.data;
			      			rowData = ret.data.attributes;
			      			rowID = ret.data.id;
			      		} )
					}
		      	}}),
		      	m('input[type=button][value=重置]', {onclick:function(){
		      		m.mount(options.container, null)
		      		showForm(formType, options)
		      	}}),
		      	m('input[type=button][value=列表]', {onclick:function(){
		      		m.mount(options.container, null)
		      		showDataList(formType, options)
		      	}}),
		     ]),
		     ctrl.Canvas1().getView(),
		    ]) )
		  }
	}
}



