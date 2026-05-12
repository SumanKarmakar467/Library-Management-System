import LoadingRow from '../components/LoadingRow';
import EmptyRow from '../components/EmptyRow';

export default function IssuedBooks({ issuedBooks, loading }) {
  return (
    <div>
      <h1 style={{ margin: '0 0 0.25rem', fontSize: 22, fontWeight: 600 }}>Issued Books</h1>
      <p style={{ margin: '0 0 1.25rem', fontSize: 13, color: 'var(--color-text-secondary)' }}>{issuedBooks.length} books currently issued</p>
      <div style={{ background: 'var(--color-background-primary)', border: '1px solid var(--color-border-tertiary)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ background: 'var(--color-background-secondary)' }}>{['Book', 'Author', 'Issued To (User ID)', 'Issue Date', 'Return Date'].map((h) => <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border-tertiary)' }}>{h}</th>)}</tr></thead>
          <tbody>
            {loading ? <LoadingRow cols={5} /> : issuedBooks.length === 0 ? <EmptyRow cols={5} message='No books currently issued' /> : issuedBooks.map((b, i) => <tr key={b.id || i} style={{ borderBottom: '1px solid var(--color-border-tertiary)' }}><td style={{ padding: '10px 14px' }}>{b.name || b.title || `Book #${b.id}`}</td><td style={{ padding: '10px 14px' }}>{b.author || '—'}</td><td style={{ padding: '10px 14px' }}>{b.issuedTo || b.userId || '—'}</td><td style={{ padding: '10px 14px' }}>{b.issueDate ? new Date(b.issueDate).toLocaleDateString() : '—'}</td><td style={{ padding: '10px 14px' }}>{b.returnDate ? new Date(b.returnDate).toLocaleDateString() : <span style={{ color: '#BA7517' }}>Not returned</span>}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
