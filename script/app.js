import canvas from './canvas'
new canvas()

// import editor from './editor'
// new editor()




// editor container & resize bar
var dragFunc = DragFactory();
var initEditorWidth = 300;
var downFunc = dragFunc('resizeBar', {width:initEditorWidth}, function(e, data){
		if( data.data.width +data.dx<=40 )return false;
		con.style.width = data.data.width + data.dx +'px'
	}, function(e, data){
		data.data.width +=data.dx
	});
document.querySelector('.resizeBar').onmousedown = downFunc

var con = document.querySelector('.editorContainer');
con.style.width = initEditorWidth+'px'

