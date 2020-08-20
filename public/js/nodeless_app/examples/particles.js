

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


var mainTW, backTW ;
var on, s, z ;

var page ;



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
        
        var X = 0 ;
        var Y = 0 ;
        
        
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
            
            var rX = Math.random() * (X + 100) ;
            var rY = Math.random() * (Y + 100) ;
            
            var Z = 100 ;
            var Zz = [(Math.random() * (Math.random() * 50) + 50) * (size / 100), (Math.random() * (Math.random() * 50) + 50) * (size / 100)] ;

            var tp = 
            BetweenJS.delay(
                BetweenJS.bezierTo(div, 
                {

                    'width' : Z * (size / 100) ,
                    'height' : Z * (size / 100) ,
                    'left':ww ,
                    'top': hh
                    ,
                    'background':'#222222'
                },
                {
                    'width' : [1.2 * (size / 100), 1.2 * (size / 100)] ,
                    'height' :[1.2 * (size / 100), 1.2 * (size / 100)] ,
                    'left':[ mvw + rY, mvw , mvw +  -rY],
                    'top':[ mvh + rX,  mvh ,  mvh + -rX]
                },
                .5,
                Expo.easeInOut
                // NaN,
                // Physical.uniform(10)
                )
            , .0095 * ind) ;
            
            arr[i] = tp ;
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
