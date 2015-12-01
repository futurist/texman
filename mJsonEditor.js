

/**
 * Helper functions
 */
if(!clone)
var clone = function clone(objectToBeCloned) {
  // Basis.
  if (!(objectToBeCloned instanceof Object)) {
    return objectToBeCloned;
  }

  var objectClone;

  // Filter out special objects.
  var Constructor = objectToBeCloned.constructor;
  switch (Constructor) {
    // Implement other special objects here.
    case RegExp:
      objectClone = new Constructor(objectToBeCloned);
      break;
    case Date:
      objectClone = new Constructor(objectToBeCloned.getTime());
      break;
    default:
      objectClone = new Constructor();
  }

  // Clone each property.
  for (var prop in objectToBeCloned) {
    objectClone[prop] = clone(objectToBeCloned[prop]);
  }

  return objectClone;
}

/**
 * Only add to object key,val when key is not exists
 * @param {object} obj   the obejct to check and add value to
 * @param {string} key   key to check and add
 * @param {any} value the value to add when key not exists
 */
if(!addToObject)
var addToObject = function addToObject( obj, key, value ){
	if( !(key in obj) ){
		obj[key] = value;
	}
}

/**
 * JsonEditor component
 * @param {object} SCHEMA the json schema according to http://json-schema.org/
 * @param {object} DATA   the json data of user data
 * @param {object} PROPS   attrs to pass to root v-dom
 */
var JsonEditor = function JsonEditor( SCHEMA, DATA, PROPS, CALLBACK ) {
	PROPS = PROPS||{}
	var schemaDefaultValue = {}
	var LEVEL_MARGIN = 10;
	// clone json object
	function clone(obj){ return JSON.parse(JSON.stringify(obj)) }
	// extend objects
	function extend( a, b, deepCopy ) {
	  for ( var prop in b ) {
	    a[ prop ] = deepCopy? clone(b[ prop ]) : b[ prop ];
	  }
	  return a;
	}
	function updateTemplates(schema){
		// TODO: add some template field watcher, 
		// and conditional determine which field change should trigger redraw
		m.redraw()
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
			if(CALLBACK) CALLBACK(path.join('.'), temp)
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
					data = clone(schemaPathValue( path.slice(0, i) ))
					_dotPathValue(obj, path.slice(0, i), data);
				}
				if(i==path.length-1){
					data[v] = value;
				}
			}
			data = data&&data[v]
		}
		return data;
	}

	var JSON_SCHEMA_MAP = (function(){
	  var obj = {}
	  obj.template = function template(path, obj, key){
	    function replacer(match, placeholder, offset, string) {
	      var watchPath = path.slice(0,-1).join('.')+'.'+placeholder
	      return dataPathValue( watchPath );
	    }
	    dataPathValue( path.join('.'), obj[key].replace(/\{\{([^}]+)\}\}/g, replacer) )
	    return ['value', dataPathValue( path.join('.') ), 'disabled', true ]
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
	 * @param  {object} props   JSON schema property object, undefined value will be ''
	 * @param  {object} include  include value to overwrite specified attrs
	 * @param  {array} exclude  array that exclude in returned attrs
	 * @return {object}         m attrs object
	 */
	function buildAttrs( path, props, include, exclude ){
	  var obj = {}, include=include||{}, exclude=exclude||[]
	  Object.keys(props).forEach(function(v){
	    var map = JSON_SCHEMA_MAP[v];
	    if(typeof map=='function') {
	      for(var i=0, val=map(path, props, v); i<val.length; i+=2){
	        obj[ val[i]  ] = val[i+1]||''
	      }
	    } else {
	      obj[ map || v  ] = props[v]===undefined?'':props[v]
	    }
	  })
	  for(var i in include) {
	    obj[i] = include[i]
	  }
	  exclude.forEach(function(v){
	  	delete obj[v]
	  })
	  if( !('value' in obj) ) obj['value'] = dataPathValue(path);
	  return obj;
	}


	function parseSchema(schema, key, path) {
	  path = path || [key]
	  level=path.length-1
	  var initAttrs = level==0? extend({ key:+new Date() }, PROPS) : {}
	  switch(schema.type) {
	    case 'array':
	      schemaPathValue(path, schema.default||[]);
	      return m('div.array', extend(initAttrs, {'data-key': key, key:path.join('.'), style:{marginLeft:level*LEVEL_MARGIN+'px'} },true), [
	          m('h2', schema.title),
	          m('div.props', [
	            schema.format == 'table' ?
	            (function(){
	            	var keys = Object.keys(schema.items.properties)
		            return dataPathValue( path ).map(function (v, i) {
		              var keys = Object.keys(schema.items.properties)
		              return keys.map(function (key) {
		              	return parseSchema( schema.items.properties[key], key, path.concat(i, key) );
		              })
		            })
		        }) () : ''
	          ])
	      ])
	      break;
	    case 'object':
	      schemaPathValue(path, schema.default||{});
	      var keys = Object.keys(schema.properties)
	      return m('div.object', extend(initAttrs, {'data-key': key, key:path.join('.'), style:{marginLeft:level*LEVEL_MARGIN+'px'} },true), [
	          m('h2', schema.title),
	          m('div.props', [
	            keys.map(function (v) { return parseSchema( schema.properties[v], v, path.concat(v) ) })
	          ])
	      ])

	      break;

	    case 'integer':
	      schemaPathValue(path, schema.default)
	      return m('div.row', extend(initAttrs, {'data-key': key, key:path.join('.'), style:{marginLeft:level*LEVEL_MARGIN+'px'} },true), [
	          m('strong', schema.title||key ),
	          m('input', buildAttrs(path, schema, {type:'number', oninput:function(){
	            dataPathValue( path , parseInt(this.value,10) )
	            updateTemplates(schema)
	          } }) ),
	        ] )

	      break;
	    case 'string':
	      schemaPathValue(path, schema.default)
	      return m('div.row', extend(initAttrs, {'data-key': key, key:path.join('.'), style:{marginLeft:level*LEVEL_MARGIN+'px'} },true), [
	          m('strong', schema.title||key ),
	          schema.enum
	          ? m('select',
		          	buildAttrs(path, schema, {
		          		oninput:function(){
		          			dataPathValue(path, this.value)
		          			updateTemplates(schema)
				          } },
				    	['enum', 'type']
				    ),
		          	schema.enum.map(function(v){ return m('option', v) } )
	          	)
	          : m(schema.format=='textarea'? 'textarea': 'input',
	          		buildAttrs(path, schema, {
	          			type: schema.format=='color'?'color':'text',
	          			oninput:function(){
	          				dataPathValue(path, this.value)
	          				updateTemplates(schema)
	          			} }
	          		)
	          	),

	        ] )

	      break;
	  }

	}

	this.controller = function(args){
	}
	this.view = function(ctrl){
		return parseSchema(SCHEMA(), 'root');
	}
	this.getView = function() {
		return this.view( new this.controller() );
	}
}

// Usage:
// m.render( document.body, new JsonEditor( testSchema, testDATA, {props...} ) )
