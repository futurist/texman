import * as Global from './global'
import m from 'mithril'

export default class JsonEditor {

	constructor(SCHEMA, DATA, PROPS={}, CALLBACK=()=>{} ) {

		var orgData = Global.clone( DATA() )
		var schemaDefaultValue = {}
		var templateFieldValue = {}
		var LEVEL_MARGIN = 10;

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
				_dotPathValue(temp, path, value)
				DATA(temp)
				// below line will update the key for force update view
				var shouldCallback = true;
				for(var i in templateFieldValue){
					if(i==path.join('.')) shouldCallback = false;
					var updated = templateFieldValue[i].some( (watchPath)=> {
						if(watchPath == path.join('.')) {
							var updateFunc = templateFieldValue[i][0]
							updateFunc()
							return true;
						}
					});
				}
				// only callback when it's not update the template
				if(shouldCallback){
				    if(temp.attrs) temp.attrs.key = +new Date();
					if(CALLBACK) CALLBACK(path.join('.'), temp, templateFieldValue, getOriginalKeyVal( temp, orgData ) );
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
		    var attrs = ['value', '' , 'disabled', true ]
		    function updateValue(){
		    	dataPathValue( path.join('.'), obj[key].replace(/\{\{([^}]+)\}\}/g, replacer) )
		    	attrs[1] = dataPathValue( path.join('.') )
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

		function getClassName(schema){
			var className = ''
			if(schema.template) className+='isTemplate';
			if(schema.format == 'color') className+=' isColor';
			return className;
		}

		this.parseSchema = function parseSchema (schema, key, path) {
		  path = path || [key]
		  var level=path.length-1
		  var initAttrs = level==0? Global._extend({ key:+new Date() }, PROPS) : {}
		  switch(schema.type) {
		    case 'array':
		      schemaPathValue(path, schema.default||[]);
		      return m('div.array', Global._deepCopy(initAttrs, {'data-key': key, key:path.join('.'), className:'level'+level }), [
		          m('h2', schema.title),
		          m('div.props', [
		            schema.format == 'table' ?
		            ( ()=>{
		            	var keys = Object.keys(schema.items.properties)
			            return dataPathValue( path ).map( (v, i)=> {
			              var keys = Object.keys(schema.items.properties)
			              return keys.map( (key)=> {
			              	return this.parseSchema( schema.items.properties[key], key, path.concat(i, key) );
			              })
			            })
			        }) () : ''
		          ])
		      ])
		      break;
		    case 'object':
		      schemaPathValue(path, schema.default||{});
		      var keys = Object.keys(schema.properties)
		      return m('div.object', Global._deepCopy(initAttrs, {'data-key': key, key:path.join('.'), className:'level'+level }), [
		          m('h2', schema.title),
		          m('div.props', [
		            keys.map( (v)=> { return this.parseSchema( schema.properties[v], v, path.concat(v) ) })
		          ])
		      ])

		      break;

		    case 'number':
		    case 'integer':
		      schemaPathValue(path, schema.default)
		      return m('div.row', Global._deepCopy(initAttrs, {'data-key': key, key:path.join('.'), className:'level'+level }), [
		          m('strong', schema.title||key ),
		          m('input', buildAttrs(path, schema, {type:'number', oninput:function(){
		            dataPathValue( path , schema.type=='number'? this.value : parseInt(this.value,10) )
		          } }) ),
		        ] )

		      break;

		    case 'boolean':
		      schemaPathValue(path, schema.default)
		      return m('div.row', Global._deepCopy(initAttrs, {'data-key': key, key:path.join('.'), className:'level'+level }), [
		          m('strong', schema.title||key ),
		          m('input', buildAttrs(path, schema, {type:'checkbox', onchange:function(){
		            dataPathValue( path , this.checked )
		          } }) ),
		        ] )

		      break;
		    case 'string':
		      schemaPathValue(path, schema.default)
		      return m('div.row', Global._deepCopy(initAttrs, {'data-key': key, className:getClassName(schema)+' level'+level, key:path.join('.') }), [
		          m('strong', schema.title||key ),
		          schema.enum
		          ? m('select',
			          	buildAttrs(path, schema, {
			          		oninput:function(){
			          			dataPathValue(path, this.value)
					          } },
					    	['enum', 'type']
					    ),
			          	schema.enum.map( (v)=>{ return m('option', v) } )
		          	)
		          : m(schema.format=='textarea'? 'textarea': 'input',
		          		buildAttrs(path, schema, {
		          			type: schema.format=='color'?'color':'text',
		          			oninput:function(){
		          				dataPathValue(path, this.value)
		          			} }
		          		)
		          	),

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