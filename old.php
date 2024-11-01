<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
		<title>jQuery UI Example Page</title>
		<link type="text/css" href="css/sunny/jquery-sunny.css" rel="stylesheet" />	
		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/jqueryui.js"></script>
		<script type="text/javascript" src="js/controls.js"></script>
		<script type="text/javascript" src="js/functions.js"></script>
		<style type="text/css">
			.btn {margin: 5px; padding-left:20px;}
			.fld {margin: 10px; padding:10px; padding-left:20px;}
			.header-div {font-size: 120%;}
			.text-div {font-size: 80%;}
			.menu-item {font-size: 12px; padding-top: 4px; padding-bottom: 1px; padding-left:5px; padding-right: 5px; margin-left: 5px; margin-right:5px;}
			#controls {padding: 5px; }
			#controls div {margin: 5px; width: 180px;}
			#form {width: 400px; height: 800px}
			#attributes_header {padding-left: 10px;}
			#attributes {padding-left:5px;}
			#formPanel {padding:5px;}
			.formPanel-div {padding:5px; margin:5px;}
			.attribute-field {font-family: Segoe UI, Arial, sans-serif; font-size: 12px;}
			.attribute-label {font-family: Segoe UI, Arial, sans-serif; font-size: 12px;}
			.textfield_effect    {
			    /*we will first set the border styles.*/
			    border-width: 1px;
			    border-style: solid;
			    border-color: #999999;
			    /*I am going to add some text formatting of my own*/
			    font-family: Arial, Helvetica, sans-serif;
			    font-size: 11px;
			    color: #333333;
			    width: 150px;
			    height: 11px;
			    }
			.selectfield_effect    {
			    /*we will first set the border styles.*/
			    border-width: 1px;
			    border-style: solid;
			    border-color: #999999;
			    /*I am going to add some text formatting of my own*/
			    font-family: Arial, Helvetica, sans-serif;
			    font-size: 11px;
			    color: #333333;
			    width: 150px;
			    height: 15px;
			    }			
			#sortable { list-style-type: none; margin: 0; padding: 0; width: 60%; }
			#sortable li { margin: 0 3px 3px 3px; padding: 0.4em; padding-left: 1.5em; font-size: 1.4em; height: 18px; }
			#sortable li span { position: absolute; margin-left: -1.3em; }
			#drophere { width: 60%; background-color: #D6D6D6; height: 500px;}
			#draggable { width: 150px; height: 50px; padding: 0.5em; float: left; margin: 10px 10px 10px 0; }
			#draggable2 { width: 150px; height: 50px; padding: 0.5em; float: left; margin: 10px 10px 10px 0; }
			
			</style>
			<script type="text/javascript">
				$(function() {
					$("#form").sortable({
						receive: function(event, ui){
							addField(ui.helper.attr('id'));
						}
					});
					prepareMenu();
					generateFormPanel();
					generateControls();
				
				});
				
			</script>


	</head>
	<body>
<div id="form-creator">
	<div id="dialog" title="Are you sure?" style="display:none; font-size:11px;">
		<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0; "></span>Are you sure that you want remove this field ?</p>
	</div>
	
	<div id="saveDialogDiv" title="Message" style="display:none; font-size:11px;">
		<p id='saveDialog'>
			
		</p>
	</div>
	
	<div id="openDialogDiv" title="Open Form" style="display:none; font-size:11px;">
		<p>Select form to open</p>
		
	</div>
	
	
	<table >
		<tr><td colspan="2" class="ui-widget-header" valing='middle'> <span class="ui-state-default menu-item" id='menu_new'>New</span><span class="ui-state-default menu-item" id='menu_open'>Open</span> | <span class="ui-state-default menu-item" id='menu_save'>Save</span></td></tr>
		
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
</div>
	</body>
</html>


