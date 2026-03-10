// Footer loader (Sehr Academy)
// Place this file at /assets/footer.js
// Usage on any page:
//   <div id="site-footer"></div>
//   <script src="/assets/footer.js" defer></script>

(async function(){
  const host = document.getElementById('site-footer');
  if(!host) return;
  try{
    const res = await fetch('/partials/footer.html', {cache:'no-cache'});
    const html = await res.text();
    host.outerHTML = html;
  }catch(e){
    if(host){
      host.innerHTML = `<footer style="border-top:1px solid #e5e7eb;padding:16px 20px;text-align:center;font-size:13px;color:#6b7280;font-family:Montserrat,sans-serif;">
        © 2026 Sehr Academy &nbsp;·&nbsp;
        <a href="https://wa.me/919539409586" target="_blank" rel="noopener noreferrer" style="color:inherit;">WhatsApp: +91 95394 09586</a>
      </footer>`;
    }
  }
})();
