"use strict"

module.exports = {

    metadata: () => ({
        "name": "lmgify",
        "properties": {
            "query": { "type": "string", "required": true } 
        },
        "supportedActions": ["OK", "NOK"]
    }),

    invoke: (conversation, done) => {
        // Get query from the incoming message
        const text = conversation.text();
        var query = conversation.properties().query;
        conversation.logger().info('Query '+query );
        //google query
        var google = require('google')
        google.resultsPerPage = 10
        google(query, function (err, res){
          if (err) {
            conversation.logger().info('something went wrong with request!!! ', err.request.options);
            // error
            conversation.transition( 'NOK' );
            done();
          }  
          if (res){
            // check results
            // Check if element is not undefined && not null
            var linkIsNotNullNorUndefined = function (o) {
                return (typeof (o.description) !== 'undefined' && o.description !== null && o.description !== '');
            };
            var link = res.links.filter(linkIsNotNullNorUndefined)[0];
            // give reply
            conversation.logger().info('got result back : '+link.title);
            conversation.reply({ text: link.description});
            conversation.transition( 'OK' );
            done();
          }
        });
        
    }
};
