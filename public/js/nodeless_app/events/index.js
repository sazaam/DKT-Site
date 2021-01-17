


// EVENT HANDLING
;(function(){
	
	
	// ARROWS
	
	var Arrows = Type.define({
		pkg:'org.libspark.straw::Arrows',
		domain:Type.appdomain,
		statics:{
			keycodes:{
				'32':'space',
				'33':'pageup',
				'34':'pagedown',
				'35':'end',
				'36':'home',
				'37':'left',
				'38':'up',
				'39':'right',
				'40':'down',
				'45':'insert',
				'46':'delete',
				'8':'backspace',
				'13':'enter',
				'27':'escape',
			}
		},
		constructor:Arrows = function Arrows(){
			//
		},
		enable:function(closures){
			this.closures = closures ;
			
			return this ;
		},
		register:function(){
			
			var fff = this;
			
			$(document).bind('keydown', function(e){
				
				var keycodes 		= Arrows.keycodes,
					closures 		= fff.closures,
					keycode 		= e.keyCode,
					cl ;
				
				if(keycode 			in keycodes){
					if(!!(cl 		= closures[keycodes[keycode]])){
						cl.apply(ArrowsNavigator.instance, [e]) ;
					}
				}
				
			}) ;
			
			return this ;
		}
	})
	
	
	var ArrowsNavigator = Type.define({
		pkg:'org.libspark.straw::ArrowsNavigator',
		domain:Type.appdomain,
		constructor:ArrowsNavigator = function ArrowsNavigator(){
			ArrowsNavigator.instance = this.enable() ;
		},
		getCurrentStep:function(){
			return AddressHierarchy.instance.currentStep ;
		},
		getEligible:function(){
			
			var el = this.eligible || AddressHierarchy.instance.currentStep ;
			
			if(el.id == "") el = el.parentStep ;
			
			return (this.eligible = el) ;
		},
		selectNext:function(d){
			var s = this.getEligible() ;
			if(!s.parentStep) return s ;
			return s.parentStep.hasNext() ? s.parentStep.getNext() : s.parentStep.getChild(0) ;
		},
		selectPrev:function(d){
			var s = this.getEligible() ;
			if(!s.parentStep) return s ;
			return s.parentStep.hasPrev() ? s.parentStep.getPrev() : s.parentStep.getChild(s.parentStep.children.length - 1) ;
		},
		selectUp:function(d){
			var s = this.getEligible() ;
			return s.parentStep == Unique.instance ? s : s.parentStep || s ;
		},
		selectDown:function(d){
			var s = this.getEligible() ;
			return s.defaultStep || s.children[0] || s ;
		},
		elect:function(){
			var s = this.getEligible() ;

			if(s != this.getCurrentStep()) {
				AddressHierarchy.instance.changer.setStepValue(s) ;
			}
		},
		go:function(step, cur){
			if(step != cur)
				AddressHierarchy.instance.changer.setStepValue(step) ;
		},
		enable:function(){

			var a = this ;

			var closures = {
				'left':function(e){
					var st = a.getCurrentStep() ;
					var s = st.handleUp() ;
					this.go(s, st) ;
				},
				'up':function(e){
					var st = a.getCurrentStep() ;
					var s = st.handlePrev() ;
					this.go(s, st) ;
				},
				'right':function(e){
					var st = a.getCurrentStep() ;
					var s = st.handleDown() ;
					this.go(s, st) ;
				},
				'down':function(e){
					var st = a.getCurrentStep() ;
					var s = st.handleNext() ;
					this.go(s, st) ;
				}
			}
			
			new Arrows().enable(closures).register() ;
			
			return this ;
		}
		
	})
	
	// ArrowsNavigator.instance = new ArrowsNavigator() ;
	
	var halted = false ;
	
	var pauseBetween = function(){
		var AT = BetweenJS.$.AnimationTicker ;
		if(!!AT.started){
			if(!!AT.HALT) {
				halted = false ;
				AT.restoreSystem() ;
			} else{
				AT.haltSystem() ;
				halted = true ;
			}
		}
	}
	
	// SPACEBAR

	$(document).on('keydown', function(e){
		if(e.keyCode == 32){
			pauseBetween() ;
		}
	})
	
	 
	
	$(window).on('blur', function(e){
		var AT = BetweenJS.$.AnimationTicker ;
		if(!!AT.started && !halted) AT.haltSystem() ;
		// trace('blurred')
		
	})
	
	$(window).on('focus', function(e){
		var AT = BetweenJS.$.AnimationTicker ;
		if(!!AT.started && !halted) AT.restoreSystem() ;
		// trace('focused')
	})
	
	
	
	
	 /**/
	
	
})() ;