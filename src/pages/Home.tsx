import React from 'react';
import { Trophy, Gamepad2 } from 'lucide-react';

export function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Game Leaderboards</h1>
        <p className="text-xl text-gray-600">Compete, rank up, and become a champion!</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h2 className="text-2xl font-semibold ml-3">Global Rankings</h2>
          </div>
          <p className="text-gray-600">View global leaderboards and see how you rank against players worldwide.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Gamepad2 className="h-8 w-8 text-indigo-500" />
            <h2 className="text-2xl font-semibold ml-3">Multiple Games</h2>
          </div>
          <p className="text-gray-600">Compete in various games and track your progress across different challenges.</p>
        </div>
      </div>
    </div>
  );
}