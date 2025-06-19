import React from 'react';
import { Link } from 'react-router-dom';

const NavSideBar = ({ 
    children,
    data,
    setExcelData,
    setColumnNames,
    setSelectedX,
    setSelectedY,
    setUploadModelOpen}) => {
        const handleLogout = () => {
        localStorage.removeItem('token');
        setExcelData([]);
        setColumnNames([]);
        setSelectedX('');
        setSelectedY('');
        setTimeout(() => {
        window.location.href = '/login';
        }, 100);
        };
    return(
        <div className='flex h-screen'>
            {/*Sidebar Component:*/}
            <aside className='w-64 bg-gray-900 text-white p-6 space-y-6'>
                <h1 className='text-2xl font-bold'>VisEx</h1>
                <nav className='flex flex-col space-y-3'>
                    <Link to='/dashboard' className='hover:text-yellow-400'>Dashboard</Link>
                    <Link to='/upload-history' className='hover:text-yellow-400'>Upload History</Link>
                    <button onClick={() => setUploadModelOpen(true)}
                    className='text-left hover:text-yellow-400'>Upload File</button>
                    <Link className='hover:text-yellow-400'>Settings</Link>
                </nav>
            </aside>

            <div className='flex-1 flex flex-col bg-gray-50'>
                {/*Navbar Component:*/}
                <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
                    <h2 className="text-base font-semibold text-gray-800">
                        Hello, <span className="text-indigo-600">{data?.user?.name || 'Guest'}</span>
                    </h2>
                    <div className="flex items-center space-x-4">
                        <button 
                        onClick={() => setUploadModelOpen(true)} 
                        className="text-base hover:scale-110 transition-transform" 
                        title="Upload File"
                        >Upload File ⬆️</button>
                        <button 
                        onClick={() => {}} 
                        className="text-base hover:scale-110 transition-transform" 
                        title="Toggle Dark Mode">Toggle Dark Mode🌙</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={handleLogout}>Logout</button>
                    </div>
                </header>

                {/* Children for attaching other files: */}
                <main className='p-6 overflow-y-auto'>{children}</main>
            </div>
        </div>
    );
};

export default NavSideBar;