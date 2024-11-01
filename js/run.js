jQuery(document).ready(function($) {
	
//	$("#headerimg").append("<a id='test' href='#'>click me</a>");
	
//	$("#test").click(function(){
//		$("a").each(function(i){
//		 $("#headerimg").append("<div>"+this.href+"</div>");
//		});	
//	});
	
	
	
$("#form").sortable({
	receive: function(event, ui){
		addField(ui.helper.attr("id"));
	}
});
$(".datepicker").datepicker();
prepareMenu();
generateFormPanel();
generateControls();

});