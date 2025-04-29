// DOMContentLoaded 이벤트는 HTML 문서가 완전히 로드되고 파싱되었을 때 발생합니다.
document.addEventListener('DOMContentLoaded', function() {

    // --- 필요한 HTML 요소들을 JavaScript 코드에서 사용할 수 있도록 가져옵니다. ---
    const modal = document.getElementById('myModal'); // 모달 컨테이너 요소
    const modalImage = document.getElementById('modalImage'); // 모달 안의 확대 사진 이미지 요소
    const closeBtn = document.getElementsByClassName('close')[0]; // 모달 닫기 버튼 요소 (클래스가 'close'인 첫 번째 요소)
    const galleryPhotos = document.querySelectorAll('#gallery .gallery-photos .gallery-photo'); // 갤러리 섹션 안의 모든 사진 이미지 요소들 (NodeList 형태)
    // '더보기' 버튼 요소 (현재 사용 안 함)
    // const loadMoreBtn = document.getElementById('loadMoreBtn');
    const mainContent = document.querySelector('main'); // 블러 처리할 메인 콘텐츠 영역 요소 (<main> 태그)

    // 모달 이전/다음 버튼 요소들
    const prevBtn = document.querySelector('#myModal .prev');
    const nextBtn = document.querySelector('#myModal .next');

    // 현재 모달에 표시된 사진의 갤러리 내 인덱스를 저장하는 변수
    let currentPhotoIndex = 0;


    // --- '더보기' 버튼 기능 (현재 사용 안 함) ---
    /*
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // 13번째 사진부터 선택
            const hiddenPhotos = document.querySelectorAll('#gallery .gallery-photos .gallery-photo:nth-child(n+13)');

            hiddenPhotos.forEach(function(photo) {
                photo.style.removeProperty('display'); // display 속성을 제거하여 CSS에 맡김
            });

            loadMoreBtn.style.display = 'none'; // '더보기' 버튼 숨김
        });
    }
    */


    // --- 갤러리 사진 클릭 시 확대 모달 표시 기능 ---
    galleryPhotos.forEach(function(photo, index) { // index 인자 추가 (현재 사진의 순서)
        photo.addEventListener('click', function() {
            modalImage.src = this.src; // 클릭된 사진 src 설정

            currentPhotoIndex = index; // 현재 인덱스 저장

            modal.style.display = 'block'; // 모달 보이기

            if (mainContent) { mainContent.classList.add('blurred'); } // 배경 블러

            updateModalNavButtons(); // 네비게이션 버튼 상태 업데이트
        });
    });


    // --- 모달 닫기 버튼 기능 ---
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none'; // 모달 숨기기
            if (mainContent) { mainContent.classList.remove('blurred'); } // 블러 제거
        });
    }

    // --- 모달 배경 클릭 시 닫기 기능 ---
    if (modal) {
         modal.addEventListener('click', function(event) {
             if (event.target === modal) {
                 modal.style.display = 'none';
                 if (mainContent) {
                     mainContent.classList.remove('blurred');
                 }
             }
         });
    }


    // --- 모달 이전/다음 버튼 기능 ---
    // showPhotoInModal, updateModalNavButtons 함수는 아래에 있습니다.
    if (prevBtn) { prevBtn.addEventListener('click', function() { currentPhotoIndex--; showPhotoInModal(currentPhotoIndex); }); }
    if (nextBtn) { nextBtn.addEventListener('click', function() { currentPhotoIndex++; showPhotoInModal(currentPhotoIndex); }); }


    // --- **추가**: 모달 사진 스와이프 기능 구현 ---
    let touchStartX = 0; // 터치 시작 X 좌표
    let touchEndX = 0; // 터치 끝 X 좌표
    const swipeThreshold = 75; // 스와이프로 인식할 최소 이동 거리 (px) - 조절 가능

    // 확대된 사진에 터치 시작 이벤트 리스너 추가
    modalImage.addEventListener('touchstart', function(event) {
        // 터치 시작 시 첫 번째 손가락의 X 좌표 기록
        touchStartX = event.touches[0].clientX;
        // event.preventDefault(); // 필요시 기본 동작 방지 (예: 이미지 드래그)
    });

    // 확대된 사진에 터치 이동 이벤트 리스너 추가
    modalImage.addEventListener('touchmove', function(event) {
         // event.preventDefault(); // 터치 중 기본 스크롤/드래그 동작 방지
    });

    // 확대된 사진에 터치 끝 이벤트 리스너 추가
    modalImage.addEventListener('touchend', function(event) {
        // 터치 끝 시 마지막 손가락의 X 좌표 기록
        touchEndX = event.changedTouches[0].clientX;

        // 시작점 대비 끝점의 수평 이동 거리 계산
        const deltaX = touchEndX - touchStartX;

        // 이동 거리가 스와이프 임계값보다 큰지 확인
        if (Math.abs(deltaX) > swipeThreshold) {
            // 왼쪽으로 스와이프 (다음 사진)
            if (deltaX < 0) {
                const nextIndex = currentPhotoIndex + 1;
                showPhotoInModal(nextIndex);
            }
            // 오른쪽으로 스와이프 (이전 사진)
            else { // deltaX > 0
                const prevIndex = currentPhotoIndex - 1;
                showPhotoInModal(prevIndex);
            }
        }
        // event.preventDefault(); // 필요시 기본 동작 방지
    });


    // --- 특정 인덱스의 사진을 모달에 표시하고 네비게이션 버튼 상태 업데이트하는 함수 ---
    function showPhotoInModal(indexToShow) {
        if (indexToShow >= 0 && indexToShow < galleryPhotos.length) {
            modalImage.src = galleryPhotos[indexToShow].src;
            currentPhotoIndex = indexToShow;
            updateModalNavButtons();
        }
    }

    // --- 이전/다음 버튼의 표시 상태를 업데이트하는 함수 ---
    // 첫 사진이면 이전 버튼 숨김, 마지막 사진이면 다음 버튼 숨김
    function updateModalNavButtons() {
        if (prevBtn) {
            if (currentPhotoIndex === 0) {
                prevBtn.style.display = 'none'; // 첫 사진이면 이전 버튼 숨김
            } else {
                prevBtn.style.display = 'block'; // 아니면 보이게 함
            }
        }

        if (nextBtn) {
            if (currentPhotoIndex === galleryPhotos.length - 1) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'block';
            }
        }
    }


}); // DOMContentLoaded 이벤트 리스너 끝