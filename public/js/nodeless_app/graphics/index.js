
require('../strawnode_modules/strawnode_modules/jquery-1.8.1.min.js') ;
require('../strawnode_modules/strawnode_modules/jquery.ba-hashchange.min.js') ;





// require('../customs/custom.js') ;


require('../strawnode_modules/betweenjs.js') ;


// require('../events/index.js') ;




var focus ;
var toggle ;
var scroll ;
var slide ;
var parallax ;

module.exports = {

	
	scroll : scroll = function(e){
		
		var pos = $(document).scrollTop() ;
		
		if(pos > 0){
			$('.navbar').addClass('overnav') ; 
		}else{
			$('.navbar').removeClass('overnav') ; 
		}
		
		
	},
	slide : slide = function(e, cond){
		
		var res = e.target ;
		var id = res.id ;
		
		var commands = [] ;
		
		var currentEl ;
		
		var cy = new Cyclic(commands) ;
		var rt = $('#'+id)
		var slides = rt.find('.slides li.bg-dark') ;
		
		var next = rt.find('.flex-direction-nav .flex-next') ;
		var prev = rt.find('.flex-direction-nav .flex-prev') ;
		var nav = rt.find('.flex-control-nav li a') ;
		
		slides.each(function(i, el){
			
			var a = $(nav.get(i)) ;
			a.attr({'href': '#'}) ;
			trace(a)
			a.bind('click', function(e){
				e.preventDefault() ;
				e.stopPropagation() ;
				trace('yoooo', i)
				halt() ;
				cy.go(i) ;
			}) ;
			cy.push(new Command(null, function(el){
				var c = this ;
				if(!!currentEl){
					currentEl.css({'z-index':'1'}) ;
					currentEl.css({'left':'-15000px'}) ;
					currentEl.css({'opacity':'0'}) ;
					currentEl.removeClass('inited') ;
					
				}
				el.css({'left':'0'}) ;
				el.css({'z-index':'2'}) ;
				el.addClass('inited') ;
				
				
				var tw = BetweenJS.create({
					target:el,
					to:{
						'opacity':100
					},
					from:{
						'opacity':0
					},
					time:1,
					ease:Expo.easeOut
				})
				
				currentEl = el ;
				
				tw.onComplete = function(){
					
					c.dispatchComplete() ;
				}
				tw.play() ;
				
				return this ;
			}, $(el)))
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
			cy.next() ;
			res.userData.UID = setTimeout(function(e){
				
				launch() ;
				
			}, 10000) ;
			
		}
		
		var halt = function(){
			
			res.userData.UID = clearTimeout(res.userData.UID) ;
			
		}
		
		next.click(nn) ;
		prev.click(nn) ;
		
		// cy.looping = false ;
		
		if(cond){
			
			launch() ;
			
			
		}else{
			trace('no', id)
			
			
			
			
		}
		
		
	},
	parallax : parallax = function(e){
		
		var res = Unique.instance.hierarchy.currentStep ;
		var id = res.id ;
		
		var pos = $(document).scrollTop() ;
		
		var node = $('#'+id+' .hero-slider') ;
		
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
	focus : focus = function(e){
		var res = e.target ;
		var id = res.id ;
		
		
		var target_section = $('section.' + id) ;
		var inited = target_section ;
		
		if(e.type == 'focusIn'){
			
			
			$(document).scroll(scroll) ;
			$(document).scroll(parallax) ;
			
			
			
			
			slide(e, true) ;
			
			
		}else{
			
			slide(e, false) ;
			
			
			
			$(document).off('scroll', parallax) ;
			$(document).off('scroll', scroll) ;
			
			res.focusReady() ;
			
		}

	},
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
		
		
		
		var all 						= $('.all') ;
		var continent 					= $('.continent') ;
		
		var target_section = $('section.' + id) ;
		
		if(res.opening){
			
			trace('opening section > ', id) ;
			
			target_section.appendTo(all)
			
			res.ready() ;
			
		}else{
		
			trace('closing section > ', id) ;
			
			target_section.appendTo(continent)
			
			res.ready() ;
		
		}

	}
}



