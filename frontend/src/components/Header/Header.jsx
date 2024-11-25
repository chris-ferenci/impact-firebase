import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className='grid grid-cols-2 place-items-center sticky top-0 z-40 w-full bg-gray-50 py-4 px-8 border-b-4 border-gray-900'>
            
            <Link className="justify-self-start" to="/">
            <h1 className=' text-2xl text-gray-900 font-bold tracking-tighter'>
                <span className='text-rose-600 font-bold '>impact</span>careers
            </h1>
            </Link>

            <div className='justify-self-end flex flex-row'>
                <ul className='flex gap-8'>
                    <li>
                        <Link className=' text-neutral-900' to="/jobs">All Jobs</Link>
                    </li>
                    {/* <li>
                        <Link className=' text-neutral-900' to="/about">About Us</Link>
                    </li> */}
                </ul>
                
                
            </div>

            {/* <div className="justify-self-center">
                <Link to="/hub">Opportunities Hub</Link>
            </div> */}

            {/* <div className='justify-self-end flex flex-row items-center gap-8'>

                <div>
                    <p>Saved Jobs</p>
                </div>

                <div className='flex flex-row items-center'>
                    <p className='mr-2'>Chris Ferenci</p>
                    <img className='circular-profile' src='https://i.pravatar.cc/64' />
                </div>

            </div> */}

          
            

        </header>
    );
}

export default Header;