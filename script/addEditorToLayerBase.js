import {extend, override} from './extend'
import LayerBaseClass from './LayerBaseClass'
import * as DataTemplate from './DataTemplate'

export default function addEditorToLayerBase () {
	override(LayerBaseClass.prototype, 'onRectChange', function(original){
		original();
		DataTemplate.renderJsonEditor.apply(this)
	} )

	override(LayerBaseClass.prototype, 'onSelected', function(original){
		original();
		DataTemplate.renderJsonEditor.apply(this)
	} )

}
