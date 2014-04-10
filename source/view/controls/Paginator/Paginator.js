/*****
Class: PaginatorVC
Extends: ViewController, Controller
Notes:
*****/

pulley.view.controls.PaginatorVC = function(){
	
	//IMPORT
	//var FooModel = company.project.model.valueobjects.FooModel;
	
	//var myPrivateVar = null;//Call without 'this'. Does not work since it can only access the prototype and not the instance.
	//this.myPublicVar = null;//Call with 'this'.
	
	//function myPrivateMethod(){};//Call via myPrivateMethod(). Does not work since it can only access the prototype and not the instance.
	//this.myPublicMethod = function(){};//Must be public to override. Call via this.myPublicMethod().
	
	this.init = function(){//(arguments):void (Arguments are different, whether using Angular or Pulley)
		
		if(this.initializedByAngular){
			this._super.call(this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
		}else{//Using pulley patterns
			var view = arguments[0];
			var model = arguments[1];
			var onComplete = arguments[2];
			this._super(view, model);//Don't pass through onComplete.
		}
		
		//SETTINGS
		//
		
		//ASSETS
		//
		
		//MODEL
		this.model = null;//Array of Objects with format [{label: String, onClick:Function}];
		
		//VIEW
		this.children.list				= this.$view.find('>ul')[0];
		this.children.items				= null;//Defined on setModel
		
		//CONTROLLER
		/*this.states = [
			new State({
				id:'state_prepareForTransitionIn',//String
				implementation: setState_0_prepareForTransitionIn//Function
			}),
			new State({
				id:'state_primary',
				implementation: setState_1_primary
			}),
			new State({
				id:'state_transitionedOut',
				implementation: setState_2_transitionedOut
			})
		];*/
		
		//INITIALIZE
		//
		
	}
	
	
	//OVERRIDE ViewController
	/*this.destroy = function(){//():void
		this._super();
	}*/
	this.ready = function(onComplete){//(function):void
		//DEFINE AND INIT CHILDREN (before calling super)
		//
		
		//READY CHILDREN
		this._super();
		
		//INIT INTERACTIVITY
		//
		
		//SET INITIAL STATE
		//this.setState(0);//Prepare for transition in.
		this.setSize();
		
		if(onComplete) onComplete();
	}
	/*this.reset = function(resetModel){//(Boolean):void
		this._super(resetModel);
	}*/
	this.setModel = function(model){//(_.Model):void
		var hasModelChanged = (model != this.model);
		this._super(model);
		
		if(hasModelChanged){
			
			//DESTOY OLD VIEW
			$(this.children.items).off('click', item_onClick);
			this.children.list.innerHTML = '';
			
			//APPLY MODEL TO SELF
			for(var i in this.model){
				var itemModel = this.model[i];
				var href = itemModel.href? itemModel.href : '';
				var label = itemModel.label? itemModel.label : '';
				var itemHTML = ""+
				"<li data-id='"+i+"'>"+
				"	<a href='"+href+"' alt='"+label+"'>"+
				"		<span class='bullet'></span>"+
				"		<div class='label'>"+label+"</div>"+
				"	</a>"+
				"</li>";
				$(this.children.list).append(itemHTML);
			}
			this.children.items = this.$view.find('li').toArray();
			$(this.children.items).on('click', {scope:this}, item_onClick);
			
			if(this.model){
				if(this.model.length < 2){
					$(this.children.list).css({display:'none', opacity:0});
				}else{
					$(this.children.list).css({display:'block', opacity:1});
				}
			}
			
			//APPLY MODEL TO CHILDREN
			//
		}
		
		//UPDATE THE VIEW
		this.apply();
		
		if(hasModelChanged){
			//goto();
		}
	}
	this.apply = function(){//(void):void
		this._super();
		
		//RESET UI
		//
		
		//APPLY MODEL
		if(this.model){
			
			//CREATE CONTROLS
			//
			
			//INIT INTERACTIVITY
			//
			
		}
	}
	this.setSize = function(w, h){//(int, int):void{
		var _this = this;
		this._super();
	}
	
	
	//STATE IMPLEMENTATIONS
	/*this.setState_stateId = function(useTransition, stateModel, reverse, onComplete){//(Boolean, Boolean, Function):void
		var _this = this;
		if(onComplete) onComplete();
	}*/
	
	
	//INSTANCE METHODS
	function item_onClick(event){//(event):void
		var _this = event.data.scope;
		var item = event.currentTarget;
		var itemIndex = eval($(item).attr('data-id'));
		var itemModel = _this.model[itemIndex];
		if(itemModel.onClick){
			event.preventDefault();//Don't change URL.
			var data = {
				item:itemModel,
				index:itemIndex
			}
			itemModel.onClick(data);
		}
		_this.selectItem(itemModel);
	}
	function selectItem(itemModel){//(Object):void
		var itemIndex = null;
		for(var i in this.model){
			var itemModel2 = this.model[i];
			if(itemModel2 == itemModel){
				itemIndex = eval(i);
				break;
			}
		}
		if(!(itemIndex > -1)){
			console.error('No such item found.');
		}
		this.selectedIndex = itemIndex;
		this.selectedItem = itemModel;
		for(var i in this.model){
			var itemModel = this.model[i];
			var item = this.children.items[i];
			if(itemModel == this.selectedItem){
				$(item).addClass('selected');
			}else{
				$(item).removeClass('selected');
			}
		}
		this._dispatchEvent('itemSelected', this.selectedItem);
	}
	function selectItemByIndex(i){//(Number):void
		var itemModel = this.model[i];
		this.selectItem(itemModel);
	}
	function selectItemById(id){//(Number):void
		var itemModel = null;
		for(var i in this.model){
			var itemModel2 = this.model[i];
			if(id == itemModel2.id){
				itemModel = itemModel2;
				break;
			}
		}
		if(!itemModel){
			console.error('No such item found.');
		}
		this.selectItem(itemModel);
	}
}


//EXTEND
pulley.view.controls.Paginator = pulley.view.ViewController.extend(new pulley.view.controls.Paginator());
pulley.view.controls.Paginator.type
pulley.view.controls.Paginator.prototype.type = 'pulley.view.controls.Paginator';


//STATIC VARS
//pulley.view.controls.Paginator.staticVar = null;


//STATIC METHODS
//pulley.view.controls.Paginator.staticMethod = function(){};


/*****
End Class: PaginatorVC
*****/