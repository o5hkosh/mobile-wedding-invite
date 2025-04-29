// DOMContentLoaded 이벤트는 HTML 문서가 완전히 로드되고 파싱되었을 때 발생합니다.
document.addEventListener('DOMContentLoaded', function() {

    // --- 필요한 HTML 요소들을 JavaScript 코드에서 사용할 수 있도록 가져옵니다. ---
    const modal = document.getElementById('myModal'); // 모달 컨테이너
    const modalImage = document.getElementById('modalImage'); // 모달 안의 확대 사진 이미지
    const closeBtn = document.getElementsByClassName('close')[0]; // 모달 닫기 버튼
    const galleryPhotos = document.querySelectorAll('#gallery .gallery-photos .gallery-photo'); // 갤러리 사진 목록
    const loadMoreBtn = document.getElementById('loadMoreBtn'); // '더보기' 버튼 (현재 사용 안 함)
    const mainContent = document.querySelector('main'); // 블러 처리할 메인 콘텐츠 영역

    const prevBtn = document.querySelector('#myModal .prev'); // 이전 버튼
    const nextBtn = document.querySelector('#myModal .next'); // 다음 버튼

    let currentPhotoIndex = 0; // 현재 모달에 표시된 사진의 갤러리 내 인덱스


    // --- '더보기' 버튼 기능 (현재 사용 안 함) ---
    /*
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const hiddenPhotos = document.querySelectorAll('#gallery .gallery-photos .gallery-photo:nth-child(n+13)');
            hiddenPhotos.forEach(function(photo) {
                photo.style.removeProperty('display');
            });
            loadMoreBtn.style.display = 'none';
        });
    }
    */


    // --- 갤러리 사진 클릭 시 확대 모달 표시 기능 ---
    galleryPhotos.forEach(function(photo, index) {
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
                 if (mainContent) { mainContent.classList.remove('blurred'); }
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
    function updateModalNavButtons() {
        if (prevBtn) {
            if (currentPhotoIndex === 0) {
                prevBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'block';
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