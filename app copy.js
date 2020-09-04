
var express = require('express') ;

var async  = require('express-async-await')
var createError = require('http-errors') ;
var cookieParser = require('cookie-parser') ;
var fetch = require('node-fetch')

var path = require('path') ;
var routes = require('./routes/') ;
var graphqls = require('./graphql/') ;
//var routesHTML = require('./routes/html') ;

var fs = require('fs') ;

var jade = require('jade') ;

var { buildSchema } = require('graphql') ;
var graphqlHTTP = require('express-graphql').graphqlHTTP;

var i18next = require('i18next') ;
var i18nextMiddleware = require('i18next-http-middleware') ;
var Backend = require('i18next-node-fs-backend') ;
var debug = require('debug') ;
var axios = require('axios') ;


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
			['en', 'ko']
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
 
// Construct a schema, using GraphQL schema language

// console.log(graphqls) ;
/* 
var schema = buildSchema(graphqls.schema_test) ;

// The root provides a resolver function for each API endpoint
var root = {
  rollDice: ({numDice, numSides}) => {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  },
  emancipate: ({numDice, numSides}) => {
    return [2];
    // return "I'm Free";
  }

};

 
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
  // graphiql: process.env.NODE_ENV === 'development',
}));
 
 */
 
let CONSTANTS = require('./constants') ;
console.log(CONSTANTS)

 
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
   
    let lang = req.i18n.language ;
    
    // let response = await fetch('http://localhost:1337/sections/?_sort=position:ASC&level=1') ;
    // let response = await fetch(distantdatasurl) ;
    // let sections = await response ;


    /* var dice = 3;
    var sides = 6;
    var query = `query RollDice($dice: Int!, $sides: Int) {
      rollDice(numDice: $dice, numSides: $sides)
    }`;

    let graphresponse = await fetch('http://localhost:3000/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: { dice, sides }
      })
    }) ;
    let graph = await graphresponse.json() ;
    console.log(graph.data) ; */

    // res.send(graph.data) ;

    // var query = `{
    //   sections(sort:"position:asc", where:{level:"1"}){
    //     name
    //     position
    //     level
    //     children{
    //       name
    //     }
    //     article{
    //       name
    //       jade
    //     }
    //   }
    // }`;

   /*  var query = `query{
      sections(where:{level:1}, sort:"position:asc"){
        name
        position
      }
    }`;
    
    let graphresponse = await fetch('http://localhost:1337/graphql?query=' + query, {


    }) ;
    let graph = await graphresponse.json() ;

    console.log(graph.data) ; */


    let sess = {} ;

    try {
      
      const { data } = await axios.post('http://localhost:1337/auth/local', {
        identifier: 'dkt',
        password: 'Butokukai1',
      }) ;

      let sess = {
        jwt:data.jwt,
        user:data.user
      } ;

      console.log('successfully logged in...')
      console.log(sess.jwt)

    } catch (err) {
      let e = err.response.data.error ;
      
      console.log(e, 'failed to log in...') ;
    }

    let sections = formatHashes(JSON.parse(fs.readFileSync(localdatasurl,'utf8'))) ;
    
    let Data = {
      'sections':{
        name:'sections',
        data:sections
      }
    } ;

    // console.log('CALLED >> ', req.url, 'params : ' , req.params) ;
    // -------------> APP
    res.render(path.join(__dirname, 'public/jade/index'), {lang:req.language, t:req.t, title: 'DKT - Dynamic Korea Technology', Data:Data , render: jade.render, renderFile: jade.renderFile}) ;

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