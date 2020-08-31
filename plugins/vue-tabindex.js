import Vue from 'vue'

const elemKeydown = ($elem, settings, event) => {
  const isTab = event.which === 9
  const isRevTab = isTab && event.shiftKey
  const isEnter = event.which === 13
  const isIgnore = false
  const isKeyOff = false
  if (isTab && isKeyOff) {
    return
  }

  if (isTab || (settings.enterKey && isEnter && !isIgnore)) {
    event.preventDefault()
    if (isRevTab) {
      focusPrev($elem)
    } else {
      focusNext($elem)
    }
  }
}

const focusPrev = (pool) => {
  if (pool.length < 1) {
    return
  }
  const a = document.activeElement
  if (!a || !pool.includes(a)) {
    pool[0].focus()
    return
  }
  const i = pool.indexOf(a)
  pool[i > 0 ? (i - 1) : (pool.length - 1)].focus()
}
const focusNext = (pool) => {
  const a = document.activeElement
  if (!a || !pool.includes(a)) {
    pool[0].focus()
    return
  }

  const i = pool.indexOf(a)
  pool[i < pool.length - 1 ? i + 1 : 0].focus()
}

const elementFind = (el, tagname) => {
  for (const e of el.getElementsByTagName(tagname)) {
    if (e.hasAttribute('tabindex')) {
      el.$elem.push(e)
    }
  }
}

Vue.directive('tabindex', {
  bind: () => { },
  inserted: (el, binding) => {
    el.$elem = []
    const settings = { enterKey: !!binding.modifiers.enter }
    elementFind(el, 'input')
    elementFind(el, 'button')
    elementFind(el, 'select')
    el.$elem.sort((a, b) => { return a.tabIndex > b.tabIndex ? 1 : -1 })

    for (const element of el.$elem) {
      element.addEventListener('keydown', e => elemKeydown.bind(this, el.$elem, settings, e).apply())
    }
  },
  unbind: (el) => {
    for (const element of el.$elem) {
      element.removeEventListener('keydown', e => elemKeydown.bind(this, el.$elem, {}, e).apply())
    }
  }
})
