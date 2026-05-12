import { useEffect, useState } from 'react';
import { api } from './api';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Books from './pages/Books';
import IssuedBooks from './pages/IssuedBooks';
import Fines from './pages/Fines';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard' },
  { id: 'users', label: 'Users', icon: 'ti-users' },
  { id: 'books', label: 'Books', icon: 'ti-book' },
  { id: 'issued', label: 'Issued Books', icon: 'ti-bookmark' },
  { id: 'fines', label: 'Fines', icon: 'ti-coin' },
];

function useToast() {
  const [message, setMessage] = useState(null);
  const show = (type, text) => { setMessage({ type, text }); setTimeout(() => setMessage(null), 3000); };
  return { message, show };
}

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]); const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]); const [fineBooks, setFineBooks] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false); const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingIssued, setLoadingIssued] = useState(false); const [loadingFines, setLoadingFines] = useState(false);
  const userToast = useToast(); const bookToast = useToast();

  const fetchUsers = async () => { setLoadingUsers(true); try { const d = await api.getUsers(); setUsers(d); } catch { setUsers([]); } setLoadingUsers(false); };
  const fetchBooks = async () => { setLoadingBooks(true); try { const d = await api.getBooks(); setBooks(d); } catch { setBooks([]); } setLoadingBooks(false); };
  const fetchIssued = async () => { setLoadingIssued(true); try { const d = await api.getIssuedBooks(); setIssuedBooks(d); } catch { setIssuedBooks([]); } setLoadingIssued(false); };
  const fetchFines = async () => { setLoadingFines(true); try { const d = await api.getFineBooks(); setFineBooks(d); } catch { setFineBooks([]); } setLoadingFines(false); };
  const refreshAll = async () => Promise.all([fetchUsers(), fetchBooks(), fetchIssued(), fetchFines()]);

  useEffect(() => { refreshAll(); }, []);

  const onAddUser = async (form) => {
    try {
      const payload = {
        id: String(Date.now()),
        name: form.name,
        email: form.email,
        role: 'student',
        membership: form.subscription,
        subscriptionDate: new Date().toISOString(),
      };
      await api.createUser(payload);
      userToast.show('success', 'User created successfully.');
      await fetchUsers();
      return true;
    } catch (e) {
      userToast.show('danger', e.message || 'Failed to create user.');
      return false;
    }
  };
  const onDeleteUser = async (id) => { try { await api.deleteUser(id); userToast.show('success', 'User deleted.'); await refreshAll(); } catch (e) { userToast.show('danger', e.message || 'Cannot delete user.'); } };
  const onAddBook = async (form) => {
    try {
      const payload = {
        id: String(Date.now()),
        name: form.name,
        author: form.author,
        genre: form.genre,
        price: Number(form.price),
        publisher: form.publisher || 'Unknown',
      };
      await api.createBook(payload);
      bookToast.show('success', 'Book added successfully.');
      await fetchBooks();
      return true;
    } catch (e) {
      bookToast.show('danger', e.message || 'Failed to add book.');
      return false;
    }
  };
  const onDeleteBook = async (id) => { try { await api.deleteBook(id); bookToast.show('success', 'Book deleted.'); await refreshAll(); } catch (e) { bookToast.show('danger', e.message || 'Cannot delete book.'); } };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-background-tertiary)', fontFamily: 'var(--font-sans)' }}>
      <style>{`:root{--font-sans:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;--color-background-tertiary:#f9fafb;--color-background-primary:#fff;--color-background-secondary:#f8fafc;--color-background-success:#e8f6f2;--color-background-warning:#fff7ed;--color-background-danger:#fdecec;--color-background-info:#edf4ff;--color-text-primary:#111827;--color-text-secondary:#6b7280;--color-text-success:#0F6E56;--color-text-warning:#9a640f;--color-text-danger:#A32D2D;--color-text-info:#185FA5;--color-border-secondary:#d1d5db;--color-border-tertiary:#e5e7eb;--color-border-warning:#f5d0a7;--color-border-danger:#f1a9a9;}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}body{margin:0}*{box-sizing:border-box}@media(max-width:900px){.responsive-two-col{grid-template-columns:1fr!important}}`}</style>
      <aside style={{ width: sidebarOpen ? 220 : 60, flexShrink: 0, background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 12px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 30, height: 30, borderRadius: 8, background: '#185FA5', display: 'grid', placeItems: 'center', color: '#fff' }}><i className='ti ti-building-library' /></div>{sidebarOpen ? <strong>LibraryMS</strong> : null}</div>
        <nav style={{ padding: 8, flex: 1 }}>{NAV_ITEMS.map((item) => <button key={item.id} onClick={() => setActive(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, padding: sidebarOpen ? '8px 10px' : '8px 0', justifyContent: sidebarOpen ? 'flex-start' : 'center', border: 'none', borderRadius: 8, cursor: 'pointer', background: active === item.id ? '#E6F1FB' : 'transparent', color: active === item.id ? '#185FA5' : '#6b7280' }}><i className={`ti ${item.icon}`} />{sidebarOpen ? item.label : null}</button>)}</nav>
        <button onClick={() => setSidebarOpen((v) => !v)} style={{ margin: 8, border: '1px solid #d1d5db', borderRadius: 8, background: 'none', padding: 8, cursor: 'pointer' }}><i className={`ti ${sidebarOpen ? 'ti-layout-sidebar-left-collapse' : 'ti-layout-sidebar-left-expand'}`} /></button>
      </aside>
      <main style={{ flex: 1 }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', borderBottom: '1px solid #e5e7eb', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}><div style={{ fontSize: 12, color: '#6b7280' }}>Library Management <i className='ti ti-chevron-right' /> <strong style={{ color: '#111827' }}>{NAV_ITEMS.find((x) => x.id === active)?.label}</strong></div><button onClick={refreshAll} style={{ border: '1px solid #d1d5db', borderRadius: 7, background: 'none', padding: '5px 10px', cursor: 'pointer' }}><i className='ti ti-refresh' /> Refresh</button></header>
        <div style={{ padding: 24 }}>
          {active === 'dashboard' ? <Dashboard users={users} books={books} issuedBooks={issuedBooks} fineBooks={fineBooks} /> : null}
          {active === 'users' ? <Users users={users} loading={loadingUsers} message={userToast.message} onAddUser={onAddUser} onDeleteUser={onDeleteUser} onGetSubscriptionDetails={api.getSubscriptionDetails} /> : null}
          {active === 'books' ? <Books books={books} loading={loadingBooks} message={bookToast.message} onAddBook={onAddBook} onDeleteBook={onDeleteBook} /> : null}
          {active === 'issued' ? <IssuedBooks issuedBooks={issuedBooks} loading={loadingIssued} /> : null}
          {active === 'fines' ? <Fines fineBooks={fineBooks} loading={loadingFines} /> : null}
        </div>
      </main>
    </div>
  );
}
