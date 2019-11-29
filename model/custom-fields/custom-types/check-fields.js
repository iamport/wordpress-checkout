
import { ButtonFields } from '../button-fields.js';

export class CheckFields extends ButtonFields  {

	renderHTML() {
		let html = '';

		this.options.forEach(option => {
			html += '<span class="iamport-input-checkbox"><input type="checkbox" data-imp-field="' + this.content + '" value="' + option + '"/><label>' + option + '</label></span>';
		});

		this.htmlElement = jQuery(this.defaultHTML + html + '</p>');
		return this.htmlElement;
	}

	validate(domElement) {
		let targetElement = domElement.find('input:checked');
		const targetLength = targetElement.length;

		if ( targetLength ) {
			this.extraKey = targetElement.attr('data-imp-field');
			this.extraValue = '';

			targetElement.each((key, target) => {
				const { value } = target;

				this.extraValue += value;

				if ( key != targetLength - 1 ) this.extraValue += ", ";
			});

			return true;
		} else {
			return false;
		}
	}

	getValue() {
		let targetElement = this.htmlElement.find('input:checked');
		const targetLength = targetElement.length;

		if ( targetLength ) {
			let values = [];

			targetElement.each((key, target) => {
				const { value } = target;

				values.push(value);
			});

			return values.join(", ");
		}

		return super.getValue();
	}

}