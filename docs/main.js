// Sidebar toggle
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
  document.querySelector('.overlay').classList.toggle('show');
}
// Close sidebar on link click (mobile)
document.querySelectorAll('.sidebar a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 900) toggleSidebar();
  });
});

// Copy code button
function copyCode(btn) {
  const block = btn.closest('.code-block, .prompt-block');
  if (!block) return;
  const code = block.querySelector('code');
  const text = code ? code.textContent.trim() :
    Array.from(block.childNodes).filter(n => n !== btn).map(n => n.textContent).join('').trim();
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  });
}

// Auto-highlight active sidebar link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.sidebar a').forEach(a => {
  if (a.getAttribute('href') === currentPage) {
    a.classList.add('active');
  }
});

// Back to top button
const btn = document.createElement('button');
btn.className = 'back-to-top';
btn.innerHTML = '&#8593;';
btn.setAttribute('aria-label', 'Back to top');
btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(btn);

window.addEventListener('scroll', () => {
  btn.classList.toggle('visible', window.scrollY > 400);
});

// On-page section nav (only on unit pages with multiple h2s)
const h2s = document.querySelectorAll('.content h2');
if (h2s.length > 2) {
  const nav = document.createElement('nav');
  nav.className = 'page-nav';
  nav.innerHTML = '<div class="page-nav-title">On this page</div>';
  h2s.forEach(h2 => {
    const a = document.createElement('a');
    a.href = '#' + h2.id;
    a.textContent = h2.textContent;
    nav.appendChild(a);
  });
  document.querySelector('.main').appendChild(nav);
}

// Code block language labels
document.querySelectorAll('.codehilite').forEach(block => {
  const code = block.querySelector('code');
  if (!code) return;
  const classes = [...code.classList, ...block.classList];
  const langClass = classes.find(c => c.startsWith('language-'));
  if (langClass) {
    const lang = langClass.replace('language-', '');
    const label = document.createElement('span');
    label.className = 'code-lang';
    label.textContent = lang;
    block.style.position = 'relative';
    block.appendChild(label);
  }
});

// Scroll progress bar
const progress = document.createElement('div');
progress.className = 'scroll-progress';
document.body.appendChild(progress);

window.addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = pct + '%';
});

// Sidebar scroll persistence
(function(){
  var KEY = "noctua-sidebar-scroll";
  var s = document.querySelector(".sidebar");
  if (!s) return;
  var sv = sessionStorage.getItem(KEY);
  if (sv) s.scrollTop = +sv;
  s.addEventListener("scroll", function(){ sessionStorage.setItem(KEY, s.scrollTop); });
})();
