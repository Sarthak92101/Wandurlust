(() => {
  'use strict'

  const themeButton = document.querySelector('[data-theme-toggle]')
  const updateThemeButton = () => {
    if (!themeButton) return
    const dark = document.documentElement.dataset.theme === 'dark'
    themeButton.innerHTML = `<i class="fa-solid fa-${dark ? 'sun' : 'moon'}" aria-hidden="true"></i>`
    themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`)
    themeButton.title = `Switch to ${dark ? 'light' : 'dark'} theme`
  }

  updateThemeButton()
  themeButton?.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme
    try { localStorage.setItem('wanderlust-theme', nextTheme) } catch (_) {}
    updateThemeButton()
  })

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()
