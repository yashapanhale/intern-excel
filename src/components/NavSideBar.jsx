import React from 'react';
import { Link } from 'react-router-dom';

const NavSideBar = ({
  children,
  data,
  setExcelData,
  setColumnNames,
  setSelectedX,
  setSelectedY,
  setUploadModelOpen,
  role = 'user' // default to user
}) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setExcelData && setExcelData([]);
    setColumnNames && setColumnNames([]);
    setSelectedX && setSelectedX('');
    setSelectedY && setSelectedY('');
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  };

  // Color schemes and hover effects
  const sidebarBg = role === 'admin' ? 'bg-indigo-600' : 'bg-gray-900';
  const linkHover = role === 'admin'
    ? 'hover:scale-110 transition-transform'
    : 'hover:text-yellow-400';
  const titleSize = 'text-2xl font-bold';

  // Links for each role
  const userLinks = [
    { name: 'Dashboard', to: '/dashboard' },
    { name: 'Upload History', to: '/upload-history' },
    { name: 'Upload File', isButton: true },
    { name: 'Settings', to: '/settings' }
  ];

  const adminLinks = [
    { name: 'Dashboard', to: '/admin/dashboard' },
    { name: 'Graph Section', to: '/admin/graphs' },
    { name: 'Upload History', to: '/admin/history' },
    { name: 'Upload File', isButton: true },
    { name: "User's List", to: '/admin/users' },
    { name: 'Settings', to: '/admin/settings' }
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <div className='flex h-screen'>
      {/* Sidebar Component */}
      <aside className={`w-64 ${sidebarBg} text-white p-6 space-y-6`}>
        <h1 className={titleSize}>VisEx</h1>
        <nav className='flex flex-col space-y-3'>
          {links.map(link =>
            link.isButton ? (
              <button
                key={link.name}
                onClick={() => setUploadModelOpen && setUploadModelOpen(true)}
                className={`text-left ${linkHover}`}
              >
                {link.name}
              </button>
            ) : (
              <Link
                key={link.name}
                to={link.to}
                className={linkHover}
              >
                {link.name}
              </Link>
            )
          )}
        </nav>
      </aside>

      <div className='flex-1 flex flex-col bg-gray-50'>
        {/* Navbar Component */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-800">
            Hello, <span className="text-indigo-600">{data?.user?.name || 'Guest'}</span>
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setUploadModelOpen && setUploadModelOpen(true)}
              className="text-base hover:scale-110 transition-transform"
              title="Upload File"
            >
              Upload File ⬆️
            </button>
            <button
              onClick={() => {}}
              className="text-base hover:scale-110 transition-transform"
              title="Toggle Dark Mode"
            >
              Toggle Dark Mode🌙
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Children for attaching other files: */}
        <main className='p-6 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
};

export default NavSideBar;