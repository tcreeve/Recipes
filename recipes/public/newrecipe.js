$(function(){
	$('#moreing').on('click', function(e){
		$("#toduplicate").clone()
			.find("input").val("").end()
			.appendTo("#ingredientfield")
	});
	
	$('input:text').on('keyup', function(e){
		var letter = this.value;
		this.value = filterUserInput(letter);
	});
});


//functions
function filterUserInput(string){
	var newString = "";
	for(var i=0; i<string.length; i++){
		if(string[i]>="a" && string[i]<="z"){
			newString += string[i];
		} else if(string[i]>="A" && string[i]<="Z"){
			newString += string[i];
		} else if(string[i]==" "){
			newString += string[i];
		} else if(string[i]=="'"){
			newString += string[i];
		} else if(string[i]>="0"&& string[i]<="9"){
			newString += string[i];
		}
	}
	return newString; 
}