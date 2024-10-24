export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string | null;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
}
