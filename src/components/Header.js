import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="text-lg font-bold">
                    Learning Platform
                </Link>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/guides">Guides</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/admin">Admin</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;