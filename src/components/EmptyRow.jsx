export default function EmptyRow({ cols, message }) {
  return <tr><td colSpan={cols} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-secondary)', fontSize: 14 }}><i className='ti ti-mood-empty' style={{ fontSize: 28, display: 'block', margin: '0 auto 8px', opacity: 0.4 }} />{message}</td></tr>;
}
