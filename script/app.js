import * as Global from './global'
import m from 'mithril'
import canvas from './canvas'
import addEditorDom from './addEditorDom'

// import editor from './editor'
// new editor()

var PARAM = m.route.parseQueryString(location.hash.slice(1));
// Object {id: "567a078c03b3e16c150ddb40", ret: "http://1111hui.com:4000/formtype/567a078c03b3e16c150ddb40"}

if(PARAM.id){
	m.request({ method:'GET', url: Global.APIHOST+'/formtype/'+PARAM.id }).then(function (savedData) {
		new canvas(savedData)
		addEditorDom(savedData)
	})
} else {
	new canvas()
	addEditorDom()
}

