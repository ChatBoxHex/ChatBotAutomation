module.exports = {
	createData: function createJSON(expRes1,actRes1,stat1){
		
		const fs = require('fs');
		console.log(expRes1)

		let result = {  
		    ExpTC1: expRes1,
		    ActTC1: actRes1, 
		    Status1: stat1
		};

		let data = JSON.stringify(result);  
		//Need to clean the resultdata file initially at the start
		fs.writeFileSync('./modules/Watson/Reports/resultdata.json', data);  

}
}