// script.js
document.addEventListener('DOMContentLoaded', function() {

    // --- 필요한 HTML 요소들 ---
    const modal = document.getElementById('myModal');
    const modalImage = document.getElementById('modalImage');
    const closeBtn = document.getElementsByClassName('close')[0];
    const galleryPhotos = document.querySelectorAll('#gallery .gallery-photos .gallery-photo');
    const mainContent = document.querySelector('main');
    const prevBtn = document.querySelector('#myModal .prev');
    const nextBtn = document.querySelector('#myModal .next');

    let currentPhotoIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 75;
    let mouseIsDown = false;
    let mouseStartX = 0;

    // --- 갤러리 ---
    galleryPhotos.forEach(function(photo, index) {
        photo.addEventListener('click', function() {
            modalImage.src = this.src;
            currentPhotoIndex = index;
            // 모달 열 때 display: flex 로 변경 (중앙 정렬 위해)
            if (modal) modal.style.display = 'flex';
            if (mainContent) { mainContent.classList.add('blurred'); }
            updateModalNavButtons();
        });
    });

    // --- 모달 닫기 관련 (갤러리/RSVP 공통) ---
    // closeModal 함수 (공통 사용)
    function closeModal() {
        if(modal) modal.style.display = 'none';
        const rsvpModalCheck = document.getElementById('rsvpModal');
        if(rsvpModalCheck) rsvpModalCheck.style.display = 'none';
        if (mainContent) { mainContent.classList.remove('blurred'); }
        if(modalImage) modalImage.src = ''; // 이미지 소스 초기화
    }
    // 갤러리 모달 닫기 버튼
    if (closeBtn) { closeBtn.addEventListener('click', closeModal); }
    // 갤러리 모달 배경 클릭 시 닫기
    if (modal) {
         modal.addEventListener('click', function(event) {
             // 이미지나 버튼 클릭 시 닫히지 않도록 확인
             if (event.target === modal) { closeModal(); }
         });
    }

    // --- 갤러리 모달 내 사진 넘기기 ---
    if (prevBtn) { prevBtn.addEventListener('click', () => showPhotoInModal(currentPhotoIndex - 1)); }
    if (nextBtn) { nextBtn.addEventListener('click', () => showPhotoInModal(currentPhotoIndex + 1)); }
    function showPhotoInModal(indexToShow) {
        if (indexToShow >= 0 && indexToShow < galleryPhotos.length) {
            modalImage.src = galleryPhotos[indexToShow].src;
            currentPhotoIndex = indexToShow;
            updateModalNavButtons();
        }
    }
    function updateModalNavButtons() {
        if (prevBtn) { prevBtn.style.display = (currentPhotoIndex <= 0) ? 'none' : 'block'; }
        if (nextBtn) { nextBtn.style.display = (currentPhotoIndex >= galleryPhotos.length - 1) ? 'none' : 'block'; }
    }

    // --- 갤러리 모달 스와이프/드래그 넘기기 ---
    if (modalImage) {
        modalImage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; e.preventDefault(); });
        modalImage.addEventListener('touchmove', e => e.preventDefault());
        modalImage.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].clientX; handleSwipe(); });
        modalImage.addEventListener('mousedown', e => { if (e.button !== 0) return; mouseIsDown = true; mouseStartX = e.clientX; modalImage.style.cursor = 'grabbing'; e.preventDefault(); });
        modalImage.addEventListener('mousemove', e => { if (!mouseIsDown) return; e.preventDefault(); });
        modalImage.addEventListener('mouseup', e => { if (!mouseIsDown) return; mouseIsDown = false; modalImage.style.cursor = 'auto'; touchEndX = e.clientX; handleSwipe(); });
        modalImage.addEventListener('mouseleave', () => { if (mouseIsDown) { mouseIsDown = false; modalImage.style.cursor = 'auto'; } });
    }
    document.addEventListener('mouseup', () => { if (mouseIsDown) { mouseIsDown = false; if(modalImage) modalImage.style.cursor = 'auto'; } }); // 페이지 다른 곳에서 마우스 뗄 경우 대비
    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        if (Math.abs(deltaX) > swipeThreshold) {
            if (deltaX < 0) { // 왼쪽으로 스와이프 (다음 사진)
                 showPhotoInModal(currentPhotoIndex + 1);
             } else { // 오른쪽으로 스와이프 (이전 사진)
                 showPhotoInModal(currentPhotoIndex - 1);
             }
        }
        // 스와이프 후 초기화 (드래그 시에도 필요)
        touchStartX = 0;
        touchEndX = 0;
        mouseStartX = 0;
    }


    // --- 카카오 지도 ---
    const mapContainer = document.getElementById('map');
    // 카카오 API 로드 확인 후 지도 생성
    if (mapContainer && typeof kakao !== 'undefined' && typeof kakao.maps !== 'undefined') {
         kakao.maps.load(function() { // API 로드 완료 후 실행
             const mapOption = { center: new kakao.maps.LatLng(37.535278, 126.978897), level: 3 };
             const map = new kakao.maps.Map(mapContainer, mapOption);
             const markerPosition  = new kakao.maps.LatLng(37.535278, 126.978897); // 예식장 좌표
             const marker = new kakao.maps.Marker({ position: markerPosition });
             marker.setMap(map);
             // 지도 타입 컨트롤 추가
             const mapTypeControl = new kakao.maps.MapTypeControl();
             map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
             // 줌 컨트롤 추가
             const zoomControl = new kakao.maps.ZoomControl();
             map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
         });
    }

    // --- 스크롤 페이드인 애니메이션 (초대글 섹션) ---
    const invitationSection = document.getElementById('invitation-text');
    if (invitationSection) {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    // 한번 나타난 후에는 관찰 중지 (선택사항)
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        observer.observe(invitationSection);
    }

    // --- 축의금 계좌 정보 토글 기능 ---
    const toggleButtons = document.querySelectorAll('.account-toggle-btn');
    const accountDetailsDivs = document.querySelectorAll('.account-details');
    if (toggleButtons.length > 0 && accountDetailsDivs.length > 0) {
        // 기본으로 첫 번째 버튼과 내용이 활성화되도록 설정 (HTML에서 active/show 클래스 미리 부여해도 됨)
        if (!document.querySelector('.account-toggle-btn.active')) {
            toggleButtons[0].classList.add('active');
        }
        if (!document.querySelector('.account-details.show')) {
             const firstTargetId = toggleButtons[0].getAttribute('data-target');
             const firstTargetDiv = document.getElementById(firstTargetId);
             if (firstTargetDiv) {
                 firstTargetDiv.classList.add('show');
             }
        }

        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const targetDiv = document.getElementById(targetId);

                toggleButtons.forEach(btn => btn.classList.remove('active'));
                accountDetailsDivs.forEach(div => div.classList.remove('show'));

                this.classList.add('active');
                if (targetDiv) {
                    targetDiv.classList.add('show');
                }
            });
        });
    }


    // --- 계좌번호 복사 기능 (하이픈 제거 로직 포함) ---
    const copyButtons = document.querySelectorAll('.copy-btn');
    if (copyButtons.length > 0) {
        copyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const entryDiv = this.closest('.account-entry');
                if (entryDiv) {
                    const targetSpan = entryDiv.querySelector('.copy-target');
                    if (targetSpan) {
                        const accountNumberWithHyphen = targetSpan.innerText;
                        const accountNumberDigitsOnly = accountNumberWithHyphen.replace(/-/g, ''); // 하이픈 제거

                        navigator.clipboard.writeText(accountNumberDigitsOnly).then(() => {
                            const originalText = this.innerHTML;
                            this.innerHTML = '✅ 복사됨!';
                            this.classList.add('copied');
                            setTimeout(() => {
                                this.innerHTML = originalText;
                                this.classList.remove('copied');
                            }, 1500);
                        }).catch(err => {
                            console.error('Clipboard API 복사 실패:', err);
                            // Fallback 시도 (구형 브라우저 등)
                            try {
                              const textArea = document.createElement("textarea");
                              textArea.value = accountNumberDigitsOnly; // 하이픈 없는 번호 복사
                              textArea.style.position = "fixed"; textArea.style.left = "-9999px";
                              document.body.appendChild(textArea);
                              textArea.focus(); textArea.select();
                              document.execCommand('copy');
                              document.body.removeChild(textArea);

                              const originalText = this.innerHTML;
                              this.innerHTML = '✅ 복사됨!'; this.classList.add('copied');
                              setTimeout(() => { this.innerHTML = originalText; this.classList.remove('copied'); }, 1500);
                            } catch (copyErr) {
                              console.error('execCommand 복사 실패:', copyErr);
                              alert('계좌번호 복사에 실패했습니다. 직접 복사해주세요.');
                            }
                        });
                    }
                }
            });
        });
    }

    // --- RSVP 모달 관련 ---
    const rsvpModal = document.getElementById('rsvpModal');
    const openRsvpBtn = document.getElementById('openRsvpModal');
    if (rsvpModal && openRsvpBtn) { // openRsvpBtn 존재 여부도 확인
        const closeRsvpBtn = rsvpModal.querySelector('.close-rsvp');
        const rsvpForm = document.getElementById('rsvpForm');
        const rsvpMessage = document.getElementById('rsvpMessage');
        const submitRsvpBtn = rsvpModal.querySelector('.submit-rsvp-btn');

        // 모달 열기
        openRsvpBtn.addEventListener('click', () => {
            rsvpModal.style.display = 'block'; // block으로 열어야 함 (CSS 기본값 none)
            if (mainContent) { mainContent.classList.add('blurred'); }
            if (rsvpMessage) rsvpMessage.textContent = ''; // 메시지 초기화
            if (rsvpForm) rsvpForm.reset(); // 폼 초기화
            if (submitRsvpBtn) submitRsvpBtn.disabled = false; // 제출 버튼 활성화
        });

        // 모달 닫기 (X 버튼)
        if (closeRsvpBtn) {
            closeRsvpBtn.addEventListener('click', closeModal); // 공통 closeModal 함수 사용
        }

        // 모달 닫기 (배경 클릭)
        rsvpModal.addEventListener('click', (event) => {
            if (event.target === rsvpModal) {
                closeModal(); // 공통 closeModal 함수 사용
            }
        });

        // 폼 제출 처리
        if (rsvpForm) {
            rsvpForm.addEventListener('submit', function(e) {
                e.preventDefault(); // 기본 제출 동작 막기
                // Google Apps Script URL (본인 것으로 교체 필요)
                const scriptURL = 'https://script.google.com/macros/s/AKfycbwpk21dxXQAQKgqCW4BR4BaU2sHxisqeqvdTcCe22Ur31P6l9_P3s1TXHPLkU7lIG9MuQ/exec';
                const formData = new FormData(this);
                if (submitRsvpBtn) submitRsvpBtn.disabled = true; // 중복 제출 방지
                if (rsvpMessage) { rsvpMessage.textContent = '전송 중...'; rsvpMessage.className = 'rsvp-message'; }

                fetch(scriptURL, { method: 'POST', body: formData })
                    .then(response => response.json()) // 응답을 JSON으로 파싱
                    .then(data => {
                        if (data.result === 'success') {
                            if (rsvpMessage) { rsvpMessage.textContent = '참석 의사가 전달되었습니다. 감사합니다!'; rsvpMessage.classList.add('success'); }
                            setTimeout(() => {
                                closeModal(); // 성공 시 2초 후 모달 닫기
                            }, 2000);
                        } else {
                            // Apps Script에서 에러 메시지를 보냈을 경우 처리
                            throw new Error(data.error || '알 수 없는 서버 오류');
                        }
                    })
                    .catch(error => {
                        console.error('RSVP 제출 오류!', error.message);
                        if (rsvpMessage) { rsvpMessage.textContent = '오류가 발생했습니다: ' + error.message + '. 다시 시도해주세요.'; rsvpMessage.classList.add('error'); }
                        else { alert('오류가 발생했습니다. 다시 시도해주세요.'); }
                        if (submitRsvpBtn) submitRsvpBtn.disabled = false; // 오류 시 버튼 다시 활성화
                    });
            });
        }
    } // if (rsvpModal && openRsvpBtn) 끝

    // --- D-Day 카운터 로직 ---
    const ddayCounter = document.getElementById('dday-counter');
    if (ddayCounter) {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        let countdownInterval; // interval ID 저장 변수

        const weddingDate = new Date('2025-07-12T13:00:00'); // 결혼식 날짜 및 시간

        function updateCountdown() {
            const now = new Date();
            const diff = weddingDate - now;

            if (diff <= 0) { // 결혼식 날짜/시간이 지났을 경우
                ddayCounter.innerHTML = '<span style="font-size: 1.2em; padding: 5px 15px; display: inline-block;">❤️ Wedding Day ❤️</span>';
                if (countdownInterval) clearInterval(countdownInterval); // 타이머 중지
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            // 각 요소가 존재할 때만 업데이트 (오류 방지)
            if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
        }
        updateCountdown(); // 페이지 로드 시 즉시 한번 실행
        countdownInterval = setInterval(updateCountdown, 1000); // 1초마다 업데이트
    }


    // --- 추가됨: Scroll to RSVP button ---
    const scrollToRsvpBtn = document.querySelector('.scroll-to-rsvp-btn');
    const rsvpTargetElement = document.getElementById('openRsvpModal'); // 스크롤 목적지 요소

    if (scrollToRsvpBtn && rsvpTargetElement) {
        scrollToRsvpBtn.addEventListener('click', function() {
            // 목적지 요소가 화면 중앙에 오도록 부드럽게 스크롤
            rsvpTargetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }


}); // DOMContentLoaded 이벤트 리스너 끝