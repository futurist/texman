import m from 'mithril'
import * as Global from './global'
import * as DataTemplate from './DataTemplate'

export function addEditorDom (savedData){
	var ID = savedData && savedData.data && savedData.data.id
	var PARAM = m.route.parseQueryString(location.hash.slice(1));
	console.log(ID)
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
		return m('.toolSet',
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
						var xhrConfig = function(xhr) {
						    xhr.setRequestHeader("Content-Type", "application/vnd.api+json");
						}

						if(ID){
							let formtype = {
								"data":{
									"type":"formtype",
									"id":ID,
									"attributes":window.Canvas1.getDomTree()
								}
							}
							m.request({method: "PATCH", url: Global.APIHOST+"/formtype/"+ID, data:formtype, serialize:function(data){ return JSON.stringify(data) }, config: xhrConfig}).then(function(data){
								console.log(data)
							})
						} else {
							let formtype = {
								"data":{
									"type":"formtype",
									"attributes":window.Canvas1.getDomTree()
								}
							}
							m.request({method: "POST", url: Global.APIHOST+"/formtype", data:formtype, serialize:function(data){ return JSON.stringify(data) }, config: xhrConfig}).then(function(ret){
								savedData = ret;
								if(ret.data && ret.data.id) ID = ret.data.id;
								console.log(ret, ID)
							})
						}

					}}),
					// m('input[type=button][value="取消"]', {onclick:function(){ alert(PARAM.ret) }}),
				])
			] )
	} }
	)
}
