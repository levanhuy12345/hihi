import React, { useState, useEffect } from 'react';
import Axios from 'axios'; // Make sure Axios is installed

const AdminAlbum = () => {
    const [albums, setAlbums] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState(null); // To hold selected album for edit
    const [formData, setFormData] = useState({ title: '', artist: '', cover_image_url: '', release_date: '' }); // Album form data

    // Fetch albums on component mount
    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

                if (!token) {
                    setError("User not authenticated. Please log in.");
                    setLoading(false);
                    return;
                }

                // Make the API request
                const response = await Axios.get('http://localhost:1010/albums', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Pass token in headers
                    }
                });

                if (response.data && response.data.albumList) {
                    setAlbums(response.data.albumList); // Set the fetched albums to state
                } else {
                    setError("No albums found.");
                }
            } catch (err) {
                console.error("Failed to fetch albums:", err);
                setError("Failed to fetch albums. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAlbums();
    }, []); // Run this effect once when the component is mounted

    const handleCreate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await Axios.post(
                'http://localhost:1010/albums',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            setAlbums([...albums, response.data]); // Add the newly created album to the state
            setFormData({ title: '', artist: '', cover_image_url: '', release_date: '' }); // Reset form
        } catch (err) {
            console.error("Error creating album:", err);
            setError("Failed to create album. Please try again later.");
        }
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await Axios.put(
                `http://localhost:1010/albums/${selectedAlbum.album_id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            const updatedAlbums = albums.map((album) =>
                album.album_id === selectedAlbum.album_id ? response.data : album
            );
            setAlbums(updatedAlbums); // Update the album in the state
            setSelectedAlbum(null); // Clear selected album after updating
            setFormData({ title: '', artist: '', cover_image_url: '', release_date: '' }); // Reset form
        } catch (err) {
            console.error("Error updating album:", err);
            setError("Failed to update album. Please try again later.");
        }
    };

    const handleDelete = async (albumId) => {
        try {
            const token = localStorage.getItem('token');
            await Axios.delete(`http://localhost:1010/albums/${albumId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setAlbums(albums.filter((album) => album.album_id !== albumId)); // Remove the album from the state
        } catch (err) {
            console.error("Error deleting album:", err);
            setError("Failed to delete album. Please try again later.");
        }
    };

    const handleEdit = (album) => {
        setSelectedAlbum(album); // Set selected album for editing
        setFormData({
            title: album.title,
            artist: album.artist ? album.artist.name : '',
            cover_image_url: album.cover_image_url,
            release_date: album.release_date,
        });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Album Management</h1>
            <div>
                <h2>{selectedAlbum ? 'Edit Album' : 'Create Album'}</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <label>Artist:</label>
                    <input
                        type="text"
                        value={formData.artist}
                        onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    />
                    <label>Cover Image URL:</label>
                    <input
                        type="text"
                        value={formData.cover_image_url}
                        onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                    />
                    <label>Release Date:</label>
                    <input
                        type="date"
                        value={formData.release_date}
                        onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                    />
                    <button type="button" onClick={selectedAlbum ? handleUpdate : handleCreate}>
                        {selectedAlbum ? 'Update Album' : 'Create Album'}
                    </button>
                </form>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Album ID</th>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Cover Image</th>
                        <th>Release Date</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {albums.length > 0 ? (
                        albums.map((album) => (
                            <tr key={album.album_id}>
                                <td>{album.album_id}</td>
                                <td>{album.title}</td>
                                <td>{album.artist ? album.artist.name : 'Unknown'}</td>
                                <td>
                                    {album.cover_image_url ? (
                                        <img
                                            src={album.cover_image_url}
                                            alt={album.title}
                                            style={{ width: '50px', height: '50px' }}
                                        />
                                    ) : (
                                        <p>No image</p>
                                    )}
                                </td>
                                <td>{album.release_date}</td>
                                <td>{album.created_at}</td>
                                <td>
                                    <button onClick={() => handleEdit(album)}>Edit</button>
                                    <button onClick={() => handleDelete(album.album_id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No albums found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminAlbum;
