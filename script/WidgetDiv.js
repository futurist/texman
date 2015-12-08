import m from 'mithril'
import * as Global from './global'
import LayerBaseClass from './LayerBaseClass'
import JsonEditor, {initEditor} from './JsonEditor'

var jsonData = {
  "tag": "div",
  "attrs": {
    "style": {
      "left": 0,
      "top": 0,
      "width": 100,
      "height": 100,
      "borderLeftWidth": "1px solid #933",
      "backgroundColor": "#fff"
    }
  },
  "children": "div content"
}

var jsonSchema ={
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "DIV",
  "type": "object",
  "properties": {
    "tag": {
      "title": "tag",
      "type": "string",
      "default": "div"
    },
    "attrs": {
      "title": "attrs",
      "type": "object",
      "properties": {
        "style": {
          "title": "style",
          "type": "object",
          "properties": {
            "left": {
              "title": "left",
              "type": "integer",
              "default":100
            },
            "top": {
              "title": "top",
              "type": "integer",
              "default":100
            },
            "width": {
              "title": "width",
              "type": "integer",
              "default":100
            },
            "height": {
              "title": "height",
              "type": "integer",
              "default":100
            },
            "borderWidth": {
              "type": "array",
              "format": "table",
              "title": "border width",
              "items": {
                "type": "object",
                "title": "width",
                "properties": {
                  "width": {
                    "type": "integer",
                    "minimum": 0
                  },
                  "unit": {
                    "type": "string",
                    "enum": [
                      "px",
                      "pt",
                      "em",
                      "ex",
                      "vw",
                      "vh"
                    ],
                    "default": "px"
                  }
                }
              },
              "default": [
                {
                  "width": "2",
                  "unit": "px"
                }
              ]
            },
            "borderStyle": {
              "title": "border style",
              "type": "string",
              "enum": [
                "solid",
                "dotted",
                "dashed"
              ],
              "default": "solid"
            },
            "borderColor": {
              "title": "border color",
              "format": "color",
              "type": "string",
              "default": "#993333"
            },
            "border": {
              "title": "border",
              "type": "string",
              "template": "{{borderWidth.0.width}}{{borderWidth.0.unit}} {{borderStyle}} {{borderColor}}"
            },
            "backgroundColor": {
              "title": "background color",
              "type": "string",
              "format": "color",
              "default": "#ffffff"
            },
          }
        }
      }
    },
    "children": {
      "title": "children",
      "type": "string",
      "format": "textarea",
      "default": "div content"
    }
  }
}



export default class WidgetDiv extends LayerBaseClass {

	constructor(parent, prop) {
		super(parent, prop);
		this.parent = parent;
    this.ID = Global.NewID()
    this.Prop.key = this.ID
    this.jsonSchema = m.prop(jsonSchema)
    this.jsonData = m.prop(jsonData)
	}
  onRectChange(){
    super.onRectChange()
  }
  onSelected(){
    super.onSelected()
  }
  onUnSelected () {
    m.mount(document.querySelector('.editor'), null)
    super.onUnSelected()
  }
	controller (){
		this.onunload = function(){

		}
	}

	view (ctrl) {
		var Prop = Global._exclude( this.Prop, ['eventData','isNew'] )
    Prop.style = Global._deepCopy( {}, this.Prop.style )
    Global.applyStyle( Prop, Prop.style )
		return Prop.style.width&&Prop.style.height
		? m('div.layer', Prop, [
				m('.content'),
				m('.bbox'),
				this.buildControlPoint()
			] )
		: []
	}
}
