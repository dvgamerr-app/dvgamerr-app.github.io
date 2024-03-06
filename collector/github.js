const logger = require('pino')({ level: 'trace' })

const sleep = (t) => new Promise(resolve => setTimeout(resolve, t));

// Fetches data from GitHub API using provided method (GET, POST, etc.) and URL.
const fetchGithub = async (method, url, body) => {
  let data = null
  let status = 0
  let tries = 4
  let retry = false
  do {
    const res = await fetch(`https://api.github.com${url}`, {
      method,
      body,
      headers: {
        Authorization: `token ${process.env.GH_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      }
    })
    status = res.status

    retry = status > 204 && tries > 0
    if (retry) {
      tries--
      await sleep(1000)
    } else {
      try {
        data = await res.json()
      } catch (ex) {
        const payload = await res.text()
        if (payload) data = { payload }
        logger.warn({ url, ...data, tries, status })
      }
    }
  } while (retry)
  return { data, status }
}

// const ghlocFetch = async (owner, name) => {
// //
//   const res = await fetch(`https://ghloc.vercel.app/api/${owner}/${name}/badge`)
//   const data = await res.json()
//   return { data,  status: res.status }
// }

module.exports = {
  getContributors: async (owner, name) => fetchGithub('GET',`/repos/${owner}/${name}/stats/contributors`),
  getCommitActivity: async (owner, name) => fetchGithub('GET',`/repos/${owner}/${name}/stats/commit_activity`),
  getLanguages: async (owner, name) => fetchGithub('GET',`/repos/${owner}/${name}/languages`),
  getOrgsRepos: async (owner, page) => fetchGithub('GET',`/orgs/${owner}/repos?page=${page}&per_page=100`),
  getUserRepos: async (page) => fetchGithub('GET',`/user/repos?type=owner&page=${page}&per_page=100`),
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
