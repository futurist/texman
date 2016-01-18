import m from 'mithril'
import util from 'util_extend_exclude'
import m_j2c from './m_j2c'
import * as Global from './global'
import WidgetDiv from './WidgetDiv'
import WidgetCanvas from './WidgetCanvas'
import {buildStageFromData} from './canvas'
import jsonAPI from './jsonAPI'

import {canvasForm} from './css/formCSS'

export class formList {
	constructor(){

		// config m_j2c
		m_j2c(m).setNS('formlist')

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
		var field = '?fields[formtype]=name,title,createAt,template'
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
	options.readOnly = false
	options.showVersion = true
	console.log(options)
	m.mount(container, new DataListView(formType, options) );
}
function showPopList(formType, options={}) {
	var container = $('#poplist').show().get(0)
	options.tableStyle = options.tableStyle||{width:'auto'}
	options.container = options.container||container;
	options.listMode = 'text'
	options.readOnly = true
	options.hideAction = true
	m.mount(container, new DataListView(formType, options) );
}

var TableCache = {}
window.TableCache = TableCache

class SelectComponent{
	// typeDef = {tag:'', attrs:{}, children}
	// row = { type, id, attributes:{key:val,...} }
	constructor(typeInfo, options={}) {
		// var row = options.row||{}
		// var key = options.key||''
		// var viewMode = options.viewMode||false
		var {row={},key='',viewMode=false} = options
		if(!typeInfo||!typeInfo[key]) return [];
		var self = this
		var typeDef = typeInfo[key]
		var placeholder = typeDef.attrs.placeholder||''
		var table = typeDef.attrs.table||''
		var tkey = typeDef.attrs.tkey||''
		var isMultiple = typeDef.attrs.type=='checkbox'||typeDef.attrs.multiple
		var title = typeDef.attrs.title||''
		var selVal = row.attributes[key]
		var child = typeDef.children
		if(isMultiple) selVal = {}.toString.call(selVal)!=="[object Array]" ?[selVal]:selVal
		child = m.prop( {}.toString.call(child)!=="[object Array]" ?[child]:child )

		var getKV = function(ret) {
			var kv = ret.data.map(row=>{
				return {value:row.id, text: tkey?row.attributes[tkey]:row.id}
			})
			return kv
			// ctrl.setTemplateValue( v, kv, true )
		}
		this.controller=function(){
			if(table){
				if( !TableCache[table] ){
					TableCache[table] = jsonAPI.populateRef(table).then(getKV)
				}
				child = TableCache[table]
			}
		}

		this.view=function(){
			var dom= m('div', m_j2c('data_table_multi_view', m('div.multiView',
					child()
						.filter(v=>{
								let value =v, text=v
					            if(typeof v=='object'&&v) value=v.value, text=v.text;
								return (isMultiple?selVal.indexOf(value)>-1:selVal===value)
						})
						.map(v=>{
								let value =v, text=v
					            if(typeof v=='object'&&v) value=v.value, text=v.text;
								return m('span', text)
						})
					)))
			if(viewMode){
				return dom
			}else{
				return m('select', Global._extend(Global._exclude(Global.clone(typeInfo[key].attrs), ['value']), {
						name: row.id+'_'+key,
						multiple:isMultiple,
						title:isMultiple?'按Ctrl键点击可多选\n'+title:title,
						oninput:options.onChange }),
					[
						!isMultiple? m('option', { value:''} , placeholder): [],
						child().map(v=>{
							let value =v, text=v
				            if(typeof v=='object'&&v) value=v.value, text=v.text;
							return m('option'+( (isMultiple?selVal.indexOf(value)>-1:selVal===value) ?'[selected]':''), { value:value }, text)
						})
					]
				)
			}
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
		options.filter = options.filter||{}
		options.sort = options.sort||{}
		options.sortField = options.sortField||[]
		m_j2c.add('data_table', {
			'.table': util._extend( {display:'table', table_layout: 'fixed', border_collapse:'collapse' }, options.tableStyle ),
			'.row':{display:'table-row'},
			'.data.row:hover':{background:'#ccc'},
			'.lastEditRow':{ background:'rgba(255,204,204,1)', '-webkit-transition': 'background-color 10s' },
			'.lastEditRowNormal':{ background:'rgba(255,204,204,0)' },
			'.cell':{display:'table-cell', width: '2%', padding: '5px', border:'1px solid #ccc'},
			'.cell textarea':{ width:'100%', height:'100%', border:'none', background:'none', resize:'none' },
			'.cell[data-dirty=true]':{background:'#ffaaaa', border_style:'dashed'},
			'a.action':{margin:'0 4px'},
			'.listAction input':{ margin:'10px 4px' },
			'.listCon':{ height:'100%', overflow:'auto' },
			':global(.iconfont).uparrow': {
				'&:before':{ content: '"\\e801"' }
			},
			':global(.iconfont).downarrow:before':{
			  content: '"\\e800"'
			},
			'.grey':{
				color:'#999'
			},
		})

		m_j2c.add('data_table_multi_view', {
			'.multiView span':{ background_color:'#ccc', color:'#333', margin:'0 5px' },
		})

		this.controller = function(){
			var ctrl = this;
		  	var changedData = {}
		  	var isDirty = function(row, key){
		  		if( row.id in changedData ) return key in changedData[row.id];
		  		else return false
		  	}
		  	var logChange = function(row, key, val){
		  		var old = row.attributes[key]
		  		if( !(row.id in changedData) ) changedData[row.id]={};
		  		if( !(key in changedData[row.id] ) ) changedData[row.id][key] = { oldVal: !Global.isNumeric(old)?(old||''):old }
		  		if( changedData[row.id][key].oldVal!=val ) changedData[row.id][key].newVal = val
		  		else delete changedData[row.id][key];
		  	}
		  	ctrl.saveList=function(){
		  		Object.keys(changedData).forEach(rowID=>{
		  			var list = Object.keys(changedData[rowID])
		  			if(list.length===0) return delete changedData[rowID];
		  			var data = {}
		  			list.forEach(v=>{ data[v]=changedData[rowID][v].newVal })
		      		let apiData = {
						"data":{
							"type": name ,
							"id": rowID,
							"attributes": data
						}
					}
		      		Global.mRequestApi('PATCH', Global.APIHOST+'/form_'+name+'/'+rowID, apiData).then(function(ret){
		      			console.log(ret)
		      			delete changedData[rowID]
		      		})
		  		})
		  	}
		  	ctrl.savedData = m.prop()
			ctrl.buildTableRows = function(typeInfo, data){
				var renderCell = function(row, key){
					var isTextArea = typeInfo[key].tag=='textarea'
					var isSelect = /select|span/.test(typeInfo[key].tag)
					switch(listMode){
						case 'edit':
							if(isTextArea){
								return m('textarea', Global._extend(Global.clone(typeInfo[key].attrs), { name: row.id+'_'+key, oninput:function(){
									logChange(row, key, $(this).val() )
									row.attributes[key] = $(this).val()
								}}), row.attributes[key]||'')
							}

							if(isSelect) {
								return [new SelectComponent( typeInfo, {row:row, key:key, viewMode:false, onChange:function(){
									logChange(row, key, $(this).val() )
									row.attributes[key] = $(this).val()
								} } )]
							}
							return m('input', Global._extend( Global.clone(typeInfo[key].attrs) , { name:row.id+'_'+key, value:row.attributes[key]||'', oninput:function(){
								logChange(row, key, this.value)
								row.attributes[key] = $(this).val()
							}}) )
						case 'text':
						default:
							return isSelect? new SelectComponent( typeInfo, {row:row, key:key, viewMode:true} ) : row.attributes[key]||''
					}
				}
				var renderAction = function(row){
					if(options.hideAction||options.readOnly)return []
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
					return m('tr.data.row',
							{
								config: function(el,old,context){
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
								return m('td.cell.'+key, {
									className: options.row&&options.row.id==v.id?'lastEditRow':'',
									key: v.id+key,
									'data-dirty': isDirty(v, key), 
									config: function(el,old,context){
									if(old) return;
									setTimeout( function(){
										$(el).addClass( m_j2c.getClass('data_table').lastEditRowNormal )
									},2000)
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
				return m('th.head.row', [
						options.hideAction||options.readOnly?[]:m('td.cell', m('.actionHeader', 'action')),
						Object.keys(typeInfo).map( (v)=>{
							var title = typeInfo[v].attrs&&typeInfo[v].attrs.title||''
							var description = typeInfo[v].attrs&&typeInfo[v].attrs.description||''
							return m('td.cell.'+v, { title:v+'\n'+description}, 
								[
									title||v,
									m('i', {className: 'global(iconfont) '+ (options.sort[v]>0?'down':'up') +'arrow '+(~options.sortField.indexOf(v)?'':' grey'), onclick:function(){ 
										var pos = options.sortField.indexOf(v)
										var curSort = (v in options.sort)? options.sort[v] : -1
										options.sort[v]= ~pos?-curSort:curSort
										// ~pos && options.sortField.splice(pos,1)
										// Global._addToSet(true, options.sortField, v)
										options.sortField = [v]
										ctrl.updateListView()
									} }),
								
									m('.searchBox', m('input[type=text][name='+v+']', {onkeydown:function(e){
											if(e.keyCode==13){
												options.filter[v]=this.value
												ctrl.updateListView()
											}
										}
									}) ),
								] )
						})
					] )
			}
			ctrl.setSortDir = function(field, dir){
				options.sort[field] = dir||-1
				return options.sort[field]
			}
			ctrl.revertSortDir = function(field){
				getSortDir(field)
				return options.sort[field]
			}
			ctrl.getList = function() {
				var query = '&include=meta_form&fields[formtype]=template'
				if(options.version) query+='&filter[meta_ver]=<='+ options.version +''
				if(options.sortField.length) query+='&sort='+ options.sortField.map(v=>((options.sort[v]||-1)>0?'<':'>') + v).join(',,,');
				Object.keys(options.filter).forEach(v=>{
					query+='&filter['+v+']=:'+ options.filter[v]
				})
				return Global.mRequestApi('GET', Global.APIHOST+'/form_'+name+'?' + query)
			}
		  	ctrl.updateListView = function(){
		  		ctrl.getList().then( function(data){
		  			ctrl.savedData(data)
		  			var template = data.included[0].attributes.template
					var type = {}
					Object.keys(template)
						.sort(function(a,b){ return template[a].attrs.order - template[a].attrs.order })
						.map(function(v){
							type[v] = template[v]
						});

					if(options.showVersion) type['meta_ver'] = {tag:'input', attrs:{order:999, readOnly:true}}

					ctrl.tableHeader = function(){ return ctrl.buildTableHeader( type ) }
					ctrl.tableRows = function(){ return ctrl.buildTableRows( type, data ) }
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
								m('input[type=button][value='+ '保存编辑' +']', {onclick:function(){ ctrl.saveList() }}),
							  ]
							: ( options.readOnly?[]:m('input[type=button][value='+ '编辑模式' +']', {onclick:function(){ listMode='edit'; ctrl.updateListView() }}) )
						]
					),
					m('table.table', {
						config:function(el,old,context){
							if(!old){
								// $(el).width( $(el).parent().width() )
							}
						}
					},
					ctrl.savedData()?[ctrl.tableHeader(), ctrl.tableRows()]:[] )
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

		this.getCanvasData = function() {
			return Global.mRequestApi('GET', Global.APIHOST+'/formtype/'+formType.id)
		}

		  this.controller = function(){
		  	var ctrl = this;
		  	ctrl.savedData = m.prop()
		  	ctrl.domCache={}
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

		    return ctrl.domCache['Canvas1']?{subtree:'retain'}: m_j2c('', 'canvasForm', m('.mainCanvas', { config:function(el, isInit, context){
		    	context.retain=true
		    	if(!isInit){
		    		setTimeout(function(){ ctrl.domCache['Canvas1'] = true })
			    	Object.keys(template).forEach(function(v) {
			    		var $f = $('[name="'+ v +'"]')
			    		var T = template[v];
			    		var isSelect = T.tag=='select'
			    		var table = T.attrs.table;
			    		var tkey = T.attrs.tkey;
			    		if( table ){
			    			if(isSelect){
			    				jsonAPI.populateRef(table).then(function(ret){
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
			      			options.row = ret.data;
			      		} )
					}else{
			      		Global.mRequestApi('POST', Global.APIHOST+'/form_'+domData.name, apiData).then(function(ret){
			      			options.row = ret.data;
			      			rowData = ret.data.attributes;
			      			rowID = ret.data.id;
			      			ctrl.domCache={}
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



