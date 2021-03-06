require('dotenv').config();

const express = require('express');

let async = require('express-async-await');
let createError = require('http-errors');
let cookieParser = require('cookie-parser');

let path = require('path');

let fs = require('fs');
let fetch = require('node-fetch');
let axios = require('axios');
const { GraphQLClient, gql } = require('graphql-request');
// view engine
const jade = require('jade');
const md = require('marked');

const server = require('./server');

const i18 = require('./lang');
const queries = require('./queries');
const UTILS = require('./utils');
const CONSTANTS = require('./constants');


// let isLive = process.env.LIVE ;
let isLive = process.env.LIVE == 1;

// START THE EXPRESS
const app = express();


// CONFIGURE EXPRESS APP
(app => {

    // FIRST SETTINGS

    // internationalization before view engine
    app.use(i18.enable());

    // view engine setup to jade
    app.set('views', path.join(__dirname, 'public', 'jade'));
    app.set('view engine', 'jade');
    // app.set('view cache', true);

    // basic setup
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use(express.static(path.join(__dirname, 'public')));

})(app);



// DKT VIEWER (FRONT-END) USER DB LOGIN STORAGE
let login = async(app) => {
    // No unhandled rejection!
    console.log('////////  LOGGING IN AS DKT ////////')

    const { data } = await axios.post(CONSTANTS.PATH.db + CONSTANTS.PATH.db_auth, CONSTANTS.users.dkt);

    CONSTANTS.user = data;
    CONSTANTS.token = 'Bearer ' + data.jwt;

    const endpoint = CONSTANTS.PATH.db + CONSTANTS.PATH.db_graphql;
    const { GraphQLClient } = require('graphql-request');
    const { Headers } = require('cross-fetch');

    global.Headers = global.Headers || Headers;


    var headers = {
        authorization: `Bearer ${CONSTANTS.user.jwt}`
    }

    CONSTANTS.DKTClient = new GraphQLClient(endpoint, {
        headers: headers
    });
    console.log(headers)
    console.log('\t LOGIN SUCCESSFULL');
}

let sitejade ;

// DB OR FIXTURES
let fetchdata = async(req, res, part, noreturn) => {
    let data;
    if (isLive) {
        data = await CONSTANTS.DKTClient.request(queries.sections[part], queries.sections.variables || {});
        // console.log(data)
        if(!!data.site){
            sitejade = data.site ;
        }
        data = data.sections;
    } else {
        data = await fs.promises.readFile(CONSTANTS.fixtures[part], 'utf8');
        data = UTILS.formatHashes(JSON.parse(data));
    }
    // console.log(data)
    if (noreturn) res.json(data);
    else return data;
}



// JADESETTINGS
const jadebasedir = path.join(__dirname, 'public', 'jade');
const JADESETTINGS = {
    params: {},
    excludes: {
        // settings:1,
        // language:1,
        // languageDir:1,
        // t:1,
        // exists:1,
        i18n: 1,
        // basedir:1,
        // title:1,
        // lang:1,
        // render:1,
        // renderFile:1,
        // join:1,
        // p:1,
        _locals: 1,
        cache: 1,
        // filename:1
    }

}
let i18next = i18.i18next;

let merge = (p, newp) => {
    for (var s in newp) p[s] = newp[s];
    return p;
}

let clone = (p) => {
    let cl = {},
        ex = JADESETTINGS.excludes;
    for (var s in p) {
        if (!(s in ex)) {
            cl[s] = p[s];
        }
    }
    return cl;
}

let p = (input, locals) => {
    return merge(clone(input), clone(locals));
}

let customize = (bracket, source) => {
    var customs = {};
    var module = getComponentsByTypename(bracket, 'ComponentJadeJadePage');
    if (!!module.length && module[0].jade != '') {
        customs = rfs(module[0].jade, module[0].path, source);
    }
    return customs;
}

let rfs = (src, filename, params) => {
    var Module = module.constructor;
    var m = new Module("", params);

    m._compile(src, filename);
    return m.exports;
}

let getComponentsByTypename = (list, name) => {
    let l = list.length;
    let p = [];
    for (var i = 0; i < l; i++) {
        let el = list[i];
        if (name == el.__typename)
            p[p.length] = el;
    }
    return p;
}

let getComponentByName = (list, name) => {
    let l = list.length;
    let right;
    for (var i = 0; i < l; i++) {
        el = list[i];
        if (name == el.name) {
            right = el;
            break;
        }
    }
    return right;
}



// let loadedLangs = await Object.keys(i18next.services.resourceStore.data) ; 

let params = CONSTANTS.jadeparams = {
    basedir: jadebasedir + '/',
    title: CONSTANTS.SITE.title,
    require: require,
    render: jade.render,
    renderFile: jade.renderFile,
    compile: jade.compile,
    compileFile: jade.compileFile,
    join: path.join,
    app: app,
    md: md,
    CDN: CONSTANTS.PATH.cdn,
    customize: customize,
    getComponentsByTypename: getComponentsByTypename,
    getComponentByName: getComponentByName,
    rfs: rfs,
    p: p,
    merge: merge,
    clone: clone
};


let topsections, db_sections;


// WWW
let content = async(req, res) => {

    // db_sections = db_sections || await fetchdata(req, res, 'datas').catch( err => {console.log(err)}) ;
    // console.log(req.params)
    if (!!req.params.sectionId) {
        res.render(path.join(__dirname, 'public/jade/content.jade'), merge(params, {
            lang: req.i18n.language,
            t: req.t,
            db_sections: db_sections,
            topsections: topsections,
            params: req.params
        }));
        

        // var tpl = jade.compile(sitejade.templates[0].jade, {});

        
        // res.send(tpl());


    } else {
        db_sections = await fetchdata(req, res, 'datas').catch(err => { console.log(err) });
        // console.log(db_sections)
        res.render(path.join(__dirname, 'public/jade/content.jade'), merge(params, {
            lang: req.i18n.language,
            t: req.t,
            db_sections: db_sections,
            topsections: topsections,
            params: req.params
        }));

    }
}
// ERRORS

// MAIN PAGE

let root = async(req, res) => {

    // topsections = topsections || await fetchdata(req, res, 'navdatas').catch( err => {console.log(err)}) ;
    topsections = await fetchdata(req, res, 'navdatas').catch(err => { console.log(err) });
    let loadedLangs = await Object.keys(i18next.services.resourceStore.data);

    res.render(path.join(__dirname, 'public/jade/index'), merge(params, {
        langs: loadedLangs,
        lang: req.i18n.language,
        t: req.t,
        topsections: topsections
    }));

}




// ROUTES
app.use('/datas/', async(req, res) => {
    // console.log('requesting datas')
    await fetchdata(req, res, 'datas', true).catch(err => { console.log(err) });
});

app.use('/navdatas/', async(req, res) => {
    // console.log('requesting navdatas')
    await fetchdata(req, res, 'navdatas', true).catch(err => { console.log(err) });
});






app.use('/content/section/:sectionId', async(req, res) => {
    // console.log(req.params)

    await content(req, res).catch(err => { console.log(err) });
});

app.use('/content/', async(req, res) => {
    // console.log(req.params)

    await content(req, res).catch(err => { console.log(err) });
});

app.use('/', async(req, res) => {
    // console.log('requesting home') ;
    await root(req, res).catch(err => { console.log(err) });

});


let DELAY_TIME = 1;

if (process.env.SHOULD_DELAY == true || process.env.SHOULD_DELAY >= 1) {
    console.log('DELAYING ' + process.env.SHOULD_DELAY + 'MS SERVER START FOR STRAPI TO LOAD');
    DELAY_TIME = process.env.SHOULD_DELAY;
}

setTimeout(function() {


    // SERVER LAUNCHING
    (async(app) => {
        let SUCCESS = true;

        if (isLive) {
            // SITE LOGIN AS DKT VIEWER USER
            await login(app).catch((err) => {
                console.log(err)
                console.log('/tLOGIN FAILED  ////////');
                console.log('Let us check \n\t1. our Credentials\n	2. if server on "' + CONSTANTS.PATH.db + '" is running');
                SUCCESS = false;
                console.log('Server not Ready');
            });

            console.log('WILL LOAD LIVE MONGO DATAS')

        } else {
            console.log('WILL LOAD LOCAL FILES')
        }
        console.log('Requesting on ' + CONSTANTS.PATH.db)
        console.log('GraphQL on ' + CONSTANTS.PATH.db + CONSTANTS.PATH.db_graphql)
        if (SUCCESS) server.launchServer(app);
        else process.exit();

    })(app);




}, DELAY_TIME)

module.exports = app;