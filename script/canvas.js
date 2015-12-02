import m from 'mithril'
import * as Global from './global'
import WidgetDiv from './WidgetDiv'
import WidgetCanvas from './WidgetCanvas'

/**
 * Main Code below
 */

var container = document.querySelector('#container');
var Canvas1 = new WidgetCanvas(null, { style:{left:100, top:100, width:800, height:500, backgroundColor:'#eee'} } );
m.mount(container, Canvas1);


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

		    if(isInput) break;
		    Canvas1.removeSelectedItem();
		    handled = true;
		    break;


          case 37: // left
            Canvas1.moveSelectedBy(-GRID_SIZE,0);
            handled = true;
          break;

          case 38: // up
            Canvas1.moveSelectedBy(0,-GRID_SIZE);
            handled = true;
          break;

          case 39: // right
            Canvas1.moveSelectedBy(GRID_SIZE,0);
            handled = true;
          break;

          case 40: // down
            Canvas1.moveSelectedBy(0,GRID_SIZE);
            handled = true;
          break;


		}
	}


    if (cmd === 1 || cmd === 8) {	//ctrl key
		  CTRL_KEY_DOWN = 1;
      switch (evt.keyCode) {

        case 68:  //Ctrl+D
        	Canvas1.duplicateSelected();
          handled = true;
          break;

          case 37: // ctrl+left
            Canvas1.moveSelectedBy(-1,0);
            handled = true;
          break;

          case 38: // ctrl+up
            Canvas1.moveSelectedBy(0,-1);
            handled = true;
          break;

          case 39: // ctrl+right
            Canvas1.moveSelectedBy(1,0);
            handled = true;
          break;

          case 40: // ctrl+down
            Canvas1.moveSelectedBy(0,1);
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

          case 37: // shift+left
            Canvas1.resizeSelectedBy(-GRID_SIZE,0);
            handled = true;
          break;

          case 38: // shift+up
            Canvas1.resizeSelectedBy(0,-GRID_SIZE);
            handled = true;
          break;

          case 39: // shift+right
            Canvas1.resizeSelectedBy(GRID_SIZE,0);
            handled = true;
          break;

          case 40: // shift+down
            Canvas1.resizeSelectedBy(0,GRID_SIZE);
            handled = true;
          break;


      }
    }


    if (cmd === 5 || cmd === 12) {	// ctrl+shift
    	SHIFT_KEY_DOWN = 1;
    	CTRL_KEY_DOWN = 1;

      switch (evt.keyCode) {


          case 37: // ctrl+shift+left
            Canvas1.resizeSelectedBy(-1,0);
            handled = true;
          break;

          case 38: // ctrl+shift+up
            Canvas1.resizeSelectedBy(0,-1);
            handled = true;
          break;

          case 39: // ctrl+shift+right
            Canvas1.resizeSelectedBy(1,0);
            handled = true;
          break;

          case 40: // ctrl+shift+down
            Canvas1.resizeSelectedBy(0,1);
            handled = true;
          break;

      }
    }


    if(handled){
      evt.preventDefault();
      return;
    }

}
