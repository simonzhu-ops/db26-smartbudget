import { useSavingsGoals } from '../hooks/useBudgetAPI'
import { Spinner, ErrorMessage } from '../components/Feedback'

export default function SavingsGoals() {
  // hardcoded userId=1 for foundation; real auth arrives later
  const { goals, loading, error } = useSavingsGoals(1)

  if (loading) return <Spinner />
  if (error)   return <ErrorMessage message={error} />

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Savings Goals</h1>

      {goals.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          No savings goals yet.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.2rem',
        }}>
          {goals.map(g => <GoalCard key={g.goalId} goal={g} />)}
        </div>
      )}
    </div>
  )
}

function GoalCard({ goal }) {
  const target  = Number(goal.targetAmount)
  const current = Number(goal.currentAmount)
  const raw     = target === 0 ? 0 : (current / target) * 100
  const pct     = Math.min(100, Math.max(0, raw))

  // Colour by progress bucket — red / amber / green.
  const fillColor = pct < 33 ? 'var(--danger)'
                  : pct < 66 ? 'var(--gold)'
                  :            'var(--success)'

  return (
    <div className="card">
      <h3 style={{ marginBottom: '0.25rem', color: 'var(--primary)' }}>{goal.goalName}</h3>
      {goal.deadline && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Deadline: {goal.deadline}
        </p>
      )}
      <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
        £{current.toFixed(2)} <span style={{ color: 'var(--text-muted)' }}>of £{target.toFixed(2)}</span>
      </p>

      <div className="progress-bar-bg">
        <div className="progress-bar-fill"
             style={{ width: `${pct}%`, background: fillColor }} />
      </div>

      <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
        {pct.toFixed(0)}%{pct >= 100 ? ' — complete' : ''}
      </p>
    </div>
  )
}
