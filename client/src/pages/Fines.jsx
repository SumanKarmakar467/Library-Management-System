import StatCard from '../components/StatCard';
import LoadingRow from '../components/LoadingRow';
import EmptyRow from '../components/EmptyRow';

export default function Fines({ fineBooks, loading }) {
  const totalFine = fineBooks.reduce((sum, b) => sum + Number(b.fine || 0), 0);
  return (
    <div>
      <h1 style={{ margin: '0 0 0.25rem', fontSize: 22, fontWeight: 600 }}>Fines & Overdue</h1>
      <p style={{ margin: '0 0 1.25rem', fontSize: 13, color: 'var(--color-text-secondary)' }}>Issued books with pending fines</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
        <StatCard icon='ti-alert-triangle' label='Overdue Books' value={fineBooks.length} color='#A32D2D' />
        <StatCard icon='ti-coin' label='Total Fines' value={`$${totalFine}`} subtext='Pending collection' color='#BA7517' />
      </div>
      <div style={{ background: 'var(--color-background-primary)', border: '1px solid var(--color-border-tertiary)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}><thead><tr style={{ background: 'var(--color-background-secondary)' }}>{['Book', 'Author', 'User ID', 'Issue Date', 'Fine Amount'].map((h) => <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border-tertiary)' }}>{h}</th>)}</tr></thead><tbody>{loading ? <LoadingRow cols={5} /> : fineBooks.length === 0 ? <EmptyRow cols={5} message='No fines pending' /> : fineBooks.map((b, i) => <tr key={b.id || i} style={{ borderBottom: '1px solid var(--color-border-tertiary)' }}><td style={{ padding: '10px 14px' }}>{b.name || b.title || `Book #${b.id}`}</td><td style={{ padding: '10px 14px' }}>{b.author || '—'}</td><td style={{ padding: '10px 14px' }}>{b.issuedTo || b.userId || '—'}</td><td style={{ padding: '10px 14px' }}>{b.issueDate ? new Date(b.issueDate).toLocaleDateString() : '—'}</td><td style={{ padding: '10px 14px', color: '#A32D2D', fontWeight: 600 }}>${b.fine || 0}</td></tr>)}</tbody></table>
      </div>
      <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--color-background-warning)', border: '1px solid var(--color-border-warning)', borderRadius: 10, fontSize: 12, color: 'var(--color-text-warning)' }}><strong>Fine policy:</strong> Missed renewal -> $100 | Missed subscription -> $100 | Both missed -> $200</div>
    </div>
  );
}
