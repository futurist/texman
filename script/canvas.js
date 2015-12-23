import m from 'mithril'
import * as Global from './global'
import WidgetDiv from './WidgetDiv'
import WidgetCanvas from './WidgetCanvas'
import JsonEditor from './JsonEditor'
import EE from './Events'
import UndoManager from './UndoManager'

var savedData = {"classType":"canvas","jsonData":{"attrs":{"title":"StageName","name":"Canvas1","required":false},"children":{},"style":{"fontFamily":"宋体","fontSize":12,"color":"#000000","left":100,"top":100,"width":800,"height":500,"padding":0,"paddingTop":0,"paddingBottom":0,"paddingRight":0,"paddingLeft":0,"borderWidth":0,"borderTopWidth":0,"borderRightWidth":0,"borderBottomWidth":0,"borderLeftWidth":0,"borderStyle":"solid","borderTopStyle":"solid","borderRightStyle":"solid","borderBottomStyle":"solid","borderLeftStyle":"solid","borderColor":"#666666","borderTopColor":"#666666","borderRightColor":"#666666","borderBottomColor":"#666666","borderLeftColor":"#666666","backgroundType":"color","backgroundColor":"#eeeeee","background":"#eeeeee"},"type":"stage"},"childWidget":[{"classType":"layer","jsonData":{"attrs":{"title":"plain text","name":"plain1","required":false,"key":1450354885576},"children":{"tag":"span","html":false,"children":"文字","attrs":{"style":{"fontFamily":"\"宋体\"","fontSize":"12px","color":"#000000"}}},"style":{"fontFamily":"宋体","fontSize":12,"color":"#000000","left":85,"top":60,"width":100,"height":35,"padding":0,"paddingTop":0,"paddingBottom":0,"paddingRight":0,"paddingLeft":0,"borderWidth":0,"borderTopWidth":0,"borderRightWidth":0,"borderBottomWidth":0,"borderLeftWidth":0,"borderStyle":"solid","borderTopStyle":"solid","borderRightStyle":"solid","borderBottomStyle":"solid","borderLeftStyle":"solid","borderColor":"#666666","borderTopColor":"#666666","borderRightColor":"#666666","borderBottomColor":"#666666","borderLeftColor":"#666666","backgroundType":"none","backgroundColor":"#aaaaaa","background":"none"},"type":"plain"},"childWidget":[]},{"classType":"layer","jsonData":{"attrs":{"title":"input text","name":"inputText2","required":false,"key":1450354886389},"children":{"tag":"input","attrs":{"value":"输入文字","type":"text","style":{"fontFamily":"\"宋体\"","fontSize":"12px","color":"#000000"}}},"style":{"fontFamily":"宋体","fontSize":12,"color":"#000000","left":200,"top":55,"width":60,"height":25,"padding":2,"paddingTop":2,"paddingBottom":2,"paddingRight":2,"paddingLeft":2,"borderWidth":1,"borderTopWidth":1,"borderRightWidth":1,"borderBottomWidth":1,"borderLeftWidth":1,"borderStyle":"solid","borderTopStyle":"solid","borderRightStyle":"solid","borderBottomStyle":"solid","borderLeftStyle":"solid","borderColor":"#666666","borderTopColor":"#666666","borderRightColor":"#666666","borderBottomColor":"#666666","borderLeftColor":"#666666","backgroundType":"none","backgroundColor":"#aaaaaa","background":"none"},"type":"inputText"},"childWidget":[]},{"classType":"layer","jsonData":{"attrs":{"title":"input text","name":"inputText3","required":false,"key":1450354890663},"children":{"tag":"input","attrs":{"value":"输入文字","type":"text","style":{"fontFamily":"\"宋体\"","fontSize":"12px","color":"#000000"}}},"style":{"fontFamily":"宋体","fontSize":12,"color":"#000000","left":200,"top":90,"width":80,"height":15,"padding":2,"paddingTop":2,"paddingBottom":2,"paddingRight":2,"paddingLeft":2,"borderWidth":1,"borderTopWidth":1,"borderRightWidth":1,"borderBottomWidth":1,"borderLeftWidth":1,"borderStyle":"solid","borderTopStyle":"solid","borderRightStyle":"solid","borderBottomStyle":"solid","borderLeftStyle":"solid","borderColor":"#666666","borderTopColor":"#666666","borderRightColor":"#666666","borderBottomColor":"#666666","borderLeftColor":"#666666","backgroundType":"none","backgroundColor":"#aaaaaa","background":"none"},"type":"inputText"},"childWidget":[]},{"classType":"layer","jsonData":{"attrs":{"title":"input text","name":"inputText4","required":false,"key":1450354892100},"children":{"tag":"input","attrs":{"value":"输入文字","type":"text","style":{"fontFamily":"\"宋体\"","fontSize":"12px","color":"#000000"}}},"style":{"fontFamily":"宋体","fontSize":12,"color":"#000000","left":200,"top":110,"width":75,"height":30,"padding":2,"paddingTop":2,"paddingBottom":2,"paddingRight":2,"paddingLeft":2,"borderWidth":1,"borderTopWidth":1,"borderRightWidth":1,"borderBottomWidth":1,"borderLeftWidth":1,"borderStyle":"solid","borderTopStyle":"solid","borderRightStyle":"solid","borderBottomStyle":"solid","borderLeftStyle":"solid","borderColor":"#666666","borderTopColor":"#666666","borderRightColor":"#666666","borderBottomColor":"#666666","borderLeftColor":"#666666","backgroundType":"none","backgroundColor":"#aaaaaa","background":"none"},"type":"inputText"},"childWidget":[]},{"classType":"layer","jsonData":{"attrs":{"title":"","name":"checkbox5","required":false,"key":1450354898285},"children":{"tag":"span","attrs":{"type":"checkbox","value":"下拉","style":{"fontFamily":"\"宋体\"","fontSize":"12px","color":"#000000"}},"children":["下拉","下拉2","下拉3"]},"style":{"fontFamily":"宋体","fontSize":12,"color":"#000000","left":130,"top":165,"width":90,"height":75,"padding":0,"paddingTop":0,"paddingBottom":0,"paddingRight":0,"paddingLeft":0,"borderWidth":0,"borderTopWidth":0,"borderRightWidth":0,"borderBottomWidth":0,"borderLeftWidth":0,"borderStyle":"solid","borderTopStyle":"solid","borderRightStyle":"solid","borderBottomStyle":"solid","borderLeftStyle":"solid","borderColor":"#666666","borderTopColor":"#666666","borderRightColor":"#666666","borderBottomColor":"#666666","borderLeftColor":"#666666","backgroundType":"none","backgroundColor":"#aaaaaa","background":"none"},"type":"checkbox"},"childWidget":[]},{"classType":"layer","jsonData":{"attrs":{"title":"","name":"select6","required":false,"key":1450354903875},"children":{"tag":"select","attrs":{"placeholder":"select client...","value":"","required":true,"multiple":false,"style":{"fontFamily":"\"宋体\"","fontSize":"12px","color":"#000000"}},"children":[]},"style":{"fontFamily":"宋体","fontSize":12,"color":"#000000","left":320,"top":55,"width":120,"height":35,"padding":2,"paddingTop":2,"paddingBottom":2,"paddingRight":2,"paddingLeft":2,"borderWidth":1,"borderTopWidth":1,"borderRightWidth":1,"borderBottomWidth":1,"borderLeftWidth":1,"borderStyle":"solid","borderTopStyle":"solid","borderRightStyle":"solid","borderBottomStyle":"solid","borderLeftStyle":"solid","borderColor":"#666666","borderTopColor":"#666666","borderRightColor":"#666666","borderBottomColor":"#666666","borderLeftColor":"#666666","backgroundType":"none","backgroundColor":"#aaaaaa","background":"none"},"type":"select"},"childWidget":[]},{"classType":"canvas","jsonData":{"attrs":{"title":"","name":"stage7","required":false,"key":1450354905207},"children":{},"style":{"fontFamily":"宋体","fontSize":12,"color":"#000000","left":340,"top":140,"width":160,"height":130,"padding":0,"paddingTop":0,"paddingBottom":0,"paddingRight":0,"paddingLeft":0,"borderWidth":0,"borderTopWidth":0,"borderRightWidth":0,"borderBottomWidth":0,"borderLeftWidth":0,"borderStyle":"solid","borderTopStyle":"solid","borderRightStyle":"solid","borderBottomStyle":"solid","borderLeftStyle":"solid","borderColor":"#666666","borderTopColor":"#666666","borderRightColor":"#666666","borderBottomColor":"#666666","borderLeftColor":"#666666","backgroundType":"none","backgroundColor":"#aaaaaa","background":"none"},"type":"stage"},"childWidget":[{"classType":"layer","jsonData":{"attrs":{"title":"","name":"radio1","required":false,"key":1450354909153},"children":{"tag":"span","attrs":{"type":"radio","value":"下拉","style":{"fontFamily":"\"宋体\"","fontSize":"12px","color":"#000000"}},"children":["下拉","下拉2","下拉3"]},"style":{"fontFamily":"宋体","fontSize":12,"color":"#000000","left":25,"top":15,"width":60,"height":60,"padding":0,"paddingTop":0,"paddingBottom":0,"paddingRight":0,"paddingLeft":0,"borderWidth":0,"borderTopWidth":0,"borderRightWidth":0,"borderBottomWidth":0,"borderLeftWidth":0,"borderStyle":"solid","borderTopStyle":"solid","borderRightStyle":"solid","borderBottomStyle":"solid","borderLeftStyle":"solid","borderColor":"#666666","borderTopColor":"#666666","borderRightColor":"#666666","borderBottomColor":"#666666","borderLeftColor":"#666666","backgroundType":"none","backgroundColor":"#aaaaaa","background":"none"},"type":"radio"},"childWidget":[]}]}]};

function buildStageFromData(data, parent=null) {
  var widget = data.classType=='canvas'
  ? new WidgetCanvas(parent, data.jsonData)
  : new WidgetDiv(parent, data.jsonData, data.jsonData.type)
  widget.children = data.childWidget.map(v=>{
    return buildStageFromData( v, widget )
  })
  return widget;
}


export default class Canvas {
constructor() {
  /**
   * Main Code below
   */
    var container = document.querySelector('#container');


    var Canvas1 = new WidgetCanvas(null, {
        attrs:{title:'StageName', name:'Canvas1'},
        style:{left:100, top:100, width:800, height:500, backgroundType:'color', backgroundColor:'#eeeeee', background:'#eeeeee'}
      } );

    Canvas1 = buildStageFromData(savedData)

    m.mount(container,
    {
      view: function(){
        return m('.mainCanvas', { config:function(el, isInit, context){ context.retain=true } }, [
          m('h2', Canvas1.Prop.title),
          Canvas1.getView()
        ])
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