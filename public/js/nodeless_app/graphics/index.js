
require('../strawnode_modules/strawnode_modules/jquery-1.8.1.min.js') ;
require('../strawnode_modules/strawnode_modules/jquery.ba-hashchange.min.js') ;
require('../strawnode_modules/betweenjs.js') ;


var THREE = window.THREE = require('../../threejs/build/three.js') ;

require('../../threejs/examples/js/controls/OrbitControls.js')
require('../../threejs/examples/js/controls/TrackballControls.js')
require('../../threejs/examples/js/loaders/GLTFLoader.js')
require('../../threejs/examples/js/loaders/DRACOLoader.js')
require('../../threejs/examples/js/loaders/RGBELoader.js')
require('../../threejs/examples/js/WebGL.js')

var effects = require('./effects.js') ;



var focus ;
var toggle ;
var products_focus ;
var products_toggle ;

var patchwork ;
var threenoise ;
var slidrens ;

var topofpage ;
var topclos ;
var navmenus ;
var navmenusEv ;

var scroll ;
var scrollEv ;
var slideshow ;
var smallslideshow ;

var langchange ;
var parallax ;
var resetscrolls ;

window.lang = $('html').attr('lang') ;


var OKWEBGL = THREE.WEBGL.isWebGLAvailable() && 0 ;

module.exports = {
	
	////////////////////////// LANGUAGES
	langchange: langchange = function(e){
		e.preventDefault() ;
		e.stopPropagation() ;
		
		var tg = $(this) ;
		var a = $(tg.children(0)[0]) ;
		
		/* 
		var req = new AjaxRequest().load('/en/products/', function(jxhr, req){
			
			trace(req.response)
			
		}) ;
		
		
		return ;
		 */
		
		var language = a.attr('lang') ;
		
		if(language == window.lang) return ;
		var req = new AjaxRequest().load('/?lng='+language+'', function(jxhr, req){
			// console.log(req.response)
			
			var h = location.hash.replace(/^#\/\w{2}/, function(l){
				
				// trace(arguments)
				return '#/'+language+'' ;
			}) ;
			
			document.location.hash = h ;
			
			document.location.reload() ;
			
		}, 'POST' ) /* */
		
		// var h = location.hash.replace(/^#\/\w{2}/, function(l){
			
			// trace(arguments)
			// return '#/'+language+'' ;
		// }) ;
		// window.lang = language ;
	},
	languages: languages = function(e, cond){
		
		if(cond){
			$('.lang').on('click', langchange)
		}else{
			$('.lang').off('click', langchange)
		}
	},
	
	
	
	
	////////////////////////// SCROLL EVENTS
	scroll : scroll = function(e){
		
		var pos = $(document).scrollTop() ;
		
		if(pos > 0){
			$('.navbar').addClass('overnav') ; 
			$('.js-transition-intro').addClass('none') ;

			
		}else{
			$('.navbar').removeClass('overnav') ;
			$('.js-transition-intro').removeClass('none') ;
		}
		
	},
	scrollEv : scrollEv = function(type, clos, cond){
		
		if(cond){
			$(document).on(type, clos) ;
			
			clos() ;
			
		}else{
			$(document).off(type, clos) ;
		}

	},
	navmenusEv:navmenusEv = function(e){
		var li = $(e.currentTarget) ;
		if(e.type == 'mouseenter'){
			li.addClass('over') ;
		}else{
			li.removeClass('over') ;
		}
	},
	navmenus:navmenus = function(e, cond){
		
		$('.others').each(function(i, el){
			var li = $(el) ;
			
			if(cond){
				li.on('mouseenter', navmenusEv) ;
				li.on('mouseleave', navmenusEv) ;
			}else{
				li.off('mouseenter', navmenusEv) ;
				li.off('mouseleave', navmenusEv) ;
			}
				
		})
				
	},

	topclos:topclos = function(e){
		e.preventDefault() ;
		e.stopPropagation() ;

		$(document).scrollTop(0) ;
	},
	topofpage : topofpage = function(e, cond){
		var res = e.target ;
		var id = res.id ;
		var top = $('#'+id+' .topofpage') ;
		
		if(cond){
			top.on('click', topclos) ;
			
		}else{
			top.off('click', topclos) ;
		}
	},
	
	small3D:small3D = function(e, cond){
		
		var res = e.target ;
		
		var canvasholder = $('#'+res.id+' .canvascontainer') ;
		
		if( OKWEBGL ){

			if(cond){

			

				if(!!canvasholder.length){
				// 	canvasholder.css('backgroundImage', '') ;
					effects.viz3D.enable(true, canvasholder, e) ;	
				}
	
			}else{
	
				if(!!canvasholder.length){
					effects.viz3D.enable(false, canvasholder, e) ;	
				}
	
			}

			
		}
		
		
		

	},
	////////////////////////// SLIDESHOW
	smallslideshow : smallslideshow = function(e, cond){
		
		var res = e.target ;
		var id = res.id ;
		var parentID = res.parentStep.id ;
		var rt = $('#' + id ) ;
		var slideshow = rt.find('.pics') ;
		
		if(!slideshow.length) return ;
		
		var slides = rt.find('.pics li') ;
		var launched = false ;
		var cy ;
		
		
		if(!res.userData.cy){
			
			var commands = [] ;
			cy = res.userData.cy = new Cyclic(commands) ;
			var TIME = 2000 ;
			
			
			
			
			var mm = res.userData.mm = function(e){
				
				var li = $(e.target) ;
				var w = li.width() ;
				var mw = w >> 1 ;
				var screenX = window.screenX = e.pageX || window.screenX ;
				var localX = screenX - li.offset().left ;
				
				if(localX > mw){ // ON RIGHT
					
					li.addClass('slidenext')
					li.removeClass('slideprev')

					
				}else{ // ON LEFT

					li.addClass('slideprev')
					li.removeClass('slidenext')

				}
				
			}

			var clk = res.userData.clk = function(e){
				
				var tg = $(e.target) ;
				var w = tg.width() ;
				var mw = w >> 1 ;
				var screenX = window.screenX = e.pageX || window.screenX ;
				var localX = screenX - tg.offset().left ;

				if(localX > mw){ // ON RIGHT
					cy.next() ;
				}else{ // ON LEFT
					cy.prev() ;
				}
				
			}
				
			
			
			
			slides.each(function(i, el){
				
				var li = $(el) ;
				
				cy.push(new Command(null, function(el, i){
					var c = this ;
					var li = $(el) ;
					
					clear() ;
					
					li.css({
						'left':'0',
						'z-index':'2'
					}) ;
					
					
					// trace(i)
					
					var tw = res.userData.tw = BetweenJS.parallel(
						BetweenJS.create({
							target:li,
							to:{
								'opacity':100
							},
							from:{
								'opacity':0
							},
							time:.45,
							ease:Expo.easeOut
						})
					) ;
					li.trigger('mousemove') ;
					
					tw.onComplete = function(){
						c.dispatchComplete() ;
					}
					tw.play() ;
					
					return this ;
				}, el, i))

				
			})
			
		}
		
		cy = res.userData.cy ;
		
		var clear = res.userData.clear = res.userData.clear || function(){
			
			if(res.userData.tw){
				res.userData.tw.stop() ;
			}

			slides.css({
				'z-index':'1',
				'left':'15000px',
				'opacity':'0'
			}).removeClass('inited') ;
			
		}
		
		
		
		var enable = res.userData.enable = res.userData.enable || function(cond){
			
			slides.each(function(i, el){
				var li = $(el) ;
				
				if(cond){
					
					li.on('click', res.userData.clk) ;
					li.on('mousemove', res.userData.mm) ;
					
				}else{
					
					li.off('click', res.userData.clk) ;
					li.off('mousemove', res.userData.mm) ;
					
				}
				
			}) ;
			
		}
		
		if(cond){
			
			clear() ;

			enable(true) ;
			cy.next() ;
			
		}else{
			
			clear() ;
			
			enable(false) ;
			
		}
		
		
	},
	////////////////////////// SLIDESHOW
	slideshow : slideshow = function(e, cond){
		
		var res = e.target ;
		var id = res.id ;
		
		var rt = $('#'+id) ;
		var slideshow = rt.find('.slideshow') ;
		
		if(!slideshow.length) return ;
		
		var slides = slideshow.find('.slides li.bg-dark') ;
		
		var slidesnav = slideshow.find('.flex-control-nav li a') ;
		
		var sl ;
		
		if(!res.userData.slideshow){
			
			sl = res.userData.slideshow = {} ;




			var commands = [] ;
			sl.cy = new Cyclic(commands) ;
			var TIME = 7000 ;
			
			
			
			
			sl.mm = function(e){
				
				var li = $(e.currentTarget) ;
				
				if(e.target.tagName == 'SPAN' || e.target.tagName == 'A'){
					if( e.target.tagName == 'A') li.removeClass('slideprev slidenext')
					// if( e.target.tagName == 'A') li.removeClass('slidenext')
					return ;
				} else {
					

					var w = $(window).width() ;
					var h = $(window).height() ;
					var mw = w >> 1 ;
					var mh = h >> 1 ;
					
					mh = mh + (mh >> 1) ;

					var screenX = window.screenX = e.pageX || window.screenX ;
					var screenY = window.screenY = e.pageY || window.screenY ;
					var top = $(document).scrollTop() ;
					
					if(screenX > mw){
						// trace('heyyyy -> right')
						// trace('screenX', e.screenX, ' mw >>', mw, ' fw ::>>', w)
						li.addClass('slidenext')
						li.removeClass('slideprev')

						if(res.index == 0){
							if(screenY > mh){
								li.addClass('slidedown') ;
								li.removeClass('slideprev slidenext') ;
							} else{
								li.removeClass('slidedown') ;
								// li.removeClass('slideprev slidenext') ;
							}
						}

					}else{
						// trace('left <- heyyyy')
						li.addClass('slideprev')
						li.removeClass('slidenext')

						if(res.index == 0){
							if(screenY > mh){
								li.addClass('slidedown') ;
								li.removeClass('slideprev slidenext') ;
							} else{
								li.removeClass('slidedown') ;
								// li.removeClass('slideprev slidenext') ;
							}
						}
					}
				}
				
			}
			
			sl.clk = function(e){
				
				if( e.target.tagName == 'A'){
					
					return ;
				} else {
					
					var w = $(window).width() ;
					var h = $(window).height() ;
					
					var top = $(document).scrollTop() ;

					var mw = w >> 1 ;
					var mh = h >> 1 ;
					
					mh = mh + (mh >> 1) ;
					var screenX = window.screenX = e.pageX || window.screenX ;
					var screenY = window.screenY = e.pageY || window.screenY ;

					if(screenX > mw){ // ON RIGHT

						if(res.index == 0){ // HOME Case
							
							if(screenY > mh){ // ON DOWNCLICK
								
								// 
								BetweenJS.create({
									target:document.documentElement,
									to:{'scrollTop':555},
									time:.5,
									ease:Expo.easeOut
								}).play() ;
								
							} else{
								
								sl.halt() ;
								sl.cy.next() ;

							}

						}else{ // OTHER Cases

							sl.halt() ;
							sl.cy.next() ;

						}


						
					}else{ // ON LEFT
						
						if(res.index == 0){ // HOME Case
							
							if(screenY > mh){ // ON DOWNCLICK
							
								//
								// $(document).scrollTop(150) ;
								BetweenJS.create({
									target:document.documentElement,
									to:{'scrollTop':555},
									time:.5,
									ease:Expo.easeOut
								}).play() ;

								
							} else{
								
								sl.halt() ;
								sl.cy.prev() ;
								
							}

						}else{ // OTHER Cases

							sl.halt() ;
							sl.cy.prev() ;

						}

					}
					
				}
				
			}

			sl.navgo = function(e){
				e.preventDefault() ;
				e.stopPropagation() ;
				
				var a = $(e.currentTarget) ;
				
				sl.halt() ;
				sl.cy.go(a.data('i')) ;
			}
			
			slides.each(function(i, el){
				
				var li = $(el) ;
				var a = $(slidesnav.get(i)) ;
				a.attr({'href': '#'}) ;
				a.data({'i': i}) ;
				li.data('navitem', a) ;

				// a.on('click', sl.navgo) ;
				
				
				
				sl.cy.push(new Command(null, function(el, i){
					var c = this ;
					var li = $(el) ;
					var a = li.data('navitem') ;
					
					sl.clear() ;

					li.css({
						'left':'0',
						'z-index':'2'
					}) ;
					

					sl.tw = BetweenJS.create({
						target:li,
						to:{
							'opacity':100
						},
						from:{
							'opacity':0
						},
						time:.45,
						ease:Expo.easeOut
					}) ;

					li.trigger('mousemove') ;
					
					/* IMPORTANT HACK FOR CSS-ANIM TO WORK PROPERLY */
					setTimeout(function(){
						li.addClass('inited') ;	
						slideshow.find('.flex-control-nav li').removeClass('active') ;
						a.parent().addClass('active') ;
					}, 15) ;
					/* END IMPORTANT */
					
					sl.tw.onComplete = function(){
						c.dispatchComplete() ;
					}

					sl.tw.play() ;
					
					return this ;

				}, el, i))
			})
			
			sl.clear = function(){
				
				slides.css({
					'z-index':'1',
					'left':'15000px',
					'opacity':'0'
				}).removeClass('inited') ;
				
				slideshow.find('.flex-control-nav li').removeClass('active') ;
			}

			sl.enable = function(cond){
			
				slides.each(function(i, el){
					var li = $(el) ;
					var a = li.data('navitem') ;
					
					if(cond){
						
						li.on('click', sl.clk) ;
						li.on('mousemove', sl.mm) ;
						
						a.on('click', sl.navgo) ;
					}else{
						
						li.off('click', sl.clk) ;
						li.off('mousemove', sl.mm) ;
						
						a.off('click', sl.navgo) ;
					}
					
				}) ;
				
			}
			

			
		
			sl.launch = function(){
				clearTimeout(sl.UID) ;
				sl.cy.next() ;
				
				sl.UID = setTimeout(sl.launch, TIME) ;
				
				sl.launched = true ;
			}

			
			sl.halt = function(){
				
				if(!!sl.tw) sl.tw.stop() ;
				
				sl.UID = clearTimeout(sl.UID) ;

				sl.launched = false ;
				
			}

		}
		
		sl = res.userData.slideshow ;
		// sl.launched = false ;
		
		
		if(cond){
			
			// trace('opening UID :', id) ;
			
			sl.clear() ;

			sl.enable(true) ;
			
			// cy.index = -1 ;
			
			if(sl.cy.index == -1 ) sl.launch() ;
			else{
				sl.cy.index -- ;
				sl.launch() ;
				// halt() ;
			}
			
		}else{
			
			// trace('closing UID :', id) ;
			
			sl.clear() ;
			
			sl.enable(false) ;
			
			sl.halt() ;
			
			
		}
		
		
	},
	////////////////////////// PARALLAX
	parallax : parallax = function(e){
		
		var res = Unique.instance.hierarchy.currentStep ;
		var id = res.id ;
		if(id== '@') return ;
		var pos = $(document).scrollTop() ;
		
		var node = $('#'+id+' .slideshow') ;
		
		if (node.length > 0) {
			
			var homeSHeight = node.height() ;
			var top = $(document).scrollTop() ;
			
			var hh = node.height() ;
			
			if ((top <= homeSHeight)) {
				node.css('top', parseInt(top * 0.55));
			}
			if ((top <= homeSHeight)) {
				node.css('opacity', (1 - (parseInt(top/node.height() * 10)/10)));
			}
		}
		
		
	},
	resetscrolls : resetscrolls = function(id){
		
		var node = $('#'+id+' .slideshow') ;
		$(document).scrollTop(0) ;
		$('.js-transition-intro').removeClass('none') ;
		if (node.length > 0) {
			node.css('top', 0) ;
			node.css('opacity', 1) ;
		}

	},
	////////////////////////// PATCHWORK
	patchwork : patchwork = function(e, cond){
		
		var res = e.target ;
		var id = res.id ;
		
		var rt = $('#'+id) ;
		var it = rt.find('.work-item') ;
		
		if(cond){
			
			it.each(function(i, el){
				var elem = $(el) ;
				var a = $(elem.find('a')) ;
				var href = a.attr('href') ;
				
				elem.data('click', function(e){
					e.preventDefault() ;
					e.stopPropagation() ;
					document.location = href ;
				}) ;
				
				elem.bind('click', elem.data('click')) ;
				
			})
			
			
		}else{
			it.each(function(i, el){
				var elem = $(el) ;
				elem.unbind('click', elem.data('click')) ;
			})
			
			
		}
		
		
	},
	
	slidrens:slidrens = function(e, cond){
		var res = e.target ;
		var id = res.id ;
		
		var rt = $('#' + id) ;

		var slidesol = rt.find('#slidrens') ;
		

		// return ;
		if(!slidesol.length) return ;
		
		var slides = slidesol.find('li') ;
		var first = $(slides.get(0)) ;
		
		if(!res.userData.hpintrocy){
			
			var commands = [] ;
			cy = res.userData.hpintrocy = new Cyclic(commands) ;
			
			res.userData.hpintroclk = function(e){
				
				e.preventDefault() ;
				e.stopPropagation() ;
				
				var tg = $(e.target) ;
				
				if(tg.hasClass('arrnext')){ // ON RIGHT
					cy.next() ;
				}else{ // ON LEFT
					cy.prev() ;
				}
				
			}
				
			
			
			
			slides.each(function(i, el){
				
				cy.push(new Command(null, function(el, i){
					var c = this ;
					var li = $(el) ;
					
					res.userData.hpintroclear() ;
					
					li.removeClass('none').css({'opacity':0}) ;
					
					var tw = res.userData.hpintrotw = BetweenJS.create({
						target:li,
						to:{
							'opacity':100
						},
						time:.25,
						ease:Expo.easeOut
					})

					tw.play() ;
					
					// return this ;
				}, el, i))
				
			})
			
		}
		
		cy = res.userData.hpintrocy ;
		
		var clear = res.userData.hpintroclear = res.userData.hpintroclear || function(reset){
			
			if(!!res.userData.hpintrotw && res.userData.hpintrotw.isPlaying){
				res.userData.hpintrotw.stop() ;
			}

			slides.css({
				'opacity':'0'
			}).addClass('none') ;
			
			if(reset){
				first.css({'opacity':1}).removeClass('none') ;
			}

		}
		
		var arrows = rt.find('.arr') ;
		
		var enable = res.userData.hpintroenable = res.userData.hpintroenable || function(cond){
			
			arrows.each(function(i, el){
				var arr = $(el) ;
				
				if(cond){
					
					arr.on('click', res.userData.hpintroclk) ;
					
				}else{
					
					arr.off('click', res.userData.hpintroclk) ;
					
				}
				
			}) ;
			
		}
		
		if(cond){
			
			enable(true) ;
			cy.index = 0 ;

		}else{
			
			clear(true) ;
			
			enable(false) ;
			
		}
		

	},
	threenoise:threenoise = function(e, cond){
		
		var canvasholder = $('#noisecanvas') ;

		if ( OKWEBGL ) {
			
			if(cond){

				if(!!canvasholder.length){
					canvasholder.css('backgroundImage', '') ;
					effects.noiseeffect.enable(true, canvasholder) ;	
				}

			}else{
				if(!!canvasholder.length){
					effects.noiseeffect.enable(false, canvasholder) ;	
				}

			}

		}


	},
	
	
	////////////////////////// MAIN FUNCTIONS FOCUS & TOGGLE
	

	



	////////////////////////// FOCUS
	products_focus : products_focus = function(e){
		var res = e.target ;
		var id = res.id ;
		
		var all 						= $('.all') ;
		var continent 					= $('.continent') ;
		
		var target_section = $('section.' + id) ;
				
		if(e.type == 'focusIn'){
			
			
			res.focusReady() ;
			
			smallslideshow(e, true) ;
			small3D(e, true) ;
			
		}else{
			
			small3D(e, false) ;
			smallslideshow(e, false) ;
			
			res.focusReady() ;
			
		}

	},
	
	////////////////////////// TOGGLE
	products_toggle : products_toggle = function(e){
	
		var res = e.target ;

		var noID 						= res.id == '' ;
		var id 							= noID ? res.parentStep.id : res.id ;
		var ind 						= noID ? res.parentStep.index : res.index ;
		
		
		var all 						= $('.all') ;
		var parent 						= $('.' + res.parentStep.id + '_section_container') ;
		var continent 					= $('.continent') ;
		
		var target_section = $('section.' + id) ;
		var patchwork = $('.' + res.parentStep.id + '_patchwork') ;
		var why = $('.' + res.parentStep.id + '_why') ;
		var certif = $('.' + res.parentStep.id + '_certif') ;

		if(res.opening){
			
			patchwork.addClass('none') ;
			why.addClass('none') ;
			// certif.removeClass('none') ;
			
			$('.global_' + res.parentStep.id + ' ol .navmenu_' + id).addClass('active')
			

			target_section.appendTo(parent) ;

			topofpage(e, true) ;

			res.ready() ;
			
		}else{
			

			topofpage(e, false) ;

			patchwork.removeClass('none') ;
			why.removeClass('none') ;
			// certif.addClass('none') ;
			
			$('.global_' + res.parentStep.id + ' ol .navmenu_' + id).removeClass('active')

			/* HACKY BUT WORTHY */
			resetscrolls(id) ;
			
			
			target_section.appendTo(continent) ;
			res.ready() ;
		
		}

	},
	
	////////////////////////// FOCUS
	focus : focus = function(e){
		var res = e.target ;
		var id = res.id ;
		
		var all 						= $('.all') ;
		var continent 			= $('.continent') ;
		
		var target_section 	= $('section.' + id) ;
				
		if(e.type == 'focusIn'){
			
			res.focusReady() ;
			
		}else{
			
			res.focusReady() ;

		}

	},
	
	////////////////////////// TOGGLE
	toggle : toggle = function(e){
	
		var res = e.target ;

		var noID 									= res.id == '' ;
		var id 										= noID ? res.parentStep.id : res.id ;
		var ind 									= noID ? res.parentStep.index : res.index ;
		
		id = id == '@' ? 'home' : id ;
		
		
		var all 									= $('.all') ;
		var continent 						= $('.continent') ;
		
		var target_section 				= $('section.' + id) ;
		
		if(res.opening){
			
			var target_navlinks 		= $('.sectionsnav li') ;
			var target_navlink 			= $('#global_' + id) ;
			
			if(res.parentStep.ancestor == res.parentStep){
				target_navlinks.removeClass('active') ;
				target_navlink.addClass('active') ;
			}
			
			target_section.appendTo(all) ;

			$(document).on('scroll', scroll) ;
			$(document).on('scroll', parallax) ;
			
			resetscrolls(id) ;

			slideshow(e, true) ;
			patchwork(e, true) ;

			threenoise(e, true) ;

			slidrens(e, true) ;


			languages(e, true) ;
			
			topofpage(e, true) ;

			navmenus(e, true) ;

			res.ready() ;
			
		}else{
			
			navmenus(e, false) ;

			topofpage(e, false) ;

			languages(e, false) ;

			slidrens(e, false) ;

			threenoise(e, false) ;

			patchwork(e, false) ;
			slideshow(e, false) ;
			



			$(document).off('scroll', scroll) ;
			$(document).off('scroll', parallax) ;
			

			target_section.appendTo(continent) ;
			res.ready() ;
		
		}

	}
}



