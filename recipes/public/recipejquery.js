$(function(){
	$('#addingredientshow').on('click', function(e){
		openForm($("#addingredient"), $("#addingredientshow"));
	});
	
	$('#hideAdd').on('click', function(e){
		closeForm( $("#addingredientshow"), $("#addingredient"));
	});
	
	$('#editname').on('click', function(e){
		openForm($("#editnameform"), $("#editname"));
	});
	
	$('#editnamehide').on('click', function(e){
		closeForm($("#editname"), $("#editnameform"));
	});
	
	$('#editinstruc').on('click', function(e){
		openForm($('#editinstrucform'), $('#currinstruc'));
	});

	$('#editinstruchide').on('click', function(e){
		closeForm($('#currinstruc'), $('#editinstrucform'));
	});
	
	$(".edit").on('click', function(e){
		if(openedForm == 0){
			var name = this.name;
			$("#"+name).removeClass();
			openedForm = 1;
		} else {
			alert("Edit already in progress on page.");
		}
	});
	
	$("[name=hideEdit]").on('click', function(e){
		var id = this.className;
		$("#"+id).addClass('hide');
		openedForm = 0;
	});
	
	$(".delete").on('click', function(e){
		var object = this;
		var ingredient = this.name;
		var recipe = $("#recipe").val();
		
		var data = {'recipe':recipe, 'todo':'delete', 'ingredient':ingredient};
		
		var objDel = $(object).closest('li');
		
		$.ajax({
			type: 'delete',
			data: data,
			success: function() {
				$(objDel).animate({fontSize:0}, 1000, function(){
					$(objDel).remove();
				});
			}
		});
	});
	
	$('#closeAlarm').on('click', function(e){
		$("#alarm").addClass("hide");
	});
	
	$('input:text').on('keyup', function(e){
		var letter = this.value;
		this.value = filterUserInput(letter);
	});
});

//global variable
var openedForm = 0;


//functions
function reverseHideClass(first, second){
	first.removeClass();
	second.addClass("hide");
}

function openForm(toOpen, toHide){
	if(openedForm == 0){
		reverseHideClass(toOpen, toHide);
		openedForm = 1;
	} else {
		alert("Edit already in progress on page.");
	}
}

function closeForm(toOpen, toHide){
	reverseHideClass(toOpen, toHide);
	openedForm = 0;
}

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