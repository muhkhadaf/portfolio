
/* ==========================================
   10. Animated Character Chat Popup
   ========================================== */
document.addEventListener("DOMContentLoaded", function() {
  initCharChat();
});

function initCharChat() {
  const widget       = document.getElementById("char-chat-widget");
  const avatarImg    = document.getElementById("char-avatar-img");
  const avatarWrap   = document.getElementById("char-avatar-wrap");
  const bubble       = document.getElementById("char-bubble");
  const typingDots   = document.getElementById("char-typing-dots");
  const bubbleText   = document.getElementById("char-bubble-text");
  const stepDots     = document.querySelectorAll(".char-step-dot");
  const closeBtn     = document.getElementById("char-close-btn");

  if (!widget) return;

  // ——— Conversation data (bilingual) ———
  const conversations = [
    {
      photo: "assets/image/me-1.jpeg",
      moodTag: { en: "👋 Hello!", id: "👋 Halo!" },
      text: {
        en: "Hi! I'm Khadafi — Software Developer at CIMB Niaga and freelancer under khadevrax.",
        id: "Hai! Saya Khadafi — Software Developer di CIMB Niaga dan freelancer di bawah brand khadevrax."
      }
    },
    {
      photo: "assets/image/me-with-okay-happy.jpeg",
      moodTag: { en: "🚀 Web & Mobile", id: "🚀 Web & Mobile" },
      text: {
        en: "I build beautiful web and mobile apps — React, Flutter, Node.js, and more. Let's create something great!",
        id: "Saya membangun aplikasi web dan mobile yang keren — React, Flutter, Node.js, dan lainnya. Ayo buat sesuatu yang luar biasa!"
      }
    },
    {
      photo: "assets/image/me-with-okay.jpeg",
      moodTag: { en: "🛠️ khadevrax", id: "🛠️ khadevrax" },
      text: {
        en: "Got a project? Check out khadevrax — my freelance brand for web & mobile development. Let's collab! 🤝",
        id: "Ada proyek? Cek khadevrax — brand freelance saya untuk web & mobile. Yuk berkolaborasi! 🤝"
      }
    }
  ];

  let currentStep  = 0;
  let autoTimer    = null;
  let typeTimer    = null;
  let dismissed    = false;
  const TYPING_DELAY  = 1400;   // ms — typing dots shown before message
  const AUTO_ADVANCE  = 5200;   // ms — message visible before advancing
  const INITIAL_DELAY = 2800;   // ms — delay before first popup
  const RESTART_DELAY = 20000;  // ms — quiet pause before restarting

  // ——— Update step dot indicators ———
  function updateStepDots(step) {
    stepDots.forEach((dot, i) => dot.classList.toggle("active", i === step));
  }

  // ——— Get current language ———
  function getLang() {
    return (typeof currentLang !== "undefined") ? currentLang : "en";
  }

  // ——— Swap avatar image with pop animation ———
  function swapAvatar(newSrc) {
    avatarImg.classList.add("swap");
    setTimeout(() => {
      avatarImg.src = newSrc;
      avatarImg.classList.remove("swap");
    }, 200);
  }

  // ——— Show a conversation step ———
  function showStep(step) {
    if (!widget) return;
    const convo = conversations[step];
    const lang  = getLang();

    swapAvatar(convo.photo);
    updateStepDots(step);

    // Reset state
    bubbleText.classList.remove("visible");
    bubbleText.innerHTML = "";
    typingDots.classList.remove("hidden");

    // Show bubble
    bubble.classList.remove("hide");
    bubble.classList.add("show");

    // After typing delay → reveal message
    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => {
      typingDots.classList.add("hidden");

      // Build mood tag + text
      const moodSpan = document.createElement("span");
      moodSpan.className = "char-mood-tag";
      moodSpan.textContent = convo.moodTag[lang] || convo.moodTag["en"];
      bubbleText.innerHTML = "";
      bubbleText.appendChild(moodSpan);
      bubbleText.appendChild(document.createElement("br"));

      const msgNode = document.createTextNode("");
      bubbleText.appendChild(msgNode);
      bubbleText.classList.add("visible");

      // Typewriter reveal
      const fullText = convo.text[lang] || convo.text["en"];
      let i = 0;
      clearTimeout(typeTimer);
      function tick() {
        if (i < fullText.length) {
          msgNode.textContent += fullText[i++];
          typeTimer = setTimeout(tick, 20);
        } else {
          if (step < conversations.length - 1) {
            autoTimer = setTimeout(() => advanceStep(), AUTO_ADVANCE);
          } else {
            autoTimer = setTimeout(() => {
              hideBubble();
              autoTimer = setTimeout(() => {
                if (!dismissed) startChat();
              }, RESTART_DELAY);
            }, AUTO_ADVANCE + 800);
          }
        }
      }
      tick();
    }, TYPING_DELAY);
  }

  // ——— Advance to next step ———
  function advanceStep() {
    currentStep++;
    if (currentStep < conversations.length) {
      hideBubble(() => setTimeout(() => showStep(currentStep), 320));
    }
  }

  // ——— Hide bubble with slide-out animation ———
  function hideBubble(callback) {
    bubble.classList.remove("show");
    bubble.classList.add("hide");
    clearTimeout(typeTimer);
    clearTimeout(autoTimer);
    setTimeout(() => {
      typingDots.classList.remove("hidden");
      bubbleText.classList.remove("visible");
      bubbleText.innerHTML = "";
      bubble.classList.remove("hide");
      if (callback) callback();
    }, 380);
  }

  // ——— Start / restart chat from step 0 ———
  function startChat() {
    dismissed   = false;
    currentStep = 0;
    widget.classList.add("visible");
    setTimeout(() => showStep(0), 500);
  }

  // ——— Dismiss chat ———
  function dismissChat() {
    dismissed = true;
    clearTimeout(autoTimer);
    clearTimeout(typeTimer);
    hideBubble();
    widget.classList.remove("visible");
  }

  // ——— Events ———

  // Close button
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dismissChat();
  });

  // Click avatar → advance manually
  avatarWrap.addEventListener("click", (e) => {
    if (hasDragged) return; // Don't advance if we were dragging
    clearTimeout(autoTimer);
    clearTimeout(typeTimer);
    if (currentStep < conversations.length - 1) {
      currentStep++;
      hideBubble(() => setTimeout(() => showStep(currentStep), 320));
    } else {
      hideBubble(() => { currentStep = 0; setTimeout(() => showStep(0), 320); });
    }
  });

  // Step dots → jump to step
  stepDots.forEach((dot, i) => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      if (hasDragged) return;
      if (i === currentStep) return;
      clearTimeout(autoTimer);
      clearTimeout(typeTimer);
      currentStep = i;
      hideBubble(() => setTimeout(() => showStep(currentStep), 320));
    });
  });

  // ——— Drag Functionality ———
  let isDragging = false;
  let hasDragged = false;
  let dragStartX, dragStartY;
  let widgetStartX, widgetStartY;

  function onDragStart(e) {
    if (e.target.closest('#char-close-btn') || e.target.closest('.char-step-dots')) return;
    
    isDragging = true;
    hasDragged = false;
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    dragStartX = clientX;
    dragStartY = clientY;
    
    const rect = widget.getBoundingClientRect();
    widgetStartX = rect.left;
    widgetStartY = rect.top;
    
    widget.style.transition = 'none';
    widget.style.transform = 'none';
    widget.style.bottom = 'auto';
    widget.style.right = 'auto';
    widget.style.left = widgetStartX + 'px';
    widget.style.top = widgetStartY + 'px';

    document.addEventListener('mousemove', onDragMove, {passive: false});
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchmove', onDragMove, {passive: false});
    document.addEventListener('touchend', onDragEnd);
  }

  function onDragMove(e) {
    if (!isDragging) return;
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const dx = clientX - dragStartX;
    const dy = clientY - dragStartY;
    
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasDragged = true;
    }
    
    if (hasDragged) {
      e.preventDefault();
      const newX = widgetStartX + dx;
      widget.style.left = newX + 'px';
      widget.style.top = (widgetStartY + dy) + 'px';
      
      checkFlip(newX + (widget.offsetWidth / 2));
    }
  }

  function checkFlip(centerX) {
    if (centerX > window.innerWidth / 2) {
      widget.classList.add('flipped');
    } else {
      widget.classList.remove('flipped');
    }
  }

  function onDragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);
    
    setTimeout(() => { hasDragged = false; }, 50);
  }

  widget.addEventListener('mousedown', onDragStart);
  widget.addEventListener('touchstart', onDragStart, {passive: true});

  // Check initial flip state based on bounding rect center
  const initialRect = widget.getBoundingClientRect();
  checkFlip(initialRect.left + (initialRect.width / 2));

  // Initial trigger: 2.8s after page load
  setTimeout(startChat, INITIAL_DELAY);
}
