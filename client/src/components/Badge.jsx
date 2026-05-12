export default function Badge({ type = 'info', children }) {
  const map = {
    success: { bg: '#DCE9E6', color: '#0E6E63', border: '#C6DDD8' },
    danger: { bg: '#fdecec', color: '#A32D2D', border: '#f4c8c8' },
    info: { bg: '#edf4ff', color: '#185FA5', border: '#cdddf7' },
    warning: { bg: '#fff7ed', color: '#BA7517', border: '#f4d6a9' },
  };

  const s = map[type] || map.info;

  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontSize: 13,
        fontWeight: 500,
        padding: '6px 12px',
        borderRadius: 999,
        minWidth: 88,
        textAlign: 'center',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </span>
  );
}
