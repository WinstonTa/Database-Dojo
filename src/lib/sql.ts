import { PGlite } from '@electric-sql/pglite'
import { schemaSQL } from '../data/database'

export type SqlResult = { rows: Record<string, unknown>[]; fields: { name: string }[]; affectedRows?: number }
let instance: Promise<PGlite> | null = null

export function getDatabase(): Promise<PGlite> {
  if (!instance) {
    instance = (async () => {
      const db = new PGlite()
      await db.waitReady
      await db.exec(schemaSQL)
      return db
    })().catch(error => { instance = null; throw error })
  }
  return instance
}

export async function executeSQL(sql: string): Promise<SqlResult> {
  const db = await getDatabase()
  const responses = await db.exec(sql)
  if (!responses.length) return { rows: [], fields: [] }
  const last = responses[responses.length - 1]
  return {
    rows: (last.rows ?? []) as Record<string, unknown>[],
    fields: last.fields.map(field => ({ name: field.name })),
    affectedRows: last.affectedRows
  }
}

export async function resetDatabase() {
  const db = await getDatabase()
  await db.exec(schemaSQL)
}

function canonicalize(value: unknown): string {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'bigint') return String(value)
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

/** Compares row multisets by position, ignoring output aliases and row order.
 *  Comparison remains meaningful when students use a correct alternative query.
 */
export function compareResults(actual: SqlResult, expected: SqlResult): boolean {
  if (actual.fields.length !== expected.fields.length) return false
  const normalize = (result: SqlResult) => result.rows.map(row =>
    result.fields.map(field => canonicalize(row[field.name])).join('\u241f')
  ).sort()
  const a = normalize(actual), b = normalize(expected)
  return a.length === b.length && a.every((row, i) => row === b[i])
}

export async function evaluateSQL(sql: string, answer: string): Promise<{ correct: boolean; actual: SqlResult }> {
  const clean = sql.trim().replace(/;\s*$/, '')
  // Challenges are evaluated as queries; the separate playground allows arbitrary edits.
  if (!/^(SELECT|WITH)\b/i.test(clean)) throw new Error('Challenge submissions must be SELECT or WITH queries. Use the Playground for schema changes.')
  // Guard common write operations in CTEs.
  if (/\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|COPY|CALL)\b/i.test(clean)) throw new Error('Challenge submissions must be read-only.')
  const actual = await executeSQL(clean)
  const expected = await executeSQL(answer)
  return { correct: compareResults(actual, expected), actual }
}
