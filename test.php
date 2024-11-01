<?php
mysql_connect('localhost', 'root', '') or die(mysql_error());
mysql_select_db('formcreator') or die(mysql_error());
//if(!$_POST['action']) die('error');

switch($_POST['action']){
	case 'save':
	$id = saveForm();
	echo $id;
	break;
	
	case 'getForms':
	$forms = getFormsList();
	echo $forms;
	break;
	
	case 'loadForm':
	$form = loadForm();
	echo $form;
	break;
}

function loadForm()
{
	if(!$_POST['id']) die('error');
	
	$query = mysql_query("SELECT * FROM fc_forms WHERE id=".$_POST['id']);
	$form = mysql_fetch_assoc($query);
	
	$fields = array();
	
	$query = mysql_query("SELECT * FROM fc_fields WHERE form_id=".$_POST['id']." ORDER BY field_order");
	while($field = mysql_fetch_assoc($query))
	{
		$field_data = unserialize($field['field_data']);
		$fields[] = $field_data;
	}
	$data = array('settings' => $form, 'fields' => $fields);
	return JSON_encode($data);
}

function getFormslist()
{
	$forms = array();
	$query = mysql_query("SELECT * FROM fc_forms ORDER BY id DESC") or die (mysql_error());
	while($form = mysql_fetch_assoc($query)){
		$forms[] = $form;
	}
	
	$forms_encoded = JSON_encode($forms);
	return $forms_encoded;
}

function saveForm(){
if(!$_POST['form']) die('error');
$form = JSON_decode(stripslashes($_POST['form']));
if(!$form->settings->form_name) die('error');

$id = $form->settings->form_id;
if($id){
	$query = mysql_query("UPDATE fc_forms SET name = '{$form->settings->form_name}', emails = '{$form->settings->form_emails}' WHERE id=$id") or die(mysql_error());
}else{
	$query = mysql_query("INSERT INTO fc_forms SET name = '{$form->settings->form_name}', emails = '{$form->settings->form_emails}'") or die(mysql_error());
	$id = mysql_insert_id();
}

$delete_fields = mysql_query("DELETE FROM fc_fields WHERE form_id=$id") or die(mysql_error());

foreach($form->fields as $field)
{
	if(!$field->field_type) continue;

	$add_field = mysql_query("INSERT INTO fc_fields SET form_id=$id, field_id={$field->field_id}, field_type='{$field->field_type}', field_order={$field->field_order}, field_data='".serialize($field)."'") or die(mysql_error());
}

return $id;
}
?>