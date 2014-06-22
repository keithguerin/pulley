/*****
Class: Pulley.model.LocalData
Extends: Backbone.Model
Notes: 
*****/

registerNamespace('Pulley.model');
Pulley.model.LocalData = Backbone.Model.extend({
	
	//IMPORT
	//var FooModel = company.project.model.valueobjects.FooModel;
	
	//var myPrivateVar = null;//Call without 'this'. Does not work since it can only access the prototype and not the instance.
	//this.myPublicVar = null;//Call with 'this'.
	
	//function myPrivateMethod(){};//Call via myPrivateMethod(). Does not work since it can only access the prototype and not the instance.
	//this.myPublicMethod = function(){};//Must be public to override. Call via this.myPublicMethod().
	
	initialize: function(modelClassesByType, onComplete){	
		
		this.modelClassesByType = modelClassesByType;//An object that maps the strings that the API calls objects to their Backbone.Model classes.
		/*Example: {
			Flight:lively.partneradmin.model.valueobjects.FlightModel,
			FlightGroup:lively.partneradmin.model.valueobjects.FlightGroupModel
		};*/
		
		this.catalog = {
			Flights:null,//Array of FlightModels
			FlightGroups:null,//Array of FlightGroupModels
		}
		
		if(onComplete) onComplete();
	},
	
	//INSTANCE METHODS
	addObject: function(object){
		if(!object){
			e.e;//No object provided.
		}
		if(!object.id){
			e.e;//Do not add objects unless they have an id.
		}
		var catalogedObjectsOfType = this.getCatalogByObjType(object.objType);
		catalogedObjectsOfType[object.id] = object;
	},
	getCatalogByObjType: function(objType){
		var catalogTypeName = objType+'s'
		var catalogedObjectsOfType = this.catalog[catalogTypeName];
		if(!catalogedObjectsOfType){//If a catalog of this item type does not exist yet, create it.
			catalogedObjectsOfType = this.catalog[catalogTypeName] = [];
		}
		return catalogedObjectsOfType;
	},
	getObjectFromCatalogByObjTypeAndId: function(objType, id){
		var catalogedObjectsOfType = this.getCatalogByObjType(objType);
		if(catalogedObjectsOfType){//If a catalog of this item type does not exist yet, create it.
			var object = catalogedObjectsOfType[id];
			return object;
		}
		return null;
	},
	updateObjects: function(objects){//(Array (or single instance) of Objects/Backbone.Models to be added, modified or removed.)
		var  _this = this;
		if(__config.logging) log('LocalData.updateObjects()');
		
		var errors = [];
		var resultingObjects = [];//A collection of the resulting Backbone.Models, to return. Maps 1-to-1 to objects submitted.
		if(objects instanceof Array){
			for(var i in objects){
				var obj = objects[i];
				var result = updateObject(obj);
				resultingObjects[i] = result.data;
				if(!result.success){
					errors.push(result);
				}
			}
		}else{
			var result = updateObject(objects);
			
			if(!result.success){
				errors.push(result);
			}
		}
		if(errors.length){
			return {success:false, message:'One or more objects failed to update.', data:errors};
		}else{
			return {success:true, message:'Successfully updated all objects.', data:resultingObjects};
		}
		
		function updateObject(newObjectJSON){//(JSONObj or Backbone.Model):Object. Adds object, or updates an existing object.
			var catalogedObjectsOfType = _this.getCatalogByObjType(newObjectJSON.objType);
			var existingObject = catalogedObjectsOfType[newObjectJSON.id];
			if(existingObject){
				//If the object exists, update it.
				existingObject.setModel(newObjectJSON);
				return {success:true, message:'Updated existing object.', data:existingObject};
			}else{
				//If it doesn't exist, add it.
				var modelClass = _this.modelClassesByType[newObjectJSON.objType];
				var newObject = new modelClass(newObjectJSON);//Backbone.Model. Create a new Backbone.Model instance, using the JSON object as an initializer.
				catalogedObjectsOfType[newObjectJSON.id] = newObject;
				return {success:true, message:'Added object.', data:newObject};
			}
			
			/*for(var i in catalogedObjects){
				var obj4 = catalogedObjects[i];
				if(obj4){
					if(obj4.objType == obj3.objType && obj4.id == obj3.id){
						//We found the object to update.
						obj4.setModel(obj3);//Reset its model. This is preferable to replacing the whole object.
						return {success:true, message:'Updated existing object.'};
						
					}else if(obj4 instanceof Array){
						//We found an array of objects. Check if the type of objects in the array is the type we are looking for.
						var prototypeObj = null;
						for(var j in obj4){
							prototypeObj = obj4[j];
							if(prototypeObj){
								break;
							}
						}
						if(prototypeObj){
							if(prototypeObj.objType == obj3.objType){
								//We found the right array.
								var objectToUpdate = obj4[obj3.id];
								if(objectToUpdate){
									objectToUpdate.setModel(obj3);//Reset its model. This is preferable to replacing the whole object.
									return {success:true, message:'Updated existing object.'};
								}else{
									//If an existing object was not found, add a new one.
									var objType = (obj3.objType.indexOf('Model') > -1)? obj3.objType : obj3.objType+'Model';
									var objClass = window[objType];
									var obj3Model = new objClass(obj3);
									obj4[obj3Model.id] = obj3Model;//Add the object to the array.
									return {success:true, message:'Added object.'};
								}
							}
						}
					}else{
						//Ignore it.
					}
				}
			}
			return {success:false, message:'Did not find object to update.'};*/
		}
	},
	
	removeObjects: function(objects){//(Array of Objects or Backbone.Models to be removed from the catalog.):Object
		var  _this = this;
		if(__config.logging) log('LocalData.updateObjects()');
		
		var errors = [];
		if(objects instanceof Array){
			for(var i in objects){
				var obj = objects[i];
				var result = removeObject(obj);
				if(!result.success){
					errors.push(result);
				}
			}
		}else{
			var result = removeObject(objects);
			if(!result.success){
				errors.push(result);
			}
		}
		if(errors.length){
			return {success:false, message:'One or more objects failed to be removed.', data:errors};
		}else{
			return {success:true, message:'Successfully removed all objects.'};
		}
		
		function removeObject(objectToRemove){//(JSONObj or Backbone.Model):Object
			var catalogedObjectsOfType = _this.catalog[objectToRemove.objType+'s'];
			if(!catalogedObjectsOfType){
				return {success:false, message:'There are no cataloged items of this type.', data:objectToRemove};
			}
			var existingObject = catalogedObjectsOfType[objectToRemove.id];
			if(existingObject){
				//If the object exists, remove it from the catalog.
				catalogedObjectsOfType.splice(objectToRemove.id, 1);//Remove from array.
				//Erase the object and notify any connected views that this object has been deleted.
				existingObject.destroy();
				return {success:true, message:'Updated existing object.', data:existingObject};
			}else{
				return {success:true, message:'The object did not exist to remove.'};
			}
		}
	}
	
	
});


//EXTEND
Pulley.model.LocalData.type = Pulley.model.LocalData.prototype.type = 'Pulley.model.LocalData';


//STATIC VARS
//Pulley.model.LocalData.staticVar = null;


//STATIC METHODS
//Pulley.model.LocalData.staticMethod = function(){};



/*****
End Class: LocalData
*****/