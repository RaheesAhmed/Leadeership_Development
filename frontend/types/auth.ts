export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  profileImage?: string;
  // ... any other user properties
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
}
