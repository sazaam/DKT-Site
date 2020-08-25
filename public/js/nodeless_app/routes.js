


// what steps are going to do graphically , extracted from './graphics.js'
// on toggle (both opening / closing) and focus events



var graphics = require('./graphics/index.js') ;

var focus = graphics.focus ;
var toggle = graphics.toggle ;


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
				name:'sl_001',
				"@jade": '/jade/product',
				"@json": '/products/{$1}',
				"@focus":focus,
				"@toggle":toggle
			},
			{
				name:'lm_001',
				"@jade": '/jade/product',
				"@json": '/products/{$1}',
				"@focus":focus,
				"@toggle":toggle
			},
			{
				name:'uw_001',
				"@jade": '/jade/product',
				"@json": '/products/{$1}',
				"@focus":focus,
				"@toggle":toggle
			},
			{
				name:'uv_001',
				"@jade": '/jade/product',
				"@json": '/products/{$1}',
				"@focus":focus,
				"@toggle":toggle
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

