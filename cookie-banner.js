/* ════════════════════════════════════════════════════════════════════
   Banner de Cookies — LGPD
   Aparece na primeira visita até o usuário aceitar.
   Estado é guardado em localStorage('eip-cookies-aceitos','true').
   ════════════════════════════════════════════════════════════════════ */
(function () {
  if (localStorage.getItem('eip-cookies-aceitos') === 'true') return;

  const css = `
    .eip-cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;
      background:#0a1f3a;color:#fff;border:1px solid rgba(255,255,255,.1);
      border-radius:14px;padding:18px 22px;display:flex;align-items:center;gap:18px;
      box-shadow:0 16px 40px rgba(0,0,0,.4);font-family:'Manrope',sans-serif;
      max-width:780px;margin:0 auto;animation:eip-cookie-slide .35s ease}
    @keyframes eip-cookie-slide{from{transform:translateY(20px);opacity:0}to{transform:none;opacity:1}}
    .eip-cookie-icon{flex-shrink:0;font-size:28px}
    .eip-cookie-text{flex:1;font-size:13.5px;line-height:1.55;color:rgba(255,255,255,.85)}
    .eip-cookie-text strong{color:#fff;display:block;font-size:14.5px;margin-bottom:3px}
    .eip-cookie-text a{color:#7eb8f5;text-decoration:underline;font-weight:600}
    .eip-cookie-actions{display:flex;gap:8px;flex-shrink:0;flex-wrap:wrap}
    .eip-cookie-btn{padding:9px 18px;border-radius:8px;border:none;cursor:pointer;
      font-family:'Manrope',sans-serif;font-size:13px;font-weight:700;
      transition:background .15s,transform .1s}
    .eip-cookie-btn:active{transform:scale(.96)}
    .eip-cookie-btn.primary{background:#c8102e;color:#fff}
    .eip-cookie-btn.primary:hover{background:#a40d26}
    .eip-cookie-btn.ghost{background:transparent;color:rgba(255,255,255,.65);border:1px solid rgba(255,255,255,.2)}
    .eip-cookie-btn.ghost:hover{background:rgba(255,255,255,.07);color:#fff}
    @media(max-width:640px){
      .eip-cookie-banner{flex-direction:column;align-items:stretch;text-align:center;padding:16px}
      .eip-cookie-icon{align-self:center}
      .eip-cookie-actions{justify-content:center}
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const div = document.createElement('div');
  div.className = 'eip-cookie-banner';
  div.setAttribute('role', 'dialog');
  div.setAttribute('aria-label', 'Aviso de cookies');
  div.innerHTML = `
    <div class="eip-cookie-icon">🍪</div>
    <div class="eip-cookie-text">
      <strong>Privacidade em primeiro lugar</strong>
      Usamos apenas cookies necessários para autenticação e preferência de tema.
      Nenhum rastreamento publicitário. Saiba mais na nossa
      <a href="/privacidade.html">Política de Privacidade</a>.
    </div>
    <div class="eip-cookie-actions">
      <button class="eip-cookie-btn ghost" id="eip-cookie-recusar">Apenas essenciais</button>
      <button class="eip-cookie-btn primary" id="eip-cookie-aceitar">Entendi</button>
    </div>
  `;
  document.body.appendChild(div);

  function fechar() {
    localStorage.setItem('eip-cookies-aceitos', 'true');
    div.style.transition = 'opacity .3s, transform .3s';
    div.style.opacity = '0';
    div.style.transform = 'translateY(20px)';
    setTimeout(() => div.remove(), 300);
  }

  document.getElementById('eip-cookie-aceitar').addEventListener('click', fechar);
  document.getElementById('eip-cookie-recusar').addEventListener('click', fechar);
})();
