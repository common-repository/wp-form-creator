function formcreator_validate(form)
{
	$(".formcreator_warning").remove();
	$('#'+form+' :input').each(function(){
	if($(this).hasClass('required')){

		if($(this).attr('type') == 'checkbox'){
			if(!$(this).attr('checked')){
				$(this).parent().find(".formcreator_warning").remove();
				$(this).parent().append("<div class='formcreator_warning'> Required</div>");
			}
		}else if($(this).attr('type') == 'radio'){
			if(!$(this).attr('checked')){
				$(this).parent().find(".formcreator_warning").remove();
				$(this).parent().append("<div class='formcreator_warning'> Required</div>");
			}
		}else{
			if(this.value == ''){
				$(this).parent().append("<div class='formcreator_warning'> Required</div>");
			}	
		}
		
	}	
	});

	return false;
}

function prepareMenu()
{
	$("#menu_new").bind("click", function(e){
		window.location.reload();
	});
	
	$("#menu_open").bind("click", function(e){
		doOpen();
	});
	
	$("#menu_save").bind("click", function(e){
		doSave();
	});
}

function generateControls()
{
	
	for(var i = 0; i<controls.length; i++)
	{
		$("#controls").append("<div class='"+controls[i].class_name+"' id='"+controls[i].type+"'>&nbsp;&nbsp;"+controls[i].name+"</div>");
		$("#"+controls[i].type).draggable({ 
			connectToSortable: '#form',
			helper: 'clone',
			revert: 'true' });
		$("#"+controls[i].type).disableSelection();
	
	}
	
}

function generateFormPanel(data)
{
	$("#formPanel").empty();
	
	var formId = "<div id='formId' style='display:none'></div>";
	var formTag = "<div id='formTagDiv' style='display:none' class='ui-state-hover attribute-label formPanel-div'>Form Tag: <span id='formTag'></span></div>";
	var formTitle = "<div id='formNameDiv' class='ui-state-hover attribute-label formPanel-div'>Form Name: <input class='attribute-field textfield_effect' size='60' type='text' id='formName' name='formName' value=''></div>";
	var formEmails = "<div id='formEmailsDiv' class='ui-state-hover attribute-label formPanel-div'>Form Recipients: <textarea class='attribute-field textarea_effect' id='formEmails' cols='15' rows='5'></textarea></div>";
	
	$("#formPanel").append(formId);
	$("#formPanel").append(formTag);
	$("#formPanel").append(formTitle);
	$("#formPanel").append(formEmails);
	
	if(data){
		$("#formId").text(data.id);
	     $("#formTag").text('{formcreator_'+data.id+'}');
		 $("#formTagDiv").show();
		 $("#formName").attr("value", data.name);
		 $("#formEmails").text(data.emails);
	}
	
	
}

function doSave()
{
	
	$("#saveDialog").text("Saving...");
	$("#saveDialogDiv").dialog({
				bgiframe: true,
				modal: true,
				buttons: {
					Ok: function() {
						$(this).dialog('close');
						$(this).dialog('destroy');
					}
				}
			});
	$("#saveDialogDiv").dialog('open');	
	
	
	$("#form").sortable('refresh');
	var positions = $("#form").sortable('toArray');
	
	for(var i=0;i<positions.length;i++)
	{
		var temp_field = positions[i].split("_");
		
		fields[temp_field[1]].field_order = i;
		
		//$("#console").append("<div>"+positions[i]+" - "+i+" - "+fields[temp_field[1]].field_order+"</div>");
	}
	
	var settings = {
		form_id: $("#formId").text(),
		form_name: $("#formName").attr('value'),
		form_emails: $("#formEmails").attr('value')
	}
	
	var form = {
		settings: settings,
		fields: fields
	}
	
	 var jText = JSON.stringify({ settings:settings , fields:fields });
	
	$.ajax({
   type: "POST",
   url: server_url,
   data: {action: "save", form: jText},
   success: function(id){
	$("#saveDialog").empty();
	if(id == 'error'){
	$("#saveDialog").append("<p>Failed to save form!</p>");	
	}else{
     $("#formId").text(id);
     $("#formTag").text('{formcreator_'+id+'}');
	 $("#formTagDiv").show();
	 $("#saveDialog").append("<p>Form Saved !!</p>Form Tag: {formcreator_"+id+"}");
	}
   }
 });
}

function doOpen()
{
	$.ajax({
   type: "POST",
   url: server_url,
   data: {action: "getForms"},
   dataType: "json",
   success: function(forms){
    if(forms.length ==0){
	$("#openDialogDiv").empty();
	$("#openDialogDiv").append("<p>There is no forms to load.</p>");
	$("#openDialogDiv").dialog({
				bgiframe: true,
				modal: true,
				buttons: {
					Ok: function() {
							$(this).dialog('close');
							$(this).dialog('destroy');
					}
				}
			});
	$("#openDialogDiv").dialog('open');
	}else{
 		$("#openDialogDiv").empty();
		
		var li = '';
		for(var i=0; i<forms.length; i++){
			li += "<li><input type='radio' name='formToOpen' id='formToOpen' value='"+forms[i].id+"'> "+forms[i].name+"</li>";
		}

		 $("#openDialogDiv").append("<ul>"+li+"</ul>");
		 $("#openDialogDiv").dialog({
					bgiframe: true,
					modal: true,
					buttons: {
						Ok: function() {
							var selected_id = $('input[name=formToOpen]:checked').val();
							if(selected_id){
								doLoad(selected_id);
								$(this).dialog('close');
								$(this).dialog('destroy');	
							}
						},
						Cancel: function(){
							$(this).dialog('close');
							$(this).dialog('destroy');
						}
					}
				});
	
	$("#openDialogDiv").dialog('open');
	}

	
	
   }
 });
}

function doLoad(id)
{
	$.ajax({
   type: "POST",
   url: server_url,
   data: {action: "loadForm", id: id},
   dataType: "json",
   success: function(form){
	
	$("#form").empty();
	$("#attributes_table").empty();
	
	 generateFormPanel(form.settings);
	fields_counter = 0;
	for(var z=0;z<form.fields.length;z++)
	{
	fields[form.fields[z].field_id] = form.fields[z];
	loadField(form.fields[z]);
	
	}
	
   }
 });

}

function loadField(field)
{
	if(field.field_id > fields_counter)
	fields_counter = field.field_id;
	
	var new_field = prepareField(field.field_type, field.field_id);
	
	switch(field.field_type){
		case 'header':
		addHeader(new_field, field);
		$("#"+new_field.attr("id")+"_div").addClass('header-div');
		break;
		
		case 'text':
		addText(new_field, field);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
		
		case 'textfield':
		addTextfield(new_field, field);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
		
		case 'textarea':
		addTextarea(new_field, field);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
		
		case 'checkbox':
		addCheckbox(new_field, field);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
		
		case 'radio':
		addRadio(new_field, field);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
		
		case 'select':
		addSelect(new_field, field);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
		
		case 'date':
		addDate(new_field, field);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
		
		case 'button':
		addButton(new_field, field);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
		
		case 'htmltag':
		addHtmltag(new_field, field);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
	}
	
}


function addField(id)
{
	fields_counter++;
	switch(id){
		case 'header':
		var new_field = prepareField(id, fields_counter);
		
		var field_object = {
			field_type: id,
			field_id: fields_counter,
			field_label: "",
			field_order: 0
		}

		fields[fields_counter] = field_object;
		addHeader(new_field, field_object);
		$("#"+new_field.attr("id")+"_div").addClass('header-div');
		break;
		
		case 'text':
		var new_field = prepareField(id, fields_counter);
		
		var field_object = {
			field_type: id,
			field_id: fields_counter,
			field_label: "",
			field_order: 0
		}

		fields[fields_counter] = field_object;
		addText(new_field, field_object);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
		
		case 'textfield':
		var new_field = prepareField(id, fields_counter);
		
		var field_object = {
			field_type: id,
			field_id: fields_counter,
			field_label: "",
			field_value: "",
			field_size: "",
			field_required: "",
			field_validation: "",
			field_order: 0
		}

		fields[fields_counter] = field_object;
		addTextfield(new_field, field_object);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
		
		case 'textarea':
		var new_field = prepareField(id, fields_counter);
		
		var field_object = {
			field_type: id,
			field_id: fields_counter,
			field_label: "",
			field_value: "",
			field_cols: "",
			field_rows: "",
			field_required: "",
			field_order: 0
		}

		fields[fields_counter] = field_object;
		addTextarea(new_field, field_object);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
		
		case 'checkbox':
		var new_field = prepareField(id, fields_counter);
		
		var field_object = {
			field_type: id,
			field_id: fields_counter,
			field_label: "",
			field_value: "",
			field_required: "",
			field_order: 0
		}

		fields[fields_counter] = field_object;
		addCheckbox(new_field, field_object);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
		
		case 'radio':
		var new_field = prepareField(id, fields_counter);
		
		var field_object = {
			field_type: id,
			field_id: fields_counter,
			field_label: "",
			field_value: "",
			field_required: "",
			field_order: 0
		}

		fields[fields_counter] = field_object;
		addRadio(new_field, field_object);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
		
		case 'select':
		var new_field = prepareField(id, fields_counter);
		
		var field_object = {
			field_type: id,
			field_id: fields_counter,
			field_label: "",
			field_value: "",
			field_required: "",
			field_order: 0
		}

		fields[fields_counter] = field_object;
		addSelect(new_field, field_object);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
		
		case 'date':
		var new_field = prepareField(id, fields_counter);
		
		var field_object = {
			field_type: id,
			field_id: fields_counter,
			field_label: "",
			field_value: "",
			field_required: "",
			field_order: 0
		}

		fields[fields_counter] = field_object;
		addDate(new_field, field_object);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
		
		case 'button':
		var new_field = prepareField(id, fields_counter);
		
		var field_object = {
			field_type: id,
			field_id: fields_counter,
			field_label: "",
			field_value: "",
			field_isreset: "",
			field_order: 0
		}

		fields[fields_counter] = field_object;
		addButton(new_field, field_object);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
		
		case 'htmltag':
		var new_field = prepareField(id, fields_counter);
		
		var field_object = {
			field_type: id,
			field_id: fields_counter,
			field_value: "",
			field_order: 0
		}

		fields[fields_counter] = field_object;
		addHtmltag(new_field, field_object);
		$("#"+new_field.attr("id")+"_div").addClass('text-div');
		break;
	}
	
}

function deleteField(id)
{
	$("#"+id).remove();
	var num = id.split("_");
	fields[num[1]]=null;
	$("#form").sortable('refresh');
}

function prepareField(id, cnt)
{
	if($("#form > #"+id).attr('id')){
		$("#form > #"+id).attr("id", "field_"+cnt);
	}else{
		$("#form").append("<div id='field_"+cnt+"'></div>");
		$("#field_"+cnt).addClass('ui-accordion-header ui-helper-reset ui-state-default ui-corner-all ui-draggable');
	}
	var field = $("#field_"+cnt);
	field.empty();
	field.removeClass('btn');
	field.addClass('fld');
	field.append("<div id='"+field.attr('id')+"_div'></div>");
	var parent = field.attr('id')+"_div_td";
	var attr_parent = field.attr('id')+"_attributes_table_td";
		
	$("#"+field.attr('id')+"_div").append("<table width='100%'><tr><td width='90%' id='"+parent+"'></td><td align='center'><span id='"+field.attr('id')+"_div_attributes' class='ui-icon ui-icon-folder-open smlbtn'/></td><td align='right' width='5%'><span id='"+field.attr('id')+"_div_remove' class='ui-icon ui-icon-closethick smlbtn'/></td></tr></table>");
	
	$("#"+field.attr('id')+"_div_attributes").bind("click", function(e){
		resetAttributes();
		showAttributes(id, cnt);
	});
	
	$("#"+field.attr('id')+"_div_remove").bind("click", function(e){
			$("#dialog").dialog({
					bgiframe: true,
					resizable: false,
					height:140,
					modal: true,
					overlay: {
						backgroundColor: '#000',
						opacity: 0.5
					},
					buttons: {
						'Confirm': function() {
							deleteField(field.attr('id'));
							resetAttributes();
							$(this).dialog('close');
							$(this).dialog('destroy');
						},
						Cancel: function() {
							$(this).dialog('close');
							$(this).dialog('destroy');
						}
					}
				});	
			$("#dialog").dialog('open');	
	});
	
	return field;
}

function reloadAttributes(type, id)
{
	if($("#attributes_table > *").length > 0)
	{
		resetAttributes();
		showAttributes(type, id);
	}
}

function resetAttributes()
{
	$("#attributes_table").empty();
}

function showAttributes(type, id)
{
	var field = fields[id];
	for(var i = 0; i<attributes[type].length; i++)
	{
		addAttributeField(attributes[type][i], field, id, i);		
	}

	var save_button = "<tr><td colspan='2'><br/><div class='ui-state-default ui-corner-all' style='width: 50px; margin-left:150px;'><span class='ui-icon ui-icon-check smlbtn'></span></div></td></tr>";
	$("#attributes_table").append(save_button);
}

function addAttributeField(attribute, field, id, i)
{
	var parent = "field_"+id+"_attributes_table_td_"+i;
	
	switch(attribute.type){
		
		case "text":
		if(field[attribute.vtu] != ''){
			var link = "<a href='#' id='"+parent+"_link'>"+field[attribute.vtu]+"</a>";
			var form = "<input class='textfield_effect' style='display:none;' id='"+parent+"_form' type='text' size='15' value='"+field[attribute.vtu]+"'>";
		}else{
			var link = "<a href='#' id='"+parent+"_link'>Click Here to edit...</a>";
			var form = "<input class='textfield_effect' style='display:none;' id='"+parent+"_form' type='text' size='15'>";
		}
		$("#attributes_table").append("<tr class='ui-state-hover'><td width='50' class='attribute-label'>"+attribute.label+"</td><td width='150' id='"+parent+"' class='attribute-field'>"+link+form+"</td></tr>");
		
		$("#"+parent+"_link").bind("click", function(e){
			switchLinkToField(parent, parent+"_form");
		});
		
		$("#"+parent+"_form").bind("blur", function(e){
			switchLinkToField(parent, parent+"_form");
			if($("#"+parent+"_form").attr('value') != ''){
			fields[id][attribute.vtu] = $("#"+parent+"_form").attr('value');
			$("#"+parent+"_link").text($("#"+parent+"_form").attr('value'));
			
			if(attribute.ftu != ''){
			var update_fields = attribute.ftu.split(",");
			var update_attributes = attribute.atu.split(",");
			for(var z=0; z<update_fields.length; z++)
			{
				if(update_attributes[z] == "text"){
					$("#field_"+id+update_fields[z]).text($("#"+parent+"_form").attr('value'));
				}else{
					$("#field_"+id+update_fields[z]).attr(update_attributes[z], $("#"+parent+"_form").attr('value'));
				}
			}
			}
			
			}
		});
		
		break;
		
		case "select":
		
		var options = attribute.options.split(",");
		var options_values = attribute.options_values.split(",");
		
		var select = "<select class='selectfield_effect' name='"+parent+"_select' id='"+parent+"_select'>";
		for(var z=0; z<options.length;z++)
		{
			select += "<option value='"+options_values[z]+"'";
			if(field[attribute.vtu] != ''){
			if(options_values[z] == field[attribute.vtu]) select += " selected='SELECTED'";
			}else{
			if(options_values[z] == attribute.default_value) select += " selected='SELECTED'";
			}
			select += ">"+options[z]+"</option>";
		}
		select += "</select>";
		
		$("#attributes_table").append("<tr class='ui-state-hover'><td width='50' class='attribute-label'>"+attribute.label+"</td><td width='150' id='"+parent+"' class='attribute-field'>"+select+"</td></tr>");
		
		$("#"+parent+"_select").bind("change", function(e){
		fields[id][attribute.vtu] = $("#"+parent+"_select").attr('value');
		});
		
		break;
		
		case "textarea":
		
		//if(field[attribute.vtu] != ''){
		var textarea = "<textarea class='textarea_effect' name='"+parent+"_textarea' id='"+parent+"_textarea' cols='15' rows='4'>"+field[attribute.vtu]+"</textarea>";
		//}else{
		//var textarea = "<textarea class='textarea_effect' name='"+parent+"_textarea' id='"+parent+"_textarea' cols='15' rows='4'>option1, option2, option3</textarea>";	
		//}
		$("#attributes_table").append("<tr class='ui-state-hover'><td width='50' class='attribute-label'>"+attribute.label+"</td><td width='150' id='"+parent+"' class='attribute-field'>"+textarea+"</td></tr>");
		
		$("#"+parent+"_textarea").bind("blur", function(e){
			if($("#"+parent+"_textarea").attr('value') != ''){
			fields[id][attribute.vtu] = ($("#"+parent+"_textarea").attr('value')).replace(/'/g,"\"");;
			
			if(attribute.ftu != ''){
			var update_fields = attribute.ftu.split(",");
			var update_attributes = attribute.atu.split(",");
			for(var z=0; z<update_fields.length; z++)
			{
				
				switch (attribute.ftut){
					case "checkbox":
						var data = $("#"+parent+"_textarea").attr('value').split(",");
						$("#field_"+id+update_fields[z]).empty();
						for(var y=0;y<data.length;y++)
						{
							var checkbox = "<input type='checkbox' name='#field_"+id+update_fields[z]+"_checkbox' value='"+data[y]+"'> "+data[y]+"<br />";
							$("#field_"+id+update_fields[z]).append(checkbox);
						}
					
					break;
					case "select":
						var data = $("#"+parent+"_textarea").attr('value').split(",");
						$("#field_"+id+update_fields[z]).empty();
						var select = "<select name='#field_"+id+update_fields[z]+"_select'>";
						for(var y=0;y<data.length;y++)
						{
							var option = "<option> "+data[y]+"</option>";
							select += option;
						}
						select += "</select>";
					$("#field_"+id+update_fields[z]).append(select);
					break;
					case "radio":
						var data = $("#"+parent+"_textarea").attr('value').split(",");
						$("#field_"+id+update_fields[z]).empty();
						for(var y=0;y<data.length;y++)
						{
							var radio = "<input type='radio' name='#field_"+id+update_fields[z]+"_radio' value='"+data[y]+"'> "+data[y]+"<br />";
							$("#field_"+id+update_fields[z]).append(radio);
						}
	
					break;
					default:
					if(update_attributes[z] == "text"){
						$("#field_"+id+update_fields[z]).text($("#"+parent+"_textarea").attr('value'));
					}else{
						$("#field_"+id+update_fields[z]).attr(update_attributes[z], $("#"+parent+"_textarea").attr('value'));
					}
					break;
				}
				
				
			}
			}
			
			}
		});
		break;
	}
	
}

function switchLinkToField(parent, form)
{
	$("#"+parent+" > *").toggle();
	$("#"+form).focus();
}


//controls functions 
function addHeader(field, field_object)
{
	var parent = field.attr('id')+"_div_td";
	var attr_parent = field.attr('id')+"_attributes_table_td";		

	var link = "<a href='#' id='"+parent+"_link'>Click Here to edit...</a>";
	var form = "<input style='display:none;' id='"+parent+"_form' type='text' size='40'>";
	$("#"+parent).append(link);
	$("#"+parent).append(form);
	

	
	$("#"+parent+"_link").bind("click", function(e){
		switchLinkToField(parent, attr_parent+"_form");
	});
	
	$("#"+parent+"_form").bind("blur", function(e){
		if($("#"+parent+"_form").attr('value') != ''){
		field_object.field_label = $("#"+parent+"_form").attr('value');
		$("#"+parent+"_link").text($("#"+parent+"_form").attr('value'));
		reloadAttributes(field_object.field_type, field_object.field_id);
		}
		switchLinkToField(parent, attr_parent+"_form");
	});
	
	//loading default values here
	if(field_object.field_label)
	{
		$("#"+parent+"_link").text(field_object.field_label);
		$("#"+parent+"_form").attr('value',field_object.field_label);
	}
}

function addText(field, field_object)
{
	var parent = field.attr('id')+"_div_td";
	var attr_parent = field.attr('id')+"_attributes_table_td";		

	var link = "<a href='#' id='"+parent+"_link'>Click Here to edit...</a>";
	var form = "<input style='display:none;' id='"+parent+"_form' type='text' size='40'>";
	$("#"+parent).append(link);
	$("#"+parent).append(form);
	

	
	$("#"+parent+"_link").bind("click", function(e){
		switchLinkToField(parent, attr_parent+"_form");
	});
	
	$("#"+parent+"_form").bind("blur", function(e){
		if($("#"+parent+"_form").attr('value') != ''){
		field_object.field_label = $("#"+parent+"_form").attr('value');
		$("#"+parent+"_link").text($("#"+parent+"_form").attr('value'));
		reloadAttributes(field_object.field_type, field_object.field_id);
		}
		switchLinkToField(parent, attr_parent+"_form");
	});
	
	//loading default values here
	if(field_object.field_label)
	{
		$("#"+parent+"_link").text(field_object.field_label);
		$("#"+parent+"_form").attr('value',field_object.field_label);
	}
}

function addTextfield(field, field_object)
{
	var parent = field.attr('id')+"_div_td";
	var attr_parent = field.attr('id')+"_attributes_table_td";		
	
	var new_table = "<table><tr><td width='200' id='"+parent+"_left'></td><td width='200' id='"+parent+"_right'></tr></table>";
	
	$("#"+parent).append(new_table);
	var parent_left = parent+"_left";
	var parent_right = parent+"_right";

	var link = "<a href='#' id='"+parent+"_link'>Click Here to edit...</a>";
	var form = "<input style='display:none;' id='"+parent+"_form' type='text' size='15'>";
	$("#"+parent_left).append(link);
	$("#"+parent_left).append(form);
	
	var form_field = "<input type='text' name='"+parent+"_form_field'  id='"+parent+"_form_field' value='' size=''>"; 
	$("#"+parent_right).append(form_field);
	
	$("#"+parent+"_link").bind("click", function(e){
		switchLinkToField(parent_left, parent+"_form");
	});
	
	$("#"+parent+"_form").bind("blur", function(e){
		if($("#"+parent+"_form").attr('value') != ''){
		field_object.field_label = $("#"+parent+"_form").attr('value');
		$("#"+parent+"_link").text($("#"+parent+"_form").attr('value'));
		
		reloadAttributes(field_object.field_type, field_object.field_id);
		}
		switchLinkToField(parent_left, parent+"_form");
	});
	
	$("#"+parent+"_form_field").bind("blur", function(e){
		if($("#"+parent+"_form_field").attr('value') != ''){
		field_object.field_value = $("#"+parent+"_form_field").attr('value');
		reloadAttributes(field_object.field_type, field_object.field_id);
		}
	});
	
	//loading default values here
	if(field_object.field_label)
	{
		$("#"+parent+"_link").text(field_object.field_label);
		$("#"+parent+"_form").attr('value',field_object.field_label);
	}
	if(field_object.field_value)
	{
		$("#"+parent+"_form_field").attr('value',field_object.field_value);
	}
	
}

function addTextarea(field, field_object)
{
	var parent = field.attr('id')+"_div_td";
	var attr_parent = field.attr('id')+"_attributes_table_td";		
	
	var new_table = "<table><tr><td width='200' id='"+parent+"_left'></td><td width='200' id='"+parent+"_right'></tr></table>";
	
	$("#"+parent).append(new_table);
	var parent_left = parent+"_left";
	var parent_right = parent+"_right";

	var link = "<a href='#' id='"+parent+"_link'>Click Here to edit...</a>";
	var form = "<input style='display:none;' id='"+parent+"_form' type='text' size='15'>";
	$("#"+parent_left).append(link);
	$("#"+parent_left).append(form);
	
	var form_field = "<textarea name='"+parent+"_form_field'  id='"+parent+"_form_field' cols='17' rows='4'></textarea>"; 
	$("#"+parent_right).append(form_field);
	
	$("#"+parent+"_link").bind("click", function(e){
		switchLinkToField(parent_left, parent+"_form");
	});
	
	$("#"+parent+"_form").bind("blur", function(e){
		if($("#"+parent+"_form").attr('value') != ''){
		field_object.field_label = $("#"+parent+"_form").attr('value');
		$("#"+parent+"_link").text($("#"+parent+"_form").attr('value'));
		
		reloadAttributes(field_object.field_type, field_object.field_id);
		}
		switchLinkToField(parent_left, parent+"_form");
	});
	
	$("#"+parent+"_form_field").bind("blur", function(e){
		if($("#"+parent+"_form_field").attr('value') != ''){
		field_object.field_value = $("#"+parent+"_form_field").attr('value');
		reloadAttributes(field_object.field_type, field_object.field_id);
		}
	});
	
	//loading default values here
	if(field_object.field_label)
	{
		$("#"+parent+"_link").text(field_object.field_label);
		$("#"+parent+"_form").attr('value',field_object.field_label);
	}
	if(field_object.field_value)
	{
		$("#"+parent+"_form_field").text(field_object.field_value);
	}
	
}

function addCheckbox(field, field_object)
{
	var parent = field.attr('id')+"_div_td";
	var attr_parent = field.attr('id')+"_attributes_table_td";		
	
	var new_table = "<table><tr><td width='200' id='"+parent+"_left'></td><td width='200' id='"+parent+"_right'></tr></table>";
	
	$("#"+parent).append(new_table);
	var parent_left = parent+"_left";
	var parent_right = parent+"_right";

	var link = "<a href='#' id='"+parent+"_link'>Click Here to edit...</a>";
	var form = "<input style='display:none;' id='"+parent+"_form' type='text' size='15'>";
	$("#"+parent_left).append(link);
	$("#"+parent_left).append(form);
	
	for(var z=0;z<3;z++)
	{
		var form_field = "<input type='checkbox' name='"+parent+"_checkbox' value='Option "+z+"'>Option "+z+"<br/>"; 
		$("#"+parent_right).append(form_field);
	}
	
	
	$("#"+parent+"_link").bind("click", function(e){
		switchLinkToField(parent_left, parent+"_form");
	});
	
	$("#"+parent+"_form").bind("blur", function(e){
		if($("#"+parent+"_form").attr('value') != ''){
		field_object.field_label = $("#"+parent+"_form").attr('value');
		$("#"+parent+"_link").text($("#"+parent+"_form").attr('value'));
		
		reloadAttributes(field_object.field_type, field_object.field_id);
		}
		switchLinkToField(parent_left, parent+"_form");
	});
		
		//loading default values here
		if(field_object.field_label)
		{
			$("#"+parent+"_link").text(field_object.field_label);
			$("#"+parent+"_form").attr('value',field_object.field_label);
		}
		if(field_object.field_value)
		{
				var data = field_object.field_value.split(",");
				$("#"+parent_right).empty();
				for(var y=0;y<data.length;y++)
				{
					var checkbox = "<input type='checkbox' name='"+parent+"_checkbox' value='"+data[y]+"'> "+data[y]+"<br />";
					$("#"+parent_right).append(checkbox);
				}
		}
		
}

function addRadio(field, field_object)
{
	var parent = field.attr('id')+"_div_td";
	var attr_parent = field.attr('id')+"_attributes_table_td";		
	
	var new_table = "<table><tr><td width='200' id='"+parent+"_left'></td><td width='200' id='"+parent+"_right'></tr></table>";
	
	$("#"+parent).append(new_table);
	var parent_left = parent+"_left";
	var parent_right = parent+"_right";

	var link = "<a href='#' id='"+parent+"_link'>Click Here to edit...</a>";
	var form = "<input style='display:none;' id='"+parent+"_form' type='text' size='15'>";
	$("#"+parent_left).append(link);
	$("#"+parent_left).append(form);
	
	for(var z=0;z<3;z++)
	{
		var form_field = "<input type='radio' name='"+parent+"_checkbox' value='Option "+z+"'>Option "+z+"<br/>"; 
		$("#"+parent_right).append(form_field);
	}
	
	
	$("#"+parent+"_link").bind("click", function(e){
		switchLinkToField(parent_left, parent+"_form");
	});
	
	$("#"+parent+"_form").bind("blur", function(e){
		if($("#"+parent+"_form").attr('value') != ''){
		field_object.field_label = $("#"+parent+"_form").attr('value');
		$("#"+parent+"_link").text($("#"+parent+"_form").attr('value'));
		
		reloadAttributes(field_object.field_type, field_object.field_id);
		}
		switchLinkToField(parent_left, parent+"_form");
	});
		
		//loading default values here
		if(field_object.field_label)
		{
			$("#"+parent+"_link").text(field_object.field_label);
			$("#"+parent+"_form").attr('value',field_object.field_label);
		}
		if(field_object.field_value)
		{
				var data = field_object.field_value.split(",");
				$("#"+parent_right).empty();
				for(var y=0;y<data.length;y++)
				{
					var radio = "<input type='radio' name='"+parent+"_radio' value='"+data[y]+"'> "+data[y]+"<br />";
					$("#"+parent_right).append(radio);
				}
		}
		
}

function addSelect(field, field_object)
{
	var parent = field.attr('id')+"_div_td";
	var attr_parent = field.attr('id')+"_attributes_table_td";		
	
	var new_table = "<table><tr><td width='200' id='"+parent+"_left'></td><td width='200' id='"+parent+"_right'></tr></table>";
	
	$("#"+parent).append(new_table);
	var parent_left = parent+"_left";
	var parent_right = parent+"_right";

	var link = "<a href='#' id='"+parent+"_link'>Click Here to edit...</a>";
	var form = "<input style='display:none;' id='"+parent+"_form' type='text' size='15'>";
	$("#"+parent_left).append(link);
	$("#"+parent_left).append(form);
	var form_field = "<select name='"+parent+"_checkbox'>";
	for(var z=0;z<3;z++)
	{
		form_field += "<option>Option "+z+"</option>"; 
		
	}
	form_field += "</select>";
	$("#"+parent_right).append(form_field);
	$("#"+parent+"_link").bind("click", function(e){
		switchLinkToField(parent_left, parent+"_form");
	});
	
	$("#"+parent+"_form").bind("blur", function(e){
		if($("#"+parent+"_form").attr('value') != ''){
		field_object.field_label = $("#"+parent+"_form").attr('value');
		$("#"+parent+"_link").text($("#"+parent+"_form").attr('value'));
		
		reloadAttributes(field_object.field_type, field_object.field_id);
		}
		switchLinkToField(parent_left, parent+"_form");
	});
		
		//loading default values here
		if(field_object.field_label)
		{
			$("#"+parent+"_link").text(field_object.field_label);
			$("#"+parent+"_form").attr('value',field_object.field_label);
		}
		if(field_object.field_value)
		{
				var data = field_object.field_value.split(",");
				$("#"+parent_right).empty();
				var select = "<select name='"+parent_right+"_select'>";
				for(var y=0;y<data.length;y++)
				{
					var option = "<option> "+data[y]+"</option>";
					select += option;
				}
				select += "</select>";
			$("#"+parent_right).append(select);
		}
		
}

function addDate(field, field_object)
{
	var parent = field.attr('id')+"_div_td";
	var attr_parent = field.attr('id')+"_attributes_table_td";		
	
	var new_table = "<table><tr><td width='200' id='"+parent+"_left'></td><td width='200' id='"+parent+"_right'></tr></table>";
	
	$("#"+parent).append(new_table);
	var parent_left = parent+"_left";
	var parent_right = parent+"_right";

	var link = "<a href='#' id='"+parent+"_link'>Click Here to edit...</a>";
	var form = "<input style='display:none;' id='"+parent+"_form' type='text' size='15'>";
	$("#"+parent_left).append(link);
	$("#"+parent_left).append(form);
	
	var form_field = "<input type='text' name='"+parent+"_form_field'  id='"+parent+"_form_field'>"; 
	$("#"+parent_right).append(form_field);
	
	$("#"+parent+"_link").bind("click", function(e){
		switchLinkToField(parent_left, parent+"_form");
	});
	
	$("#"+parent+"_form").bind("blur", function(e){
		if($("#"+parent+"_form").attr('value') != ''){
		field_object.field_label = $("#"+parent+"_form").attr('value');
		$("#"+parent+"_link").text($("#"+parent+"_form").attr('value'));
		
		reloadAttributes(field_object.field_type, field_object.field_id);
		}
		switchLinkToField(parent_left, parent+"_form");
	});
	
	$("#"+parent+"_form_field").datepicker();
	
	//loading default values here
	if(field_object.field_label)
	{
		$("#"+parent+"_link").text(field_object.field_label);
		$("#"+parent+"_form").attr('value',field_object.field_label);
	}
	if(field_object.field_value)
	{
		$("#"+parent+"_form_field").attr('value',field_object.field_value);
	}
	
}

function addButton(field, field_object)
{
	var parent = field.attr('id')+"_div_td";
	var attr_parent = field.attr('id')+"_attributes_table_td";		
	
	var new_table = "<table><tr><td width='200' id='"+parent+"_left'></td><td width='200' id='"+parent+"_right'></tr></table>";
	
	$("#"+parent).append(new_table);
	var parent_left = parent+"_left";
	var parent_right = parent+"_right";

	var link = "<a href='#' id='"+parent+"_link'>Click Here to edit...</a>";
	var form = "<input style='display:none;' id='"+parent+"_form' type='text' size='15'>";
	$("#"+parent_left).append(link);
	$("#"+parent_left).append(form);
	
	var form_field = "<input type='submit' name='"+parent+"_form_field'  id='"+parent+"_form_field' value='Submit'>"; 
	$("#"+parent_right).append(form_field);
	
	$("#"+parent+"_link").bind("click", function(e){
		switchLinkToField(parent_left, parent+"_form");
	});
	
	$("#"+parent+"_form").bind("blur", function(e){
		if($("#"+parent+"_form").attr('value') != ''){
		field_object.field_label = $("#"+parent+"_form").attr('value');
		$("#"+parent+"_link").text($("#"+parent+"_form").attr('value'));
		
		reloadAttributes(field_object.field_type, field_object.field_id);
		}
		switchLinkToField(parent_left, parent+"_form");
	});
	
	//loading default values here
	if(field_object.field_label)
	{
		$("#"+parent+"_link").text(field_object.field_label);
		$("#"+parent+"_form").attr('value',field_object.field_label);
	}
	if(field_object.field_value)
	{
		$("#"+parent+"_form_field").attr('value',field_object.field_value);
	}
	
}

function addHtmltag(field, field_object)
{
	var parent = field.attr('id')+"_div_td";
	var attr_parent = field.attr('id')+"_attributes_table_td";		

	var form = "<textarea id='"+parent+"_form_field' cols='40' rows='2'></textarea>";
	$("#"+parent).append(form);
	
	
	$("#"+parent+"_form_field").bind("blur", function(e){
		if($("#"+parent+"_form_field").attr('value') != ''){
		field_object.field_value = ($("#"+parent+"_form_field").attr('value')).replace(/'/g,"\"");
		reloadAttributes(field_object.field_type, field_object.field_id);
		}
	});
	
	//loading default values here
	if(field_object.field_value)
	{
		$("#"+parent+"_form_field").attr('value',field_object.field_value);
	}
}