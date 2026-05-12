const BASE_URL = 'http://localhost:3000';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || 'Request failed');
  return data;
}

export const api = {
  getUsers: () => request('/users'),
  createUser: (body) => request('/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  getSubscriptionDetails: (id) => request(`/users/subscription-details/${id}`),

  getBooks: () => request('/books'),
  createBook: (body) => request('/books', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  deleteBook: (id) => request(`/books/${id}`, { method: 'DELETE' }),
  getIssuedBooks: () => request('/books/issued'),
  getFineBooks: () => request('/books/issued/withFine'),
};
