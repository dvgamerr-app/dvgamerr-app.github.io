const { Octokit } = require("@octokit/core");

const { readdir, readFile, writeFile } = require('fs/promises')
const { extname, join } = require('path');
const process = require("process");

// const apiGitHub = Octokit.defaults()

const apiGitHub = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  baseUrl: "https://api.github.com",
  Accept: "application/vnd.github.v3+json",
})

const markdownToJson = async (mdPath, filename) => {
  let workfile = {}
  const files = await readdir(mdPath)
  for await (const file of files) {
    if (extname(file) !== '.md') continue
    const data = await readFile(join(mdPath, file))
    workfile[file] = data.toString()
  }
  await writeFile(join(mdPath, filename), JSON.stringify(workfile))
}

const fetchContributors = r => apiGitHub.request('GET /repos/{owner}/{repos}/stats/contributors', { owner: r.owner.login, repos: r.name })

const getGithubStats = async (mdPath) => {
  if (!process.env.GITHUB_TOKEN) return

  console.log('Query Repositories')

  // const data = await readFile(join(mdPath, 'data.json'))
  // const body = JSON.parse(data.toString())

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
  console.log(' - GET /user/orgs')
  const { data: orgs } = await apiGitHub.request('GET /user/orgs')
  for await (const org of orgs) {
    let page = 0
    console.log(` - GET /orgs/${org.login}/repos`)
    do {
      page++
      const { data: repos } = await apiGitHub.request('GET /orgs/{org}/repos', { org: org.login, per_page: 100, page })
      orgRepos = orgRepos.concat(repos)
      nextPage = repos.length > 0
    } while(nextPage)
  }

  console.log(` - GET /user/repos`)
  let page = 0
  do {
    page++
    const { data: repos } = await apiGitHub.request('GET /user/repos', { type: 'owner', per_page: 100, page })
    orgRepos = orgRepos.concat(repos)
    nextPage = repos.length > 0
  } while(nextPage)

  coding.project = orgRepos.length

  console.log('Contributors')
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
      console.log(savedRepos[repo.full_name])

      coding.commits += savedRepos[repo.full_name].commits
      coding.loc += savedRepos[repo.full_name].added + savedRepos[repo.full_name].deleted
      console.log(` - ${repo.full_name} (${repo.default_branch}) commits: ${savedRepos[repo.full_name].commits}`)
    } else {
      console.log(` - ${repo.full_name} (${repo.default_branch}) commits: N/A (status:${contri.status})`)
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
    //   console.log(`   - loc: ${savedRepos[repo.full_name].loc}`)
    // } else {
    //   console.log(`   - loc: N/A (status:${frequency.status})`)
    // }
  }

  console.log('coding:', coding)

  // https://api.github.com/repos/dvgamerr/dvgamerr/stats/code_frequency
  // for (const repos of res2.data) {
  //   if (repos.private) {
  //     console.log('- ', repos.full_name)
  //   }
  // }
}

Promise.all([
  // markdownToJson('./docs/', 'work.json')
  getGithubStats('./docs/')
]).then(() => {
  console.log('Done')
}).catch(ex => {
  console.error(ex)
})
