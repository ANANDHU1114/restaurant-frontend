import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading users');
    }
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/api/users/${userId}`, { role: newRole });
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating user');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axios.put(`/api/users/${userId}`, { status: newStatus });
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/api/users/${userId}`);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Error deleting user');
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h2>User Management</h2>
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <select
                  value={user.status}
                  onChange={(e) => handleStatusChange(user._id, e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}