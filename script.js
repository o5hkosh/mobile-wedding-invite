// DOMContentLoaded 이벤트는 HTML 문서가 완전히 로드되고 파싱되었을 때 발생합니다.
// 스크립트가 실행되기 전에 HTML 요소들이 준비되도록 보장합니다.
document.addEventListener('DOMContentLoaded', function() {

    // --- 필요한 HTML 요소들을 JavaScript 코드에서 사용할 수 있도록 가져옵니다. ---
    const modal = document.getElementById('myModal'); // 모달 컨테이너 요소
    const modalImage = document.getElementById('modalImage'); // 모달 안의 확대 사진 이미지 요소
    const closeBtn = document.getElementsByClassName('close')[0]; // 모달 닫기 버튼 요소 (클래스가 'close'인 첫 번째 요소)
    const galleryPhotos = document.querySelectorAll('#gallery .gallery-photos .gallery-photo'); // 갤러리 섹션 안의 모든 사진 이미지 요소들 (NodeList 형태)
    const loadMoreBtn = document.getElementById('loadMoreBtn'); // '더보기' 버튼 요소
    const mainContent = document.querySelector('main'); // 블러 처리할 메인 콘텐츠 영역 요소 (<main> 태그)

    // 모달 이전/다음 버튼 요소들
    const prevBtn = document.querySelector('#myModal .prev');
    const nextBtn = document.querySelector('#myModal .next');

    // 현재 모달에 표시된 사진의 갤러리 내 인덱스를 저장하는 변수
    let currentPhotoIndex = 0;


    // --- '더보기' 버튼 기능 구현 ---
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // **수정**: 13번째 사진부터 (인덱스 12) 나머지 사진들을 순회하며 보이게 합니다.
            // galleryPhotos는 0부터 시작하는 배열과 같으므로, 13번째 사진은 인덱스 12입니다.
            for (let i = 12; i < galleryPhotos.length; i++) {
                // 사진을 보이게 할 때 removeProperty를 사용합니다.
                galleryPhotos[i].style.removeProperty('display');
            }

            // 모든 사진을 보이게 한 후에는 '더보기' 버튼을 숨깁니다.
            loadMoreBtn.style.display = 'none';
        });
    }


    // --- 갤러리 사진 클릭 시 확대 모달 표시 기능 구현 ---
    galleryPhotos.forEach(function(photo, index) { // index 인자 추가 (현재 사진의 순서)
        photo.addEventListener('click', function() {
            // 클릭된 사진 요소(this)의 src 속성값을 가져와서 모달 안 이미지 요소의 src로 설정합니다.
            modalImage.src = this.src;

            // 클릭된 사진의 인덱스를 currentPhotoIndex 변수에 저장합니다.
            currentPhotoIndex = index;

            // 모달 컨테이너를 화면에 보이도록 display 속성을 변경합니다.
            modal.style.display = 'block';

            // 메인 콘텐츠 영역에 블러 처리를 위한 CSS 클래스('blurred')를 추가합니다.
            if (mainContent) {
               mainContent.classList.add('blurred');
            }

            // 이전/다음 버튼의 초기 표시 상태를 업데이트합니다.
            updateModalNavButtons();
        });
    });


    // --- 모달 닫기 버튼 기능 구현 ---
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            if (mainContent) {
                mainContent.classList.remove('blurred');
            }
        });
    }

    // --- 모달 배경 클릭 시 닫기 기능 구현 ---
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


    // --- 모달 이전/다음 버튼 기능 구현 ---

    // 이전 버튼 클릭 이벤트 리스너
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentPhotoIndex--; // 이전 사진 인덱스
            showPhotoInModal(currentPhotoIndex);
        });
    }

    // 다음 버튼 클릭 이벤트 리스너
    if (nextBtn) {
        nextPhotoIndex = currentPhotoIndex + 1; // 다음 사진 인덱스
        // **수정**: 다음 버튼 로직을 함수 호출로 변경
        nextBtn.addEventListener('click', function() {
             currentPhotoIndex++; // 다음 사진 인덱스
             showPhotoInModal(currentPhotoIndex);
        });
    }

    // --- 특정 인덱스의 사진을 모달에 표시하고 네비게이션 버튼 상태 업데이트하는 함수 ---
    function showPhotoInModal(indexToShow) {
        // 인덱스가 유효 범위 내에 있는지 확인합니다.
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
                prevBtn.style.display = 'none'; // 첫 사진이면 이전 버튼 숨김
            } else {
                prevBtn.style.display = 'block'; // 아니면 보이게 함
            }
        }

        if (nextBtn) {
            if (currentPhotoIndex === galleryPhotos.length - 1) {
                nextBtn.style.display = 'none'; // 마지막 사진이면 다음 버튼 숨김
            } else {
                nextBtn.style.display = 'block'; // 아니면 보이게 함
            }
        }
    }


}); // DOMContentLoaded 이벤트 리스너 끝