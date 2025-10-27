// ===== DARK MODE TOGGLE =====
const toggle = document.getElementById('themeToggle');

toggle.addEventListener('click', () => {
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    toggle.textContent = '🌙';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggle.textContent = '☀️';
  }
});

// ===== SCROLLREVEAL ANIMATIONS =====
ScrollReveal().reveal('#about', { duration: 1200, origin: 'left', distance: '50px' });
ScrollReveal().reveal('#avatar', { duration: 1200, origin: 'right', distance: '50px' });
ScrollReveal().reveal('#gradient', { duration: 1200, origin: 'left', distance: '50px' });
ScrollReveal().reveal('#resume', { duration: 1200, origin: 'bottom', distance: '50px' });
ScrollReveal().reveal('#projects', { duration: 1200, origin: 'right', distance: '50px' });




// ===== LAZY PREFETCH RESUME =====
const resumeSection = document.getElementById('resume');
const resumeURL = 'resume.pdf';
let prefetched = false;
// why are we doing this?
// isn't it super complicated? 
// Yes, but it is to show off the idea behind lazy loading and prefetching for performance optimization.
// we want to load the resume only when the user is likely to need it soon (when they scroll to that section).
// This way, we save bandwidth and improve initial load times, while still ensuring the resume is ready when needed.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !prefetched) {
      prefetched = true;
      console.log('Resume section visible — attempting prefetch...');

      // Step 1: Try link prefetch
      // works on some browsers, not all browsers support it
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resumeURL;
      link.as = 'document';
      document.head.appendChild(link);

      // Step 2: Wait 3s to see if cached, otherwise, fetch the resume manually
      const checkTimeout = setTimeout(async () => {
        try {
          const res = await fetch(resumeURL, { method: 'HEAD', cache: 'only-if-cached' });
          if (res.ok) {
            console.log('Resume was cached successfully.');
          } else {
            throw new Error('Not cached yet.');
          }
        } catch {
          console.log('⚡ Not cached — fetching directly...');
          // Prefetch manually
          fetch(resumeURL, { cache: 'force-cache' })
            .then(() => console.log('Resume prefetched manually.'))
            .catch(() => console.warn('Manual prefetch failed.'));
        } finally {
          clearTimeout(checkTimeout);
        }
      }, 3000);
    }
  });
}, { threshold: 0.3 });

observer.observe(resumeSection);
