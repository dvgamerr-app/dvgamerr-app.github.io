import { LocalScheme } from '~auth/runtime'

const ssoUrl = 'https://sso.touno.io'

export default class SSOScheme extends LocalScheme {
  async login (...args) {
    // console.log('options:', this.options)
    // console.log('args:', args)
    const params = new URLSearchParams({
      applicationId: this.options.appId,
      redirectUrl: this.options.redirectUrl,
      once: this.onceGenerate(),
    })

    // this.$auth.ctx.redirect(`${ssoUrl}/sign-in?${params.toString()}`)
    window.location.href = `${ssoUrl}/sign-in?${params.toString()}`
  }
  // Override `fetchUser` method of `local` scheme
  async fetchUser (endpoint) {
    const fetchToken = this.check()
    const hashToken = this.$auth.ctx.route.hash.replace(/^#/, '')
    if (!fetchToken.valid) {
      if (!hashToken) {
        return
      }

      const param = new URLSearchParams(hashToken)
      if (param.get('error')) {
        this.$auth.callOnError(param.get('error'), { method: 'fetchToken' })
        return
      }
      // console.log('set-token:', !!hashToken)
      this.setHashToken(hashToken)
      return
    }

    try {
      const { data: res } = await this.$auth.requestWith(this.name, endpoint, { url: `${this.options.baseUrl}/v1/auth/account` })
      this.$auth.setUser({
        ...res,
        fullName: res.name,
        roles: [ res.level ]
      })
      // console.log('res:', res)
      // console.log('auth:', this.$auth)
    } catch (ex) {
      await this.$auth.setUserToken(null, null)
      if (ex.response) {
        const { method, path, headers } = ex.request._options
        console.error('ex.req::', { method, path, headers })
        console.error('ex.res::', ex.response.data)
        this.$auth.callOnError(ex.response.data.error, { method: 'fetchUser' })
      } else if (ex.request) {
        const { method, path, headers } = ex.request._options
        console.error('ex.req::', { method, path, headers })
        this.$auth.callOnError({ method, path, headers }, { method: 'fetchUser' })
      } else {
        console.error('ex.unknow::', ex)
        this.$auth.callOnError(ex, { method: 'fetchUser' })
      }
    }
  }

  async setHashToken (hashToken) {
    const param = new URLSearchParams(hashToken)
    if (param.get('error')) {
      this.$auth.callOnError(param.get('error'), { method: 'fetchToken' })
      return
    }

    await this.$auth.setUserToken(param.get('token'), null)
    window.location.href = `${window.location.origin}${this.$auth.options.redirect.home}`
    // this.$auth.ctx.redirect(`${window.location.origin}${this.$auth.options.redirect.home}`)
  }

  onceGenerate () {
    return Buffer.from(new Date().toISOString(), 'utf8').toString('base64')
  }
}
