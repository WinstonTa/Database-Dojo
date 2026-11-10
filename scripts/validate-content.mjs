import fs from 'node:fs'
import assert from 'node:assert/strict'

const lessons = JSON.parse(fs.readFileSync('src/data/lessons.json', 'utf8'))
const challenges = JSON.parse(fs.readFileSync('src/data/challenges.json', 'utf8'))
const db = fs.readFileSync('src/data/database.ts', 'utf8')
const ids = new Set()
const lessonIds = new Set()

assert.equal(lessons.length, 13, 'Expected thirteen lecture-aligned units')
assert.ok(challenges.length >= 30, 'Expected at least 30 SQL challenges')

for (const lesson of lessons) {
  assert.ok(!lessonIds.has(lesson.id), 'Duplicate lesson id: ' + lesson.id)
  lessonIds.add(lesson.id)
  assert.match(lesson.query, /SELECT/i, 'Lesson must contain SQL: ' + lesson.id)
  assert.ok(!lesson.query.includes('\\\\n'), 'Lesson contains literal escaped line breaks: ' + lesson.id)
  assert.equal(lesson.slideRange, '28–123', 'Only the requested SQL slide range is primary')
  assert.ok(lesson.bullets.length >= 3, 'Lesson missing takeaways: ' + lesson.id)
  assert.ok(lesson.sourceTopic && lesson.deepDive && lesson.extra, 'Lesson missing lecture enrichment: ' + lesson.id)
  assert.match(lesson.deepDive.sql, /(SELECT|CREATE)/i, 'Missing guided SQL: ' + lesson.id)
  assert.ok(!lesson.deepDive.sql.includes('\\\\n'), 'Walkthrough contains literal escaped line breaks: ' + lesson.id)
}
for (const challenge of challenges) {
  assert.ok(!ids.has(challenge.id), 'Duplicate challenge id: ' + challenge.id)
  ids.add(challenge.id)
  assert.ok(lessonIds.has(challenge.lesson), 'Unknown challenge lesson: ' + challenge.lesson)
  assert.match(challenge.answer, /^(SELECT|WITH)\b/i, 'Answer must be a SELECT/CTE')
  assert.ok(!challenge.starter.includes('\\\\n') && !challenge.answer.includes('\\\\n'), 'Challenge contains literal escaped line breaks: ' + challenge.id)
  assert.ok(challenge.prompt && challenge.hint && challenge.starter)
  assert.ok(challenge.source.startsWith('Adapted') || challenge.source === 'Original practice')
}
for (const lesson of lessons) {
  for (const id of lesson.challengeIds) assert.ok(ids.has(id), 'Unknown checkpoint: ' + id)
}
for (const name of ['customers','orders','orderdetails','products','payments']) {
  assert.match(db, new RegExp('CREATE TABLE '+name+' \\('))
}
assert.match(db, /\(1001,'P01',60,50\),\(1001,'P02',60,40\)/, 'Duplicate qualifying line items test fixture')
assert.match(db, /\(1002,'P01',100,50\),\s*\(1002,'P03',5,80\)/, 'Tied subtotal test fixture')
for(const topic of ['CREATE TABLE','ALTER TABLE customers ADD COLUMN state','ALTER TABLE products ADD COLUMN productline']) assert.ok(db.includes(topic), 'Missing expanded lecture fixture: '+topic)
console.log('Validated', lessons.length, 'lecture-aligned lessons and', challenges.length, 'curated challenges')
