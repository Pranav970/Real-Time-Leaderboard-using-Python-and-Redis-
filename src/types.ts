export interface User {
    id: string;
    email: string;
  }
  
  export interface Game {
    id: string;
    name: string;
    description: string;
  }
  
  export interface Score {
    game_id: string;
    score: number;
  }
  
  export interface LeaderboardEntry {
    username: string;
    game_name: string;
    score: number;
    rank: number;
  }