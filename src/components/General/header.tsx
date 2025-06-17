import React from 'react';

const Header: React.FC = () => {
    return (
        <header style={{ padding: '1rem', textAlign: 'center', background: '#f5f5f5' }}>
            <p>&copy; {new Date().getFullYear()} GVBooking. All rights reserved.</p>
        </header>
    );
};

export default Header;