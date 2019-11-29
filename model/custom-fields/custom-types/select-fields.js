
import { ButtonFields } from '../button-fields.js';

export class SelectFields extends ButtonFields  {

	renderHTML() {
		let html = '<select data-imp-field="' + this.content + '" name="' + this.nameValue + '">';

		this.options.forEach(option => {
			if (typeof option == 'object') {
				let {label, value, meta} = option;

				let optionElem = jQuery('<option value="' + value + '">' + label + '</option>');
				if (meta) {
					for (var prop in meta) {
						optionElem.attr('data-' + prop, meta[prop]);
					}
				}

				html += optionElem[0].outerHTML;
			} else {
				html += '<option value="' + option + '">' + option + '</option>';
			}
		});

		this.htmlElement = jQuery(this.defaultHTML + html + '</select></p>');
		return this.htmlElement;
	}

	validate(domElement) {
		const targetElement = domElement.find('select');

		this.extraKey = targetElement.attr('data-imp-field');
		this.extraValue = targetElement.val();

		return true;
	}

	getValue() {
		if ( this.htmlElement )	return this.htmlElement.find('select').val();

		return super.getValue();
	}

	getLabel() {
		if ( this.htmlElement )	return this.htmlElement.find('option:selected').text();

		return super.getLabel();
	}

	getMeta() {
		if ( this.htmlElement ) {
			return this.htmlElement.find('option:selected').data();
		}

		return null;
	}
}
