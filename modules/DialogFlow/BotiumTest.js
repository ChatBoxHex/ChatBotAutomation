module.exports = {
		
runDialogueFlow: function executeDialogueFlow(){
	var configuration = require('./configuration/config.json');
	const request = require('request')

		  var options = {
		    uri: configuration.uri,
		    method: configuration.method,

		    json: {
		    		type: configuration.type,
		    		timestamp: new Date().toISOString(),
		    		contexts:configuration.contexts,
		    		lang:configuration.lang,
		    		query:configuration.query,
		    		sessionId:configuration.sessionId
		    },
		    headers: {
		      'Authorization': configuration.Authorization
		    }
		  
		  }
		  
	for(var i=0;i<2;i++)
		{
		
		request(options, function (err, response, body) {
		    if (err) {
		      console.log('Error: ' + err)
		    } else {
		      console.log('OK')
		    }
		    if (body) {
		    	StringResponse = JSON.stringify(body, null, 2);
		    	var ResponseObject = JSON.parse(StringResponse);
		      
		    	assert("Hi, I can help with Testing of ChatBot",ResponseObject.result.fulfillment.speech)
		    }
		  })
		  
		}
	
	function assert (expected, actual) {
		 if (!actual || actual.indexOf(expected) < 0) {
			    console.log(`ERROR: Expected <${expected}>, got <${actual}>`)
			  } else {
			    console.log(`SUCCESS: Got Expected <${expected}>`)
			  }
	}
		  

}
};