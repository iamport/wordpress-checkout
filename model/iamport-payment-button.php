<?php

if ( !class_exists('IamportPaymentButton') ) {

	class IamportPaymentButton {

		private $user_code;
		private $api_key;
		private $api_secret;
		private $configuration;

		public $method_names = array(
			'card' 		=> '신용카드',
			'trans' 	=> '실시간계좌이체',
			'vbank' 	=> '가상계좌',
			'phone' 	=> '휴대폰소액결제',
			'kakao' 	=> '카카오페이',
			'kakaopay' 	=> '카카오페이',
			'paypal' 	=> 'Paypal',
			'samsung' 	=> '삼성페이'
		);
		public $method_name_to_en = array(
			 '신용카드' 		=> 'card',
			 '실시간계좌이체' 	=> 'trans',
			 '가상계좌' 		=> 'vbank',
			 '휴대폰소액결제' 	=> 'phone',
			 '카카오페이' 		=> 'kakaopay',
			 'Paypal' 		=> 'paypal',
			 '삼성페이' 		=> 'samsung'
		);

		private $uuidList = array(); // front 에서 필요한 것 같아 살려둠
		private $buttonContext = null; //IamportPaymentButton은 객체가 1개 뿐임. [iamport_payment_button_field]는 항상 [iamport_payment_button] 의 child이므로 [iamport_payment_button]를 처리할 때 $this->buttonContext를 생성하고, [iamport_payment_button_field] 를 처리할 때 관련 정보를 append

		public function __construct($user_code, $api_key, $api_secret, $configuration) {
			$this->user_code = $user_code;
			$this->api_key = $api_key;
			$this->api_secret = $api_secret;
			$this->configuration = $configuration;

			$this->hook();
		}

		private function hook() {
			add_shortcode( 'iamport_payment_button', array($this, 'hook_payment_box') );
			add_shortcode( 'iamport_payment_button_field', array($this, 'hook_payment_field') );

			// <head></head> 안에서 해당 action이 trigger된다
			add_action( 'wp_head', array($this, 'enqueue_inline_style') );
			add_action( 'wp_head', array($this, 'enqueue_inline_script') );
		}

		public function enqueue_inline_style() {
			wp_enqueue_style('iamport-payment-css', plugins_url('../assets/css/iamport-payment.css', __FILE__), array(), '20190105');
		}

		public function enqueue_inline_script() {
			wp_register_script('daum-postcode-for-https', 'https://ssl.daumcdn.net/dmaps/map_js_init/postcode.v2.js');
			wp_enqueue_script('daum-postcode-for-https');

			wp_register_script('iamport-bundle-js', plugins_url('../dist/bundle.js', __FILE__), array(), '20191230');
		}

		public function hook_payment_box($atts, $content = null) {
			$uuid = uniqid('iamport_dialog_');
			$this->uuidList[] = $uuid;
			$this->buttonContext = array("uuid"=>$uuid); //field 등 정보 저장공간 확보

			$a = shortcode_atts( array(
				'title' 			=> '결제하기',
				'description' 		=> '아래의 정보를 입력 후 결제버튼을 클릭해주세요',
				'pay_method' 		=> 'card',
				'pay_method_list' 	=> 'card,kakaopay,samsung,trans,vbank,phone',
				'field_list' 		=> 'name,email,phone',
				'name' 				=> '아임포트 결제하기',
				'amount' 			=> '',
				'tax_free' 			=> '',
				'style' 			=> 'display:inline-block;padding:6px 12px;color:#fff;background-color:#2c3e50',
				'class' 			=> null,
				'redirect_after' 	=> null,
				'currency'          => null, // null 은 KRW
                'digital'           => 'no',
                'pg_for_card'       => null,
                'pg_for_trans'      => null,
                'pg_for_vbank'      => null,
                'pg_for_phone'      => null,
                'pg_for_kakaopay'   => null,
                'pg_for_paypal'     => null,
			), $atts );


			$trimedAttr = $this->trim_iamport_attr($content);
			$content = $trimedAttr['content'];
			$customFields = $trimedAttr['customFields'];

			// 결제자 이름 및 이메일
			$iamport_current_user = wp_get_current_user();
			if ( !empty($iamport_current_user->user_nicename) ) {
				$iamport_buyer_name = $iamport_current_user->user_nicename;
			}

			if ( !empty($iamport_current_user->user_email) ) {
				$iamport_buyer_email = $iamport_current_user->user_email;
			}
			$fieldLists = array();
			foreach ( array_unique( explode(',', $a['field_list']) ) as $fieldList )  {
				$field = trim($fieldList);
				$regex = "/^(name|email|phone|shipping_addr)\((.+)\)$/";

				if ( preg_match($regex, $field, $matches) ) {
					$fieldName = $matches[1];
					$labels = explode("|", $matches[2]);

					$fieldLabel = $fieldPlaceholder = $labels[0];
					if ( count($labels) > 1 ) {
						$fieldPlaceholder = $labels[1];
					}
				} else { //basic format
					$fieldName = $field;
					$fieldLabel = null;
					$fieldPlaceholder = null;
				}


				switch($fieldName) {
					case "name": {
						$fieldLists['name'] = array(
							"required"		=> "true",
							"value" 		=> $iamport_buyer_name,
							"name"			=> "buyer_name",
							"content" 		=> $fieldLabel ? $fieldLabel : "결제자 이름",
							"placeholder" 	=> $fieldPlaceholder ? $fieldPlaceholder : "결제자 이름"
						);
					}
					break;

					case "email": {
						$fieldLists['email'] = array(
							"required"		=> "true",
							"value"			=> $iamport_buyer_email,
							"name"			=> "buyer_email",
							"content"		=> $fieldLabel ? $fieldLabel : "결제자 이메일",
							"placeholder" 	=> $fieldPlaceholder ? $fieldPlaceholder : "결제자 이메일"
						);
					}
					break;

					case "phone": {
						$fieldLists['phone'] = array(
							"required"		=> "true",
							"value"			=> null,
							"name"			=> "buyer_tel",
							"content"		=> $fieldLabel ? $fieldLabel : "결제자 전화번호",
							"placeholder" 	=> $fieldPlaceholder ? $fieldPlaceholder : "결제자 전화번호"
						);
					}
					break;

					case "shipping_addr" : {
						$fieldLists['shipping_addr'] = array(
							"required"		=> "true",
							"value"			=> null,
							"name"			=> "shipping_addr",
							"content"		=> $fieldLabel ? $fieldLabel : "배송주소",
							"placeholder" 	=> $fieldPlaceholder ? $fieldPlaceholder : "배송주소"
						);
					}
					break;
				}
			}

			// 결제금액
			$this->buttonContext[ "amountArr" ] = array();
			// $amountList = array_unique( explode(',', $a['amount']) );
			$amountList = array_unique( preg_split("/,(?![^(]*\))/", $a['amount']) ); //괄호 안에 comma가 있을 수도 있다.
			$taxFreeList = explode(',', $a['tax_free']);
			$isDigital = filter_var($a['digital'], FILTER_VALIDATE_BOOLEAN);
			/* ---------- 라벨형 금액 대비 ---------- */
			if ( $amountList[0] != 'variable' ) {
				foreach ( $amountList as $idx=>$amount ) {
					preg_match_all( '/\((.*)\)/', $amount, $amountLabel ); //괄호 안에 괄호가 들어가 있을 수 있으므로 greedy match
					preg_match_all( '/([0-9\.]+)/', $amount, $amountValue ); //float value 허용

					$label = null;
					if ( !empty($amountLabel) && $amountLabel[1] ) {
						$label = $amountLabel[1][0];
					}

					$taxFree = 0;
					if (isset($taxFreeList[$idx])) {
					    $taxFree = floatval($taxFreeList[$idx]);
                    }

					$this->buttonContext[ "amountArr" ][] = array(
						'label' => trim($label),
						'value' => floatval($amountValue[0][0]),
                        'tax_free' => $taxFree,
					);
				}
			}

			// 결제수단
			$rawPayMethods = array_unique( explode(',', $a['pay_method_list']) );

			$payMethods = array();
			foreach ( $rawPayMethods as $rawPayMethod ) {
				$payMethods[] = $this->method_names[trim($rawPayMethod)];
			}
			$this->buttonContext[ "payMethods" ] = $payMethods;
			$this->buttonContext[ "orderTitle" ] = $a["name"];
			$this->buttonContext[ "fieldLists" ] = $fieldLists;
			$this->buttonContext[ "currency"   ] = $a["currency"];
			$this->buttonContext[ "isDigital"   ] = $isDigital;

			$device = "";
			if ( wp_is_mobile() ) $device = "mobile";

			//PG설정 변경부분
            //button 마다 다른 configuration
			$pgForPaymentContext = array();

            $pgMethods = array('card', 'trans', 'vbank', 'phone', 'kakaopay', 'paypal');
            foreach ($pgMethods as $m) {
                $_key = 'pg_for_' . $m;
	            if (!empty($a[$_key])) {
	                $configValue = explode('.', $a[$_key], 2);

	                if (in_array($m, array('kakaopay', 'paypal'))) { //kakaopay.TC0ONETIME, TC0ONETIME 모두 지원
		                if (count($configValue) > 1) {
			                $pgForPaymentContext[$m . '_mid'] = $configValue[1];
		                } else {
			                $pgForPaymentContext[$m . '_mid'] = $configValue[0];
		                }
                    } else {
		                $pgForPaymentContext[$m] = $configValue[0];

		                if (count($configValue) > 1) {
			                $pgForPaymentContext[$m . '_mid'] = $configValue[1];
		                }
	                }
                }
            }
			$this->buttonContext[ "pgForPayment" ] = $pgForPaymentContext;

			/* ---------- CONTROLLER ---------- */
			$iamportButtonFields = array(
				// 'buttonFields' 	=> $this->buttonFields,
				'uuidList'    => $this->uuidList,
				'userCode'		=> $this->user_code,
				'configuration'	=> $this->configuration,
				'isLoggedIn'	=> is_user_logged_in(),
				'adminUrl'		=> admin_url( 'admin-ajax.php' ),
				// 'orderTitle'	=> $a["name"],
				// 'payMethods'	=> $payMethods,
				// 'amountArr'		=> $this->amountArrs,
				'device'		=> $device,
				'payMethodsToEn'=> $this->method_name_to_en,
				// 'fieldLists'	=> $fieldLists
			);
			wp_localize_script('iamport-bundle-js', 'iamportButtonContext_'.$uuid, $this->buttonContext);
			wp_localize_script('iamport-bundle-js', 'iamportButtonFields', $iamportButtonFields); //숏코드 개수만큼 반복호출. 매번 overwrite
			wp_enqueue_script('iamport-bundle-js');

			/* ---------- VIEW ---------- */
			$iamportPaymentModal = array(
				'attr'			      => $a,
				'hasCustomFields'	=> !empty($this->buttonContext["customFields"]),
				'uuid'			      => $uuid,
				'methodNames'	    => $this->method_names,
				'regexNewline'	  => '/(\s*?\n\s*?)/',
				'device'		      => $device
			);

			extract($iamportPaymentModal);


			/* ---------- 아임포트 결제버튼 ---------- */
			ob_start();

			require(dirname(__FILE__).'/../view/modal/payment.php');
			require(dirname(__FILE__).'/../view/modal/survey.php');
			require(dirname(__FILE__).'/../view/modal/result.php');
			require(dirname(__FILE__).'/../view/modal/login.php');
			require(dirname(__FILE__).'/../view/modal/background.php');
			?>
				<a href="#<?=$uuid?>" id="<?=$uuid?>-popup" class="<?=$a['class']?>" style="<?=(empty($a['class']) && !empty($a['style'])) ? $a['style'] : ''?>"><?=$content?></a>
			<?php

			$this->buttonContext = null;
			return ob_get_clean();
		}

		public function trim_iamport_attr($content) {
			/* ---------- TRIM CONTENT ---------- */
			if ( empty($content) )	$content = '결제하기';

			// markup remove
			$content = preg_replace('/<\s*\/?[a-zA-Z0-9]+[^>]*>/s', '', $content);

			// &nbsp; &amp;nbsp; remove
			$content = htmlentities($content, null, 'utf-8');
			$content = preg_replace('/nbsp;|&nbsp;|&amp;/', '', $content);
			$content = html_entity_decode($content);

			$fieldRegex = get_shortcode_regex(array('iamport_payment_button_field'));
			$matchCount = preg_match_all("/$fieldRegex/s", $content, $fieldMatchs);

			$content = trim(preg_replace("/$fieldRegex/s", '', $content));

			/* ---------- TRIM CUSTOMFIELDS ---------- */
			$customFields = array();

			if ( $matchCount > 0 ) {
				foreach ($fieldMatchs[0] as $f) {
					$html = do_shortcode($f);

					if ( !empty($html) ) $customFields[] = $html;
				}
			}

			return array(
				'content' 		=> $content,
				'customFields' 	=> $customFields
			);
		}

		public function hook_payment_field($atts, $content = null) {
			if ( is_null($this->buttonContext) )	return; //[iamport_payment_button] 없이 [iamport_payment_button_field] 단독으로 사용된 경우. buttonContext 가 없으므로 처리하지 않음

			$a = shortcode_atts( array(
				'type' 			=> 'text',
				'required' 		=> false,
				'options' 		=> array(),
				'content'		=> null,
				'placeholder' 	=> null,
				'data-for'		=> null,
				'default'       => null,
                'label'         => null,
                'link'          => null,
			), $atts );

			if ( empty($content) ) return null;
			else $a['content'] = $content;

			if ( !empty($a['options']) ) $a['options'] = explode(',', $a['options']);

			if ( !isset($this->buttonContext["customFields"]) )	$this->buttonContext["customFields"] = array();

			$this->buttonContext["customFields"][] = $a;
		}

	} // end of Class

} // end of if
