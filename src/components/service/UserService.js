import axios from "axios";

class UserService {
    static BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:1010"; // Use an environment variable

    static async login(username, password) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, { username, password });
            // Store the token and username in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username); // assuming the response contains the username
            return response.data;
        } catch (err) {
            console.error('Login Error:', err.response ? err.response.data : err.message);
            throw new Error('Login failed. Please check your credentials and try again.');
        }
    }
    static async getAllMusicGames(token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/musicgames`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data; 
        } catch (err) {
            console.error('Error fetching music games:', err.response ? err.response.data : err.message);
            throw new Error('Failed to fetch music games. Please try again later.');
        }
    }

    static async getMusicGameById(id, token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/musicgames/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.error('Error fetching music game by ID:', err.response ? err.response.data : err.message);
            throw new Error('Failed to fetch music game. Please try again later.');
        }
    }

    static async createMusicGame(gameData, token) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/musicgames`, gameData, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            console.log('Game created successfully:', response.data);
            
            // Kiểm tra nếu API trả về mảng hoặc đối tượng
            return Array.isArray(response.data) ? response.data : [response.data];  // Always return an array
            
        } catch (err) {
            console.error('Error creating music game:', err.response ? err.response.data : err.message);
            throw new Error(err.response?.data?.message || 'Failed to create music game. Please try again later.');
        }
    }
    
    

    static async updateMusicGame(id, updatedData, token) {
        try {
            const response = await axios.put(`${UserService.BASE_URL}/musicgames/${id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;  
        } catch (err) {
            if (err.response) {
                console.error('Error response data:', err.response.data);  
                console.error('Error response status:', err.response.status); 
            } else {
                console.error('Error message:', err.message);  
            }
            throw new Error('Failed to update music game. Please try again later.');
        }
    }
    
    

    static async deleteMusicGame(id, token) {
        try {
            const response = await axios.delete(`${UserService.BASE_URL}/musicgames/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.error('Error deleting music game:', err.response ? err.response.data : err.message);
            throw new Error('Failed to delete music game. Please try again later.');
        }
    }
    
    static async importAndCreateMusicGames(file, token) {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await axios.post(`${UserService.BASE_URL}/musicgames/importandcreate`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'multipart/form-data', 
                }
            });
            return response.data;
        } catch (err) {
            console.error('Error importing and creating music games:', err.response ? err.response.data : err.message);
            throw new Error('Failed to import and create music games. Please try again later.');
        }
    }
    
    

    static async getAllSongs(token) {
        try {
            const response = await axios.get(`${this.BASE_URL}/songs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data; // Assuming the API response is structured as shown
        } catch (error) {
            console.error("Error fetching songs:", error);
            throw new Error('Failed to fetch songs. Please try again later.');
        }
    }
    static async getSongById(id, token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/songs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data; // Return specific song data
        } catch (error) {
            console.error("Error fetching song by ID:", error);
            throw new Error('Failed to fetch song. Please try again later.');
        }
    }

    static async createSong(songData, token) {
        //
        try {
            const response = await axios.post(`${UserService.BASE_URL}/songs`, songData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Song created successfully:', response.data);
            return response.data; // Return created song data
        } catch (error) {
            console.error("Error creating song:", error);
            throw new Error('Failed to create song. Please try again later.');
        }
    }

    // static async updateSong(id, songData, token) {
    //     try {
    //         const response = await axios.put(`${UserService.BASE_URL}/songs/${id}`, songData, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
    //         console.log('Song updated successfully:', response.data);
    //         return response.data; // Return updated song data
    //     } catch (error) {
    //         console.error("Error updating song:", error);
    //         throw new Error('Failed to update song. Please try again later.');
    //     }
    // }
    static async updateSong(id, songData, token) {
        try {
            if (!token) {
                console.error("Authorization token is missing");
                throw new Error('Authorization token is required');
            }
            
            console.log("Updating song with ID:", id);
            const response = await axios.put(`${UserService.BASE_URL}/songs/${id}`, songData, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            console.log('Song updated successfully:', response.data);
            return response.data; // Return updated song data
        } catch (error) {
            console.error("Error updating song:", error.response ? error.response.data : error.message);
            throw new Error('Failed to update song. Please try again later.');
        }
    }
    
    static async deleteSong(id, token) {
        try {
            const response = await axios.delete(`${UserService.BASE_URL}/songs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Song deleted successfully:', response.data);
            return response.data; // Return success message or deleted data
        } catch (error) {
            console.error("Error deleting song:", error);
            throw new Error('Failed to delete song. Please try again later.');
        }
    }
    static async getAllArtists(token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/artists`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching artists:", error);
            throw new Error('Failed to fetch artists. Please try again later.');
        }
    }

    static async getArtistById(id, token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/artists/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching artist by ID:", error);
            throw new Error('Failed to fetch artist. Please try again later.');
        }
    }

    static async createArtist(artistData, token) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/artists`, artistData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Artist created successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error("Error creating artist:", error);
            throw new Error('Failed to create artist. Please try again later.');
        }
    }

    static async updateArtist(id, updatedData, token) {
        try {
            const response = await axios.put(`${UserService.BASE_URL}/artists/${id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.error("Error updating artist:", err.response ? err.response.data : err.message);
            throw new Error('Failed to update artist. Please try again later.');
        }
    }

    static async deleteArtist(id, token) {
        try {
            const response = await axios.delete(`${UserService.BASE_URL}/artists/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Artist deleted successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error("Error deleting artist:", error);
            throw new Error('Failed to delete artist. Please try again later.');
        }
    }
    static async register(userData, token) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.error('Registration Error:', err.response ? err.response.data : err.message);
            throw new Error('Registration failed. Please try again later.');
        }
    }

    static async verifyCode(email, code) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/verify`, { email, code });
            return response.data;
        } catch (err) {
            console.error('Verification Error:', err.response ? err.response.data : err.message);
            throw new Error('Verification failed. Please check the code and try again.');
        }
    }

    static async getAllUsers(token) {
        try {
            console.log('Fetching all users...');
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-all-users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('API Response:', response.data);
            return response.data;
        } catch (err) {
            console.error('Error fetching users:', err.response ? err.response.data : err.message);
            throw new Error('Failed to fetch users. Please check your network connection or try again later.');
        }
    }

    static async getYourProfile(token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.error('Error fetching profile:', err.response ? err.response.data : err.message);
            throw new Error('Failed to fetch profile. Please try again later.');
        }
    }

    static async getUserById(userId, token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.error('Error fetching user by ID:', err.response ? err.response.data : err.message);
            throw new Error('Failed to fetch user. Please try again later.');
        }
    }

    static async deleteUser(userId, token) {
        try {
            const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.error('Error deleting user:', err.response ? err.response.data : err.message);
            throw new Error('Failed to delete user. Please try again later.');
        }
    }

    static async updateUser(userId, userData, token) {
        try {
            const response = await axios.put(`${UserService.BASE_URL}/admin/update/${userId}`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.error('Error updating user:', err.response ? err.response.data : err.message);
            throw new Error('Failed to update user. Please try again later.');
        }
    }
    
    static async getAllAlbums(token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/albums`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching albums:", error);
            throw new Error('Failed to fetch albums. Please try again later.');
        }
    }

    static async getAlbumById(id, token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/albums/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching album by ID:", error);
            throw new Error('Failed to fetch album. Please try again later.');
        }
    }

    static async createAlbum(albumData, token) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/albums`, albumData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Error creating album:", error);
            throw new Error('Failed to create album. Please try again later.');
        }
    }

    static async updateAlbum(id, albumData, token) {
        try {
            const response = await axios.put(`${UserService.BASE_URL}/albums/${id}`, albumData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Error updating album:", error);
            throw new Error('Failed to update album. Please try again later.');
        }
    }

    static async deleteAlbum(id, token) {
        try {
            const response = await axios.delete(`${UserService.BASE_URL}/albums/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting album:", error);
            throw new Error('Failed to delete album. Please try again later.');
        }
    }
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }

    static isUser() {
        const role = localStorage.getItem('role');
        return role === 'USER';
    }

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }


}

export default UserService;
