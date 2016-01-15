import m from 'mithril'
import * as Global from './global'
import * as DataTemplate from './DataTemplate'

import m_j2c from './m_j2c'
import {canvasToolBar} from './css/formCSS'

m_j2c(m).add('', 'canvasToolBar', canvasToolBar)


export function addEditorDom (savedData){
	var ID = savedData && savedData.data && savedData.data.id
	var PARAM = m.route.parseQueryString(location.hash.slice(1));
	// editor container & resize bar
	var dragFunc = DragFactory();
	var initEditorWidth = 400;
	var downFunc = dragFunc('resizeBar', {width:initEditorWidth}, function(e, data){
			if( data.data.width +data.dx<=40 )return false;
			con.style.width = data.data.width + data.dx +'px'
		}, function(e, data){
			data.data.width +=data.dx
		});
	document.querySelector('.resizeBar').onmousedown = downFunc

	var con = document.querySelector('.editorContainer');
	con.style.width = initEditorWidth+'px'


	// add toolbox
	m.mount( document.querySelector('.toolbarContainer'), {view: ()=>{
		return m_j2c('', 'canvasToolBar', m('.toolSet',
			[
				m('.stageProp.tool', {onclick:function(){
					DataTemplate.renderJsonEditor.apply(Canvas1)
				}}, 'STAGE' ),
				Object.keys(DataTemplate.jsonType).map(
					v=>
						m('.tool', {
							className: v==Global.curTool?'active':'',
							onclick:function(){
								Global.curTool=v
							}
						}, v)
				),
				m('.save', [
					m('input[type=button]', {value: ID?'更新':'创建', onclick:function(){
						var dom = window.Canvas1.getDomTree();
						if(dom.dom.childWidget.length==0) return alert('无法保存空白画布');
						if(ID){
							let formtype = {
								"data":{
									"type":"formtype",
									"id":ID,
									"attributes":dom
								}
							}
							Global.mRequestApi("PATCH", Global.APIHOST+"/formtype/"+ID, formtype).then(function(data){
								console.log(data)
							})
						} else {
							let formtype = {
								"data":{
									"type":"formtype",
									"attributes":dom
								}
							}
							Global.mRequestApi("POST", Global.APIHOST+"/formtype", formtype).then(function(ret){
								savedData = ret;
								if(ret.data && ret.data.id) ID = ret.data.id;
								if(ID){
									window.location.hash = 'id=' + ID
								}
							})
						}

					}}),
					// m('input[type=button][value="取消"]', {onclick:function(){ alert(PARAM.ret) }}),
				])
			] ) )
	} }
	)
}
