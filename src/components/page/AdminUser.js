import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import AdminPage from './Adminpage';

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState(null);  // User being edited
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: '',
        avatar_url: ''  // Thêm field avatar
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    setError("User not authenticated. Please log in.");
                    setLoading(false);
                    return;
                }

                const userData = await UserService.getAllUsers(token);
                if (userData && userData.userList) {
                    setUsers(userData.userList);
                } else {
                    setError("No users found.");
                }
            } catch (err) {
                console.error("Failed to fetch users:", err);
                setError("Failed to fetch users. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setEditUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            role: user.role,
            avatar_url: user.avatar_url // Set avatar URL for editing
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await UserService.updateUser(editUser.user_id, formData, token);
            console.log("User updated successfully:", response);

           
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.user_id === editUser.user_id ? { ...user, ...formData } : user
                )
            );
            setEditUser(null);
        } catch (err) {
            console.error("Failed to update user:", err);
            setError("Failed to update user. Please try again later.");
        }
    };

    const handleDelete = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await UserService.deleteUser(userId, token);
            console.log("User deleted successfully:", response);

            setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userId));
        } catch (err) {
            console.error("Failed to delete user:", err);
            setError("Failed to delete user. Please try again later.");
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={{display:"flex"}} >
            <AdminPage>

            </AdminPage>
        <div>
            <h1>User Management</h1>
            <table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Avatar</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.user_id}>
                                <td>{user.user_id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td><img src={user.avatar_url} alt="Avatar" style={{ width: '50px', height: '50px' }}/></td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={() => handleEdit(user)}>Edit</button>
                                    <button onClick={() => handleDelete(user.user_id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal or form for editing */}
            {editUser && (
                <div className="edit-modal">
                    <h2>Edit User</h2>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <label>
                            Username:
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Avatar URL:
                            <input
                                type="text"
                                name="avatar_url"
                                value={formData.avatar_url}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Role:
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </label>
                        <button type="button" onClick={handleUpdate}>
                            Save Changes
                        </button>
                        <button type="button" onClick={() => setEditUser(null)}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
        </div>
    );
};

export default AdminUser;
