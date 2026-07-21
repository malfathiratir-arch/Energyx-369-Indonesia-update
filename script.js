/* ==========================================================================
   EnergyX 369 — Enterprise AI OS
   Client-Side Interactive Script Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    console.log("EnergyX 369 System Engine Initialized.");

    /* ==========================================================================
       1. HERO TYPING DEMO (RANI FINANCE AI AGENT)
       ========================================================================== */
    (function initHeroTypingDemo() {
        const typingEl = document.getElementById('typingText');
        const outputEl = document.getElementById('demoOutput');
        const outputContentEl = document.getElementById('demoOutputContent');
        const progressBar = document.getElementById('demoProgress');
        const thinkingEl = document.getElementById('demoThinking');

        if (!typingEl) return;

        const messages = [
            'Tolong bantu rekonsiliasi data mutasi bank hari ini dengan invoice masuk minggu lalu.',
            'Buatkan draf Purchase Order berdasarkan analisis POS 7 hari terakhir.',
            'Rangkum status pipeline prospek yang membutuhkan follow-up hari ini.'
        ];

        const outputs = [
            '<strong>Analisis selesai.</strong><br><br>142 transaksi berhasil dicocokkan dengan data sistem.<br>3 anomali perbedaan nominal teridentifikasi. Draf catatan koreksi siap ditinjau.',
            '<strong>PO Draft siap.</strong><br><br>Stok 12 SKU di bawah reorder point.<br>Draf PO 8 vendor disusun dengan estimasi penghematan 11%.',
            '<strong>Pipeline diperbarui.</strong><br><br>23 prospek aktif membutuhkan tindak lanjut.<br>5 quotation otomatis terkirim ke tim sales terkait.'
        ];

        let msgIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeLoop = () => {
            const current = messages[msgIndex];

            if (!isDeleting) {
                charIndex++;
                typingEl.textContent = current.slice(0, charIndex);

                if (charIndex === current.length) {
                    if (outputEl) {
                        outputEl.classList.remove('visible');

                        setTimeout(() => {
                            if (outputContentEl) outputContentEl.innerHTML = '';
                            if (thinkingEl) thinkingEl.classList.add('show');
                            outputEl.classList.add('visible');

                            setTimeout(() => {
                                if (thinkingEl) thinkingEl.classList.remove('show');
                                if (outputContentEl) outputContentEl.innerHTML = outputs[msgIndex];

                                if (progressBar) {
                                    progressBar.style.width = '0%';
                                    requestAnimationFrame(() => { 
                                        progressBar.style.width = '100%'; 
                                    });
                                }
                            }, 1200);

                        }, 400);
                    }
                    setTimeout(() => { isDeleting = true; typeLoop(); }, 4500);
                    return;
                }
            } else {
                charIndex--;
                typingEl.textContent = current.slice(0, charIndex);

                if (charIndex === 0) {
                    isDeleting = false;
                    msgIndex = (msgIndex + 1) % messages.length;
                    if (outputEl) outputEl.classList.remove('visible');
                    setTimeout(typeLoop, 600);
                    return;
                }
            }
            setTimeout(typeLoop, isDeleting ? 18 : 38);
        };

        setTimeout(typeLoop, 800);
    })();

    /* ==========================================================================
       2. PREMIUM SECTION INDICATOR (CLICK-TO-EXPAND & SCROLL)
       ========================================================================== */
    const indicatorItems = document.querySelectorAll(".section-indicator-item");
    const sections = document.querySelectorAll("main > section");
    let currentExpandedItem = null;

    indicatorItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            if (this === currentExpandedItem) {
                this.classList.remove("expanded");
                currentExpandedItem = null;
            } else {
                if (currentExpandedItem) {
                    currentExpandedItem.classList.remove("expanded");
                }
                this.classList.add("expanded");
                currentExpandedItem = this;

                const targetId = this.getAttribute("data-target");
                const targetedElement = document.getElementById(targetId);
                if (targetedElement) {
                    const navbarOffset = 90;
                    const offsetPosition = targetedElement.getBoundingClientRect().top + window.pageYOffset - navbarOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
            }
        });
    });

    /* ==========================================================================
       3. TOP SCROLL PROGRESS BAR & ACTIVE SECTION SPY
       ========================================================================== */
    window.addEventListener('scroll', function () {
        const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        // Progress bar di strip paling atas
        if (totalHeight > 0) {
            const scrollPercentage = (windowScroll / totalHeight) * 100;
            const indicator = document.getElementById('scrollIndicator');
            if (indicator) indicator.style.width = scrollPercentage + '%';
        }

        // Active indicator handler
        let triggerLine = window.scrollY + 160;
        let currentActiveSectionId = "";

        sections.forEach(sec => {
            if (sec.offsetTop <= triggerLine) {
                currentActiveSectionId = sec.getAttribute("id");
            }
        });

        if (currentActiveSectionId) {
            indicatorItems.forEach(item => {
                const itemTarget = item.getAttribute("data-target");
                if (itemTarget === currentActiveSectionId) {
                    if (item !== currentExpandedItem) {
                        if (currentExpandedItem) {
                            currentExpandedItem.classList.remove("expanded");
                        }
                        item.classList.add("expanded");
                        currentExpandedItem = item;
                    }
                }
            });
        }
    });

    /* ==========================================================================
       4. SCROLL REVEAL ENGINE
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       5. CHART ANIMATION OBSERVER
       ========================================================================== */
    const chartObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.pwc-bar-fill');
                fills.forEach(fill => {
                    const targetWidth = fill.getAttribute('data-size');
                    if (targetWidth) fill.style.setProperty('width', targetWidth + '%', 'important');
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const chartContainer = document.querySelector('.pwc-chart-bars');
    if (chartContainer) chartObserver.observe(chartContainer);

    /* ==========================================================================
       6. MOBILE HAMBURGER NAVIGATION CONTROLLER
       ========================================================================== */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    const navLinkItems = document.querySelectorAll('.nav-link');

    const closeMobileNav = () => {
        if (navToggle) {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        if (navLinks) navLinks.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('is-visible');
        document.body.classList.remove('nav-open');
    };

    const openMobileNav = () => {
        if (navToggle) {
            navToggle.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
        }
        if (navLinks) navLinks.classList.add('active');
        if (navOverlay) navOverlay.classList.add('is-visible');
        document.body.classList.add('nav-open');
    };

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.classList.contains('active');
            isOpen ? closeMobileNav() : openMobileNav();
        });

        if (navOverlay) {
            navOverlay.addEventListener('click', closeMobileNav);
        }

        navLinkItems.forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });
    }

  /* ==========================================================================
       7. HEADER SCROLLED STATE & AUTO-HIDE ON SCROLL
       ========================================================================== */
    const header = document.getElementById('siteHeader') || document.querySelector('header') || document.querySelector('.nav-container');

    if (header) {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Efek background saat mulai di-scroll
            header.classList.toggle('scrolled', currentScrollY > 12);

            // Sembunyikan saat scroll ke bawah (setelah 60px)
            if (currentScrollY > lastScrollY && currentScrollY > 60) {
                header.classList.add('nav-hidden');
            } 
            // Munculkan kembali saat scroll ke atas
            else {
                header.classList.remove('nav-hidden');
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });

    /* Active Link Spy for Header Menu */
    const sectionIds = ['hero', 'demo', 'cases', 'ai-employee', 'investasi', 'contact'];
    const activeLinks = Array.from(document.querySelectorAll('.nav-link'));
    
    const updateActiveLink = () => {
        let currentId = 'hero';
        sectionIds.forEach(id => {
            const section = document.getElementById(id);
            if (section && window.scrollY + 160 >= section.offsetTop) {
                currentId = id;
            }
        });

        activeLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${currentId}`);
        });
    };

    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink, { passive: true });
/* ==========================================================================
       8. PRICING TABS SWITCHER
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.pricing-tabs .tab-btn');
    const tabPanels = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('data-target');
            if (!targetId) return;

            // 1. Reset status semua tombol
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });

            // 2. Sembunyikan semua panel tab
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            // 3. Aktifkan tombol yang diklik
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            // 4. Tampilkan panel yang sesuai ID target
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
    /* ==========================================================================
       9. FORM INTEGRASI WHATSAPP DIRECT SEND
       ========================================================================== */
    const waForm = document.getElementById('waForm');
    if (waForm) {
        waForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value.trim();
            const workEmail = document.getElementById('workEmail').value.trim();
            const jobRole = document.getElementById('jobRole').value.trim();
            const selectedPlan = document.getElementById('selectedPlan').value;
            const bottleneck = document.getElementById('bottleneck').value;

            const waTemplate = `Halo Tim EnergyX! 👋\nSaya ingin mengirimkan ringkasan kebutuhan sistem untuk dijadwalkan sesi asesmen:\n\n*Profil Pemohon:*\n👤 Nama: ${fullName}\n💼 Jabatan: ${jobRole}\n📧 Corporate Email: ${workEmail}\n🎯 Skema Diminati: ${selectedPlan}\n\n*Kendala Operasional Utama:*\n${bottleneck}\n\nKapan tim Solution Architect bisa melakukan sesi telekonferensi untuk penjajakan lebih lanjut? Terima kasih.`;
            
            window.open(`https://wa.me/6285285586496?text=${encodeURIComponent(waTemplate)}`, '_blank');
        });
    }

    /* ==========================================================================
       10. SERVICE WORKER UNREGISTER (CACHE PURGE)
       ========================================================================== */
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            for (let registration of registrations) {
                registration.unregister().then(function () {
                    console.log("Service Worker cache cleared successfully.");
                });
            }
        });
    }
});

/* ==========================================================================
   11. INITIALIZE AOS ANIMATION LIBRARY
   ========================================================================== */
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        once: true
    });
}

document.addEventListener('DOMContentLoaded', () => {
  // Otomatis mencari tag <nav>, <header>, atau class navbar
  const navbar = document.querySelector('nav') || document.querySelector('header') || document.querySelector('.nav-container');

  if (!navbar) {
    console.error('Navbar tidak ditemukan! Pastikan ada tag <nav> atau <header> di HTML.');
    return;
  }

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Scroll ke bawah (sembunyi)
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      navbar.classList.add('nav-hidden');
    } 
    // Scroll ke atas (muncul lagi)
    else {
      navbar.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
  });
});

/* ==========================================================================
   GLOBAL EVENT DELEGATION FOR PRICING TABS (DIAGNOSTIC & FIX)
   ========================================================================== */
document.addEventListener('click', function (e) {
  // Cek apakah elemen yang diklik adalah .tab-btn atau berada di dalamnya
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;

  e.preventDefault();

  const targetId = btn.getAttribute('data-target');
  console.log('Tombol tab diklik! Target ID:', targetId);

  if (!targetId) return;

  // 1. Reset semua tombol tab
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });

  // 2. Sembunyikan semua panel tab
  document.querySelectorAll('.tab-content').forEach(panel => {
    panel.classList.remove('active');
  });

  // 3. Aktifkan tombol yang diklik
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');

  // 4. Tampilkan panel yang sesuai
  const targetPanel = document.getElementById(targetId);
  if (targetPanel) {
    targetPanel.classList.add('active');
    console.log('Panel berhasil dibuka:', targetId);
  } else {
    console.error('Error: Elemen HTML dengan id="' + targetId + '" tidak ditemukan!');
  }
});