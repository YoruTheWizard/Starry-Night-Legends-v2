const head = document.head || document.getElementsByTagName('head');
const btn = document.querySelector('.dark-mode-btn');
const icon = btn.querySelector('.dmb-icon');
const style = document.createElement('link');
style.setAttribute('id', 'dark-mode-style');
style.setAttribute('rel', 'stylesheet');
style.setAttribute('href', '/styles/dark-mode.css');

btn.addEventListener('click', () => {
  if (!localStorage.getItem('isDarkMode') || localStorage.getItem('isDarkMode') === 'false') {
    head.appendChild(style);
    icon.setAttribute('name', 'sunny-outline');
    localStorage.setItem('isDarkMode', 'true');
  } else {
    head.removeChild(document.getElementById('dark-mode-style'));
    icon.setAttribute('name', 'moon-outline');
    localStorage.setItem('isDarkMode', 'false');
  }
});

const setDarkMode = () => {
  if (localStorage.getItem('isDarkMode') === 'true') {
    head.appendChild(style);
    icon.setAttribute('name', 'sunny-outline');
  }
}; setDarkMode();