
var Box = Type.define({
    pkg:'::Box',
    constructor:Box = function Box(box){
        this.box = box ;
    },
    setup:function(x, y, w, h, col){
        this.x = x ;
        this.y = y ;
        this.w = w ;
        this.h = h ;
        this.col = col ;

        return this ;
    },
    draw:function(){
        
        this.box.css({
            width:this.w + 'px'
        }) ;

        return this ;

    }

})



var page ;
var boxes ;

var mainTW, backTW ;
var on, s, z ;

        
module.exports = {
    
    load:function(){
        
        on = true ;
        
        page = $('.examplepage') ;
        
        var max = 5 ;

        var arr = [] ;


        for(var i = 0 ; i < max ; i ++){

            var size = 80 ;
            var x = 0 ,
                y = size * i ,
                w = 500 ,
                h = size ;

            var color = '#333333' ;

            var div = $('<div>')
                .addClass('box')
                .css({
                    left:x,
                    top:y,
                    width:0,
                    height:h,
                    background:color
                })
                .appendTo(page) ;
            
            var box = new Box(div)
                .setup(x, y, w, h, color) ;

            var stw = BetweenJS.create({
                target:box,
                to:{
                    w:0
                },
                from:{
                    w:0
                },
                cuepoints:{
                    w:[1000]
                },
                time:.75,
                ease:Quad.easeInOut
                // ease:Physical.uniform(10, 60)
            }) ;
            
            

            var m = arr[arr.length] = BetweenJS.delay(stw , i * 0.05) ;

            m.onDraw = function(box){
                box.draw() ;
            }

            m.onDrawParams = [box] ;
            
        }
        
        var tw = BetweenJS.parallelTweens(arr) ;
        
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
    
		$('.box').remove() ;
        
    }

}