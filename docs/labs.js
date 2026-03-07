/**
 * AgentForge Lab Guide — Shared Interactive System
 * Handles: quiz evaluation, step tracking, progress bars, code copy, sidebar
 * Each lab page calls: initLabPage('unique-lab-id')
 */

let _unitId = '';
let _progress = {};

function initLabPage(unitId) {
  _unitId = unitId;
  _progress = JSON.parse(localStorage.getItem(_unitId) || '{}');

  // Restore step checkboxes
  document.querySelectorAll('.lab-step').forEach(s => {
    const id = s.id.replace('step-', '');
    if (_progress['step-' + id]) {
      s.classList.add('step-done');
      const cb = s.querySelector('input[type=checkbox]');
      if (cb) cb.checked = true;
    }
  });

  // Restore quiz states (lock answered questions)
  document.querySelectorAll('[data-qid]').forEach(q => {
    const qid = q.dataset.qid;
    const saved = _progress['q-' + qid];
    if (saved) {
      q.querySelectorAll('input[type=radio]').forEach(i => i.disabled = true);
      const btn = q.querySelector('.quiz-check-btn');
      if (btn) btn.disabled = true;
      // Re-show stored feedback
      const fb = q.querySelector('.quiz-feedback');
      if (fb && saved.html) {
        fb.innerHTML = saved.html;
        fb.className = 'quiz-feedback show ' + saved.cls;
      }
      // Re-color labels
      const correct = q.dataset.answer;
      q.querySelectorAll('.quiz-opts label').forEach(label => {
        const input = label.querySelector('input');
        if (!input) return;
        if (input.value === correct) label.classList.add('opt-correct');
        if (input.value === saved.selected && input.value !== correct) label.classList.add('opt-wrong');
      });
    }
  });

  updateProgress();
}

function toggleStep(id, checked) {
  _progress['step-' + id] = checked;
  _save();
  const el = document.getElementById('step-' + id);
  if (el) el.classList.toggle('step-done', checked);
  updateProgress();
}

function checkQuestion(qid) {
  const q = document.querySelector('[data-qid="' + qid + '"]');
  if (!q) return;

  const selected = q.querySelector('input[type=radio]:checked');
  const fb = q.querySelector('.quiz-feedback');
  const btn = q.querySelector('.quiz-check-btn');

  if (!selected) {
    fb.textContent = 'Please select an answer before checking.';
    fb.className = 'quiz-feedback show fb-warn';
    return;
  }

  const correct = q.dataset.answer;
  const explain = q.dataset.explain || '';

  // Color labels
  q.querySelectorAll('.quiz-opts label').forEach(label => {
    const input = label.querySelector('input');
    if (!input) return;
    if (input.value === correct) label.classList.add('opt-correct');
    if (input === selected && input.value !== correct) label.classList.add('opt-wrong');
  });

  let html, cls;
  if (selected.value === correct) {
    html = '<strong>Correct!</strong> ' + explain;
    cls = 'fb-correct';
  } else {
    html = '<strong>Not quite.</strong> ' + explain;
    cls = 'fb-wrong';
  }
  fb.innerHTML = html;
  fb.className = 'quiz-feedback show ' + cls;

  // Lock question
  q.querySelectorAll('input[type=radio]').forEach(i => i.disabled = true);
  if (btn) btn.disabled = true;

  // Save
  _progress['q-' + qid] = { html, cls, selected: selected.value };
  _save();
  updateProgress();
}

function updateProgress() {
  const steps = document.querySelectorAll('.lab-step');
  let done = 0;
  steps.forEach(s => {
    const id = s.id.replace('step-', '');
    if (_progress['step-' + id]) done++;
  });
  const total = steps.length;
  const pct = total > 0 ? Math.round(done / total * 100) : 0;

  const fill = document.getElementById('prog-fill');
  const text = document.getElementById('prog-text');
  if (fill) fill.style.width = pct + '%';
  if (text) text.textContent = done + ' / ' + total + ' steps complete (' + pct + '%)';
}

function copyCode(btn) {
  const block = btn.closest('.code-block');
  const code = block ? block.querySelector('code') : null;
  if (!code) return;
  navigator.clipboard.writeText(code.textContent.trim()).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  }).catch(() => {
    // fallback: select text
    const range = document.createRange();
    range.selectNode(code);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  });
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.overlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('show');
}

function _save() {
  localStorage.setItem(_unitId, JSON.stringify(_progress));
}

// Build standard sidebar HTML and inject it
function buildSidebar(activeLink) {
  const nav = [
    ['nav-section', 'Overview'],
    ['link', 'index.html', 'Course Overview'],
    ['link', 'assessment.html', 'Design Rationale'],
    ['nav-section', 'Semester 1: Foundations'],
    ['link', 'semester1.html', 'Semester 1 Overview'],
    ['sublink', 's1-unit1.html', 'Unit 1: CCT Foundations'],
    ['sublink', 'lab-s1-unit1.html', '&#x1f9ea; Lab: Unit 1'],
    ['sublink', 's1-unit2.html', 'Unit 2: Context Engineering'],
    ['sublink', 'lab-s1-unit2.html', '&#x1f9ea; Lab: Unit 2'],
    ['sublink', 's1-unit3.html', 'Unit 3: Ethical AI'],
    ['sublink', 'lab-s1-unit3.html', '&#x1f9ea; Lab: Unit 3'],
    ['sublink', 's1-unit4.html', 'Unit 4: Rapid Prototyping'],
    ['sublink', 'lab-s1-unit4.html', '&#x1f9ea; Lab: Unit 4'],
    ['nav-section', 'Semester 2: Advanced'],
    ['link', 'semester2.html', 'Semester 2 Overview'],
    ['sublink', 's2-unit5.html', 'Unit 5: Multi-Agent'],
    ['sublink', 'lab-s2-unit5.html', '&#x1f9ea; Lab: Unit 5'],
    ['sublink', 's2-unit6.html', 'Unit 6: Attack vs Defend'],
    ['sublink', 'lab-s2-unit6.html', '&#x1f9ea; Lab: Unit 6'],
    ['sublink', 's2-unit7.html', 'Unit 7: Production Security'],
    ['sublink', 'lab-s2-unit7.html', '&#x1f9ea; Lab: Unit 7'],
    ['sublink', 's2-unit8.html', 'Unit 8: Capstone'],
    ['sublink', 'lab-s2-unit8.html', '&#x1f9ea; Lab: Unit 8'],
    ['nav-section', 'Resources'],
    ['link', 'frameworks.html', 'Frameworks &amp; Protocols'],
    ['link', 'lab-setup.html', 'Lab Setup Guide'],
    ['link', 'reading.html', 'Reading List'],
  ];

  let html = '<div class="sidebar-header"><h1>AgentForge</h1><p>AI Security Engineering</p></div>\n';
  nav.forEach(item => {
    if (item[0] === 'nav-section') {
      html += '<div class="nav-section">' + item[1] + '</div>\n';
    } else {
      const href = item[1];
      const label = item[2];
      const cls = (item[0] === 'sublink' ? 'sub' : '') + (href === activeLink ? ' active' : '');
      html += '<a href="' + href + '"' + (cls ? ' class="' + cls.trim() + '"' : '') + '>' + label + '</a>\n';
    }
  });
  return html;
}
