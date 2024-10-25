const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');


app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

let todaysDate = new Date();
let todaysFilename = todaysDate.getDate()+'-'+(todaysDate.getMonth() + 1)+'-'+todaysDate.getFullYear()+'.txt';

app.get('/',function(req, res){
    fs.readdir('Hisab-Folder', function(err, files){
    if(err) console.log(err.message);
    else{
        res.render('homeScreen', {files});
    }
  })
})

app.route('/createHisab')
 .get(function(req, res){
    fs.readdir('./Hisab-Folder', function(err,files){
       if(err) console.log(err.message);
       else{
          const index = files.indexOf(todaysFilename);
          if(index !== -1)
          {
            //file pehle se hi exist krti hai aaj ki 
            res.redirect(`/editHisab/${todaysFilename}`);
          }
          else{
            res.render('createHisab');
          }
       }
    })
 })
 .post(function(req, res){
    //file banani hai Hisab-Folder ke andr
    let todaysHisab = req.body.hisab;

    const today = new Date();
    let fileName = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();  

    fs.writeFile(`./Hisab-Folder/${fileName}.txt`, todaysHisab, function(err){
        if(err) console.log(err.message);
        else console.log("file created successfully");
    })
    res.redirect('/');
});


app.get('/seeHisab/:fileName', function(req, res){
    let fileName = req.params.fileName;
    fs.readFile(`./Hisab-Folder/${fileName}`, 'utf-8' ,function(err, data){
        if(err) console.log(err.message);

        else{
            res.render('seeHisab', {fileName, data});
        }
    })
})

app.route('/editHisab/:fileName')
.get(function(req, res){
    fs.readFile(`./Hisab-Folder/${req.params.fileName}`, 'utf-8' ,function(err, data){
        if(err) console.log(err.message);
        else{
            res.render('editHisab',{fileName : req.params.fileName, data});
        }
    })
})
.post(function(req, res){
    let editedHisab = req.body.editedHisab;
    fs.writeFile(`./Hisab-Folder/${req.params.fileName}`, editedHisab, function(err){
        if(err) console.log(err.message);
        else{
            console.log("File edited successfully");
            res.redirect('/');
        }
    })
})

app.post('/delete/:fileName',function(req, res){
    fs.unlink(`Hisab-Folder/${req.params.fileName}`, function(err){
        if(err) console.log(err.message);
        else{
            res.redirect('/');
        }
    })
})

app.listen(3000, function(){
    console.log('Server is running smoothly!! I hope so.');
})