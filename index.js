var XLSX = require('xlsx');
var workbook = XLSX.readFile('./task3.xlsx', { cellDates: true });

let worksheet = workbook.Sheets[workbook.SheetNames[0]];

var data = XLSX.utils.sheet_to_json(worksheet);
var sheetdata = [];
var range = XLSX.utils.decode_range(worksheet['!ref']);
let index = 0;

for(let i=0; i<range.e.r; i++){

    const data2 = data[i];
    console.log({ index: i })

    if(
        data2 &&
        data2['First Name'] && data2['Last Name'] && data2['Gender'] && data2['Country'] &&
        data2['Age'] && data2['Date'] && data2['Id']
    ){
        let objdata = {
            s_no: index,
            'First Name': data2['First Name'],
            'Last Name': data2['Last Name'],
            Gender: data2['Gender'],
            Country: data2['Country'],
            Age: data2['Age'],
            Date: data2['Date'],
            Id: data2['Id']
        }

        sheetdata.push(objdata);
        index += 1;
    }
}

// console.log(sheetdata)   // length
var newwb = XLSX.utils.book_new();
var newws = XLSX.utils.json_to_sheet(sheetdata);
XLSX.utils.book_append_sheet(newwb, newws, "NEW DATA");

XLSX.writeFile(newwb, "New Data File.xlsx")