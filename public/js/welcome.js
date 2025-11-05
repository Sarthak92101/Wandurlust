// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  
  // GSAP Timeline for welcome animation
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Set initial states
  gsap.set(".welcome-content", { opacity: 1 });
  gsap.set(".compass-icon", { rotation: -180, scale: 0 });
  gsap.set(".word", { opacity: 0, y: 50 });
  gsap.set(".welcome-subtitle", { opacity: 0, y: 30 });
  gsap.set(".enter-btn", { opacity: 0, y: 30 });
  gsap.set(".particle", { opacity: 0, scale: 0 });

  // Main animation timeline
  tl
    // Compass rotation and scale
    .to(".compass-icon", {
      rotation: 0,
      scale: 1,
      duration: 1.5,
      ease: "back.out(1.7)"
    })
    
    // Words animation - stagger effect
    .to(".word", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    }, "-=0.5")
    
    // Subtitle fade in
    .to(".welcome-subtitle", {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, "-=0.3")
    
    // Particles animation
    .to(".particle", {
      opacity: 0.6,
      scale: 1,
      duration: 0.5,
      stagger: 0.1,
      repeat: -1,
      yoyo: true
    }, "-=0.5")
    
    // Enter button fade in
    .to(".enter-btn", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.5");

  // Continuous compass rotation
  gsap.to(".compass-icon", {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: "none",
    delay: 2
  });

  // Floating particles animation - position randomly
  const particles = document.querySelectorAll('.particle');
  particles.forEach((particle, index) => {
    // Set random initial positions
    const randomStartX = (Math.random() - 0.5) * window.innerWidth;
    const randomStartY = (Math.random() - 0.5) * window.innerHeight;
    gsap.set(particle, { x: randomStartX, y: randomStartY });
    
    const randomX = (Math.random() - 0.5) * 300;
    const randomY = (Math.random() - 0.5) * 300;
    const randomDuration = 4 + Math.random() * 3;
    const randomDelay = Math.random() * 2;

    gsap.to(particle, {
      x: `+=${randomX}`,
      y: `+=${randomY}`,
      duration: randomDuration,
      delay: randomDelay,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });

  // Background shapes animation (enhanced)
  gsap.to(".shape-1", {
    x: 100,
    y: -100,
    scale: 1.2,
    duration: 20,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(".shape-2", {
    x: -80,
    y: 80,
    scale: 1.1,
    duration: 15,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(".shape-3", {
    x: 60,
    y: -60,
    scale: 0.9,
    duration: 25,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(".shape-4", {
    x: -100,
    y: 100,
    scale: 1.15,
    duration: 18,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // Button hover animation
  const enterBtn = document.querySelector('.enter-btn');
  enterBtn.addEventListener('mouseenter', function() {
    gsap.to(enterBtn, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });
  });

  enterBtn.addEventListener('mouseleave', function() {
    gsap.to(enterBtn, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  });

  // Add click animation
  enterBtn.addEventListener('click', function(e) {
    gsap.to(enterBtn, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
  });

  // Text glow effect
  gsap.to(".welcome-title .word", {
    textShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: 0.3,
    delay: 3
  });

});

