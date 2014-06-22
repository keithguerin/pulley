/*****
Class: Pulley.view.controls.DropDownManager
Extends: Backbone.Model
Notes: Inspired by http://javascript-array.com/scripts/simple_drop_down_menu/
		
	INSTRUCTIONS:
	1. Create navs with this structure.
		<div><a href="#">Main Nav Item</a>
			<nav class='sub-nav' style='display:none'>
				<a href="#">Dropdown Item A</a>
				<a href="#">Dropdown Item B</a>
				<a href="#">Dropdown Item C</a>
			</nav>
		</div>
	2. Pass in default augments. The dropDowns array is required. Other settings are optional.
	3. If you want to animate the dropdowns, use CSS to do this.

*****/

registerNamespace('Pulley.view.controls');
Pulley.view.controls.DropDownManager = Pulley.Module.extend({
	
	
	//Settings
	timeUntilDropDownCloses: 500,
	
	_closeTimer: null,
	activeDropDown: null,
	
	
	//Override Backbone.Model
	initialize: function (options) {
		//this.type = this.__proto__.type;
		
		if(!this.dropDowns){
			console.error('You must pass in a "dropDowns" array with the format [{mainNavItem: el, dropDownNav: el}]"');
			return;
		}
		
		for(var i in this.dropDowns){
			var obj = this.dropDowns[i];
			this._initDropDownNav(obj.mainNavItem, obj.dropDownNav);
		}
		
		document.onclick = this._closeActiveDropDown;
	},
	
	_initDropDownNav: function (mainNavItem, dropDownNav) {
		var _this = this;
		$(mainNavItem).bind('mouseover', function(event){
			_this._openDropDown(dropDownNav);
		}).bind('mouseout', function(event){
			_this._startCloseTimer();
		});
		
		$(dropDownNav).bind('mouseover', function(event){
			_this._cancelCloseTimer();
		}).bind('mouseout', function(event){
			_this._startCloseTimer();
		});
	},
	
	_openDropDown: function (dropDownNav) {
		console.log('_openDropDown()');
		this._cancelCloseTimer();
		this._closeActiveDropDown();
		this.activeDropDown = dropDownNav;
		$(dropDownNav).css({display:'block', opacity:1}); //, pointerEvents:'none'});
	},
	
	_closeActiveDropDown: function () {
		if(!this.activeDropDown) return;
		console.log('_closeActiveDropDown()');
		$(this.activeDropDown).css({display:'none', opacity:0});
		this.activeDropDown = null;
	},
	
	_startCloseTimer: function () {
		var _this = this;
		this._closeTimer = window.setTimeout(function(){
			_this._closeActiveDropDown();
		}, this.timeUntilDropDownCloses);
	},
	
	_cancelCloseTimer: function () {
		if(this._closeTimer){
			window.clearTimeout(this._closeTimer);
			this._closeTimer = null;
		}
	}
	
	
});


//EXTEND
Pulley.view.controls.DropDownManager.type = Pulley.view.controls.DropDownManager.prototype.type = 'Pulley.view.controls.DropDownManager';


//STATIC VARS
//Pulley.view.controls.DropDownManager.staticVar = null;


//STATIC METHODS
//Pulley.view.controls.DropDownManager.staticMethod = function(){};



/*****
End Class: Pulley.view.controls.DropDownManager
*****/