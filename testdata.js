var sampleData = {
  "tag": "div",
  "attrs": {
    "style": {
      "display": "block",
      "width": "100px",
      "height": "100px",
      "border": "1px solid #933"
    }
  },
  "children": "div content"
}

var sampleSchema ={
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "V-DOM JSON Editor",
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
            "display": {
              "title": "display",
              "type": "string",
              "default": "block"
            },
            "widthValueUnit": {
              "type": "array",
              "format": "table",
              "title": "width value unit",
              "items": {
                "type": "object",
                "title": "width",
                "properties": {
                  "width": {
                    "type": "integer",
                    "default": 2,
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
                  "width": "200",
                  "unit": "px"
                }
              ]
            },
            "width": {
              "title": "width",
              "type": "string",
              "template": "{{widthValueUnit.0.width}}{{widthValueUnit.0.unit}}",
              "default":"100px"
            },
            "height": {
              "title": "height",
              "type": "string",
              "default": "100px"
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
            "visibility": {
              "title": "visibility",
              "type": "string",
              "enum": [
                "visible",
                "hidden",
              ],
              "default": "visible"
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