const API_URL = 'http://localhost:8000';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface Score {
  game_id: number;
  score: number;
}

export async function login({ email, password }: LoginCredentials) {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  const response = await fetch(`${API_URL}/token`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to login');
  }

  return response.json();
}

export async function register(data: RegisterData) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to register');
  }

  return response.json();
}

export async function submitScore(score: Score, token: string) {
  const response = await fetch(`${API_URL}/scores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(score),
  });

  if (!response.ok) {
    throw new Error('Failed to submit score');
  }

  return response.json();
}

export async function getLeaderboard() {
  const response = await fetch(`${API_URL}/leaderboard`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }

  return response.json();
}

export async function getUserScores(token: string) {
  const response = await fetch(`${API_URL}/user/scores`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user scores');
  }

  return response.json();
}