//routes.js

var recipes = require('./recipes');

//get code for website
module.exports = function(app, passport){
	
	//home page
	app.get('/', function(req, res){
		res.render('index');
	});
	
	app.get('/view', function(req, res){
		recipes.getAllRecipes(function(err, data){
			if(err){
				console.log(err);
			}
			res.render('view', {recipes: data});
		});
	});
	
	app.get('/recipe/*', function(req, res){
		var idString = getRecipeIdFromURL(req.url);
		recipes.getRecipeInfo(idString, function(err, data){
			if(err){
				console.log(err);
				res.render('recipe');
			}
			if(data.length > 0)
				recipes.getRecipeIngredientsByRecipe(idString, function(erring, dataing){
					if(erring){
						console.log(erring);
						res.render('recipe', {recipe: data});
					}
					if(req.session.alarm){
						res.render('recipe', {info: data, ingredients: dataing, msg: req.session.alarm});
						req.session.alarm = null;
					} else{
						res.render('recipe', {info: data, ingredients: dataing});
					}
				});			
			else{
				res.render('error');
			}
		});
	});
	
	app.post('/recipe/*', function(req, res){
		var idString = getRecipeIdFromURL(req.url);
		var bodyInput = req.body;
		
		if(bodyInput.todo == "newing"){
			if(bodyInput.amount <= 0){
				req.session.alarm = "Amount must be a postive number.";
				res.redirect(bodyInput.recipe);
			} else{
				recipes.checkIngredientForUniqueness(bodyInput.recipe, bodyInput.ingredient, function(errcheck, datacheck){
					if(errcheck){
						console.log(errcheck);
						req.session.alarm = "A problem occured when trying to add ingredient";
						res.redirect(bodyInput.recipe);
					}
					if(datacheck.length == 0){
						recipes.addRecipeIngredientSingle(bodyInput.recipe, bodyInput.ingredient, bodyInput.amount, bodyInput.unit, function(erradd, dataadd){
							if(erradd){
								console.log(erradd);
								req.session.alarm = "A problem occured when trying to add ingredient";
								res.redirect(bodyInput.recipe);
							}
							res.redirect(bodyInput.recipe);
						});
					} else{
						console.log("Duplicate ingredient in recipe");
						req.session.alarm = "Ingredient is already added to this recipe.";
						res.redirect(bodyInput.recipe);
					}
				});
			}
		} else if(bodyInput.todo == "editing"){
			if(bodyInput.amount <= 0){
				req.session.alarm = "Amount must be a positive number";
				res.redirect(bodyInput.recipe);
			}
			else{
				recipes.updateIngredientInRecipe(bodyInput.recipe, bodyInput.ingredient, bodyInput.amount, bodyInput.unit, function(erred, dataed){
					if(erred){
						console.log(erred);
						req.session.alarm = "A problem occured when trying to update ingredient"
						res.redirect(bodyInput.recipe);
					}
					res.redirect(bodyInput.recipe);
				});
			}
		} else if(bodyInput.todo == 'editinstruc'){
			var instruc = bodyInput.instructions;
			recipes.updateRecipeInstructions(bodyInput.recipe, instruc, function(erred, dataed){
				if(erred){
					console.log(erred);
					req.session.alarm = "A problem occured when trying to edit instructions.";
					res.redirect(bodyInput.recipe);
				}
			});
			res.redirect(bodyInput.recipe);
		} else if(bodyInput.todo == 'editname'){
			recipes.updateRecipeName(bodyInput.recipe, bodyInput.name, function(erred, dataed){
				if(erred){
					console.log(erred);
					req.session.alarm = "A problem occured when trying to edit name.";
					res.redirect(bodyInput.recipe);
				}
			});
			res.redirect(bodyInput.recipe);
		}
	});
	
	app.delete('/recipe/*', function(req, res){
		var bodyInput = req.body;
		recipes.deleteIngredientFromRecipe(bodyInput.recipe, bodyInput.ingredient, function(err, data){
			if(err){
				console.log(err);
			}
			res.json(data);
		});
	});
	
	app.get('/newrecipe', function(req, res){
		res.render('newrecipe');
	});
	
	app.post('/newrecipe', function(req, res){
		recipes.addRecipeToDatabase(req.body, function(err, data){
			if(err)
				console.log(err)
			var recipe = data.insertId;
			var amount = req.body.amount;
			var ingredient = req.body.ingredient;
			var unit = req.body.unit;
			
			recipes.addRecipeIngredientsArray(recipe, amount, ingredient, unit, function(err, data){
				if(err)
					console.log(err);
				res.redirect('/view');
			});
		});
	});
	
	//used for any unspecified path
	app.get('*', function(req, res){
		res.render('error');
	});
}

//gets url
function getRecipeIdFromURL(url){
	var partsURL = url.split("/");
	return partsURL[partsURL.length-1];
}