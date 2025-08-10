const logger = require('pino')({ level: 'trace' })

const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t))

const GITHUB_API_BASE = 'https://api.github.com'
const GH_TOKEN = process.env.GH_TOKEN || ''
let tokenWarned = false

/**
 * Fetch GitHub API (simple retry for non-success > 204)
 * @param {string} method HTTP method
 * @param {string} url Path starting with /
 * @param {BodyInit|undefined} body Optional body
 * @returns {Promise<{data:any,status:number}>}
 */
const fetchGithub = async (method, url, body) => {
  if (!GH_TOKEN && !tokenWarned) {
    tokenWarned = true
    logger.warn('GH_TOKEN missing: requests will be unauthenticated and heavily rate-limited')
  }

  let attempts = 4
  let lastStatus = 0
  while (attempts > 0) {
    const res = await fetch(`${GITHUB_API_BASE}${url}`, {
      body,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(GH_TOKEN ? { Authorization: `token ${GH_TOKEN}` } : {}),
      },
      method,
    })

    lastStatus = res.status

    // Success (<= 204) parse and return immediately
    if (lastStatus <= 204) {
      try {
        const data = await res.json()
        return { data, status: lastStatus }
      } catch {
        // No JSON body
        const payload = await res.text()
        return { data: payload ? { payload } : null, status: lastStatus }
      }
    }

    attempts--
    if (attempts === 0) {
      // Final attempt -> return whatever payload we can parse
      let data = null
      try {
        data = await res.json()
      } catch {
        const payload = await res.text()
        if (payload) data = { payload }
      }
      logger.warn({ attemptsRemaining: attempts, status: lastStatus, url, ...(!GH_TOKEN && { unauthenticated: true }) })
      return { data, status: lastStatus }
    }

    // Retry after delay
    await sleep(1000)
  }

  return { data: null, status: lastStatus }
}

// const ghlocFetch = async (owner, name) => {
// //
//   const res = await fetch(`https://ghloc.vercel.app/api/${owner}/${name}/badge`)
//   const data = await res.json()
//   return { data,  status: res.status }
// }

module.exports = {
  getCommitActivity: async (owner, name) => fetchGithub('GET', `/repos/${owner}/${name}/stats/commit_activity`),
  getContributors: async (owner, name) => fetchGithub('GET', `/repos/${owner}/${name}/stats/contributors`),
  getLanguages: async (owner, name) => fetchGithub('GET', `/repos/${owner}/${name}/languages`),
  getOrgsRepos: async (owner, page) => fetchGithub('GET', `/orgs/${owner}/repos?page=${page}&per_page=100`),
  getUserRepos: async (page) => fetchGithub('GET', `/user/repos?type=owner&page=${page}&per_page=100`),
}

// GET /orgs/{org}/repos

// let page = 0
// do {
//   page++
//   const { data: repos } = await apiGitHub.request('GET /user/repos', { type: 'owner', per_page: 100, page })
//   orgRepos = orgRepos.concat(repos)
//   nextPage = repos.length > 0
// } while(nextPage)

// coding.project = orgRepos.length
