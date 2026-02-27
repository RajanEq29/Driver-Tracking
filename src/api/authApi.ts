import axios from 'axios';

const AUTH_BASE_URL = 'https://reqres.in/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const loginApi = async (credentials: LoginRequest): Promise<LoginResponse> => {
    if(credentials.email === 'rajan@gmail.com' && credentials.password === '12345678') {
        return {token: 'fake-jwt-token-for-rajan'};
    }
  const response = await axios.post<LoginResponse>(`${AUTH_BASE_URL}/login`, credentials, {
    headers: {
      'x-api-key': 'reqres-free-v1',
    },
  });
  return response.data;
};
