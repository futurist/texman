import * as Global from './global'

export default exports = {}

exports.populateRef = function(formName, options={}) {
	var query = '&filter[meta_ver]=>=0&include=meta_form&fields[formtype]=template'
	return Global.mRequestApi('GET', Global.APIHOST+'/form_'+formName+'?' + query)
}

