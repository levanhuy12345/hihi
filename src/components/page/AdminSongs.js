import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService'; // Import UserService
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate
import AdminPage from './Adminpage';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,TextField } from '@mui/material';
const SongManager = () => {
    const [songs, setSongs] = useState([]);  // Ensure songs is an array
    const [song, setSong] = useState({
        id: '',
        title: '',
        artist: '',
        album: '',
        year: '',
        genre: '',
        duration: '',
        created_at: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const [titttle, setTitttle] = useState(0);

    // const song_id = useParams()
    const fetchSongs = async () => {
        setLoading(true);
        try {
            const data = await UserService.getAllSongs(token);
            console.log('Fetched songs:', data);  // Log dữ liệu để kiểm tra cấu trúc
            if (data && data.songDtoList && Array.isArray(data.songDtoList)) {
                setSongs(data.songDtoList);  // Dùng songDtoList từ dữ liệu trả về
            } else {
                setError('Unexpected data format');
            }
        } catch (err) {
            setError('Không thể tải bài hát. Vui lòng thử lại sau.');
        }
        setLoading(false);
    };
    

    useEffect(() => {
        fetchSongs();
    }, [titttle]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSong((prevSong) => ({ ...prevSong, [name]: value }));
    };

    const handleCreateSong = (e) => {
        e.preventDefault();
        try {
            
            // const createdSong = await UserService.createSong(song, token);
           const tittle = document.getElementById('tittle').value;
           const Lyric = document.getElementById('artist').value;
           const album = document.getElementById('album').value;
           const genre = document.getElementById('genre').value;
           const duration = document.getElementById('duration').value;
           const url = document.getElementById('url').value;
        // const created_at = document.getElementById('created').value;

        const payload = {title:tittle, genre, duration, audio_file_url:url,lyrics:Lyric,album:{albumId:album}};
        
        UserService.createSong(payload,token).then((results)=>{
            console.log(payload);
            console.log(results);
            setTitttle(titttle+1);
        }).catch((error)=>{
            console.log(error);
        })
        } catch (err) {
            setError('Failed to create song. Please try again later.');
        }
    };

    const handleUpdateSong = async (id) => {
        console.log(id);
        try {
            const updatedSong = await UserService.updateSong(id, song, token);
            setSongs(songs.map((s) => (s.id === song.id ? updatedSong : s)));
            setIsEditing(false);
            
            setSong({
                
                title: '',
                artist: '',
                album: '',
                genre: '',
                duration: '',
                created_at: '',
            
            }); // Clear 
        } catch (err) {
            setError('Failed to update song. Please try again later.');
        }
    };
// 
    const handleDeleteSong = async (id) => {
        
        try {
            await UserService.deleteSong(id, token);
            setSongs(songs.filter((s) => s.id !== id));
            setTitttle(titttle+1);
        } catch (err) {
            setError('Failed to delete song. Please try again later.');
        }
    };
//
    const handleEditSong = (song) => {
        setSong(song);
        setIsEditing(true);
    };

    return (
        <div style={{display:'flex'}}>
             <AdminPage/>
        <div>
            <h1>Song Management</h1>

            {/* Error message */}
            {error && <div className="error">{error}</div>}

            {/* Song list */}
            {loading ? (
                <p>Loading songs...</p>
            ) : (
                <div>
                    {/* Table to display songs */}
                    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Album</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Lyric</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Genre</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
                            {songs.map((song) => (
            <TableRow key={song.song_id}>
              <TableCell>{song.song_id}</TableCell>
              <TableCell>{song.album && song.album.albumId?song.album.albumId:null}</TableCell>
              <TableCell>{song.title}</TableCell>
              <TableCell>{song.lyrics}</TableCell>
              <TableCell>{song.audio_file_url}</TableCell>
              <TableCell>{song.genre}</TableCell>
              <TableCell>{song.duration}</TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteSong(song.song_id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
                            ))}
        </TableBody>
      </Table>
    </TableContainer>
                    {/* Song form for creating or editing */}
                    <div>
                        <h2>{isEditing ? 'Edit Song' : 'Add New Song'}</h2>
                        <TextField
                            type="text"
                            name="title"
                            placeholder="Song Title"
                            id='tittle'
                            onChange={handleInputChange}
                        />
                        <TextField
                            type="text"
                            name=""
                            placeholder="liycs"
                           id='artist'
                            onChange={handleInputChange}
                        />
                        <TextField
                            type="text"
                            name="album"
                            placeholder="Album"
                           id='album'
                            onChange={handleInputChange}
                        />
                        <TextField
                            type="text"
                            name="url"
                            placeholder="url"
                            id='url'
                            onChange={handleInputChange}
                        />
                        <TextField
                            type="text"
                            name="genre"
                            placeholder="Genre"
                            id='genre'
                            onChange={handleInputChange}
                        />
                        <TextField
                            type="number"
                            name="duration"
                            placeholder="Duration (in seconds)"
                            id='duration'
                            onChange={handleInputChange}
                        />
                        {/* <input
                            type="text"
                            name="created_at"
                            placeholder="Created At"
                            id='created_at'
                            onChange={handleInputChange}
                            
                        /> */}
                        {/* <input
                            type="text"
                            name="updated_at"
                            placeholder="Updated At"
                            id='updated_at'
                            onChange={handleInputChange}
                            disabled
                        /> */}

                        {isEditing ? (
                            <button onClick={()=>handleUpdateSong()}>Update Song</button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={(e)=>{handleCreateSong(e)}}>Create Song</Button>
                        )}
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default SongManager;