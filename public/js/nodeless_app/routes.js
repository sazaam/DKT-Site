


// what steps are going to do graphically , extracted from './graphics.js'
// on toggle (both opening / closing) and focus events


var makeTemplateFocus = function(func){

	return function(e){
		res = e.target ;
		if(e.type == 'focusIn'){
			func(e) ;
		}else{
			func(e) ;
		}
	}

} ;

var makeTemplateToggle = function(func){

	return function(e){
		
		res = e.target ;

		if(res.opening){

			// IF NO LOADINGS ARE REQUIRED
			if(!res.userData.urljade && !res.userData.urljson){
				func(e) ;
			}
			
			
			if(!res.template){ // IF TEMPLATE IS NOT LOADED ALREADY
				trace(res.userData.urljade)
				// FETCHING DATA // (ASYNC) ONLY ONCE
				res.render(
					res.userData.urljade, 
					// res.fetch(
					// 	res.userData.urljson, 
					// 	res.userData.parameters
					// ), 
					res.userData.parameters['sections'],
					function(){
						func(e) ;
				})	
			}
		}else{
			
			func(e) ;

		}
	}

} ;


var graphics = require('./graphics/index.js') ;
var focus = graphics.focus ;
var toggle = graphics.toggle ;



/* 
var sects = [] ;


var createSect = function(sec){
	var name = sec.name ; 
	var template = sec.template ;

	var children = sec.children ;
	var ch = [] ;
	
	if(!!children){
		var l = children.length ;
		for(i = 0 ; i < l ; i ++){
			var child = children[i] ;
			ch[i] = createSect(child) ;
		}
	}
	trace(template.jade)

	return ({
		children:ch,
		name:name,
		'@jade':template.jade,
		"@json": '/datas/' + name + '/',
		"@focus":sec.level == 1 ? focus : inside_focus,
		"@toggle":sec.level == 1 ? toggle : inside_toggle
	})
} ;

for(var ss = 0 ; ss < data_sections.length ; ss ++) {
	var sec = data_sections[ss] ;
	
	// REMOVE LATER...
	sec.focus = focus ;
	sec.toggle = toggle ;
	

	sects[ss] = createSect(sec) ;
}
trace('sects', sects)
 */
var sects = [
	{
		name:'home',
		"@jade": '/jade/home',
		"@json": '/home/',
		"@focus":focus,
		"@toggle":toggle
	},
	{
		name:'products',
		"@jade": '/jade/products',
		"@json": '/products/',
		"@focus":focus,
		"@toggle":toggle,
		children:[
			{
				name:'ppf',
				"@jade": '/jade/products_product',
				"@json": '/products/{$1}',
				"@focus":focus,
				"@toggle":toggle,
				children:[
					{
						name:'review',
						"@jade": '/jade/products_product_closeup',
						"@json": '/products/{$1}/article/',
						"@focus":focus,
						"@toggle":toggle
					}
				]
			},
			{
				name:"nanometablack",
				"@jade": '/jade/products_product',
				"@json": '/products/{$1}',
				"@focus":focus,
				"@toggle":toggle,
				children:[
					{
						name:'review',
						"@jade": '/jade/products_product_closeup',
						"@json": '/products/{$1}/article/',
						"@focus":focus,
						"@toggle":toggle
					}
				]
			}
		]
	},
	
	{
		name:'about',
		"@jade": '/jade/about',
		"@json": '/about/',
		"@focus":focus,
		"@toggle":toggle,
		children:[
			{
				name:'intro',
				"@jade": '/jade/news_new',
				"@json": '/news/{$1}',
				"@focus":focus,
				"@toggle":toggle
			},
			{
				name:'clients',
				"@jade": '/jade/news_new',
				"@json": '/news/{$1}',
				"@focus":focus,
				"@toggle":toggle
			}
		]
	},{
		name:'contact',
		"@jade": '/jade/contact',
		"@json": '/contact/',
		"@focus":focus,
		"@toggle":toggle
	}

] ;

var defaultFunction = function(node, exp){

	var hasChildren = !!node.children ;
	var l = hasChildren ? node.children.length : 0 ;
	var name = node.name ;
	var first = hasChildren ? node.children[0] : null ;
	var focus = node['@focus'] ;
	var toggle = node['@toggle'] ;
	var urljade = node['@jade'] ;
	var urljson = node['@json'] ;
	
	var f ;
	var jade, json ;
	
	if(!!node['index'] || (!!first && first.name == 'index')){
		
		f = function(req, res){ return res.ready() }

		jade = urljade || first['@jade']
		json = urljson || first['@json'] ;

		f.index = function index (req, res){
			if(res.opening){
				res.userData.urljade = jade ;
				res.userData.urljson = json ;
				res.userData.parameters = {response:res.parentStep} ;
			}
			return res ;
		} ;
		f.index['@focus'] = focus ;
		f.index['@toggle'] = toggle ;
	}else{

		jade = urljade || first['@jade']
		json = urljson || first['@json'] ;
		
		f = function (req, res){
			if(res.opening){
				res.userData.urljade = jade ;
				res.userData.urljson = json ;
				res.userData.parameters = {response:res} ;
			}
			return res ;
		} ;
		f['@focus'] = focus ;
		f['@toggle'] = toggle ;
	}
	
	f.name = name ;

	for(var i = 0 ; i < l ; i++){
		var child = node.children[i] ;
		if(child.name != 'index'){
			arguments.callee(child, f) ;
		}
	}

	exp[name] = f ;

	return node ;
}

var parseJsonSections = function(sects){
	var exp = {} ;
	var l = sects.length ;

	// return l
	for(var i = 0 ; i < l ; i ++ ){
		var node = sects[i] ;
		defaultFunction(node, exp) ;
	}

	return exp ;
}

var struct = parseJsonSections(sects) ;

module.exports = struct ;

