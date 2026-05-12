export default function FormField({ label, error, as, children, ...props }) {
  return <div style={{ marginBottom: 10 }}><label style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>{label}</label>{as === 'select' ? <select {...props} style={{ width: '100%', height: 34 }}>{children}</select> : <input {...props} style={{ width: '100%', height: 34 }} />}{error ? <div style={{ color: '#A32D2D', fontSize: 12 }}>{error}</div> : null}</div>;
}
