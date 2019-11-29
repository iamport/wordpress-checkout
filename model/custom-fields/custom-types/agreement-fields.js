import { ButtonFields } from '../button-fields.js';

export class AgreementFields extends ButtonFields  {

    constructor(setting) {
        super(setting);

        this.label = setting["label"];
        this.link = setting["link"];
    }

    renderDefaultHTML() {
        let defaultHTML = '<p class="custom-input ' + this.required + '" name="' + this.label + '">';
        defaultHTML += '<label>' + this.label + '<span class="iamport-checkbox-alert"></span>';
        defaultHTML += '<span class="iamport-checkbox-alert-message" style="display:none">필수입력입니다</span></label>';

        return defaultHTML;
    }

    renderHTML() {
        let html = '<span class="iamport-agreement"><input type="checkbox" data-imp-field="' + this.label + '" value="Y"/><label>' + this.label + '</label></span>';

        if (this.link) {
            //content를 링크 명칭으로
            html += ('<span class="iamport-agreement"><a href="' + this.link + '" target="_blank">' + this.content + '</a></span>');
        } else {
            html += ('<span class="iamport-agreement"><textarea readonly>' + this.content + '</textarea></span>');
        }

        this.htmlElement = jQuery(this.renderDefaultHTML() + html + '</p>');
        return this.htmlElement;
    }

    validate(domElement) {
        let targetElement = domElement.find('input[type="checkbox"]');

        this.extraKey = targetElement.attr('data-imp-field');
        this.extraValue = targetElement.is(":checked") ? 'Y' : 'N';

        return !this.required || targetElement.is(":checked");
    }

    getValue() {
        let targetElement = this.htmlElement.find('input[type="checkbox"]');
        return targetElement.is(":checked") ? 'Y' : 'N';

        return super.getValue();
    }

}