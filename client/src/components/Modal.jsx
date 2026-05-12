export default function Modal({ title, onClose, children }) {
  return <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: 16 }}><div style={{ width: '100%', maxWidth: 520, background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 16 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><h3 style={{ margin: 0 }}>{title}</h3><button onClick={onClose}>x</button></div>{children}</div></div>;
}
