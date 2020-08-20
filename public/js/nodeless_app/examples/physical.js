

var shuffle = function(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}



var rand = function rand(n, rd){
	return n -(rd >> 1) + (Math.random() * rd) ;
}

var shuffle = function(a){
	var arr = a ;
	var cur = arr.length,
	rand,
	temp ;

	while(0 !==cur){
		rand = Math.floor(Math.random() * cur) ;
		cur -- ;

		temp = arr[cur] ;
		arr[cur] = arr[rand] ;
		arr[rand] = temp ;
	}
	return a = arr ;
}

var mainTW, backTW ;
var on, s, z ;

var page ;
var TIME = 1.5 ;


module.exports = {
    load:function(){
        
        on = true ;

		page = $('.examplepage').addClass('rel') ;
        
        var min = 0 ;
        var max = 30 ;
        var arr = [] ;
        
        var color = {
			r:21,
			g:186,
			b:230
		} ;
        var color1 = {
            r:17,
            g:17,
            b:17
        } ;
        
        var vw = 500 ;
		var vh = 400 ;
		var mvw = vw >> 1;
		var mvh = vh >> 1;
		var size = 40 ;
        
        var X = mvw ;
        var Y = mvh ;
        
        
        var vw2 = mvw + (mvw >> 1) ;
        var vh2 = mvh + (mvh >> 1) ;
        var mvw2 = vw2 >> 1;
        var mvh2 = vh2 >> 1;
        
        var n = Math.floor(max / 5) ;
        var m = Math.floor(max / n) ;


        for(var i = min ; i < max ; i++){
            
            var ww = -mvw + (Math.random() * vw) ;
            var hh = -mvh + (Math.random() * vh) ;

            var indX = Math.floor(i % n) ;
            var indY = Math.floor(i / n) ;
            
            var ww = mvw + (( indX * size ) - (size * n/2)) ;
            var hh = mvw + (( indY * size ) - (size * n/2)) ;

            var x = ww ;
            var y = hh ;
            var z = 500 ;
            
            var div = $('<div>')
                .addClass('particle').addClass('abs')
                .css({left:ww, top:hh, width:2, height:2, backgroundColor:'#15BAE6'})
                .appendTo(page) ;
            
            
            
            var randX = mvw2 - (Math.random() * vw2) ;
            var randY = mvh2 - (Math.random() * vh2) ;
            
            
            var ind = Math.floor(max/2) ;
            if(i > ind) {
                ind = ind - (ind - (i - ind)) ;
            }else ind =  ind - i ;
            
            var rX = (X - 50) + (Math.random() * (X + 100)) ;
            var rY = (Y - 50) + (Math.random() * (Y + 100)) ;
            
            var Z = 100 ;
            var Zz = [(Math.random() * (Math.random() * 50) + 50) * (size / 100), (Math.random() * (Math.random() * 50) + 50) * (size / 100)] ;
				
			
			var tp = BetweenJS.serial(
	            BetweenJS.delay(
	                BetweenJS.create({
						target:div, 
		                to:{

		                    'width' : 2 ,
		                    'height' : 2 ,
		                    'left':x = rand(rX, 50) ,
		                    'top':y = rand(rY, 50)
		                    ,
		                    'background':'#15BAE6'
		                },
		                cuepoints:{
		                    
		                    'left':[ mvw + rY, mvw +  -rY],
		                    'top':[ mvh + rX, mvh + -rX]
						},
						from:{

		                    'width' : 2 ,
		                    'height' : 2 ,
		                    'left':ww ,
		                    'top': hh
		                    ,
		                    'background':'#15BAE6'
		                },
		                ease:Physical.exponential(.5)
					})
	            , .0095 * ind),
				
	        	BetweenJS.delay(
	                BetweenJS.create({
						target:div, 
	                	to:{

		                    'width' : size ,
		                    'height' : Z * (size / 100) ,
		                    'left':ww ,
		                    'top': hh
		                    ,
		                    'background':'#222222'
		                },
		                cuepoints:{
		                    'width':[2,2,2,2],
		                    'height':[2,2,2,2],
		                    'left':[ mvw + rY, mvw + -rY],
		                    'top':[ mvh + rX, mvh + -rX]
						},
						from:{
		                    'width' : 2 ,
		                    'height' : 2 ,
		                    'left':x,
		                    'top':y
		                    ,
		                    'background':'#15BAE6'
		                },
		                ease:Physical.exponential(.5)
					})
	            , .0095 * ind)
				
			) ;
			
			 
            arr[i] = BetweenJS.reverse(tp) ;
            // arr[i] = tp ;
        }
		
		// arr = shuffle(arr) ;
		
		
        var tw = BetweenJS.parallelTweens(arr) ;
		backTW = BetweenJS.reverse(tw) ;
		mainTW = BetweenJS.reverse(backTW) ;
		
        
    },
    run:function(e){
        
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
		s.onComplete = function(){
			trace('complete')
			
		}
		z = s ;
		on = !on ;
    },
    unload:function(){
        

        on = true ;

		mainTW.stop()//.destroy() ;
		backTW.stop()//.destroy() ;
        
        page.removeClass('rel') ;

        $('.particle').remove() ;
        
    }

}
