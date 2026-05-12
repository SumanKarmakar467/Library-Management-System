export default function StatCard({ icon, label, value, subtext, color = '#185FA5' }) {
  return (
    <div style={{ background: 'var(--color-background-primary)', border: '1px solid var(--color-border-tertiary)', borderRadius: 12, padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><i className={`ti ${icon}`} style={{ fontSize: 20, color }} /></div>
      <div>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{label}</p>
        <p style={{ margin: '2px 0 0', fontSize: 26, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.1 }}>{value}</p>
        {subtext ? <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-secondary)' }}>{subtext}</p> : null}
      </div>
    </div>
  );
}
