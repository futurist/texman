import m from 'mithril'
import * as Global from './global'
import WidgetDiv from './WidgetDiv'
import WidgetCanvas from './WidgetCanvas'
import JsonEditor from './JsonEditor'
import EE from './Events'
import UndoManager from './UndoManager'


import m_j2c from './m_j2c'
import {canvasForm} from './css/formCSS'

m_j2c(m).add('', 'canvasForm', canvasForm)
window.mm = m_j2c

export function buildStageFromData(data, parent=null, options={}) {
  var widget = data.classType=='canvas'
  ? new WidgetCanvas(parent, data.jsonData, options)
  : new WidgetDiv(parent, data.jsonData, Global._extend( {tool:data.jsonData.type}, options ) )
  widget.children = data.childWidget.map(v=>{
    return buildStageFromData( v, widget, options )
  })
  return widget;
}


export default class Canvas {
constructor(savedData) {
  /**
   * Main Code below
   */
    var container = document.querySelector('#container');


    var Canvas1;
    if(savedData && savedData.data && savedData.data.attributes && savedData.data.attributes.dom){
      Canvas1 = buildStageFromData(savedData.data.attributes.dom)
    }else{
      Canvas1 = new WidgetCanvas(null, {
          attrs:{title:'StageName', name:'Canvas1'},
          style:{left:100, top:100, width:800, height:500, backgroundType:'color', backgroundColor:'#eeeeee', background:'#eeeeee'}
        } );
    }

    m.mount(container,
    {
      view: function(){
        return m_j2c('', 'canvasForm', m('.mainCanvas', { config:function(el, isInit, context){ context.retain=true } }, [
          m('h2', Canvas1.Prop.title),
          Canvas1.getView()
        ]) )
      }
    }
    );

    window.Canvas1 = Canvas1;
    Global.curTool = 'plain'

    /**
     * DOM EVENT BELOW
     */
    // check mouse out of Main Canvas, to prevent mouse out problem
    container.onmouseover = function(e){
    	if(e.target.id == 'container') Canvas1.mouseUpFunc(e)
    }


    // short key event
    window.addEventListener('keydown', handleShortKeyDown);
    window.addEventListener('keyup', handleShortKeyUp);

    var SHIFT_KEY_DOWN = 0;
    var CTRL_KEY_DOWN = 0;
    var META_KEY_DOWN = 0;

    function isInputElementActive(){
      var isInput = false;
      // Some shortcuts should not get handled if a control/input element
      // is selected.
      var curElement = document.activeElement || document.querySelector(':focus');
      var curElementTagName = curElement && curElement.tagName.toUpperCase();
      if (curElementTagName === 'INPUT' ||
          curElementTagName === 'TEXTAREA' ||
          curElementTagName === 'SELECT') {

        isInput = true;
      }
      return isInput;
    }

    function handleShortKeyUp (evt) {
      var isInput = isInputElementActive();
      if(isInput) return;
      var cmd = (evt.ctrlKey ? 1 : 0) |
            (evt.altKey ? 2 : 0) |
            (evt.shiftKey ? 4 : 0) |
            (evt.metaKey ? 8 : 0);

        if ( /control/i.test(evt.keyIdentifier) ) {	//ctrl key
    		CTRL_KEY_DOWN = 0;
    	}
        if ( /shift/i.test(evt.keyIdentifier) ) {	//ctrl key
    		SHIFT_KEY_DOWN = 0;
    	}

        if ( /meta/i.test(evt.keyIdentifier) ) {	//ctrl key
    		META_KEY_DOWN = 0;
    	}

    }

    function handleShortKeyDown (evt) {
    	var handled = false;
    	var isInput = isInputElementActive();
      if(isInput) return;

    	var cmd = (evt.ctrlKey ? 1 : 0) |
    	    (evt.altKey ? 2 : 0) |
    	    (evt.shiftKey ? 4 : 0) |
    	    (evt.metaKey ? 8 : 0);

    	if (cmd === 8) { // meta
    		META_KEY_DOWN = 1;
    	}
    	if (cmd === 0) { // no control key pressed at all.

    		// console.log(evt, evt.keyCode);
    		switch (evt.keyCode) {
    		  case 8:  //backspace key : Delete the shape
    		  case 46:  //delete key : Delete the shape

            EE.emit('remove', evt)
    		    handled = true;
    		    break;


              case 37: // left
                EE.emit('moveBy', {x:-Global.GRID_SIZE,y:0})
                handled = true;
              break;

              case 38: // up
                EE.emit('moveBy', {x:0, y:-Global.GRID_SIZE})
                handled = true;
              break;

              case 39: // right
                EE.emit('moveBy', {x:Global.GRID_SIZE,y:0})
                handled = true;
              break;

              case 40: // down
                EE.emit('moveBy', {x:0, y:Global.GRID_SIZE})
                handled = true;
              break;


    		}
    	}


        if (cmd === 1 || cmd === 8) {	//ctrl key
    		  CTRL_KEY_DOWN = 1;
          switch (evt.keyCode) {

            case 90:  //Ctrl+Z
              UndoManager.undo();
              handled = true;
              break;

            case 68:  //Ctrl+D
              EE.emit('duplicate', evt)
              handled = true;
              break;

              case 37: // left
                EE.emit('moveBy', {x:-1,y:0})
                handled = true;
              break;

              case 38: // up
                EE.emit('moveBy', {x:0, y:-1})
                handled = true;
              break;

              case 39: // right
                EE.emit('moveBy', {x:1,y:0})
                handled = true;
              break;

              case 40: // down
                EE.emit('moveBy', {x:0, y:1})
                handled = true;
              break;


            case 90:  //Ctrl+Z
                handled = true;
              break;
          }
        }


        if (cmd === 4) {	// shift
        	SHIFT_KEY_DOWN = 1;
          switch (evt.keyCode) {

              case 37: // left
                EE.emit('resizeBy', {w:-Global.GRID_SIZE,h:0})
                handled = true;
              break;

              case 38: // up
                EE.emit('resizeBy', {w:0, h:-Global.GRID_SIZE})
                handled = true;
              break;

              case 39: // right
                EE.emit('resizeBy', {w:Global.GRID_SIZE,h:0})
                handled = true;
              break;

              case 40: // down
                EE.emit('resizeBy', {w:0, h:Global.GRID_SIZE})
                handled = true;
              break;

          }
        }


        if (cmd === 5 || cmd === 12) {	// ctrl+shift
        	SHIFT_KEY_DOWN = 1;
        	CTRL_KEY_DOWN = 1;

          switch (evt.keyCode) {
            case 90:  //Ctrl+Shift+Z
              UndoManager.redo();
              handled = true;
              break;

              case 37: // left
                EE.emit('resizeBy', {w:-1,h:0})
                handled = true;
              break;

              case 38: // up
                EE.emit('resizeBy', {w:0, h:-1})
                handled = true;
              break;

              case 39: // right
                EE.emit('resizeBy', {w:1,h:0})
                handled = true;
              break;

              case 40: // down
                EE.emit('resizeBy', {w:0, h:1})
                handled = true;
              break;


          }
        }


        if(handled){
          evt.preventDefault();
          return;
        }

    }

}
}