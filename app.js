
var express = require('express') ;

var async  = require('express-async-await')
var createError = require('http-errors') ;
var cookieParser = require('cookie-parser') ;
var fetch = require('node-fetch')

var path = require('path') ;
var routes = require('./routes/') ;

//var routesHTML = require('./routes/html') ;

var fs = require('fs') ;

var jade = require('jade') ;




var i18next = require('i18next') ;
var i18nextMiddleware = require('i18next-http-middleware') ;
var Backend = require('i18next-node-fs-backend') ;



i18next
	.use(Backend)
	.use(i18nextMiddleware.LanguageDetector)
	.init({
		// debug:true,
		backend: {
			loadPath:
				__dirname + '/locales/{{lng}}/{{ns}}.json',
		},
		detection: {
			order: ['querystring', 'cookie'],
			caches: ['cookie']
		},
		saveMissing: true,
		fallbackLng: 
			['en'],
		preload: 
			['en', 'ru']
	}) ;

var app = express() ;

app.use(
    i18nextMiddleware.handle(i18next, {
      ignoreRoutes: ["/foo"], // or function(req, res, options, i18next) { /* return true to ignore */ }
      removeLngFromUrl: false
    })
  );

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
 app.use(express.static(path.join(__dirname, 'public'))) ;
 
 
 
 
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

/* 
app.use('/:lang/', async(req, res, next) => {
  
  console.log('YESSSS', req.params) ;
  
  
  try {
   
    // console.log('REQUIRING ON ROOT : ', req.url, 'params : ' , req.params) ;
    // res.render

  } catch (err) {
    console.log(err)
  }
  
}) ;
 */
 
 
 
 
 
 
let formatHashes = (arr, parent) => {
	
	// console.log(typeof arr) ;
	
	parent = parent || '/' ;
	
	let l = arr.length ;
	for(let i = 0 ; i < l ; i++){
		let child = arr[i] ;
		child.path = parent + child.name + '/' ;
		if(!!child.children && !!child.children.length) formatHashes(child.children, child.path) ;
	}
	
	
	return arr ;

}

app.use('/', async(req, res, next) => {
  
  
  
  
  try {
   
    // let response = await fetch('http://localhost:1337/sections/?_sort=position:ASC&level=1') ;
    // let response = await fetch(distantdatasurl) ;
    // let sections = await response ;

    let sections = formatHashes(JSON.parse(fs.readFileSync(localdatasurl,'utf8'))) ;
    
    let Data = {
      'sections':{
        name:'sections',
        data:sections
      }
    } ;
	// req.i18n.changeLanguage("ru");
	let lang = req.i18n.language ;
    // console.log('App Started... ') ;
    console.log('REQUIRING ON ROOT : ', req.url, 'params : ' , req.params) ;
    // console.log('REQUIRING ON ROOT : ', req.url, 'params : ' , req.params) ;
    res.render(path.join(__dirname, 'public/jade/index'), {lang:req.language, t:req.t, title: 'DKT - Dynamic Korea Technology', Data:Data , render: jade.render, renderFile: jade.renderFile/* , AppendNominatedVarsObject: AppendNominatedVarsObject */}) ;

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