const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path')

var XLSX = require('xlsx');


//excel upload
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads')
    }, 
    filename: function(req, file, cb){
        cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
    }
})

var upload = multer({
    storage
}).single('file');

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.post('/', upload, (req, res) => {
    
    var file = req.file.filename;

    var workbook = XLSX.readFile(path.join(__dirname, 'uploads\\' + file), { cellDates: true });
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

    var newwb = XLSX.utils.book_new();
    var newws = XLSX.utils.json_to_sheet(sheetdata);
    XLSX.utils.book_append_sheet(newwb, newws, "NEW DATA");
    XLSX.writeFile(newwb, path.join(__dirname, 'uploads\\' + "New-Data-File.xlsx"))
    res.download(path.join(__dirname, 'uploads\\' + "New-Data-File.xlsx"))

})

app.get('/data', (req, res) => {
    var workbook = XLSX.readFile(path.join(__dirname, 'uploads\\' + 'New-Data-File.xlsx'), { cellDates: true });
    let worksheet = workbook.Sheets[workbook.SheetNames[0]];
    var data = XLSX.utils.sheet_to_json(worksheet);
    var range = XLSX.utils.decode_range(worksheet['!ref']);
    let men = 0;
    let women = 0;
    for(let i=0; i<range.e.r; i++){

        const data2 = data[i];
    
        if( data2 && data2['Gender'] ){
            if(data2['Gender'] === 'Male')
                men += 1;
            else
                women += 1;
        }
    }

    return res.status(200).json({ data: { men, women } })
})


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.render('index', { title: 'HOME PAGE' })
})

const port = process.env.PORT || 4242;

app.listen(port, () => {
    console.log('Server is running on port 4242')
})