import fs from 'node:fs'
const log = fs.readFileSync(process.argv[2], 'utf8')
const lines = log.split('\n').map(x => x.trim()).filter(Boolean)
const error = lines.find(x => /^Error: (SQL challenge failed:|Lesson SQL failed:|Lecture walkthrough SQL failed:)/i.test(x))
  ?? lines.find(x => /^(Error:|AssertionError|SyntaxError|TypeError)/i.test(x))
  ?? lines.at(-1)
const description = (error ?? 'SQL smoke test failed').slice(0, 135)
console.error('CI diagnostic:', description)
const url = 'https://api.github.com/repos/' + process.env.GITHUB_REPOSITORY + '/statuses/' + process.env.GITHUB_SHA
try {
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.GITHUB_TOKEN, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
    body: JSON.stringify({ state:'failure', context:'Database Dojo SQL diagnostics', description })
  })
  if (!response.ok) console.error('Could not publish diagnostic:', response.status)
} catch (error) { console.error('Could not publish diagnostic:', error) }
