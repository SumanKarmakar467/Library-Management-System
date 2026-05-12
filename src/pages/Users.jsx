import { useState } from 'react';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import LoadingRow from '../components/LoadingRow';
import EmptyRow from '../components/EmptyRow';

const SUB = { Basic: { bg: '#E6F1FB', text: '#0C447C' }, Standard: { bg: '#EAF3DE', text: '#3B6D11' }, Premium: { bg: '#FAEEDA', text: '#854F0B' } };

export default function Users({ users, loading, message, onAddUser, onDeleteUser, onGetSubscriptionDetails }) {
  const [showAdd, setShowAdd] = useState(false); const [showSub, setShowSub] = useState(false);
  const [subData, setSubData] = useState(null); const [subLoading, setSubLoading] = useState(false);
  const [search, setSearch] = useState(''); const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subscription: 'Basic' }); const [errors, setErrors] = useState({});
  const filtered = users.filter((u) => (u.name || u.username || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase()));

  const create = async () => {
    const e = {}; if (!form.name.trim()) e.name = 'Name is required'; if (!form.email.trim()) e.email = 'Email is required'; setErrors(e); if (Object.keys(e).length) return;
    setSaving(true);
    try {
      const ok = await onAddUser(form);
      if (ok) {
        setShowAdd(false);
        setForm({ name: '', email: '', subscription: 'Basic' });
      }
    } finally { setSaving(false); }
  };
  const del = async (id) => { if (window.confirm('Delete this user?')) await onDeleteUser(id); };
  const loadSub = async (id) => { setShowSub(true); setSubLoading(true); try { setSubData(await onGetSubscriptionDetails(id)); } catch (err) { setSubData({ error: err.message }); } finally { setSubLoading(false); } };

  return <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', gap: 10, flexWrap: 'wrap' }}><h1 style={{ margin: 0, fontSize: 22 }}>Users</h1><div style={{ display: 'flex', gap: 8 }}><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search users...' style={{ height: 32, borderRadius: 8, border: '1px solid var(--color-border-secondary)', padding: '0 10px' }} /><button onClick={() => setShowAdd(true)} style={{ height: 32, border: 'none', borderRadius: 8, padding: '0 12px', color: '#fff', background: '#185FA5' }}>Add User</button></div></div>
    {message ? <div style={{ marginBottom: 12, padding: '9px 14px', borderRadius: 8, background: message.type === 'success' ? 'var(--color-background-success)' : 'var(--color-background-danger)', color: message.type === 'success' ? 'var(--color-text-success)' : 'var(--color-text-danger)', fontSize: 13 }}>{message.text}</div> : null}
    <div style={{ background: '#fff', border: '1px solid var(--color-border-tertiary)', borderRadius: 12, overflow: 'hidden' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ background: 'var(--color-background-secondary)' }}>{['User', 'Email', 'Subscription', 'Actions'].map((h) => <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, color: 'var(--color-text-secondary)' }}>{h}</th>)}</tr></thead><tbody>{loading ? <LoadingRow cols={4} /> : filtered.length === 0 ? <EmptyRow cols={4} message='No users found' /> : filtered.map((u, i) => <tr key={u.id || i} style={{ borderBottom: '1px solid var(--color-border-tertiary)' }}><td style={{ padding: '10px 14px' }}>{u.name || u.username || `User #${u.id}`}</td><td style={{ padding: '10px 14px' }}>{u.email || '—'}</td><td style={{ padding: '10px 14px' }}>{(u.subscription || u.membership) ? <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: SUB[u.subscription || u.membership]?.bg, color: SUB[u.subscription || u.membership]?.text }}>{u.subscription || u.membership}</span> : '—'}</td><td style={{ padding: '10px 14px' }}><button onClick={() => loadSub(u.id)} style={{ marginRight: 6 }}>Sub</button><button onClick={() => del(u.id)}>Delete</button></td></tr>)}</tbody></table></div>

    {showAdd ? <Modal title='Add New User' onClose={() => setShowAdd(false)}><FormField label='Full Name' value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} /><FormField label='Email' value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} /><FormField label='Subscription' as='select' value={form.subscription} onChange={(e) => setForm({ ...form, subscription: e.target.value })}><option value='Basic'>Basic (3 months)</option><option value='Standard'>Standard (6 months)</option><option value='Premium'>Premium (12 months)</option></FormField><div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}><button onClick={() => setShowAdd(false)}>Cancel</button><button onClick={create}>{saving ? 'Saving...' : 'Create User'}</button></div></Modal> : null}
    {showSub ? <Modal title='Subscription Details' onClose={() => setShowSub(false)}>{subLoading ? 'Loading...' : subData?.error ? <span style={{ color: '#A32D2D' }}>{subData.error}</span> : <div>{[['Subscription Type', subData?.subscriptionType || '—'], ['Subscribed On', subData?.subscriptionDate || '—'], ['Valid Until', subData?.validTill || '—'], ['Fine', subData?.fine != null ? `$${subData.fine}` : 'None']].map(([k, v]) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--color-border-tertiary)' }}><span>{k}</span><strong>{v}</strong></div>)}</div>}</Modal> : null}
  </div>;
}
