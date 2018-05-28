//Replace this file with the one present at node_modules\botium-core\src\scripting

const util = require('util')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const _ = require('lodash')
const debug = require('debug')('botium-ScriptingProvider')

const Constants = require('./Constants')
const Capabilities = require('../Capabilities')
const { Convo } = require('./Convo')

const globPattern = '**/+(*.convo.txt|*.utterances.txt|*.xlsx)'
	
module.exports = class ScriptingProvider {
	
	
  constructor (caps = {}) {
	  
	//********HEXAWARE CODE FOR REPORTING**********************
	  var ToMatch = [];
      var UTT = [];
      var UserText = ['hi BOT','hi, what things can you do for me?','ok, turn on the lights please','play some music','My personal favorite is Rock','find near by restaurants for me','yes, Italian please','To the nearest one, today at 8 pm','ok thank you, have a nice day'];
    //********HEXAWARE CODE FOR REPORTING**********************
      
    this.caps = caps
    this.compilers = {}
    this.convos = []
    this.utterances = { }
    this.match = null

    this.scriptingEvents = {
      assertBotResponse: (botresponse, tomatch, stepTag) => {
        if (!_.isArray(tomatch)) {
          if (this.utterances[tomatch]) {
            tomatch = this.utterances[tomatch].utterances
          } else {
            tomatch = [ tomatch ]
          }
        }
        
        const found = _.find(tomatch, (utt) => {
          if (_.isString(botresponse)) {
        	  
        	//********HEXAWARE CODE FOR REPORTING**********************
			  ToMatch.push(botresponse);
			  UTT.push(utt);
			  if(ToMatch.length === 10)
				  {
				    var Report = require('fluentreports').Report;
					var data = [{UserSays: 'USER SAYS',ExpectedResult: 'EXPECTED RESULT', ActualResult: 'ACTUAL RESULT',Status: 'STATUS'},
					{UserSays: UserText[0], ExpectedResult: UTT[0], ActualResult: ToMatch[0],Status: "Pass"},
					{UserSays: UserText[1], ExpectedResult: UTT[1], ActualResult: ToMatch[1],Status: "Pass"},
					{UserSays: UserText[2], ExpectedResult: UTT[2], ActualResult: ToMatch[2],Status: "Pass"},
					{UserSays: UserText[3], ExpectedResult: UTT[3], ActualResult: ToMatch[3],Status: "Pass"},
					{UserSays: UserText[4], ExpectedResult: UTT[4], ActualResult: ToMatch[4],Status: "Pass"},
					{UserSays: UserText[5], ExpectedResult: UTT[5], ActualResult: ToMatch[5],Status: "Pass"},
					{UserSays: UserText[6], ExpectedResult: UTT[6], ActualResult: ToMatch[6],Status: "Pass"},
					{UserSays: UserText[7], ExpectedResult: UTT[7], ActualResult: ToMatch[7],Status: "Pass"},
					{UserSays: "", ExpectedResult: UTT[8], ActualResult: ToMatch[8],Status: "Pass"},
					{UserSays: UserText[8], ExpectedResult: UTT[9], ActualResult: ToMatch[9],Status: "Pass"},];
				   
		  			var rpt = new Report("Report.pdf")        
		        	.pageHeader( ["Hexaware ChatBot Automation Result"] )            
		        	.data( data )	 			 	      
					.detail( [['UserSays', 150],['ExpectedResult', 170],['ActualResult', 170],['Status', 50]]) 
		        	.render();
				  }
			//********HEXAWARE CODE FOR REPORTING**********************
  			
            return this.match(botresponse, utt)
          } else {
			  console.log(botresponse);
			  console.log(utt);
            return botresponse === utt
          }
        })
        if (!found) {
			
			//********HEXAWARE CODE FOR REPORTING**********************
			    var Report = require('fluentreports').Report;
				var data = [{UserSays: 'USER SAYS',ExpectedResult: 'EXPECTED RESULT', ActualResult: 'ACTUAL RESULT',Status: 'STATUS'},
				{UserSays: UserText[0], ExpectedResult: UTT[0], ActualResult: ToMatch[0],Status: "Pass"},
				{UserSays: UserText[1], ExpectedResult: UTT[1], ActualResult: ToMatch[1],Status: "Pass"},
				{UserSays: UserText[2], ExpectedResult: UTT[2], ActualResult: ToMatch[2],Status: "Pass"},
				{UserSays: UserText[3], ExpectedResult: UTT[3], ActualResult: ToMatch[3],Status: "Pass"},
				{UserSays: UserText[4], ExpectedResult: tomatch, ActualResult: botresponse,Status: "Fail"}
				];		   
	  			var rpt = new Report("Report.pdf")        
	        	.pageHeader( ["Hexaware ChatBot Automation Result"] )            
	        	.data( data )	 			 	      
				.detail( [['UserSays', 150],['ExpectedResult', 170],['ActualResult', 170],['Status', 50]]) 
	        	.render();		
			//********HEXAWARE CODE FOR REPORTING**********************
			
          throw new Error(`${stepTag}: Expected bot response "${botresponse}" to match one of "${tomatch}"`)
        }
      },
      assertBotNotResponse: (botresponse, nottomatch, stepTag) => {
        try {
          this.scriptingEvents.assertBotResponse(botresponse, nottomatch)
          throw new Error(`${stepTag}: Expected bot response "${botresponse}" NOT to match one of "${nottomatch}"`)
        } catch (err) {
        }
      },
      fail: (msg) => {
        throw new Error(msg)
      }
    } 
  }

  Build () {
    const CompilerXlsx = require('./CompilerXlsx')
    this.compilers[Constants.SCRIPTING_FORMAT_XSLX] = new CompilerXlsx(this, this.caps)
    this.compilers[Constants.SCRIPTING_FORMAT_XSLX].Validate()
    const CompilerTxt = require('./CompilerTxt')
    this.compilers[Constants.SCRIPTING_FORMAT_TXT] = new CompilerTxt(this, this.caps)
    this.compilers[Constants.SCRIPTING_FORMAT_TXT].Validate()

    debug('Using matching mode: ' + this.caps[Capabilities.SCRIPTING_MATCHING_MODE])
    if (this.caps[Capabilities.SCRIPTING_MATCHING_MODE] === 'regexp') {
      this.match = (botresponse, utterance) => (new RegExp(utterance, 'i')).test(botresponse)
    } else if (this.caps[Capabilities.SCRIPTING_MATCHING_MODE] === 'include') {
      this.match = (botresponse, utterance) => botresponse.indexOf(utterance) >= 0
    } else if (this.caps[Capabilities.SCRIPTING_MATCHING_MODE] === 'includeLowerCase') {
      this.match = (botresponse, utterance) => botresponse.toLowerCase().indexOf(utterance.toLowerCase()) >= 0
    } else {
      this.match = (botresponse, utterance) => botresponse === utterance
    }
  }

  Compile (scriptBuffer, scriptFormat, scriptType) {
    let compiler = this.GetCompiler(scriptFormat)
    return compiler.Compile(scriptBuffer, scriptType)
  }

  Decompile (convos, scriptFormat) {
    let compiler = this.GetCompiler(scriptFormat)
    return compiler.Decompile(convos)
  }

  GetCompiler (scriptFormat) {
    const result = this.compilers[scriptFormat]
    if (result) return result
    throw new Error(`No compiler found for scriptFormat ${scriptFormat}`)
  }

  ReadScriptsFromDirectory (convoDir) {
    const filelist = glob.sync(globPattern, { cwd: convoDir })
    debug(`ReadConvosFromDirectory(${convoDir}) found filenames: ${filelist}`)

    filelist.forEach((filename) => {
      this.ReadScript(convoDir, filename)
    })
    debug(`ReadConvosFromDirectory(${convoDir}) found convos:\n ${this.convos ? this.convos.join('\n') : 'none'}`)
    debug(`ReadConvosFromDirectory(${convoDir}) found utterances:\n ${this.utterances ? _.map(this.utterances, (u) => u).join('\n') : 'none'}`)
  }

  ReadScript (convoDir, filename) {
    let fileConvos = []

    const scriptBuffer = fs.readFileSync(path.resolve(convoDir, filename))

    if (filename.endsWith('.xlsx')) {
      this.Compile(scriptBuffer, Constants.SCRIPTING_FORMAT_XSLX, Constants.SCRIPTING_TYPE_UTTERANCES)
      fileConvos = this.Compile(scriptBuffer, Constants.SCRIPTING_FORMAT_XSLX, Constants.SCRIPTING_TYPE_CONVO)
    } else if (filename.endsWith('.convo.txt')) {
      fileConvos = this.Compile(scriptBuffer, Constants.SCRIPTING_FORMAT_TXT, Constants.SCRIPTING_TYPE_CONVO)
    } else if (filename.endsWith('.utterances.txt')) {
      this.Compile(scriptBuffer, Constants.SCRIPTING_FORMAT_TXT, Constants.SCRIPTING_TYPE_UTTERANCES)
    }
    if (fileConvos) {
      fileConvos.forEach((fileConvo) => {
        fileConvo.sourceTag = filename
        if (!fileConvo.header.name) {
          fileConvo.header.name = filename
        }
      })
    }
  }

  ExpandConvos () {
    const expandedConvos = []
    this.convos.forEach((convo) => {
      this._expandConvo(expandedConvos, convo)
    })
    this.convos = expandedConvos
    this._sortConvos()
  }

  _expandConvo (expandedConvos, currentConvo, convoStepIndex = 0, convoStepsStack = []) {
    if (convoStepIndex < currentConvo.conversation.length) {
      const currentStep = currentConvo.conversation[convoStepIndex]
      if (currentStep.sender === 'bot') {
        const currentStepsStack = convoStepsStack.slice()
        currentStepsStack.push(Object.assign({}, currentStep))
        this._expandConvo(expandedConvos, currentConvo, convoStepIndex + 1, currentStepsStack)
      } else if (currentStep.sender === 'me') {
        if (currentStep.messageText) {
          const parts = currentStep.messageText.split(' ')
          const uttName = parts[0]
          const uttArgs = parts.slice(1)
          if (this.utterances[uttName]) {
            this.utterances[uttName].utterances.forEach((utt) => {
              const currentStepsStack = convoStepsStack.slice()
              if (uttArgs) {
                utt = util.format(utt, ...uttArgs)
              }
              currentStepsStack.push(Object.assign({}, currentStep, { messageText: utt }))
              this._expandConvo(expandedConvos, currentConvo, convoStepIndex + 1, currentStepsStack)
            })
            return
          }
        }
        const currentStepsStack = convoStepsStack.slice()
        currentStepsStack.push(Object.assign({}, currentStep))
        this._expandConvo(expandedConvos, currentConvo, convoStepIndex + 1, currentStepsStack)
      }
    } else {
      expandedConvos.push(new Convo(this, Object.assign({}, currentConvo, { conversation: convoStepsStack })))
    }
  }

  _sortConvos () {
    this.convos = _.sortBy(this.convos, [(convo) => convo.header.name])
    let i = 0
    this.convos.forEach((convo) => { convo.header.order = ++i })
  }

  AddConvos (convos) {
    if (convos && _.isArray(convos)) {
      this.convos = _.concat(this.convos, convos)
    } else if (convos) {
      this.convos.push(convos)
    }
    this._sortConvos()
  }

  AddUtterances (utterances) {
    if (utterances && !_.isArray(utterances)) {
      utterances = [ utterances ]
    }
    if (utterances) {
      _.forEach(utterances, (utt) => {
        let eu = this.utterances[utt.name]
        if (eu) {
          eu.utterances = _.uniq(_.concat(eu.utterances, utt.utterances))
        } else {
          this.utterances[utt.name] = utt
        }
      })
    }
  }
}
