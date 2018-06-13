/**
 * Excel Reader Function*/

if(typeof require !== 'undefined') XLSX = require('xlsx');
var workbook = XLSX.readFile('D:\Book2.xlsx');
var worksheet = workbook.Sheets['Dialogs'];
console.log(XLSX.utils.sheet_to_json(worksheet,true));