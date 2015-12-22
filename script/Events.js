
import EventEmitter from 'event-keeper'
var singleton;
if(!singleton) singleton = new EventEmitter
export default singleton;
