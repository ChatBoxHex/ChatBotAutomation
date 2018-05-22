module.exports = {
		runReports: function executeReports(){

var Report = require('fluentreports').Report;
var config = require('./resultdata.json');

var data = [{ExpectedResult: 'EXPECTED RESULT', ActualResult: 'ACTUAL RESULT',Status: 'STATUS'},
{ExpectedResult: config.bot[0]["ExpectedResult"], ActualResult: config.bot[0]["ActualResult"],Status: config.bot[0]["Status"]},
{ExpectedResult: 'Expected Result', ActualResult: 'Actual Result',Status: 'Pass'},
{ExpectedResult: 'Expected Result', ActualResult: 'Actual Result',Status: 'Pass'},
{ExpectedResult: 'Expected Result', ActualResult: 'Actual Result',Status: 'Pass'},
{ExpectedResult: 'Expected Result', ActualResult: 'Actual Result',Status: 'Pass'},
{ExpectedResult: 'Expected Result', ActualResult: 'Actual Result',Status: 'Pass'},
{ExpectedResult: 'Expected Result', ActualResult: 'Actual Result',Status: 'Pass'},
{ExpectedResult: 'Expected Result', ActualResult: 'Actual Result',Status: 'Pass'},
{ExpectedResult: 'Expected Result', ActualResult: 'Actual Result',Status: 'Pass'}];
  
  // Create a Report  
  var rpt = new Report("Report.pdf")        
        .pageHeader( ["Hexaware ChatBot Automation Result"] )      // Add a simple (optional) page Header...        
        .data( data )	 			 	      // Add some Data (This is required)
		.detail( [['ExpectedResult', 200],['ActualResult', 200],['Status', 50]]) // Layout the report in a Grid of 200px & 50px
        .render();
  
		}
}

