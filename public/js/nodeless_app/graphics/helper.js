

var TWEENS 				= {} ;
var ALIASES 			= {} ;
var CLOSURES 			= {} ;

var Helper = Type.define({
	pkg:'org.libspark.betweenjs.helpers::Helper',
	domain:Type.appdomain,
	statics:{
		unhaltSystem:function(){
			var AT = BetweenJS.$.AnimationTicker ;
			if(!!AT.HALT){
				AT.restoreSystem() ;
			}
			return Helper ;
		},
		register: function(alias, closure){
			var args = [].slice.call(arguments) ;
			alias = args.shift() ;
			return CLOSURES[alias] = args.constructor == Array ? args.length > 1 ? args : args[0] : args ;
		},
		unregister:function(alias){
			delete CLOSURES[alias] ;
		},
		getClosure:function(alias){
			return CLOSURES[alias] ;
		},
		create:function(alias){
			var args = [].slice.call(arguments) ;
			alias = args.shift() ;
			
			var closure = Helper.getClosure(alias) ;
			try {
				closure.execute.apply(closure, [].concat(args)) ;
				// trace('will invoke > ', alias)
				// trace(TWEENS[alias.toUpperCase()])
				// trace(TWEENS)
				return TweenControl.invoque(alias) ;
			} catch (error) {
				throw new Error('please check closure if :' + alias + ', is undefined') ;
			}
		},
		

		focus:function(e, closure){
			var res = e.target ;
			// trace('FOCUS', e) ;
			// trace('Closure', closure) ;
			trace(e)
			// if(e.type == 'focusIn'){
			// 	Helper
			// 		.unhaltSystem()
			// 		.create(closure, res, e).bind('complete', function(){
			// 			trace('HELPERR HELP')	
			// 			// ON DATA, LAUNCH OPENING TWEENS
			// 			res.focusReady() ;
			// 			// clean up tween
			// 			this.destroy() ;
						
			// 		}).play() ;

			// }else{
			// 	Helper
			// 		.unhaltSystem()
			// 		.create(closure, res, e).bind('complete', function(){
			// 			trace('HELPERR HELP')	
			// 			// ON DATA, LAUNCH OPENING TWEENS
			// 			res.focusReady() ;
			// 			// clean up tween
			// 			this.destroy() ;
						
			// 		}).play() ;
			// 	res.focusReady() ;
			// }
			res.focusReady() ;
		},

		toggle:function(e, closure){
			var res = e.target ;
			var ready = function(){
				var s = e ;
				Helper
					.unhaltSystem()
					.create(closure, res, s).bind('complete', function(){
									
						// ON DATA, LAUNCH OPENING TWEENS
						res.ready() ;
						// clean up tween
						this.destroy() ;
						
					}).play() ;
			}
			if(res.opening){
				
				// IF NO LOADINGS ARE REQUIRED
				if(!res.userData.urljade && !res.userData.urljson){
					
					return ready() ;
					
				}
				
				
				if(!res.template){ // IF TEMPLATE IS NOT LOADED ALREADY
					
					// FETCHING DATA // (ASYNC) ONLY ONCE
					res.render(
						res.userData.urljade, 
						// res.fetch(
						// 	res.userData.urljson, 
						// 	res.userData.parameters
						// ), 
						res.userData.parameters['examples'],
						function(){
							
							ready() ;
					})	
				}else{
					ready() ;
				}
			}else{
				// LAUNCH CLOSING TWEENS
				ready() ;
			}
		}
		
		
	}
})

var TweenControl = Type.define({
	domain:Helper,
	pkg:'org.libspark.betweenjs.helpers::TweenControl',
	statics:{
		ACTIVE_TWEENS:[],
		register: function(alias, tween){
			var args = [].slice.call(arguments) ;
			alias = args.shift() ;
			return TWEENS[alias] = args.constructor == Array ? args.length > 1 ? args : args[0] : args ;
		},
		unregister:function(alias){
			delete TWEENS[alias] ;
		},
		registerAlias: function(alias, tweenaliases){
			var args = [].slice.call(arguments) ;
			alias = args.shift() ;
			return ALIASES[alias] = args.constructor == Array ? args.length > 1 ? args : args[0] : args ;
		},
		unregisterAlias: function(alias){
			delete ALIASES[alias] ;
		},
		isRegistered:function(alias){
			return alias in TWEENS ;
		},
		isAliasRegistered:function(alias){
			return alias in ALIASES ;
		},
		find:function(aliases, result, l){
			
			aliases 	= [].slice.call(arguments),
			result 		= [],
			l			= aliases.length ;
			
			for(var i = 0 ; i < l ; i ++){
				
				var alias = aliases[i] ;
				
				if(typeof alias == 'string') alias = this.find.apply(this, [(alias in ALIASES) ? ALIASES[alias] : TWEENS[alias]]) ;
				else if(alias.constructor == Array) alias = this.find.apply(this, [].concat(alias)) ;
				
				result.push.apply(result, [].concat(alias)) ;
			}
			
			return result ;
		},
		invoque:function(aliases){
			return BetweenJS.serialTweens(this.find.apply(this, [].slice.call(arguments))) ;
		},
		getTween:function(alias){
			return TWEENS[alias] ;
		},
		getAlias:function(alias){
			return ALIASES[alias] ;
		}
		
	}
}) ;

var Closure = Type.define({
	pkg:'org.libspark.betweenjs.helpers::Closure',
	domain:Helper,
	constructor:Closure = function Closure(id, closure, params){
		var args 			= [].slice.call(arguments) ;
		this.id 			= args.shift() ;
		this.closure 		= args.shift() ;
		this.params 		= args ;
		
		Helper.register(id, this) ;
	},
	execute:function(params){
		var args = [].slice.call(arguments) ;
		return this.closure.apply(this, args.length ? args : this.params) ;
	}
})








module.exports = Helper ;