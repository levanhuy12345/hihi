import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function AdminArtistCRUD() {
    const [artists, setArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentArtist, setCurrentArtist] = useState(null);
    const [newArtist, setNewArtist] = useState({
        name: '',
        bio: '',
        profile_image_url: '',  // Profile image URL state
        created_at: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                setIsLoading(true);
                const response = await UserService.getAllArtists(localStorage.getItem('token'));
                setArtists(response.artistList || []);
                setIsLoading(false);
            } catch (err) {
                setError(err.message || "Failed to load artists.");
                setIsLoading(false);
            }
        };

        fetchArtists();
    }, []);

    const handleDeleteArtist = async (artistId) => {
        if (!artistId) {
            setError("Artist ID is missing.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this artist?")) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("Token is missing. Please log in again.");
                    return;
                }

                await UserService.deleteArtist(artistId, token);
                setArtists((prevArtists) => prevArtists.filter((artist) => artist.artist_id !== artistId));
            } catch (err) {
                setError(err.response?.data?.message || "Failed to delete artist.");
            }
        }
    };

    const handleEditArtist = (artist) => {
        setCurrentArtist(artist);
        setNewArtist({
            name: artist.name,
            bio: artist.bio || '',
            profile_image_url: artist.profile_image_url || '', // Ensure the image URL is properly set here
            created_at: artist.created_at
        });
        setIsEditing(true);
        setModalVisible(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewArtist((prevArtist) => ({
            ...prevArtist,
            [name]: value,
        }));
    };

    const validateNewArtist = () => {
        const { name, bio, profile_image_url } = newArtist;
        return name && bio && profile_image_url; // Make sure the URL field is checked
    };

    const handleSaveArtist = async () => {
        if (!validateNewArtist()) {
            setError("Please fill in all fields correctly, especially the image URL.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            let updatedArtist;

            if (isEditing && currentArtist && currentArtist.artist_id) {
                updatedArtist = await UserService.updateArtist(currentArtist.artist_id, newArtist, token);
                setArtists((prevArtists) =>
                    prevArtists.map((artist) => artist.artist_id === updatedArtist.artist_id ? updatedArtist : artist)
                );
            } else {
                const createdArtist = await UserService.createArtist(newArtist, token);
                setArtists((prevArtists) => [...prevArtists, createdArtist]);
            }

            resetModal();
        } catch (err) {
            setError(err.message || "Failed to save artist.");
        }
    };

    const resetModal = () => {
        setCurrentArtist(null);
        setIsEditing(false);
        setModalVisible(false);
        setNewArtist({
            name: '',
            bio: '',
            profile_image_url: '',  // Clear image URL field when closing modal
            created_at: ''
        });
        setError(null);
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="admin-artist-crud">
            <h1>Admin Artist CRUD</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="artist-list">
                <h2>Artist List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Picture</th>
                            <th>Bio</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {artists.map((artist) => (
                            <tr key={artist.artist_id}>
                                <td>{artist.artist_id}</td>
                                <td>{artist.name}</td>
                                <td><img src={artist.profile_image_url} alt={artist.name} width={50} /></td>
                                <td>{artist.bio || 'No bio available'}</td>
                                <td>{new Date(artist.created_at).toLocaleDateString()}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEditArtist(artist)}><FaEdit /> Edit</button>
                                    <button className="delete-btn" onClick={() => handleDeleteArtist(artist.artist_id)}><FaTrash /> Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={() => { resetModal(); setModalVisible(true); }}><FaPlus /> Create New Artist</button>
            </div>

            {modalVisible && (
                <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Edit Artist' : 'Create New Artist'}</h5>
                                <button type="button" className="close" onClick={resetModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <label>Name:
                                        <input type="text" name="name" value={newArtist.name} onChange={handleInputChange} />
                                    </label>
                                    <label>Bio:
                                        <textarea name="bio" value={newArtist.bio} onChange={handleInputChange}></textarea>
                                    </label>
                                    <label>Profile Image URL:
                                        <input type="text" name="profile_image_url" value={newArtist.profile_image_url} onChange={handleInputChange} />
                                    </label>
                                    {error && <p className="error-message">{error}</p>}
                                    {isEditing && (
                                        <div>
                                            <label>Created At:
                                                <input type="text" name="created_at" value={new Date(newArtist.created_at).toLocaleDateString()} disabled />
                                            </label>
                                        </div>
                                    )}
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleSaveArtist}>Save</button>
                                <button type="button" className="btn btn-secondary" onClick={resetModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminArtistCRUD;
