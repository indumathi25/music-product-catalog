import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSearchQuery } from '../store/slices/productSlice';

export function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const searchQuery = useAppSelector((state) => state.products.searchQuery);

    const showSearch = location.pathname === '/';

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchQuery(e.target.value));
    };

    return (
        <nav className="bg-gray-900 text-white sticky top-0 z-30 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 gap-8">
                    {/* Logo */}
                    <div
                        className="flex-shrink-0 flex items-center gap-3 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <img
                            src="/images/istockphoto.jpg"
                            alt="Fuga Music Logo"
                            className="h-10 w-10 rounded-full bg-gray-900 object-contain p-0.5"
                        />
                        <span className="text-2xl font-bold text-yellow-500 tracking-tight">FUGA</span>
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
                                    className="w-full bg-gray-800 text-white border-none rounded-md py-2 pl-10 pr-4 focus:ring-2 focus:ring-yellow-500 placeholder-gray-400"
                                    placeholder="Search by album name..."
                                    aria-label="Search"
                                />
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        {/* Mobile menu button */}
                        <div className="flex md:hidden items-center">
                            <button className="text-gray-300 hover:text-white p-2" aria-label="Open main menu">
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
