document.addEventListener('DOMContentLoaded', () => {

  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const triggers = document.querySelectorAll('.nav-trigger');
  const desktopQuery = window.matchMedia('(min-width: 1024px)');


  if (!navToggle || !primaryNav) return;

  // Open or close one dropdown.
  function setExpanded(trigger, open) {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;

    trigger.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  }

  function closeAllMenus(except) {
    triggers.forEach(trigger => {
      if (trigger !== except) setExpanded(trigger, false);
    });
  }

  // Open or close the whole mobile menu.
  function setMobileMenu(open) {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute(
      'aria-label',
      open ? 'Close navigation menu' : 'Open navigation menu'
    );
    primaryNav.hidden = !open;

    if (!open) closeAllMenus();
  }

  // Hamburger 
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setMobileMenu(!isOpen);
  });

  // Dropdown buttons 
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      closeAllMenus(trigger);          // only one dropdown open at a time
      setExpanded(trigger, !isOpen);
    });
  });

 
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;

    const openTrigger = [...triggers].find(
      trigger => trigger.getAttribute('aria-expanded') === 'true'
    );

    if (openTrigger) {
      setExpanded(openTrigger, false);
      openTrigger.focus();
    } else if (!desktopQuery.matches &&
               navToggle.getAttribute('aria-expanded') === 'true') {
      setMobileMenu(false);
      navToggle.focus();
    }
  });

  
  document.addEventListener('click', event => {
    if (!primaryNav.contains(event.target) && !navToggle.contains(event.target)) {
      closeAllMenus();
    }
  });


  function syncToViewport() {
    closeAllMenus();
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
    primaryNav.hidden = !desktopQuery.matches;   // always visible on desktop
  }

  desktopQuery.addEventListener('change', syncToViewport);
  syncToViewport();

});