/**
 * Watson Chatbot Scripting
 */
//test
module.exports = {
		
runWatsonFlow: function executeWatsonFlow(){
var watson = require('watson-developer-cloud');
var fs=require('fs');
var data=fs.readFileSync('WatsonSetup.json', 'utf8');
var words=JSON.parse(data);
var UserName = words[0].username;
var Password = words[0].password;
var Version = words[0].version;
var url = words[0].url;
var workspace = words[0].workspace_id;
testData = userInput("./TheData.json");
var assistant = new watson.AssistantV1({
  username: UserName,
  password: Password,
  version: Version,
  url: url
});

var i =0;
var ActualBotResponse="NULL";

WatsonResponseCall(0);
function WatsonResponseCall(i)
{
  if (i<testData[0].length)
  {
      assistant.message({
        workspace_id: workspace,
        input: {
          
          'text': testData[0][i]
            }
      }, function(err, response) {
        if (err)
          console.log('error:', err);
        else   
          
          var StringResponse = JSON.stringify(response, null, 2);
          var ResponseObject = JSON.parse(StringResponse);   
          ActualBotResponse = ResponseObject.output.text;   
                  
          if (ActualBotResponse == testData[1][i])            
            console.log ("Actual Bot Response" , ActualBotResponse, "has matched with Expected Bot Response" ,  testData[1][i]);         
          else
            console.log ("Actual Bot Response" , ActualBotResponse,  "not matched with Expected Bot Response" ,  testData[1][i]); 
          WatsonResponseCall(i+1);
     

          
      });
    }
}
function userInput(jSONFile)
{
  var config = require(jSONFile);
  var userInput = []; 
  var expOpt = [];
  for(var i=0;i<config.bot.length;i++)
    {
      userInput.push(config.bot[i]["UserInput"]);
      expOpt.push(config.bot[i]["ExpOp"]);	
    }
  return [userInput,
    expOpt	
    ];
}
  }
}