import redis
from typing import List, Dict, Optional

class RedisLeaderboard:
    def __init__(self):
        self.redis = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        
    def add_score(self, game_id: str, user_id: str, score: int) -> None:
        """Add or update a user's score in a game's leaderboard"""
        leaderboard_key = f"leaderboard:{game_id}"
        self.redis.zadd(leaderboard_key, {user_id: score})
        
        # Store score details
        score_key = f"score:{game_id}:{user_id}"
        self.redis.hset(score_key, mapping={
            "score": score,
            "timestamp": self.redis.time()[0]
        })
    
    def get_top_scores(self, game_id: str, limit: int = 50) -> List[Dict]:
        """Get top scores for a game"""
        leaderboard_key = f"leaderboard:{game_id}"
        top_users = self.redis.zrevrange(leaderboard_key, 0, limit-1, withscores=True)
        
        result = []
        for user_id, score in top_users:
            score_key = f"score:{game_id}:{user_id}"
            score_data = self.redis.hgetall(score_key)
            if score_data:
                result.append({
                    "user_id": user_id,
                    "score": int(score),
                    "timestamp": int(score_data.get("timestamp", 0))
                })
        return result
    
    def get_user_rank(self, game_id: str, user_id: str) -> Optional[int]:
        """Get user's rank in a game (0-based)"""
        leaderboard_key = f"leaderboard:{game_id}"
        rank = self.redis.zrevrank(leaderboard_key, user_id)
        return rank + 1 if rank is not None else None
    
    def get_user_scores(self, user_id: str) -> List[Dict]:
        """Get all scores for a user across all games"""
        scores = []
        for key in self.redis.scan_iter(f"score:*:{user_id}"):
            game_id = key.split(":")[1]
            score_data = self.redis.hgetall(key)
            if score_data:
                scores.append({
                    "game_id": game_id,
                    "score": int(score_data["score"]),
                    "timestamp": int(score_data["timestamp"])
                })
        return scores