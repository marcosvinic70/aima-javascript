$(document).ready(function(){
	$.ajax({
		url : "breadthFirstSearch.js",
		dataType: "text",
		success : function (data) {
			$("#breadthFirstSearchCode").html(data);
		}
	});
});