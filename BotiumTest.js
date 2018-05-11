/**
 * http://usejsdoc.org/
 */

const fs = require('fs')

const BotDriver = require('botium-core').BotDriver
const Capabilities = require('botium-core').Capabilities
const Source = require('botium-core').Source

const driver = new BotDriver()
	
const compiler = driver.BuildCompiler()
compiler.ReadScriptsFromDirectory('convos')
	
compiler.ExpandConvos()
compiler.convos.forEach((convo) => console.log(convo.toString()))

driver.BuildFluent()
  .Start()
  .ReadScripts('convos')
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