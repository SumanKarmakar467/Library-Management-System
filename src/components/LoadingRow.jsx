export default function LoadingRow({ cols }) {
  return <tr><td colSpan={cols} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)', fontSize: 14 }}><i className='ti ti-loader-2' style={{ fontSize: 20, display: 'block', margin: '0 auto 6px', animation: 'spin 1s linear infinite' }} />Loading...</td></tr>;
}
