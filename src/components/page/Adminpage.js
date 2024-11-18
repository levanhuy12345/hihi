import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminPage() {
  // Các style sẽ được áp dụng inline
  const sidebarStyle = {
    width: '300px',
    backgroundColor: '#2c3e50',
    color: 'white',
    paddingTop: '20px',  // Sidebar cố định
    height: '100vh',
    zIndex: 1000, // Đảm bảo sidebar luôn hiển thị trên các phần tử khác
  };

  const ulStyle = {
    listStyleType: 'none',
    padding: 0,
  };

  const liStyle = {
    padding: '10px',
    marginBottom: '10px',
    textAlign: 'center',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    display: 'block',
    fontSize: '16px',
    fontWeight: '500',
  };

  const liHoverStyle = {
    backgroundColor: '#34495e', // Khi hover
  };

  const contentStyle = {
    backgroundColor: '#ecf0f1', // Màu nền cho content
    height: '100vh', // Đảm bảo content chiếm hết chiều cao màn hình
    overflowY: 'auto', // Cho phép cuộn khi nội dung dài
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <ul style={ulStyle}>
        <li style={liStyle}>
            <Link to="/admin/album" style={linkStyle}>
              Quản lý album
            </Link>
          </li>
          <li style={liStyle}>
            <Link to="/admin/musicgames" style={linkStyle}>
              Quản lý Music Games
            </Link>
          </li>
          <li style={liStyle}>
            <Link to="/admin/managementeUser" style={linkStyle}>
              Quản lý User
            </Link>
          </li>
          <li style={liStyle}>
            <Link to="/admin/managementSongs" style={linkStyle}>
              Quản lý Songs
            </Link>
          </li>
          <li style={liStyle}>
            <Link to="/admin/managementArtist" style={linkStyle}>
              Quản lý Artist
            </Link>
          </li>
        </ul>
      </div>

      {/* Content */}
      <div style={contentStyle}>
      </div>
    </div>
  );
}
