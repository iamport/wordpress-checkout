
import { ButtonFields } from '../button-fields.js';
import { execDaumPostcode, foldDaumPostcode } from "../../../controller/postcode.js";

export class AddressFields extends ButtonFields {

	renderHTML() {
		window.execDaumPostcode = execDaumPostcode;
		window.foldDaumPostcode = foldDaumPostcode;

		let html = '<input type="button" class="iamport-postcode" onclick="execDaumPostcode(event)" value="우편번호" data-imp-field="' + this.content + '">';
			html += '<input type="button" onclick="window.execDaumPostcode(event)" value="우편번호 찾기" class="iamport-postcode-button">';
			html += '<input type="button" class="iamport-address" onclick="window.execDaumPostcode(event)" value="주소" data-imp-field="' + this.content + '">';
			html += '<input type="text" class="iamport-address-detail" placeholder="상세" data-imp-field="' + this.content + '"></p>';
			html += '<div id="wrap" style="display:none;border:1px solid;height:300px;margin:0;position:relative;overflow-x:auto;">';
			html += '<img src="//t1.daumcdn.net/localimg/localimages/07/postcode/320/close.png" id="btnFoldWrap" style="cursor:pointer;position:absolute;right:0px;top:-1px;z-index:1" onclick="foldDaumPostcode(event)" alt="접기 버튼">';
			html += '</div>';

		this.htmlElement = jQuery(this.defaultHTML + html);
		return this.htmlElement;
	}

	validate(domElement) {
		const postcode = domElement.find('input.iamport-postcode').val();
		const address = domElement.find('input.iamport-address').val();
		const addressDetail = domElement.find('input.iamport-address-detail').val();

		if ( postcode != '우편번호' && address != '주소' ) {
			this.extraKey = domElement.attr('name');

			if ( addressDetail ) {
				this.extraValue = address + ', ' + addressDetail + ', ' + postcode;
			} else {
				this.extraValue = address + ', ' + postcode;
			}

			return true;
		} else {
			return false;
		}
	}

	getValue() {
		if ( this.htmlElement) {
			const postcode = this.htmlElement.find('input.iamport-postcode').val();
			const address = this.htmlElement.find('input.iamport-address').val();
			const addressDetail = this.htmlElement.find('input.iamport-address-detail').val();

			if ( postcode != '우편번호' && address != '주소' ) {
				if ( addressDetail ) {
					return address + ', ' + addressDetail + ', ' + postcode;
				}

				return address + ', ' + postcode;
			}
		}

		return super.getValue();
	}

	getAddress() {
		if ( this.htmlElement) {
			const postcode = this.htmlElement.find('input.iamport-postcode').val();
			const address = this.htmlElement.find('input.iamport-address').val();
			const addressDetail = this.htmlElement.find('input.iamport-address-detail').val();

			if ( postcode != '우편번호' && address != '주소' ) {
				return {
					"address" : address,
					"detail" : addressDetail,
					"postcode" : postcode
				}
			}
		}

		return null;
	}

	setAddress(addr) {
		if ( this.htmlElement && addr ) {
			this.htmlElement.find('input.iamport-postcode').val(addr.postcode);
			this.htmlElement.find('input.iamport-address').val(addr.address);
			this.htmlElement.find('input.iamport-address-detail').val(addr.detail);
		}
	}

}
