require('dotenv').config()

const { Octokit } = require('@octokit/core')
const debuger = require('@touno-io/debuger')
const dayjs = require('dayjs')

const { readdir, readFile, writeFile } = require('fs/promises')
const { existsSync, unlinkSync } = require('fs')
const { extname, join } = require('path')



const logger = debuger('GEN')
const enableGithub = process.argv.filter(e => e === '--github').length > 0
const enableWakatime = process.argv.filter(e => e === '--wakatime').length > 0

const updateJSONfile = async (file, updated) => {
  const dirData = './docs/data'
  if (existsSync(join(dirData, file))) {
    const rawData = await readFile(join(dirData, file))
    const data = JSON.parse(rawData.toString())
    for (const key in updated) {
      if (typeof updated[key] != 'object') continue
      data[key] = Object.assign(data[key] || {}, updated[key])
    }

    await writeFile(join(dirData, file), JSON.stringify(data, null, 2))
  } else {
    await writeFile(join(dirData, file), JSON.stringify(updated, null, 2))
  }
}

// const apiGitHub = Octokit.defaults()

const apiGitHub = new Octokit({
  auth: process.env.GH_TOKEN,
  baseUrl: 'https://api.github.com',
  Accept: 'application/vnd.github.v3+json',
})

const apiWaka = new Octokit({
  baseUrl: 'https://wakatime.com/api/v1'
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

const fetchCommitActivity = r => apiGitHub.request('GET /repos/{owner}/{repos}/stats/commit_activity', { owner: r.owner.login, repos: r.name })

const getGithubStats = async () => {
  if (!process.env.GH_TOKEN || !enableGithub) return

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
  const { data: orgs } = await apiGitHub.request('GET /user/orgs')
  for await (const org of orgs) {
    let page = 0
    do {
      page++
      const { data: repos } = await apiGitHub.request('GET /orgs/{org}/repos', { org: org.login, per_page: 100, page })
      orgRepos = orgRepos.concat(repos)
      nextPage = repos.length > 0
    } while(nextPage)
  }

  let page = 0
  do {
    page++
    const { data: repos } = await apiGitHub.request('GET /user/repos', { type: 'owner', per_page: 100, page })
    orgRepos = orgRepos.concat(repos)
    nextPage = repos.length > 0
  } while(nextPage)

  coding.project = orgRepos.length

  logger.info('Contributors Task...')
  const savedRepos = {}
  const reposTask = []
  for await (const repo of orgRepos) {
    if (!repo.private) coding.opensource++
    savedRepos[repo.full_name] = { commits: 0, added: 0, deleted: 0 }
    reposTask.push((async () => {
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
        coding.loc += savedRepos[repo.full_name].added
        coding.loc += savedRepos[repo.full_name].deleted
      } else {
        logger.log(` - ${repo.full_name} commits:${contri.status})`)
      }

      const languages = await apiGitHub.request('GET /repos/{owner}/{repos}/languages', { owner: repo.owner.login, repos: repo.name })
      if (languages.status === 200) {
        savedRepos[repo.full_name].languages = languages.data
        coding.languages = Object.assign(coding.languages, languages.data)
      } else {
        logger.log(` - ${repo.full_name} languages:${contri.status})`)
      }
    })())
  }
  logger.info('Github API...')
  await Promise.all(reposTask)
  coding.languages = Object.keys(coding.languages).length
  // savedRepos
  logger.info('Saving...')

  unlinkSync('./docs/data/repos.json')
  await updateJSONfile('repos.json', savedRepos)
  await updateJSONfile('resume.json', { coding })
}

const getWakaTime = async () => {
  if (!process.env.WK_TOKEN || !enableWakatime) return
  // https://wakatime.com/api/v1/users/current/durations?api_key=f389e6d1-207e-4c49-9526-d2623ce7b6d1&date=2022-03-26


  const coding = {
    yesterday_seconds: 0,
    average_seconds: 0,
    best_seconds: 0,
    daytime: [],
    weektime: []
  }

  let beginDateTime = ''
  let currDateTime = ''
  let dayTime = {}
  let weekTime = {}

  for (let i = 0; i <= 23; i++) dayTime[i] = 0
  for (let i = 0; i <= 6; i++) weekTime[i] = 0

  wakaTask = []
  const totalDay = 365
  let cDate = dayjs().startOf('d')
  for (let i = totalDay; i > 0; i--) {
    cDate = dayjs().startOf('d')
    currDateTime = cDate.add(i * -1, 'd').format('YYYY-MM-DD')
    const currDay = cDate.add(i * -1, 'd').day()
    if (!beginDateTime) beginDateTime = currDateTime
    wakaTask.push((async () => {
      const { status, data: { data: durations } } = await apiWaka.request('GET /users/current/durations', {
        api_key: process.env.WK_TOKEN,
        date: currDateTime
      })
      if (status !== 200) return logger.error(status)

      let totalDuration = 0
      for (const data of durations) {
        if (data.duration == 0) continue
        const beginTime = dayjs(data.time * 1000).hour()
        const endTime = dayjs((data.time + data.duration) * 1000).hour()

        for (let i = beginTime; i <= endTime; i++) {
          dayTime[i] = (dayTime[i] || 0) + 1
        }
        totalDuration += data.duration
      }
      coding.average_seconds += totalDuration

      if (totalDuration > coding.best_seconds) coding.best_seconds = totalDuration
      if (i === 1) coding.yesterday_seconds = totalDuration

      weekTime[currDay] = (weekTime[currDay] || 0) + totalDuration
    })())
    if (wakaTask.length == 10) {
      logger.log(`- fetch: ${beginDateTime} to ${currDateTime}`)
      await Promise.all(wakaTask)
      wakaTask = []
      beginDateTime = ''
    }
  }

  if (wakaTask.length > 0) {
    logger.log(`- fetch: ${beginDateTime} to ${currDateTime}`)
    await Promise.all(wakaTask)
  }

  coding.average_seconds /= totalDay
  coding.daytime = Object.values(dayTime)
  weekTime = Object.values(weekTime).map(e => parseInt(e / 60 / 60 * 100) / 100)
  weekTime.push(weekTime.shift())

  coding.weektime = weekTime
  await updateJSONfile('resume.json', { coding })
}

const apiLayer = new Octokit({
  baseUrl: 'https://api.bitkub.com/api'
})

const getCurrencryUSD = async () => {

  logger.info('Query bitkub.com THB-USDT')
  const symbols = 'THB_USDT'
  const { data, status } = await apiLayer.request('GET /market/ticker?sym={?symbols}', {
    symbols
  })

  const salary = { rate: data[symbols].highestBid }
  await updateJSONfile('resume.json', { salary })
}

Promise.all([
  markdownToJson('work.json'),
  getCurrencryUSD(),
  getGithubStats(),
  getWakaTime()
]).then(() => {
  logger.log('Complated')
}).catch(ex => {
  console.error(ex)
})

