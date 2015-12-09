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

      "borderWidth": 1,
      "borderStyle": "solid",
      "borderColor": "#993333",

      "borderTopWidth": 1,
      "borderTopStyle": "solid",
      "borderTopColor": "#993333",

      "borderRightWidth": 1,
      "borderRightStyle": "solid",
      "borderRightColor": "#993333",

      "borderBottomWidth": 1,
      "borderBottomStyle": "solid",
      "borderBottomColor": "#993333",

      "borderLeftWidth": 1,
      "borderLeftStyle": "solid",
      "borderLeftColor": "#993333",

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
              "minimum": 0,
              "default":100
            },
            "height": {
              "title": "height",
              "type": "integer",
              "minimum": 0,
              "default":100
            },
            "borderWidth": {
              "title": "border width",
	            "type": "integer",
              "minimum": 0,
	            "default":1
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
            "borderLeftWidth":{
              "title": "border left width",
            	"inherit":"borderWidth"
            },
            "borderLeftStyle":{
              "title": "border left style",
            	"inherit":"borderStyle"
            },
            "borderLeftColor":{
              "title": "border left color",
            	"inherit":"borderColor"
            },
            "borderTopWidth":{
              "title": "border top width",
            	"inherit":"borderWidth"
            },
            "borderTopStyle":{
              "title": "border top style",
            	"inherit":"borderStyle"
            },
            "borderTopColor":{
              "title": "border top color",
            	"inherit":"borderColor"
            },
            "borderRightWidth":{
              "title": "border right width",
            	"inherit":"borderWidth"
            },
            "borderRightStyle":{
              "title": "border right style",
            	"inherit":"borderStyle"
            },
            "borderRightColor":{
              "title": "border right color",
            	"inherit":"borderColor"
            },
            "borderBottomWidth":{
              "title": "border bottom width",
            	"inherit":"borderWidth"
            },
            "borderBottomStyle":{
              "title": "border bottom style",
            	"inherit":"borderStyle"
            },
            "borderBottomColor":{
              "title": "border bottom color",
            	"inherit":"borderColor"
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
      this.Prop.style = Global.clone(jsonData.attrs.style);
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
    var self = this;
    var Prop = Global.applyProp(this.Prop)
    var dom = m('div.layer', Prop, [
        m('.content', {config: function(el,isInit,context){context.retain=true} } ),
        m('.bbox', {config: function(el,isInit,context){context.retain=true} } ),
        this.buildControlPoint()
      ] )
		return this.isValidRect()
		? dom
		: []
	}
}
