import StatCard from '../components/StatCard';
import Badge from '../components/Badge';

const SUBSCRIPTION_COLORS = {
  Basic: { bg: '#E6F1FB', text: '#0C447C' },
  Standard: { bg: '#EAF3DE', text: '#3B6D11' },
  Premium: { bg: '#FAEEDA', text: '#854F0B' },
};

export default function Dashboard({ users, books, issuedBooks, fineBooks }) {
  return (
    <div>
      <h1 style={{ margin: '0 0 0.25rem', fontSize: 22, fontWeight: 600 }}>Dashboard</h1>
      <p style={{ margin: '0 0 1.5rem', color: 'var(--color-text-secondary)', fontSize: 14 }}>Library overview at a glance</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: '2rem' }}>
        <StatCard icon='ti-users' label='Total Users' value={users.length} subtext='Registered members' color='#185FA5' />
        <StatCard icon='ti-book' label='Total Books' value={books.length} subtext='In collection' color='#0F6E56' />
        <StatCard icon='ti-bookmark' label='Issued' value={issuedBooks.length} subtext='Currently borrowed' color='#BA7517' />
        <StatCard icon='ti-coin' label='With Fine' value={fineBooks.length} subtext='Overdue / penalty' color='#A32D2D' />
      </div>
      <div className='responsive-two-col' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--color-background-primary)', border: '1px solid var(--color-border-tertiary)', borderRadius: 12, padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: 14, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Recent Users</h3>
          {users.slice(0, 5).map((u, i) => <div key={u.id || i} style={{ display: 'flex', gap: 10, padding: '8px 0' }}><div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E6F1FB', display: 'grid', placeItems: 'center', fontWeight: 600, color: '#185FA5' }}>{(u.name || u.username || 'U')[0]?.toUpperCase()}</div><div><p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{u.name || u.username || `User #${u.id}`}</p><p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-secondary)' }}>{u.email || '—'}</p></div>{(u.subscription || u.membership) ? <span style={{ marginLeft: 'auto', fontSize: 11, padding: '2px 8px', borderRadius: 999, background: SUBSCRIPTION_COLORS[u.subscription || u.membership]?.bg, color: SUBSCRIPTION_COLORS[u.subscription || u.membership]?.text }}>{u.subscription || u.membership}</span> : null}</div>)}
        </div>
        <div style={{ background: 'var(--color-background-primary)', border: '1px solid var(--color-border-tertiary)', borderRadius: 12, padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: 14, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Recent Books</h3>
          {books.slice(0, 5).map((b, i) => <div key={b.id || i} style={{ display: 'flex', gap: 10, padding: '8px 0' }}><div style={{ width: 32, height: 32, borderRadius: 8, background: '#EAF3DE', display: 'grid', placeItems: 'center' }}><i className='ti ti-book' style={{ color: '#3B6D11' }} /></div><div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{b.name || b.title || `Book #${b.id}`}</p><p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-secondary)' }}>{b.author || '—'}</p></div><Badge type={b.issueDate ? 'warning' : 'success'}>{b.issueDate ? 'Issued' : 'Available'}</Badge></div>)}
        </div>
      </div>
    </div>
  );
}
