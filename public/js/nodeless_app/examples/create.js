
var press ;
var page ;

var boxes ;
var p ;
var mainTW, backTW ;
var on, s, z ;

module.exports = {
	
	load:function(){
    
    on = true ;

		page = $('.examplepage') ;

    var max = 5 ;
    var arr = [] ;
		
    for(var i = 0 ; i < max ; i ++){
      var div = $('<div>')
        .addClass('box')
        .css({width:0, height:80, background:'#FFF'})
        .appendTo(page) ;

      var stw = BetweenJS.create({
        target:div,
        to:{
						width:0,
						background:{
              r:21,
              g:186,
              b:230
            }
        },
        from:{
					width:0,
          background:{
            r:17,
            g:17,
            b:17
          }
				},
        cuepoints:{
					width:[1000]
				},
				time:.75,
				ease:Quad.easeInOut
				// ease:Physical.uniform(10)
      }) ;


      arr[arr.length] = BetweenJS.delay(stw , i * 0.05)
  
		}
		
		boxes = $('.box') ;
	
    p = $('<p>')
      .addClass('boxtitle')
      .css({width:'500px', color:'#010101'}).text('BETWEENJS') ;
		
		var colorFrom = {
			r:17,
			g:17,
			b:17
		}
		var colorTo = {
			r:21,
			g:186,
			b:230
		}

    var tw = BetweenJS.serial(
			BetweenJS.create({
        actions:{
          addChild:{
            target:p,
            parent:page
          }
        }
      }),
      BetweenJS.create({
        target:p,
				to:{
					color:colorTo
        },
				from:{
					color:colorFrom
				},
				time:.45,
				ease:Expo.easeIn
      }),
      BetweenJS.parallelTweens(arr),
      BetweenJS.create({
        actions:{
          timeout:{
            duration:0,
            useRollback:true,
            closure:function(msg){
							// trace(msg) ;
            },
            rollbackClosure:function(msg){
							// trace(msg) ;
            },
            params:['TIMEOUT ACTIONNED'],
            rollbackParams:['TIMEOUT ROLLED BACK']
          }
        }
      }),
      BetweenJS.create({
        target:p,
				to:{
					color:colorFrom
        },
				from:{
					color:colorTo
        },
				time:.45,
				ease:Expo.easeOut
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
    
		p.remove() ;
		boxes.remove() ;
		
	}
	
}