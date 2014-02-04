var es = require('event-stream');
var path = require('path');
var Buffer = require('buffer').Buffer;
var StripMQ = require('./stripmq');

module.exports = function(opt) {
  function stripMqFile(file) {
    if(file.isNull()) return this.emit('data', file); // pass along
    if(file.isStream()) return this.emit('error', new Error("gulp-stripmq: Streaming not supported"));

    var str = file.contents.toString('utf8');
    var data;

    try {
      data = StripMQ(str, opt || {});
    } catch(err) {
      return this.emit('error', new Error(err));
    }

    file.contents = new Buffer(data);
    this.emit('data', file);
  }

  return es.through(stripMqFile);
};