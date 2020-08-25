
require('../strawnode_modules/strawnode_modules/jquery-1.8.1.min.js') ;
require('../strawnode_modules/strawnode_modules/jquery.ba-hashchange.min.js') ;
require('../strawnode_modules/betweenjs.js') ;


// require('../events/index.js') ;

var focus ;
var toggle ;
var patchwork ;
var scroll ;
var slideshow ;
var lang ;
var langchange ;
var parallax ;

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
	slideshow : slideshow = function(e, cond){
		
		var res = e.target ;
		var id = res.id ;
		
		var rt = $('#'+id) ;
		var slideshow = rt.find('.slideshow') ;
		
		if(!slideshow.length) return ;
		
		var slides = rt.find('.slides li.bg-dark') ;
		
		var next = rt.find('.flex-direction-nav .flex-next') ;
		var prev = rt.find('.flex-direction-nav .flex-prev') ;
		var slidesnav = rt.find('.flex-control-nav li a') ;
		
		
		var commands = [] ;
		var cy = new Cyclic(commands) ;
		var currentEl = res.userData.currentEl ;
		var launched = false ;
		var TIME = 7000 ;
		
		
		var clear = function(){
			
			slides.css({
				'z-index':'1',
				'left':'-15000px',
				'opacity':'0'
			}).removeClass('inited') ;
			
			rt.find('.flex-control-nav li').removeClass('active') ;
		}
		
		clear() ;
		
		
		slides.each(function(i, el){
			
			var li = $(el) ;
			var a = $(slidesnav.get(i)) ;
			a.attr({'href': '#'}) ;
			li.data('navitem', a) ;
			
			// trace(a)
			a.bind('click', function(e){
				e.preventDefault() ;
				e.stopPropagation() ;
				halt() ;
				cy.go(i) ;
			}) ;
			
			
			cy.push(new Command(null, function(el){
				var c = this ;
				var li = $(el) ;
				var a = li.data('navitem') ;
				
				clear() ;
				
				li.css({
					'left':'0',
					'z-index':'2'
				}) ;
				
				var tw = res.userData.tw = BetweenJS.parallel(
					BetweenJS.create({
						target:li,
						to:{
							'opacity':100
						},
						from:{
							'opacity':0
						},
						time:1,
						ease:Circ.easeOut
					})
				)
				
				/* IMPORTANT HACK FOR CSS-ANIM TO WORK PROPERLY */
				setTimeout(function(){
					li.addClass('inited') ;	
					rt.find('.flex-control-nav li').removeClass('active') ;
					a.parent().addClass('active') ;
				}, 15)
				/* END IMPORTANT */
				
				
				currentEl = res.userData.currentEl = li ;
				
				tw.onComplete = function(){
					c.dispatchComplete() ;
				}
				tw.play() ;
				
				return this ;
			}, el))
		})
		
		var nn = function(e){
			e.preventDefault() ;
			e.stopPropagation() ;
			
			halt() ;
			
			if($(e.target).hasClass('flex-next')){
				cy.next() ;
			}else{
				cy.prev() ;
			}
			
		}
		
		var launch = function(){
			clearTimeout(res.userData.UID) ;
			cy.next() ;
			
			res.userData.UID = setTimeout(function(e){
				clearTimeout(res.userData.UID) ;
				launch() ;
			}, TIME) ;
			
			launched = true ;
		}
		
		var halt = function(){
			
			if(!!res.userData.tw) res.userData.tw.stop() ;
			
			res.userData.UID = clearTimeout(res.userData.UID) ;
			launched = res.userData.launched = false ;
		}
		
		next.click(nn) ;
		prev.click(nn) ;
		
		
		if(cond){
			
			trace('opening UID :', id) ;
			
			launch() ;
			
		}else{
			
			trace('closing UID :', id)
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
			var dif = hh - top ;
			
			if ((top <= homeSHeight)) {
				node.css('top', (top * 0.55));
			}
			if ((top <= homeSHeight)) {
				node.css('opacity', (1 - top/node.height() * 1));
			}
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
					trace(href)
					
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
	focus : focus = function(e){
		var res = e.target ;
		var id = res.id ;
		
		var all 						= $('.all') ;
		var continent 					= $('.continent') ;
		
		var target_section = $('section.' + id) ;
		var inited = target_section ;
		
		if(e.type == 'focusIn'){
			
			target_section.appendTo(all) ;
			
			
			scrollEv('scroll', scroll, true) ;
			scrollEv('scroll', parallax, true) ;
			
			slideshow(e, true) ;
			patchwork(e, true) ;
			languages(e, true) ;
			
			res.focusReady() ;
			
			
			
		}else{
			
			languages(e, false) ;
			patchwork(e, false) ;
			slideshow(e, false) ;
			
			scrollEv('scroll', parallax, false) ;
			scrollEv('scroll', scroll, false) ;
			
			target_section.appendTo(continent) ;
			
			res.focusReady() ;
			
		}

	},
	
	////////////////////////// TOGGLE
	toggle : toggle = function(e){
	
		// var DOMSections = $('#globalnav').children().toArray() ;
		// var ll = DOMSections.length ;
		
		
		// for(var i = 0 ; i < ll ; i++){
			// var DOMsection = $(DOMSections[i]) ;
			
			
		// }
	
		var res = e.target ;

		var noID 						= res.id == '' ;
		var id 							= noID ? res.parentStep.id : res.id ;
		var ind 						= noID ? res.parentStep.index : res.index ;
		
		id = id == '@' ? 'home' : id ;
		
		
		
		
		var target_section = $('section.' + id) ;
		
		if(res.opening){
			
			trace('TOGGLE IN')
			trace('opening section > ', id) ;
			
			// target_section.appendTo(all)
			
			res.ready() ;
			
		}else{
		
			trace('closing section > ', id) ;
			
			// target_section.appendTo(continent)
			
			res.ready() ;
		
		}

	}
}



