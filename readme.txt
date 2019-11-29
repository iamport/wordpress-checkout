=== Plugin Name ===
Contributors: iamport
Donate link: http://www.iamport.kr
Tags: payment, payment-button, iamport, woocommerce, button, pg, gateway
Requires at least: 3.0.1
Tested up to: 5.0.1
Stable tag: 1.1.11
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

shortcode를 활용해 아임포트 결제버튼을 어디서든 생성. 신용카드/실시간이체/가상계좌/휴대폰소액결제 가능.

== Description ==

아임포트는 국내 PG서비스들을 표준화하고 있는 결제 서비스입니다. 아임포트 하나면 국내 여러 PG사들의 결제 기능을 표준화된 동일한 방식으로 사용할 수 있게 됩니다. <br>
이 플러그인은 아임포트 서비스를 어디서든 쉽게 이용할 수 있도록 "결제버튼"을 생성해주는 shortcode를 포함하고 있습니다.<br>
우커머스가 설치되어있지 않은 환경에서도 사용하실 수 있습니다.
신용카드 / 실시간계좌이체 / 가상계좌 / 휴대폰소액결제를 지원합니다. <br>
아임포트(https://admin.iamport.kr) 회원가입 후 이용하실 수 있습니다.

http://www.iamport.kr 에서 아임포트 서비스에 대한 보다 상세한 내용을 확인하실 수 있습니다.

데모 페이지 : http://demo.movingcart.kr

*   아임포트 관리자 페이지( https://admin.iamport.kr ) 에서 관리자 회원가입을 합니다.
*   아임포트 플러그인을 다운받아 워드프레스에 설치합니다.
*   아임포트 결제설정 페이지에서 "가맹점 식별코드", "REST API키", "REST API secret"을 플러그인 설정에 저장합니다.


== Installation ==

아임포트 플러그인 설치, https://admin.iamport.kr 에서 관리자 회원가입, 시스템설정 정보저장이 필요합니다.


1. 다운받은 iamport.zip파일을 `/wp-content/plugins/` 디렉토리에 복사합니다.
2. unzip iamport.zip으로 압축 파일을 해제하면 iamport폴더가 생성됩니다.
3. 워드프레스 관리자페이지에서 'Plugins'메뉴를 통해 "아임포트 결제버튼 생성 플러그인" 플러그인을 활성화합니다.
4. https://admin.iamport.kr 에서 관리자 회원가입 후 시스템설정 페이지의 "가맹점 식별코드", "REST API키", "REST API secret"를 확인합니다.
5. 워드프레스 관리자페이지 좌측에 생성된 "아임포트 결제설정" 페이지에서 해당 정보를 저장합니다.

== Frequently Asked Questions ==
= 서비스 소개 =
http://www.iamport.kr
= 관리자 페이지 =
https://admin.iamport.kr
= 페이스북 =
https://www.facebook.com/iamportservice

= 고객센터 =
1670-5176 / cs@iamport.kr

== Screenshots ==

1. 아임포트 관리자 로그인 후 "시스템 설정" 페이지에서 "가맹점 식별코드", "REST API키", "REST API secret" 정보를 확인합니다.
2. "아임포트 결제설정" 페이지에서 "가맹점 식별코드", "REST API키", "REST API secret" 정보를 저장합니다.
3. 관리자 페이지에서 결제 정보를 조회하고 관리하실 수도 있습니다.


== Changelog ==
= 1.1.11 =
* 결제금액(amount)중 면세금액 처리를 위한 tax_free 속성 숏코드 지원

= 1.1.10 =
* 신용카드 최대 할부개월수 제한

= 1.1.9 =
* babel-polyfill 충돌 해결

= 1.1.8 =
* 복수PG설정 시, 추가PG를 MID로 지정할 수 있도록 설정 및 기능 추가

= 1.1.7 =
* 결제정보등록단계에서 오류가 발생하면 결제창호출하지 않고 오류메세지 출력하도록 수정

= 1.1.6 =
* IE에서 FormData API가 지원되지 않아 결제진행안되는 버그 수정

= 1.1.5 =
* 1.1.4에서 이전 입력정보가 캐시로 남아있는 버그 수정

= 1.1.4 =
* 사용자 입력필드를 custom_data 로 전달 (추후에 API 로 조회가 가능하도록)

= 1.1.3 =
* 이용자 동의체크 타입의 필드 추가 ([iamport_payment_button_field type="agreement"]저희 사이트는 고객님으로부터 아래와 같은 내용의 동의를 받고 있습니다. (이하 생략)[/iamport_payment_button_field])

= 1.1.2 =
* 불필요한 ob_start() 제거

= 1.1.1 =
* order_amount 단계부터 currency 지정할 수 있도록 수정(미결제내역도 currency 제대로 표기)

= 1.1.0 =
* Paypal 결제 기능 추가 (결제금액 소수점 지원)

= 1.0.3 =
* 라벨이 있는 선택형 금액일 때 괄호 안에 콤마, 괄호 등이 있어 잘못 해석하는 버그 수정
* Radio 필드의 경우 기본 선택 추가

= 1.0.2 =
* 신규 카카오페이 적용 (기존 숏코드와도 호환되도록)

= 1.0.1 =
* 금액 숫자 3자리마다 콤마찍어서 가독성 높여주기
* 금액 라벨에 숫자가 포함된 경우 대비해 정규식 보완

= 1.0.0 =
* 가상계좌 입금 시 주문내역 업데이트 기능 추가
* 낮은 PHP버전에서 가상계좌 발급정보가 기록되지 않는 버그 수정

= 0.9.31 =
* order\_status 변경시 action hook 정의
* 소스코드 정리

= 0.9.30 =
* 관리자 페이지내 다른 페이지에 영향을 주는 CSS 보정 [이슈링크](https://wordpress.org/support/topic/%ED%98%84%EC%9E%AC-%EB%B2%84%EC%A0%84-%EA%B4%80%EB%A6%AC%EC%9E%90%ED%99%94%EB%A9%B4%EC%97%90-%EC%98%81%ED%96%A5%EC%9D%84-%EC%A4%8D%EB%8B%88%EB%8B%A4/)
* vbank\_day\_limit 파라메터 관련 warning 메세지 발생하지 않도록 제거

= 0.9.29 =
* PC 버전 높이 줄어드는 현상 수정

= 0.9.28 =
* 안드로이드 / iOS 모두 CSS틀어지지 않도록 보완

= 0.9.27 =
* 가상계좌 입금기한(일자기준) 설정기능 추가

= 0.9.26 =
* field_list 속성에 대해 필드명(label), placeholder 설정기능 추가

= 0.9.25 =
* 매뉴얼에 data-for 관련 오타 수정

= 0.9.24 =
* 다이얼로그 css 수정

= 0.9.23 =
* 고정금액형 결제숏코드인 경우 구매자가 입력필드에서 값 수정이 불가능하도록 readonly 추가

= 0.9.22 =
* PHP 5.3 이하 syntax error 발생하지 않도록 수정

= 0.9.21 =
* 한 페이지에 결제버튼이 여러 개일 때, name, pay\_method\_list 등 잘못 적용되는 버그 수정
* field\_list에 배송주소(shipping_addr) 지원
* php empty() 내에 함수 실행안되도록 수정

= 0.9.20 =
* script cache 삭제

= 0.9.19 =
* 특정 테마환경과 충돌되지 않도록 UI렌더링 방식 변경

= 0.9.18 =
* 설정 파일 백업 및 복원

= 0.9.17 =
* 타입 체크 추가

= 0.9.16 =
* <?를 <?php로 수정

= 0.9.15 =
* 파일 업로드 필드 추가

= 0.9.14 =
* 모바일 환경에서 우편번호 찾기 스크롤 관련 개선
* 모바일일때는 모달이 전체화면에 꽉 차도록 UI 수정
* select 태그 브라우저 기본 레퍼런스 무시하고 아래 화살표 이미지 추가

= 0.9.13 =
* 결제금액에 라벨 가능하도록

= 0.9.12 =
* 리팩토링 및 웹팩 적용

= 0.9.11 =
* input text field에 custom placeholder 속성 추가
* input text field에 datafor 속성 추가
* 추가 속성에 대한 아임포트 숏코드 메뉴얼 업데이트

= 0.9.10 =
* 프로토콜에 맞는 daum postcode API 불러오도록 설정

= 0.9.9 =
* 숏코드 content trim 관련 이슈 해결

= 0.9.8 =
* 주소 검색 필드 추가
* 아임포트 숏코드 예시 페이지 및 아임포트 설정 페이지 업데이트
* 텍스트 필드 필수입력 검증 로직 수정
* 모달 내부 가로 스크롤 이슈 해결

= 0.9.7 =
* 필수입력 필드 미입력시 모달 내부 스크롤이 해당 element 위치로 이동

= 0.9.6 =
* dimmed background 눌러도 모달 닫히게 하기
* viewHeight에 따른 모달 top값 조절 및 body의 scroll 여부 조절

= 0.9.5 =
* jquery dialog를 css display 속성으로 대체
* 결제 / 로그인 / 결제결과 모달 디자인 수정
* 필수 입력 필드 미 입력시 alert를 에러 메시지로 대체
* 추가 입력을 먼저 받고 다음 버튼을 누르면 결제에 필요한 입력을 받도록 플로우 수정

= 0.9.4 =
* 숫자가 아닌 전화번호 입력값이 들어오면 사전 필터링

= 0.9.3 =
* 필수입력값이 채워지지 않은 상태에서 결제하기 버튼 한 번 클릭하면 새로고침해야 다시 결제할 수 있는 문제 개선(결제하기 버튼 busy처리 로직 수정)

= 0.9.2 =
* wp\_get\_current\_user() 가 제대로 동작하려면 `init` 뒤에 호출되어야 정상적으로 동작함. 환경에 따라 차이가 있어 `init` hook에서 setting 정보 저장할 수 있도록 수정

= 0.9.1 =
* administrator 뿐 아니라 editor 도 주문목록 확인 & 편집이 가능하도록 권한 정리

= 0.9.0 =
* 결제시 구매자로부터 추가정보 입력받을 수 있도록 [iamport_payment_button_field]숏코드 추가

= 0.8.0 =
* 결제금액 옵션에 대해서 여러 설정이 가능해짐. (1)고정형 금액 (2)선택형 금액 (3)구매자 입력형 금액

= 0.7.1 =
* 결제수단에 카카오페이 추가

= 0.7.0 =
* 복수PG사용자가 결제수단별로 이용할 수 있도록 수정
* 다날 가상계좌 결제연동되도록 사업자번호 입력필드 추가

= 0.6.0 =
* 결제버튼이 본문에 적용된 정렬 속성이 처리되도록 수정
* 삼성페이 결제수단 추가

= 0.5.5 =
* paid_at, vbank_due unixtimestamp형태로 저장하고 출력할 때 timezone계산해서 보여주기

= 0.5.4 =
* 마이페이지에서 결제상태, 결제일시 출력안되는 버그 수정
* 마이페이지에서 결제내역 모바일에서도 잘 보여지도록 반응형

= 0.5.3 =
* 관리자 계정은 전체 결제내역정보를 확인할 수 있도록 수정

= 0.5.2 =
* 회원에 한하여 결제기능 제공이 가능하도록 기능 추가. 아임포트 설정페이지에 "로그인 된 사용자에게만 구매 허용하시려면 체크하세요" 추가

= 0.5.1 =
* order_uid 파라메터 query string 방식으로 변환
* 결제완료 후 특정 페이지로 이동할 수 있도록 redirect_after 속성을 shortcode에 지원

= 0.5.0 =
* 생성자 잘못 사용되고 있던 버그 수정

= 0.43 =
* php short_open_tag 설정이 off인 경우에 오류가 발생하는 버그 수정

= 0.42 =
* require_once 절대경로로 변경

= 0.41 =
* 우커머스용 아임포트 플러그인과 동시에 설치되었을 때 lib/iamport.php 에서 class redeclare충돌나지 않도록 처리
* 스크린샷 추가

= 0.4 =
* 결제 시 사용자 정보를 입력받을 수 있도록 jQuery dialog적용 ( shortcode attribute를 통해 원하는 필드만 지정 가능 )
* 관리자 페이지에서 아임포트 결제내역을 조회할 수 있음(아임포트 결제내역에 대한 custom post type 정의 및 메타데이터 적용)
* 사용자가 자신의 결제내역을 확인할 수 있음(아임포트 결제 내역을 출력하는 shortcode적용)
* 아임포트 shortcode 예시 소개 포함
* 한 페이지에 여러 개의 payment button shortcode가 포함되어있을 때 initialized 오동작 버그 수정

= 0.32 =
* shortcode content영역에 img태그 등 html태그가 직접 사용될 수 있도록 strip_tags함수 제거
* 워드프레스 4.4와 호환되는지 확인함

= 0.31 =
* shortcode 가 html생성하는 방식이 잘못되어 수정
* 결제하기 버튼이 클릭되었을 때 IMP.init()호출하도록 변경

= 0.3 =
* 최초 배포
* http://demo.movingcart.kr 에 적용된 버전


== Action Hook ==

= 아임포트 결제버튼 생성 플러그인이 제공하는 action hook =
*   `iamport_button_order_status_changed` : 아임포트 주문데이터의 상태가 변경되었을 때 호출($old\_status, $new\_status, $iamport\_order, $iamport\_api\_response) 4개의 파라메터 제공
    * status
        * ready : 미결제
        * paid : 결제완료
        * failed : 결제실패
        * cancelled : 환불됨
        * awaiting-vbank : 가상계좌 입금대기중
    * iamport\_order : model/iamport-order.php 참조
    * iamport\_api\_response : [아임포트 REST API](https://api.iamport.kr/#!/payments/getPaymentByImpUid) 의 응답필드 참조
