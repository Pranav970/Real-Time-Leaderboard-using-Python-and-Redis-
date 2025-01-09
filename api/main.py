from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt
import bcrypt
from typing import List, Optional
from .redis_client import RedisLeaderboard

app = FastAPI()
redis_lb = RedisLeaderboard()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT settings
SECRET_KEY = "your-secret-key"  # In production, use a secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# In-memory user storage (replace with proper database in production)
users = {}
games = {
    "1": {"id": "1", "name": "Space Shooter", "description": "Classic arcade space shooting game"},
    "2": {"id": "2", "name": "Puzzle Master", "description": "Brain-teasing puzzle challenges"},
    "3": {"id": "3", "name": "Speed Runner", "description": "Fast-paced platformer racing game"}
}

# Models
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class Score(BaseModel):
    game_id: str
    score: int

class LeaderboardEntry(BaseModel):
    username: str
    game_name: str
    score: int
    rank: int

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None or user_id not in users:
            raise HTTPException(status_code=401)
        return user_id
    except jwt.JWTError:
        raise HTTPException(status_code=401)

@app.post("/register")
async def register(user: UserCreate):
    if user.email in users:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_id = str(len(users) + 1)
    users[user_id] = {
        "id": user_id,
        "username": user.username,
        "email": user.email,
        "password_hash": hashed_password
    }
    return {"id": user_id, "username": user.username}

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = next((u for u in users.values() if u["email"] == form_data.username), None)
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token({"sub": user["id"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/scores")
async def submit_score(score: Score, current_user: str = Depends(get_current_user)):
    if score.game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    
    redis_lb.add_score(score.game_id, current_user, score.score)
    return {"status": "success"}

@app.get("/leaderboard")
async def get_leaderboard() -> List[LeaderboardEntry]:
    all_entries = []
    for game_id in games:
        top_scores = redis_lb.get_top_scores(game_id)
        for entry in top_scores:
            user = users.get(entry["user_id"])
            if user:
                rank = redis_lb.get_user_rank(game_id, entry["user_id"])
                all_entries.append(LeaderboardEntry(
                    username=user["username"],
                    game_name=games[game_id]["name"],
                    score=entry["score"],
                    rank=rank or 0
                ))
    
    return sorted(all_entries, key=lambda x: x.score, reverse=True)[:50]

@app.get("/user/scores")
async def get_user_scores(current_user: str = Depends(get_current_user)):
    scores = redis_lb.get_user_scores(current_user)
    return [
        {
            "game_name": games[score["game_id"]]["name"],
            "score": score["score"],
            "created_at": datetime.fromtimestamp(score["timestamp"]).isoformat()
        }
        for score in scores
        if score["game_id"] in games
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)