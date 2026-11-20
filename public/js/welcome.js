document.addEventListener('DOMContentLoaded', () => {
  const slides = [
    {
      location: 'Dolomites, Italy',
      title: 'Take the scenic route',
      subtitle: 'Cabin mornings, mountain air',
      image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=88',
      alt: 'Mountain lake surrounded by alpine forest'
    },
    {
      location: 'Ubud, Bali',
      title: 'Let the day unfold',
      subtitle: 'A slower kind of morning',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=88',
      alt: 'Tropical rooftops and greenery in Bali'
    },
    {
      location: 'Algarve, Portugal',
      title: 'Follow the coastline',
      subtitle: 'Salt air, nowhere to rush',
      image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1400&q=88',
      alt: 'Quiet coastal home overlooking the sea'
    }
  ];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const image = document.querySelector('[data-destination-image]');
  const location = document.querySelector('[data-destination-location]');
  const note = document.querySelector('[data-destination-note]');
  const title = document.querySelector('[data-destination-title]');
  const subtitle = document.querySelector('[data-destination-subtitle]');
  const count = document.querySelector('[data-destination-count]');
  const progress = document.querySelector('[data-destination-progress]');
  const dots = [...document.querySelectorAll('[data-destination-dot]')];
  const nextButton = document.querySelector('.destination-next');
  const visual = document.querySelector('.welcome-visual');
  let activeSlide = 0;
  let progressTween;
  let paused = false;

  const setProgress = () => {
    if (!window.gsap || reducedMotion || !progress || paused) return;
    progressTween?.kill();
    gsap.set(progress, { scaleX: 0 });
    progressTween = gsap.to(progress, {
      scaleX: 1,
      duration: 7,
      ease: 'none',
      onComplete: () => showSlide((activeSlide + 1) % slides.length)
    });
  };

  const showSlide = (index) => {
    activeSlide = (index + slides.length) % slides.length;
    const slide = slides[activeSlide];
    const swapImage = () => {
      image.src = slide.image;
      image.alt = slide.alt;
      if (window.gsap && !reducedMotion) {
        gsap.fromTo(image, { opacity: 0, scale: 1.045 }, { opacity: 1, scale: 1, duration: .65, ease: 'power2.out' });
      } else {
        image.style.opacity = '1';
        image.style.transform = '';
      }
    };

    if (activeSlide === 0) {
      swapImage();
    } else {
      const preload = new Image();
      preload.onload = swapImage;
      preload.onerror = swapImage;
      preload.src = slide.image;
      if (window.gsap && !reducedMotion) gsap.to(image, { opacity: 0, duration: .2, ease: 'power1.out' });
    }

    location.replaceChildren(document.createTextNode(slide.location + ' '));
    const locationIcon = document.createElement('i');
    locationIcon.className = 'fa-solid fa-location-dot';
    location.append(locationIcon);
    note.textContent = `FIELD NOTE  0${activeSlide + 1}`;
    title.textContent = slide.title;
    subtitle.textContent = slide.subtitle;
    count.textContent = `0${activeSlide + 1}`;
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === activeSlide);
      dot.setAttribute('aria-pressed', String(dotIndex === activeSlide));
    });
    setProgress();
  };

  dots.forEach((dot) => dot.addEventListener('click', () => showSlide(Number(dot.dataset.destinationDot))));
  nextButton?.addEventListener('click', () => showSlide(activeSlide + 1));
  visual?.addEventListener('mouseenter', () => { paused = true; progressTween?.pause(); });
  visual?.addEventListener('mouseleave', () => { paused = false; progressTween?.resume(); });
  visual?.addEventListener('focusin', () => { paused = true; progressTween?.pause(); });
  visual?.addEventListener('focusout', (event) => {
    if (!visual.contains(event.relatedTarget)) { paused = false; progressTween?.resume(); }
  });

  if (window.gsap && !reducedMotion) {
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: setProgress });
    intro
      .from('.welcome-brand', { opacity: 0, y: -12, duration: .55 })
      .from('.welcome-nav__links > *', { opacity: 0, y: -10, duration: .4, stagger: .08 }, '-=.35')
      .from('.welcome-eyebrow', { opacity: 0, x: -18, duration: .55 }, '-=.1')
      .from('.welcome-title span', { opacity: 0, y: 42, rotateX: -8, duration: .78, stagger: .13, transformOrigin: 'left bottom' }, '-=.25')
      .from('.welcome-description', { opacity: 0, y: 18, duration: .6 }, '-=.36')
      .from('.welcome-actions > *', { opacity: 0, y: 14, duration: .48, stagger: .1 }, '-=.28')
      .from('.welcome-proof', { opacity: 0, y: 12, duration: .5 }, '-=.22')
      .from('.hero-photo', { opacity: 0, y: 30, scale: .94, clipPath: 'inset(10% 10% 12% 10% round 48% 48% 28px 28px)', duration: 1.05, ease: 'power2.out' }, '-=1.05')
      .from('.stay-note, .compass-stamp, .destination-controls', { opacity: 0, scale: .86, y: 12, duration: .5, stagger: .12, ease: 'back.out(1.4)' }, '-=.48')
      .from('.welcome-footer', { opacity: 0, y: 10, duration: .45 }, '-=.2');

    gsap.to('.stay-note--top', { y: -7, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.stay-note--bottom', { y: 7, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: .4 });
    gsap.to('.compass-stamp', { rotation: 5, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    const photo = document.querySelector('.hero-photo');
    if (visual && photo && !window.matchMedia('(pointer: coarse)').matches) {
      visual.addEventListener('pointermove', (event) => {
        const bounds = visual.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        gsap.to(photo, { x: x * 9, y: y * 7, duration: .55, ease: 'power2.out', overwrite: 'auto' });
      });
      visual.addEventListener('pointerleave', () => {
        gsap.to(photo, { x: 0, y: 0, duration: .7, ease: 'power2.out', overwrite: 'auto' });
      });
    }
  }

  setProgress();
});
