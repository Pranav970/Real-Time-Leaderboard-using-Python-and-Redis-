import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface UserScore {
  game_name: string;
  score: number;
  created_at: string;
}

export function Profile() {
  const { user } = useAuth();
  const [scores, setScores] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserScores() {
      if (!user) return;

      const { data, error } = await supabase
        .from('scores')
        .select(`
          score,
          created_at,
          games:game_id (name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setScores(data.map(score => ({
          game_name: score.games.name,
          score: score.score,
          created_at: score.created_at
        })));
      }
      setLoading(false);
    }

    fetchUserScores();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-600">Please sign in to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Your Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{user.email}</p>
        </div>

        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900">Your Recent Scores</h4>
            {scores.length === 0 ? (
              <p className="mt-2 text-gray-500">No scores recorded yet.</p>
            ) : (
              <div className="mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {scores.map((score, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{score.game_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{score.score}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(score.created_at), 'MMM d, yyyy')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}