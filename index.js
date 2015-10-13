var path = require('path');
var getbabelRelayPlugin = require('babel-relay-plugin');
var config = require('../../package.json');

var schemaPath = path.join('../../', config.metadata.graphql.schema);
var schema = require(schemaPath);

module.exports = getbabelRelayPlugin(schema.data);
