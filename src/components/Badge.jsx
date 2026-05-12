export default function Badge({ type = 'info', children }) {
  const map = {
    success: { bg: 'var(--color-background-success)', color: 'var(--color-text-success)' },
    danger: { bg: 'var(--color-background-danger)', color: 'var(--color-text-danger)' },
    info: { bg: 'var(--color-background-info)', color: 'var(--color-text-info)' },
    warning: { bg: 'var(--color-background-warning)', color: 'var(--color-text-warning)' },
  };
  const s = map[type] || map.info;
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 999, display: 'inline-block' }}>{children}</span>;
}
