module.exports = {
		runReports: function executeReports(){

var Report = require('fluentreports').Report;
var config = require('./resultdata.json');

var data = [{ExpectedResult: 'EXPECTED RESULT', ActualResult: 'ACTUAL RESULT',Status: 'STATUS'},
{ExpectedResult: config.ExpTC1, ActualResult: config.ActTC1,Status: config.Status1}];

  // Create a Report  
  var rpt = new Report("Report.pdf")        
        .pageHeader( ["Hexaware ChatBot Automation Result"] )            
        .data( data )	 			 	      
		.detail( [['ExpectedResult', 200],['ActualResult', 200],['Status', 50]]) 
        .render();
  
		}
}

