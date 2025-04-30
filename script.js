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
            modal.style.display = 'block';
            if (mainContent) { mainContent.classList.add('blurred'); }
            updateModalNavButtons();
        });
    });

    // --- 모달 ---
    // closeModal 함수는 갤러리/RSVP 모달 모두 닫도록 아래에서 통합 정의
    if (closeBtn) { closeBtn.addEventListener('click', closeModal); }
    if (modal) {
         modal.addEventListener('click', function(event) {
             if (event.target === modal) { closeModal(); }
         });
    }
    // closeModal 함수 (공통 사용)
    function closeModal() {
        if(modal) modal.style.display = 'none';
        const rsvpModalCheck = document.getElementById('rsvpModal');
        if(rsvpModalCheck) rsvpModalCheck.style.display = 'none';
        if (mainContent) { mainContent.classList.remove('blurred'); }
        if(modalImage) modalImage.src = '';
    }

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
    if (modalImage) { // modalImage가 존재할 때만 이벤트 리스너 추가
        modalImage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; e.preventDefault(); });
        modalImage.addEventListener('touchmove', e => e.preventDefault());
        modalImage.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].clientX; handleSwipe(); });
        modalImage.addEventListener('mousedown', e => { if (e.button !== 0) return; mouseIsDown = true; mouseStartX = e.clientX; modalImage.style.cursor = 'grabbing'; e.preventDefault(); });
        modalImage.addEventListener('mousemove', e => { if (!mouseIsDown) return; e.preventDefault(); });
        modalImage.addEventListener('mouseup', e => { if (!mouseIsDown) return; mouseIsDown = false; modalImage.style.cursor = 'auto'; touchEndX = e.clientX; handleSwipe(); });
        modalImage.addEventListener('mouseleave', () => { if (mouseIsDown) { mouseIsDown = false; modalImage.style.cursor = 'auto'; } });
    }
     document.addEventListener('mouseup', () => { if (mouseIsDown) { mouseIsDown = false; if(modalImage) modalImage.style.cursor = 'auto'; } });
    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        if (Math.abs(deltaX) > swipeThreshold) {
            if (deltaX < 0) { showPhotoInModal(currentPhotoIndex + 1); }
            else { showPhotoInModal(currentPhotoIndex - 1); }
        }
    }

    // --- 카카오 지도 ---
    const mapContainer = document.getElementById('map');
    if (mapContainer && typeof kakao !== 'undefined' && typeof kakao.maps !== 'undefined') {
         const mapOption = { center: new kakao.maps.LatLng(37.535278, 126.978897), level: 3 };
        const map = new kakao.maps.Map(mapContainer, mapOption);
        const markerPosition  = new kakao.maps.LatLng(37.535278, 126.97897);
        const marker = new kakao.maps.Marker({ position: markerPosition });
        marker.setMap(map);
        const mapTypeControl = new kakao.maps.MapTypeControl();
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
        const zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
    }

    // --- 스크롤 페이드인 애니메이션 ---
    const invitationSection = document.getElementById('invitation-text');
    if (invitationSection) {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        observer.observe(invitationSection);
    }

    // --- 축의금 계좌 정보 토글 기능 ---
    const toggleButtons = document.querySelectorAll('.account-toggle-btn');
    const accountDetailsDivs = document.querySelectorAll('.account-details');
    if (toggleButtons.length > 0 && accountDetailsDivs.length > 0) {
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const targetDiv = document.getElementById(targetId);

                toggleButtons.forEach(btn => btn.classList.remove('active'));
                accountDetailsDivs.forEach(div => div.classList.remove('show'));
                this.classList.add('active');
                if (targetDiv) { targetDiv.classList.add('show'); }
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

                        navigator.clipboard.writeText(accountNumberDigitsOnly).then(() => { // 하이픈 없는 번호 복사
                            const originalText = this.innerHTML;
                            this.innerHTML = '✅ 복사됨!';
                            this.classList.add('copied');
                            setTimeout(() => {
                                this.innerHTML = originalText;
                                this.classList.remove('copied');
                            }, 1500);
                        }).catch(err => {
                            console.error('Clipboard API 복사 실패:', err);
                            try {
                              const textArea = document.createElement("textarea");
                              textArea.value = accountNumberDigitsOnly; // 하이픈 없는 번호 복사 (fallback)
                              textArea.style.position = "fixed"; textArea.style.left = "-9999px";
                              document.body.appendChild(textArea);
                              textArea.focus(); textArea.select(); document.execCommand('copy');
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
    if (rsvpModal) {
        const closeRsvpBtn = rsvpModal.querySelector('.close-rsvp');
        const rsvpForm = document.getElementById('rsvpForm');
        const rsvpMessage = document.getElementById('rsvpMessage');
        const submitRsvpBtn = rsvpModal.querySelector('.submit-rsvp-btn');

        // 모달 열기
        if (openRsvpBtn) {
            openRsvpBtn.addEventListener('click', () => {
                rsvpModal.style.display = 'block';
                if (mainContent) { mainContent.classList.add('blurred'); }
                if (rsvpMessage) rsvpMessage.textContent = '';
                if (rsvpForm) rsvpForm.reset();
                if (submitRsvpBtn) submitRsvpBtn.disabled = false;
            });
        }

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
                e.preventDefault();
                const scriptURL = 'https://script.google.com/macros/s/AKfycbwkMGqiv2VzxzCTvoMm0eFkcGdoF8wn7vQonPiXgYoGKxcM0gK2ljsMqJzk2S1ANAFVnQ/exec'; // 사용자 URL 적용됨
                const formData = new FormData(this);
                if (submitRsvpBtn) submitRsvpBtn.disabled = true;
                if (rsvpMessage) { rsvpMessage.textContent = '전송 중...'; rsvpMessage.className = 'rsvp-message'; }

                fetch(scriptURL, { method: 'POST', body: formData })
                    .then(response => response.json())
                    .then(data => {
                        if (data.result === 'success') {
                            if (rsvpMessage) { rsvpMessage.textContent = '참석 의사가 전달되었습니다. 감사합니다!'; rsvpMessage.classList.add('success'); }
                            setTimeout(() => {
                                closeModal(); // 성공 시 공통 closeModal 함수 사용
                            }, 2000);
                        } else { throw new Error(data.error || '알 수 없는 서버 오류'); }
                    })
                    .catch(error => {
                        console.error('Error!', error.message);
                        if (rsvpMessage) { rsvpMessage.textContent = '오류가 발생했습니다: ' + error.message + '. 다시 시도해주세요.'; rsvpMessage.classList.add('error'); }
                        else { alert('오류가 발생했습니다. 다시 시도해주세요.'); }
                        if (submitRsvpBtn) submitRsvpBtn.disabled = false;
                    });
            });
        }
    } // if (rsvpModal) 끝

    // --- D-Day 카운터 로직 (일/시/분/초 표시 및 1초 업데이트) ---
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

            if (diff <= 0) {
                // 결혼식 날짜가 지났거나 당일 13시 이후
                // 스타일 직접 적용보다는 클래스 추가/제거 방식이 더 좋지만, 일단 간단하게 처리
                ddayCounter.innerHTML = '<span style="font-size: 1.2em; padding: 5px 15px; display: inline-block;">❤️ Wedding Day ❤️</span>';
                if (countdownInterval) clearInterval(countdownInterval); // 업데이트 중지
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            // 각 요소가 존재하는지 확인 후 업데이트 (오류 방지)
            if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
        }
        updateCountdown(); // 즉시 한번 실행
        countdownInterval = setInterval(updateCountdown, 1000); // 1초마다 업데이트
    }

}); // DOMContentLoaded 이벤트 리스너 끝