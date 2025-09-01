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
  }catch(e){
    host.innerHTML = '<div style="padding:10px">Navigation unavailable.</div>';
  }
})();
