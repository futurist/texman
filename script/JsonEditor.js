import * as Global from './global'
import m from 'mithril'
import doT from './doT'

export default class JsonEditor {

	constructor(SCHEMA, DATA, PROPS={}, VALIDATOR=()=>{}, CALLBACK=()=>{} ) {

		var orgData = Global.clone( DATA() )
		var schemaObjects = {};
		var schemaDefaultValue = {}
		var templateFieldValue = {}
		var inheritFieldValue = {}

		var getOriginalKeyVal = function getOriginalKeyVal(objectToBeCloned, originDATA) {
		  // Basis.
		  if (!(objectToBeCloned instanceof Object)) {
		    return objectToBeCloned;
		  }
		  var objectClone = new objectToBeCloned.constructor();
		  for (var prop in objectToBeCloned) {
		    if(originDATA && (prop in originDATA)) objectClone[prop] = getOriginalKeyVal(objectToBeCloned[prop], originDATA[prop] );
		  }
		  return objectClone;
		}

		/**
		 * getter/setter Schema Object using dot path
		 * @param  {array} path  do path array
		 * @param  {any} value   value to set, if not present, it's a getter
		 * @return {any}       the value for getter/setter
		 */
		function schemaPathValue( path, value ){
			if(typeof path=='string') path = path.split('.');
			var val = _dotPathValue(schemaDefaultValue, path);
			if( arguments.length<2 ) return val;
			else return val===undefined?_dotPathValue(schemaDefaultValue, path, value):value
		}

		/**
		 * getter/setter DATA Object using dot path
		 * @param  {array} path  do path array
		 * @param  {any} value   value for setter; null for getter
		 * @return {any}       the value for getter/setter
		 */
		function dataPathValue( path, value ){
			if(typeof path=='string') path = path.split('.')
			if( arguments.length<2 ) {
				var val = _dotPathValue(DATA(), path);
				return val===undefined? (schemaPathValue(path)||'' ) : val;
			} else {
				var temp = DATA()
				var _value = value===null? schemaObjects[path.join('.')].empty||'' :value;
				var oldValue = _dotPathValue(temp, path);
				if( oldValue==_value) return;
				if( VALIDATOR(path.join('.'), _value, getOriginalKeyVal( temp, orgData ), temp, oldValue, templateFieldValue, inheritFieldValue, schemaObjects) ) return;
				_dotPathValue(temp, path, _value);
				DATA(temp)
				var callback = function(p, v){
					var _path = p||path.join('.')
					CALLBACK(_path, _value, getOriginalKeyVal( temp, orgData ), temp, oldValue, templateFieldValue, inheritFieldValue, schemaObjects );
				}
				// below line will update the key for force update view
				var shouldCallback = true;
				for(var i in templateFieldValue){
					if(i==path.join('.')) shouldCallback = false;
					var updated = templateFieldValue[i].forEach( (watchPath)=> {
						if(watchPath == path.join('.')) {
							var updateFunc = templateFieldValue[i][0]
							updateFunc()
							return true;
						}
					});
				}
				for(var i in inheritFieldValue){
					if(i!==path.join('.') || value===null) continue;
					inheritFieldValue[i].forEach( path=>{
						_dotPathValue(temp, path.split('.'), value)
						callback( path )
					} )
				}
				// only callback when it's not update the template
				shouldCallback=true;
				if(shouldCallback){
				    if(temp.attrs) temp.attrs.key = +new Date();
					callback()
				}
				return value
			}
		}

		/**
		 * dot path value helper function
		 * @param  {object} obj   the object to check for dot path
		 * @param  {array} path  dot path array
		 * @param  {any} value  value for setter; null for getter
		 * @return {any}       the value for getter/setter
		 */
		function _dotPathValue( obj, path, value ){
			if(path.length<2) {
				return obj;
			}
			var data = obj;
			for(var v, i=1; v=path[i], i<path.length; i++ ){
				if(arguments.length>=3){
					if(data===undefined){
						data = Global.clone(schemaPathValue( path.slice(0, i) ))
						if(data===undefined) data={}
						_dotPathValue(obj, path.slice(0, i), data);
					}
					if(i==path.length-1){
						if(value!==undefined) data[v] = value;
						// else delete data[v]
					}
				}
				data = data&&data[v]
			}
			return data;
		}

		var JSON_SCHEMA_MAP = (function(){
		  var obj = {}
		  obj.template = function template(path, obj, key) {
		    function replacer(match, placeholder, offset, string) {
		      var watchPath = path.slice(0,-1).join('.')+'.'+placeholder
		      if( !templateFieldValue[path.join('.')] ) templateFieldValue[path.join('.')] = [updateValue]
		      Global.addToObject( templateFieldValue[path.join('.')], watchPath );
		      return dataPathValue( watchPath );
		    }
		    var attrs = ['value', '' , 'disabled', true ];
	    	(obj[key].match(/it\.(\w+)/g)||[]).forEach(v=>{
	    		var watchPath = path.slice(0,-1).join('.')+'.'+v.replace('it.','')
				if( !templateFieldValue[path.join('.')] ) templateFieldValue[path.join('.')] = [updateValue]
				Global.addToObject( templateFieldValue[path.join('.')], watchPath );
	    	})
		    function updateValue(){
		    	var value = doT.template(obj[key])( dataPathValue( path.slice(0,-1).join('.') ) )
		    	dataPathValue(path.join('.'), value)
		    	attrs[1] = value;
		    }
		    updateValue();
		    return attrs
		  }
		  obj.minLength = function(path, obj, key){ return ['pattern', '.{'+ obj[key] +',}' ] }
		  obj.minimum = 'min'
		  obj.maximum = 'max'
		  obj.description = 'placeholder'
		  // obj.default = 'defaultValue'
		  return obj
		})()

		/**
		 * build m attrs from JSON schema property
		 * see JSON_SCHEMA_MAP format
		 * @param  {array} path     Object property in json dot path, {a:{b:{c:1}}} -> ['root', 'a','b','c'] == 1
		 * @param  {object} schema   JSON schema object, undefined value will be ''
		 * @param  {object} include  include value to overwrite specified attrs
		 * @param  {array} exclude  array that exclude in returned attrs
		 * @return {object}         m attrs object
		 */
		function buildAttrs( path, schema, include, exclude ){
		  var obj = {}, include=include||{}, exclude=exclude||[]
		  Object.keys(schema).forEach(function(v){
		    var map = JSON_SCHEMA_MAP[v];
		    if(typeof map=='function') {
		      for(var i=0, val=map(path, schema, v); i<val.length; i+=2){
		        obj[ val[i]  ] = val[i+1]||''
		      }
		    } else {
		      obj[ map || v  ] = schema[v]===undefined?'':schema[v]
		    }
		  })
		  for(var i in include) {
		    obj[i] = include[i]
		  }
		  exclude.forEach(function(v){
		  	delete obj[v]
		  })
		  if( !('value' in obj) ){
		  	if(schema.type!=='boolean') obj['value'] = dataPathValue(path);
		  	else obj['checked'] = dataPathValue(path)
		  }
		  return obj;
		}


		this.parseSchema = function parseSchema (schema, key, path) {
			var getAttrs = function getAttrs(){
				var attrs = {}
				var classObj = {}
				classObj['level'+level] = true;
				if(schema.class) classObj[schema.class]=true;
				if(schema.template) classObj.isTemplate=true;
				if(schema.format == 'color') classObj.isColor=true;
				if(orgSchema.inherit) classObj['inherit inherit-'+orgSchema.inherit] = true;
				attrs['className'] = Object.keys(classObj).filter(v=>{ return classObj[v] }).join(' ');
				attrs['data-key'] = key
				attrs['key'] = path.join('.')
				return attrs;
			}
			var addArrayItem = function addArrayItem(){
				dataPathValue( path ).push( Global.clone(schema.items.default||'') )
			}
			var swapArrayItems =function(i, itemSchema){
				return function(e){
	          		// if( !e.ctrlKey ) return
	          		var a,b, data = dataPathValue( path );
	          		if(e.keyCode==38) b=i, a=i-1;
	          		if(e.keyCode==40) b=i, a=i+1;
	          		if(a>=data.length) data.push( Global.clone(itemSchema.default) );
	          		else if(a<0) data.unshift( Global.clone(itemSchema.default) );
	          		else if(a>=0&&b>=0) data[a] = data.splice(b, 1, data[a]).shift();
	          		else return
	          		setTimeout(function(){
						if( a>=0&&a<data.length ){
							var f = $(e.target).closest('.array').find('.arrayItem').eq(a).find('.row').find('input,select,textarea').get(0)
							if(f) f.focus()
						}
					},0)
	          	}
	         }
			var _helper_notEmpty = function(v){
				if(v===null)return false;
				if(v===0)return true;
				if( typeof v =='object'){
					for(var i in v){
						if( _helper_notEmpty(v[i]) ) return true
					}
					return false
				} else {
					return !!v
				}
			}
	         var onInputBlur = function(index){
	         	return function(e){
	         		var data = dataPathValue( path );
	         		if( _helper_notEmpty( data[index] ) ) return;
         			data = data.filter( _helper_notEmpty )
	         		dataPathValue( path, data )
	         	}
	         }

		  path = path || [key]
		  var level=path.length-1
		  var initAttrs = level==0? Global._extend({ key:+new Date() }, PROPS) : {}
		  schemaObjects[path.join('.')] = schema;
		  var orgSchema  = schema;
		  var inheritPath;
		  if(schema.inherit){
		  	inheritPath = path.slice(0,-1).join('.') +'.'+ schema.inherit;
		  	if( !inheritFieldValue[inheritPath] ) inheritFieldValue[inheritPath] = []
		    Global.addToObject( inheritFieldValue[inheritPath], path.join('.') );
		  	schema = Global.clone( schemaObjects[ inheritPath ] )
		  	schema = Global._extend(schema, orgSchema)
		  }
		  switch(schema.type) {
		    case 'array':
		      schemaPathValue(path, schema.default||[]);
		      return m('div.array', Global._extend(initAttrs, getAttrs() ), [
		          m('h2.arrayTitle', {onclick:function(e){
		          	addArrayItem();
		          	setTimeout(function(){
			          	var f=$(e.target).closest('.array').find('.arrayItem').eq( dataPathValue( path ).length-1 ).find('input,select,textarea').get(0)
			          	if(f) f.focus()
		          	})
		          } }, schema.title),
		          m('div.props', [
		            schema.items.type == 'object'
		            ? ( ()=>{
		            	var keys = Object.keys(schema.items.properties)
			            return dataPathValue( path ).map( (v, i)=> {
			              return m('.arrayItem', [ keys.map( (key, index)=> {
			              	var dom = this.parseSchema( schema.items.properties[key], i+" "+key, path.concat(i, key) );
			              	dom.attrs['data-array-index'] = index;
			              	dom.attrs.onkeydown=swapArrayItems(i, schema.items)
							function interDom(dom){
								if(dom.tag=='input') dom.attrs.onblur=onInputBlur(i);
								dom.children && dom.children.forEach(interDom)
							}
							interDom(dom)
			              	return dom
			              }) ])
			            })
			        }) ()
			        : ( ()=>{
			            return dataPathValue( path ).map( (v, i)=> {
			              var dom = this.parseSchema( schema.items, i, path.concat(i) );
			              dom.attrs.onkeydown=swapArrayItems(i, schema.items);
			              function interDom(dom){
			              	if(dom.tag=='input') dom.attrs.onblur=onInputBlur(i);
			              	dom.children && dom.children.forEach(interDom)
			              }
			              interDom(dom)
			              return m('.arrayItem', [dom]);
			            })
			        }) ()
		          ])
		      ])
		      break;
		    case 'object':
		      schemaPathValue(path, schema.default||{});
		      var keys = Object.keys(schema.properties)
		      return m('div.object', Global._extend(initAttrs, getAttrs() ), [
		          m('h2.objectTitle', schema.title),
		          m('div.props', [
		            keys.map( (v)=> { return this.parseSchema( schema.properties[v], v, path.concat(v) ) })
		          ])
		      ])

		      break;

		    case 'number':
		    case 'integer':
		      schemaPathValue(path, schema.default)
		      return m('div.row', Global._extend(initAttrs, getAttrs() ), [
		          m('strong.itemTitle', schema.title||key ),
		          m('.itemValue', [
			          m('input', buildAttrs(path, schema, {type:'number', oninput:function(){
			            dataPathValue( path , schema.type=='number'? this.value : parseInt(this.value,10) )
			          	if(inheritPath) dataPathValue( inheritPath, null );
			          } }) ),
			      ])
		        ] )

		      break;

		    case 'boolean':
		      schemaPathValue(path, schema.default)
		      return m('div.row', Global._extend(initAttrs, getAttrs() ), [
		          m('strong.itemTitle', schema.title||key ),
		          m('.itemValue', [
			          m('input', buildAttrs(path, schema, {type:'checkbox', onchange:function(){
			            dataPathValue( path , this.checked )
			            if(inheritPath) dataPathValue( inheritPath, null );
			          } }) ),
		          ])
		        ] )

		      break;
		    case 'string':
		      schemaPathValue(path, schema.default)
		      return m('div.row', Global._extend(initAttrs, getAttrs() ), [
		          m('strong.itemTitle', schema.title||key ),
		          m('.itemValue', [
			          schema.enum
			          ? m('select',
				          	buildAttrs(path, schema, {
				          		oninput:function(){
				          			dataPathValue(path, this.value)
				          			if(inheritPath) dataPathValue( inheritPath, null );
						          } },
						    	['enum', 'type']
						    ),
				          	schema.enum.map( (v)=>{ return m('option', v) } )
			          	)
			          : m(schema.format=='textarea'? 'textarea': 'input',
			          		buildAttrs(path, schema, {
			          			type: schema.format || 'text',
			          			oninput:function(){
			          				dataPathValue(path, this.value)
			          				if(inheritPath) dataPathValue( inheritPath, null );
			          			} }
			          		)
			          	)
		          ])
		        ] )

		      break;
		  }

		}

		this.getVal = function(args){
			return getOriginalKeyVal( DATA(), orgData )
		}
		this.controller = function(args){
		}
		this.view = function(ctrl){
			return this.parseSchema(SCHEMA(), 'root');
		}
		this.getView = function() {
			return this.view( new this.controller() );
		}

	}

}



var editorComp = (function(){
	var obj = {}
	obj.view = function(args) {
		obj.schema = m.prop(args.schema)
		obj.json = m.prop(args.json)
		obj.prop = m.prop(args.prop)
		obj.changeCallback = m.prop(args.changeCallback)
		return new JsonEditor( obj.schema , obj.json, obj.prop, obj.changeCallback )
	},
	obj.view2 = function(ctrl, args) {
		console.log(args)
		return ctrl
	}
	return obj;
})()

export var initEditor = function initEditor (root, schema, data) {
	m.mount( root, m.component( editorComp, { schema:schema, json:data } ) )
}


