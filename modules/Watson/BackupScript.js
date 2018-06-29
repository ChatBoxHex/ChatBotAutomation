
var watson = require('watson-developer-cloud');

var conversation = new watson.ConversationV1({
  username: 'a244949e-900f-429e-8080-31509893b8dd',
  password: 'l2HjaQd83Cu4',
  version: '2018-02-16'
});

var params = {
  workspace_id: '92ad9716-7410-40cb-a2f5-ab128d40cb97',
  text: 'Good afternoon',
  intent: 'hello'
};

conversation.getExample(params, function(err, response) {
  if (err) {
    console.log(err);
  } else {
    console.log(JSON.stringify(response, null, 2));
  }
});