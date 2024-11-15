import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Form, FormControl, Button, Image } from 'react-bootstrap';
import { FaHome, FaBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import './Header.css';

const Header = () => {
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        UserService.logout();
        setUsername(null);
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="p-3 d-flex justify-content-between align-items-center">
            <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                <Image
                    src="path_to_spotify_logo"
                    alt="Logo"
                    width={35}
                    height={35}
                    className="me-2"
                />
                <span className="navbar-title">Your App Name</span>
            </Navbar.Brand>
            <Nav className="d-flex align-items-center">
                <Nav.Link as={Link} to="/" className="d-flex align-items-center me-3">
                    <FaHome size={20} className="me-2" />
                    Home
                </Nav.Link>
                <Form className="d-flex align-items-center me-3">
                    <FormControl
                        type="search"
                        placeholder="Bạn muốn phát nội dung gì?"
                        className="me-2"
                        aria-label="Search"
                    />
                </Form>
                <Button variant="outline-light" className="me-3">
                    Khám phá Premium
                </Button>
                <Nav.Link as={Link} to="#notifications" className="d-flex align-items-center me-3">
                    <FaBell size={20} />
                </Nav.Link>
                {username ? (
                    <>
                        <span className="text-white me-3">Hello, {username}</span>
                        <Button variant="outline-light" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <Nav.Link as={Link} to="/login" className="d-flex align-items-center">
                        <span className="login-text">Login</span>
                    </Nav.Link>
                )}
            </Nav>
        </Navbar>
    );
};

export default Header;
