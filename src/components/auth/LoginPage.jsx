import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Link } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';
import PhoneIcon from '@mui/icons-material/Phone';
import { useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await UserService.login(username, password);
            console.log(userData); // Ensure to see the structure of userData
            if (userData.token) {
                localStorage.setItem('token', userData.token);
                localStorage.setItem('role', userData.role);
                if(userData.role === "USER"){
                    // chỗ này tí sửa lại vì cái profile page không ổn lắm
                    navigate('/profile')
                }else{
                    navigate('/adminpage')
                }
                ; // Redirect to profile page upon success
            } else {
                setError(userData.message);
            }
        } catch (error) {
            console.log(error);
            setError(error.message);
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#000',
                color: '#fff'
            }}
        >
            <Box
                sx={{
                    width: '400px',
                    backgroundColor: '#121212',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
                    animation: 'fadeIn 0.5s ease-in-out'
                }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    Đăng nhập vào streamingGAP
                </Typography>

                <Box mb={3}>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<GoogleIcon />}
                        sx={{ color: '#fff', borderColor: '#535353', mb: 1, '&:hover': { borderColor: '#fff' } }}
                    >
                        Tiếp tục bằng Google
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<FacebookIcon />}
                        sx={{ color: '#fff', borderColor: '#535353', mb: 1, '&:hover': { borderColor: '#fff' } }}
                    >
                        Tiếp tục bằng Facebook
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<AppleIcon />}
                        sx={{ color: '#fff', borderColor: '#535353', mb: 1, '&:hover': { borderColor: '#fff' } }}
                    >
                        Tiếp tục bằng Apple
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<PhoneIcon />}
                        sx={{ color: '#fff', borderColor: '#535353', '&:hover': { borderColor: '#fff' } }}
                    >
                        Tiếp tục bằng số điện thoại
                    </Button>
                </Box>

                <Typography variant="body1" align="center" gutterBottom>
                    hoặc
                </Typography>

                {error && <Typography variant="body2" color="error" align="center">{error}</Typography>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email hoặc tên người dùng"
                        variant="filled"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        InputProps={{ style: { backgroundColor: '#242424', color: '#fff' } }}
                        InputLabelProps={{ style: { color: '#b3b3b3' } }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Mật khẩu"
                        variant="filled"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{ style: { backgroundColor: '#242424', color: '#fff' } }}
                        InputLabelProps={{ style: { color: '#b3b3b3' } }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3, backgroundColor: '#1db954', '&:hover': { backgroundColor: '#1ed760' } }}
                    >
                        Đăng nhập
                    </Button>
                </form>

                <Link href="#" variant="body2" sx={{ display: 'block', mt: 2, color: '#b3b3b3' }}>
                    Quên mật khẩu của bạn?
                </Link>

                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Bạn chưa có tài khoản?{' '}
                    <Link href="/register" sx={{ color: '#fff' }}>
                        Đăng ký streamingGAP
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default LoginPage;