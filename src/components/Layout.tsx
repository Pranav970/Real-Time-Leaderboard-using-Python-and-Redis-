import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Trophy, Home, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900">
                <Home className="h-6 w-6" />
                <span className="ml-2">Home</span>
              </Link>
              <Link to="/leaderboard" className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900">
                <Trophy className="h-6 w-6" />
                <span className="ml-2">Leaderboard</span>
              </Link>
            </div>
            <div className="flex items-center">
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900">
                    <User className="h-6 w-6" />
                    <span className="ml-2">Profile</span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900"
                  >
                    <LogOut className="h-6 w-6" />
                    <span className="ml-2">Sign Out</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900">
                  <LogIn className="h-6 w-6" />
                  <span className="ml-2">Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}