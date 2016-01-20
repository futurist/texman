
export var canvasForm = 
{
	'#poplist':{position:'absolute', opacity: 0.9 },

	// canvas input form
		'.canvas':{
			"overflow": "visible",
			"position": "absolute",
			width:'100%', height:'100%', border:'none', background:'none',
			' input[type=text], input[type=number], select, textarea': {
				  "borderWidth": '1px', "borderTopWidth": '1px', "borderRightWidth": '1px', "borderBottomWidth": '1px', "borderLeftWidth": '1px',
				  "padding": '2px', "paddingTop": '2px', "paddingBottom": '2px', "paddingRight": '2px', "paddingLeft": '2px', 
				width:'100%', height:'100%', border:'none', background:'none'
			}
		},
		" html": {
			"boxSizing": "border-box"
		},
		"*, *:before, *:after": {
			"boxSizing": "inherit"
		},
		"html,body": {
			"height": "100%",
			"overflow": "hidden"
		},
		" body": {
			"margin": 0,
			"padding": 0
		},
		"#container": {
			"overflow": "hidden",
			"height": "100%"
		},
		"ul,li": {
			"listStyle": "none"
		},
		"#debug": {
			"position": "absolute",
			"top": 0,
			"left": 0,
			"height": "80px",
			"width": "200px",
			"zIndex": 999999,
			"background": "#666",
			"color": "white",
			"display": "none"
		},


// canvas style

		".canvas *:focus": {
			"outline": 0
		},
		".canvas.editing": {
			"backgroundImage": "url(images/grid.png) !important",
			"border": "1px dashed blue"
		},
		".layer": {
			"position": "absolute"
		},
		".canvas.editing .content": {
			"WebkitTouchCallout": "none",
			"WebkitUserSelect": "none",
			"KhtmlUserSelect": "none",
			"MozUserSelect": "none",
			"MsUserSelect": "none",
			"userSelect": "none"
		},
		".canvas .content, .canvas .bbox": {
			"position": "absolute",
			"width": "100%",
			"height": "100%",
			"overflow": "hidden",
			"display": "flex",
			"alignItems": "center"
		},
		".layer.selected, .canvas.selected": {
			"border": "1px dashed red"
		},

		".selected>.controlPoint": {
			"display": "block"
		},
		".controlPoint.activePoint": {
			"background": "#E8E8E8"
		},
		".controlPoint": {
			"display": "none",
			"position": "absolute",
			"border": "1px solid #666"
		},

		".canvas .content input[type=text], .canvas .content input[type=number], .canvas .content select": {
			"width": "100%",
			"height": "100%",
			"border": "none",
			"background": "none"
		},
		"span[type=radio] label, span[type=checkbox] label": {
			"display": "block"
		},

		".mainCanvas": {
			"position": "absolute"
		},
		".mainCanvas h2": {
			"marginLeft": "100px"
		},
		".mainCanvas .canvasOp": {
			"marginLeft": "100px"
		},
}


export var canvasEditor = {
		":global(.editorDragContainer)": {
			"overflow": "auto",
			"height": "100%",
			"width": "100%"
		},
		":global(.editorContainer)": {
			"position": "fixed",
			"top": 0,
			"width": "200px",
			"right": 0,
			"height": "100%"
		},
		":global(.resizeBar)": {
			"position": "absolute",
			"zIndex": 9999,
			"top": 0,
			"left": 0,
			"height": "100%",
			"width": "10px",
			"background": "#efefef"
		},
		":global(.editor)": {
			"marginLeft": "20px",
			"marginBottom": "50px"
		},
		// below is json editor prop
		'.objectTitle':{
			// border_bottom: '1px solid #999'
		},
		'.props':{
			border:'1px solid #eee',
			padding:{ top$bottom: '10px', left$right: '5px'},
		},
		".row.plus .itemTitle": {
			"cursor": "pointer"
		},
		".row.plus .itemTitle:before": {
			"content": "\"+\""
		},
		".row.plus.minus .itemTitle:before": {
			"content": "\"-\""
		},
		".row": {
			"display": "table-row"
		},
		".itemTitle": {
			"textAlign": "right",
			"paddingRight": "1em"
		},
		".itemTitle, .itemValue": {
			"display": "table-cell"
		},
		".inheritCon.visible": {
			"display": "table"
		},
		".inheritCon": {
			"display": "none"
		},
		".inheritCon .itemTitle": {
			"borderLeft": "2px dashed #ccc",
			"paddingLeft": "10px"
		},
		".row input[type=text], .row input[type=number]": {
			"width": "120px"
		},
}


export var canvasToolBar = {
	":global(.toolbarContainer)": {
			"position": "fixed",
			"top": 0,
			"width": "100px",
			"left": 0,
			"height": "100%",
		    padding: '90px 0 0 13px'
		},
		".tool": {
			"margin": "10px 0",
			"cursor": "pointer",
			"WebkitTouchCallout": "none",
			"WebkitUserSelect": "none",
			"KhtmlUserSelect": "none",
			"MozUserSelect": "none",
			"MsUserSelect": "none",
			"userSelect": "none"
		},
		".tool.active": {
			"color": "red"
		},
}