const express = require('express') ;

let async = require('express-async-await') ;
let createError = require('http-errors') ;
let cookieParser = require('cookie-parser') ;

let path = require('path') ;

let fs = require('fs') ;
let fetch = require('node-fetch') ;
let axios = require('axios') ;
const { setHeaders, setHeader, GraphQLClient, gql } = require('graphql-request') ;
// view engine
let jade = require('jade') ;

const routes = require('./routes')
const server = require('./server') ;

const i18 = require('./lang') ;
const queries = require('./queries') ;
const UTILS = require('./utils') ;
const CONSTANTS = require('./constants') ;
const DATAS = require('./datas') ;


// START THE EXPRESS
const app = express() ;


// CONFIGURE EXPRESS APP
(app => {

	// FIRST SETTINGS
	
	// internationalization before view engine
	app.use(i18.enable()) ;

	// view engine setup to jade
	app.set('views', path.join(__dirname, 'public', 'jade'))
	app.set('view engine', 'jade')

	// basic setup
	app.use(express.json()) ;
	app.use(express.urlencoded({ extended: false })) ;
	app.use(cookieParser()) ;

	app.use(express.static(path.join(__dirname, 'public'))) ;

})(app) ;

let MAINDEBUG = true ;
// let MAINDEBUG = false ;
let RELEASED = false ;

let db = async (req, res) => {

	let data = await CONSTANTS.DKTClient.request(queries.sections.query, queries.sections.variables || {}) ;
	return data.sections ;
}


let fixtures = async (req, res) => {

	let fix = await fs.promises.readFile(CONSTANTS.fixtures, 'utf8') ;

	return UTILS.formatHashes( JSON.parse( fix ) ) ;
}

let root = async (req, res) => {
	
	// REAL DB
	let db_sections = await db(req, res).catch( err => {console.log(err)}) ;

	
	// JSON FIXTURES
	let data_sections = await fixtures(req, res).catch( err => {console.log(err)}) ;
	

	let merge = (p, newp) => {
		
		for(var s in newp) p[s] = newp[s] ;
		
		return p ;
	}
	
	let clone = p => {
		let cl = {} ;
		
		let excludes = {'_locals':1} ;

		for(var s in p)
			if(!(s in excludes))
				cl[s] = p[s] ;

		return cl ;
	}

	
	if(!MAINDEBUG || RELEASED){

		const jadebasedir = path.join(__dirname, 'public', 'jade') ;
		let params = {
			basedir:jadebasedir + '\\',
			title:CONSTANTS.SITE.title,
			lang: req.i18n.language,
			t: req.t,
			db_sections:db_sections,
			data_sections: data_sections,
			render: jade.render,
			renderFile: jade.renderFile,
			join:path.join,
			p:(newp) => {
				
				return !!newp ? merge(clone(params), newp) : clone(params) ;
			}
		} ;

			// -------------> FRONT-END JS APP
		res.render(path.join(__dirname, 'public/jade/index'), params) ;
	}

 
}



// DKT VIEWER (FRONT-END) USER DB LOGIN STORAGE
let login = async (app) => {
	// No unhandled rejection!
	console.log('////////  LOGGING IN AS DKT ////////')
	const { data } = await axios.post(CONSTANTS.PATH.db + CONSTANTS.PATH.db_auth, CONSTANTS.users.dkt) ;
	
	CONSTANTS.user = data ;
	CONSTANTS.token = 'Bearer ' + data.jwt ;

	const endpoint = CONSTANTS.PATH.db + CONSTANTS.PATH.db_graphql ;
	
	
	CONSTANTS.DKTClient = new GraphQLClient(endpoint) ;
	CONSTANTS.DKTClient.setHeaders({ 
		authorization: `Bearer ${CONSTANTS.user.jwt}`
	}) ;
	
	console.log('\t  LOGIN SUCCESSFULL') ;
}

// ROUTES
(async ()=>{
	
	app.use('/', async (req, res) => {
		RELEASED = true ;
		await root(req, res).catch( err => {console.log(err)}) ;
	
	}) ;

})() ;

// SERVER LAUNCHING
(async (app)=>{

	// SITE LOGIN AS DKT VIEWER USER
	await login(app).catch((err) => {
		console.log('/tLOGIN FAILED  ////////') ;
		console.log('Let us check \n\t1. our Credentials\n\t2. if server on ' + CONSTANTS.PATH.db + 'is running') ;
	}) ;
	
	// SERVER READY SO FINALLY LAUNCHING
	server.launchServer(app) ;

	if(MAINDEBUG){
		await root({}, {}).catch( err => {console.log(err)}) ;
	}


})(app) ;







module.exports = app ;