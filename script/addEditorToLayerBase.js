import * as Global from './global'
import m from 'mithril'
import {extend, override} from './extend'
import LayerBaseClass from './LayerBaseClass'
import JsonEditor from './JsonEditor'

function renderJsonEditor(){
	var self = this;
    if( this.isValidRect() && this.jsonData && this.jsonSchema ){
      Global._extend(this.jsonData().attrs.style, this.Prop.style)
      m.mount( document.querySelector('.editor'), new JsonEditor( this.jsonSchema, this.jsonData, null, function(val, path){
        Global._extend(self.Prop.style, val.attrs.style)
		m.redraw()
      }) )
    }
}

export default function addEditorToLayerBase () {
	override(LayerBaseClass.prototype, 'onRectChange', function(original){
		original();
		renderJsonEditor.apply(this)
	} )

	override(LayerBaseClass.prototype, 'onSelected', function(original){
		original();
		renderJsonEditor.apply(this)
	} )

}
