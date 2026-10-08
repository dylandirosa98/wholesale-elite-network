const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const agentOptions = [...document.querySelectorAll('.agent-option input[type="checkbox"]')];
const selectedAgentCount = document.querySelector('#selected-agent-count');
const selectedAgentSummary = document.querySelector('#selected-agent-summary');
const selectedAgentPrice = document.querySelector('#selected-agent-price');
const monthlyPrices = [0, 697, 1197, 1597, 1997];

if (agentOptions.length && selectedAgentCount && selectedAgentSummary && selectedAgentPrice) {
  const updateTeamPreview = () => {
    const selected = agentOptions.filter((option) => option.checked).map((option) => option.value);
    selectedAgentCount.textContent = `${selected.length} of ${agentOptions.length} agents selected`;
    selectedAgentSummary.textContent = selected.length
      ? selected.join(' · ')
      : 'Choose your agents to see your monthly price.';
    selectedAgentPrice.textContent = selected.length
      ? `$${monthlyPrices[selected.length].toLocaleString()}/mo`
      : '—';
  };

  agentOptions.forEach((option) => option.addEventListener('change', updateTeamPreview));
  document.querySelectorAll('.offer-bottom a[data-agent]').forEach((link) => {
    link.addEventListener('click', () => {
      const option = agentOptions.find((candidate) => candidate.value === link.dataset.agent);
      if (option) option.checked = true;
      updateTeamPreview();
    });
  });
  updateTeamPreview();
}
