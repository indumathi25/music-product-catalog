import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import type { RootState, AppDispatch } from '../store';
import { setSearchQuery } from '../store/slices/productSlice';

export function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const searchQuery = useSelector((state: RootState) => state.products.searchQuery);
    const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const showSearch = location.pathname === '/';

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchQuery(e.target.value));
    };

    const handleLogin = () => {
        loginWithRedirect();
    };

    const handleLogout = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    return (
        <nav className="bg-gray-900 text-white sticky top-0 z-30 shadow-lg border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 gap-8">
                    {/* Logo */}
                    <div
                        className="flex-shrink-0 flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center p-0.5 group-hover:bg-yellow-400 transition-colors">
                            <img
                                src="/images/istockphoto.jpg"
                                alt="Fuga Music Logo"
                                className="h-full w-full rounded-full object-contain"
                            />
                        </div>
                        <span className="text-2xl font-black text-yellow-500 tracking-tighter group-hover:text-yellow-400 transition-colors">FUGA</span>
                    </div>

                    {/* Search Bar (Desktop) */}
                    {showSearch && (
                        <div className="hidden md:flex flex-1 max-w-2xl relative">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-full bg-gray-800 text-white border-none rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-yellow-500 placeholder-gray-400 transition-all font-medium text-sm"
                                    placeholder="Search by album name..."
                                    aria-label="Search"
                                />
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {!isLoading && (
                            isAuthenticated ? (
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-800 transition-all ring-1 ring-transparent hover:ring-gray-700 cursor-pointer"
                                        aria-label="User menu"
                                    >
                                        {user?.picture && !imgError ? (
                                            <img
                                                src={user.picture}
                                                alt={user.name ?? 'User avatar'}
                                                className="h-8 w-8 rounded-full border border-yellow-500 object-cover"
                                                onError={() => setImgError(true)}
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white border border-yellow-500">
                                                {(user?.name ?? user?.email ?? 'U')[0].toUpperCase()}
                                            </div>
                                        )}
                                        <svg className={`h-4 w-4 text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-4 py-2 border-b border-gray-800 mb-2">
                                                <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                                                <p className="text-sm font-bold text-white truncate">{user?.name || user?.email}</p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors flex items-center gap-2 cursor-pointer font-semibold"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Log out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={handleLogin}
                                    className="text-sm font-black text-gray-900 bg-yellow-500 hover:bg-yellow-400 active:scale-95 transition-all px-6 py-2 rounded-full cursor-pointer shadow-lg shadow-yellow-500/20"
                                    aria-label="Log in"
                                >
                                    Log in
                                </button>
                            )
                        )}

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button className="text-gray-300 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-all" aria-label="Open main menu">
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
