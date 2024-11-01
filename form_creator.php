<?php
/*
Plugin Name: WP Form Creator
Plugin URI: http://www.ultimateidx.com/form-creator/
Description: <strong>WP Form Creator</strong> - Another fine <a href="http://www.UltimateIDX.com" target="_blank" title="WordPress Plug-in">WordPress Plugin</a> from The UltimateIDX&trade;. -- The WP Form Creator was designed to take all of the complexity out of creating usable forms in WordPress blogs by providing a nice drag and drop generation system. The final output is fully XHTML compliant and will adopt the design characteristics of your theme. For more details please visit the project page located at the <a href="http://www.ultimateidx.com/form-creator/" target="_blank" title="WordPress Form Creator">Form Creator Page</a>.  This version should be considered BETA.
Author: UltimateIDX Mack McMillan by Damian Danielczyk
Version: 0.9.8
Author URI: http://www.ultimateidx.com
*/

//////////////////////////////
/* admin_menu hook function */
//////////////////////////////

add_action('admin_menu', 'show_menucreator_option');
add_action('activate_wp-formcreator/form_creator.php', 'formcreator_install');
add_filter('the_content', 'search_forms_in_content');

wp_enqueue_script('json', '/wp-content/plugins/wp-formcreator/js/json.js');
wp_enqueue_script('jquerynew', '/wp-content/plugins/wp-formcreator/js/jquerynew.js');
wp_enqueue_script('jqueryui', '/wp-content/plugins/wp-formcreator/js/jqueryui.js');
wp_enqueue_script('controls', '/wp-content/plugins/wp-formcreator/js/controls.js');
wp_enqueue_script('functions', '/wp-content/plugins/wp-formcreator/js/functions.js');
wp_enqueue_script('run', '/wp-content/plugins/wp-formcreator/js/run.js');
//wp_enqueue_style('jquery_sunny', '/wp-content/plugins/wp-formcreator/css/sunny/jquery-sunny.css');
wp_enqueue_style('jquery_smoothness', '/wp-content/plugins/wp-formcreator/css/smoothness/jquery-ui-1.7.2.custom.css');
wp_enqueue_style('formcreator_custom', '/wp-content/plugins/wp-formcreator/css/custom.css');

global $form_already_sent;

$form_already_sent = false;
function formcreator_install()
{
    global $wpdb;
    $table = $wpdb->prefix."fc_forms";
    $structure = " CREATE TABLE $table (
					`id` INT NOT NULL AUTO_INCREMENT ,
					`name` VARCHAR(255) NOT NULL,
					`emails` TEXT NOT NULL,
					PRIMARY KEY ( `id` )
					) ENGINE = MYISAM ";
    $wpdb->query($structure);

	$table = $wpdb->prefix."fc_fields";
    $structure = " CREATE TABLE $table (
					`id` INT NOT NULL AUTO_INCREMENT ,
					`form_id` INT NOT NULL ,
					`field_id` INT NOT NULL ,
					`field_order` INT NOT NULL ,
					`field_data` VARCHAR(255) NOT NULL,
					`field_type` VARCHAR(255) NOT NULL,
					PRIMARY KEY ( `id` )
					) ENGINE = MYISAM ";
    $wpdb->query($structure);
}
function show_menucreator_option() {
if (function_exists('add_options_page')) {
	add_options_page("WP Form Creator", 
	"Form Creator", 8, "form_creator", 'formcreator_admin_options');
	}
}

////////////////////////////////
/* used when displaying admin */
////////////////////////////////

function formcreator_admin_options()
{
	show_form_creator();
}

///////////////////////////
/* Look for trigger text */
///////////////////////////

function search_forms_in_content($content) 
	{
	preg_match_all('/{formcreator_([^{}]*?)}/',$content,$tags_found);
	$tags_found = $tags_found[1];
	foreach($tags_found as $tag)
	$content=str_replace("{formcreator_".$tag."}",show_form_to_user($tag),$content);
	return $content;
}

///////////////////////////////////
/* form for the search criterias */
///////////////////////////////////
function show_form_creator() 
	{
	global $wpdb;
	//	echo '<link type="text/css" rel="stylesheet" href="' . get_bloginfo('wpurl') . '/wp-content/plugins/wp-formcreator/css/sunny/jquery-sunny.css" />';
	//	echo '<link type="text/css" rel="stylesheet" href="' . get_bloginfo('wpurl') . '/wp-content/plugins/wp-formcreator/css/custom.css" />';
		
echo '<div id="form-creator" class="form-creator" style="font-family: Segoe UI, Arial, sans-serif;">
	<div id="dialog" title="Are you sure?" style="display:none; font-size:11px;">
	<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0; "></span>Are you sure that you want remove this field ?</p>
	</div>

	<div id="saveDialogDiv" title="Message" style="display:none; font-size:11px;">
	<p id="saveDialog">
	</p>
	</div>

	<div id="openDialogDiv" title="Open Form" style="display:none; font-size:11px;">
	<p>Select form to open</p>
	</div>

	<table border="none" cellpadding="none" cellspacing="none">
	<tr><td colspan="2" class="ui-widget-header menu-bar" valing="middle"> <span class="ui-state-default menu-item" id="menu_new">New</span><span class="ui-state-default menu-item" id="menu_open">Open</span> | <span class="ui-state-default menu-item" id="menu_save">Save</span></td></tr>

	<tr>
	<td width="400" class="ui-widget-content">
	<div id="container">
	<div id="form" ></div>	
	</div></td>

	<td width="200" height="800" class="ui-widget-content" valign="top"><div id="bar" >
	<div id="attributes_header" class="ui-widget-header"><span >Form</span></div>
	<div id="formPanel" valign="top">
	</div>

	<div id="attributes_header" class="ui-widget-header"><span >Controls</span></div>
	<div id="controls" valign="top">
	</div>

	<div id="attributes_header" class="ui-widget-header"><span >Attributes</span></div>
	<div id="attributes">
	<table id="attributes_table" width="200">

	</table>
	</div>
	</div></td>
	</table>
	</div>';
}

function show_form_to_user($id)
{
global $wpdb, $form_already_sent;
$forms_table = $wpdb->prefix.'fc_forms';
$fields_table = $wpdb->prefix.'fc_fields';

if($_POST['form_sent'] == $id && !$form_already_sent)
{
	$form = mysql_fetch_assoc(mysql_query("SELECT * FROM $forms_table WHERE id=$id"));
	$b = '';
	foreach($_POST as $k=>$v)
	{
		if(!$_sender_email){
		if(strpos(strtolower($k),'email')) $sender_email = $v;
		if(strpos(strtolower($k),'e-mail')) $sender_email = $v;
		}
		$b.=$k.": ".$v."\r\n";
	}
	
	//$mail = new PHPMailer;
	$emails = explode(",",$form['emails']);
	foreach($emails as $e)
	{
	wp_mail($e, "WP From Creator - Form Submitted", $b);
	}
	
	echo '<p align="center">Form submitted successfully!</p>';
	
	$form_already_sent=true;	
	}else{

$fields_query = mysql_query("SELECT * FROM $fields_table WHERE form_id=$id ORDER BY field_order");
$ret = "\n"."<!--[Begin WP Form Creator Rendering]-->"."\n";
$ret .= "<div class='formcreator_div'>"."\n";
$ret .= "<form id='form_$id' action='' method='post' onsubmit='return formcreator_validate(\"form_$id\");'>"."\n";
while($field = mysql_fetch_assoc($fields_query))
{
	if(!$field['field_type']) continue;
	$field_data = unserialize($field['field_data']);
	$class='';
	$dclass = 'fc-'.$field['field_type'];
	if($field_data->field_required) $dclass.='-required';
	if($field_data->field_required) $class.=' required';
	if($field_data->field_validation) $class.=' '.$field_data->field_validation;
		
		/*
		$ret .= "<tr>";	
		$ret .= "<td  valign='top' width='120' class='".$field['field_type']."'";
		
		if($field['field_type'] == 'header' || $field['field_type'] =='text')
		$ret .= "colspan='2'";
		
		$ret .= "style='";
		if($field['field_type'] == 'header') $ret .= "font-size:150%;";
		
		$ret .= " padding:5px;' align='left' >";
		
		$ret .= "<span class='formfield-label'>".$field_data->field_label."</span>";
		$ret .= "</td>";
		
		if($field['field_type'] != 'header' && $field['field_type'] !='text')
		$ret .= "<td align='left' style='padding:5px;'>";
		*/
		
	switch($field['field_type']){
		// SELECT OUTPUT IS HERE
		case 'select':
		$ret .= "<div class='$dclass'>"."\n"."\t<label class='fc-".$field['field_type']."_label'>";
		$ret .= $field_data->field_label."</label>"."\n";
		$ret .= "\t"."<select id='form_".$id."_field_".$field_data->field_id."' name='".permalink($field_data->field_label)."' class='".$class."' />"."\n";
		foreach(explode(",",$field_data->field_value) as $opt)
		{
			$ret .= "\t"."<option value=''>".trim($opt)."</option>"."\n";
		}
		$ret .= "\t".'</select>'."\n";
		$ret .= "</div>"."\n\n";
		break;


		// CHECKBOX OUTPUT IS HERE
		case 'checkbox':
		$ret .= "<div class='$dclass'>"."\n"."\t<label class='fc-".$field['field_type']."_label'>";
		$ret .= $field_data->field_label."</label>"."\n";
		$ret .= "\t<div class='fc-checkboxgroup'>\n";
		foreach(explode(",",$field_data->field_value) as $radio)
		{
		//$ret .= "\t"."<span class='fc-boxoption'><input id='form_".$id."_field_".$field_data->field_id."' type='checkbox' name='".permalink($field_data->field_label)."' value='".trim($radio)."' class='".$class."' />".$radio.'';
		$ret .= "\t"."<span class='fc-boxoption'><input type='checkbox' name='".permalink($field_data->field_label)."' value='".trim($radio)."' class='".$class."' />".$radio.'';
		if(count(explode(",",$field_data->field_value)) > 2){
		$ret .= "</span>"."\n";
		}
		}
		$ret .= "\t</div>"."\n";
		$ret .= "</div>"."\n\n";
		break;


		// RADIO GROUP OUTPUT IS HERE
		case 'radio':
		$ret .= "<div class='$dclass'>"."\n"."\t<label class='fc-".$field['field_type']."_label'>";
		$ret .= $field_data->field_label."</label>"."\n";
		$ret .= "\t<div class='fc-radiogroup'>\n";
		foreach(explode(",",$field_data->field_value) as $radio)
		{
		//$ret .= "\t"."<span class='fc-radoption'><input id='form_".$id."_field_".$field_data->field_id."' type='radio' name='".permalink($field_data->field_label)."' value='".trim($radio)."' class='".$class."' />".$radio.'';
		$ret .= "\t"."<span class='fc-radoption'><input type='radio' name='".permalink($field_data->field_label)."' value='".trim($radio)."' class='".$class."' />".$radio.'';
		if(count(explode(",",$field_data->field_value)) > 2){
		$ret .= "</span>"."\n";
		}
		}
		$ret .= "\t</div>"."\n";
		$ret .= "</div>"."\n\n";
		break;


		// TEXTFIELD OUTPUT IS HERE
		case 'textfield':
		$ret .= "<div class='$dclass'>\n";
		$ret .= "\t<label class='fc-".$field['field_type']."_label'>";
		$ret .= $field_data->field_label."</label>"."\n";
			$ret .= "\t<input id='form_".$id."_field_".$field_data->field_id."' type='text' name='".permalink($field_data->field_label)."' value='".$field_data->field_value."' size='".$field_data->field_size."' class='".$class."' />"."\n";
		$ret .= "</div>"."\n\n";
		break;


		// TEXTAREA OUTPUT IS HERE
		case 'textarea':
		$ret .= "<div class='$dclass'>"."\n"."\t<label class='fc-".$field['field_type']."_label'>";
		$ret .= $field_data->field_label."</label>"."\n";
			$ret .= "\t<textarea id='form_".$id."_field_".$field_data->field_id."' name='".permalink($field_data->field_label)."' cols='".$field_data->field_cols."' rows='".$field_data->field_rows."' class='".$class."'>".$field_data->field_value."</textarea>"."\n";
		$ret .= "</div>"."\n\n";
		break;


		// BUTTON OUTPUT IS HERE
		case 'button':
		$ret .= "<div class='$dclass'>"."\n"."\t<label class='fc-".$field['field_type']."_label'>";
		$ret .= $field_data->field_label."</label>"."\n";
		$type = $field_data->field_isreset ? 'reset' : 'submit';
		$ret .= "\t<input id='form_".$id."_field_".$field_data->field_id."' type='".$type."' name='".permalink($field_data->field_label)."' value='".$field_data->field_value."'  class='".$class."' />"."\n";
		$ret .= "</div>"."\n\n";
		break;
		
		
		// DATEFIELD OUTPUT IS HERE
		case 'date':
		$ret .= "<div class='$dclass'>"."\n"."\t<label class='fc-".$field['field_type']."_label'>";
		$ret .= $field_data->field_label."</label>"."\n";
		$ret .= "\t<input id='form_".$id."_field_".$field_data->field_id."' type='text' name='".permalink($field_data->field_label)."' value='".$field_data->field_value."' size='".$field_data->field_size."' class='".$class." datepicker' />"."\n";
		$ret .= "</div>"."\n\n";
		break;
		
		
		// HTMLAREA OUTPUT IS HERE
		case 'htmltag':
		$ret .= $field_data->field_value;
		break;
		default:
		$ret .= "<div class='$dclass'>"."\n";
		$ret .= $field_data->field_label;
		$ret .= "</div>"."\n\n";
		break;
	}
//	if($field['field_type'] != 'header' && $field['field_type'] !='text')
//	$ret .= "</td>";
//	$ret .="</tr>";

	//echo "<div>".$field['field_type'].'</div>';
}
// IMPORTANT NOTICE - IMPORTANT NOTICE - IMPORTANT NOTICE - IMPORTANT NOTICE - IMPORTANT NOTICE
// TO REMOVE THE FOOTER LINK BACK PLEASE MAKE A DONATION ABOVE $5 TO ULTIMATEIDX.COM
// WE COUNT ON THE LINK BACK TO GENERATE INCOME NECESSARY TO PUBLISH ALL OF OUR FREE TOOLS.
// WE ARE FLEXIBLE ENOUGH TO ALLOW YOU TO REMOVE THE LINKBACK AND ASK FOR A SMALL DONATION IN RETURN TO HELP US BUILD AND UPDATE PLUGINS
// SEND YOUR DONATION TO SALES@ULTIMATEIDX.COM VIA PAYPAL

$ret .= "<input type='hidden' name='form_sent' id='hideinput' class='inputclass' value='$id' />"."\n";

$ret .= "<div style='height:8px; background-color:transparent'><a class='owner_link' href='http://www.ultimateidx.com' rel='external'>UltimateIDX.com</a></div>"."\n";
$ret .= "</form>"."\n";
$ret .= "</div>"."\n\n";
$ret .= "<!--[END WP Form Creator Rendering]-->"."\n";
	echo $ret."\n\r";
}
}

function permalink($string)
{
	$replaces = array(" ", "*", ",", ".", "/", ":","!", "?", "'");
	//$string = str_replace($replaces, "_", $string);
	return $string;
}
?>