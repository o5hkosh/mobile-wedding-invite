// DOMContentLoaded 이벤트는 HTML 문서가 완전히 로드되고 파싱되었을 때 발생합니다.
document.addEventListener('DOMContentLoaded', function() {

    // --- 필요한 HTML 요소들을 JavaScript 코드에서 사용할 수 있도록 가져옵니다. ---
    const modal = document.getElementById('myModal'); // 모달 컨테이너 요소
    // **수정**: 모달 안의 확대 사진 이미지 요소만 가져옵니다. (슬라이드 관련 요소 삭제)
    const modalImage = document.getElementById('modalImage'); // 모달 안의 확대 사진 이미지 요소

    const closeBtn = document.getElementsByClassName('close')[0]; // 모달 닫기 버튼 요소 (클래스가 'close'인 첫 번째 요소)
    const galleryPhotos = document.querySelectorAll('#gallery .gallery-photos .gallery-photo'); // 갤러리 섹션 안의 모든 사진 이미지 요소들 (20개)

    const loadMoreBtn = document.getElementById('loadMoreBtn'); // '더보기' 버튼 (현재 사용 안 함)
    const mainContent = document.querySelector('main'); // 블러 처리할 메인 콘텐츠 영역 요소 (<main> 태그)

    // 모달 이전/다음 버튼 요소들
    const prevBtn = document.querySelector('#myModal .prev');
    const nextBtn = document.querySelector('#myModal .next');

    // 현재 모달에 표시된 사진의 갤러리 내 인덱스를 저장하는 변수
    let currentPhotoIndex = 0;


    // --- '더보기' 버튼 기능 (현재 사용 안 함) ---
    /*
    if (loadMoreBtn) {
        // ... (코드 삭제) ...
    }
    */


    // --- 갤러리 사진 클릭 시 확대 모달 표시 기능 ---
    galleryPhotos.forEach(function(photo, index) { // index 인자 추가 (현재 사진의 순서)
        photo.addEventListener('click', function() {
            // 클릭된 사진 요소(this)의 src 속성값을 가져와서 모달 안 이미지 요소의 src로 설정합니다.
            modalImage.src = this.src;

            // 클릭된 사진의 인덱스를 currentPhotoIndex 변수에 저장합니다.
            currentPhotoIndex = index;

            // 모달 컨테이너를 화면에 보이도록 display 속성을 변경합니다.
            modal.style.display = 'block'; // **수정**: 'flex' 대신 'block' 사용 (기본 모달 스타일과 일치)

            // 메인 콘텐츠 영역에 블러 처리를 위한 CSS 클래스('blurred')를 추가합니다.
            if (mainContent) {
               mainContent.classList.add('blurred');
            }

            // 이전/다음 버튼의 초기 표시 상태를 업데이트합니다.
            updateModalNavButtons();
        });
    });


    // --- 모달 닫기 버튼 기능 ---
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none'; // 모달 숨기기
            if (mainContent) {
                mainContent.classList.remove('blurred');
            }
             // **수정**: 모달 닫을 때 확대 이미지 src 비우기 (메모리 관리)
            modalImage.src = '';
        });
    }

    // --- 모달 배경 클릭 시 닫기 기능 ---
    if (modal) {
         modal.addEventListener('click', function(event) {
             // 클릭된 요소가 모달 컨테이너 자체일 때 닫습니다. (이미지나 버튼 클릭은 제외)
             if (event.target === modal) { // **수정**: 슬라이드 컨테이너 체크 로직 삭제
                 modal.style.display = 'none';
                 if (mainContent) { mainContent.classList.remove('blurred'); }
                 // 모달 닫을 때 확대 이미지 src 비우기
                 modalImage.src = '';
             }
         });
    }


    // --- 모달 이전/다음 버튼 기능 ---
    // showPhotoInModal, updateModalNavButtons 함수는 아래에 있습니다.
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const targetIndex = currentPhotoIndex - 1; // 이전 사진 인덱스
            showPhotoInModal(targetIndex); // 이전 사진을 모달에 표시
        });
    }

    if (nextBtn) {
         nextBtn.addEventListener('click', function() {
            const targetIndex = currentPhotoIndex + 1; // 다음 사진 인덱스
            showPhotoInModal(targetIndex); // 다음 사진을 모달에 표시
        });
    }

    // --- **수정**: 특정 인덱스의 사진을 모달에 표시하고 네비게이션 버튼 상태 업데이트하는 함수 ---
    function showPhotoInModal(indexToShow) {
        // 인덱스가 유효 범위 내에 있는지 확인합니다.
        if (indexToShow >= 0 && indexToShow < galleryPhotos.length) {
            modalImage.src = galleryPhotos[indexToShow].src; // **수정**: 모달 이미지 src만 변경
            currentPhotoIndex = indexToShow;
            updateModalNavButtons();
        }
    }

    // --- 모달 이전/다음 버튼의 표시 상태를 업데이트하는 함수 ---
    // 첫 사진이면 이전 버튼 숨김, 마지막 사진이면 다음 버튼 숨김
    function updateModalNavButtons() {
        if (prevBtn) {
            if (currentPhotoIndex <= 0) { // 인덱스 0 이하일 때 (첫 사진 포함)
                prevBtn.style.display = 'none'; // 이전 버튼 숨김
            } else {
                prevBtn.style.display = 'block'; // 아니면 보이게 함
            }
        }

        if (nextBtn) {
            if (currentPhotoIndex >= galleryPhotos.length - 1) { // 인덱스 마지막 이상일 때 (마지막 사진 포함)
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'block';
            }
        }
    }

    // **삭제**: 부드러운 전환 관련 함수 및 이벤트 리스너 삭제
    /*
    let isAnimating = false;
    let touchStartX = 0; ... swipeThreshold ... mouseIsDown ...
    modalSlidesContainer.addEventListener('touchstart', function() { ... });
    modalSlidesContainer.addEventListener('touchmove', function() { ... });
    modalSlidesContainer.addEventListener('touchend', function() { ... });
    modalSlidesContainer.addEventListener('mousedown', function() { ... });
    modalSlidesContainer.addEventListener('mousemove', function() { ... });
    modalSlidesContainer.addEventListener('mouseup', function() { ... });
    document.addEventListener('mouseleave', function() { ... });
    function animateSlideTo(targetIndex) { ... }
    function handleSlideTransitionEnd() { ... }
    function centerSlideImmediately() { ... }
    */


}); // DOMContentLoaded 이벤트 리스너 끝