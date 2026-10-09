
const grupos = document.querySelectorAll('.grupo');
 
grupos.forEach((grupo) => {
  const pasta = grupo.querySelector('.pasta');
 
  pasta.addEventListener('click', () => {
    const aberta = grupo.classList.toggle('aberta');
    pasta.setAttribute('aria-expanded', aberta);
  });
});
 

const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalTitulo = document.getElementById('modal-titulo');
const modalTexto = document.getElementById('modal-texto');
 
function abrirModal(skill) {
  modalImg.src = skill.dataset.img;
  modalImg.alt = skill.dataset.titulo;
  modalTitulo.textContent = skill.dataset.titulo;
  modalTexto.textContent = skill.dataset.descricao;
  modal.classList.add('ativo');
  modal.setAttribute('aria-hidden', 'false');
}
 
function fecharModal() {
  modal.classList.remove('ativo');
  modal.setAttribute('aria-hidden', 'true');
}
 
document.querySelectorAll('.skill').forEach((skill) => {
  skill.addEventListener('click', () => abrirModal(skill));
});
 
modal.querySelectorAll('[data-fechar]').forEach((el) => {
  el.addEventListener('click', fecharModal);
});
 
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharModal();
});



const canvas = document.getElementById('fundo');
const ctx = canvas.getContext('2d');
const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
const mouse = { x: -9999, y: -9999 };
let largura, altura, particulas = [];
 
function criarParticulas() {
  const dpr = window.devicePixelRatio || 1;
  largura = window.innerWidth;
  altura = window.innerHeight;
  canvas.width = largura * dpr;
  canvas.height = altura * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
 
  const qtd = Math.min(110, Math.floor((largura * altura) / 14000));
  particulas = Array.from({ length: qtd }, () => ({
    x: Math.random() * largura,
    y: Math.random() * altura,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 2 + 1.2,
  }));
}
 
function desenhar() {
  ctx.clearRect(0, 0, largura, altura);
 

  if (mouse.x > -1000) {
    const brilho = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
    brilho.addColorStop(0, 'rgba(176, 140, 244, 0.35)');
    brilho.addColorStop(1, 'rgba(140, 80, 255, 0)');
    ctx.fillStyle = brilho;
    ctx.fillRect(mouse.x - 220, mouse.y - 220, 440, 440);
  }
 
  for (let i = 0; i < particulas.length; i++) {
    const p = particulas[i];
 
    if (!reduzirMovimento) {
    
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 140 && dist > 0) {
        const forca = (140 - dist) / 140;
        p.x += (dx / dist) * forca * 2.5;
        p.y += (dy / dist) * forca * 2.5;
      }
 
      p.x += p.vx;
      p.y += p.vy;
 
      if (p.x < 0) p.x = largura;
      if (p.x > largura) p.x = 0;
      if (p.y < 0) p.y = altura;
      if (p.y > altura) p.y = 0;
    }
 
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(70, 25, 130, 0.7)';
    ctx.fill();
 
    for (let j = i + 1; j < particulas.length; j++) {
      const q = particulas[j];
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(80, 30, 150, ${0.3 * (1 - d / 120)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
 
  requestAnimationFrame(desenhar);
}
 
window.addEventListener('pointermove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('pointerleave', () => {
  mouse.x = mouse.y = -9999;
});
window.addEventListener('resize', criarParticulas);
 
criarParticulas();
desenhar();


const cTel = document.getElementById('cTel');
const cMsg = document.getElementById('cMsg');
const cContador = document.getElementById('cContador');
const formContato = document.getElementById('formContato');
const cAviso = document.getElementById('cAviso');
 

cTel.addEventListener('input', () => {
  const d = cTel.value.replace(/\D/g, '').slice(0, 13);
  let saida = '';
  if (d.length > 0) saida = '+' + d.slice(0, 2);
  if (d.length > 2) saida += ' (' + d.slice(2, 4);
  if (d.length > 4) saida += ')' + d.slice(4, 9);
  if (d.length > 9) saida += '-' + d.slice(9);
  cTel.value = saida;
});
 
cMsg.addEventListener('input', () => {
  cContador.textContent = `${cMsg.value.length}/${cMsg.maxLength}`;
});
 
formContato.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('cNome').value.trim().split(' ')[0];
  cAviso.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada.`;
  formContato.reset();
  cContador.textContent = `0/${cMsg.maxLength}`;
});