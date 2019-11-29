<?php
	wp_register_style('iamport-shortcode-page-css', plugins_url('../../assets/css/iamport-shortcode-page.css', __FILE__), array(), "20180730");
	wp_enqueue_style('iamport-shortcode-page-css');

	/* ---------- 아임포트 설정에서 '저장하기' 버튼 눌렀을때 ---------- */
	if ( isset($_POST['action']) && $_POST['action'] == "update_iamport_settings" ) {
		if ( wp_verify_nonce($_POST['iamport-settings'], 'iamport-options') ) {
			$iamportSetting = get_option('iamport_setting');

			$iamportSetting['user_code'] = $_POST['user_code'];
			$iamportSetting['rest_key'] = $_POST['rest_key'];
			$iamportSetting['rest_secret'] = $_POST['rest_secret'];
			$iamportSetting['login_required'] = $_POST['login_required'];
			$iamportSetting['pg_for_payment'] = array(
				'card' 	=> $_POST['pg_for_card'],
				'card_mid' 	=> $_POST['pg_for_card_mid'],
				'trans' => $_POST['pg_for_trans'],
				'trans_mid' => $_POST['pg_for_trans_mid'],
				'vbank' => $_POST['pg_for_vbank'],
				'vbank_mid' => $_POST['pg_for_vbank_mid'],
				'phone' => $_POST['pg_for_phone'],
				'phone_mid' => $_POST['pg_for_phone_mid'],
				'kakaopay_mid' => $_POST['pg_for_kakaopay_mid'],
				'paypal_mid' => $_POST['pg_for_paypal_mid'],
			);
			$iamportSetting['pg_etc'] = array(
				'danal.biz_num' => $_POST['danal_biz_num']
			);
			$iamportSetting['vbank_day_limit'] = $_POST['vbank_day_limit'];
			$iamportSetting['card_max_quota'] = $_POST['card_max_quota'];

			update_option('iamport_setting', $iamportSetting);

		} else {
			?><div class="error">update failed</div><?php
		}
	}

	ob_start();

	$settings = get_option('iamport_setting');
	if ( empty($settings) ) {
		/* -------------------- 설정파일 백업으로부터 복원 -------------------- */
		$iamportSetting['user_code'] = get_option('iamport_user_code');
		$iamportSetting['rest_key'] = get_option('iamport_rest_key');
		$iamportSetting['rest_secret'] = get_option('iamport_rest_secret');
		$iamportSetting['login_required'] = get_option('iamport_login_required');
		$iamportSetting['pg_for_payment'] = get_option('iamport_pg_for_payment');
		$iamportSetting['pg_etc'] = get_option('iamport_pg_etc');
		$iamportSetting['vbank_day_limit'] = "none";
		$iamportSetting['card_max_quota'] = "none";

		update_option('iamport_setting', $iamportSetting);
	}
	$iamportSetting = get_option('iamport_setting');

	$pgList = array(
		'default' => '- 기본값 사용 -',
		'html5_inicis' => 'KG이니시스',
		'uplus' => 'LGU',
		'nice' => '나이스페이먼츠',
		'jtnet' => 'JTNet',
		'danal' => '다날',
		'mobilians' => '모빌리언스'
	);

	$vbankDueOptions = array("none" => "지정안함(PG사 계약시 설정값을 그대로 적용합니다)");
	for ($i=0; $i < 14; $i++) {
		$vbankDueOptions[ "{$i}d" ] = $i == 0 ? "당일 자정까지" : "+ {$i}일 자정까지";
	}

    $cardMaxQuotas = array("none" => "지정안함(PG사 제공값을 그대로 적용합니다)");
    for ($i=1; $i <= 12; $i++) {
	    $cardMaxQuotas[ "{$i}m" ] = $i == 1 ? "일시불만 허용(할부불가)" : "{$i}개월까지 할부허용";
    }
?>
    <style>
        .iamport-mid-fill {width:100%}
    </style>
	<div class="wrap">
		<h2>아임포트 결제설정 페이지</h2>
		<p>
			<h3>0. 가상계좌 입금통보 설정</h3>
			<table class="form-table shortcode-box">
				<tbody>
					<tr valign="top">
						<th scope="row" style="padding-left:10px;"><label for="iamport_notification_guide">가상계좌 입금통보 URL설정</label></th>
						<td>
							<input readonly class="large-text" name="notification_guide" type="text" id="iamport_notification_guide" value="<?=add_query_arg( 'iamport-button-callback', 'webhook', site_url() )?>" /><br>
							<a target="_blank" href="https://admin.iamport.kr">https://admin.iamport.kr</a> 에 로그인 후, "시스템설정" > "PG설정(일반결제 및 정기결제)" 하단에 입력 및 저장하면 됩니다.
						</td>
					</tr>
				</tbody>
			</table>

			<h3>1. 아임포트 결제정보 설정</h3>
			<form method="post" action="">
				<table class="form-table shortcode-box">
					<tbody>
						<tr valign="top">
							<th scope="row" style="width:160px;padding-left:10px;"><label for="iamport_user_code">[아임포트] 가맹점 식별코드</label></th>
							<td>
								<input class="regular-text" name="user_code" type="text" id="iamport_user_code" value="<?=$iamportSetting['user_code']?>" /><br>
								<a target="_blank" href="https://admin.iamport.kr">https://admin.iamport.kr</a> 에서 회원가입 후, "시스템설정" > "내정보"에서 확인하실 수 있습니다.
							</td>
						</tr>
						<tr valign="top">
							<th scope="row" style="width:160px;padding-left:10px;"><label for="iamport_rest_key">[아임포트] REST API 키</label></th>
							<td>
								<input class="regular-text" name="rest_key" type="text" id="iamport_rest_key" value="<?=$iamportSetting['rest_key']?>" /><br>
								<a target="_blank" href="https://admin.iamport.kr">https://admin.iamport.kr</a> 에서 회원가입 후, "시스템설정" > "내정보"에서 확인하실 수 있습니다.
							</td>
						</tr>
						<tr valign="top">
							<th scope="row" style="width:160px;padding-left:10px;"><label for="iamport_rest_secret">[아임포트] REST API Secret</label></th>
							<td>
								<input class="regular-text" name="rest_secret" type="text" id="iamport_rest_secret" value="<?=$iamportSetting['rest_secret']?>" /><br>
								<a target="_blank" href="https://admin.iamport.kr">https://admin.iamport.kr</a> 에서 회원가입 후, "시스템설정" > "내정보"에서 확인하실 수 있습니다.
							</td>
						</tr>
						<tr valign="top">
							<th scope="row" style="width:160px;padding-left:10px;"><label for="iamport_login_required">로그인 필요</label></th>
							<td>
								<label><input name="login_required" type="checkbox" id="iamport_login_required" value="Y" <?=$iamportSetting['login_required'] == 'Y' ? 'checked' : ''?>/>로그인 된 사용자에게만 구매 허용하시려면 체크하세요</label>
							</td>
						</tr>
						<tr valign="top">
							<th scope="row" style="width:160px;padding-left:10px;"><label for="payment_pg">결제수단별 PG설정<br>(복수PG사용자만 설정)</label></th>
							<td>
								아임포트에서 복수PG를 설정해 사용 중이시면 결제수단별로 원하시는 PG사를 설정해주세요.<br>설정되지 않으면 아임포트 > 시스템 설정의 "기본 PG"사로 모두 연동됩니다.<br>
								<table class="form-table">
									<tr>
										<th style="text-align:center;padding:2px">신용카드</th>
										<th style="text-align:center;padding:2px">계좌이체</th>
										<th style="text-align:center;padding:2px">가상계좌</th>
										<th style="text-align:center;padding:2px">휴대폰소액결제</th>
										<th style="text-align:center;padding:2px">카카오페이</th>
										<th style="text-align:center;padding:2px">Paypal</th>
										<th style="text-align:center;padding:2px">삼성페이</th>
									</tr>
									<tr>
										<td>
											<select name="pg_for_card" class="iamport-mid-fill">
												<?php foreach($pgList as $key=>$val) : ?>
												<option value="<?=$key?>" <?=$iamportSetting['pg_for_payment']['card'] == $key ? 'selected':'' ?>><?=$val?></option>
												<?php endforeach; ?>
											</select>
                                            <input type="text" name="pg_for_card_mid" class="iamport-mid-fill" value="<?=isset($iamportSetting['pg_for_payment']['card_mid']) ? $iamportSetting['pg_for_payment']['card_mid'] : ''?>">
										</td>
										<td>
											<select name="pg_for_trans" class="iamport-mid-fill">
												<?php foreach($pgList as $key=>$val) : ?>
												<option value="<?=$key?>" <?=$iamportSetting['pg_for_payment']['trans'] == $key ? 'selected':'' ?>><?=$val?></option>
												<?php endforeach; ?>
											</select>
                                            <input type="text" name="pg_for_trans_mid"  class="iamport-mid-fill" value="<?=isset($iamportSetting['pg_for_payment']['trans_mid']) ? $iamportSetting['pg_for_payment']['trans_mid'] : ''?>">
										</td>
										<td>
											<select name="pg_for_vbank" class="iamport-mid-fill">
												<?php foreach($pgList as $key=>$val) : ?>
												<option value="<?=$key?>" <?=$iamportSetting['pg_for_payment']['vbank'] == $key ? 'selected':'' ?>><?=$val?></option>
												<?php endforeach; ?>
											</select>
                                            <input type="text" name="pg_for_vbank_mid" class="iamport-mid-fill" value="<?=isset($iamportSetting['pg_for_payment']['vbank_mid']) ? $iamportSetting['pg_for_payment']['vbank_mid'] : ''?>">
										</td>
										<td>
											<select name="pg_for_phone" class="iamport-mid-fill">
												<?php foreach($pgList as $key=>$val) : ?>
												<option value="<?=$key?>" <?=$iamportSetting['pg_for_payment']['phone'] == $key ? 'selected':'' ?>><?=$val?></option>
												<?php endforeach; ?>
											</select>
                                            <input type="text" name="pg_for_phone_mid" class="iamport-mid-fill" value="<?=isset($iamportSetting['pg_for_payment']['phone_mid']) ? $iamportSetting['pg_for_payment']['phone_mid'] : ''?>">
										</td>
										<td>아임포트 관리자 카카오페이 설정 추가, 자동 적용<br><input type="text" name="pg_for_kakaopay_mid" class="iamport-mid-fill" value="<?=isset($iamportSetting['pg_for_payment']['kakaopay_mid']) ? $iamportSetting['pg_for_payment']['kakaopay_mid'] : ''?>"></td>
										<td>아임포트 관리자 Paypal 설정 추가, 자동 적용<br><input type="text" name="pg_for_paypal_mid" class="iamport-mid-fill" value="<?=isset($iamportSetting['pg_for_payment']['paypal_mid']) ? $iamportSetting['pg_for_payment']['paypal_mid'] : ''?>"></td>
										<td>KG이니시스 / KCP만 가능</td>
									</tr>
								</table>
							</td>
						</tr>

						<!-- 가상계좌 입금기한 -->
						<tr valign="top">
							<th scope="row" style="width:160px;padding-left:10px;"><label for="vbank_day_limit">가상계좌 입금기한</label></th>
							<td>
								<select name="vbank_day_limit">
									<?php foreach ($vbankDueOptions as $key => $val) : ?>
									<option value="<?=$key?>" <?=$iamportSetting['vbank_day_limit'] == $key ? 'selected':'' ?>><?=$val?></option>
									<?php endforeach; ?>
								</select>
							</td>
						</tr>

                        <!-- 신용카드 최대할부개월수 -->
                        <tr valign="top">
                            <th scope="row" style="width:160px;padding-left:10px;"><label for="card_max_quota">신용카드 최대 할부개월</label></th>
                            <td>
                                <select name="card_max_quota">
									<?php foreach ($cardMaxQuotas as $key => $val) : ?>
                                        <option value="<?=$key?>" <?=$iamportSetting['card_max_quota'] == $key ? 'selected':'' ?>><?=$val?></option>
									<?php endforeach; ?>
                                </select>
                            </td>
                        </tr>

					</tbody>
				</table>

				<h3>2. PG사별 추가 설정</h3>
				<h4>다날 가상계좌 서비스를 이용하시려면 계약하신 사업자의 사업자등록번호 10자리(숫자만)를 기재해주셔야 정상동작합니다.</h4>
				<table class="form-table shortcode-box">
					<tbody>
						<tr valign="top">
							<th scope="row" style="width:160px;padding-left:10px;"><label for="danal_biz_num">[다날] 사업자등록번호</label></th>
							<td>
								<input class="regular-text" name="danal_biz_num" type="text" id="danal_biz_num" value="<?=$iamportSetting['pg_etc']['danal.biz_num']?>" /><br>
							</td>
						</tr>
					</tbody>
				</table>

				<?php wp_nonce_field('iamport-options', 'iamport-settings'); ?>
				<input type="hidden" name="action" value="update_iamport_settings" />
				<input class="button-primary" type="submit" name="iamport-options" value="저장하기" />
			</form>
		</p>
	</div>
<?php

	$iamport_admin_html = ob_get_clean();

	return $iamport_admin_html;
