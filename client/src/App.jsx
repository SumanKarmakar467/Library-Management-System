import { useEffect, useState } from 'react';
import { api } from './api';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Books from './pages/Books';
import IssuedBooks from './pages/IssuedBooks';
import Fines from './pages/Fines';

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Users' },
  { id: 'books', label: 'Books' },
  { id: 'issued', label: 'Issued Books' },
  { id: 'fines', label: 'Fines' },
];

export default function App() {
  const [active, setActive] = useState('users');
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [fineBooks, setFineBooks] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingIssued, setLoadingIssued] = useState(false);
  const [loadingFines, setLoadingFines] = useState(false);
  const [userMsg, setUserMsg] = useState(null);
  const [bookMsg, setBookMsg] = useState(null);

  const toast = (setFn, type, text) => { setFn({ type, text }); setTimeout(() => setFn(null), 3000); };

  const fetchUsers = async () => { setLoadingUsers(true); try { setUsers(await api.getUsers()); } catch { setUsers([]); } setLoadingUsers(false); };
  const fetchBooks = async () => { setLoadingBooks(true); try { setBooks(await api.getBooks()); } catch { setBooks([]); } setLoadingBooks(false); };
  const fetchIssued = async () => { setLoadingIssued(true); try { setIssuedBooks(await api.getIssuedBooks()); } catch { setIssuedBooks([]); } setLoadingIssued(false); };
  const fetchFines = async () => { setLoadingFines(true); try { setFineBooks(await api.getFineBooks()); } catch { setFineBooks([]); } setLoadingFines(false); };
  const refreshAll = async () => Promise.all([fetchUsers(), fetchBooks(), fetchIssued(), fetchFines()]);

  useEffect(() => { refreshAll(); }, []);

  const onAddUser = async (form) => {
    try {
      await api.createUser({ id: String(Date.now()), name: form.name, email: form.email, role: 'student', membership: form.subscription, subscriptionDate: new Date().toISOString() });
      toast(setUserMsg, 'success', 'User created successfully.');
      await fetchUsers();
      return true;
    } catch (e) { toast(setUserMsg, 'danger', e.message); return false; }
  };
  const onDeleteUser = async (id) => { try { await api.deleteUser(id); toast(setUserMsg, 'success', 'User deleted.'); await refreshAll(); } catch (e) { toast(setUserMsg, 'danger', e.message); } };
  const onAddBook = async (form) => { try { await api.createBook({ id: String(Date.now()), ...form, price: Number(form.price) }); toast(setBookMsg, 'success', 'Book added successfully.'); await fetchBooks(); return true; } catch (e) { toast(setBookMsg, 'danger', e.message); return false; } };
  const onDeleteBook = async (id) => { try { await api.deleteBook(id); toast(setBookMsg, 'success', 'Book deleted.'); await refreshAll(); } catch (e) { toast(setBookMsg, 'danger', e.message); } };
  const onIssueBook = async (payload) => { try { await api.issueBookToUser(payload); toast(setUserMsg, 'success', 'Book issued successfully.'); await refreshAll(); return true; } catch (e) { toast(setUserMsg, 'danger', e.message); return false; } };

  return <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
    <aside style={{ width: 220, borderRight: '1px solid #e5e7eb', padding: 10 }}>{NAV.map((n) => <button key={n.id} onClick={() => setActive(n.id)} style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: 6, padding: 8, border: 'none', borderRadius: 8, background: active === n.id ? '#e6f1fb' : 'transparent' }}>{n.label}</button>)}</aside>
    <main style={{ flex: 1, padding: 20 }}>
      {active === 'dashboard' ? <Dashboard users={users} books={books} issuedBooks={issuedBooks} fineBooks={fineBooks} /> : null}
      {active === 'users' ? <Users users={users} books={books} loading={loadingUsers} message={userMsg} onAddUser={onAddUser} onDeleteUser={onDeleteUser} onGetSubscriptionDetails={api.getSubscriptionDetails} onIssueBook={onIssueBook} /> : null}
      {active === 'books' ? <Books books={books} loading={loadingBooks} message={bookMsg} onAddBook={onAddBook} onDeleteBook={onDeleteBook} /> : null}
      {active === 'issued' ? <IssuedBooks issuedBooks={issuedBooks} loading={loadingIssued} /> : null}
      {active === 'fines' ? <Fines fineBooks={fineBooks} loading={loadingFines} /> : null}
    </main>
  </div>;
}
