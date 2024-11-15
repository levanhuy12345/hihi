import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import '../css/ImportMusicGames.css'; // Assume there's a CSS file for styling
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Import icons from react-icons

function ImportMusicGames() {
    const [musicGames, setMusicGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // To store answers for each game
    const [score, setScore] = useState(null); // Set score to null initially
    const [currentGameIndex, setCurrentGameIndex] = useState(0); // Track current game index

    useEffect(() => {
        const fetchMusicGames = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Token not found.');

                const response = await UserService.getAllMusicGames(token);
                setMusicGames(response.musicGameList || []);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching music games:", err);
                setError(err.message || "Failed to load music games.");
                setIsLoading(false);
            }
        };

        fetchMusicGames();
    }, []);

    const handleAnswerSelect = (selectedAnswer) => {
        const currentGame = musicGames[currentGameIndex];
        setSelectedAnswers((prev) => ({
            ...prev,
            [currentGame.id]: selectedAnswer, // Set the answer for the current game
        }));
    };

    const handleSubmit = () => {
        let newScore = 0;
        musicGames.forEach((game) => {
            if (selectedAnswers[game.id] === game.correct_answer) {
                newScore += 1;
            }
        });
        setScore(newScore); // Set the score and hide questions after submission
    };

    const goToNextGame = () => {
        if (currentGameIndex < musicGames.length - 1) {
            setCurrentGameIndex(currentGameIndex + 1);
        }
    };

    const goToPreviousGame = () => {
        if (currentGameIndex > 0) {
            setCurrentGameIndex(currentGameIndex - 1);
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (musicGames.length === 0) {
        return <p>No music games available.</p>;
    }

    const currentGame = musicGames[currentGameIndex];

    return (
        <div className="music-game-container">
            <h1>Music Games</h1>
            {score === null ? ( 
                <>
                    <div className="game-navigation">
                        <button onClick={goToPreviousGame} disabled={currentGameIndex === 0}>
                            <FaChevronLeft /> Previous
                        </button>
                        <button onClick={goToNextGame} disabled={currentGameIndex === musicGames.length - 1}>
                            Next <FaChevronRight />
                        </button>
                    </div>
                    <div className="game-question">
                        <p>{currentGame.question_text}</p>
                        {[currentGame.answer_1, currentGame.answer_2, currentGame.answer_3, currentGame.answer_4].map((answer, index) => (
                            <div key={index}>
                                <input
                                    type="radio"
                                    name={`game-${currentGame.id}`}
                                    value={index + 1}
                                    checked={selectedAnswers[currentGame.id] === index + 1}
                                    onChange={() => handleAnswerSelect(index + 1)} 
                                />
                                {answer}
                            </div>
                        ))}
                    </div>
                    {currentGameIndex === musicGames.length - 1 && (
                        <button onClick={handleSubmit}>Submit Answers</button>
                    )}
                </>
            ) : (
                <h2>Your score is: {score}</h2> 
            )}
        </div>
    );
}

export default ImportMusicGames;
