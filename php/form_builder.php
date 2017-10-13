<?php defined('SYSPATH') or die('No direct script access.');

/*
 * Kohana 2.1 helper class for building and validating admin forms.
 *   Properties are set and methods called from the controllers or the views.
 * @author John C. Scott
 * @copyright Youreeeka! 2009
 */
class form_builder_Core {
	const MAX_FILE_SIZE = '3145728'; // 3megs?

	// Form Elements Lists
	protected static $inputs_list = array();
	protected static $zero_one_checkboxes_list = array();
	protected static $dropdowns_list = array();
	protected static $text_inputs_list = array();
	protected static $upload_profile_image = array();
	protected static $uploads_list = array();

	// Utility Lists
	protected static $custom_labels = array();
	protected static $lists = array();
	protected static $post_values = array();
	protected static $sort_list = array();
	protected static $noscript_msg;

	// Paths
	protected static $image_path;

	/* 
	 * Yes, I probably could have used __set and __get methods here, but that 
	 * would have overwritten visibility and may have complicated debugging.
	 */
	
	/* 
	 * Set list of dropdown lists. 
	 * @param $key string name that corresponds to the db result field
	 * @param $data array simple array list of dropdown options
	 */
	public static function set_list($key, $data) {
		self::$lists[$key] = $data;
	}

	/* 
	 * Set sort list. Form elements will be displayed in this order.
	 * @param $data array simple array list of dropdown options
	 */
	public static function set_sort($data) {
		self::$sort_list = $data;
	}

	/* 
	 * Set noscript message.
	 * @param $data string text of noscript error.
	 */
	public static function set_noscript_msg($data) {
		self::$noscript_msg = $data;
	}

	/* 
	 * Set custom labels.
	 * @param $data array associative array of custom labels
	 * @usage array('field_name_str'=>'custom_label_str')
	 */
	public static function set_custom_labels($data) {
		self::$custom_labels = $data;
	}

	/* 
	 * Set form input elements list.
	 * @param $data array associative array of inputs and validation rules
	 * @usage array('field_name_str'=>'valid_rules_str')
	 */
	public static function set_inputs_list($data) {
		self::$inputs_list = $data;
	}

	/* 
	 * Set form select elements list.
	 * @param $data array associative array of inputs and validation rules
	 * @usage array('field_name_str'=>'valid_rules_str')
	 */
	public static function set_dropdowns_list($data) {
		self::$dropdowns_list = $data;
	}

	/* 
	 * Set form checkbox elements list. 
	 * These checkboxes have a boolean value of 0 or 1 only.
	 * @param $data array associative array of inputs and validation rules
	 * @usage array('field_name_str'=>'valid_rules_str')
	 */
	public static function set_zero_one_checkboxes_list($data) {
		self::$zero_one_checkboxes_list = $data;
	}

	/* 
	 * Set form textinput elements list.
	 * @param $data array associative array of inputs and validation rules
	 * @usage array('field_name_str'=>'valid_rules_str')
	 */
	public static function set_text_inputs_list($data) {
		self::$text_inputs_list = $data;
	}

	/* 
	 * Set upload profile images list.
	 * @param $data array simple array of profile image paths
	 */
	public static function set_upload_profile_image($data) {
		self::$upload_profile_image = $data;
	}

	/* 
	 * Set upload images list.
	 * @param $data array simple array of image paths
	 */
	public static function set_uploads_list($data) {
		self::$uploads_list = $data;
	}

	/* 
	 * Set $_POST values to this array for processing.
	 * @param $data array $_POST array
	 */
	public static function set_post_values($data) {
		self::$post_values = $data;
	}

	/* 
	 * Append other values to this array for processing.
	 * @param $key string key name
	 * @param $data mixed value
	 */
	public static function append_post_values($key, $value) {
		self::$post_values[$key] = htmlspecialchars(strip_tags($value));
		return self::$post_values;
	}

	/* 
	 * Format field names to human readable labels.
	 * @param $key string field name
	 */
	public static function pretty_label($key) {
		$label = null;
		if(array_key_exists($key, self::$custom_labels)) {
			// Use custom label
			$label = self::$custom_labels[$key];
		} else {
			// Strip out any '_id' for label text.
			$str = str_replace('_id', '', $key);
			// Turn key into pretty label.
			$label = ucwords(str_replace('_', ' ', $str));
		}
		return $label;
	}

	/* 
	 * Set base path for uploaded images.
	 * @param $data string path
	 */
	public static function set_image_path($data) {
		self::$image_path = $data;
	}

	/* 
	 * Format rules array as Kohona's Validation class expects.
	 */
	public static function make_rules(){
		$rules = array();
		$thelists = self::_merge_form_lists();
		foreach($thelists as $key=>$value){
			if(!empty($thelists[$key])) {
				$value = (is_array($value)) ? implode("|", $value) : $value;
				$rules[$key] = array(self::pretty_label($key), $value);
			}
		}
		return $rules;
	}

	/* 
	 * Merge form elements for Kohona's Validation class to process.
	 */
	protected static function _merge_form_lists(){
		$thelists = array();
		$thelists = array_merge(
			self::$inputs_list,
			self::$dropdowns_list,
			self::$text_inputs_list,
			self::$zero_one_checkboxes_list,
			self::$upload_profile_image,
			self::$uploads_list
			);
		return $thelists;
	}

	/* 
	 * Empty form elements.
	 */
	protected static function _empty_form_elements(){
		$thelists = self::_merge_form_lists();
		$thekeys = array_keys($thelists);
		$thelists = array_fill_keys($thekeys, '');
		return $thelists;
	}

	/* 
	 * Sort form elements using the $sort_list array.
	 * @param $data array any form elements
	 */
	protected static function _sort_form($data){
		$new_data = array();
		foreach (self::$sort_list as $s) {
			foreach ($data as $key=>$val) {
				if($key === $s) $new_data[$key] = $val;
			}
		}
		return $new_data;
	}

	/*
	 * TODO: This method needs to be broken up and atomized.
	 */
	public static function build_form($data=null, $submitTxt=null) {
		$form = null;
		$form_data = (empty($data)) ? self::_empty_form_elements() : $data;
		if(!empty(self::$sort_list)) $form_data = self::_sort_form($form_data);
		if(!empty(self::$noscript_msg)) $form .= "<noscript>" . self::$noscript_msg . "</noscript>\n";
    	// MAX_FILE_SIZE must precede the file input field.
		if(self::MAX_FILE_SIZE > 0) $form .= form::hidden('MAX_FILE_SIZE', self::MAX_FILE_SIZE);
		foreach ($form_data as $key=>$value) {
			$value = self::_use_post_value($key, $value);
			$label = self::pretty_label($key);
			if(array_key_exists($key, self::$inputs_list)) {
				// Inputs
				$req = (strpos(self::$inputs_list[$key], 'required') === false) ? '' : '<span class="required">*</span>';
				$form .= '<p>';
				$form .= form::label($key, $req.$label);
				$form .= form::input($key, $value);
				$form .= '</p>'."\n";
			} else if(array_key_exists($key, self::$zero_one_checkboxes_list)) {
				// Checkboxes with values of 1 as true 0 as false
				$req = (strpos(self::$zero_one_checkboxes_list[$key], 'required') === false) ? '' : '<span class="required">*</span>';
				$form .= '<p>';
				$checked = ($value == 1) ? true : false;
				$form .= form::label($key, $req.$label);
				$form .= form::checkbox($key, 1, $checked);
				$form .= '</p>'."\n";
			} else if(array_key_exists($key, self::$dropdowns_list)) {
				// Dropdowns
				$req = (strpos(self::$dropdowns_list[$key], 'required') === false) ? '' : '<span class="required">*</span>';
				$selection = (isset(self::$lists[$key])) ? self::build_dropdown(self::$lists[$key]) : array();
				if (!empty($selection)) {
					$form .= '<p>';
					$form .= form::label($key, $req.$label);
					$form .= form::dropdown($key, $selection, $value);
					$form .= '</p>'."\n";
				}
			} else if(array_key_exists($key, self::$text_inputs_list)) {
				// Textarea
				$req = (strpos(self::$text_inputs_list[$key], 'required') === false) ? '' : '<span class="required">*</span>';
				$form .= '<p>';
				$form .= form::label($key, $req.$label);
				$form .= form::textarea(array('name' => $key, 'id' => $key, 'value' => $value, 'cols' => '12', 'rows' => '4'));
				$form .= '</p>'."\n";
			} else if(array_key_exists($key, self::$uploads_list)) {
				// Uploads
				$req = (strpos(self::$uploads_list[$key], 'required') === false) ? '' : '<span class="required">*</span>';
				$form .= '<p>';
				// Consider outputting the image data directly from the PHP script to the browser to get it to refresh properly.
				$form .= self::_show_img($key, $value, $label);
				$form .= form::label($key, $req.$label);
				$form .= form::upload($key, $value);
				$form .= '</p>'."\n";
			} else if(array_key_exists($key, self::$upload_profile_image)) {
				// Profile image Upload
				$req = (strpos(self::$upload_profile_image[$key], 'required') === false) ? '' : '<span class="required">*</span>';
				$nkey = 'image';
				$label = ucwords($nkey);
				$form .= '<p>';
				$form .= self::_show_img($key, $value, $label);
				$form .= form::label($nkey, $req.$label);
				$form .= form::upload($nkey, $value);
				$form .= '</p>'."\n";
			}
		}

		// Roles
		if(isset(self::$lists['roles'])) {
			$form .= form::open_fieldset();
			$form .= form::legend('Roles');
			$form .= self::build_roles();
			$form .= form::close_fieldset();
		}

		if($submitTxt) $form .= form::submit('submit', $submitTxt);

		return $form;
	}

	protected static function _show_img($key, $value, $label){
		if( ($value) && !empty(self::$image_path) ) {
			return '<img src="' . self::$image_path . $key . '" alt="' . $label . '" /><br />' . "\n";
		}
		return null;
	}

	public static function build_roles() {
		$roles = null;
		foreach (self::$lists['roles']->result(false) as $r) {
			$attr = array('name' => 'roles[]', 'id' => $r['name'], 'value' => $r['id']);
			if(in_array($r['name'], self::$lists['role_ids'], true) ) $attr['checked'] = 'checked';
			$roles .= '<p>';
			$roles .= form::label($r['name'], ucwords($r['name']));
			$roles .= form::checkbox($attr);
			$roles .= '</p>'."\n";
		}
		return $roles;
	}

	public static function build_dropdown($data) {
		$selection = array('' => '--choose--');
		if(is_object($data)) {
			foreach($data->result(false) as $item) {
				$selection[$item['id']] = $item['name'];
			}
		} else {
			foreach($data as $k => $v) {
				$selection[$k] = $v;
			}
		}
		return $selection;
	}

	/* 
	 * Inserts javascript needed to update a dropdown based on the selection of another 
	 * dropdown. This is typically used if you have a country list and a state list. 
	 * For example, selecting the United States from the country list will update the 
	 * state list with the 50 states. Selecting Canada will replace the 50 states with 
	 * the Canadian provinces.
	 *
	 * @param $method_path string path to ajax service
	 * @param $select_el string jQuery DOM reference of the source select element
	 * @param $target_el string jQuery DOM reference of the select element to change
	 *
	 * @usage echo form_builder::ajax_change_element('/service/ajax/users/state_select/', '#country_id', '#state_id');
	 */
	public static function ajax_change_element($method_path, $select_el, $target_el, $extra_value=null) {
		if($extra_value) $extra_value = ' + "/' . $extra_value . '"';
		$script = '<script type="text/javascript">' . "\n" . '// <![CDATA[' . "\n";
		$script .= "\t" . '$(document).ready(function() {' . "\n";
		$script .= "\t\t" . '$("' . $select_el . '").change(function() {' . "\n";
		$script .= "\t\t\t" . '$("' . $target_el . '").load("' . $method_path . '" + $(this).val()' . $extra_value . ');' . "\n";
		$script .= "\t\t" . '});' . "\n";
		$script .= "\t" . '});' . "\n";
		$script .= '// ]]>' . "\n" . '</script>' . "\n";
		return $script;
	}

	public static function get_data() {
		$uploads = array();
		foreach($_FILES as $k => $v){
			if (is_uploaded_file($_FILES[$k]['tmp_name'])) $uploads[$k] = $v;
		}
		return array_merge(self::$post_values, $uploads);
	}

	/* 
	 * if there are $_POST values, replace the form element value from the db.
	 * Because some browsers don't submit an upload path in $_POST, we won't 
	 * overwrite those values.
	 *  
	 * @param $key string key name
	 * @param $data mixed value
	 */
	protected static function _use_post_value($key, $value) {
		if( !empty(self::$post_values) && isset(self::$post_values[$key]) ) {
			$value = self::$post_values[$key];
		}
		return $value;
	}

	/* 
	 * Process the $_POST values.
	 *  
	 * @param $data array original $_POST array
	 */
	public static function prep_post($data) {
		// copy post into new array
		$new_post_array = array();
		foreach($data as $k=>$v) $new_post_array[$k] = htmlspecialchars(strip_tags($v));

		// add any unchecked checkboxes and give a value of zero
		foreach(self::$zero_one_checkboxes_list as $k=>$v) {
			if(!array_key_exists($k, $new_post_array)) $new_post_array[$k] = '0';
		}

		// Let's replace the stored post array with this revised one
		self::set_post_values($new_post_array);
		return self::$post_values;
	}
}

?>