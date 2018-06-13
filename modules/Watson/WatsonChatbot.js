/**
 * Watson Chatbot Scripting
 */
//test
var watson = require('watson-developer-cloud');
var fs=require('fs');
var data=fs.readFileSync('WatsonSetup.json', 'utf8');
var words=JSON.parse(data);
var UserName = words[0].username;
var Password = words[0].password;
var Version = words[0].version;
var url = words[0].url;
var workspace = words[0].workspace_id;
testData = userInput('./testdata/watson/TheData.json');
console.log(testData[0][j]);
console.log(testData[1][j]);
var assistant = new watson.AssistantV1({
  username: UserName,
  password: Password,
  version: Version,
  url: url
});
var User = ["Hi","goodbye"];
ExpectedResultArray=[];
ExpectedResultArray = ["Good day to you","OK, See you later!"];
//var j =ExpectedResultArray.length-1;
var j = 0;
var UserLoop;
var ActualBotResponse="NULL";
for (i = 0;i<User.length;i++)
{
var ExResponse = ExpectedResultArray[i];
//console.log(User[i]);
assistant.message({
  workspace_id: workspace,
  input: {
	  
	  'text': User[i]
		  }
}, function(err, response,ExResponse) {
  if (err)
    console.log('error:', err);
  else   
    //j =0;
    StringResponse = JSON.stringify(response, null, 2);
    var ResponseObject = JSON.parse(StringResponse);   
    ActualBotResponse = ResponseObject.output.text;   
    assert(ResponseObject.output.text,j);
    j=j+1;
    
});
function assert(BotResponse,j)
{
  var BotResponse;  
  if (BotResponse == ExpectedResultArray[j])
    	console.log ("Actual Bot Response" , BotResponse, "has matched with Expected Bot Response" ,  ExpectedResultArray[j]);
  else
    	console.log("Actual Bot Response" , BotResponse,  "not matched with Expected Bot Response" ,  ExpectedResultArray[j]);
}
}
function userInput(jSONFile){
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