import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Box } from '@mui/material';
import UserService from '../service/UserService';
import AdminPage from './Adminpage';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function AdminMusicGamesCRUD() {
    const [musicGames, setMusicGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentGame, setCurrentGame] = useState(null);

    const [newGame, setNewGame] = useState({
        question_text: '',
        answer_1: '',
        answer_2: '',
        answer_3: '',
        answer_4: '',
        correct_answer: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchMusicGames = async () => {
            try {
                setIsLoading(true); 
                const response = await UserService.getAllMusicGames(localStorage.getItem('token'));
                setMusicGames(response.musicGameList || []);
                setIsLoading(false); 
            } catch (err) {
                setError(err.message || "Failed to load music games.");
                setIsLoading(false); 
            }
        };
    
        fetchMusicGames();
    }, []); 
    
    const handleDeleteGame = async (gameId) => {
        if (!gameId) {
            setError("Game ID is missing.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this music game?")) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("Token is missing. Please log in again.");
                    return;
                }

                await UserService.deleteMusicGame(gameId, token);
                setMusicGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
                console.log("Game deleted successfully. Token in use:", token);

            } catch (err) {
                setError(err.response?.data?.message || "Failed to delete music game.");
                console.error("Error deleting music game:", err.response ? err.response.data : err.message);
            }
        }
    };

    const handleEditGame = (game) => {
        console.log('Selected game to edit:', game);  
        console.log('gameId type:', typeof game.id); 
    
        if (!game || !game.id) {
            console.error('Invalid game selected for editing:', game);
            setError('Invalid game selected for editing.');
            return;
        }
    
        setCurrentGame(game);
        setNewGame({
            question_text: game.question_text,
            answer_1: game.answer_1,
            answer_2: game.answer_2,
            answer_3: game.answer_3,
            answer_4: game.answer_4,
            correct_answer: game.correct_answer,
        });
        setIsEditing(true);
        setModalVisible(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGame((prevGame) => ({
            ...prevGame,
            [name]: name === 'correct_answer' ? Math.max(1, Math.min(4, Number(value))) : value,
        }));
    };

    const validateNewGame = () => {
        const { question_text, answer_1, answer_2, answer_3, answer_4, correct_answer } = newGame;
        return question_text && answer_1 && answer_2 && answer_3 && answer_4 && (correct_answer >= 1 && correct_answer <= 4);
    };

    const handleSaveGame = async () => {
        if (!validateNewGame()) {
            setError("Please fill in all fields correctly.");
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            let updatedGame;
    
            if (isEditing && currentGame && currentGame.id) {
                updatedGame = await UserService.updateMusicGame(currentGame.id, newGame, token);
                setMusicGames((prevGames) =>
                    prevGames.map((game) => game.id === updatedGame.id ? updatedGame : game)
                );
            } else {
                const gamesToCreate = Array.isArray(newGame) ? newGame : [newGame];
                const createdGames = await UserService.createMusicGame(gamesToCreate, token); 
          
                if (Array.isArray(createdGames)) {
                    setMusicGames((prevGames) => [...prevGames, ...createdGames]); 
                } else {
                    setMusicGames((prevGames) => [...prevGames, createdGames]);
                }
            }
    
            resetModal();
        } catch (err) {
            setError(err.message || "Failed to save music game.");
        }
    };
    
    const handleImportData = async () => {
        if (!selectedFile) {
            setError("Please select a file to import.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const importedData = await UserService.importAndCreateMusicGames(selectedFile, token);
            setMusicGames((prevGames) => [...prevGames, ...importedData.musicGameList]);
            setSelectedFile(null);
        } catch (err) {
            setError(err.message || "Failed to import data.");
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const resetModal = () => {
        setCurrentGame(null);
        setIsEditing(false);
        setModalVisible(false);
        setNewGame({
            question_text: '',
            answer_1: '',
            answer_2: '',
            answer_3: '',
            answer_4: '',
            correct_answer: '',
        });
        setError(null);
        setSelectedFile(null);
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div style={{display:'flex'}}>
            <AdminPage />
            <div style={{ width: '100%' }}>
            <h1>Admin Music Games CRUD</h1>
            {error && <p className="error-message">{error}</p>}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Question</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {musicGames.map((game) => (
                                <TableRow key={game.id}>
                                    <TableCell>{game.id}</TableCell>
                                    <TableCell>{game.question_text}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEditGame(game)}><FaEdit /> Edit</Button>
                                        <Button onClick={() => handleDeleteGame(game.id)}><FaTrash /> Delete</Button>
                                    </TableCell>
                                </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button onClick={() => { resetModal(); setModalVisible(true); }}><FaPlus /> Create New Game</Button>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                <Button onClick={handleImportData}>Import Data</Button>

                {modalVisible && (
                    <Box component="form" sx={{ mt: 2 }} onSubmit={(e) => e.preventDefault()}>
                        <TextField
                            fullWidth
                            label="Question"
                            name="question_text"
                            value={newGame.question_text}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Answer 1"
                            name="answer_1"
                            value={newGame.answer_1}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Answer 2"
                            name="answer_2"
                            value={newGame.answer_2}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Answer 3"
                            name="answer_3"
                            value={newGame.answer_3}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Answer 4"
                            name="answer_4"
                            value={newGame.answer_4}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Correct Answer (1-4)"
                            name="correct_answer"
                            value={newGame.correct_answer}
                            onChange={handleInputChange}
                            margin="normal"
                            type="number"
                        />
                        <Button onClick={handleSaveGame}>Save</Button>
                        <Button onClick={resetModal}>Cancel</Button>
                    </Box>
                )}
            </div>

            {modalVisible && (
                <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Edit Game' : 'Create New Game'}</h5>
                                <button type="button" className="close" onClick={resetModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <label>Question:<input type="text" name="question_text" value={newGame.question_text} onChange={handleInputChange} /></label>
                                    <label>Answer 1:<input type="text" name="answer_1" value={newGame.answer_1} onChange={handleInputChange} /></label>
                                    <label>Answer 2:<input type="text" name="answer_2" value={newGame.answer_2} onChange={handleInputChange} /></label>
                                    <label>Answer 3:<input type="text" name="answer_3" value={newGame.answer_3} onChange={handleInputChange} /></label>
                                    <label>Answer 4:<input type="text" name="answer_4" value={newGame.answer_4} onChange={handleInputChange} /></label>
                                    <label>Correct Answer (1-4):<input type="number" name="correct_answer" value={newGame.correct_answer} onChange={handleInputChange} /></label>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleSaveGame}>Save</button>
                                <button type="button" className="btn btn-secondary" onClick={resetModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminMusicGamesCRUD;
