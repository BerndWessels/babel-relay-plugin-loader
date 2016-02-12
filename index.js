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
        var safeRequire = require('safe-require');
        var graphqlUtils = safeRequire('graphql/utilities');
        if (!graphqlUtils) {
          console.log('babel-relay-plugin-loader: npm i graphql -S');
        }
        var request = safeRequire('sync-request');
        if (!request) {
          console.log('babel-relay-plugin-loader: npm i sync-request -S');
        }

        var res = request('POST', config.metadata.graphql.url, {
          headers: config.metadata.graphql.header,
          qs: {
            query: graphqlUtils.introspectionQuery
          }
        });

        var schema = JSON.parse(res.getBody('utf-8'));
    }
}
catch (e) {
    console.log(e);
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
