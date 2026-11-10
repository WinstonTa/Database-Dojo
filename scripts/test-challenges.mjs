import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { transform } from 'esbuild'
import { PGlite } from '@electric-sql/pglite'

const ts = readFileSync('src/data/database.ts', 'utf8')
const { code } = await transform(ts, { loader: 'ts', format: 'esm', target: 'es2022' })
const { schemaSQL } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))
const challenges = JSON.parse(readFileSync('src/data/challenges.json', 'utf8'))
const lessons = JSON.parse(readFileSync('src/data/lessons.json', 'utf8'))

const db = new PGlite()
await db.waitReady
await db.exec(schemaSQL)

for (const challenge of challenges) {
  try {
    const result = await db.query(challenge.answer)
    assert.ok(Array.isArray(result.rows), 'Expected rows from SQL query')
    if (challenge.id === 'count-motorcycle-orders') {
      assert.equal(Number(result.rows[0].motorcycle_orders), 3, 'Motorcycle order count fixture should have 3 qualifying orders')
      const lines = await db.query("SELECT COUNT(*) AS total FROM orderdetails od JOIN products p USING(productcode) WHERE p.productline = 'Motorcycles'")
      assert.equal(Number(lines.rows[0].total), 4, 'Counting motorcycle details must differ from counting orders')
    }
    if (challenge.id === 'largest-payment-customers') {
      assert.equal(result.rows.length, 2, 'Largest payment must tie across two customers')
    }
    if (challenge.id === 'biggest-subtotal') {
      assert.equal(result.rows.length, 2, 'Two distinct orders should tie for largest subtotal')
    }
    if (challenge.id === 'customers-without-2024-orders') {
      assert.ok(result.rows.some(row => Number(row.customernumber) === 103), 'Never-ordering customer must be included')
    }
  } catch (error) {
    throw new Error('SQL challenge failed: ' + challenge.id, { cause: error })
  }
}

for (const lesson of lessons) {
  try {
    await db.exec(lesson.query)
  } catch (error) {
    throw new Error('Lesson SQL failed: ' + lesson.id, { cause: error })
  }
  // Guided demo SQL may mutate temporary tables. Rebuild a clean sandbox for each demo.
  const isolated = new PGlite()
  await isolated.waitReady
  await isolated.exec(schemaSQL)
  try { await isolated.exec(lesson.deepDive.sql) }
  catch (error) { throw new Error('Lecture walkthrough SQL failed: ' + lesson.id, { cause: error }) }
  finally { await isolated.close() }
}
await db.close()
console.log('Executed all', challenges.length, 'reference challenges and', lessons.length * 2, 'lesson SQL examples successfully')
