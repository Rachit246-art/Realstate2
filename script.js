/**
 * VÉLORA REAL ESTATE — Luxury Editorial Website
 * Core Interactive & Animation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initHeroSlider();
  initParallax();
  initScrollObserver();
  initStatsCounter();
  initPropertiesSlider();
  initCommunitiesSlider();
  initModals();
  initSmoothScroll();
  initPropertyFilter();
  initFloorplanTabs();
  initOfficeTabs();
  initMaterialityShowcase();
});

/* ===================================================================
   1. NAVBAR SCROLL EFFECT
   =================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const isSolidPage = navbar.classList.contains('navbar-solid');

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else if (!isSolidPage) {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ===================================================================
   2. HERO 3-SLIDE AUTO SLIDER ENGINE WITH KEN BURNS EFFECT
   =================================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 5500; // 5.5 seconds per slide

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      const progress = dot.querySelector('.dot-progress');
      if (i === index) {
        dot.classList.add('active');
        if (progress) {
          progress.classList.remove('running');
          void progress.offsetWidth; // Force CSS reflow to restart progress animation
          progress.classList.add('running');
        }
      } else {
        dot.classList.remove('active');
        if (progress) {
          progress.classList.remove('running');
        }
      }
    });

    currentSlide = index;
  };

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, slideDuration);
  };

  const stopAutoSlide = () => {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-goto'), 10);
      if (!isNaN(targetIndex) && targetIndex !== currentSlide) {
        showSlide(targetIndex);
        startAutoSlide();
      }
    });
  });

  const heroSlider = document.getElementById('heroSlider');
  if (heroSlider) {
    heroSlider.addEventListener('mouseenter', stopAutoSlide);
    heroSlider.addEventListener('mouseleave', startAutoSlide);

    let heroTouchStartX = 0;
    heroSlider.addEventListener('touchstart', (e) => {
      heroTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    heroSlider.addEventListener('touchend', (e) => {
      const heroTouchEndX = e.changedTouches[0].screenX;
      const diff = heroTouchStartX - heroTouchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          nextSlide();
        } else {
          const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
          showSlide(prevIndex);
        }
        startAutoSlide();
      }
    }, { passive: true });
  }

  showSlide(0);
  startAutoSlide();
}

/* ===================================================================
   3. SUBTLE PARALLAX EFFECT ON HERO BACKGROUND
   =================================================================== */
function initParallax() {
  const heroBg = document.getElementById('heroBg');
  const heroSection = document.getElementById('hero');
  if (!heroBg || !heroSection) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        if (scrolled <= heroHeight) {
          const translateY = scrolled * 0.28;
          heroBg.style.transform = `translate3d(0, ${translateY}px, 0)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ===================================================================
   4. INTERSECTION OBSERVER FOR SCROLL-TRIGGERED REVEALS
   =================================================================== */
function initScrollObserver() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -70px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => revealObserver.observe(el));
}

/* ===================================================================
   5. FLOATING STATISTICS COUNT-UP ANIMATION
   =================================================================== */
function initStatsCounter() {
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;

  const statVals = document.querySelectorAll('.stat-val');
  let started = false;

  const countUp = (el, target, duration = 1800) => {
    let startTimestamp = null;
    const startVal = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOut * (target - startVal) + startVal);
      el.textContent = currentVal;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      statVals.forEach(valEl => {
        const target = parseInt(valEl.getAttribute('data-target'), 10);
        if (!isNaN(target)) {
          countUp(valEl, target);
        }
      });
      observer.unobserve(statsSection);
    }
  }, { threshold: 0.25 });

  observer.observe(statsSection);
}

/* ===================================================================
   6. FEATURED PROPERTIES HORIZONTAL SLIDER
   =================================================================== */
function initPropertiesSlider() {
  const track = document.getElementById('propTrack');
  const prevBtn = document.getElementById('propPrev');
  const nextBtn = document.getElementById('propNext');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.property-card');
  let currentIndex = 0;

  const getVisibleCards = () => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1200) return 2;
    return 3;
  };

  const getMaxIndex = () => {
    const visible = getVisibleCards();
    return Math.max(0, cards.length - visible);
  };

  const updateSlider = () => {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const computedGap = parseFloat(window.getComputedStyle(track).gap);
    const gap = isNaN(computedGap) ? 32 : computedGap;
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.style.opacity = currentIndex === 0 ? '0.45' : '1';
    nextBtn.style.opacity = currentIndex >= getMaxIndex() ? '0.45' : '1';
  };

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = getMaxIndex();
    }
    updateSlider();
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < getMaxIndex()) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateSlider();
  });

  // Touch Swipe for Mobile
  let propTouchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    propTouchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const propTouchEndX = e.changedTouches[0].screenX;
    const diff = propTouchStartX - propTouchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        if (currentIndex < getMaxIndex()) {
          currentIndex++;
        } else {
          currentIndex = 0;
        }
      } else {
        if (currentIndex > 0) {
          currentIndex--;
        } else {
          currentIndex = getMaxIndex();
        }
      }
      updateSlider();
    }
  }, { passive: true });

  window.addEventListener('resize', updateSlider);
  updateSlider();
}

/* ===================================================================
   7. OUR COMMUNITIES HORIZONTAL SLIDER & PROGRESS BAR
   =================================================================== */
function initCommunitiesSlider() {
  const track = document.getElementById('commTrack');
  const prevBtn = document.getElementById('commPrev');
  const nextBtn = document.getElementById('commNext');
  const progressBar = document.getElementById('commProgressBar');
  const currentNumEl = document.getElementById('commCurrentNum');
  const totalNumEl = document.getElementById('commTotalNum');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.community-card');
  const totalCards = cards.length;
  if (totalNumEl) totalNumEl.textContent = `0${totalCards}`;

  let currentIndex = 0;

  const getVisibleCount = () => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1100) return 2;
    if (window.innerWidth < 1400) return 3;
    return 4;
  };

  const getMaxIndex = () => {
    const visible = getVisibleCount();
    return Math.max(0, totalCards - visible);
  };

  const updateCommunitySlider = () => {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const computedGap = parseFloat(window.getComputedStyle(track).gap);
    const gap = isNaN(computedGap) ? 28 : computedGap;
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    const activeSlide = Math.min(currentIndex + 1, totalCards);
    if (currentNumEl) currentNumEl.textContent = `0${activeSlide}`;

    if (progressBar) {
      const progressPercent = ((currentIndex + 1) / totalCards) * 100;
      progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
    }

    prevBtn.style.opacity = currentIndex === 0 ? '0.45' : '1';
    nextBtn.style.opacity = currentIndex >= getMaxIndex() ? '0.45' : '1';
  };

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = getMaxIndex();
    }
    updateCommunitySlider();
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < getMaxIndex()) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCommunitySlider();
  });

  // Touch Swipe for Mobile
  let commTouchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    commTouchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const commTouchEndX = e.changedTouches[0].screenX;
    const diff = commTouchStartX - commTouchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        if (currentIndex < getMaxIndex()) {
          currentIndex++;
        } else {
          currentIndex = 0;
        }
      } else {
        if (currentIndex > 0) {
          currentIndex--;
        } else {
          currentIndex = getMaxIndex();
        }
      }
      updateCommunitySlider();
    }
  }, { passive: true });

  window.addEventListener('resize', updateCommunitySlider);
  updateCommunitySlider();
}

/* ===================================================================
   8. MODALS & DRAWERS (Schedule, Story, Mobile Menu)
   =================================================================== */
function initModals() {
  const scheduleModal = document.getElementById('scheduleModal');
  const openScheduleModal = document.getElementById('openScheduleModal');
  const closeScheduleModal = document.getElementById('closeScheduleModal');
  const drawerScheduleBtn = document.getElementById('drawerScheduleBtn');

  const storyModal = document.getElementById('storyModal');
  const openStoryModal = document.getElementById('openStoryModal');
  const openStoryModalBtn = document.getElementById('openStoryModalBtn');
  const closeStoryModal = document.getElementById('closeStoryModal');

  const mobileDrawer = document.getElementById('mobileDrawer');
  const openMobileDrawer = document.getElementById('openMobileDrawer');
  const closeMobileDrawer = document.getElementById('closeMobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const btnExperienceModal = document.getElementById('btnExperienceModal');
  const btnCommunitiesModal = document.getElementById('btnCommunitiesModal');
  const scheduleForm = document.getElementById('scheduleForm');
  const newsletterForm = document.getElementById('newsletterForm');

  const openSchedule = (e) => {
    if (e) e.preventDefault();
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (scheduleModal) {
      scheduleModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeSchedule = () => {
    if (scheduleModal) {
      scheduleModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  const openScheduleModalHero = document.getElementById('openScheduleModalHero');
  if (openScheduleModalHero) openScheduleModalHero.addEventListener('click', openSchedule);

  if (openScheduleModal) openScheduleModal.addEventListener('click', openSchedule);
  if (closeScheduleModal) closeScheduleModal.addEventListener('click', closeSchedule);
  if (drawerScheduleBtn) drawerScheduleBtn.addEventListener('click', openSchedule);
  if (btnExperienceModal) btnExperienceModal.addEventListener('click', openSchedule);
  if (btnCommunitiesModal) btnCommunitiesModal.addEventListener('click', openSchedule);

  if (scheduleModal) {
    scheduleModal.addEventListener('click', (e) => {
      if (e.target === scheduleModal) closeSchedule();
    });
  }

  const openStory = (e) => {
    if (e) e.preventDefault();
    if (storyModal) {
      storyModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeStory = () => {
    if (storyModal) {
      storyModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  const openStoryModalSlide2 = document.getElementById('openStoryModalSlide2');
  if (openStoryModal) openStoryModal.addEventListener('click', openStory);
  if (openStoryModalSlide2) openStoryModalSlide2.addEventListener('click', openStory);
  if (openStoryModalBtn) openStoryModalBtn.addEventListener('click', openStory);
  if (closeStoryModal) closeStoryModal.addEventListener('click', closeStory);

  if (storyModal) {
    storyModal.addEventListener('click', (e) => {
      if (e.target === storyModal) closeStory();
    });
  }

  const openDrawer = () => {
    if (mobileDrawer) {
      mobileDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeDrawer = () => {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (openMobileDrawer) openMobileDrawer.addEventListener('click', openDrawer);
  if (closeMobileDrawer) closeMobileDrawer.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  if (scheduleForm) {
    scheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeSchedule();
      showToast('Private appointment requested. Our lifestyle advisor will contact you today.');
      scheduleForm.reset();
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for joining the VÉLORA Private Portfolio Circle.');
      newsletterForm.reset();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSchedule();
      closeStory();
      closeDrawer();
    }
  });
}

/* ===================================================================
   9. TOAST NOTIFICATION UTILITY
   =================================================================== */
function showToast(msg) {
  const toast = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ===================================================================
   10. SMOOTH SCROLLING FOR ALL ANCHOR LINKS
   =================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ===================================================================
   11. PROPERTIES PAGE: INTERACTIVE FILTER
   =================================================================== */
function initPropertyFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const propertyCards = document.querySelectorAll('.property-grid-card');
  const countEl = document.getElementById('filterCount');
  if (!filterBtns.length || !propertyCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      let visibleCount = 0;

      propertyCards.forEach(card => {
        const city = card.getAttribute('data-city');
        const typology = card.getAttribute('data-typology');

        if (filterVal === 'all' || city === filterVal || typology === filterVal) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      if (countEl) {
        countEl.textContent = `Showing ${visibleCount} Residence${visibleCount === 1 ? '' : 's'}`;
      }
    });
  });
}

/* ===================================================================
   12. PROPERTY DETAIL: INTERACTIVE FLOOR PLAN SELECTOR
   =================================================================== */
function initFloorplanTabs() {
  const planTabBtns = document.querySelectorAll('.plan-tab-btn');
  if (!planTabBtns.length) return;

  const planData = {
    '3bhk': {
      title: '3 BHK Sky Residence',
      carpet: '3,600 sq.ft (334.4 sq.m)',
      balcony: '520 sq.ft Running Wrap Deck',
      ceiling: '12.5 ft Double Glazed',
      parking: '2 Dedicated Basements + EV Bay',
      rooms: '3 En-Suite Bedrooms + Powder Room + Maid Suite',
      path: 'M20,20 L380,20 L380,280 L20,280 Z M60,60 L200,60 L200,160 L60,160 Z M220,60 L340,60 L340,160 L220,160 Z M60,180 L340,180 L340,250 L60,250 Z'
    },
    '4bhk': {
      title: '4 BHK Grand Duplex',
      carpet: '5,400 sq.ft (501.6 sq.m)',
      balcony: '850 sq.ft Sky Lounge Deck',
      ceiling: '24 ft Double-Height Living',
      parking: '3 Dedicated Basements + 2 EV Bays',
      rooms: '4 En-Suite Bedrooms + Family Lounge + Study + 2 Maid Suites',
      path: 'M20,20 L380,20 L380,280 L20,280 Z M40,40 L160,40 L160,140 L40,140 Z M180,40 L360,40 L360,140 L180,140 Z M40,160 L180,160 L180,260 L40,260 Z M200,160 L360,160 L360,260 L200,260 Z'
    },
    '5bhk': {
      title: '5 BHK Presidential Penthouse',
      carpet: '8,900 sq.ft (826.8 sq.m)',
      balcony: '1,400 sq.ft Private Plunge Pool Terrace',
      ceiling: '26 ft Cathedral Glass Facade',
      parking: '4 Dedicated Basements + Chauffeur Quarters',
      rooms: '5 Signature Suites + Cigar Lounge + Wine Cellar + Spa',
      path: 'M10,10 L390,10 L390,290 L10,290 Z M30,30 L150,30 L150,130 L30,130 Z M170,30 L280,30 L280,130 L170,130 Z M300,30 L370,30 L370,130 L300,130 Z M30,150 L200,150 L200,270 L30,270 Z M220,150 L370,150 L370,270 L220,270 Z'
    }
  };

  planTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      planTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const planKey = btn.getAttribute('data-plan');
      const data = planData[planKey];
      if (!data) return;

      const titleEl = document.getElementById('planTitle');
      const carpetEl = document.getElementById('planCarpet');
      const balconyEl = document.getElementById('planBalcony');
      const ceilingEl = document.getElementById('planCeiling');
      const parkingEl = document.getElementById('planParking');
      const roomsEl = document.getElementById('planRooms');
      const pathEl = document.getElementById('planSvgPath');

      if (titleEl) titleEl.textContent = data.title;
      if (carpetEl) carpetEl.textContent = data.carpet;
      if (balconyEl) balconyEl.textContent = data.balcony;
      if (ceilingEl) ceilingEl.textContent = data.ceiling;
      if (parkingEl) parkingEl.textContent = data.parking;
      if (roomsEl) roomsEl.textContent = data.rooms;
      if (pathEl) pathEl.setAttribute('d', data.path);
    });
  });
}

/* ===================================================================
   13. CONTACT PAGE: OFFICE SALON TABS
   =================================================================== */
function initOfficeTabs() {
  const officeBtns = document.querySelectorAll('.office-tab-btn');
  const officeDetailBoxes = document.querySelectorAll('.office-detail-box');
  if (!officeBtns.length || !officeDetailBoxes.length) return;

  officeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      officeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const city = btn.getAttribute('data-office');
      officeDetailBoxes.forEach(box => {
        if (box.getAttribute('data-office-target') === city) {
          box.style.display = 'block';
        } else {
          box.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   14. HOMEPAGE: ARCHITECTURAL MATERIALITY SHOWCASE
   =================================================================== */
function initMaterialityShowcase() {
  const swatches = document.querySelectorAll('.material-swatch-item');
  const visualImg = document.getElementById('materialImg');
  const provTitle = document.getElementById('materialProvTitle');
  const provSub = document.getElementById('materialProvSub');
  if (!swatches.length || !visualImg) return;

  const materialData = {
    '01': {
      img: 'assets/interior-kitchen.jpg',
      title: 'Carrara Calacatta Oro',
      sub: 'Tuscany, Italy • Bookmatched Slabs'
    },
    '02': {
      img: 'assets/service-design.jpg',
      title: 'Aged Architectural Bronze',
      sub: 'Bespoke Atelier Patina • Hand-Rubbed'
    },
    '03': {
      img: 'assets/interior-master.jpg',
      title: 'FSC Mature Burmese Teak',
      sub: 'Kiln-Dried • Quarter-Sawn Planks'
    },
    '04': {
      img: 'assets/about-3.jpg',
      title: 'Acoustic Triple Glazing',
      sub: 'Saint-Gobain Low-E • 12.5 ft Assemblies'
    }
  };

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const key = swatch.getAttribute('data-material');
      const data = materialData[key];
      if (!data) return;

      visualImg.style.opacity = '0.35';
      setTimeout(() => {
        visualImg.src = data.img;
        if (provTitle) provTitle.textContent = data.title;
        if (provSub) provSub.textContent = data.sub;
        visualImg.style.opacity = '1';
      }, 200);
    });
  });
}
