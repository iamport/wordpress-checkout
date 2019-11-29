
import { ButtonFields } from '../button-fields.js';

export class RadioFields extends ButtonFields  {

	renderHTML() {
		let html = '';

		this.options.forEach((option,idx) => {
			let isDefault = (this.defaultValue && option == this.defaultValue) || (!this.defaultValue && idx == 0);

			html += '<span class="iamport-input-radio"><input name="' + this.content +'" type="radio" data-imp-field="' + this.content +'" value="' + option +'" ' + (isDefault ? 'checked':'') + '/><label>' + option +'</label></span>';
		});

		this.htmlElement = jQuery(this.defaultHTML + html + '</p>');
		return this.htmlElement;
	}

	validate(domElement) {
		const targetElement = domElement.find('input:checked');
		const targetValue = targetElement.val();

		if ( targetValue ) {
			this.extraKey = targetElement.attr('data-imp-field');
			this.extraValue = targetValue;

			return true;
		} else {
			return false;
		}
	}

	getValue() {
		if ( this.htmlElement )	return this.htmlElement.find('input:checked').val();

		return super.getValue();
	}

}