import * as Global from './global'
import m from 'mithril'
import {extend, override} from './extend'
import LayerBaseClass from './LayerBaseClass'
import JsonEditor from './JsonEditor'

function renderJsonEditor(){
	var self = this;
    if( this.isValidRect() && this.jsonData && this.jsonSchema ){
      Global._extend(this.jsonData().style, this.Prop.style)
      m.mount( document.querySelector('.editor'), new JsonEditor( this.jsonSchema, this.jsonData, { config:function(el){
      	$(el).find('.inherit').each(function(){
      		var inheritClass = $(this).attr('class').split(/\s+/).filter(v=>{return v.indexOf('inherit-')>=0 }).pop()
      		if(inheritClass){
      			var parentClass = inheritClass.split('-').pop();
      			var pEl = $(`[data-key="${parentClass}"]`);
      			var con = pEl.next('.inheritCon')
      			if(!con.length){
      				con = $(`<div class="inheritCon"></div>`)
      				pEl.after( con )
      				$(`.${inheritClass}`).appendTo(con)
      			}
	      		// $(`.${inheritClass}`).after(pEl)
      			pEl.addClass('plus').off().on('click', '.itemTitle', e=>{ 
      				pEl.toggleClass('minus')
      				con.toggleClass('visible')
      			} )
      		}
      	})
      } }, function(path,value, getData, data ){
      	path = path.replace(/^root\./,'')
      	// if borderStyle is none/'', set width to 0 
      	if( /(border\w+)Style$/i.test(path) && (value=='none'|| !value) 
      		|| /(border\w+)Width$/i.test(path) && /^$|none/.test( Global.objectPath( data, path.replace(/Width$/, 'Style') ) )
      	) {
      		Global.objectPath( data, path.replace(/Style$/, 'Width'), 0 );
      	}
        Global._extend(self.Prop.style, getData.style)
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
