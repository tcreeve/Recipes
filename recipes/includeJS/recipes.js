//groups.js

//database connections
var mysql = require('mysql');
var dbconfig = require('./connection');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE '+dbconfig.database);

function getAllRecipes(done){
	var statement = "SELECT * FROM recipe;";
	connection.query(statement, function(err, rows){
		if(err){
			return done(err, null);
		}
		return done(null, rows);
	});
}

function getRecipeInfo(id, done){
	var statement = "SELECT * FROM recipe WHERE idrecipe=?;";
	connection.query(statement, [id], function(err, rows){
		if(err)
			return done(err, null);
		return done(null, rows);
	});
}

function getRecipeIngredientsByRecipe(id, done){
	var statement = "SELECT * FROM ingredients WHERE idrecipe=?;"
	connection.query(statement, [id], function(err, rows){
		if(err)
			return done(err, null);
		return done(null, rows);
	});
}

function checkIngredientForUniqueness(recipeid, name, done){
	var statement = "SELECT * FROM ingredients WHERE idrecipe=? AND ingredient=?";
	connection.query(statement, [recipeid, name], function(err, rows){
		if(err)
			return done(err, null);
		return done(null, rows);
	});
}

function addRecipeIngredientSingle(id, name, amount, unit, done){
	var statement = "INSERT INTO ingredients(idrecipe, ingredient, amount, unit) "
		+"VALUES(?,?,?,?);"
	connection.query(statement, [id, name, amount, unit], function(err, rows){
		if(err)
			return done(err, null);
		return done(null, rows);
	});
}

function updateIngredientInRecipe(id, name, amount, unit, done){
	var statement = "UPDATE ingredients SET ";	
	var previousVariable = 0;
	if(amount){
		statement += "amount=?";
		previousVariable = 1;
	}
	if(unit){
		if(previousVariable == 1)
			statement+= ", ";
		statement += "unit=?";
	}
	statement += " WHERE idrecipe=? AND ingredient=?";
	
	if(amount && unit){
		connection.query(statement, [amount, unit, id, name], function(err, rows){
			if(err)
				return done(err, null);
			return done(null, rows);
		});
	} else if(amount){
		connection.query(statement, [amount, id, name], function(err, rows){
			if(err)
				return done(err, null);
			return done(null, rows);
		});
	} else if (unit){
		connection.query(statement, [unit, id, name], function(err, rows){
			if(err)
				return done(err, null);
			return done(null, rows);
		});
	}
}

function updateRecipeInstructions(id, instructions, done){
	var statement = "UPDATE recipe SET instructions=? WHERE idrecipe=?";
	connection.query(statement, [instructions, id], function(err, rows){
		if(err)
			return done(err, null);
		return done(null, rows);
	});
}

function updateRecipeName(id, name, done){
	var statement = "UPDATE recipe SET name=? WHERE idrecipe=?";
	connection.query(statement, [name, id], function(err, rows){
		if(err)
			return done(err, null);
		return done(null, rows);
	});
}

function deleteIngredientFromRecipe(id, ingredient, done){
	var statement = "DELETE FROM ingredients WHERE idrecipe=? AND ingredient=?";
	connection.query(statement, [id, ingredient], function(err, rows){
		if(err)
			return done(err, null);
		return done(null, rows);
	});
}

function addRecipeToDatabase(data, done){
	var statement = "INSERT INTO recipe(name, instructions) "+
		"VALUES(?,?);";
	connection.query(statement, [data.name, data.instructions], function(err, rows){
		if(err)
			return done(err, null);
		return done(null, rows);
	});
}

function addRecipeIngredientsArray(recipe, amount, ingredients, units, done){
	var statement = "INSERT INTO ingredients(idrecipe, ingredient, amount, unit) "+
		"VALUES ";
	for(var i=0; i<ingredients.length; i++){
		statement+="("+recipe+", ";
		statement+=connection.escape(ingredients[i])+", ";
		statement+=connection.escape(amount[i])+", ";
		statement+=connection.escape(units[i])+")";
		if(i < ingredients.length-1){
			statement+=",";
		}
	}
	console.log(statement);
	connection.query(statement, function(err, rows){
		if(err)
			return done(err, null);
		return done(null, rows);
	});
}

exports.getAllRecipes = getAllRecipes;
exports.getRecipeInfo = getRecipeInfo;
exports.getRecipeIngredientsByRecipe = getRecipeIngredientsByRecipe;
exports.checkIngredientForUniqueness = checkIngredientForUniqueness;
exports.addRecipeIngredientSingle = addRecipeIngredientSingle;
exports.updateIngredientInRecipe = updateIngredientInRecipe;
exports.updateRecipeInstructions = updateRecipeInstructions;
exports.updateRecipeName = updateRecipeName;
exports.deleteIngredientFromRecipe = deleteIngredientFromRecipe;
exports.addRecipeToDatabase = addRecipeToDatabase;
exports.addRecipeIngredientsArray = addRecipeIngredientsArray;