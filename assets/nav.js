// Navbar loader (Sehr Academy)
// Place this file at /assets/nav.js
// Usage on any page:
//   <header id="site-header"></header>
//   <script src="/assets/nav.js" defer></script>

(async function(){
  const host = document.querySelector('header#site-header');
  if(!host) return;
  try{
    const res = await fetch('/partials/nav.html', {cache:'no-cache'});
    const html = await res.text();
    host.innerHTML = html;
    // Scripts inside fetched HTML don't auto-run in some browsers; re-execute inline <script> tags:
    host.querySelectorAll('script').forEach(s=>{
      const n = document.createElement('script');
      if(s.src){ n.src = s.src; } else { n.textContent = s.textContent; }
      s.replaceWith(n);
    });
    // Highlight the nav link that matches the current page
    const currentPath = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    host.querySelectorAll('.link, .submenu a').forEach(a=>{
      try{
        const linkPath = new URL(a.href).pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
        if(linkPath === currentPath){
          a.classList.add('active-page');
          a.setAttribute('aria-current', 'page');
          // If inside a submenu, also underline the parent trigger
          const parentTrigger = a.closest('.submenu')?.closest('li')?.querySelector('.trigger');
          if(parentTrigger) parentTrigger.classList.add('active-page');
        }
      }catch(e){}
    });
  }catch(e){
    host.innerHTML = '<div style="padding:10px">Navigation unavailable.</div>';
  }
})();
