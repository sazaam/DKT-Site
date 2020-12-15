
require('../strawnode_modules/strawnode_modules/jquery-1.8.1.min.js') ;
require('../strawnode_modules/strawnode_modules/jquery.ba-hashchange.min.js') ;
require('../strawnode_modules/betweenjs.js') ;


// require('../events/index.js') ;

var focus ;
var toggle ;
var patchwork ;
var scroll ;
var scrollEv ;
var slideshow ;
var smallslideshow ;

var langchange ;
var parallax ;
var resetscrolls ;

window.lang = $('html').attr('lang') ;

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
		}else{
			$('.navbar').removeClass('overnav') ; 
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
				
				trace(screenX)

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
				'left':'-15000px',
				'opacity':'0'
			}).removeClass('inited') ;
			
		}
		
		
		
		var enable = res.userData.enable = res.userData.enable || function(cond){
			
			slides.each(function(i, el){
				var li = $(el) ;
				
				if(cond){
					
					li.click(res.userData.clk) ;
					li.mousemove(res.userData.mm) ;
					
				}else{
					
					li.off('click', clk) ;
					li.off('mousemove', mm) ;
					
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
		
		var slides = rt.find('.slides li.bg-dark') ;
		
		// var next = rt.find('.flex-direction-nav .flex-next').removeAttr('href') ;
		// var prev = rt.find('.flex-direction-nav .flex-prev').removeAttr('href') ;
		var slidesnav = rt.find('.flex-control-nav li a') ;
		
		var launched = false ;
		
		var cy ;
		
		
		if(!res.userData.cy){
			
			var commands = [] ;
			cy = res.userData.cy = new Cyclic(commands) ;
			var TIME = 7000 ;
			
			
			
			
			var mm = res.userData.mm = function(e){
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
			
			var clk = res.userData.clk = function(e){
				
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
								
								halt() ;
								cy.next() ;

							}

						}else{ // OTHER Cases

							halt() ;
							cy.next() ;

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
								
								halt() ;
								cy.prev() ;
								
							}

						}else{ // OTHER Cases

							halt() ;
							cy.prev() ;

						}

					}
					
				}
				
			}
			var navgo = res.userData.navgo = function(e){
				e.preventDefault() ;
				e.stopPropagation() ;
				
				var a = $(e.currentTarget) ;
				halt() ;
				
				cy.go(a.data('i')) ;
			}
			
			slides.each(function(i, el){
				
				var li = $(el) ;
				var a = $(slidesnav.get(i)) ;
				a.attr({'href': '#'}) ;
				a.data({'i': i}) ;
				li.data('navitem', a) ;
				
				a.bind('click', navgo) ;
				
				
				
				cy.push(new Command(null, function(el, i){
					var c = this ;
					var li = $(el) ;
					var a = li.data('navitem') ;
					
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
					
					/* IMPORTANT HACK FOR CSS-ANIM TO WORK PROPERLY */
					setTimeout(function(){
						li.addClass('inited') ;	
						rt.find('.flex-control-nav li').removeClass('active') ;
						a.parent().addClass('active') ;
					}, 15)
					/* END IMPORTANT */
					
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
				
			slides.css({
				'z-index':'1',
				'left':'-15000px',
				'opacity':'0'
			}).removeClass('inited') ;
			
			rt.find('.flex-control-nav li').removeClass('active') ;
		}
		
		
		
		var enable = res.userData.enable = res.userData.enable || function(cond){
			
			slides.each(function(i, el){
				var li = $(el) ;
				var a = li.data('navitem') ;
				
				if(cond){
					
					li.on('click', res.userData.clk) ;
					li.on('mousemove', res.userData.mm) ;
					
					a.on('click', res.userData.navgo) ;
				}else{
					
					li.off('click', clk) ;
					li.off('mousemove', mm) ;
					
					a.off('click', navgo) ;
				}
				
			}) ;
			
		}
		
		var launch = res.userData.launch = res.userData.launch || function(){
			clearTimeout(res.userData.UID) ;
			cy.next() ;
			
			res.userData.UID = setTimeout(function(e){
				clearTimeout(res.userData.UID) ;
				launch() ;
			}, TIME) ;
			
			launched = true ;
		}
		
		var halt = res.userData.halt = res.userData.halt || function(){
			
			if(!!res.userData.tw) res.userData.tw.stop() ;
			
			res.userData.UID = clearTimeout(res.userData.UID) ;
			launched = res.userData.launched = false ;
		}
		
		// next.click(nn) ;
		// prev.click(nn) ;
		
		
		if(cond){
			
			// trace('opening UID :', id) ;
			
			clear() ;

			enable(true) ;
			
			// cy.index = -1 ;
			
			if(cy.index == -1 ) launch() ;
			else{
				cy.index -- ;
				launch() ;
				// halt() ;
			}
			
		}else{
			
			// trace('closing UID :', id) ;
			
			clear() ;
			
			enable(false) ;
			
			halt() ;
			
			
		}
		
		
	},
	////////////////////////// PARALLAX
	parallax : parallax = function(e){
		
		var res = Unique.instance.hierarchy.currentStep ;
		var id = res.id ;
		
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
					document.location = '/#' + href ;
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
	
	
	
	
	////////////////////////// MAIN FUNCTIONS FOCUS & TOGGLE
	

	



	////////////////////////// FOCUS
	products_focus : focus = function(e){
		var res = e.target ;
		var id = res.id ;
		
		var all 						= $('.all') ;
		var continent 					= $('.continent') ;
		
		var target_section = $('section.' + id) ;
				
		if(e.type == 'focusIn'){
			
			
			res.focusReady() ;
			
			smallslideshow(e, true) ;
			
			
		}else{
			
			smallslideshow(e, false) ;
			
			res.focusReady() ;
			
		}

	},
	
	////////////////////////// TOGGLE
	products_toggle : toggle = function(e){
	
		var res = e.target ;

		var noID 						= res.id == '' ;
		var id 							= noID ? res.parentStep.id : res.id ;
		var ind 						= noID ? res.parentStep.index : res.index ;
		
		
		var all 						= $('.all') ;
		var parent 						= $('.' + res.parentStep.id + '_section_container') ;
		var continent 					= $('.continent') ;
		
		var target_section = $('section.' + id) ;
		var patchwork = $('.' + res.parentStep.id + '_patchwork') ;
		var credits = $('.' + res.parentStep.id + '_credits') ;
		var certif = $('.' + res.parentStep.id + '_certif') ;

		if(res.opening){
			
			patchwork.addClass('none') ;
			credits.addClass('none') ;
			certif.removeClass('none') ;

			target_section.appendTo(parent) ;
			res.ready() ;
			
		}else{
			
			patchwork.removeClass('none') ;
			credits.removeClass('none') ;
			certif.addClass('none') ;

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
			languages(e, true) ;
			
			res.ready() ;
			
		}else{
			

			languages(e, false) ;
			patchwork(e, false) ;
			slideshow(e, false) ;
			
			$(document).off('scroll', scroll) ;
			$(document).off('scroll', parallax) ;
			

			target_section.appendTo(continent) ;
			res.ready() ;
		
		}

	}
}



