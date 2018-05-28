module.exports = {
runWatsonFlow: function executeWatsonFlow(){
	
	const fs = require('fs')

	const BotDriver = require('botium-core').BotDriver
	const Capabilities = require('botium-core').Capabilities
	const Source = require('botium-core').Source

	const driver = new BotDriver()
	  .setCapability(Capabilities.PROJECTNAME, 'IBM Watson Conversation Sample')
	  .setCapability(Capabilities.CONTAINERMODE, 'watsonconversation')
	  .setCapability(Capabilities.WATSONCONVERSATION_USER, '0274cb6f-3680-4cf7-bd6b-71c7f447542d')
	  .setCapability(Capabilities.WATSONCONVERSATION_PASSWORD, 'ZWDE5xo02sby')
	  .setCapability(Capabilities.WATSONCONVERSATION_WORKSPACE_ID, '97513bc0-c581-4bec-ac9f-ea6a8ec308a9')
	  .setCapability(Capabilities.WATSONCONVERSATION_COPY_WORKSPACE, false)
		
	const compiler = driver.BuildCompiler()
	compiler.ReadScriptsFromDirectory('testdata/watson')
		
	compiler.ExpandConvos()
	compiler.convos.forEach((convo) => console.log(convo.toString()))

	driver.BuildFluent()
	  .Start()
	  .ReadScripts('testdata/watson')
	  .RunScripts()
	  .Exec()
	  .then(() => {
		console.log('')
	    console.log('SUCCESS: Had a successful Conversation')
	  })
	  .catch((err) => {
		console.log('FAILURE')
	    console.log('ERROR: ', err)
	  })
}
}
