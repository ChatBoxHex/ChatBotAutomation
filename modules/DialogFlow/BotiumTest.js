/**
 * http://usejsdoc.org/
 */

module.exports = {
runDialogueFlow: function executeDialogueFlow(){
const fs = require('fs')

const BotDriver = require('botium-core').BotDriver
const Capabilities = require('botium-core').Capabilities
const Source = require('botium-core').Source

const driver = new BotDriver()
	
const compiler = driver.BuildCompiler()
compiler.ReadScriptsFromDirectory('testdata/dialogflow')
	
compiler.ExpandConvos()
compiler.convos.forEach((convo) => console.log(convo.toString()))

driver.BuildFluent()
  .Start()
  .ReadScripts('testdata/dialogflow')
  .RunScripts()
  .Exec()
  .then(() => {
	console.log('')
    console.log('SUCCESS: Had a successful Conversation')
  })
  .catch((err) => {
	console.log('')
	console.log('FAILURE')
	console.log('')
    console.log('ERROR: ', err)
  })
}
};