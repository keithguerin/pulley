/*****
Class: HTMLInjector
Extends: none
Implements: none
Notes: This class allows you to:

A) Use HTML includes with JavaScript.
Example: <div id='appContainer' data-include-src='src/view/App/App.html' data-include-id='app'></div>

B) Initialize ViewControllers automatically by declaring them in HTML.
Example: <div class='App'> (Automatically instantiates with a class named 'AppVC' if it exists.

C) Inject HTML through the creation of a new ViewController.
Example: HTMLInjector.createControllerAndInjectHTML(containerElement, StorySlideVC, 'storySlide3');

These techniques are useful, because they allow you to organize your code cleanly and logically.
They make the developers job easier, by giving a little bit more work to JavaScript.
*****/

registerNamespace('pulley');
pulley.HTMLInjector = function(){
	//No real constructor, since this is a static class.
}


//EXTEND Controller
pulley.HTMLInjector = pulley.Controller.extend(new pulley.HTMLInjector());
pulley.HTMLInjector.prototype.type = 
pulley.HTMLInjector.type = 'pulley.HTMLInjector';


//STATIC VARS
pulley.HTMLInjector.templates = null;//Array of HTML template strings.


//STATIC METHODS
pulley.HTMLInjector.toString = function(){
	return 'HTMLInjector';//Neccessary to implement for the static methods to reference for logging.
}

//This method recursively loads all HTML files within an element. Then it initializes any controllers within that element.
pulley.HTMLInjector.initializePage = function(containerElement, HTMLTemplateURLsToPreload, onComplete){//(element):void
	logMethod(this, 'initializePage', arguments);
	
	pulley.HTMLInjector._loadHTMLTemplates(HTMLTemplateURLsToPreload, onHTMLTemplatesLoaded);
	
	function onHTMLTemplatesLoaded(){
		pulley.HTMLInjector._injectIncludes(containerElement, onIncludesInjected);
	}
	
	function onIncludesInjected(){
		pulley.HTMLInjector._initializeControllers(containerElement, onComplete);
	}
}

//This method loads HTML files so that they can be used by a ViewController later.
//On initialization, if the VC is not provided with a view, it find its template via HTMLInjector.getHTMLTemplateByName(className).
pulley.HTMLInjector._loadHTMLTemplates = function(arrayOfTemplateURLs, onComplete){
	if(!pulley.HTMLInjector.templates){
		pulley.HTMLInjector.templates = [];
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
		pulley.HTMLInjector.templates.push(templateHTML);
		if(pulley.HTMLInjector.templates.length == arrayOfTemplateURLs.length){//All templates have loaded.
			onComplete();
		}
	}
}

pulley.HTMLInjector.getHTMLTemplateByViewControllerClass = function(viewControllerClass){
	logMethod(this, 'getHTMLTemplateByViewControllerClass', arguments);
	for(var i in pulley.HTMLInjector.templates){
		var template = pulley.HTMLInjector.templates[i];
		var j = template.indexOf('class=')+6;//Start of controller name.
		var quoteCharacter = template.charAt(j);
		var k = template.indexOf(quoteCharacter, j+1);//End of controller name.
		var controllerName = template.substring(j+1, k);
		if(controllerName == viewControllerClass.toString()){
			return template;
		}
	}
}

//This method goes through the HTML of a DOMElement and loads any includes.
//Includes are defined in HTML like this: <div data-include-src="clip.html" data-include-id="clip1"></div>
//Subsequently, it initializes any controllers that are defined within those includes, and recursively repeats this pattern down through the full DOM tree.
pulley.HTMLInjector._injectIncludes = function(container, onComplete){
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
				pulley.HTMLInjector._injectIncludes(clip, onRecursionComplete);
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

//This goes through the HTML of a DOMElement and initializes any controllers.
//Controllers are defined in HTML like this: <div class="Clip">stuff</div>. This looks for a controller with name ClipVC.
pulley.HTMLInjector._initializeControllers = function(container, onComplete){
	var _this = this;
	logMethod(this, '_initializeControllers', arguments);
	var clipsWithControllersToInstantiate = $(container).find('*[class]').toArray();
	var clipsInitialized = 0;
	for(var i in clipsWithControllersToInstantiate){
		var clip = clipsWithControllersToInstantiate[i];
		var clipIsAlreadyInitialized = $(clip).attr('data-controller-initialized');
		if(!clipIsAlreadyInitialized){
			var automaticallyFindControllerByClassName = false;//I disabled this, since it makes makes namespacing controllers difficult.
			if(automaticallyFindControllerByClassName){
				var clip_classList = clip.className.split(/\s+/);
				for(var i in clip_classList){
					if(isNumber(i)){
						var className = clip_classList[i];
						var controllerName = className+'VC';
						var controllerClass = window[controllerName];
						if(controllerClass){
							var controller = new controllerClass(clip);//Pass in the view, so it has a reference.
							break;
						}
					}
				}
			}else{//Use the data-controller attribute.
				var controllerName = $(clip).attr('data-controller');
				if(controllerName){
					var controllerClass = getControllerByNamespaceString(controllerName);
					if(controllerClass){
						var controller = new controllerClass(clip);//Pass in the view, so it has a reference.
					}
				}
			}
		}
	}
	onComplete();
	
	function getControllerByNamespaceString(namespaceString){//String, example: pulley.view.controls.NavBarVC
		var namespacesArray = namespaceString.split(".");;//Array example, ['pulley','view','controls','NavBarVC'];
		var parentNamespace = window;
		for(var i in namespacesArray){
			var childNamespace = namespacesArray[i];
			parentNamespace = parentNamespace[childNamespace];
			if(!parentNamespace){
				e.e;//Invalid namespace.
			}
		}
		var controller = parentNamespace;
		return controller;
	}
}

pulley.HTMLInjector.createControllerAndInjectHTML = function(container, viewControllerClass, id){//(parentDOMElement, viewControllerClass, id):ViewController
	if(!id){
		id = viewControllerClass.createUniqueId();
	}
	var viewHTML = createHTML(viewControllerClass, id);
	$(container).append(viewHTML);
	var clip = document.getElementById(id);
	var clipVC = new viewControllerClass(clip);
	return clipVC;
	
	function createHTML(viewControllerClass, id){
		var htmlTemplate = pulley.HTMLInjector.getHTMLTemplateByViewControllerClass(viewControllerClass);
		var html = '';
		var pre = htmlTemplate.substring(0, htmlTemplate.indexOf(' '));//All text before the first space.
		var post = htmlTemplate.substr(htmlTemplate.indexOf(' '));//All text after the first space.
		html = pre + " id='"+id+"'" + post;
		return html;
	}
}


/*****
End Class: HTMLInjector
*****/