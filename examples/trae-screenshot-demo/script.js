document.addEventListener('DOMContentLoaded', function () {
  const productItems = document.querySelectorAll('.product-item')

  productItems.forEach((item) => {
    item.addEventListener('click', function () {
      const name = this.querySelector('.product-name')
      if (name) {
        console.log('Product clicked:', name.textContent)
      }
    })
  })

  const navLinks = document.querySelectorAll('.nav-link')
  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault()
      console.log('Nav clicked:', this.textContent)
    })
  })

  const heroTitle = document.querySelector('.hero-title')
  if (heroTitle) {
    heroTitle.style.opacity = '0'
    heroTitle.style.transform = 'translateY(30px)'
    heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease'

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroTitle.style.opacity = '1'
        heroTitle.style.transform = 'translateY(0)'
      })
    })
  }

  const heroSubtitle = document.querySelector('.hero-subtitle')
  if (heroSubtitle) {
    heroSubtitle.style.opacity = '0'
    heroSubtitle.style.transform = 'translateY(20px)'
    heroSubtitle.style.transition =
      'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s'

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroSubtitle.style.opacity = '1'
        heroSubtitle.style.transform = 'translateY(0)'
      })
    })
  }

  const productsRow = document.querySelector('.products-row')
  if (productsRow) {
    productsRow.style.opacity = '0'
    productsRow.style.transform = 'translateY(20px)'
    productsRow.style.transition =
      'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s'

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        productsRow.style.opacity = '1'
        productsRow.style.transform = 'translateY(0)'
      })
    })
  }

  const bottomContent = document.querySelector('.bottom-content')
  if (bottomContent) {
    bottomContent.style.opacity = '0'
    bottomContent.style.transform = 'translateY(20px)'
    bottomContent.style.transition =
      'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s'

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bottomContent.style.opacity = '1'
        bottomContent.style.transform = 'translateY(0)'
      })
    })
  }
})
