import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Award, BookOpen, Braces, Check, CheckCircle2, ChevronRight, CircleHelp, Code2, Copy, Database, GraduationCap, Layers, Lightbulb, ListChecks, Menu, Play, RotateCcw, Search, ShieldCheck, Sparkles, Table2, Terminal, Trophy, X, XCircle } from 'lucide-react'
import lessonsSource from './data/lessons.json'
import challengesSource from './data/challenges.json'
import { tables } from './data/database'
import { evaluateSQL, executeSQL, getDatabase, resetDatabase, type SqlResult } from './lib/sql'

type Lesson = (typeof lessonsSource)[number]
type Challenge = (typeof challengesSource)[number]
type View = 'learn' | 'practice' | 'playground' | 'schema'
type RunFeedback = { type: 'success' | 'error' | 'neutral'; message: string }
const lessons: Lesson[] = lessonsSource
const challenges: Challenge[] = challengesSource
const STORAGE_KEY = 'database-dojo-progress-v1'
const SAMPLE = 'SELECT c.country, COUNT(*) AS customers\nFROM customers c\nGROUP BY c.country\nORDER BY customers DESC;'
const executionOrder = ['FROM / JOIN', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY', 'FETCH FIRST']

function readProgress(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const data: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(data) ? data.filter((item): item is string => typeof item === 'string') : []
  } catch { return [] }
}
function readable(value: unknown): string {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
function Results({ result }: { result: SqlResult | null }) {
  if (!result) return <div className="empty-results"><Table2 size={28}/><span>Run SQL to see the results.</span><small>Your query executes locally against PostgreSQL.</small></div>
  if (!result.fields.length) return <div className="empty-results"><CheckCircle2 size={28}/><span>Statement executed successfully.</span><small>{result.affectedRows ?? 0} rows affected</small></div>
  return <div className="result-wrap"><div className="result-table-scroll"><table className="result-table"><thead><tr><th className="row-index">#</th>{result.fields.map((field, index) => <th key={index}>{field.name}</th>)}</tr></thead><tbody>{result.rows.length ? result.rows.slice(0, 200).map((row, i) => <tr key={i}><td className="row-index">{i + 1}</td>{result.fields.map((field, j) => <td key={j} title={readable(row[field.name])}>{readable(row[field.name])}</td>)}</tr>) : <tr><td className="no-rows" colSpan={result.fields.length + 1}>Query returned zero rows.</td></tr>}</tbody></table></div><div className="results-meta">{result.rows.length} row{result.rows.length === 1 ? '' : 's'} returned{result.rows.length > 200 ? ' · displaying the first 200' : ''}</div></div>
}
function SourcePill({ source }: { source: string }) {
  return <span className={source.startsWith('Adapted') ? 'source-pill source-course' : 'source-pill'}>{source.startsWith('Adapted') ? 'Course-inspired' : 'Original practice'}</span>
}
function App() {
  const [view, setView] = useState<View>('learn')
  const [lessonId, setLessonId] = useState(lessons[0].id)
  const [challengeId, setChallengeId] = useState(challenges[0].id)
  const [completed, setCompleted] = useState<string[]>(readProgress)
  const [sql, setSql] = useState(SAMPLE)
  const [result, setResult] = useState<SqlResult | null>(null)
  const [feedback, setFeedback] = useState<RunFeedback | null>(null)
  const [busy, setBusy] = useState(false)
  const [dbReady, setDbReady] = useState(false)
  const [dbError, setDbError] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [search, setSearch] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const lesson = lessons.find(item => item.id === lessonId) ?? lessons[0]
  const challenge = challenges.find(item => item.id === challengeId) ?? challenges[0]
  const lessonIndex = lessons.findIndex(item => item.id === lesson.id)
  const progressPercent = Math.round((completed.length / challenges.length) * 100)

  useEffect(() => {
    let active = true
    getDatabase().then(() => { if (active) setDbReady(true) }).catch(error => { if (active) setDbError(error instanceof Error ? error.message : String(error)) })
    return () => { active = false }
  }, [])
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(completed)) } catch { /* localStorage may be disabled */ }
  }, [completed])

  const selectLesson = useCallback((id: string) => {
    setLessonId(id)
    setView('learn')
    setMobileNav(false)
    setResult(null); setFeedback(null)
  }, [])
  const selectChallenge = useCallback((id: string) => {
    const picked = challenges.find(c => c.id === id)
    if (!picked) return
    setChallengeId(id); setView('practice'); setSql(picked.starter)
    setResult(null); setFeedback(null); setShowHint(false); setShowSolution(false); setMobileNav(false)
  }, [])
  const navigate = useCallback((next: View) => {
    setView(next); setMobileNav(false); setFeedback(null); setResult(null)
    if (next === 'playground') setSql(SAMPLE)
  }, [])
  const run = useCallback(async () => {
    if (busy || !dbReady) return
    setBusy(true); setFeedback(null); setResult(null)
    try {
      if (view === 'practice') {
        const evaluation = await evaluateSQL(sql, challenge.answer)
        setResult(evaluation.actual)
        if (evaluation.correct) {
          setCompleted(current => current.includes(challenge.id) ? current : [...current, challenge.id])
          setFeedback({ type: 'success', message: 'Correct! Your query returns the expected result set. Great work.' })
        } else setFeedback({ type: 'error', message: 'Not quite. Compare the rows and check joins, filters, duplicates, and NULLs. Try a hint if needed.' })
      } else {
        const output = await executeSQL(sql)
        setResult(output)
        setFeedback({ type: 'neutral', message: 'Query executed successfully.' })
      }
    } catch (error) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : String(error) })
    } finally { setBusy(false) }
  }, [busy, dbReady, view, sql, challenge])
  const runLessonQuery = useCallback(async (query: string) => {
    setSql(query); setResult(null); setFeedback(null)
    setView('playground')
  }, [])
  const reset = useCallback(async () => {
    setBusy(true); setFeedback(null); setResult(null)
    try { await resetDatabase(); setFeedback({ type: 'success', message: 'The practice database has been restored to its original sample data.' }) }
    catch (error) { setFeedback({ type: 'error', message: error instanceof Error ? error.message : String(error) }) }
    finally { setBusy(false) }
  }, [])
  const filteredChallenges = useMemo(() => challenges.filter(item =>
    [item.title,item.prompt,item.difficulty,item.source,lessons.find(l => l.id === item.lesson)?.title ?? ''].join(' ').toLowerCase().includes(search.toLowerCase())
  ), [search])

  return <div className="app">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="sidebar-heading"><div className="logo-mark"><Braces size={22}/></div><div><strong>Database<span>Dojo</span></strong><small>SQL LEARNING LAB</small></div><button className="mobile-close icon-btn" aria-label="Close menu" onClick={() => setMobileNav(false)}><X size={20}/></button></div>
      <div className="nav-caption">WORKSPACE</div>
      <nav className="nav-primary" aria-label="Main navigation">
        <button className={view === 'learn' ? 'nav-active' : ''} onClick={() => navigate('learn')}><BookOpen size={18}/> Learn <ChevronRight size={15} className="nav-chevron"/></button>
        <button className={view === 'practice' ? 'nav-active' : ''} onClick={() => navigate('practice')}><ListChecks size={18}/> Practice <span className="nav-count">{challenges.length}</span></button>
        <button className={view === 'playground' ? 'nav-active' : ''} onClick={() => navigate('playground')}><Terminal size={18}/> SQL Playground</button>
        <button className={view === 'schema' ? 'nav-active' : ''} onClick={() => navigate('schema')}><Database size={18}/> Database Schema</button>
      </nav>
      <div className="nav-caption lessons-caption">COURSE MODULES <span>8 LESSONS</span></div>
      <nav className="lesson-list" aria-label="Course lessons">{lessons.map(item =>
        <button key={item.id} className={view === 'learn' && lesson.id === item.id ? 'lesson-active' : ''} onClick={() => selectLesson(item.id)}>
          <span className="lesson-number">{item.unit}</span><span className="lesson-nav-title">{item.title}</span>
          {item.challengeIds.every(id => completed.includes(id)) && <Check size={14} className="done-icon"/>}
        </button>
      )}</nav>
      <div className="sidebar-spacer"/>
      <div className="progress-card"><div className="progress-card-heading"><Trophy size={16}/><span>Your progress</span><strong>{progressPercent}%</strong></div><div className="progress-bar"><div style={{width:progressPercent+'%'}}/></div><small>{completed.length} of {challenges.length} challenges solved</small></div>
      <div className="sidebar-footer"><span className={`status-dot ${dbReady ? 'ready' : ''}`}/>{dbReady ? 'PostgreSQL ready' : dbError ? 'Database unavailable' : 'Starting PostgreSQL…'}<span className="local-tag">LOCAL</span></div>
    </aside>
    {mobileNav && <button className="mobile-overlay" aria-label="Close navigation" onClick={() => setMobileNav(false)}/>}
    <main className="main">
      <header className="topbar"><div className="topbar-left"><button className="icon-btn mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={22}/></button><span>CECS 323</span><ChevronRight size={14}/><strong>{view === 'learn' ? lesson.title : view === 'practice' ? 'Practice' : view === 'schema' ? 'Database Schema' : 'SQL Playground'}</strong></div><div className="topbar-right"><span className="course-badge"><GraduationCap size={15}/> Exam 3 Prep</span><span className="avatar">SQL</span></div></header>
      <div className="content">
      {dbError && <div className="banner-error"><XCircle size={18}/> PostgreSQL failed to initialize: {dbError}. Reload the page to retry.</div>}
      {view === 'learn' && <><div className="hero hero-lesson"><div className="eyebrow"><span className="eyebrow-dot"/> MODULE {lesson.unit} <span className="eyebrow-separator">/</span> {lesson.category.toUpperCase()}</div><h1>{lesson.title}<span className="h1-dot">.</span></h1><p className="hero-subtitle">{lesson.subtitle}</p><div className="hero-meta"><span><BookOpen size={15}/> CECS 323 · Module 3</span><span><CircleHelp size={15}/> {lesson.duration} min read</span><span><Layers size={15}/> SQL lecture focus</span></div></div>
        <div className="lesson-layout"><section className="lesson-body">
          <div className="section-kicker"><span className="section-kicker-line"/> THE CONCEPT</div>
          <h2>Build the right mental model.</h2><p className="lead">{lesson.description}</p>
          <div className="concept-card"><div className="concept-icon"><Lightbulb size={19}/></div><div><strong>Think like a database engineer</strong><p>{lesson.concept}</p></div></div>
          <h3>Key takeaways</h3><div className="takeaways">{lesson.bullets.map((item,i) => <div className="takeaway" key={i}><span><Check size={14}/></span><p>{item}</p></div>)}</div>
          {lesson.id === 'exam-review' && <div className="execution-box"><h3>Logical SQL execution order</h3><div className="execution-steps">{executionOrder.map((step,i) => <div key={step}><span>{i+1}</span>{step}</div>)}</div></div>}
          <div className="example-heading"><div><div className="section-kicker"><span className="section-kicker-line"/> HANDS-ON EXAMPLE</div><h2>See it in SQL.</h2></div><span className="example-label"><Code2 size={14}/> POSTGRESQL</span></div>
          <div className="code-example"><div className="code-window-bar"><div className="code-dots"><i/><i/><i/></div><span>example.sql</span><button title="Copy SQL" onClick={() => void navigator.clipboard?.writeText(lesson.query)}><Copy size={15}/></button></div><pre><code>{lesson.query}</code></pre><div className="code-window-footer"><span>Ready to experiment?</span><button onClick={() => runLessonQuery(lesson.query)}>Try in Playground <ArrowRight size={15}/></button></div></div>
          <div className="lesson-bottom"><span className="lesson-attribution"><ShieldCheck size={16}/> Paraphrased course concepts; sample data is illustrative.</span><div className="lesson-pager"><button disabled={lessonIndex === 0} onClick={() => selectLesson(lessons[lessonIndex-1].id)}><ArrowLeft size={16}/> Previous</button><button disabled={lessonIndex === lessons.length-1} onClick={() => selectLesson(lessons[lessonIndex+1].id)}>Next lesson <ArrowRight size={16}/></button></div></div>
        </section><aside className="lesson-right"><div className="info-card"><div className="info-card-title"><Award size={18}/> LESSON CHECKPOINT</div><h3>Ready to put it to the test?</h3><p>Apply what you learned with real PostgreSQL queries.</p><div className="checkpoint-list">{lesson.challengeIds.map(id => {const c = challenges.find(x => x.id === id); if(!c)return null;return <button key={id} onClick={() => selectChallenge(id)}><span className={completed.includes(id)?'checkpoint-checked':'checkpoint-open'}>{completed.includes(id)?<Check size={13}/>:<Code2 size={13}/>}</span><span>{c.title}<small>{c.difficulty}</small></span><ChevronRight size={15}/></button>})}</div></div><div className="tip-card"><Sparkles size={19}/><strong>Study tip</strong><p>Before writing a query, ask: what does one output row represent, and what is its key?</p></div></aside></div>
      </>}
      {view === 'practice' && <><div className="view-heading"><div className="eyebrow"><span className="eyebrow-dot"/> PRACTICE MODE</div><h1>SQL Challenges<span className="h1-dot">.</span></h1><p>Learn by doing. Write queries, test your results, and build confidence.</p></div><div className="practice-layout"><aside className="challenge-sidebar"><label className="search-box"><Search size={17}/><input placeholder="Find a challenge..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Find a challenge"/></label><div className="challenge-list">{filteredChallenges.length ? filteredChallenges.map(item => <button key={item.id} className={challenge.id === item.id ? 'challenge-active' : ''} onClick={() => selectChallenge(item.id)}><span className={completed.includes(item.id)?'challenge-done-dot':'challenge-notdone-dot'}>{completed.includes(item.id) && <Check size={12}/>}</span><span className="challenge-list-text">{item.title}<small>{item.difficulty} · {item.kind}</small></span><ChevronRight size={15}/></button>) : <p className="empty-search">No challenges matched.</p>}</div></aside><section className="workspace-panel"><div className="challenge-intro"><div className="challenge-tags"><span className="difficulty-tag">{challenge.difficulty}</span><SourcePill source={challenge.source}/></div><h2>{challenge.title}</h2><p>{challenge.prompt}</p><div className="challenge-actions"><button onClick={() => setShowHint(x => !x)}><Lightbulb size={16}/> {showHint ? 'Hide hint' : 'Need a hint?'}</button><button onClick={() => setShowSolution(x => !x)}><CircleHelp size={16}/> {showSolution ? 'Hide solution' : 'Show solution'}</button></div>{showHint && <div className="hint-box"><Lightbulb size={17}/>{challenge.hint}</div>}{showSolution && <div className="solution-box"><strong>One valid solution</strong><pre>{challenge.answer}</pre><small>Other equivalent queries may also be correct.</small></div>}</div><SqlWorkspace sql={sql} onChange={setSql} onRun={run} onReset={() => { setSql(challenge.starter);setResult(null);setFeedback(null) }} busy={busy} ready={dbReady} feedback={feedback} result={result} label="solution.sql" isChallenge/><div className="practice-footnote"><ShieldCheck size={15}/> Results are compared against a reference query. Row order and column aliases do not affect grading.</div></section></div></>}
      {view === 'playground' && <><div className="view-heading"><div className="eyebrow"><span className="eyebrow-dot"/> EXPLORE FREELY</div><h1>SQL Playground<span className="h1-dot">.</span></h1><p>A real PostgreSQL database, right in your browser. No setup. No backend. Just SQL.</p></div><div className="playground-notice"><Database size={20}/><div><strong>Practice dataset loaded</strong><span>5 tables · 12 customers · 10 orders · Sample teaching data, not an official course database export</span></div><button onClick={reset} disabled={busy || !dbReady}><RotateCcw size={15}/> Restore data</button></div><div className="playground-panel"><SqlWorkspace sql={sql} onChange={setSql} onRun={run} onReset={() => {setSql(SAMPLE);setResult(null);setFeedback(null)}} busy={busy} ready={dbReady} feedback={feedback} result={result} label="playground.sql"/><div className="playground-suggestions"><span>TRY A QUERY</span><button onClick={() => {setSql('SELECT * FROM customers LIMIT 10;');setResult(null)}}>Explore customers</button><button onClick={() => {setSql('SELECT * FROM orderdetails LIMIT 10;');setResult(null)}}>Explore line items</button><button onClick={() => {setSql('SELECT country, COUNT(*) AS customer_count FROM customers GROUP BY country ORDER BY customer_count DESC;');setResult(null)}}>Group by country</button></div></div></>}
      {view === 'schema' && <><div className="view-heading"><div className="eyebrow"><span className="eyebrow-dot"/> YOUR DATA</div><h1>Database Schema<span className="h1-dot">.</span></h1><p>Five interconnected relations. Know your keys before you join.</p></div><div className="schema-banner"><Database size={21}/><div><strong>Illustrative Homework-style schema</strong><p>Built from the entities and join keys used in Homework 8. These rows and values are original educational examples, not the class's official Homework database.</p></div></div><div className="schema-grid">{tables.map(table => <div className="schema-table" key={table.name}><div className="schema-table-heading"><Table2 size={17}/><strong>{table.name}</strong><span>{table.columns.length} cols</span></div><div className="schema-column-list">{table.columns.map(column => <div key={column}><span>{column}</span>{table.key.split(' + ').includes(column) && <span className="pk-label">PK</span>}</div>)}</div><div className="schema-table-note">{table.desc}</div><button onClick={() => {navigate('playground');setSql('SELECT * FROM '+table.name+' LIMIT 10;')}}>Inspect rows <ArrowRight size={14}/></button></div>)}</div><div className="relations-card"><h3>How the tables connect</h3><div className="relation-row"><span>customers</span><ChevronRight size={16}/><span>orders</span><small>1 to many · customernumber</small></div><div className="relation-row"><span>orders</span><ChevronRight size={16}/><span>orderdetails</span><small>1 to many · ordernumber</small></div><div className="relation-row"><span>products</span><ChevronRight size={16}/><span>orderdetails</span><small>1 to many · productcode</small></div><div className="relation-row"><span>customers</span><ChevronRight size={16}/><span>payments</span><small>1 to many · customernumber</small></div></div></>}
      <footer className="page-footer"><span>DATABASE DOJO <span className="footer-dot">·</span> CECS 323 SQL LEARNING LAB</span><span>Practice locally. Learn deeply.</span></footer></div>
    </main>
  </div>
}

function SqlWorkspace({sql,onChange,onRun,onReset,busy,ready,feedback,result,label,isChallenge=false}:{
  sql:string;onChange:(value:string)=>void;onRun:()=>void;onReset:()=>void;busy:boolean;ready:boolean;feedback:RunFeedback|null;result:SqlResult|null;label:string;isChallenge?:boolean
}) {
  const lines = sql.split('\n').length
  return <div className="sql-workspace"><div className="workspace-titlebar"><div><Terminal size={17}/> SQL EDITOR <span className="editor-filename">{label}</span></div><span className="postgres-label"><span/> PostgreSQL</span></div><div className="editor-area"><div className="line-numbers" aria-hidden="true">{Array.from({length:Math.max(8,lines)},(_,i)=><div key={i}>{i+1}</div>)}</div><textarea aria-label="SQL editor" autoCapitalize="off" autoCorrect="off" spellCheck={false} value={sql} onChange={e=>onChange(e.target.value)} onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter'){e.preventDefault();onRun()} if(e.key==='Tab'){e.preventDefault();const el=e.currentTarget;const start=el.selectionStart;const end=el.selectionEnd;onChange(sql.slice(0,start)+'  '+sql.slice(end));requestAnimationFrame(()=>{el.selectionStart=el.selectionEnd=start+2})}}} placeholder="-- Write your SQL query here" /></div><div className="editor-toolbar"><span>⌘ / Ctrl + Enter to run</span><div><button className="reset-btn" onClick={onReset} title="Restore editor text"><RotateCcw size={15}/> Reset editor</button><button className="run-btn" disabled={busy || !ready || !sql.trim()} onClick={onRun}><Play size={15} fill="currentColor"/> {busy ? 'Running…' : isChallenge ? 'Check answer' : 'Run query'}</button></div></div><div className="results-header"><div><Table2 size={17}/> QUERY RESULTS</div><span>{result ? result.rows.length+' rows' : 'No results yet'}</span></div>{feedback && <div role="status" className={`feedback feedback-${feedback.type}`}>{feedback.type==='success'?<CheckCircle2 size={18}/>:feedback.type==='error'?<XCircle size={18}/>:<Check size={18}/>}<span>{feedback.message}</span></div>}<Results result={result}/></div>
}
export default App
