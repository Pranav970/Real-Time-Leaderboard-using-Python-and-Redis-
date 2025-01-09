import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface LeaderboardEntry {
  username: string;
  game_name: string;
  score: number;
  created_at: string;
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from('scores')
        .select(`
          score,
          created_at,
          profiles:user_id (username),
          games:game_id (name)
        `)
        .order('score', { ascending: false })
        .limit(50);

      if (!error && data) {
        setEntries(data.map(entry => ({
          username: entry.profiles.username,
          game_name: entry.games.name,
          score: entry.score,
          created_at: entry.created_at
        })));
      }
      setLoading(false);
    }

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="text-center">Loading leaderboard...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Global Leaderboard</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Top 50 scores across all games</p>
      </div>
      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.game_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.score}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(entry.created_at), 'MMM d, yyyy')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}