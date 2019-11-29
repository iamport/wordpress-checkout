<?php
/*
Plugin Name: 아임포트 결제버튼 생성 플러그인
Plugin URI: http://www.iamport.kr
Description: 원하는 위치에 자유자재로 결제버튼을 생성하실 수 있는 아임포트 플러그인입니다. 국내 PG사의 다양한 결제수단을 이용하실 수 있습니다. ( 신용카드 / 실시간계좌이체 / 가상계좌 / 휴대폰소액결제 - 에스크로포함 )
Version: 1.1.11
Author: SIOT
Author URI: http://www.siot.do
*/

require_once(dirname(__FILE__).'/model/iamport-payment-shortcode.php');
require_once(dirname(__FILE__).'/model/iamport-payment-callback.php');

register_activation_hook( __FILE__, 'iamport_activated' );

function iamport_activated() {
	create_history_page();
	create_thankyou_page();
	add_endpoints();
}

function create_history_page() {
	$slug = 'iamport_history';

	$history_page = get_page_by_slug($slug);
	if( empty($history_page) ) {
		$page_data = array(
			'post_status'		=> 'publish',
			'post_type'			=> 'page',
			'post_author'		=> 1,
			'post_name'			=> $slug,
			'post_title'		=> '결제내역 - 아임포트',
			'post_content'		=> '[iamport_history_page]',
			'post_parent'		=> 0,
			'comment_status'	=> 'closed'
		);

		$page_id = wp_insert_post( $page_data );
	}
}

function create_thankyou_page() {
	$slug = 'iamport_thankyou';

	$thankyou_page = get_page_by_slug($slug);
	if( empty($thankyou_page) ) {
		$page_data = array(
			'post_status'		=> 'publish',
			'post_type'			=> 'page',
			'post_author'		=> 1,
			'post_name'			=> $slug,
			'post_title'		=> '결제완료 - 아임포트',
			'post_content'		=> '[iamport_thankyou_page]',
			'post_parent'		=> 0,
			'comment_status'	=> 'closed'
		);

		$page_id = wp_insert_post( $page_data );
	}
}

function get_page_by_slug($slug) {
	$args = array(
		'name'        => $slug,
		'post_type'   => 'page',
		'post_status' => 'publish',
		'numberposts' => 1
	);
	return get_posts($args);
}

function add_endpoints() {
	add_rewrite_endpoint( 'iamport-order-view', EP_PAGES );
	add_rewrite_endpoint( 'iamport-order-received', EP_PERMALINK | EP_PAGES );

	flush_rewrite_rules();
}

new IamportPaymentShortcode();
