const BASE_URL = 'http://localhost:3000';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || 'Request failed');
  return data;
}

export const api = {
  getUsers: async () => {
    const res = await request('/users');
    return Array.isArray(res) ? res : (res?.data || []);
  },
  createUser: (body) => request('/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  getSubscriptionDetails: async (id) => {
    const res = await request(`/users/subscription-details/${id}`);
    return res?.data || res;
  },

  getBooks: async () => {
    const res = await request('/books');
    return Array.isArray(res) ? res : (res?.data || []);
  },
  createBook: (body) => request('/books', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  deleteBook: (id) => request(`/books/${id}`, { method: 'DELETE' }),
  getIssuedBooks: async () => {
    try {
      const res = await request('/books/issued');
      return Array.isArray(res) ? res : (res?.data || []);
    } catch {
      const res = await request('/books/issued/for-users');
      return Array.isArray(res) ? res : (res?.data || []);
    }
  },
  getFineBooks: async () => {
    try {
      const res = await request('/books/issued/withFine');
      return Array.isArray(res) ? res : (res?.data || []);
    } catch {
      return [];
    }
  },
};
