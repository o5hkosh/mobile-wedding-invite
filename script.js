// script.js
document.addEventListener('DOMContentLoaded', function() {

    // --- 필요한 HTML 요소들 ---
    const modal = document.getElementById('myModal');
    const modalImage = document.getElementById('modalImage');
    const closeBtn = document.getElementsByClassName('close')[0];
    const galleryPhotos = document.querySelectorAll('#gallery .gallery-photos .gallery-photo');
    const mainContent = document.querySelector('main'); // 배경 블러 처리를 위해 main 태그 선택
    const prevBtn = document.querySelector('#myModal .prev');
    const nextBtn = document.querySelector('#myModal .next');

    let currentPhotoIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 75; // 스와이프 감지 민감도
    let mouseIsDown = false;
    let mouseStartX = 0;

    // --- 갤러리 ---
    galleryPhotos.forEach(function(photo, index) {
        photo.addEventListener('click', function() {
            modalImage.src = this.src;
            currentPhotoIndex = index;
            // 모달 열 때 display: flex 로 변경 (중앙 정렬 위해)
            if (modal) modal.style.display = 'flex';
            if (mainContent) { mainContent.classList.add('blurred'); } // 메인 컨텐츠 블러 처리
            updateModalNavButtons(); // 이전/다음 버튼 상태 업데이트
        });
    });

    // --- 모달 닫기 관련 (갤러리/RSVP 공통) ---
    // closeModal 함수 (공통 사용)
    function closeModal() {
        if(modal) modal.style.display = 'none'; // 갤러리 모달 닫기
        const rsvpModalCheck = document.getElementById('rsvpModal');
        if(rsvpModalCheck) rsvpModalCheck.style.display = 'none'; // RSVP 모달 닫기
        if (mainContent) { mainContent.classList.remove('blurred'); } // 메인 컨텐츠 블러 해제
        if(modalImage) modalImage.src = ''; // 갤러리 모달 이미지 소스 초기화
    }
    // 갤러리 모달 닫기 버튼 (X)
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
        // Touch Events
        modalImage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; e.preventDefault(); }, { passive: false });
        modalImage.addEventListener('touchmove', e => { e.preventDefault(); }, { passive: false }); // 스크롤 방지
        modalImage.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].clientX; handleSwipe(); });
        // Mouse Events
        modalImage.addEventListener('mousedown', e => { if (e.button !== 0) return; mouseIsDown = true; mouseStartX = e.clientX; modalImage.style.cursor = 'grabbing'; e.preventDefault(); });
        modalImage.addEventListener('mousemove', e => { if (!mouseIsDown) return; e.preventDefault(); });
        modalImage.addEventListener('mouseup', e => { if (!mouseIsDown) return; mouseIsDown = false; modalImage.style.cursor = 'auto'; touchEndX = e.clientX; handleSwipe(); });
        modalImage.addEventListener('mouseleave', () => { if (mouseIsDown) { mouseIsDown = false; modalImage.style.cursor = 'auto'; } });
    }
    // 페이지 다른 곳에서 마우스 뗄 경우 대비
    document.addEventListener('mouseup', () => { if (mouseIsDown) { mouseIsDown = false; if(modalImage) modalImage.style.cursor = 'auto'; } });
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
                    // observer.unobserve(entry.target); // 필요시 주석 해제
                }
            });
        }, observerOptions);
        observer.observe(invitationSection);
    }

    // --- 축의금 계좌 정보 토글 기능 ---
    const toggleButtons = document.querySelectorAll('.account-toggle-btn');
    const accountDetailsDivs = document.querySelectorAll('.account-details');
    if (toggleButtons.length > 0 && accountDetailsDivs.length > 0) {
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


    // --- 계좌번호 복사 기능 ---
    const copyButtons = document.querySelectorAll('.copy-btn');
    if (copyButtons.length > 0) {
        copyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const entryDiv = this.closest('.account-entry');
                if (entryDiv) {
                    const targetSpan = entryDiv.querySelector('.copy-target');
                    if (targetSpan) {
                        const accountNumberWithHyphen = targetSpan.innerText;
                        const accountNumberDigitsOnly = accountNumberWithHyphen.replace(/-/g, '');
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
                            try {
                              const textArea = document.createElement("textarea");
                              textArea.value = accountNumberDigitsOnly;
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
    if (rsvpModal && openRsvpBtn) {
        const closeRsvpBtn = rsvpModal.querySelector('.close-rsvp');
        const rsvpForm = document.getElementById('rsvpForm');
        const rsvpMessage = document.getElementById('rsvpMessage');
        const submitRsvpBtn = rsvpModal.querySelector('.submit-rsvp-btn');
        openRsvpBtn.addEventListener('click', () => {
            rsvpModal.style.display = 'block';
            if (mainContent) { mainContent.classList.add('blurred'); }
            if (rsvpMessage) rsvpMessage.textContent = '';
            if (rsvpForm) rsvpForm.reset();
            if (submitRsvpBtn) submitRsvpBtn.disabled = false;
        });
        if (closeRsvpBtn) { closeRsvpBtn.addEventListener('click', closeModal); }
        rsvpModal.addEventListener('click', (event) => { if (event.target === rsvpModal) { closeModal(); } });
        if (rsvpForm) {
            rsvpForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const rsvpScriptURL = 'https://script.google.com/macros/s/AKfycbwpk21dxXQAQKgqCW4BR4BaU2sHxisqeqvdTcCe22Ur31P6l9_P3s1TXHPLkU7lIG9MuQ/exec'; // ★★★ RSVP URL 확인 ★★★
                const formData = new FormData(this);
                if (submitRsvpBtn) submitRsvpBtn.disabled = true;
                if (rsvpMessage) { rsvpMessage.textContent = '전송 중...'; rsvpMessage.className = 'rsvp-message'; }
                fetch(rsvpScriptURL, { method: 'POST', body: formData })
                    .then(response => response.json())
                    .then(data => {
                        if (data.result === 'success') {
                            if (rsvpMessage) { rsvpMessage.textContent = '참석 의사가 전달되었습니다. 감사합니다!'; rsvpMessage.classList.add('success'); }
                            setTimeout(closeModal, 2000);
                        } else { throw new Error(data.error || '알 수 없는 서버 오류'); }
                    })
                    .catch(error => {
                        console.error('RSVP 제출 오류!', error.message);
                        if (rsvpMessage) { rsvpMessage.textContent = '오류가 발생했습니다: ' + error.message + '. 다시 시도해주세요.'; rsvpMessage.classList.add('error'); }
                        else { alert('오류가 발생했습니다. 다시 시도해주세요.'); }
                        if (submitRsvpBtn) submitRsvpBtn.disabled = false;
                    });
            });
        }
    }

    // --- D-Day 카운터 로직 ---
    const ddayCounter = document.getElementById('dday-counter');
    if (ddayCounter) {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        let countdownInterval;
        const weddingDate = new Date('2025-07-12T13:00:00');
        function updateCountdown() {
            const now = new Date();
            const diff = weddingDate - now;
            if (diff <= 0) {
                ddayCounter.innerHTML = '<span style="font-size: 1.2em; padding: 5px 15px; display: inline-block;">❤️ Wedding Day ❤️</span>';
                if (countdownInterval) clearInterval(countdownInterval);
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
        }
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    }


    // --- Scroll to RSVP button (From Bus Info Section) ---
    const scrollToRsvpBtn = document.querySelector('.scroll-to-rsvp-btn');
    const rsvpTargetElement = document.getElementById('openRsvpModal');
    if (scrollToRsvpBtn && rsvpTargetElement) {
        scrollToRsvpBtn.addEventListener('click', function() {
            rsvpTargetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }


    // --- Guestbook Functionality ---
    const guestbookForm = document.getElementById('guestbookForm');
    const guestbookNameInput = document.getElementById('guestbookName');
    const guestbookMessageInput = document.getElementById('guestbookMessageInput');
    const guestbookSubmitBtn = guestbookForm ? guestbookForm.querySelector('.submit-guestbook-btn') : null;
    const guestbookSubmitStatus = document.getElementById('guestbookSubmitStatus');
    const guestbookEntriesContainer = document.getElementById('guestbookEntries');
    // ★★★ 본인의 방명록용 Google Apps Script URL로 변경하세요 ★★★
    const guestbookScriptURL = 'https://script.google.com/macros/s/AKfycbyMNNmwjvvjMCiDjzHdJXtogxpjqsa-bLbxzxGSVH8ysfJ7TSKwQA8DIesx-oV1rn8-XA/exec';

    // Function to load and display approved messages
    function loadGuestbookMessages() {
        if (!guestbookEntriesContainer) return;
        guestbookEntriesContainer.innerHTML = '<p style="text-align: center; color: #888;">메시지를 불러오는 중입니다...</p>';
        fetch(guestbookScriptURL, { method: 'GET', mode: 'cors' })
            .then(response => {
                if (!response.ok) { throw new Error('Network response was not ok ' + response.statusText); }
                return response.json();
            })
            .then(result => {
                if (result.result === 'success' && result.data) {
                    guestbookEntriesContainer.innerHTML = '';
                    if (result.data.length > 0) {
                        result.data.forEach(entry => {
                            const entryDiv = document.createElement('div'); entryDiv.className = 'guestbook-entry';
                            const metaDiv = document.createElement('div'); metaDiv.className = 'guestbook-entry-meta';
                            const nameSpan = document.createElement('span'); nameSpan.className = 'guestbook-entry-name'; nameSpan.textContent = entry.name || '익명';
                            const timeSpan = document.createElement('span'); timeSpan.className = 'guestbook-entry-timestamp'; timeSpan.textContent = entry.timestamp || '';
                            metaDiv.appendChild(nameSpan); metaDiv.appendChild(timeSpan);
                            const messageP = document.createElement('p'); messageP.className = 'guestbook-entry-message';
                            const tempDiv = document.createElement('div'); tempDiv.innerHTML = entry.message || ''; messageP.textContent = tempDiv.textContent || tempDiv.innerText || '';
                            entryDiv.appendChild(metaDiv); entryDiv.appendChild(messageP);
                            guestbookEntriesContainer.appendChild(entryDiv);
                        });
                    } else {
                        guestbookEntriesContainer.innerHTML = '<p style="text-align: center; color: #888;">아직 등록된 축하 메시지가 없습니다.</p>';
                    }
                } else {
                    console.error('Error loading guestbook:', result.error || 'No data found or invalid structure');
                    guestbookEntriesContainer.innerHTML = '<p style="text-align: center; color: red;">메시지를 불러오는데 실패했습니다.</p>';
                     if (result.result !== 'success' && result.error) { guestbookEntriesContainer.innerHTML += '<br><small>' + result.error + '</small>'; }
                }
            })
            .catch(error => {
                console.error('Fetch Error loading guestbook:', error);
                guestbookEntriesContainer.innerHTML = '<p style="text-align: center; color: red;">메시지를 불러오는 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.</p>';
            });
    }

    // Function to handle guestbook form submission
    if (guestbookForm && guestbookSubmitBtn && guestbookSubmitStatus) {
        guestbookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            guestbookSubmitBtn.disabled = true;
            guestbookSubmitStatus.textContent = '메시지를 전송하는 중...';
            guestbookSubmitStatus.className = 'guestbook-submit-status';
            const formData = new FormData(guestbookForm);
            fetch(guestbookScriptURL, { method: 'POST', body: formData})
                .then(response => response.json())
                .then(data => {
                    if (data.result === 'success') {
                        guestbookSubmitStatus.textContent = '메시지가 성공적으로 등록되었습니다! 감사합니다.';
                        guestbookSubmitStatus.classList.add('success');
                        guestbookForm.reset();
                        // setTimeout(loadGuestbookMessages, 2000); // Optionally reload
                    } else { throw new Error(data.error || '알 수 없는 오류 발생'); }
                })
                .catch(error => {
                    console.error('Error submitting guestbook:', error);
                    guestbookSubmitStatus.textContent = '오류가 발생했습니다: ' + error.message;
                    guestbookSubmitStatus.classList.add('error');
                })
                .finally(() => {
                    setTimeout(() => {
                       if(guestbookSubmitBtn) guestbookSubmitBtn.disabled = false;
                       // Optionally clear status message after a while
                       // setTimeout(() => { guestbookSubmitStatus.textContent = ''; guestbookSubmitStatus.className = 'guestbook-submit-status'; }, 7000);
                    }, 2000);
                });
        });
    }

    // Load guestbook messages when the page loads
    loadGuestbookMessages();
    // --- End of Guestbook Functionality ---


    // --- ▼▼▼ 수정됨: Background Music (BGM) Functionality (Simplified - Autoplay Attempt Only) ▼▼▼ ---
    const bgmPlayer = document.getElementById('bgmPlayer');
    const bgmControlBtn = document.getElementById('bgmControlBtn');

    // Function to update the button icon/text and accessibility label
    function updateBgmButton() {
        if (!bgmPlayer || !bgmControlBtn) return;
        // Check state after a short delay to allow autoplay attribute to potentially work
        setTimeout(() => {
            if (bgmPlayer.paused) {
                bgmControlBtn.innerHTML = '▶️'; // Play symbol
                bgmControlBtn.setAttribute('aria-label', '배경음악 재생');
            } else {
                bgmControlBtn.innerHTML = '⏸️'; // Pause symbol
                bgmControlBtn.setAttribute('aria-label', '배경음악 일시정지');
            }
        }, 100); // 100ms delay
    }


    if (bgmPlayer && bgmControlBtn) {
        // Set initial button state (will be updated shortly by updateBgmButton)
         bgmControlBtn.innerHTML = '▶️';
         bgmControlBtn.setAttribute('aria-label', '배경음악 재생');

        // Attempt to play using the 'autoplay' attribute and direct play() call.
        // WARNING: This may be blocked by browser policies without user interaction.
        let playPromise = bgmPlayer.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Autoplay potentially successful (or started via attribute).
                console.log("BGM Autoplay initiated.");
                updateBgmButton(); // Update button state
            }).catch(error => {
                // Autoplay was prevented by browser.
                console.log("BGM Autoplay prevented by browser:", error);
                // *** No fallback to play on interaction in this version ***
                updateBgmButton(); // Ensure button shows 'Play' as it likely failed
            });
        } else {
             // Fallback for older browsers or scenarios where play() is synchronous
             updateBgmButton(); // Check initial state
        }

        // Add click listener for the control button
        bgmControlBtn.addEventListener('click', () => {
            if (bgmPlayer.paused) {
                // Try to play when button is clicked
                bgmPlayer.play().then(updateBgmButton).catch(e => {
                    console.error("BGM play error on button click:", e);
                    // Maybe show an error to the user if play fails even on click
                });
            } else {
                // Pause if playing
                bgmPlayer.pause();
                updateBgmButton(); // Update button immediately on pause
            }
        });

        // Keep button state synchronized with player state changes
        bgmPlayer.addEventListener('ended', updateBgmButton);
        bgmPlayer.addEventListener('pause', updateBgmButton);
        bgmPlayer.addEventListener('play', updateBgmButton);

    } else {
        // Hide button if player or button element doesn't exist
        if(bgmControlBtn) bgmControlBtn.style.display = 'none';
    }
    // --- ▲▲▲ End of BGM Functionality (Simplified) ▲▲▲ ---


}); // DOMContentLoaded 이벤트 리스너 끝