var config = require('./bot-to-run.json');
 
 function botToRun(botPlatform) {
	 
	  if (botPlatform === "dialogueflow") {
		  var tools = require("./modules/DialogFlow/BotiumTest.js");
		  tools.runDialogueFlow();
	  } 
	  else if(botPlatform === "watson"){
		  var watson = require("./modules/Watson/botiumFluent.js");
		  watson.runWatsonFlow();
	  }
	  else if(botPlatform === "facebook") {
		   
	  }
	  
	}
 
 var fileToRun = botToRun(config.bottorun);
 console.log(fileToRun);