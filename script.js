// DOMContentLoaded 이벤트는 HTML 문서가 완전히 로드되고 파싱되었을 때 발생합니다.
document.addEventListener('DOMContentLoaded', function() {

    // --- 필요한 HTML 요소들을 JavaScript 코드에서 사용할 수 있도록 가져옵니다. ---
    const modal = document.getElementById('myModal'); // 모달 컨테이너 요소
    const modalImage = document.getElementById('modalImage'); // 모달 안의 확대 사진 이미지 요소 (단일 이미지 형태)

    const closeBtn = document.getElementsByClassName('close')[0]; // 모달 닫기 버튼 요소 (클래스가 'close'인 첫 번째 요소)
    const galleryPhotos = document.querySelectorAll('#gallery .gallery-photos .gallery-photo'); // 갤러리 섹션 안의 모든 사진 이미지 요소들 (20개)

    const loadMoreBtn = document.getElementById('loadMoreBtn'); // '더보기' 버튼 (현재 사용 안 함)
    const mainContent = document.querySelector('main'); // 블러 처리할 메인 콘텐츠 영역 요소 (<main> 태그)

    // 모달 이전/다음 버튼 요소들
    const prevBtn = document.querySelector('#myModal .prev');
    const nextBtn = document.querySelector('#myModal .next');

    // 현재 모달에 표시된 사진의 갤러리 내 인덱스를 저장하는 변수
    let currentPhotoIndex = 0;

    // **추가**: 터치 스와이프를 위한 변수 (그냥 스와이프)
    let touchStartX = 0; // 터치 시작 X 좌표
    let touchEndX = 0; // 터치 끝 X 좌표
    const swipeThreshold = 75; // 스와이프로 인식할 최소 이동 거리 (px) - 조절 가능


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
            modal.style.display = 'block'; // 'flex' 대신 'block' 사용 (기본 모달 스타일과 일치)

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
             // 모달 닫을 때 확대 이미지 src 비우기 (메모리 관리)
            modalImage.src = '';
        });
    }

    // --- 모달 배경 클릭 시 닫기 기능 ---
    if (modal) {
         modal.addEventListener('click', function(event) {
             // 클릭된 요소가 모달 컨테이너 자체일 때 닫습니다. (이미지나 버튼 클릭은 제외)
             if (event.target === modal) {
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

    // --- **추가**: 특정 인덱스의 사진을 모달에 표시하고 네비게이션 버튼 상태 업데이트하는 함수 ---
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
            // 첫 사진인 경우 이전 버튼 숨김
            if (currentPhotoIndex <= 0) { // 인덱스 0 이하일 때 (첫 사진 포함)
                prevBtn.style.display = 'none'; // 이전 버튼 숨김
            } else {
                prevBtn.style.display = 'block'; // 아니면 보이게 함
            }
        }

        if (nextBtn) {
            // 마지막 사진인 경우 다음 버튼 숨김
            if (currentPhotoIndex >= galleryPhotos.length - 1) { // 인덱스 마지막 이상일 때 (마지막 사진 포함)
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'block';
            }
        }
    }

    // --- **추가**: '그냥 스와이프' 기능 구현 (단일 이미지 대상) ---
    // 확대된 사진에 터치 시작 이벤트 리스너 추가
    modalImage.addEventListener('touchstart', function(event) {
        // 터치 시작 시 첫 번째 손가락의 X 좌표 기록
        touchStartX = event.touches[0].clientX;
         // 기본 스크롤/드래그 방지 (스와이프 중 원치 않는 움직임 방지)
        event.preventDefault(); // touchstart에서 기본 동작 방지
    });

    // 확대된 사진에 터치 이동 이벤트 리스너 추가
    modalImage.addEventListener('touchmove', function(event) {
         // 터치 중 기본 스크롤/드래그 동작 방지 (스와이프 중 원치 않는 움직임 방지)
         event.preventDefault();
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
                const targetIndex = currentPhotoIndex + 1;
                 // 다음 사진으로 이동 (showPhotoInModal 함수 호출)
                showPhotoInModal(targetIndex);
            }
            // 오른쪽으로 스와이프 (이전 사진)
            else { // deltaX > 0
                const targetIndex = currentPhotoIndex - 1;
                // 이전 사진으로 이동 (showPhotoInModal 함수 호출)
                showPhotoInModal(targetIndex);
            }
        }
         // touchstart/touchmove에서 preventDefault를 했으므로 touchend에서는 필수는 아님
        // event.preventDefault(); // 필요시 추가
    });

    // **추가**: 데스크톱 마우스 드래그 기능 (모바일 스와이프와 유사)
    // 확대된 사진에 마우스 누름 이벤트 리스너 추가
     modalImage.addEventListener('mousedown', function(event) {
         if (event.button !== 0) return; // 마우스 왼쪽 버튼 아니면 무시
          mouseIsDown = true;
          mouseStartX = event.clientX;
          event.preventDefault(); // 마우스 누름 시 기본 동작 방지
     });

    // 확대된 사진에 마우스 이동 이벤트 리스너 추가
     modalImage.addEventListener('mousemove', function(event) {
         if (!mouseIsDown) return; // 마우스 버튼 안 눌렸으면 무시
         // 실시간 드래그 중 기본 동작 방지
         event.preventDefault();
          // 실시간 드래그 시각 효과를 추가하려면 여기에 코드 작성 (복잡)
     });

    // 확대된 사진에 마우스 놓음 이벤트 리스너 추가
     modalImage.addEventListener('mouseup', function(event) {
         if (!mouseIsDown) return; // 마우스 버튼 안 눌렸으면 무시
          mouseIsDown = false; // 마우스 버튼 놓음

          const mouseEndX = event.clientX;
          const deltaX = mouseEndX - mouseStartX;

          // 드래그 거리가 스와이프 임계값보다 큰지 확인 (터치와 동일)
          if (Math.abs(deltaX) > swipeThreshold) {
              // 왼쪽으로 드래그 (다음 사진)
              if (deltaX < 0) {
                   const targetIndex = currentPhotoIndex + 1;
                   showPhotoInModal(targetIndex);
              }
              // 오른쪽으로 드래그 (이전 사진)
              else { // deltaX > 0
                   const targetIndex = currentPhotoIndex - 1;
                   showPhotoInModal(targetIndex);
              }
          }
          // event.preventDefault(); // 필요시 추가
     });

     // 마우스가 모달 밖에서 놓였을 때 드래그 상태 해제 (안전 장치)
     document.addEventListener('mouseup', function(event) { // 문서 전체에 대해 마우스 놓음 감지
         if (mouseIsDown) { // 드래그 시작 상태에서 떼었을 때
             mouseIsDown = false;
             // 여기서는 모달 밖에서 떼는 경우 특별한 동작은 없습니다.
             // event.preventDefault(); // 필요시 추가
         }
     });


}); // DOMContentLoaded 이벤트 리스너 끝