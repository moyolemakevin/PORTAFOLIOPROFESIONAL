// Interactividad del portafolio
// Navegación móvil, secciones activas, reveal, formulario mailto y copiar email
(function(){
  const $ = (sel,ctx=document)=>ctx.querySelector(sel);
  const $$ = (sel,ctx=document)=>Array.from(ctx.querySelectorAll(sel));

  // Menú móvil
  const nav = $('.nav-links');
  const toggle = document.createElement('button');
  toggle.className = 'menu-toggle';
  toggle.setAttribute('aria-label','Abrir menú');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  const navbar = $('.navbar');
  navbar.insertBefore(toggle, nav);
  toggle.addEventListener('click', ()=>{
    nav.classList.toggle('open');
    toggle.classList.toggle('open');
  });
  $$('.nav-links a').forEach(a=>a.addEventListener('click', ()=>{
    nav.classList.remove('open');
    toggle.classList.remove('open');
  }));

  // Enlace activo según sección visible
  const links = $$('.nav-links a');
  const sections = links
    .map(l=>document.getElementById(l.getAttribute('href').slice(1)))
    .filter(Boolean);
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const id = e.target.id;
        links.forEach(l=>l.classList.toggle('active', l.getAttribute('href')==='#'+id));
      }
    });
  },{threshold:0.5});
  sections.forEach(s=>obs.observe(s));

  // Efecto reveal
  const revealEls = $$('[data-reveal]');
  const revealObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('reveal-visible'); revealObs.unobserve(e.target);} });
  },{threshold:0.2});
  revealEls.forEach(el=>revealObs.observe(el));

  // Año dinámico (seguro por si no existe el inline)
  const yearEl = document.getElementById('current-year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Formulario: compone mailto con asunto y cuerpo
  const form = $('.contact-form');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = form.querySelector('[name=name]').value.trim();
      const email = form.querySelector('[name=email]').value.trim();
      const message = form.querySelector('[name=message]').value.trim();
      const subject = encodeURIComponent(`Contacto Portafolio - ${name}`);
      const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`);
      window.location.href = `mailto:kevinmoyolema13@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // Copiar correo
  const copyBtn = document.getElementById('copy-email');
  const emailLink = document.getElementById('email-link');
  if(copyBtn && emailLink){
    copyBtn.addEventListener('click', async ()=>{
      try{
        await navigator.clipboard.writeText(emailLink.textContent.trim());
        copyBtn.textContent = 'Copiado';
        setTimeout(()=>copyBtn.textContent='Copiar', 1500);
      }catch(err){
        alert('No se pudo copiar el correo');
      }
    });
  }
  // Marcar elementos comunes para reveal si no tienen atributo
  $$('.timeline-item, .project-card, .stack-card, .card').forEach(el=>{
    if(!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal','');
    revealObs.observe(el);
  });
})();


