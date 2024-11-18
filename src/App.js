import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './components/auth/LoginPage';
import Header from './components/common/Header';
import SpotifyWebPlayer from './components/page/SpotifyWebPlayer';
import ImportMusicGames from './components/page/ImportMusicGames';
import AdminMusicGamesCRUD from './components/page/AdminMusicGamesCRUD';
import AdminUser from './components/page/AdminUser';
import SongManager from './components/page/AdminSongs';
import ArtistManagement from './components/page/AdminArtist';
import UserService from './components/service/UserService';
import ProfilePage from './components/userspage/ProfilePage';
import AdminPage from './components/page/Adminpage';
import AdminAlbum from './components/page/AdminAlbum';

function App() {
    const [profileInfo, setProfileInfo] = useState({});
    useEffect(() => {
        const fetchProfileInfo = async () => {
           try {
              const token = localStorage.getItem("token");
              if (!token) {
                 throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
              }
              const response = await UserService.getYourProfile(token);
              setProfileInfo(response.user);
              console.log(response);
     
           } catch (error) {
              console.error("Error fetching profile information:", error.message || error);
           }
        };
        fetchProfileInfo();
     }, []);

    return (
        <BrowserRouter>
            <Header />
            <div className="App">
                <div className="content">
                    <Routes>
                        <Route path='/profilepage' element={<ProfilePage/>}/>
                        <Route exact path="/" element={<LoginPage />} />
                        <Route exact path="/musicgame" element={<ImportMusicGames />} />
                        <Route exact path="/profile" element={<SpotifyWebPlayer />} />
                        {/* admin */}
                        <Route path='/admin/album' element={<AdminAlbum/>}/>
                        <Route path='/adminpage' element={<AdminPage/> } />
                        <Route path='/admin' element={<AdminUser/>} /> {/*quản lí táp vụ admin */}
                        <Route exact path="/admin/musicgames" element={<AdminMusicGamesCRUD />} />
                        <Route exact path="/admin/managementeUser" element={<AdminUser />} />  {/*done*/}
                        <Route exact path="/admin/managementSongs" element={<SongManager />} />
                        <Route exact path="/admin/managementArtist" element={<ArtistManagement />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
