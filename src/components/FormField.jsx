export default function FormField({ label, error, as, children, ...props }) {
  const style = { width: '100%', padding: '7px 10px', borderRadius: 8, border: error ? '1px solid var(--color-border-danger)' : '1px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)', fontSize: 14, boxSizing: 'border-box' };
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4, color: 'var(--color-text-secondary)' }}>{label}</label>
      {as === 'select' ? <select {...props} style={style}>{children}</select> : <input {...props} style={style} />}
      {error ? <p style={{ margin: '5px 0 0', fontSize: 12, color: 'var(--color-text-danger)' }}>{error}</p> : null}
    </div>
  );
}
