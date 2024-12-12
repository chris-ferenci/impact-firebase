import React, {useState} from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full bg-gray-50 border-b-4 border-gray-900">
            <div className="flex justify-between items-center py-4 px-8">
                <Link to="/">
                    <h1 className="text-2xl text-gray-900 font-bold tracking-tighter">
                        <span className="text-rose-600 font-bold">impact</span>hub
                    </h1>
                </Link>

                {/* Hamburger/Close Button */}
                <button
                    className="md:hidden text-gray-900 focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-8 h-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-8 h-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    )}
                </button>

                {/* Desktop Menu */}
                <nav className="hidden md:flex md:items-center md:space-x-8">
                    <ul className="flex space-x-8">
                        {/* <li>
                            <Link
                                className="text-neutral-900 hover:text-neutral-900 hover:border-b-4 hover:border-neutral-900"
                                to="/jobs"
                            >
                                All Jobs
                            </Link>
                        </li> */}
                        <li>
                            <Link
                                className="text-neutral-900 hover:text-neutral-900 hover:border-b-4 hover:border-neutral-900"
                                to="/"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="text-neutral-900 hover:text-neutral-900 hover:border-b-4 hover:border-neutral-900"
                                to="/about"
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="text-rose-600 font-bold md:p-4 rounded hover:bg-rose-100 hover:text-rose-600"
                                to="/"
                            >
                                Support Us
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <nav className="md:hidden bg-gray-50  border-gray-900">
                    <ul className="flex flex-col space-y-4 py-4 px-8">
                        <li>
                            <Link
                                className="text-neutral-900 hover:text-neutral-900 hover:border-b-4 hover:border-neutral-900"
                                to="/jobs"
                                onClick={() => setMenuOpen(false)}
                            >
                                All Jobs
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="text-neutral-900 hover:text-neutral-900 hover:border-b-4 hover:border-neutral-900"
                                to="/about"
                                onClick={() => setMenuOpen(false)}
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="text-rose-600 font-bold md:p-4 md:border-b-4 md:border-rose-600 hover:bg-rose-600 hover:text-white"
                                to="/"
                                onClick={() => setMenuOpen(false)}
                            >
                                Post An Opportunity
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
}

export default Header;