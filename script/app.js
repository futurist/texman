import canvas from './canvas'
new canvas()

// import editor from './editor'
// new editor()

import JsonEditor from './JsonEditor'

window.initEditor = function initEditor (argument) {
	var testSchema = m.prop( sampleSchema )
	var testDATA = m.prop( sampleData )
	m.mount( document.querySelector('.editor'), new JsonEditor( testSchema , testDATA, null, null ) )
}

