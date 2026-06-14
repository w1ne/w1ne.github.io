// Local-only click-to-edit. Activates only on localhost; inert when deployed.
(function () {
  const local = ['localhost', '127.0.0.1', ''].includes(location.hostname);
  if (!local) return;

  const style = document.createElement('style');
  style.textContent = `
    .ek-bar{position:fixed;z-index:99999;right:18px;bottom:18px;display:flex;gap:8px;align-items:center;
      background:#0c2a3a;color:#eaf6fb;padding:10px 12px;border-radius:12px;
      font:600 14px system-ui,sans-serif;box-shadow:0 12px 34px rgba(0,0,0,.45)}
    .ek-bar button{font:inherit;cursor:pointer;border:0;border-radius:8px;padding:8px 12px}
    .ek-bar .ek-edit{background:#18bac7;color:#04222b}
    .ek-bar .ek-save{background:#0bd6b0;color:#04222b}
    .ek-bar .ek-save[disabled]{opacity:.4;cursor:default}
    .ek-bar .ek-status{font-weight:500;opacity:.85;min-width:74px;text-align:center}
    [data-ek].ek-on{outline:2px dashed rgba(24,186,199,.6);outline-offset:3px;border-radius:3px;cursor:text}
    [data-ek].ek-on:hover{background:rgba(24,186,199,.10)}
    [data-ek].ek-on:focus{outline:2px solid #0bd6b0;background:rgba(11,214,176,.10)}
  `;
  document.head.appendChild(style);

  const bar = document.createElement('div');
  bar.className = 'ek-bar';
  bar.innerHTML = `<button class="ek-edit" type="button">&#9998; Edit text</button>
    <button class="ek-save" type="button" disabled>Save</button>
    <span class="ek-status"></span>`;
  document.body.appendChild(bar);

  const editBtn = bar.querySelector('.ek-edit');
  const saveBtn = bar.querySelector('.ek-save');
  const status = bar.querySelector('.ek-status');
  const els = () => Array.from(document.querySelectorAll('[data-ek]'));
  let on = false, dirty = false;

  function setMode(v) {
    on = v;
    els().forEach((e) => {
      e.contentEditable = v ? 'true' : 'false';
      e.classList.toggle('ek-on', v);
      if (v && !e.dataset.ekBound) {
        e.addEventListener('input', () => { dirty = true; saveBtn.disabled = false; status.textContent = 'unsaved'; });
        e.dataset.ekBound = '1';
      }
    });
    editBtn.innerHTML = v ? '&#10003; Done' : '&#9998; Edit text';
    saveBtn.disabled = !v || !dirty;
    status.textContent = v ? 'click any text' : '';
  }

  editBtn.onclick = () => setMode(!on);

  saveBtn.onclick = async () => {
    const data = {};
    els().forEach((e) => { data[e.getAttribute('data-ek')] = e.innerHTML; });
    status.textContent = 'saving…'; saveBtn.disabled = true;
    try {
      const r = await fetch('/save', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error(await r.text());
      dirty = false; status.textContent = '✓ saved';
    } catch (err) {
      status.textContent = 'save failed'; saveBtn.disabled = false; console.error(err);
    }
  };
})();
