import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './components/auth/LoginPage';
import Header from './components/common/Header';
import SpotifyWebPlayer from './components/page/SpotifyWebPlayer';
import ImportMusicGames from './components/page/ImportMusicGames';
import AdminMusicGamesCRUD from './components/page/AdminMusicGamesCRUD';
import AdminUser from './components/page/AdminUser';
import SongManager from './components/page/AdminSongs';
import ArtistManagement from './components/page/AdminArtist';
function App() {
    return (
        <BrowserRouter>
            <Header />
            <div className="App">
                <div className="content">
                    <Routes>
                        <Route exact path="/" element={<LoginPage />} />
                        <Route exact path="/musicgame" element={<ImportMusicGames />} />
                        <Route exact path="/profile" element={<SpotifyWebPlayer />} />
                        <Route exact path="/admin/musicgames" element={<AdminMusicGamesCRUD />} />
                        <Route exact path="/admin/managementeUser" element={<AdminUser />} />
                        <Route exact path="/admin/managementSongs" element={<SongManager />} />
                        <Route exact path="/admin/managementArtist" element={<ArtistManagement />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
