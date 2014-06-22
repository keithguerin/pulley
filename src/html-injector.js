/*****
Class: Pulley.HTMLInjector
Extends: none
Implements: none
Notes: This class allows you to:

A) Use HTML includes with JavaScript.
Example: <div id='appContainer' data-include-src='src/view/App/App.html' data-include-id='app'></div>

B) Initialize View controllers automatically by declaring them in HTML.
Example: <div class='App'> (Automatically instantiates with a class named 'AppVC' if it exists.

C) Inject HTML through the creation of a new View controller.
Example: HTMLInjector.createControllerAndInjectHTML(containerElement, StorySlideVC, 'storySlide3');

These techniques are useful, because they allow you to organize your code cleanly and logically.
They make the developers job easier, by giving a little bit more work to JavaScript.
*****/

registerNamespace('Pulley');

Pulley.HTMLInjector = function(){
	//No real constructor, since this is a static class.
	
		//This method recursively loads all HTML files within an element. Then it initializes any controllers within that element.
	this.init = function(){//(element):void
		var _this = this;
		var containerElement = $('body')[0];
		
		var HTMLTemplateURLsToPreload = null;//To-do: Grab the template URLs from HTML. (I have largely stopped using JavaScript injection of templates, in favor of jade includes and pre-compilation.)
		if(HTMLTemplateURLsToPreload){
			Pulley.HTMLInjector._loadHTMLTemplates(HTMLTemplateURLsToPreload, injectIncludes);
		}else{
			injectIncludes();
		}

		function injectIncludes(){
			Pulley.HTMLInjector._injectIncludes(containerElement, initializeViews);
		}

		function initializeViews(){
			//Pulley.View.autoinitializeViews(containerElement, onInitialized);
		}
		
		function onInitialized(){
			Pulley.HTMLInjector.pageInitialized = true;
			_this.dispatchEvent(Pulley.HTMLInjector.PAGE_INITIALIZED);
			
			//Call the ready function on all controllers we just initialized.
			for(var i in window._views){
				var controller = window._views[i];
				if(controller.ready && !controller.readied){
					controller.ready();
				}
			}
		}
	}
}

//EXTEND Controller
Pulley.HTMLInjector.prototype.type = Pulley.HTMLInjector.type = 'Pulley.HTMLInjector';


//STATIC VARS
Pulley.HTMLInjector.templates = null;//Array of HTML template strings.
Pulley.HTMLInjector.pageInitialized = false;
Pulley.HTMLInjector.PAGE_INITIALIZED = 'pageInitialized';

//STATIC METHODS
Pulley.HTMLInjector.init = function(){
	Pulley.HTMLInjector.instance = new Pulley.HTMLInjector();
}

Pulley.HTMLInjector.toString = function(){
	return 'HTMLInjector';//Neccessary to implement for the static methods to reference for logging.
}

//This method loads HTML files so that they can be used by a View controller later.
//On initialization, if the VC is not provided with a view, it find its template via HTMLInjector.getHTMLTemplateByName(className).
Pulley.HTMLInjector._loadHTMLTemplates = function(arrayOfTemplateURLs, onComplete){
	if(!Pulley.HTMLInjector.templates){
		Pulley.HTMLInjector.templates = [];
	}
	if(arrayOfTemplateURLs.length < 1){
		onComplete();
		return;
	}
	for(var i in arrayOfTemplateURLs){
		var templateURL = arrayOfTemplateURLs[i];
		
		//Try to find the template, which should have been injected by PHP.
		var templateClassName = templateURL.substring(templateURL.lastIndexOf('/')+1, templateURL.lastIndexOf('.'));
		var template = $('.'+templateClassName)[0];
		if(template){
			onTemplateLoaded(template.outerHTML);
			
		}else{//If it wasn't injected via PHP and found, then load in via AJAX.
			$.ajax({
				url: templateURL,
				data: {},
				dataType:'html',
				success:function(data,text,xhqr){
					onTemplateLoaded(data);
				},
				error:function(p1,p2,p3)
				{
					log('Network Error:');
					log(p1.status.toString());
					log(p2.toString());
					log(p3.toString());
				},
				notmodified:function(data){},
				timeout:function(data){},
				abort:function(data){},
				parseerror:function(data){},
				complete:function(data){}
			});
		}
	}
	
	function onTemplateLoaded(templateHTML){
		Pulley.HTMLInjector.templates.push(templateHTML);
		if(Pulley.HTMLInjector.templates.length == arrayOfTemplateURLs.length){//All templates have loaded.
			onComplete();
		}
	}
}

Pulley.HTMLInjector.getHTMLTemplateByViewClass = function(viewClass){
	logMethod(this, 'getHTMLTemplateByViewClass', arguments);
	for(var i in Pulley.HTMLInjector.templates){
		var template = Pulley.HTMLInjector.templates[i];
		var j = template.indexOf('class=')+6;//Start of controller name.
		var quoteCharacter = template.charAt(j);
		var k = template.indexOf(quoteCharacter, j+1);//End of controller name.
		var controllerName = template.substring(j+1, k);
		if(controllerName == viewClass.toString()){
			return template;
		}
	}
}

//This method goes through the HTML of a DOMElement and loads any includes.
//Includes are defined in HTML like this: <div data-include-src="clip.html" data-include-id="clip1"></div>
//Subsequently, it initializes any controllers that are defined within those includes, and recursively repeats this pattern down through the full DOM tree.
Pulley.HTMLInjector._injectIncludes = function(container, onComplete){
	var _this = this;
	logMethod(this, '_injectIncludes', arguments);
	var clipsWithHTMLIncludes = $(container).find('*[data-include-src]').toArray();
	var clipsLoaded = 0;
	if(clipsWithHTMLIncludes.length){
		for(var i in clipsWithHTMLIncludes){
			var clip = clipsWithHTMLIncludes[i];
			loadInclude(clip);
		}
	}else{
		onRecursionComplete();
	}
	function onRecursionComplete(){
		clipsLoaded++;
		if(clipsLoaded >= clipsWithHTMLIncludes.length){//If all includes have loaded...
			if(onComplete) onComplete();
		}
	}
	function loadInclude(clip){
		logMethod(_this, 'loadInclude', arguments);
		var htmlURL = $(clip).attr('data-include-src');
		var newElementId = $(clip).attr('data-include-id');
		var newElementClasses = $(clip).attr('data-include-class');
		$.ajax({
			url: htmlURL,
			data: {},
			dataType:'html',
			success:function(data,text,xhqr){
				var html = data;
				var prototypeElement = $(html)[0];//Create a prototype element, so we can grab its innerHTML to use.
				clip.innerHTML = prototypeElement.innerHTML;//Inject content into the clip from the prototype.
				for(var i=0; i < prototypeElement.attributes.length; i++){//Copy attributes from the element to the prototype, so these are not lost.
					var prototypeAttributeName = prototypeElement.attributes[i].name;
					var prototypeAttributeValue = $(prototypeElement).attr(prototypeAttributeName);
					var clipAlreadyHasAttribute = $(clip).attr(prototypeAttributeName);
					if(!clipAlreadyHasAttribute){//If the clip doesn't already have this attribute, add it.
						$(clip).attr(prototypeAttributeName, prototypeAttributeValue);
					}
				}
				var child = clip.children[0];//The element we are loading and initializing. Assign data-include-id and data-include-class to it.
				if(newElementId){
					child.id = newElementId;
				}
				$(child).addClass(newElementClasses);
				$(clip).attr('data-include-loaded="true"');
				Pulley.HTMLInjector._injectIncludes(clip, onRecursionComplete);
			},
			error:function(p1,p2,p3)
			{
				log('Network Error:');
				log(p1.status.toString());
				log(p2.toString());
				log(p3.toString());
			},
			notmodified:function(data){},
			timeout:function(data){},
			abort:function(data){},
			parseerror:function(data){},
			complete:function(data){}
		});
	}
}


/*****
End Class: HTMLInjector
*****/