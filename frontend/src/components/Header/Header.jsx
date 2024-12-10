import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className='flex flex-row items-center justify-between sticky top-0 z-40 w-full bg-gray-50 py-6 px-8 border-b-4 border-gray-900'>
            <div>
                <Link to="/">
                    <h1 className=' text-2xl text-gray-900 font-bold tracking-tighter'>
                        <span className='text-rose-600 font-bold '>impact</span>careers
                    </h1>
                </Link>
            </div>

            <div>
                <ul className='flex gap-8'>
                    <li>
                        <Link className=' text-neutral-900 hover:text-neutral-900 p-4 hover:border-b-4 hover:border-neutral-900' to="/jobs">All Jobs</Link>
                    </li>
                    <li>
                        <Link className=' text-neutral-900 hover:text-neutral-900 p-4 hover:border-b-4 hover:border-neutral-900' to="/about">About Us</Link>
                    </li>
                    <li>
                        <Link className='text-rose-600 border-b-4 p-4 font-bold  border-rose-600 hover:bg-rose-600 hover:text-white' to="/">Post An Opportunity</Link>
                    </li>
                </ul>
            </div>
        </header>
    );
}

export default Header;