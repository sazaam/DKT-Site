require('dotenv').config() ;

const express = require('express') ;

let async = require('express-async-await') ;
let createError = require('http-errors') ;
let cookieParser = require('cookie-parser') ;

let path = require('path') ;

let fs = require('fs') ;
let fetch = require('node-fetch') ;
let axios = require('axios') ;
const { GraphQLClient, gql } = require('graphql-request') ;
// view engine
const jade = require('jade') ;
const md = require('marked') ;

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
	
	
	
	const JADESETTINGS = {
		params:{},
		excludes:{
			// settings:1,
			// language:1,
			// languageDir:1,
			// t:1,
			// exists:1,
			i18n:1,
			// basedir:1,
			// title:1,
			// lang:1,
			// render:1,
			// renderFile:1,
			// join:1,
			// p:1,
			_locals:1,
			cache:1,
			// filename:1
		}

	}

	let merge = (p, newp) => {
		for(var s in newp) p[s] = newp[s] ;
		return p ;
	}

	let clone = (p) => {
		let cl = {}, ex = JADESETTINGS.excludes ;
		for(var s in p){
			if(!(s in ex)){
				cl[s] = p[s] ;
			}
		}
		return cl ;
	}

	
	let customize = (bracket, source) => {
		var customs = {} ;
		var module = getComponentsByTypename(bracket, 'ComponentJadeJadePage') ;

		if(!! module.length && module[0].jade != ''){
			customs = rfs(module[0].jade, module[0].path, source) ;
		}
		return customs ;
	}

	let getComponentsByTypename = (list, name) => {
		let l = list.length ;
		let p = [] ;
		for(var i = 0 ; i < l ; i ++){
			let el = list[i] ;
			if(name == el.__typename) 
				p[p.length] = el ;
		}
		return p ;
	}
	
	let rfs = (src, filename, params) => {
		var Module = module.constructor;
		var m = new Module("", params) ;
		
		m._compile(src, filename) ;
		return m.exports ;
	}
	
	let p = (locals, input) => {
		return merge(clone(locals), clone(input)) ;
	}
	
	if(!MAINDEBUG || RELEASED){

		const jadebasedir = path.join(__dirname, 'public', 'jade') ;
		
		let i18next = i18.i18next ;
		let loadedLangs = await Object.keys(i18next.services.resourceStore.data) ; 
		
		let params = CONSTANTS.jadeparams = {
			basedir:jadebasedir + '\\',
			title:CONSTANTS.SITE.title,
			lang: req.i18n.language,
			langs: loadedLangs,
			t: req.t,
			db_sections:db_sections,
			data_sections: data_sections,
			require:require,
			render: jade.render,
			renderFile: jade.renderFile,
			compile: jade.compile,
			compileFile: jade.compileFile,
			join:path.join,
			app:app,
			md:md,
			CDN:CONSTANTS.PATH.cdn,
			// pliotize:pliotize,
			customize:customize,
			getComponentsByTypename:getComponentsByTypename,
			rfs:rfs,
			p:p,
			merge:merge,
			clone:clone
		} ;

		
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
	const { GraphQLClient } = require('graphql-request');
	const { Headers } = require('cross-fetch');
	
	global.Headers = global.Headers || Headers;
	
	CONSTANTS.DKTClient = new GraphQLClient(endpoint, {
		headers: {
			authorization: `Bearer ${CONSTANTS.user.jwt}`
		},
	});
	
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
		console.log(err)
		console.log('/tLOGIN FAILED  ////////') ;
		console.log('Let us check \n\t1. our Credentials\n	2. if server on "' + CONSTANTS.PATH.db + '" is running') ;
	}) ;
	
	// SERVER READY SO FINALLY LAUNCHING
	server.launchServer(app) ;

	if(MAINDEBUG){
		await root({}, {}).catch( err => {console.log(err)}) ;
	}


})(app) ;







module.exports = app ;