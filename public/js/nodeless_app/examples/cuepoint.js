
var press ;
var page ;
var box ;

var mainTW, backTW ;
var on, s, z ;

module.exports = {
	
	load:function(){
		
        on = true ;

		page = $('.examplepage') ;


		var golden = (function(){		
		
			var GOLD = 1.61803 ;
			
			return function(n){
				var r = n / GOLD ;
				return {r : r, l : n - r } ;
			} ;
			
		})() ;
		
		
		var width = page.width() ;
		var height = page.height() ;
		var mw = width >> 1 ;
		var mh = height >> 1 ;
		
		
		var colorTo = '#15BAE6' ;
		var colorMiddle = '#5b3eff' ;
		var colorFrom = {
			r:17,
			g:17,
			b:17
		}
		
		
		
	
		var div = box = $('<div id="saz">')
			.addClass('box rel')
			.css( {'top':(mh), 'width':0, 'height':0,'background':colorTo} ).appendTo(page) ;
		
		
		
		var TIME = 1 ;
		
		var t_0 = golden(TIME) ;
		
		var time_1 = t_0.r ;
		var time_2 = t_0.l ;
		
		var tw = BJS.serial(
			BJS.create({
				target:div,
				to:{
					'height':2,
					'width':width - 200,
					'left':0 + 100,
					'background': colorTo
				},
				cuepoints:{
					'width':[600],
					'left':[-50],
					'margin-top':[-9],
					'height':[0],
					'background':[colorMiddle]
				},
				from:{
					'height':2,
					'width':0,
					'left':(mw),
					'background':colorFrom
				},
				time:time_2,
				ease:Linear.easeOut
			}),
			BJS.create({
				target:div,
				to:{
					'height':height,
					'width':width,
					'top':0,
					'left':0,
					'background': colorFrom
				},
				from:{
					'height':2,
					'top':mh,
					'width':width - 100,
					'left':50,
					'background':colorTo
				},
				time:time_1,
				ease:Quad.easeInOut
			})
		) ;	
		
		
		backTW = BetweenJS.reverse(tw) ;
		mainTW = BetweenJS.reverse(backTW) ;
		
		
	},
	run:function(){
    
		var pos = 0 ;
	
		if(on){
		  s = mainTW ;
		}else{
		  s = backTW ;
		}
	
		if(!!z){
			  
		  if(z.isPlaying){
			pos = z.time - z.position ;
			z.stop() ;
		  }
		
		}
	  
		s.seek(pos) ;
		s.play() ;
		
		z = s ;
		on = !on ;
		
		
	},
	unload:function(){
		
		mainTW.stop()//.destroy() ;
		backTW.stop()//.destroy() ;
		
		box.remove() ;
		
	}
	
}