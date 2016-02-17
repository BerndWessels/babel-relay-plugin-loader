var getbabelRelayPlugin = require('babel-relay-plugin');
var config = require('../../package.json');

try {
    if (config.metadata.graphql.schema) {
        var fs = require('fs');
        var path = require('path');
        var schemaPath = path.join(__dirname, '../../', config.metadata.graphql.schema);

        var stats = fs.lstatSync(schemaPath);

        if (stats.isFile()) {
            var schema = require(schemaPath);
        }
    } else if (config.metadata.graphql.url) {
        var introspectionQuery = require('graphql/utilities').introspectionQuery;
        var request = require('sync-request');

        var res = request('POST', config.metadata.graphql.url, {
          headers: config.metadata.graphql.header,
          qs: {
              query: introspectionQuery
          }
        });

        var schema = JSON.parse(res.getBody('utf-8'));
    }
}
catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
        console.log('babel-relay-plugin-loader: ', e.message);
        console.log('babel-relay-plugin-loader: npm install graphql sync-request --save');
    } else {
        console.log(e);
    }
}

var pathOrUrl = schemaPath ? schemaPath : config.metadata.graphql.url;
if (schema) {
    console.log('babel-relay-plugin-loader: using schema at [' + pathOrUrl + ']');
    module.exports = getbabelRelayPlugin(schema.data);
} else {
    console.log('babel-relay-plugin-loader: no schema found at [' + pathOrUrl + ']');
    console.log('babel-relay-plugin-loader: babel will continue without the babel-relay-plugin!');
    module.exports = function () {
        return {
            visitor: {
            }
        }
    }
}
