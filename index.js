const { Octokit } = require("@octokit/core")
const debuger = require('@touno-io/debuger')

const { readdir, readFile, writeFile } = require('fs/promises')
const { existsSync } = require('fs')
const { extname, join } = require('path');
const process = require("process");

const updateJSONfile = async (file, updated) => {
  const dirData = './docs/data'
  if (existsSync(join(dirData, file))) {
    const rawData = await readFile(join(dirData, file))

    const data = JSON.parse(rawData.toString())
    for (const key in updated) {
      if (typeof updated[key] != 'object') continue
      data[key] = Object.assign(data[key], updated[key])
    }

    await writeFile(join(dirData, file), JSON.stringify(data, null, 2))
  } else {
    await writeFile(join(dirData, file), JSON.stringify(updated), null, 2)
  }
}

const logger = debuger('GEN')
// const apiGitHub = Octokit.defaults()

const apiGitHub = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  baseUrl: "https://api.github.com",
  Accept: "application/vnd.github.v3+json",
})

const markdownToJson = async (filename) => {
  const dirData = './docs'
  let workData = {}
  const files = await readdir(dirData)
  for await (const file of files) {
    if (extname(file) !== '.md') continue
    const data = await readFile(join(dirData, file))
    workData[file] = data.toString()
  }

  await writeFile(join(dirData, 'data', filename), JSON.stringify(workData, null, 2))
}

const fetchContributors = r => apiGitHub.request('GET /repos/{owner}/{repos}/stats/contributors', { owner: r.owner.login, repos: r.name })

const getGithubStats = async () => {
  if (!process.env.GITHUB_TOKEN) return

  logger.info('Query Repositories')
  const coding = {
    // Total Repos
    project: 0,
    // Public Repos
    opensource: 0,
    // https://api.github.com/repos/dvgamerr/dvgamerr/languages
    languages: 0,
    // https://api.github.com/repos/dvgamerr/dvgamerr/stats/contributors
    loc: 0,
    commits: 0
  }

  let orgRepos = []
  let nextPage = false
  logger.log(' - GET /user/orgs')
  const { data: orgs } = await apiGitHub.request('GET /user/orgs')
  for await (const org of orgs) {
    let page = 0
    logger.log(` - GET /orgs/${org.login}/repos`)
    do {
      page++
      const { data: repos } = await apiGitHub.request('GET /orgs/{org}/repos', { org: org.login, per_page: 100, page })
      orgRepos = orgRepos.concat(repos)
      nextPage = repos.length > 0
    } while(nextPage)
  }

  logger.log(` - GET /user/repos`)
  let page = 0
  do {
    page++
    const { data: repos } = await apiGitHub.request('GET /user/repos', { type: 'owner', per_page: 100, page })
    orgRepos = orgRepos.concat(repos)
    nextPage = repos.length > 0
  } while(nextPage)

  coding.project = orgRepos.length

  logger.log('Contributors')
  const savedRepos = {}
  for await (const repo of orgRepos) {
    if (!repo.private) coding.opensource++
    savedRepos[repo.full_name] = { commits: 0, added: 0, deleted: 0 }


    let tries = 4
    let contri = await fetchContributors(repo)
    while (contri.status === 202 && tries > 0) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      contri = await fetchContributors(repo)
      tries--
    }

    if (contri.status === 200) {
      for (const c of contri.data) {
        if (c.author.login !== 'dvgamerr') continue
        savedRepos[repo.full_name].commits += c.total
        savedRepos[repo.full_name].added += c.weeks.reduce((sum, { a }) => sum + a, 0)
        savedRepos[repo.full_name].deleted += c.weeks.reduce((sum, { d }) => sum + d, 0)
      }

      coding.commits += savedRepos[repo.full_name].commits
      coding.loc += savedRepos[repo.full_name].added + savedRepos[repo.full_name].deleted
      logger.log(` - ${repo.full_name} (${repo.default_branch}) commits: ${savedRepos[repo.full_name].commits}`)
    } else {
      logger.log(` - ${repo.full_name} (${repo.default_branch}) commits: N/A (status:${contri.status})`)
    }

    // const fetchFrequency = () => apiGitHub.request('GET /repos/{owner}/{repos}/stats/code_frequency', { owner: repo.owner.login, repos: repo.name })

    // let tries = 4
    // let frequency = await fetchFrequency()
    // while (frequency.status === 202 && tries > 0) {
    //   await new Promise(resolve => setTimeout(resolve, 5000));
    //   frequency = await fetchFrequency()
    //   tries--
    // }

    // if (frequency.status === 200) {
    //   savedRepos[repo.full_name].loc = frequency.data.reduce((sum, [ tstamp, inserted, deleted ]) => sum + inserted + deleted, 0)
    //   coding.contributions += savedRepos[repo.full_name].loc
    //   logger.log(`   - loc: ${savedRepos[repo.full_name].loc}`)
    // } else {
    //   logger.log(`   - loc: N/A (status:${frequency.status})`)
    // }
  }
  // savedRepos
  await updateJSONfile('repos.json', savedRepos)
  await updateJSONfile('resume.json', { coding })
}

Promise.all([
  markdownToJson('work.json'),
  getGithubStats()
]).then(() => {
  logger.log('Complated')
}).catch(ex => {
  logger.error(ex)
})

