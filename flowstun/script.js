(function () {
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const progressBar = document.getElementById('progressBar');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 });
  sections.forEach(section => observer.observe(section));

  const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.tab;
      tabButtons.forEach(btn => {
        const active = btn === button;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      tabPanels.forEach(panel => {
        const active = panel.dataset.panel === id;
        panel.classList.toggle('active', active);
        panel.hidden = !active;
      });
    });
  });

  const riskButtons = Array.from(document.querySelectorAll('.risk-filter'));
  const risks = Array.from(document.querySelectorAll('.risk-card'));
  riskButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.risk;
      riskButtons.forEach(btn => btn.classList.toggle('active', btn === button));
      risks.forEach(card => {
        const show = filter === 'all' || card.dataset.risk === filter;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  const budgetButtons = Array.from(document.querySelectorAll('.budget-button'));
  const budgetTitle = document.getElementById('budgetTitle');
  const budgetList = document.getElementById('budgetList');
  const budgetDonut = document.getElementById('budgetDonut');
  // v3 budget — $440k total, weighted to welfare validation.
  const budgetData = {
    category: {
      title: 'Budget summary — by category',
      // 150 / 90 / 85 / 45 / 70 of 440
      gradient: 'conic-gradient(#0b6f9e 0 34.1%, var(--teal-600) 34.1% 54.6%, var(--orange-500) 54.6% 73.9%, var(--navy-800) 73.9% 84.1%, #8da0aa 84.1% 100%)',
      rows: [
        ['blue', 'Fish-welfare lab subcontract — $150k'],
        ['teal', 'Engineering lead (full-time) — $90k'],
        ['orange', 'Prototype + marine fabrication — $85k'],
        ['navy', 'Power / test equipment — $45k'],
        ['gray', 'Compliance, logistics, contingency — $70k']
      ]
    },
    phase: {
      title: 'Budget summary — by phase',
      // 95 / 120 / 140 / 85 of 440
      gradient: 'conic-gradient(var(--teal-600) 0 21.6%, var(--orange-500) 21.6% 48.9%, #0b6f9e 48.9% 80.7%, var(--navy-800) 80.7% 100%)',
      rows: [
        ['teal', 'Phase 1: non-live engineering — $95k'],
        ['orange', 'Phase 2: welfare protocol + reduction — $120k'],
        ['blue', 'Phase 3: controlled live validation — $140k'],
        ['navy', 'Phase 4: vessel-realistic pilot design — $85k']
      ]
    }
  };
  budgetButtons.forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.budget;
      const data = budgetData[key];
      budgetButtons.forEach(btn => btn.classList.toggle('active', btn === button));
      budgetTitle.textContent = data.title;
      budgetDonut.style.background = data.gradient;
      budgetList.innerHTML = data.rows.map(([color, text]) => `<li><span class="swatch ${color}"></span>${text}</li>`).join('');
    });
  });

  const copyButton = document.getElementById('copyPitch');
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const target = document.getElementById(copyButton.dataset.copyTarget);
      const text = target ? target.textContent.trim() : '';
      try {
        await navigator.clipboard.writeText(text);
        copyButton.textContent = 'Copied';
      } catch (error) {
        copyButton.textContent = 'Copy unavailable';
      }
      window.setTimeout(() => { copyButton.textContent = 'Copy reviewer summary'; }, 1800);
    });
  }
})();
