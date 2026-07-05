// Initialize Lucide Icons
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  initTheme();
  initLanguagePicker();
  initSegmentedPicker();
  initMetricsToggle();
  initProjectViewSwitcher();
  initProjectSheet();
  animateSkills();
});

/* ==========================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================== */
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.body.classList.add("dark");
    themeToggle.checked = true;
  } else {
    document.body.classList.remove("dark");
    themeToggle.checked = false;
  }
  
  themeToggle.addEventListener("change", (e) => {
    if (e.target.checked) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
      showToast("Dark Mode Enabled");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
      showToast("Light Mode Enabled");
    }
  });

  // Listen to system color scheme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      if (e.matches) {
        document.body.classList.add("dark");
        themeToggle.checked = true;
      } else {
        document.body.classList.remove("dark");
        themeToggle.checked = false;
      }
    }
  });
}

/* ==========================================
   2. Segmented Picker Navigation & Scroll Spy
   ========================================== */
let isScrolling = false;

function initSegmentedPicker() {
  const picker = document.getElementById("section-picker");
  const options = picker.querySelectorAll(".picker-option");
  const slider = document.getElementById("picker-slider");
  const sections = document.querySelectorAll(".page-section");
  
  function updateSlider(element) {
    const pickerRect = picker.getBoundingClientRect();
    const elemRect = element.getBoundingClientRect();
    
    const leftOffset = elemRect.left - pickerRect.left;
    slider.style.width = `${elemRect.width}px`;
    slider.style.transform = `translateX(${leftOffset}px)`;
  }
  
  // Intersection Observer for Scroll Spy
  const observerOptions = {
    root: null,
    rootMargin: "-25% 0px -55% 0px", // Trigger when section occupies the upper-middle region
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    // Skip updates if user initiated a click-scroll
    if (isScrolling) return;
    
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        
        options.forEach(opt => {
          if (opt.getAttribute("data-target") === id) {
            options.forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
            updateSlider(opt);
            
            // Trigger skill progress bars animation when entering skills section
            if (id === "skills") {
              animateSkills();
            }
          }
        });
      }
    });
  }, observerOptions);
  
  sections.forEach(section => observer.observe(section));
  
  // Click handler to smooth scroll to section
  options.forEach(option => {
    option.addEventListener("click", () => {
      const targetId = option.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        isScrolling = true;
        
        options.forEach(opt => opt.classList.remove("active"));
        option.classList.add("active");
        updateSlider(option);
        
        if (targetId === "skills") {
          animateSkills();
        }
        
        targetSection.scrollIntoView({ behavior: "smooth" });
        
        // Reset scroll block after viewport reaches target
        setTimeout(() => {
          isScrolling = false;
        }, 800);
      }
    });
  });

  // Handle window resizing
  window.addEventListener("resize", () => {
    const currentActive = picker.querySelector(".picker-option.active");
    if (currentActive) {
      updateSlider(currentActive);
    }
  });

  // Init position
  const activeOption = picker.querySelector(".picker-option.active");
  if (activeOption) {
    setTimeout(() => updateSlider(activeOption), 100);
  }
}

// Global helper for smooth transition trigger (like click events)
function switchTab(sectionId) {
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: "smooth" });
  }
}

/* ==========================================
   3. Detailed Developer Statistics Toggle
   ========================================== */
function initMetricsToggle() {
  const toggle = document.getElementById("metrics-toggle");
  const metricsContainer = document.getElementById("metrics-container");
  
  toggle.addEventListener("change", (e) => {
    if (e.target.checked) {
      metricsContainer.style.display = "block";
      showToast("Dev metrics visible");
    } else {
      metricsContainer.style.display = "none";
      showToast("Dev metrics hidden");
    }
  });
}

/* ==========================================
   4. Skill Progress Bar Animations
   ========================================== */
function animateSkills() {
  const progressBars = document.querySelectorAll(".skill-progress");
  progressBars.forEach(bar => {
    const targetPercentage = bar.getAttribute("data-percentage");
    // Small delay to trigger animation smoothly
    setTimeout(() => {
      bar.style.width = targetPercentage;
    }, 100);
  });
}

/* ==========================================
   5. Projects Layout Switcher (Grid / List)
   ========================================== */
function initProjectViewSwitcher() {
  const gridBtn = document.getElementById("grid-view-btn");
  const listBtn = document.getElementById("list-view-btn");
  const container = document.getElementById("projects-container");
  
  if (!gridBtn || !listBtn || !container) return;

  gridBtn.addEventListener("click", () => {
    container.style.gridTemplateColumns = "repeat(2, 1fr)";
    gridBtn.style.opacity = "1";
    listBtn.style.opacity = "0.5";
    
    // Mobile responsive reset
    if (window.innerWidth <= 600) {
      container.style.gridTemplateColumns = "1fr";
    }
    showToast("Grid Layout Enabled");
  });

  listBtn.addEventListener("click", () => {
    container.style.gridTemplateColumns = "1fr";
    listBtn.style.opacity = "1";
    gridBtn.style.opacity = "0.5";
    showToast("List Layout Enabled");
  });

  // Handle mobile resizing for layout rules
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 600 && gridBtn.style.opacity === "1") {
      container.style.gridTemplateColumns = "1fr";
    } else if (window.innerWidth > 600 && gridBtn.style.opacity === "1") {
      container.style.gridTemplateColumns = "repeat(2, 1fr)";
    }
  });
}

/* ==========================================
   6. Project SwiftUI Detail Modal Sheet
   ========================================== */
const projectData = {
  "1": {
    en: {
      title: "Aether Markup Editor",
      tag: "SwiftUI / CSS",
      desc: "Aether is a real-time markdown compiler and editor styled with standard Apple card modules and fluid design frameworks. It includes instant rendering outputs, offline draft local storage caching, auto-save settings, and clean typography layouts.",
      status: "Production Ready",
      activity: "40 mins ago"
    },
    id: {
      title: "Aether Markup Editor",
      tag: "SwiftUI / CSS",
      desc: "Aether adalah compiler dan editor markdown real-time yang dirancang dengan modul kartu standar Apple dan framework desain yang lancar. Ini mencakup output rendering instan, penyimpanan draf offline di cache lokal, pengaturan simpan otomatis, dan tata letak tipografi yang bersih.",
      status: "Siap Produksi",
      activity: "40 menit yang lalu"
    },
    stars: "284",
    forks: "32",
    visitLink: "#",
    sourceLink: "#"
  },
  "2": {
    en: {
      title: "Synapse IoT Hub",
      tag: "NodeJS / SQL",
      desc: "Synapse is a centralized data broker and dashboard designed for streaming real-time sensor metrics from low-power ESP32 controller chips. Features sub-second telemetry aggregation, WebSocket listeners, SQL query filters, and clean monochrome data logs.",
      status: "Beta Deployment",
      activity: "Yesterday"
    },
    id: {
      title: "Synapse IoT Hub",
      tag: "NodeJS / SQL",
      desc: "Synapse adalah broker data dan dasbor terpusat yang dirancang untuk mengalirkan metrik sensor real-time dari chip pengontrol ESP32 berdaya rendah. Fitur agregasi telemetri sub-detik, pendengar WebSocket, filter kueri SQL, dan log data monokrom yang bersih.",
      status: "Penyebaran Beta",
      activity: "Kemarin"
    },
    stars: "148",
    forks: "19",
    visitLink: "#",
    sourceLink: "#"
  },
  "3": {
    en: {
      title: "Enigma Vault",
      tag: "Go / CLI",
      desc: "Enigma Vault is a CLI-first utility tool in Go. It enables programmers to run client-side symmetric AES encryption commands on directory archives before transferring them to standard cloud networks.",
      status: "Stable v1.2.0",
      activity: "3 days ago"
    },
    id: {
      title: "Enigma Vault",
      tag: "Go / CLI",
      desc: "Enigma Vault adalah alat utilitas CLI di Go. Ini memungkinkan programmer untuk menjalankan perintah enkripsi AES simetris sisi klien pada arsip direktori sebelum mentransfernya ke jaringan cloud standar.",
      status: "Stabil v1.2.0",
      activity: "3 hari yang lalu"
    },
    stars: "96",
    forks: "7",
    visitLink: "#",
    sourceLink: "#"
  },
  "4": {
    en: {
      title: "HapticJS Library",
      tag: "Webkit / JS",
      desc: "HapticJS is a lightweight custom JS abstraction that enables responsive mobile vibrations on button taps. By mimicking iOS UI feedback vibrations, this script optimizes mobile web accessibility standards.",
      status: "Published NPM Package",
      activity: "2 weeks ago"
    },
    id: {
      title: "HapticJS Library",
      tag: "Webkit / JS",
      desc: "HapticJS adalah abstraksi JS kustom ringan yang memungkinkan getaran seluler responsif pada ketukan tombol. Dengan meniru getaran umpan balik UI iOS, skrip ini mengoptimalkan standar aksesibilitas web seluler.",
      status: "Paket NPM Diterbitkan",
      activity: "2 minggu yang lalu"
    },
    stars: "412",
    forks: "41",
    visitLink: "#",
    sourceLink: "#"
  }
};

function initProjectSheet() {
  const overlay = document.getElementById("project-detail-overlay");
  const closeBtn = document.getElementById("sheet-close-btn");
  const projectCards = document.querySelectorAll(".project-card");
  
  // Modal Fields
  const sheetTitle = document.getElementById("sheet-project-title");
  const sheetTag = document.getElementById("sheet-project-tag");
  const sheetStatus = document.getElementById("sheet-project-status");
  const sheetDesc = document.getElementById("sheet-project-desc");
  const sheetStars = document.getElementById("sheet-project-stars");
  const sheetForks = document.getElementById("sheet-project-forks");
  const sheetActivity = document.getElementById("sheet-project-activity");
  const sheetVisitBtn = document.getElementById("sheet-project-btn-visit");
  const sheetSourceBtn = document.getElementById("sheet-project-btn-source");
  
  function openSheet(id) {
    const rawData = projectData[id];
    if (!rawData) return;
    
    // Get localized version
    const data = rawData[currentLang] || rawData['en'];
    
    // Populate modal values
    sheetTitle.innerText = data.title;
    sheetTag.innerText = data.tag;
    sheetStatus.innerText = data.status;
    sheetDesc.innerText = data.desc;
    sheetStars.innerText = rawData.stars;
    sheetForks.innerText = rawData.forks;
    sheetActivity.innerText = data.activity;
    sheetVisitBtn.setAttribute("href", rawData.visitLink);
    sheetSourceBtn.setAttribute("href", rawData.sourceLink);
    
    // Show overlay
    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Disable background scrolling
  }
  
  function closeSheet() {
    overlay.classList.remove("active");
    document.body.style.overflow = ""; // Re-enable background scrolling
  }
  
  projectCards.forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-project-id");
      openSheet(id);
    });
  });
  
  closeBtn.addEventListener("click", closeSheet);
  
  // Close sheet on backdrop overlay click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeSheet();
    }
  });

  // Close sheet on Escape keypress
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      closeSheet();
    }
  });
}

/* ==========================================
   7. Form Submission Handler
   ========================================== */
function handleFormSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById("contact-name").value;
  const email = document.getElementById("contact-email").value;
  const reason = document.getElementById("contact-reason").value;
  const urgent = document.getElementById("contact-urgent").checked;
  const message = document.getElementById("contact-message").value;
  
  // Simulate API post call
  setTimeout(() => {
    showToast(translations[currentLang]["toast-form-success"]);
    document.getElementById("contact-form").reset();
    
    // Redirect to home/overview
    setTimeout(() => {
      switchTab("overview");
    }, 1000);
  }, 300);
}

/* ==========================================
   8. SwiftUI Bottom Toast Banner Alert
   ========================================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById("toast-notification");
  const toastMsg = document.getElementById("toast-message");
  
  if (!toast || !toastMsg) return;
  
  toastMsg.innerText = message;
  
  // Reset active classes
  clearTimeout(toastTimeout);
  
  // Animate from bottom
  toast.style.bottom = "24px";
  
  toastTimeout = setTimeout(() => {
    toast.style.bottom = "-60px";
  }, 2500);
}

/* ==========================================
   9. Multi-language Translation System (EN / ID)
   ========================================== */
let currentLang = "en";

const translations = {
  en: {
    // Hero profile card
    "hero-title": "Software Developer · CIMB Niaga & Freelancer",
    "hero-bio": "Building real-world web and mobile applications. Currently working as a Software Developer at CIMB Niaga and running freelance projects under the khadevrax brand. Focused on clean code, beautiful UI, and great user experience.",
    "btn-contact": "Contact",
    "btn-resume": "Resume",
    
    // Developer Stats toggle
    "dev-stats-title": "Developer Mode Statistics",
    "dev-stats-subtitle": "Show system metrics and stats",
    "metric-exp": "Years Exp",
    "metric-proj": "Projects",
    "metric-commits": "Commits",
    
    // iOS Status Widgets
    "widget-status-pill": "Status: Online",
    "widget-status-title": "Ready to Collaborate",
    "widget-status-subtitle": "Feel free to ping me for projects",
    "widget-diag-pill": "Diagnostics",
    "widget-diag-title": "System Specs",
    "widget-diag-stack": "Main Stack",
    "widget-diag-ui": "Primary UI",
    "widget-diag-env": "Environment",
    
    // Navigation bar tabs
    "tab-overview": "Overview",
    "tab-projects": "Projects",
    "tab-skills": "Skills",
    "tab-timeline": "Timeline",
    "tab-contact": "Contact",
    
    // Overview tab
    "overview-header-profile": "System Profile",
    "overview-name-title": "Full Name",
    "overview-name-val": "Khadafi",
    "overview-loc-title": "Location",
    "overview-loc-val": "Indonesia · Remote",
    "overview-role-title": "Current Role",
    "overview-role-sub": "Software Developer · CIMB Niaga",
    "overview-role-val": "+ Freelancer",
    "overview-header-focus": "Focus Areas",
    "overview-focus1-title": "Web Development",
    "overview-focus1-sub": "React, Next.js, Laravel, responsive & modern UIs",
    "overview-focus2-title": "Mobile Development",
    "overview-focus2-sub": "Flutter, React Native, cross-platform mobile apps",
    "overview-focus3-title": "Backend & APIs",
    "overview-focus3-sub": "Node.js, REST APIs, databases, cloud deployment",
    
    // Projects tab
    "projects-header": "Active Repositories",
    "proj1-title": "Aether Markup Editor",
    "proj1-desc": "A real-time Markdown editor designed with standard Apple SwiftUI layout cards and system controls.",
    "proj2-title": "Synapse IoT Hub",
    "proj2-desc": "An administrative control console collecting sensor telemetry logs from distributed nodes.",
    "proj3-title": "Enigma Vault",
    "proj3-desc": "A lightweight cryptographic terminal client for locally encrypting archives before server sync.",
    "proj4-title": "HapticJS",
    "proj4-desc": "A micro-library to trigger structural vibration feedbacks on mobile screens through standard web interactions.",
    
    // Skills tab
    "skills-header-core": "Core Competencies",
    "skills-header-tools": "System Tools & Utilities",
    "skills-expert": "Expert",
    "skills-advanced": "Advanced",
    "skills-intermediate": "Intermediate",
    
    // Timeline tab
    "timeline-header": "Professional History",
    "timeline-tag-present": "Present",
    "timeline-tag-previous": "Freelance",
    "timeline-tag-academics": "Graduated",
    "timeline-job1-title": "Software Developer",
    "timeline-job1-desc": "Developing and maintaining banking software systems at CIMB Niaga, Indonesia. Contributing to internal tools, digital banking features, and cross-team integrations.",
    "timeline-job2-title": "Freelance Software Developer",
    "timeline-job2-desc": "Building custom web and mobile applications for clients under the khadevrax brand. Specializing in responsive frontends, REST APIs, and cross-platform mobile apps.",
    "timeline-job3-title": "S.Kom. in Computer Science",
    "timeline-job3-sub": "Universitas Indonesia",
    "timeline-job3-desc": "Specialized in software engineering, web systems, and mobile development. Graduated July 2025 with a focus on practical full-stack applications.",
    
    // Contact tab
    "contact-header": "Send a Message",
    "contact-widget-pill": "Signature",
    "contact-widget-title": "Let's build something!",
    "contact-widget-resp": "Average Response Time: < 24h",
    "contact-label-name": "Your Name",
    "contact-placeholder-name": "Enter name",
    "contact-label-email": "Email Address",
    "contact-placeholder-email": "Enter email",
    "contact-label-reason": "Reason for Inquiry",
    "contact-option-select": "Select an option",
    "contact-option-project": "New Project Discussion",
    "contact-option-hire": "Hiring Opportunity",
    "contact-option-collab": "Open Source Collaboration",
    "contact-option-general": "General Question",
    "contact-urgent-title": "Urgent Reply Required",
    "contact-urgent-sub": "Flags message as high priority",
    "contact-label-msg": "Message Details",
    "contact-placeholder-msg": "How can I assist you?",
    "contact-btn-submit": "Send Transmission",
    
    // Sheet Modal Static Default Values
    "sheet-title-default": "Project Details",
    "sheet-tag-default": "Category",
    "sheet-status-default": "Active Repo",
    "sheet-stars": "GitHub Stars",
    "sheet-forks": "Forks",
    "sheet-activity": "Last Activity",
    "sheet-btn-visit": "Launch Live",
    "sheet-btn-source": "View Source",
    
    // Footer
    "footer-text": "&copy; 2025 Khadafi · khadevrax. Designed with SwiftUI Monochrome paradigms.",
    
    // Dynamic Toasts & Alert responses
    "toast-dark-mode": "Dark Mode Enabled",
    "toast-light-mode": "Light Mode Enabled",
    "toast-metrics-show": "Dev metrics visible",
    "toast-metrics-hide": "Dev metrics hidden",
    "toast-grid-layout": "Grid Layout Enabled",
    "toast-list-layout": "List Layout Enabled",
    "toast-form-success": "Transmission sent successfully!",
    "toast-lang-changed": "Language set to English"
  },
  id: {
    // Hero profile card
    "hero-title": "Software Developer · CIMB Niaga & Freelancer",
    "hero-bio": "Membangun aplikasi web dan mobile nyata. Saat ini bekerja sebagai Software Developer di CIMB Niaga dan menjalankan proyek freelance di bawah brand khadevrax. Fokus pada kode bersih, UI yang indah, dan pengalaman pengguna terbaik.",
    "btn-contact": "Kontak",
    "btn-resume": "Resume",
    
    // Developer Stats toggle
    "dev-stats-title": "Statistik Mode Developer",
    "dev-stats-subtitle": "Tampilkan metrik sistem dan statistik",
    "metric-exp": "Tahun Pengalaman",
    "metric-proj": "Proyek",
    "metric-commits": "Komit Git",
    
    // iOS Status Widgets
    "widget-status-pill": "Status: Daring",
    "widget-status-title": "Siap Berkolaborasi",
    "widget-status-subtitle": "Hubungi saya untuk proyek apa pun",
    "widget-diag-pill": "Diagnostik",
    "widget-diag-title": "Spesifikasi Sistem",
    "widget-diag-stack": "Stack Utama",
    "widget-diag-ui": "UI Utama",
    "widget-diag-env": "Lingkungan",
    
    // Navigation bar tabs
    "tab-overview": "Ikhtisar",
    "tab-projects": "Proyek",
    "tab-skills": "Keahlian",
    "tab-timeline": "Linimasa",
    "tab-contact": "Kontak",
    
    // Overview tab
    "overview-header-profile": "Profil Sistem",
    "overview-name-title": "Nama Lengkap",
    "overview-name-val": "Khadafi",
    "overview-loc-title": "Lokasi",
    "overview-loc-val": "Indonesia · Remote",
    "overview-role-title": "Peran Saat Ini",
    "overview-role-sub": "Software Developer · CIMB Niaga",
    "overview-role-val": "+ Freelancer",
    "overview-header-focus": "Fokus Bidang",
    "overview-focus1-title": "Pengembangan Web",
    "overview-focus1-sub": "React, Next.js, Laravel, UI modern dan responsif",
    "overview-focus2-title": "Pengembangan Mobile",
    "overview-focus2-sub": "Flutter, React Native, aplikasi mobile lintas platform",
    "overview-focus3-title": "Backend & API",
    "overview-focus3-sub": "Node.js, REST API, database, deployment cloud",
    
    // Projects tab
    "projects-header": "Repositori Aktif",
    "proj1-title": "Aether Markup Editor",
    "proj1-desc": "Editor Markdown real-time yang dirancang dengan modul kartu standar Apple SwiftUI dan pengontrol sistem.",
    "proj2-title": "Synapse IoT Hub",
    "proj2-desc": "Konsol kontrol administratif yang mengumpulkan data telemetri sensor dari node terdistribusi.",
    "proj3-title": "Enigma Vault",
    "proj3-desc": "Alat utilitas CLI ringan di Go untuk enkripsi file AES lokal sebelum sinkronisasi server.",
    "proj4-title": "HapticJS",
    "proj4-desc": "Pustaka mikro untuk memicu getaran haptik responsif pada layar seluler melalui ketukan tombol web.",
    
    // Skills tab
    "skills-header-core": "Kompetensi Utama",
    "skills-header-tools": "Alat & Utilitas Sistem",
    "skills-expert": "Ahli",
    "skills-advanced": "Mahir",
    "skills-intermediate": "Menengah",
    
    // Timeline tab
    "timeline-header": "Riwayat Profesional",
    "timeline-tag-present": "Saat Ini",
    "timeline-tag-previous": "Freelance",
    "timeline-tag-academics": "Lulus",
    "timeline-job1-title": "Software Developer",
    "timeline-job1-desc": "Mengembangkan dan memelihara sistem perangkat lunak perbankan di CIMB Niaga, Indonesia. Berkontribusi pada fitur digital banking dan integrasi lintas tim.",
    "timeline-job2-title": "Freelance Software Developer",
    "timeline-job2-desc": "Membangun aplikasi web dan mobile kustom untuk klien di bawah brand khadevrax. Spesialisasi pada frontend responsif, REST API, dan aplikasi mobile lintas platform.",
    "timeline-job3-title": "S.Kom. Ilmu Komputer",
    "timeline-job3-sub": "Universitas Indonesia",
    "timeline-job3-desc": "Spesialisasi di rekayasa perangkat lunak, sistem web, dan pengembangan mobile. Lulus Juli 2025 dengan fokus pada aplikasi full-stack praktis.",
    
    // Contact tab
    "contact-header": "Kirim Pesan",
    "contact-widget-pill": "Tanda Tangan",
    "contact-widget-title": "Mari buat sesuatu!",
    "contact-widget-resp": "Rata-rata Respons: < 24 jam",
    "contact-label-name": "Nama Anda",
    "contact-placeholder-name": "Masukkan nama",
    "contact-label-email": "Alamat Email",
    "contact-placeholder-email": "Masukkan email",
    "contact-label-reason": "Alasan Menghubungi",
    "contact-option-select": "Pilih opsi",
    "contact-option-project": "Diskusi Proyek Baru",
    "contact-option-hire": "Kesempatan Kerja",
    "contact-option-collab": "Kolaborasi Open Source",
    "contact-option-general": "Pertanyaan Umum",
    "contact-urgent-title": "Membutuhkan Balasan Segera",
    "contact-urgent-sub": "Tandai pesan sebagai prioritas tinggi",
    "contact-label-msg": "Rincian Pesan",
    "contact-placeholder-msg": "Bagaimana saya bisa membantu Anda?",
    "contact-btn-submit": "Kirim Transmisi",
    
    // Sheet Modal Static Default Values
    "sheet-title-default": "Detail Proyek",
    "sheet-tag-default": "Kategori",
    "sheet-status-default": "Repositori Aktif",
    "sheet-stars": "Bintang GitHub",
    "sheet-forks": "Forks",
    "sheet-activity": "Aktivitas Terakhir",
    "sheet-btn-visit": "Buka Langsung",
    "sheet-btn-source": "Lihat Kode Sumber",
    
    // Footer
    "footer-text": "&copy; 2025 Khadafi · khadevrax. Dirancang dengan paradigma SwiftUI Monokrom.",
    
    // Dynamic Toasts & Alert responses
    "toast-dark-mode": "Mode Gelap Diaktifkan",
    "toast-light-mode": "Mode Terang Diaktifkan",
    "toast-metrics-show": "Metrik dev ditampilkan",
    "toast-metrics-hide": "Metrik dev disembunyikan",
    "toast-grid-layout": "Tata Letak Grid Diaktifkan",
    "toast-list-layout": "Tata Letak Baris Diaktifkan",
    "toast-form-success": "Transmisi berhasil terkirim!",
    "toast-lang-changed": "Bahasa diubah ke Bahasa Indonesia"
  }
};

function initLanguagePicker() {
  const langPicker = document.getElementById("lang-picker");
  const options = langPicker.querySelectorAll(".picker-option");
  const slider = document.getElementById("lang-slider");

  function updateLangSlider(element) {
    const pickerRect = langPicker.getBoundingClientRect();
    const elemRect = element.getBoundingClientRect();
    const leftOffset = elemRect.left - pickerRect.left;
    slider.style.width = `${elemRect.width}px`;
    slider.style.transform = `translateX(${leftOffset}px)`;
  }

  // Check saved language or system defaults
  const savedLang = localStorage.getItem("lang");
  const systemLang = navigator.language.slice(0, 2);
  const defaultLang = savedLang || (systemLang === "id" ? "id" : "en");

  // Apply language
  setLanguage(defaultLang);

  // Sync initial slider selector position
  const activeOption = langPicker.querySelector(`.picker-option[data-lang="${defaultLang}"]`);
  if (activeOption) {
    options.forEach(opt => opt.classList.remove("active"));
    activeOption.classList.add("active");
    setTimeout(() => updateLangSlider(activeOption), 150);
  }

  options.forEach(option => {
    option.addEventListener("click", () => {
      const selectedLang = option.getAttribute("data-lang");
      options.forEach(opt => opt.classList.remove("active"));
      option.classList.add("active");
      updateLangSlider(option);
      setLanguage(selectedLang);
      
      // Notify user of language change
      showToast(translations[selectedLang]["toast-lang-changed"]);
    });
  });

  window.addEventListener("resize", () => {
    const currentActive = langPicker.querySelector(".picker-option.active");
    if (currentActive) {
      updateLangSlider(currentActive);
    }
  });
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);

  // Update elements with data-translate
  const elements = document.querySelectorAll("[data-translate]");
  elements.forEach(el => {
    const key = el.getAttribute("data-translate");
    if (translations[lang] && translations[lang][key]) {
      // Preserve SVG icon/elements inside buttons/links if any
      const icon = el.querySelector(".lucide") || el.querySelector("i");
      if (icon) {
        // Save the outerHTML of the icon
        const iconHTML = icon.outerHTML;
        el.innerHTML = iconHTML + " " + translations[lang][key];
      } else {
        el.innerHTML = translations[lang][key];
      }
    }
  });

  // Update elements with data-translate-placeholder
  const inputs = document.querySelectorAll("[data-translate-placeholder]");
  inputs.forEach(input => {
    const key = input.getAttribute("data-translate-placeholder");
    if (translations[lang] && translations[lang][key]) {
      input.setAttribute("placeholder", translations[lang][key]);
    }
  });

  // Recreate Lucide Icons to make sure newly injected icons render correctly
  lucide.createIcons();
  
  // Update Segmented Control slider offset in case tabs widths changed due to translations
  const picker = document.getElementById("section-picker");
  if (picker) {
    const activeOption = picker.querySelector(".picker-option.active");
    const slider = document.getElementById("picker-slider");
    if (activeOption && slider) {
      const pickerRect = picker.getBoundingClientRect();
      const elemRect = activeOption.getBoundingClientRect();
      const leftOffset = elemRect.left - pickerRect.left;
      slider.style.width = `${elemRect.width}px`;
      slider.style.transform = `translateX(${leftOffset}px)`;
    }
  }
}
