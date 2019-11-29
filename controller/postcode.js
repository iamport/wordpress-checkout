
export function foldDaumPostcode(e, targetPostcodeBox) {
	jQuery(($) => {
		const { target } = e;
		let tg = $(target);

		if ( !targetPostcodeBox ) {
			targetPostcodeBox = tg.parents('div#wrap')[0];
		}
		
		// 모바일 화면에서, 키보드 입력 패드로 인해 우편번호 iframe이 가려지는 이슈 해결
		/* ==================== REFACTORING: p 태그를 div로 바꾸기 ==================== */
		const targetCustomInputTop = targetPostcodeBox.previousSibling.offsetTop;
	    const targetContainer = $(targetPostcodeBox).parents('div.iamport-modal-container')[0];
	    targetContainer.scrollTop = targetCustomInputTop;
	    
	    // iframe을 넣은 element를 안보이게 한다.
	    targetPostcodeBox.style.display = 'none';

	    const targetContent = tg.parents('div.iamport-modal-content')[0];
	    const targetContentHeight = targetContent.offsetHeight + 24;
	    if ( targetContentHeight < 400 ) {
	    	let targetModal = tg.parents('div.iamport-modal')[0];	
	   
	    	targetModal.style.top = targetModal.offsetTop + (400 - targetContentHeight)/2 + 'px';
	    }
	});
}

export function execDaumPostcode(e) {
	jQuery(($) => {
		const { target } = e;
		
		const tg = $(target);
		const targetCustomInput = tg.parents('p.custom-input');
		let targetPostcodeBox = targetCustomInput[0].nextSibling;
		
		if ( targetPostcodeBox.style.display === "none" ) {
			let targetModal = tg.parents('div.iamport-modal');
			const targetContainer = tg.parents('div.iamport-modal-container');
			const targetContent = tg.parents('div.iamport-modal-content');

			const targetContentHeight = targetContent[0].offsetHeight + 24;
			
			if ( targetContentHeight < 400 ) {
				targetModal[0].style.top = targetModal[0].offsetTop - (400 - targetContentHeight)/2 + 'px';
			}
			
			// iframe을 넣은 element를 보이게 한다.
		    targetPostcodeBox.style.display = 'block';	

		    // 모바일 화면에서, 키보드 입력 패드로 인해 우편번호 iframe이 가려지는 이슈 해결
			targetContainer[0].scrollTop = targetCustomInput[0].offsetTop + targetCustomInput[0].clientHeight;

		    new daum.Postcode({
		        oncomplete: (data) => {
		            // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

		            const { addressType, bname, buildingName, zonecode, address } = data;
		            
		            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
		            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
		            let fullAddr = address; // 최종 주소 변수
		            let extraAddr = ''; // 조합형 주소 변수
		            
		            // 기본 주소가 도로명 타입일때 조합한다.
		            if(addressType === 'R'){
		                //법정동명이 있을 경우 추가한다.
		                if(bname !== ''){
		                    extraAddr += bname;
		                }
		                // 건물명이 있을 경우 추가한다.
		                if(buildingName !== ''){
		                    extraAddr += (extraAddr !== '' ? ', ' + buildingName : buildingName);
		                }
		                // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
		                fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
		            }
					
		            let targetPostcode = targetCustomInput.find('.iamport-postcode');
					let targetAddress = targetCustomInput.find('.iamport-address');

		            // 우편번호와 주소 정보를 해당 필드에 넣는다.
		            targetPostcode[0].value = zonecode; //5자리 새우편번호 사용
		            targetAddress[0].value = fullAddr;

		            // iframe을 넣은 element를 안보이게 한다.
		            // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
		            foldDaumPostcode(e, targetPostcodeBox);
		        },
		        // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
		        onresize : (size) => {
		            targetPostcodeBox.style.height = size.height+'px';
		        },
		        width: '100%',
		        height: '100%'
		    }).embed(targetPostcodeBox);
		}
	});
}
