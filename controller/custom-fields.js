import { TextFields } from "../model/custom-fields/custom-types/text-fields.js";
import { SelectFields } from "../model/custom-fields/custom-types/select-fields.js";
import { AddressFields } from "../model/custom-fields/custom-types/address-fields.js";
import { CheckFields } from "../model/custom-fields/custom-types/check-fields.js";
import { RadioFields } from "../model/custom-fields/custom-types/radio-fields.js";
import { FileFields } from "../model/custom-fields/custom-types/file-fields.js";
import { AgreementFields } from "../model/custom-fields/custom-types/agreement-fields.js";

const { uuidList, userCode, isLoggedIn, configuration, device } = iamportButtonFields;

jQuery(($) => {
	const body = $('body');

	let uuidToArrayForRenderHTML = [];
	/* ----------버튼 식별자 만들기---------- */
	uuidList.forEach((uuid, key) => {
		let uuidToString = '#' + uuid + '-popup'; // 아임포트 결제버튼 식별자
		let uuidToStringForNext = '#iamport-survey-box-' + uuid + ' #iamport-end-survey-button'; // 다음 버튼 식별자
		let uuidToStringForGoBack = '#' + uuid + ' #iamport-go-back'; // 뒤로가기 버튼 식별자
		let uuidToStringForPay = '#' + uuid + ' #iamport-payment-submit'; // 결제하기 버튼 식별자

		// let targetId = null; // 누른 모달의 ID
		// let customFields = null; // [iamport_payment_button_field] 리스트

		// let iamportBox = null; // 결제하기 모달
		// let iamportTargetBox = null;
		// let iamportLoginBox = null; // 로그인 모달
		// let iamportSurveyBox = null; // 설문조사 모달

		let requiredLength = 0; // 필수입력 필드 길이

		/* ---------- 숏코드가 생성한 아임포트 결제버튼을 눌렀을때 ---------- */
		$(uuidToString).click((e) => {
			requiredLength = 0; // 필수입력 필드 길이 초기화

			let buttonContext = window["iamportButtonContext_" + uuid];
			let customFields = buttonContext.customFields; //localize string으로 global영역에 존재
			let iamportBox = $('#' + uuid);
			let iamportTargetBox = iamportBox;
			let iamportLoginBox = $('#iamport-login-box');
			let iamportSurveyBox = $('#iamport-survey-box-' + uuid);
			let deviceType = device;

			if ( configuration['login_required'] && !isLoggedIn ) {
				// 로그인이 안 되어 있으면 iamportLoginBox를 연다
				iamportTargetBox = iamportLoginBox;
				deviceType = "";
			} else if ( customFields ) {
				// 로그인이 되어있고 custom field가 있으면 surveyBox를 연다
				iamportTargetBox = iamportSurveyBox;

				// customFields를 만들어 modalContent안에 append한다
				customFields.forEach((targetField) => {
					if ( !targetField['domAdded'] ) {
						const { type } = targetField;
						let modalContentBox = $('#iamport-survey-box-' + uuid + ' .iamport-modal-content');

						let field = null;
						switch(type) {
							case "select": {
								field = new SelectFields(targetField);
								break;
							}
							case "check": {
								field = new CheckFields(targetField);
								break;
							}
							case "radio": {
								field = new RadioFields(targetField);
								break;
							}
							case "address": {
								field = new AddressFields(targetField);
								break;
							}
							case "file": {
								field = new FileFields(targetField);
								break;
							}
							case "agreement": {
								field = new AgreementFields(targetField);
								break;
							}
							default: {
								field = new TextFields(targetField);
								break;
							}
						}

						const fieldHTML = field.renderHTML();
						modalContentBox.append(fieldHTML);

						targetField['domAdded'] = true;

						targetField['domClass'] = field;
						targetField['domElement'] = modalContentBox.find('p').last();
					}

					if ( targetField['domClass'].required === "required" ) {
						requiredLength++;
					}
				});
			} else {
				setPaymentBtnBusy(iamportBox.find('#iamport-payment-submit'), false);

				if ( !uuidToArrayForRenderHTML[uuid] ) {
					renderPaymentHTML(iamportBox, buttonContext);
					uuidToArrayForRenderHTML[uuid] = true;
				}

				IMP.init(userCode);
			}

			// 모달의 위치를 결정한다
			setIamportModalBox($, iamportTargetBox, deviceType);

			// background에 dimmedScreen을 깐다
			$('.dimmed-background').css({ "display": "block" });

			return false;
		});

		let extraFields = {}; //globally used
		let fileFields = new FormData();
		/* ---------- 다음 버튼 눌렀을때 ---------- */
		$(uuidToStringForNext).click(() => {
			let validatedCount = 0;
			let buttonContext = window["iamportButtonContext_" + uuid];
			let customFields = buttonContext.customFields; //localize string으로 global영역에 존재
			let iamportBox = $('#' + uuid);
			let iamportSurveyBox = $('#iamport-survey-box-' + uuid);

			for ( let i = customFields.length - 1; i >= 0; i-- ) {
				let { domClass, domElement } = customFields[i];
				const { required } = domClass;

				/* ==================== REFECTOR: validate와 setExtraValue를 구분 ==================== */
				const validated = domClass.validate(domElement);
				let missedFields = domElement.find('span.iamport-checkbox-alert-message');

				if ( !validated && required == "required" ) {
					missedFields.css({'display': 'inline-block'});
					// Invalid 항목으로 스크롤 이동
					iamportSurveyBox.find('.iamport-modal-container')[0].scrollTop = domElement[0].offsetTop;
				} else if ( domClass.extraValue ) {
					if ( typeof domClass.extraValue === "object" ) {
					    fileFields.append(domClass.extraKey, domClass.extraValue);
					} else {
						extraFields[domClass.extraKey] = domClass.extraValue;
					}

					missedFields.css({'display': 'none'});
					if ( required == "required")
						validatedCount++;
				}
			}
			fileFields.append('extra_fields', JSON.stringify(extraFields));

			// Check all validated
			if ( requiredLength === 0 || validatedCount === requiredLength ) {
				iamportSurveyBox.css({ "display": "none" });

				if ( !uuidToArrayForRenderHTML[uuid] ) {
					renderPaymentHTML(iamportBox, buttonContext);
					uuidToArrayForRenderHTML[uuid] = true;
				}

				// iamportSurveyBox.find('[data-for]').each((idx, elem) => {
				for (let i = customFields.length-1; i >= 0; i--) { //dataFor 가 있는 것만 검색
					// const $elem = $(elem);
					// const elemVar = $elem.val();
					// let dataFor = $elem.attr('data-for');
					const field = customFields[i].domClass;
					const dataFor = field.dataFor;
					const fieldValue = field.getValue();

					if (!dataFor)	continue;

					if (fieldValue) {
						if (dataFor === 'phone') {
							iamportBox.find('input[name="buyer_tel"]').val(fieldValue);
						} else if (dataFor === 'address') {
							if (field instanceof AddressFields) {
								const modalContainer = iamportBox.find('.iamport-modal-container');
								const inputFields = modalContainer.data('inputFields');
								const inputFieldsLength = inputFields.length;

								//TODO : address type은 하나 뿐이므로 shipping_addr로 가정
								for (let i = 0; i < inputFieldsLength; i++) {
									const inputField = inputFields[i];
									if (inputField instanceof AddressFields) {
										inputField.setAddress(field.getAddress());
									}
								}
							}
						} else {
							iamportBox.find('input[name="buyer_' + dataFor + '"]').val(fieldValue);
						}
					}
				}
				// });

				setIamportModalBox($, iamportBox, device);

				IMP.init(userCode);
			}

			return false;
		});


		/* ---------- X버튼 또는 dimmedScreen 눌렀을때 ---------- */
		$('.iamport-modal-close, .dimmed-background').click(() => {
			body.removeClass('modal-open');

			$('.iamport-modal').css({ "display": "none" });
			$('.dimmed-background').css({ "display": "none" });

			// input alert 초기화
			$('span.iamport-checkbox-alert-message').css({ "display": "none" });
		});


		/* ---------- 뒤로가는 화살표 버튼 눌렀을때 ---------- */
		$(uuidToStringForGoBack).click(() => {
			let iamportSurveyBox = $('#iamport-survey-box-' + uuid);
			let modalContainer = iamportSurveyBox.find('.iamport-modal-container');
			let iamportBox = $('#' + uuid);

			$(iamportBox).css({ "display": "none" });
			setIamportModalBox($, iamportSurveyBox, device);

			modalContainer[0].scrollTop = 0 ;

			return false;
		});


		/* ---------- 결제하기 버튼 눌렀을때 ---------- */
		$(uuidToStringForPay).click(() => {
			let iamportBox = $('#' + uuid);
			let buttonContext = window["iamportButtonContext_" + uuid];
			let modalContainer = iamportBox.find('.iamport-modal-container');
			let inputValues = {};
			// const inputFields = modalContainer.find('input');
			const inputFields = modalContainer.data("inputFields");
			const amountField = modalContainer.data("amountField");
			const inputFieldsLength = inputFields.length;

			for ( let i = 0; i < inputFieldsLength; i++ ) {
				const inputField = inputFields[i];

				let inputValue = inputField.getValue();
				let dataImpField = inputField.getHolderName();
				let inputContainer = iamportBox.find('p[name="' + dataImpField + '"]');
				let alertMessage = inputContainer.find('span.iamport-checkbox-alert-message');

				// 전화번호 필드는 숫자만 입력 가능하도록
				const inputName = inputField.getName();
				if ( inputName === "buyer_tel" ) {
					inputValue = inputValue.replace(/[^0-9-]/g, '');
				}

				if ( inputValue ) {
					alertMessage.css({ "display": "none" });
				} else {
					alertMessage.css({ "display": "inline-block" });
					modalContainer[0].scrollTop = inputContainer[0].offsetTop;

					return false;
				}

				if (inputName == 'shipping_addr') {
					let addr = inputField.getAddress();
					inputValue = addr.address + ', ' + addr.detail;

					inputValues['shipping_postcode'] = addr.postcode;
				}

				//값을 담아서 전달
				inputValues[ inputName ] = inputValue;
			}

			//order_amount 필드 전달
			const raw_amount = amountField.getValue() || '';
			const meta = amountField.getMeta();
			const matched = raw_amount.match(/\((.*?)\)/g);

			inputValues[ amountField.getName() ] = parseFloat( raw_amount.replace(/\(.*?\)/g, '').replace(/[^0-9\.]/g, '') ); //() 안에 들어있는 라벨 먼저 제거하고 숫자만 골라냄( 라벨 내에 숫자가 있을 수도 있으니까 )
			if ( matched )	inputValues.amount_label = matched[0];

			if (meta && meta.tax_free) {
				inputValues.tax_free_amount = meta.tax_free;
			}

			setPaymentBtnBusy(iamportBox.find('#iamport-payment-submit'), true);

			return iamportAjaxCall($, iamportBox, fileFields, inputValues, buttonContext, extraFields);
		});

	});

});


/* ---------- payment 모달내부 결제금액 및 결제수단 돔 엘리먼트 그리기 ---------- */
function formatMoney(value, currency) {
	const formattedNumber = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	if ( currency ) {
		const cur = currency.toString().toUpperCase()

		if ( cur != 'KRW' ) {
			return cur + ' ' + formattedNumber;
		}
	}

	return formattedNumber + ' 원';
}

function renderPaymentHTML(iamportBox, buttonContext) {
	jQuery(($) => {
		let modalContainer = iamportBox.find('.iamport-modal-container');
		let modalContentBox = iamportBox.find('.iamport-modal-content');
		let fieldLists = buttonContext.fieldLists;
		let inputFields = [];

		// 결제자 이름/이메일/전화번호
		Object.values(fieldLists).map((eachField) => {
			const { required, content, value, name, placeholder } = eachField;

			const contents = {
				required,
				content,
				value,
				placeholder,
				"nameValue": name
			};

			if ( name == "shipping_addr" ) {
				const field = new AddressFields(contents);
				modalContentBox.append(field.renderHTML());
				inputFields.push(field);
			} else {
				const field = new TextFields(contents);
				modalContentBox.append(field.renderHTML());
				inputFields.push(field);
			}
		});

		//추후 값 읽기를 위해 inputFields세팅
		modalContainer.data("inputFields", inputFields);

		// 결제금액
		let payAmountContents = {
			"required": "true",
			"content": "결제금액",
			"nameValue": "order_amount"
		}

		const targetId = buttonContext.uuid;
		const targetAmountArr = buttonContext.amountArr;
		const amountArrLength = targetAmountArr.length;

		let payAmountField = null;
		if ( amountArrLength > 1 ) {
			let payAmountOptions = [];
			targetAmountArr.map((amount) => {

				const { value, label, tax_free } = amount;
				// let amountValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '원';
				let amountLabel = formatMoney(value, buttonContext.currency);
				if ( label ) {
					amountLabel += ' (' + label + ')';
				}
				payAmountOptions.push({
					label : amountLabel, //TODO : getLabel() 활용
					value : amountLabel, //TODO : getLabel() 활용
					meta : {tax_free}
				});
			});
			payAmountContents.options = payAmountOptions;
			payAmountField = new SelectFields(payAmountContents);
		} else {
			if ( amountArrLength === 1 ) {
				const { value, label, tax_free } = targetAmountArr[0];

				//3자리마다 콤마 찍기
				// payAmountContents.value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '원';
				payAmountContents.value = formatMoney(value, buttonContext.currency);
				payAmountContents.meta = {tax_free};
				payAmountContents.readOnly = true;
				if ( label ) {
					payAmountContents.value += ' (' + label + ')';
				}
			}
			payAmountField = new TextFields(payAmountContents);
		}

		modalContentBox.prepend(payAmountField.renderHTML());
		//결제금액 field reference
		modalContainer.data("amountField", payAmountField);

		// 결제수단
		const paymethodContents = {
			"required": "true",
			"content": "결제수단",
			"options": 	buttonContext.payMethods,
			"nameValue": "pay_method"
		}
		const paymethodField = new SelectFields(paymethodContents);
		modalContentBox.prepend(paymethodField.renderHTML());
	});
}


/* ---------- 결제하기 버튼 상태 정하기 ---------- */
function setPaymentBtnBusy($button, busy) {
	if ( busy ) {
		$button.attr('data-progress', 'true').text('결제 중입니다...');
	} else {
		$button.attr('data-progress', null).text('결제하기');
	}
}


/* ---------- 모달의 위치 정하기 ---------- */
function setIamportModalBox($, element, device) {
	const offset = $(document).scrollTop();
	const viewportHeight = $(window).height();

	const elementHeight = element.outerHeight();

	if ( device === "mobile" ) {
		element.css({
			"display": "block",
			"top": offset
		});

		const elementHeaderHeight = element.find('div.iamport-modal-header').outerHeight();
		const elementBottomHeight = element.find('p.button-holder').outerHeight();
		const containerHeight = document.documentElement.clientHeight - elementHeaderHeight - elementBottomHeight;

		// const elementContainer = element.find('div.iamport-modal-container');
		// elementContainer.css({
		// 	// "height": containerHeight,
		// 	"max-height": containerHeight
		// });

	} else {
		let elementTop = 0;
		let elementMarginBottom = 0;
		const defaultMargin = 50;

		if ( viewportHeight >= elementHeight ) {
			elementTop = offset  + (viewportHeight/2) - (elementHeight/2);
		} else {
			elementTop = offset + defaultMargin;
			elementMarginBottom = defaultMargin;
		}

		element.css({
			"display": "block",
			"top": elementTop,
			"margin-bottom": elementMarginBottom
		});
	}

	if ( viewportHeight > elementHeight || device === "mobile" ) {
		$('body').addClass("modal-open");
	}
}


/* ---------- 아임포트 일반결제 ---------- */
function iamportAjaxCall($, iamportBox, fileFields, inputValues, buttonContext, extraFields) {
	if ( iamportBox.find('#iamport-payment-submit').attr('data-progress') != 'true' )	return false;

	const order_title = buttonContext.orderTitle;
	const currency = buttonContext.currency;
	const { payMethodsToEn } = iamportButtonFields;
	let pay_method = payMethodsToEn[iamportBox.find('select[name="pay_method"]').val()];
	const buyer_name = inputValues.buyer_name || "";
	const buyer_email = inputValues.buyer_email || "";
	const buyer_tel = (inputValues.buyer_tel || "").replace(/[^0-9-]/g, '');
	const shipping_addr = inputValues.shipping_addr || "";
	const shipping_postcode = inputValues.shipping_postcode || "";
	const order_amount = inputValues.order_amount || -1;
	const tax_free_amount = inputValues.tax_free_amount || 0;
	const amount_label = inputValues.amount_label;
	const redirect_after = iamportBox.find('#iamport-payment-submit').attr('data-redirect-after');
	const payButton = iamportBox.find('#iamport-payment-submit');
	const isDigital = buttonContext.isDigital;
	const pgForPaymentContext = buttonContext.pgForPayment;

	if ( order_amount < 0 ) {
		alert('결제금액이 올바르지 않습니다.');
		return false;
	}

	if (pay_method == 'kakao') {
		pay_method = 'kakaopay';
	}

  fileFields.append('action', 'get_order_uid');
	fileFields.append('order_title', order_title);
	fileFields.append('pay_method', pay_method);
	fileFields.append('buyer_name', buyer_name);
	fileFields.append('buyer_email', buyer_email);
	fileFields.append('buyer_tel', buyer_tel);
	fileFields.append('shipping_addr', shipping_addr);
	fileFields.append('order_amount', order_amount);
	fileFields.append('tax_free_amount', tax_free_amount);
	if ( currency ) fileFields.append('currency', currency);
	fileFields.append('redirect_after', redirect_after);
	if ( amount_label )	fileFields.append('amount_label', amount_label); //undefined 일 수 있음

	$.ajax({
		method: 'POST',
		url: iamportButtonFields['adminUrl'],
        contentType: false,
        processData: false,
		data: fileFields
	}).done((rsp) => {
		iamportBox.css({"display": "none"});

		let param = {
			name: order_title,
			pay_method: pay_method,
			amount: order_amount,
			tax_free: tax_free_amount,
			buyer_name: buyer_name,
			buyer_email: buyer_email,
			buyer_tel: buyer_tel,
			buyer_addr: shipping_addr,
			buyer_postcode: shipping_postcode,
			merchant_uid: rsp.order_uid,
			m_redirect_url: rsp.thankyou_url,
		};

		const pgConfig = configuration['pg_for_payment'];
		const danalConfig = configuration['etc'];

		//카카오페이, Paypal 예외적용
		if ( pay_method === 'kakaopay' ) {
			param.pg = 'kakaopay';
			param.pay_method = 'card';
		} else if ( pay_method === 'paypal' ) {
			param.pg = 'paypal';
			param.pay_method = 'card';
		} else if ( pgForPaymentContext[pay_method] ) {
			param.pg = pgForPaymentContext[pay_method];
		} else if ( pgConfig[pay_method] && pgConfig[pay_method] !== 'default' ) {
			param.pg = pgConfig[pay_method];
		}

		//추가 PG지정
		if (param.pg) {
			if (pgForPaymentContext[pay_method + '_mid']) {
				param.pg = param.pg + '.' + pgForPaymentContext[pay_method + '_mid'];
			} else if (pgConfig[pay_method + '_mid']) {
				param.pg = param.pg + '.' + pgConfig[pay_method + '_mid'];
			}
		}

		// 다날 가상계좌 사업자등록번호
		if ( danalConfig && typeof danalConfig['danal.biz_num'] === 'string' && danalConfig['danal.biz_num'].length > 0 ) {
			param.biz_num = danalConfig['danal.biz_num'];
		}

		//가상계좌 입금기한 적용
		if ( rsp.vbank_due ) {
			param.vbank_due = rsp.vbank_due;
		}

		//신용카드 할부개월 적용
		if ( rsp.display ) {
			param.display = rsp.display;
		}

		if ( currency ) {
			param.currency = currency;
		}

		//custom data 설정
		if (!$.isEmptyObject(extraFields)) {
			param.custom_data = extraFields;
		}

		//digital option 적용
		if (isDigital) {
			param.digital = true;
		}

		IMP.request_pay(param, (callback) => {
			$('.dimmed-background').css({ "display": "block" });
			let resultBox = $('#iamport-result-box');

			if ( callback.success ) {
				resultBox.find('.main-title').text('결제완료 처리중');
				resultBox.find('.sub-title').text('');
				resultBox.find('.content').html('잠시만 기다려주세요. 결제완료 처리중입니다.');

				location.href = rsp.thankyou_url;
			} else {
				resultBox.find('.main-title').text('결제실패');
				resultBox.find('.sub-title').html('다음과 같은 사유로 결제에 실패하였습니다.');
				resultBox.find('.content').html(callback.error_msg);
			}

			setIamportModalBox($, resultBox, device);
			setPaymentBtnBusy(payButton, false);
		});

		$('.dimmed-background').css({ "display": "none" });

	}).fail((jqXHR, textStatus, errorThrown) => {
		alert(jqXHR.responseText);
		setPaymentBtnBusy(payButton, false);
	});

	return false;
}
