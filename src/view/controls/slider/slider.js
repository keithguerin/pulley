/*****
Class: Pulley.view.controls.Slider
Extends: Pulley.View, Pulley.Controller
Notes: 
*****/

registerNamespace('Pulley.view.controls');

Pulley.view.controls.Slider = function(){
	
	//IMPORT
	//var SliderModel = company.project.model.valueobjects.SliderModel;
	
	//var myPrivateVar = null;//Call without 'this'. Does not work since it can only access the prototype and not the instance.
	//this.myPublicVar = null;//Call with 'this'.
	
	//function myPrivateMethod(){};//Call via myPrivateMethod(). Does not work since it can only access the prototype and not the instance.
	//this.myPublicMethod = function(){};//Must be public to override. Call via this.myPublicMethod().
	
	this.init = function(){//(arguments):void (Arguments are different, whether using Angular or Pulley)
		
		//SETTINGS
		this.settings_default = {
			rotationDuration: null//Milliseconds. If 'null', then it doesn't rotate.
		}
		
		if(this.initializedByAngular){
			this._super.call(this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
		}else{//Using Pulley patterns
			var view_temp = arguments[0];
			var model_temp = arguments[1];
			var settings_temp = arguments[2];
			var onComplete = arguments[3];
			this._super(view_temp, model_temp, settings_temp);//Don't pass through onComplete.
		}
		
		//MODEL
		//this.model.valueA = null;
		
		//VIEW
		this.children.nav				= this.$('>nav')[0];
		this.children.previousButton	= this.$('.previous-button')[0];
		this.children.nextButton		= this.$('.next-button')[0];
		this.children.paginator			= null; //Defined on ready.
		this.children.slidesContainer	= this.$('.slides')[0];
		
		//CONTROLLER
		this.timer = null;//Timer integer
		this.userHasInteracted = false;//If true, the auto-rotation stops.
		
		this.slides = this.$('.slide').toArray(); //Array of .slide elements
		this.currentSlide = this.slides[0]; //.slide element
		this.currentIndex = 0;
		
		//INIT CHILDREN
		if(this.slides.length > 1){
			//Hide all slides but the first one. (Should already have been done by CSS.)
			var allSlidesExceptTheFirstOne = this.slides.slice(1);
			$(allSlidesExceptTheFirstOne).css({display:'none', opacity:0});
		}
		
		//INIT INTERACTION
		//
		
		if(onComplete) onComplete();
	}
	
	
	//EXTEND View as desired
	/*this.destroy = function(){
		this._super();//Don't pass through onComplete.
		
		//destroy CHILDREN
		//
		
		//destroy INTERACTION
		//
	}*/
	this.ready = function(onComplete){//(function):void
		var _this = this;
		
		//DEFINE CHILDREN (before calling super)
		//this.children.navBar			= window._views['NavBarVC0'];//Locate the auto-initialized controller.
		var paginatorClip				= this.$('.Paginator')[0];
		this.children.paginator			= c(paginatorClip.id);
		
		this._super();//Call after children are defined.
		
		//READY CHILDREN
		var paginatorModel = [];
		for(var i in this.slides){
			var slideModel = {
				label: i,
				href: '#'
			}
			paginatorModel.push(slideModel);
		}
		this.children.paginator.setModel(paginatorModel);
		
		//INIT INTERACTION
		$(this.children.previousButton).bind('click', function(){
			_this.userHasInteracted = true;
			_this.stopTimer();
			_this.goToPreviousSlide(true, true);
		});
		$(this.children.nextButton).click('click', function(){
			_this.userHasInteracted = true;
			_this.stopTimer();
			_this.goToNextSlide(true);
		});
		this.children.paginator.addEventListener(Pulley.view.controls.PaginatorVC.ITEM_CLICKED, this, function(event){
			_this.userHasInteracted = true;
			_this.stopTimer();
			var index = _this.children.paginator.selectedIndex;
			if(index != _this.currentIndex){
				var reverse = (index < this.currentIndex);
				_this.goToSlideByIndex(index, true, reverse);
			}
		});
		
		//SET INITIAL STATE
		//this.setState(0, null, false);//(state:State or Number, stateModel:Pulley.view.State, useTransition:Boolean):void
		//Auto-enable/disable the carousel controls.
		
		this.goToSlideByIndex(0);
		
		if(this.slides.length > 1){
			$(this.children.nav).show();
			if(this.settings.rotationDuration){//Begin automatic rotation if enabled.
				this.timer = setTimeout(function(){
					_this.goToNextSlide(false);
				}, this.settings.rotationDuration);
			}
		}else{
			$(this.children.nav).hide();
			this.stopTimer();
		}
		
		if(onComplete) onComplete();
	}
	/*this.reset = function(resetModel){//(Boolean):void
		this._super(resetModel);
	}*/
	/*this.focus = function(){//():void
		this._super();
	}*/
	/*this.setModel = function(model){//(SliderModel):void
		//this._super(model);//Override
		var hasModelChanged = (model != this.model);
		if(hasModelChanged){
			this.model = model;
			//BIND TO MODEL
			if(this.model){
				var isBound = this.model.hasEventListener(ModelController.CHANGED, this.model_onChanged);
				if(!isBound){
					this.model.addEventListener(ModelController.LOADED, this, this.model_onLoaded);
					this.model.addEventListener(ModelController.CHANGED, this, this.model_onChanged);
					//this.model.addEventListener(ModelController.SAVED, this, this.model_onSaved);
					//this.model.addEventListener(ModelController.DELETED, this, this.model_onDeleted);
				}
			}
			
			//DELETE OLD ELEMENTS
			//
			
			//CREATE BLANK NEW ELEMENTS and add listeners. Do not render model yet.
			//
			
			//SET MODEL TO CHILDREN
			//
		}
		
		//APPLY MODEL TO ELEMENTS
		this.render();
		
		if(hasModelChanged){
			//goto();
		}
	}*/
	/*this.render = function(){//(void):void
		this._super();
		
		//APPLY MODEL TO EXISTING ELEMENTS
	}*/
	/*this.setSize = function(w, h){//(int, int):void{
		this._super(w, h);
	}*/
	/*this.model_onLoaded = function(event, data){
		this.setModel(this.model);
	}
	this.model_onChanged = function(event, data){
		this.render();
	}*/
	/*this.model_onSaved = function(event, data){
		this.setModel(this.model);
	}
	this.model_onDeleted = function(event, data){
		this.render();
	}*/
	
	
	//STATE IMPLEMENTATIONS
	/*this.setState = function(stateArg, stateModel, useTransition, onComplete){//(State or Number, Boolean, Function):void
		this._super(stateArg, stateModel, useTransition, onComplete);
	}*/
	/*this.setState_stateId = function(useTransition, stateModel, reverse, onComplete){//(Boolean, Boolean, Function):void
		var _this = this;
		var lockId = 'Slider.setState_stateId '+Math.random();
		//__app.lock(lockId);
		
		//Hide all non-relevant siblings, to be sure they are gone.
		//$(this.children.child).css({opacity:0}).hide();
		
		//Apply model
		//
		
		if(!useTransition){
			//Show and hide relevant elements.
			done();
		}else{
			if(reverse){
				//Run transitions
				done();
			}else{
				//Run transitions
				done();
			}
		}
		function done(){
			//Set substates.
			//__app.unlock(lockId);
			if(onComplete) onComplete();
		}
	}
	*/
	
	
	this.stopTimer = function(){
		if(this.timer){
			clearTimeout(this.timer);
		}
	}
	
	this.goToPreviousSlide = function(animate){
		this.goToNextSlide(animate, true);
	}
	
	this.goToNextSlide = function(animate, reverse){
		var _this = this;
		
		var maxIndex = this.slides.length - 1;
		var newIndex = null;
		if(reverse){
			if((!this.currentIndex && this.currentIndex != 0) || this.currentIndex == 0){
				newIndex = maxIndex;
			}else{
				newIndex = this.currentIndex - 1;
			}
		}else{
			if((!this.currentIndex && this.currentIndex != 0) || this.currentIndex == maxIndex){
				newIndex = 0;
			}else{
				newIndex = this.currentIndex + 1;
			}
		}
		this.goToSlideByIndex(newIndex, animate, reverse);
	}
	
	this.goToSlideByIndex = function(newIndex, animate, reverse){
		var _this = this;
		var fadeTime = 300;
		var xSlide = 20;
		if(reverse){
			xSlide *= -1;
		}
		$(this.slides).css({position:'relative'});
		
		this.$el.css({pointerEvents:'none'});//lock
		this.stopTimer();
		
		this.currentIndex = newIndex;
		this.children.paginator.selectItemByIndex(this.currentIndex);
		
		if(this.currentSlide){
			var oldSlide = this.currentSlide;
			if(!animate){
				$(oldSlide).css({display:'none', opacity:0, left:0});
			}else{
				$(oldSlide).transition({
					opacity: 0,
					left: -xSlide,
					duration: fadeTime-1,
					//easing: 'easeOutQuad',
				});
			}
		}
		
		this.currentSlide = this.slides[this.currentIndex];
		if(!animate){
			$(this.currentSlide).css({display:'block', opacity:1, left:0});
			done();
		}else{
			setTimeout(function(){
				$(oldSlide).css({display:'none'});	
				$(_this.currentSlide).css({display:'block', opacity:0, left:xSlide}).transition({
					opacity: 1,
					left: 0,
					duration: fadeTime,
					//easing: 'easeOutQuad',
					complete: done
				});
			}, fadeTime)
		}
		
		function done(){
			_this.$el.css({pointerEvents:'all'});//unlock
		}
		
		this.stopTimer();
		if(!this.userHasInteracted && this.settings.rotationDuration){
			this.timer = setTimeout(function(){
				if(!_this.userHasInteracted){
					_this.goToNextSlide(true);
				}
			}, this.settings.rotationDuration);
		}
		
	}
}


//EXTEND
Pulley.view.controls.Slider = Pulley.View.extend(new Pulley.view.controls.Slider());
Pulley.view.controls.Slider.type =
Pulley.view.controls.Slider.prototype.type = 'Pulley.view.controls.Slider';


//STATIC VARS
//Pulley.view.controls.staticVar = null;


//STATIC METHODS
//Pulley.view.controls.SliderstaticMethod = function(){};


/*****
End Class: Slider
*****/








