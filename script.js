// DOMContentLoaded 이벤트는 HTML 문서가 완전히 로드되고 파싱되었을 때 발생합니다.
document.addEventListener('DOMContentLoaded', function() {

    // --- 필요한 HTML 요소들을 JavaScript 코드에서 사용할 수 있도록 가져옵니다. ---
    const modal = document.getElementById('myModal'); // 모달 컨테이너 요소
    // **수정**: 모달 안의 확대 사진 이미지 요소 대신 슬라이드 이미지 요소들을 가져옵니다.
    const modalSlideImages = document.querySelectorAll('#myModal .modal-slide-image'); // 모달 안의 슬라이드 이미지 요소들 (3개)
    const modalSlidesContainer = document.querySelector('#myModal .modal-slides'); // 슬라이드 이미지를 담는 컨테이너 요소

    const closeBtn = document.getElementsByClassName('close')[0]; // 모달 닫기 버튼 요소 (클래스가 'close'인 첫 번째 요소)
    const galleryPhotos = document.querySelectorAll('#gallery .gallery-photos .gallery-photo'); // 갤러리 섹션 안의 모든 사진 이미지 요소들 (20개)

    const loadMoreBtn = document.getElementById('loadMoreBtn'); // '더보기' 버튼 (현재 사용 안 함)
    const mainContent = document.querySelector('main'); // 블러 처리할 메인 콘텐츠 영역 요소 (<main> 태그)

    // 모달 이전/다음 버튼 요소들
    const prevBtn = document.querySelector('#myModal .prev');
    const nextBtn = document.querySelector('#myModal .next');

    // 현재 모달에 표시된 사진의 갤러리 내 인덱스를 저장하는 변수
    let currentPhotoIndex = 0;

    // **추가**: 슬라이드 애니메이션 중인지 확인하는 변수
    let isAnimating = false;

    // **추가**: 터치 스와이프를 위한 변수
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 75; // 스와이프로 인식할 최소 이동 거리 (px)

    // **추가**: 마우스 드래그를 위한 변수 (데스크톱 지원 시)
    let mouseIsDown = false;
    let mouseStartX = 0;


    // --- '더보기' 버튼 기능 (현재 사용 안 함) ---
    /*
    if (loadMoreBtn) {
        // ... (코드 삭제) ...
    }
    */


    // --- 갤러리 사진 클릭 시 확대 모달 표시 기능 ---
    galleryPhotos.forEach(function(photo, index) { // index 인자 추가 (현재 사진의 순서)
        photo.addEventListener('click', function() {
            // **수정**: 클릭된 사진의 인덱스를 저장하고 모달 슬라이드 초기 상태를 설정합니다.
            currentPhotoIndex = index;
            openModalWithPhoto(currentPhotoIndex); // 모달을 열고 해당 사진을 보여주는 새로운 함수 호출
        });
    });

    // --- **추가**: 특정 인덱스의 사진으로 모달을 열고 초기 상태 설정하는 함수 ---
    function openModalWithPhoto(index) {
        // 인덱스 유효성 확인
        if (index >= 0 && index < galleryPhotos.length) {
            currentPhotoIndex = index; // 현재 인덱스 업데이트

            // **수정**: 모달 슬라이드 이미지들의 src를 설정하고 가운데 이미지 보이도록 위치시킵니다.
            updateSlideImages(currentPhotoIndex); // 슬라이드 이미지들 src 업데이트
            centerSlideImmediately(); // 가운데 이미지가 보이도록 슬라이드 위치 즉시 조정

            modal.style.display = 'flex'; // 모달을 flex 컨테이너로 표시 (가운데 정렬 위해)
            if (mainContent) { mainContent.classList.add('blurred'); } // 배경 블러

            updateModalNavButtons(); // 네비게이션 버튼 상태 업데이트
        }
    }

    // --- **추가**: 현재 인덱스에 맞춰 이전, 현재, 다음 슬라이드 이미지들의 src를 업데이트하는 함수 ---
    function updateSlideImages(centerIndex) {
        // 이전 사진 (인덱스 centerIndex - 1)
        if (centerIndex > 0) {
            modalSlideImages[0].src = galleryPhotos[centerIndex - 1].src;
            modalSlideImages[0].alt = galleryPhotos[centerIndex - 1].alt;
        } else {
            modalSlideImages[0].src = ''; // 첫 사진인 경우 이전 슬라이드는 비움
            modalSlideImages[0].alt = '';
        }

        // 현재 사진 (인덱스 centerIndex)
        modalSlideImages[1].src = galleryPhotos[centerIndex].src; // 가운데 슬라이드에 현재 사진 설정
        modalSlideImages[1].alt = galleryPhotos[centerIndex].alt;

        // 다음 사진 (인덱스 centerIndex + 1)
        if (centerIndex < galleryPhotos.length - 1) {
            modalSlideImages[2].src = galleryPhotos[centerIndex + 1].src;
             modalSlideImages[2].alt = galleryPhotos[centerIndex + 1].alt;
        } else {
            modalSlideImages[2].src = ''; // 마지막 사진인 경우 다음 슬라이드는 비움
            modalSlideImages[2].alt = '';
        }
    }

    // --- **추가**: 모달 슬라이드 컨테이너를 가운데 이미지가 보이도록 즉시 위치시키는 함수 ---
    function centerSlideImmediately() {
        // 슬라이드 컨테이너 위치 조정 시 애니메이션 비활성화
        modalSlidesContainer.style.transition = 'none';
        // 가운데 슬라이드 위치로 이동 (-33.33%는 가운데 이미지의 시작점)
        modalSlidesContainer.style.transform = 'translateX(-33.33%)';
        // 다음 애니메이션을 위해 transition을 다시 활성화 (짧은 지연 후)
        setTimeout(() => {
             modalSlidesContainer.style.transition = 'transform 0.3s ease'; // CSS에 정의된 트랜지션 사용
        }, 50); // 짧은 지연 (브라우저 렌더링 대기)
    }


    // --- 모달 닫기 버튼 기능 ---
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none'; // 모달 숨기기
            if (mainContent) { mainContent.classList.remove('blurred'); } // 블러 제거
             // 모달 닫을 때 슬라이드 이미지 src 비우기 (메모리 관리)
            modalSlideImages[0].src = '';
            modalSlideImages[1].src = '';
            modalSlideImages[2].src = '';
        });
    }

    // --- 모달 배경 클릭 시 닫기 기능 ---
    if (modal) {
         modal.addEventListener('click', function(event) {
             // 클릭된 요소가 모달 컨테이너 또는 슬라이드 컨테이너 자체일 때 닫습니다.
             // 이미지나 네비게이션 버튼 클릭은 제외합니다.
             if (event.target === modal || event.target === modalSlidesContainer) {
                 modal.style.display = 'none';
                 if (mainContent) { mainContent.classList.remove('blurred'); }
                 // 모달 닫을 때 슬라이드 이미지 src 비우기
                 modalSlideImages[0].src = '';
                 modalSlideImages[1].src = '';
                 modalSlideImages[2].src = '';
             }
         });
    }


    // --- 모달 이전/다음 버튼 기능 ---
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            // 슬라이드 중이 아니면 이전 사진으로 이동 시도
            if (!isAnimating) {
                 const targetIndex = currentPhotoIndex - 1; // 이동할 인덱스
                 if (targetIndex >= 0) { // 첫 사진 이전으로 가지 않는 경우
                     animateSlideTo(targetIndex); // 이전 사진으로 애니메이션
                 }
            }
        });
    }

    if (nextBtn) {
         nextBtn.addEventListener('click', function() {
             // 슬라이드 중이 아니면 다음 사진으로 이동 시도
             if (!isAnimating) {
                 const targetIndex = currentPhotoIndex + 1; // 이동할 인덱스
                 if (targetIndex < galleryPhotos.length) { // 마지막 사진 이후로 가지 않는 경우
                     animateSlideTo(targetIndex); // 다음 사진으로 애니메이션
                 }
             }
         });
    }

    // --- 특정 인덱스의 사진으로 모달 슬라이드를 애니메이션하는 함수 ---
    function animateSlideTo(targetIndex) {
        // 애니메이션 중 상태 표시
        isAnimating = true;

        // 이동 방향에 따라 슬라이드 컨테이너의 목표 transform 값 설정
        let targetTransform = '';
        if (targetIndex < currentPhotoIndex) { // 이전으로 이동
            targetTransform = 'translateX(0%)'; // 왼쪽 슬라이드 위치 (이전 사진이 보이게)
        } else if (targetIndex > currentPhotoIndex) { // 다음으로 이동
            targetTransform = 'translateX(-66.66%)'; // 오른쪽 슬라이드 위치 (다음 사진이 보이게)
        } else { // 현재 인덱스 (애니메이션 필요 없음)
            isAnimating = false; // 애니메이션 중 상태 해제
            return; // 함수 종료
        }

        // 슬라이드 컨테이너 위치 애니메이션
        modalSlidesContainer.style.transition = 'transform 0.3s ease'; // CSS에 정의된 트랜지션 활성화
        modalSlidesContainer.style.transform = targetTransform; // 목표 위치로 이동 애니메이션 시작

        // 애니메이션 완료 이벤트 리스너 추가 (애니메이션 끝난 후 다음 작업 처리)
        // transitionend 이벤트는 여러 번 발생할 수 있으므로 한 번 실행 후 제거
        modalSlidesContainer.addEventListener('transitionend', handleSlideTransitionEnd, { once: true });

        // 목표 인덱스를 현재 인덱스로 미리 업데이트합니다. (애니메이션 중에도 인덱스는 최신 상태)
        currentPhotoIndex = targetIndex;
    }

    // --- **추가**: 슬라이드 애니메이션 완료 후 호출되는 함수 ---
    function handleSlideTransitionEnd() {
         // 애니메이션 중 상태 해제
        isAnimating = false;

        // 새로운 현재 인덱스에 맞춰 슬라이드 이미지들의 src를 업데이트합니다.
        updateSlideImages(currentPhotoIndex);

        // 슬라이드 컨테이너 위치를 다시 가운데 이미지가 보이도록 즉시 조정합니다 (애니메이션 없이).
        centerSlideImmediately();

        // 네비게이션 버튼 상태를 업데이트합니다.
        updateModalNavButtons();

        // 애니메이션 후 인덱스가 유효하지 않으면 모달 닫기 (이 경우는 prev/next 클릭 시 이미 막고 있으므로 불필요할 수도 있지만 안전하게)
        if (currentPhotoIndex < 0 || currentPhotoIndex >= galleryPhotos.length) {
             modal.style.display = 'none';
             if (mainContent) { mainContent.classList.remove('blurred'); }
             // 모달 닫을 때 슬라이드 이미지 src 비우기
             modalSlideImages[0].src = '';
             modalSlideImages[1].src = '';
             modalSlideImages[2].src = '';
        }
    }


     // --- 모달 이전/다음 버튼의 표시 상태를 업데이트하는 함수 ---
     function updateModalNavButtons() {
        if (prevBtn) {
            // 첫 사진인 경우 이전 버튼 숨김
            if (currentPhotoIndex <= 0) {
                prevBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'block';
            }
        }

        if (nextBtn) {
            // 마지막 사진인 경우 다음 버튼 숨김
            if (currentPhotoIndex >= galleryPhotos.length - 1) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'block';
            }
        }
    }


    // --- 모달 사진 스와이프 기능 구현 ---
    // 터치 이벤트 리스너는 슬라이드 컨테이너에 추가합니다.
    if (modalSlidesContainer) {
        modalSlidesContainer.addEventListener('touchstart', function(event) {
            if (isAnimating) return; // 애니메이션 중에는 터치 무시
            touchStartX = event.touches[0].clientX;
            // 스와이프 시작 시 애니메이션 중지 (실시간 드래그를 위해)
            modalSlidesContainer.style.transition = 'none';
             // 기본 스크롤 방지 (이미지 드래그 등)
             event.preventDefault(); // touchstart에서 기본 동작 방지 (스와이프 필수)
        });

        modalSlidesContainer.addEventListener('touchmove', function(event) {
             if (isAnimating) return; // 애니메이션 중에는 터치 무시
             // 실시간 드래그 구현 (이 예시에서는 터치 끝났을 때만 움직입니다. 실시간 드래그는 더 복잡합니다.)
             // 원하면 여기에 드래그 거리에 따라 modalSlidesContainer.style.transform을 업데이트하는 코드 추가 가능
             event.preventDefault(); // 터치 중 기본 스크롤/드래그 동작 방지 (스와이프 필수)
        });

        modalSlidesContainer.addEventListener('touchend', function(event) {
            if (isAnimating) return; // 애니메이션 중에는 터치 무시
            touchEndX = event.changedTouches[0].clientX;

            // 시작점 대비 끝점의 수평 이동 거리 계산
            const deltaX = touchEndX - touchStartX;

            // 스와이프가 감지되면
            if (Math.abs(deltaX) > swipeThreshold) {
                 // 애니메이션 다시 활성화
                modalSlidesContainer.style.transition = 'transform 0.3s ease';

                // 왼쪽으로 스와이프 (다음 사진)
                if (deltaX < 0) {
                    const targetIndex = currentPhotoIndex + 1;
                    if (targetIndex < galleryPhotos.length) { // 마지막 사진 이후로 가지 않는 경우
                        animateSlideTo(targetIndex); // 다음 사진으로 애니메이션
                    } else {
                         centerSlideImmediately(); // 경계 넘으면 원래 위치로 돌아감
                    }
                }
                // 오른쪽으로 스와이프 (이전 사진)
                else { // deltaX > 0
                    const targetIndex = currentPhotoIndex - 1;
                     if (targetIndex >= 0) { // 첫 사진 이전으로 가지 않는 경우
                         animateSlideTo(targetIndex); // 이전 사진으로 애니메이션
                     } else {
                         centerSlideImmediately(); // 경계 넘으면 원래 위치로 돌아감
                     }
                }
            } else {
                 // 스와이프 거리가 임계값 미만이면 원래 위치(가운데)로 돌아가는 애니메이션
                modalSlidesContainer.style.transition = 'transform 0.3s ease';
                centerSlideImmediately(); // 가운데 위치로 애니메이션
            }
             // event.preventDefault(); // 필요시 기본 동작 방지 (touchend에서는 주의해서 사용)
        });

        // **추가**: 데스크톱 마우스 드래그 기능 (모바일 스와이프와 유사)
        modalSlidesContainer.addEventListener('mousedown', function(event) {
            if (isAnimating || event.button !== 0) return; // 애니메이션 중이거나 마우스 왼쪽 버튼 아니면 무시
             mouseIsDown = true;
             mouseStartX = event.clientX;
             modalSlidesContainer.style.transition = 'none'; // 드래그 시작 시 애니메이션 중지
             event.preventDefault(); // **추가**: mousedown에서 기본 동작 방지
        });

        modalSlidesContainer.addEventListener('mousemove', function(event) {
             if (!mouseIsDown || isAnimating) return; // 마우스 버튼 안 눌렸거나 애니메이션 중이면 무시
             // 실시간 드래그 구현 (터치와 유사, 여기서는 끝났을 때만 처리)
             // const deltaX = event.clientX - mouseStartX;
             // modalSlidesContainer.style.transform = 'translateX(' + (-33.33 * window.innerWidth / 100 + deltaX) + 'px)';
             event.preventDefault(); // 마우스 이동 중 기본 동작 방지 (이미지 드래그 등)
        });

        modalSlidesContainer.addEventListener('mouseup', function(event) {
            if (!mouseIsDown || isAnimating) return; // 마우스 버튼 안 눌렸거나 애니메이션 중이면 무시
             mouseIsDown = false; // 마우스 버튼 떼면 드래그 종료
             const mouseEndX = event.clientX;
             const deltaX = mouseEndX - mouseStartX;

             // 스와이프 감지 로직 (터치와 동일)
             if (Math.abs(deltaX) > swipeThreshold) {
                 modalSlidesContainer.style.transition = 'transform 0.3s ease'; // 애니메이션 다시 활성화
                 if (deltaX < 0) { // 왼쪽 드래그 (다음 사진)
                     const targetIndex = currentPhotoIndex + 1;
                      if (targetIndex < galleryPhotos.length) { animateSlideTo(targetIndex); } else { centerSlideImmediately(); } // 경계 넘으면 원래 위치로 돌아감
                 } else { // 오른쪽 드래그 (이전 사진)
                     const targetIndex = currentPhotoIndex - 1;
                      if (targetIndex >= 0) { animateSlideTo(targetIndex); } else { centerSlideImmediately(); } // 경계 넘으면 원래 위치로 돌아감
                 }
             } else {
                 // 드래그 거리가 임계값 미만이면 원래 위치로 돌아감
                 modalSlidesContainer.style.transition = 'transform 0.3s ease'; // 애니메이션 다시 활성화
                 centerSlideImmediately(); // 가운데 위치로 애니메이션
             }
             // event.preventDefault(); // 필요시 기본 동작 방지
        });

         // 마우스가 요소 밖에서 놓였을 때 드래그 상태 해제 (안전 장치)
         document.addEventListener('mouseleave', function(event) {
             if (mouseIsDown) { // 마우스 버튼이 눌린 상태로 요소 밖으로 나갔을 때
                 mouseIsDown = false;
                 // 필요시 원래 위치로 돌아가는 로직 추가 (애니메이션)
                 // modalSlidesContainer.style.transition = 'transform 0.3s ease';
                 // centerSlideImmediately();
             }
         });


    } // modalSlidesContainer if 끝


}); // DOMContentLoaded 이벤트 리스너 끝