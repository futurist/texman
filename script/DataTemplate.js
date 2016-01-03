import * as Global from './global'
import m from 'mithril'
import JsonEditor from './JsonEditor'
import UndoManager from './UndoManager'

export var jsonType = {
  stage:{ type:'stage', attrs: {title:'', name:''} },
  plain:{type:'plain', attrs: {title:'plain text'}, children:{tag:'span', html:false, children:"文字"}, style:{} },
  inputText:{type:'inputText', attrs: {title:'input text'}, children:{ tag:'input', attrs:{ value:'输入文字', type:'text' } },
            style:{
              "borderWidth": 1, "borderTopWidth": 1, "borderRightWidth": 1, "borderBottomWidth": 1, "borderLeftWidth": 1,
              "padding": 2, "paddingTop": 2, "paddingBottom": 2, "paddingRight": 2, "paddingLeft": 2,
            }
          },
  select:{type:'select',  attrs:{}, children:{ tag:'select', attrs:{placeholder:'请选择...', value:'', required:true, multiple:false,  }, children:[] },
        style:{
          "borderWidth": 1, "borderTopWidth": 1, "borderRightWidth": 1, "borderBottomWidth": 1, "borderLeftWidth": 1,
          "padding": 2, "paddingTop": 2, "paddingBottom": 2, "paddingRight": 2, "paddingLeft": 2,
        }
      },
  checkbox:{type:'checkbox',  attrs:{}, children:{ tag:'span', attrs:{type:'checkbox', value:'下拉' }, children:['下拉','下拉2','下拉3'] },
        style:{
        }
      },
  radio:{type:'radio',  attrs:{}, children:{ tag:'span', attrs:{type:'radio', value:'下拉' }, children:['下拉','下拉2','下拉3'] },
        style:{
        }
      },

}
export var jsonTypeSchema = {
  plain: {
    "title":"文字",
    "properties": {
      attrs:
      {
        "title": "attrs",
        "type": "object",
        "properties": {

        },
      },

      "children": {
        "title": "children",
        "type": "object",
        "properties": {
            "html": {
              "title": "is html",
              "type": "boolean",
              "default": false
            },
            "children": {
              "title": "children",
              "type": "string",
              "default":""
            },
        }
      }

    }
  },
  inputText: {
    "title":"输入",
    "properties": {
      "attrs":
      {
        "title": "attrs",
        "type": "object",
        "properties": {

        },

      },
      "children": {
        "title": "children",
        "type": "object",
        "properties": {
            "attrs": {
              "title": "attrs",
              "type": "object",
              "properties": {
					"required": {
					  "title": "required",
					  "type": "boolean",
					  "default":false
					},
                  "type": {
                    "title": "input type",
                    "type": "string",
                    "enum": [
                      "text",
                      "password",
                      "number",
                      "color"
                    ],
                    "default": "text"
                  },
                  "value": {
                    "title": "value",
                    "type": "string",
                    "default":""
                  },
            }
          }
        }
      },

    }
  },

  select: {
    "title":"选择",
    "properties": {
      "attrs":
      {
        "title": "attrs",
        "type": "object",
        "properties": {

        },

      },
      "children": {
        "title": "children",
        "type": "object",
        "properties": {
            "attrs": {
              "title": "attrs",
              "type": "object",
              "properties": {
					"required": {
					  "title": "required",
					  "type": "boolean",
					  "default":false
					},
                  "multiple": {
                    "title": "multiple",
                    "type": "boolean",
                    "default": false
                  },
                  "placeholder": {
                    "title": "placeholder",
                    "type": "string",
                    "default":""
                  },
                  "value": {
                    "title": "value",
                    "type": "string",
                    "default":""
                  },

            }
          },

          "children":{
              "title": "Options",
              "type": "array",
              "items": {
                "title": "value",
                "type": "string",
                "format": "search",
                "default":""
              }
          }


          // "children":{

          //     "title": "Options",
          //     "type": "array",
          //     "items": {
          //       "type": "object",
          //       "properties": {
          //         "option": {
          //           "type": "string",
          //         },
          //         "value": {
          //           "type": "string"
          //         },
          //       },
          //       "default":{
          //         "option":"",
          //         "value":''
          //       }
          //     }
          // }




        }
      },

    }
  },


  checkbox: {
    "title":"选择",
    "properties": {
      "attrs":
      {
        "title": "attrs",
        "type": "object",
        "properties": {

        },

      },
      "children": {
        "title": "children",
        "type": "object",
        "properties": {
            "attrs": {
              "title": "attrs",
              "type": "object",
              "properties": {
					"required": {
					  "title": "required",
					  "type": "boolean",
					  "default":false
					},
                  "value": {
                    "title": "value",
                    "type": "string",
                    "default":""
                  },

            }
          },
          "children":{
              "title": "Options",
              "type": "array",
              "items": {
                "title": "value",
                "type": "string",
                "format": "search",
                "default":""
              }
          }
        }
      },

    }
  },


  radio: {
    "title":"选择",
    "properties": {
      "attrs":
      {
        "title": "attrs",
        "type": "object",
        "properties": {
        },

      },
      "children": {
        "title": "children",
        "type": "object",
        "properties": {
            "attrs": {
              "title": "attrs",
              "type": "object",
              "properties": {
					"required": {
					  "title": "required",
					  "type": "boolean",
					  "default":false
					},
                  "value": {
                    "title": "value",
                    "type": "string",
                    "default":""
                  },

            }
          },
          "children":{
              "title": "Options",
              "type": "array",
              "items": {
                "title": "value",
                "type": "string",
                "format": "search",
                "default":""
              }
          }
        }
      },

    }
  },


}


export var jsonData = {
  "attrs": {title:'', name:'', order:0,required:false,  },
  "children": {},
  "style": {
    "fontFamily":"宋体",
    "fontSize":12,
    "color":"#000000",
    "left": 0,
    "top": 0,
    "width": 100,
    "height": 100,

    "padding": 0,
    "paddingTop": 0,
    "paddingBottom": 0,
    "paddingRight": 0,
    "paddingLeft": 0,

    "borderWidth": 0,
    "borderTopWidth": 0,
    "borderRightWidth": 0,
    "borderBottomWidth": 0,
    "borderLeftWidth": 0,

    "borderStyle": "solid",
    "borderTopStyle": "solid",
    "borderRightStyle": "solid",
    "borderBottomStyle": "solid",
    "borderLeftStyle": "solid",

    "borderColor": "#666666",
    "borderTopColor": "#666666",
    "borderRightColor": "#666666",
    "borderBottomColor": "#666666",
    "borderLeftColor": "#666666",

    "backgroundType": "none",
    "backgroundColor": "#aaaaaa",
    "background": "none"
  },
}

export var jsonSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "CONTROL_NAME",
  "type": "object",
  "properties": {
    "attrs": {
      "title": "attrs",
      "type": "object",
      "properties": {
        "title": {
          "title": "title",
          "type": "string",
          "default":""
        },
        "name": {
          "title": "name",
          "type": "string",
          // "template":"{{=3245}}"
        },
        "order": {
          "title": "order",
          "type": "number",
          "default":0
        },
        "desc": {
          "title": "description",
          "type": "string",
          "format":"textarea",
          "default":""
        },
      }
    },
    "children": {},
    "style": {
      "title": "style",
      "type": "object",
      "properties": {
        "fontFamily": {
          "title": "font name",
          "type": "string",
          "enum": [
            "宋体",
            "黑体",
            "微软雅黑",
            "Arial",
            "Verdana",
            "Times New Roman",
            "Tahoma",
          ],
          "default": "宋体"
        },
        "fontSize": {
          "title": "font size",
          "type": "integer",
          "default":12
        },
        "color": {
          "title": "color",
          "type": "string",
          "format": "color",
          "default":"#000000"
        },

        "fontStyle": {
          "title": "font style",
          "type": "string",
          "enum": [
            "normal",
            "italic",
          ],
          "default": "normal"
        },

        "fontWeight": {
          "title": "font weight",
          "type": "string",
          "enum": [
            "normal",
            "bold",
            "bolder",
          ],
          "default": "normal"
        },

        "textAlign": {
          "title": "text align",
          "type": "string",
          "enum": [
            "left",
            "center",
            "right",
          ],
          "default": "left"
        },

        "alignItems": {
          "title": "align items",
          "type": "string",
          "enum": [
            "flex-start",
            "center",
            "flex-end",
          ],
          "default": "center"
        },

        "justifyContent": {
          "title": "justify content",
          "type": "string",
          "enum": [
            "flex-start",
            "center",
            "flex-end",
          ],
          "default": "flex-start"
        },

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
        "padding": {
          "title": "padding",
          "type": "integer",
          "minimum": 0,
          "default":0
        },
        "paddingLeft":{
          "title": "padding Left",
          "inherit":"padding"
        },
        "paddingTop":{
          "title": "padding top",
          "inherit":"padding"
        },
        "paddingRight":{
          "title": "padding Right",
          "inherit":"padding"
        },
        "paddingBottom":{
          "title": "padding Bottom",
          "inherit":"padding"
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
            "",
            "none",
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
          "default": "#993333",
          "empty":"#000000"
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

        "backgroundType": {
          "title": "background type",
          "type": "string",
          "enum": [
            "none",
            "color",
            "transparent",
          ],
          "default": "none"
        },

        "backgroundColor": {
          "title": "background color",
          "type": "string",
          "format": "color",
          "default": "#ffffff"
        },

        "background": {
          "title": "background",
          "type": "string",
          "template": "{{=it.backgroundType=='none'?'none': (it.backgroundType=='color'?it.backgroundColor:'') }}"
        },

      }
    }
  }
}

/**
 * Check for one-one or one-many relation of prop
 * @return {[type]} [description]
 */
function checkPropRelation(data, path, value){
  // if borderStyle is none/'', set width to 0
  if( /(border\w+)Style$/i.test(path) && (value=='none'|| !value)
    || /(border\w+)Width$/i.test(path) && /^$|none/.test( Global.objectPath( data, path.replace(/Width$/, 'Style') ) )
  ) {
    Global.objectPath( data, path.replace(/Style$/, 'Width'), 0 );
  }
}

export function renderJsonEditor(){
  var self = this;
  var editorDom = document.querySelector('.editor')
  if(!editorDom) return false;
    if( this.isValidRect() && this.jsonData && this.jsonSchema ){
      Global._extend(this.jsonData().style, this.Prop.style)
      m.mount( editorDom , new JsonEditor( this.jsonSchema, this.jsonData, { config:(el)=>{
        // below add drag&drop function to change array item order
        $(el).find('.array .props .row').each(function(){

        })
        if(!this.jsonData().attrs.name && self.parent) this.jsonData().attrs.name = this.jsonData().type+ this.parent.children.length
        // below move all inherit to it's parent, wrap into .inheritCon, hide, and show when click
        $(el).find('.inherit').each(function(){
          var inheritClass = $(this).attr('class').split(/\s+/).filter(v=>{return v.indexOf('inherit-')>=0 }).pop()
          if(inheritClass) {
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
        var _path = path.split('.')

        checkPropRelation(data, path, value)

        ;(self.parent?self.parent.selectedWidget:[self]).forEach(v=>{
          // v.jsonData() is like {attrs:{}, style:{}, children:{}}
          // v.Prop is like { key:key, className:..., style:{} }
          // so we lookup _path[0] for which part of jsonData changed and update
          var val = Global.objectPath( data, _path );
        	Global.objectPath( v.jsonData() , _path, val );

          if(_path[0]=='style') Global.objectPath( v.Prop , _path, val );
          else if(_path[0]=='attrs'){
            Global.objectPath( v.Prop , _path.slice(1), val );
          }
        })

        m.redraw()
      }) )
    }
}

/**
 * init this.jsonSchema & this.jsonData from DataTemplate Data for LayerBaseClass and inherited
 * @param  {String} curTool toolset of jsonType, like 'plain', 'inputText' etc.
 * Usage: initDataTemplate.call(this, 'plain')
 */
export function initDataTemplate(curTool='', prop={}, schema={}) {
    var newJsonData = Global._deepCopy( {}, jsonData, jsonType[curTool], prop )
    var newJsonSchema = Global._deepCopy( {}, jsonSchema, jsonTypeSchema[curTool], schema )
    this.Prop = Global._deepCopy( this.Prop, newJsonData.attrs )
    this.Prop.style = Global._excludeJsonStyle( Global._deepCopy( {},  newJsonData.style ) )
    this.jsonSchema = m.prop(newJsonSchema)
    this.jsonData = m.prop(newJsonData)
}

