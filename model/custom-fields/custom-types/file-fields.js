
import { ButtonFields } from '../button-fields.js';
import { onFileUpload } from "../../../controller/file-upload.js";

export class FileFields extends ButtonFields  {

	renderHTML() {
		window.onFileUpload = onFileUpload;

		let html = '<input class="iamport-file" placeholder="' + this.placeholder + '" data-imp-field="' + this.content + '"/>';
		html += '<input class="iamport-search-file" type="button" value="파일찾기"/>';
		html += '<input class="iamport-file filename" name="attached_files" type="file" onchange="onFileUpload(this.files, event)"/></p>';

		this.htmlElement = jQuery(this.defaultHTML + html);
		return this.htmlElement;
	}

	validate(domElement) {
		/* ---------- REFACTOR: 두 개의 Input Element를 명확하게 구분하기 ---------- */
		const targetInput = domElement.find('input.iamport-file');
		const targetFile = domElement.find('input.iamport-file.filename');
		const { value } = targetInput[0];
		
		if ( value && value !== "선택된 파일 없음" && value !== this.placeholder ) {
			this.extraKey = targetInput.attr('data-imp-field');
			
			const fileData = targetFile.prop('files')[0];
			if ( fileData ) {
				this.extraValue = fileData;	
			}

			return true;
		} else {
			return false;
		}
	}

}