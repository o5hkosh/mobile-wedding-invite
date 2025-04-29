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

    // **추가**: 모달 이전/다음 버튼 요소들
    const prevBtn = document.querySelector('#myModal .prev');
    const nextBtn = document.querySelector('#myModal .next');

    // **추가**: 현재 모달에 표시된 사진의 갤러리 내 인덱스를 저장하는 변수
    let currentPhotoIndex = 0;


    // --- '더보기' 버튼 기능 구현 ---
    // loadMoreBtn 요소가 실제로 존재하는지 확인합니다. (HTML에 버튼을 추가했는지)
    if (loadMoreBtn) {
        // '더보기' 버튼에 클릭 이벤트 리스너를 추가합니다.
        loadMoreBtn.addEventListener('click', function() {
            // CSS로 숨겨진 사진 요소들 (13번째부터)을 선택합니다.
            const hiddenPhotos = document.querySelectorAll('#gallery .gallery-photos .gallery-photo:nth-child(n+13)'); // 13번째 사진부터 선택

            // 선택된 숨겨진 사진들을 순회하며 보이도록 스타일을 변경합니다.
            hiddenPhotos.forEach(function(photo) {
                photo.style.removeProperty('display'); // **수정**: display 속성을 제거하여 CSS에 맡김 (Load More fix attempt)
            });

            // 모든 사진을 보이게 한 후에는 '더보기' 버튼을 숨깁니다.
            loadMoreBtn.style.display = 'none';
        });
    }


    // --- 갤러리 사진 클릭 시 확대 모달 표시 기능 구현 ---
    // galleryPhotos (모든 갤러리 사진 요소들)을 순회합니다.
    galleryPhotos.forEach(function(photo, index) { // index 인자 추가 (현재 사진의 순서)
        // 각 사진에 클릭 이벤트 리스너를 추가합니다.
        photo.addEventListener('click', function() {
            // 클릭된 사진 요소(this)의 src 속성값을 가져와서 모달 안 이미지 요소의 src로 설정합니다.
            modalImage.src = this.src;

            // **추가**: 클릭된 사진의 인덱스를 currentPhotoIndex 변수에 저장합니다.
            currentPhotoIndex = index;

            // 모달 컨테이너를 화면에 보이도록 display 속성을 변경합니다. (CSS에서 기본 display는 none으로 되어 있습니다.)
            modal.style.display = 'block';

            // 메인 콘텐츠 영역에 블러 처리를 위한 CSS 클래스('blurred')를 추가합니다.
            if (mainContent) {
               mainContent.classList.add('blurred');
            }

            // **추가**: 이전/다음 버튼의 초기 표시 상태를 업데이트합니다. (첫 사진이면 이전 숨김, 마지막 사진이면 다음 숨김)
            updateModalNavButtons();
        });
    });


    // --- 모달 닫기 버튼 기능 구현 ---
    // closeBtn 요소가 실제로 존재하는지 확인합니다.
    if (closeBtn) {
        // 닫기 버튼에 클릭 이벤트 리스너를 추가합니다.
        closeBtn.addEventListener('click', function() {
            // 모달 컨테이너를 다시 숨깁니다.
            modal.style.display = 'none';

            // 메인 콘텐츠 영역에서 블러 처리를 위한 CSS 클래스('blurred')를 제거합니다.
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


    // --- **추가**: 모달 이전/다음 버튼 기능 구현 ---

    // 이전 버튼 클릭 이벤트 리스너
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            // 현재 사진 인덱스에서 1을 빼서 이전 사진 인덱스를 계산합니다.
            currentPhotoIndex--;
            // 이전 사진으로 이동하고 모달 네비게이션 버튼 상태를 업데이트합니다.
            showPhotoInModal(currentPhotoIndex);
        });
    }

    // 다음 버튼 클릭 이벤트 리스너
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            // 현재 사진 인덱스에 1을 더해서 다음 사진 인덱스를 계산합니다.
            currentPhotoIndex++;
            // 다음 사진으로 이동하고 모달 네비게이션 버튼 상태를 업데이트합니다.
            showPhotoInModal(currentPhotoIndex);
        });
    }

    // --- **추가**: 특정 인덱스의 사진을 모달에 표시하고 네비게이션 버튼 상태 업데이트하는 함수 ---
    function showPhotoInModal(indexToShow) {
        // 인덱스가 유효 범위 내에 있는지 확인합니다.
        if (indexToShow >= 0 && indexToShow < galleryPhotos.length) {
            // 해당 인덱스의 사진 요소의 src를 가져와 모달 이미지 src로 설정합니다.
            modalImage.src = galleryPhotos[indexToShow].src;
            // 현재 인덱스를 업데이트합니다.
            currentPhotoIndex = indexToShow;
            // 이전/다음 버튼의 표시 상태를 업데이트합니다.
            updateModalNavButtons();
        }
    }

    // --- **추가**: 이전/다음 버튼의 표시 상태를 업데이트하는 함수 ---
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
                nextBtn.style.display = 'none'; // 마지막 사진이면 다음 버튼 숨김
            } else {
                nextBtn.style.display = 'block'; // 아니면 보이게 함
            }
        }
    }


}); // DOMContentLoaded 이벤트 리스너 끝