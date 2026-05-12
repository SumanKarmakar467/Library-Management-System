export default function EmptyRow({ cols, message }) { return <tr><td colSpan={cols} style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>{message}</td></tr>; }
