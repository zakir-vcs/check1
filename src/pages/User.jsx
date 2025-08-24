import React from 'react';

export default function User({ user, onSignOut }) {
    const getUserDisplayName = (email) => {
        return email ? email.split('@')[0] : '';
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-6">
            {/* Avatar Circle */}
            <div className="relative w-32 h-32 rounded-full bg-gray-800 border-2 border-primary flex items-center justify-center">
                <span className="text-6xl font-semibold text-primary">
                    {getUserDisplayName(user)?.charAt(0).toUpperCase()}
                </span>
            </div>

            {/* User Name */}
            <h1 className="text-3xl font-bold text-primary">
                {getUserDisplayName(user)}
            </h1>

            {/* Sign Out Button */}
            <button
                onClick={onSignOut}
                className="flex items-center gap-2 px-6 py-3 mt-4 bg-secondary text-white rounded-lg hover:bg-primary hover:text-black transition-all duration-200 ease-in-out"
            >
                <span>Sign Out</span>
                <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                </svg>
            </button>
        </div>
    );
}