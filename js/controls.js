var o;
var server_url = "/wp-content/plugins/wp-formcreator/server.php";
//header control and attributes /////////////////
var header = {
	name: "Header",
	class_name: "ui-accordion-header ui-helper-reset ui-state-default ui-corner-all btn",
	type: "header"
};

var att_header = [
	 o = {
		label: "Label",
		type: "text",
		ftu: "_div_td_link,_div_td_form",
		atu: "text,value",
		vtu: "field_label"
	}
];

//text control and attributes /////////////////
var text = {
	name: "Text",
	class_name: "ui-accordion-header ui-helper-reset ui-state-default ui-corner-all btn",
	type: "text"
};

var att_text = [
	 o = {
		label: "Label",
		type: "text",
		ftu: "_div_td_link,_div_td_form",
		atu: "text,value",
		vtu: "field_label"
	}
];

//testfield control and attributes /////////////////
var textfield = {
	name: "Text Field",
	class_name: "ui-accordion-header ui-helper-reset ui-state-default ui-corner-all btn",
	type: "textfield"
};

var att_textfield = [
	o = {
		label: "Label",
		type: "text",
		ftu: "_div_td_link,_div_td_form",
		atu: "text,value",
		vtu: "field_label"		
	},
	o = {
		label: "Value",
		type: "text",
		ftu: "_div_td_form_field",
		atu: "value",
		vtu: "field_value"
	},
	o = {
		label: "Size",
		type: "text",
		ftu: "",
		atu: "",
		vtu: "field_size"
	},
	o = {
		label: "Required",
		type: "select",
		vtu: "field_required",
		options: "no,yes",
		options_values: "0,1",
		default_value: "no"
	},
	o = {
		label: "Validation",
		type: "select",
		vtu: "field_validation",
		options: "all,letters,numbers,email",
		options_values: ",letters,numbers,email",
		default_value: "all"
	}
];

//textarea control and attributes /////////////////
var textarea = {
	name: "Text Area",
	class_name: "ui-accordion-header ui-helper-reset ui-state-default ui-corner-all btn",
	type: "textarea"
};

var att_textarea = [
	o = {
		label: "Label",
		type: "text",
		ftu: "_div_td_link,_div_td_form",
		atu: "text,value",
		vtu: "field_label"		
	},
	o = {
		label: "Value",
		type: "text",
		ftu: "_div_td_form_field",
		atu: "text",
		vtu: "field_value"
	},
	o = {
		label: "Cols",
		type: "text",
		ftu: "",
		atu: "",
		vtu: "field_cols"
	},
	o = {
		label: "Rows",
		type: "text",
		ftu: "",
		atu: "",
		vtu: "field_rows"
	},
	o = {
		label: "Required",
		type: "select",
		vtu: "field_required",
		options: "no,yes",
		options_values: "0,1",
		default_value: "no"
	},
	o = {
		label: "Validation",
		type: "select",
		vtu: "field_validation",
		options: "all,letters,numbers,email",
		options_values: ",letters,numbers,email",
		default_value: "all"
	}
];

//checkbox control and attributes /////////////////
var checkbox = {
	name: "Checkbox",
	class_name: "ui-accordion-header ui-helper-reset ui-state-default ui-corner-all btn",
	type: "checkbox"
};

var att_checkbox = [
	o = {
		label: "Label",
		type: "text",
		ftu: "_div_td_link,_div_td_form",
		atu: "text,value",
		vtu: "field_label"		
	},
	o = {
		label: "Options",
		type: "textarea",
		ftut: "checkbox",
		ftu: "_div_td_right",
		atu: "",
		vtu: "field_value"
	},
	o = {
		label: "Required",
		type: "select",
		vtu: "field_required",
		options: "no,yes",
		options_values: "0,1",
		default_value: "no"
	}
];


//radio control and attributes /////////////////
var radio = {
	name: "Radio Button",
	class_name: "ui-accordion-header ui-helper-reset ui-state-default ui-corner-all btn",
	type: "radio"
};

var att_radio = [
	o = {
		label: "Label",
		type: "text",
		ftu: "_div_td_link,_div_td_form",
		atu: "text,value",
		vtu: "field_label"		
	},
	o = {
		label: "Options",
		type: "textarea",
		ftut: "radio",
		ftu: "_div_td_right",
		atu: "",
		vtu: "field_value"
	},
	o = {
		label: "Required",
		type: "select",
		vtu: "field_required",
		options: "no,yes",
		options_values: "0,1",
		default_value: "no"
	}
];


//select control and attributes /////////////////
var select = {
	name: "DropDown",
	class_name: "ui-accordion-header ui-helper-reset ui-state-default ui-corner-all btn",
	type: "select"
};

var att_select = [
	o = {
		label: "Label",
		type: "text",
		ftu: "_div_td_link,_div_td_form",
		atu: "text,value",
		vtu: "field_label"		
	},
	o = {
		label: "Options",
		type: "textarea",
		ftut: "select",
		ftu: "_div_td_right",
		atu: "",
		vtu: "field_value"
	},
	o = {
		label: "Required",
		type: "select",
		vtu: "field_required",
		options: "no,yes",
		options_values: "0,1",
		default_value: "no"
	}
];

//datepicker control and attributes /////////////////
var date = {
	name: "Date Picker",
	class_name: "ui-accordion-header ui-helper-reset ui-state-default ui-corner-all btn",
	type: "date"
};

var att_date = [
	o = {
		label: "Label",
		type: "text",
		ftu: "_div_td_link,_div_td_form",
		atu: "text,value",
		vtu: "field_label"		
	},
	o = {
		label: "Required",
		type: "select",
		vtu: "field_required",
		options: "no,yes",
		options_values: "0,1",
		default_value: "no"
	}
];

//button control and attributes /////////////////
var button = {
	name: "Button",
	class_name: "ui-accordion-header ui-helper-reset ui-state-default ui-corner-all btn",
	type: "button"
};

var att_button = [
	o = {
		label: "Label",
		type: "text",
		ftu: "_div_td_link,_div_td_form",
		atu: "text,value",
		vtu: "field_label"		
	},
	o = {
		label: "Value",
		type: "text",
		ftu: "_div_td_form_field",
		atu: "value",
		vtu: "field_value"
	},
	o = {
		label: "Reset",
		type: "select",
		vtu: "field_isreset",
		options: "no,yes",
		options_values: "0,1",
		default_value: "no"
	}
];

//html tag control and attributes /////////////////
var htmltag = {
	name: "HTMLtag",
	class_name: "ui-accordion-header ui-helper-reset ui-state-default ui-corner-all btn",
	type: "htmltag"
};

var att_htmltag = [
	o = {
		label: "Value",
		type: "textarea",
		ftut: "textarea",
		ftu: "_div_td_form_field",
		atu: "value",
		vtu: "field_value"
	}
];


var controls = [header, text, textfield, textarea, checkbox, radio, select, date, button, htmltag];

var attributes = new Array();
attributes['header'] = att_header;
attributes['text'] = att_text;
attributes['textfield'] = att_textfield;
attributes['textarea'] = att_textarea;
attributes['checkbox'] = att_checkbox;
attributes['radio'] = att_radio;
attributes['select'] = att_select;
attributes['date'] = att_date;
attributes['button'] = att_button;
attributes['htmltag'] = att_htmltag;


var fields = new Array();
var fields_counter = 0;