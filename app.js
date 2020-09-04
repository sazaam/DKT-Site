

const express = require('express') ;

let async = require('express-async-await') ;
let createError = require('http-errors') ;
let cookieParser = require('cookie-parser') ;

let path = require('path') ;

let fs = require('fs') ;
let fetch = require('node-fetch') ;
let axios = require('axios') ;

// view engine
let jade = require('jade') ;

const routes = require('./routes')
const server = require('./server') ;

const i18 = require('./lang') ;
const queries = require('./queries') ;
const UTILS = require('./utils') ;
const CONSTANTS = require('./constants') ;
const DATAS = require('./datas') ;


console.log(CONSTANTS) ;

// launch the app
const app = express() ;

(() => {

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


})() ;


let db = async (req, res) => {
	
    const {data} = await axios.post(CONSTANTS.PATH.db + CONSTANTS.PATH.db_graphql, {
		query: queries.sections
	}) ;
	
    DATAS.sections = (data.data.sections) ;
	// console.log(DATAS) ;
}

let onDBError = (err)=>{
	console.log(err) ;
}



let root = async (req, res) => {
	
	await
		db(req, res)
		.catch(onDBError) ;
	
	// No unhandled rejection!
	let sections = UTILS.formatHashes( JSON.parse( await fs.promises.readFile(CONSTANTS.fixtures, 'utf8') ) ) ;

	// console.log('CALLED >> ', req.url, 'params : ' , req.params) ;
	// -------------> FRONT-END JS APP
	res.render(path.join(__dirname, 'public/jade/index'), {
		lang: req.i18n.language,
		t: req.t,
		title: 'DKT - Dynamic Korea Technology',
		sections: sections,
		render: jade.render,
		renderFile: jade.renderFile
	})

}
let onRootError = (err)=>{
	console.log(err) ;
}

// ROUTING
(async ()=>{

	app.use('/', async (req, res) => {
		
		await
			root(req, res)
			.catch(onRootError) ;
	}) ;

})() ;


let login = async () => {
	// No unhandled rejection!
	console.log('////////  LOGGING IN  ////////')
	console.log(CONSTANTS.PATH.db + CONSTANTS.PATH.db_auth)
	const { data } = await axios.post(CONSTANTS.PATH.db + CONSTANTS.PATH.db_auth, CONSTANTS.users.dkt) ;
	console.log(data.jwt)
	data.auth = {'Authorization':'Bearer '+ data.jwt} ;
	console.log('\t  LOGIN SUCCESSFULL') ;

}
let onLoginError = (err)=>{
	console.log('/tLOGIN FAILED  ////////') ;
	console.log('Let us check \n\t1. our Credentials\n\t2. if server on ' + CONSTANTS.PATH.db + 'is running') ;
}

// SERVER LAUNCHING
(async ()=>{

	// Site Login
	await
		login()
		.catch(onLoginError) ;
	
	// SERVER READY SO FINALLY LAUNCHING
	server.launchServer(app) ;

})()







module.exports = app ;

