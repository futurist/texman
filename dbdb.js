
/**
 * [RecordTypes Dictionary]
 * @type _type is additional field key that using in RecordForm Component
 */
/*
Thank you for the detailed explain. I see, it's a direction of MVC to not touch some thing, and leave more to let developer decide what to do.
And I'm thinking whether can using mithril as a node server to `route` request, that way better not touch more DOM and maybe the
*/

var DBDB =
{
    'Computer': {
        meta:{
            title: 'Computer List',
            mainKey:'userid',
            desc: 'computer list of company',
        },
        template:{
          'userid':{ tag:'input', attrs:{title:'UserID', readOnly:true} },
          'ip':{ tag:'input',
              attrs:{ value:'111.11.12.34', title:'IP', type:'text', required:true, pattern:["number"], placeholder:'this is ip' } },
          // 'client1':{ tag:'input', attrs:{value:'awefawef', title:'Client', pattern:['domain'], placeholder:'this is client'} },
          'client2':{ tag:'select', attrs:{title:'select', name:'Client2', placeholder:'select client...', required:true, multiple:false,  }, children:['下拉','下拉2','下拉3'] },

          'client3':{ tag:'span', attrs:{title:'checkbox', name:'Client3',required:true, type:'checkbox' }, children:['下拉','下拉2','下拉3'] },

          'client':{ tag:'span', attrs:{title:'radio', name:'Client4',required:true, type:'radio' }, children:['下拉','下拉2','下拉3'] },

        }
    },

    'Computer11':{

      meta:{
            title: 'Computer List',
            mainKey:'ih7hcc94_yj5rk9',
            desc: 'computer list of company',
        },

      template:{
  "ih7hcc94_yj5rk9": {
    "tag": "input",
    "attrs": {
      "style": "text-align: left; width: 150px;",
      "title": "文本框",
      "value": "",
      "name": "leipiNewField",
      "orgheight": "",
      "orgwidth": "150",
      "orgalign": "left",
      "orgfontsize": "",
      "orghide": "0",
      "leipiplugins": "text",
      "orgtype": "text"
    },
    "children": []
  },
  "ih7hcc94_wng66r": {
    "tag": "select",
    "attrs": {
      "name": "leipiNewField",
      "title": "下拉菜单",
      "leipiplugins": "select",
      "size": "1",
      "orgwidth": "150",
      "style": "width: 150px;"
    },
    "children": [
      {
        "tag": "option",
        "attrs": {
          "value": "下拉"
        },
        "children": [
          "下拉"
        ]
      },
      {
        "tag": "option",
        "attrs": {
          "value": "菜单"
        },
        "children": [
          "菜单"
        ]
      }
    ]
  },
  "ih7hcc94_j62yb9": {
    "tag": "span",
    "attrs": {
      "leipiplugins": "radios",
      "title": "单选",
      "name": "leipiNewField"
    },
    "children": [
      {
        "tag": "input",
        "attrs": {
          "value": "单选1",
          "type": "radio",
          "checked": "checked"
        },
        "children": []
      },
      "单选1 ",
      {
        "tag": "input",
        "attrs": {
          "value": "单选2",
          "type": "radio"
        },
        "children": []
      },
      "单选2 "
    ]
  },
  "ih7hcc94_sor": {
    "tag": "span",
    "attrs": {
      "leipiplugins": "checkboxs",
      "title": "复选"
    },
    "children": [
      {
        "tag": "input",
        "attrs": {
          "name": "leipiNewField",
          "value": "复选1",
          "type": "checkbox",
          "checked": "checked"
        },
        "children": []
      },
      "复选1 ",
      {
        "tag": "input",
        "attrs": {
          "name": "leipiNewField",
          "value": "复选2",
          "type": "checkbox",
          "checked": "checked"
        },
        "children": []
      },
      "复选2 ",
      {
        "tag": "input",
        "attrs": {
          "name": "leipiNewField",
          "value": "复选3",
          "type": "checkbox"
        },
        "children": []
      },
      "复选3 "
    ]
  },
  "ih7hcc94_5h4cxr": {
    "tag": "input",
    "attrs": {
      "name": "leipiNewField",
      "type": "text",
      "value": "{macros}",
      "title": "宏控件",
      "leipiplugins": "macros",
      "orgtype": "sys_date_cn",
      "orghide": "0",
      "orgfontsize": "12",
      "orgwidth": "150",
      "style": "font-size: 12px; width: 150px;"
    },
    "children": []
  },
  "ih7hcc94_qzolxr": {
    "tag": "input",
    "attrs": {
      "name": "leipiNewField",
      "leipiplugins": "listctrl",
      "type": "text",
      "value": "{列表控件}",
      "readonly": "readonly",
      "title": "采购商品列表",
      "orgtitle": "商品名称`数量`单价`小计`描述`",
      "orgcoltype": "text`int`int`int`text`",
      "orgunit": "```元``",
      "orgsum": "0`0`0`1`0`",
      "orgcolvalue": "`````",
      "orgwidth": "100%",
      "style": "width: 100%;"
    },
    "children": []
  },
  "ih7hcc94_8nnrk9": {
    "tag": "textarea",
    "attrs": {
      "title": "多行文本",
      "name": "leipiNewField",
      "leipiplugins": "textarea",
      "value": "",
      "orgrich": "0",
      "orgfontsize": "12",
      "orgwidth": "600",
      "orgheight": "80",
      "style": "font-size:12px;width:600px;height:80px;"
    },
    "children": []
  },
  "ih7hcc94_7i7ldi": {
    "tag": "img",
    "attrs": {
      "name": "leipiNewField",
      "title": "进度条",
      "leipiplugins": "progressbar",
      "orgvalue": "20",
      "orgsigntype": "progress-info",
      "src": "js/ueditor/formdesign/images/progressbar.gif"
    },
    "children": []
  }
}




    }

}
