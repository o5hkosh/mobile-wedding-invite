// DOMContentLoaded 이벤트는 HTML 문서가 완전히 로드되고 파싱되었을 때 발생합니다.
// 스크립트가 실행되기 전에 HTML 요소들이 준비되도록 보장합니다.
document.addEventListener('DOMContentLoaded', function() {

    // --- 필요한 HTML 요소들을 JavaScript 코드에서 사용할 수 있도록 가져옵니다. ---
    const modal = document.getElementById('myModal'); // 모달 컨테이너 요소
    const modalImage = document.getElementById('modalImage'); // 모달 안의 확대 사진 이미지 요소
    const closeBtn = document.getElementsByClassName('close')[0]; // 모달 닫기 버튼 요소 (클래스가 'close'인 첫 번째 요소)
    const galleryPhotos = document.querySelectorAll('#gallery .gallery-photo'); // 갤러리 섹션 안의 모든 사진 이미지 요소들 (NodeList 형태)
    const loadMoreBtn = document.getElementById('loadMoreBtn'); // '더보기' 버튼 요소
    const mainContent = document.querySelector('main'); // 블러 처리할 메인 콘텐츠 영역 요소 (<main> 태그)


    // --- '더보기' 버튼 기능 구현 ---
    // loadMoreBtn 요소가 실제로 존재하는지 확인합니다. (HTML에 버튼을 추가했는지)
    if (loadMoreBtn) {
        // '더보기' 버튼에 클릭 이벤트 리스너를 추가합니다.
        loadMoreBtn.addEventListener('click', function() {
            // CSS로 숨겨진 사진 요소들 (9번째부터)을 선택합니다.
            const hiddenPhotos = document.querySelectorAll('#gallery .gallery-photos .gallery-photo:nth-child(n+9)');

            // 선택된 숨겨진 사진들을 순회하며 보이도록 스타일을 변경합니다.
            hiddenPhotos.forEach(function(photo) {
                // display 속성을 빈 문자열('')로 설정하면 해당 요소의 원래 display 속성값(Grid 항목의 경우 block 등)으로 돌아가게 하여 Grid 레이아웃에 맞게 보이게 합니다.
                photo.style.display = '';
            });

            // 모든 사진을 보이게 한 후에는 '더보기' 버튼을 숨깁니다.
            loadMoreBtn.style.display = 'none';
        });
    }


    // --- 갤러리 사진 클릭 시 확대 모달 표시 기능 구현 ---
    // galleryPhotos (모든 갤러리 사진 요소들)을 순회합니다.
    galleryPhotos.forEach(function(photo) {
        // 각 사진에 클릭 이벤트 리스너를 추가합니다.
        photo.addEventListener('click', function() {
            // 클릭된 사진 요소(this)의 src 속성값을 가져와서 모달 안 이미지 요소의 src로 설정합니다.
            modalImage.src = this.src;

            // 모달 컨테이너를 화면에 보이도록 display 속성을 변경합니다. (CSS에서 기본 display는 none으로 되어 있습니다.)
            modal.style.display = 'block';

            // 메인 콘텐츠 영역에 블러 처리를 위한 CSS 클래스('blurred')를 추가합니다. (CSS에서 .blurred 스타일을 정의해야 합니다.)
            if (mainContent) { // mainContent 요소가 존재하는지 확인합니다.
               mainContent.classList.add('blurred');
            }
        });
    });


    // --- 모달 닫기 버튼 기능 구현 ---
    // closeBtn 요소가 실제로 존재하는지 확인합니다. (HTML에 닫기 버튼을 추가했는지)
    if (closeBtn) {
        // 닫기 버튼에 클릭 이벤트 리스너를 추가합니다.
        closeBtn.addEventListener('click', function() {
            // 모달 컨테이너를 다시 숨깁니다.
            modal.style.display = 'none';

            // 메인 콘텐츠 영역에서 블러 처리를 위한 CSS 클래스('blurred')를 제거합니다.
             if (mainContent) { // mainContent 요소가 존재하는지 확인합니다.
                mainContent.classList.remove('blurred');
            }
        });
    }

    // --- 모달 배경 클릭 시 닫기 기능 구현 (선택 사항, 사용자 경험 향상) ---
    // 모달 컨테이너 자체를 클릭했을 때도 모달이 닫히도록 합니다. (단, 이미지나 닫기 버튼 클릭은 제외)
    if (modal) { // modal 요소가 존재하는지 확인합니다.
         modal.addEventListener('click', function(event) {
             // 클릭된 요소(event.target)가 모달 컨테이너 자체와 동일한 경우에만 모달을 닫습니다. (이미지나 버튼 클릭 시에는 닫히지 않음)
             if (event.target === modal) {
                 modal.style.display = 'none';
                 if (mainContent) {
                     mainContent.classList.remove('blurred');
                 }
             }
         });
    }

}); // DOMContentLoaded 이벤트 리스너 끝