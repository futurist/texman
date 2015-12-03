import JsonEditor from './JsonEditor'

var testSchema = m.prop( sampleSchema )
var testDATA = m.prop( sampleData )

export default class Editor{

constructor(){
  function inputChange(obj){
    return function() {
      this.className=''
      try{var data = JSON.parse(this.value)}catch(e){ return this.className='error' }
      if(data) obj(data), m.redraw();
    }
  }
  // render schema text area
  m.mount(document.querySelector('.schema'), {view:function () {
    return [m('h4', "SCHEMA"), m('textarea',  {key:'text-schema', oninput:inputChange(testSchema) },
              m.trust( JSON.stringify(testSchema(), null, 2) )
          )]
  }})
  // render data text area
  m.mount(document.querySelector('.data'), {view:function () {
    return [m('h4', "DATA"), m('textarea',  {key:'text-data', oninput:inputChange(testDATA) },
              m.trust( JSON.stringify(testDATA(), null, 2) )
          )]
  }})

  // render json editor window
  m.mount( document.querySelector('.editor'), new JsonEditor( testSchema , testDATA, null, renderView ) )

  // update preview area when editor value changed
  function renderView(pathStr, data, templateObj, orgData) {
    // template will be delay updated, so don't display path
    if( !templateObj[pathStr] ) document.querySelector('.debug').innerHTML = pathStr;
    if(data.attrs) data.attrs.key = +new Date();
    // console.log( orgData )
  }

  m.mount( document.querySelector('.preview'), {view: function(){ return testDATA() } } )

}
}