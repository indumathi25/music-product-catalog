import { Link } from 'react-router-dom';

export function NotFound() {
    return (
        <div role="main" className="py-24 text-center">
            <p className="text-6xl text-violet-600 font-bold" aria-hidden="true">
                404
            </p>
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">Page not found</h1>
            <p className="mt-2 text-gray-600">
                Sorry, we couldn't find the page you're looking for.
            </p>
            <div className="mt-10">
                <Link
                    to="/"
                    className="rounded-md bg-violet-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                >
                    Go back home
                </Link>
            </div>
        </div>
    );
}
