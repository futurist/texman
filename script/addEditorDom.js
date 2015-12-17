import m from 'mithril'
import * as Global from './global'
import * as DataTemplate from './DataTemplate'

export default function(){
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
					m('input[type=button][value="保存"]', {onclick:function(){ alert(1234) }})
				])
			] )
	} }
	)
}
