
var express = require('express') ;

var path = require('path') ;
var cookieParser = require('cookie-parser') ;
var routes = require('./routes/') ;
var routesHTML = require('./routes/html') ;
var createError = require('http-errors') ;
var fs = require('fs') ;
var jade = require('jade') ;

var async  = require('express-async-await')
var fetch = require('node-fetch')

var app = express() ;


// view engine setup to jade
app.set('views', path.join(__dirname, 'public', 'jade')) ;
app.set('view engine', 'jade') ;

// basic setup
app.use(express.json()) ;
app.use(express.urlencoded({ extended: false })) ;
app.use(cookieParser()) ;

// routes

// STATIC VERSION (html)
/* app.use('/html/', express.static(path.join(__dirname, 'public'))) ;
app.use('/html/', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'public', 'default.html')) ;
}) ;
 */

// const distantdatasurl = 'http://localhost:1337/sections/?_sort=position:ASC&level=1' ;



// app.use('/json/', async(req, res, next) => {
  //   let response = await fetch(distantdatasurl) ;
  //   let sections = await response.json() ;
  
  //   res.send(sections) ;
  // }) ;
  
  
  
  /*
  app.use('/data/:dataname', async (req, res, next) => {
    let dataname = req.params['dataname'] ;
    try {
      let response = await fetch(datasurl + dataname) ;
      let data = await response.json() ;
      //datas[dataname] = data ;
      res.json(data) ;
      
    } catch (err) {
      console.log(err)
    }
  }) ;
  */
 
 // DYNAMIC VERSION (Node Express Jade)
 app.use('/', express.static(path.join(__dirname, 'public'))) ;
 
 const localdatasurl = './json/fixtures/fixtures.json' ;



/* 

const AppendNominatedVarsObject = (article, obj, variablename) => {
  
  if(!(obj instanceof Array)) return {} ; 
  
  let o = article ;
  delete o[variablename] ;
  obj.forEach((el, i,) => {
    o[el.name] = el.content ;
  }) ;
  
  return o ;
} */

app.use('/', async(req, res, next) => {
  
  try {
   
    // let response = await fetch('http://localhost:1337/sections/?_sort=position:ASC&level=1') ;
    // let response = await fetch(distantdatasurl) ;
    // let sections = await response ;

    let sections = fs.readFileSync(localdatasurl,'utf8') ;
    
    let Data = {
      'sections':{
        name:'sections',
        data:sections
      }
    } ;
    // console.log('App Started... ') ;
    console.log('REQUIRING ON ROOT : ', req.url, 'params : ' , req.params) ;
    // console.log('REQUIRING ON ROOT : ', req.url, 'params : ' , req.params) ;
    res.render(path.join(__dirname, 'public/jade/index'), { title: 'DKT - Dynamic Korea Technology', Data:Data , render: jade.render, renderFile: jade.renderFile/* , AppendNominatedVarsObject: AppendNominatedVarsObject */}) ;

  } catch (err) {
    console.log(err)
  }
  
}) ;






/* 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404)) ;
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message ;
  res.locals.error = req.app.get('env') === 'development' ? err : {} ;

  // render the error page
  res.status(err.status || 500) ;
  res.render('error') ;
})
 */

module.exports = app ;