export interface User {
  id: number;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_verified: boolean;
}

export interface Post {
  id: number;
  user_id: number;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user?: User;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  display_name: string;
}

export interface SocialNetworkProps {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  activeTab: string;
  onLogin: (username: string, password: string) => void;
  onRegister: (data: RegisterData) => void;
  onCreatePost: (content: string) => void;
  onLikePost: (postId: number) => void;
  onLogout: () => void;
  setActiveTab: (tab: string) => void;
}