module.exports = {
	createData: function createJSON(){
		
var fs = require('fs');

fs.readFile('./modules/Watson/Reports/resultdata.json', 'utf-8', function(err, data) {
	if (err) throw err

	var arrayOfObjects = JSON.parse(data)
	arrayOfObjects.bot.push({
		ExpectedResult: "ExpectedResults",
		ActualResult:"ActualResults",
		Status: "Passed"
	})
	arrayOfObjects.bot.push({
		ExpectedResult: "ExpectedResultser",
		ActualResult:"ActualResultser",
		Status: "Passeder"
	})
	fs.writeFile('./modules/Watson/Reports/resultdata.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
		if (err) throw err
		
	})
})

}
}