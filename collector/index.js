import arg from 'arg'

const args = arg({ '--file': String, '--github': Boolean, '--wakatime': Boolean }, { permissive: true })

if (args['--wakatime']) await import('./waka-insights.js')
if (args['--github']) await import('./github-repos.js')
