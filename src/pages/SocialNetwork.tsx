import React, { useState, useEffect } from 'react';
import AuthForm from '@/components/AuthForm';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import MobileNavigation from '@/components/MobileNavigation';

interface User {
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

interface Post {
  id: number;
  user_id: number;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user?: User;
}

const SocialNetwork: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 1,
        username: 'maria_smile',
        display_name: 'Мария Иванова',
        bio: 'Фотограф и путешественница 📸✈️',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        followers_count: 1234,
        following_count: 456,
        posts_count: 89,
        is_verified: true
      },
      {
        id: 2,
        username: 'alex_dev',
        display_name: 'Алексей Петров',
        bio: 'Frontend разработчик | React | TypeScript',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        followers_count: 2341,
        following_count: 234,
        posts_count: 156,
        is_verified: false
      },
      {
        id: 3,
        username: 'natasha_art',
        display_name: 'Наташа Сидорова',
        bio: 'Художник и дизайнер 🎨',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Natasha',
        followers_count: 987,
        following_count: 567,
        posts_count: 203,
        is_verified: true
      }
    ];

    const mockPosts: Post[] = [
      {
        id: 1,
        user_id: 1,
        content: 'Прекрасный закат в Санкт-Петербурге! 🌅 #photography #sunset',
        image_url: 'https://picsum.photos/600/400?random=1',
        likes_count: 234,
        comments_count: 12,
        created_at: '2024-01-15T10:30:00Z',
        user: mockUsers[0]
      },
      {
        id: 2,
        user_id: 2,
        content: 'Новый проект на React готов! 🚀 Делитесь мнением',
        image_url: 'https://picsum.photos/600/400?random=2',
        likes_count: 89,
        comments_count: 5,
        created_at: '2024-01-14T15:20:00Z',
        user: mockUsers[1]
      },
      {
        id: 3,
        user_id: 3,
        content: 'Работа над новой картиной в процессе 🎨',
        image_url: 'https://picsum.photos/600/400?random=3',
        likes_count: 156,
        comments_count: 8,
        created_at: '2024-01-13T09:15:00Z',
        user: mockUsers[2]
      },
      {
        id: 4,
        user_id: 1,
        content: 'Доброе утро! Как дела? ☀️',
        likes_count: 45,
        comments_count: 3,
        created_at: '2024-01-12T08:00:00Z',
        user: mockUsers[0]
      },
      {
        id: 5,
        user_id: 2,
        content: 'TypeScript спасает мир разработки! ⚡',
        likes_count: 67,
        comments_count: 7,
        created_at: '2024-01-11T16:45:00Z',
        user: mockUsers[1]
      }
    ];

    setUsers(mockUsers);
    setPosts(mockPosts);
  }, []);

  const handleLogin = (username: string, password: string) => {
    const user = users.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  };

  const handleRegister = (data: {
    username: string;
    email: string;
    password: string;
    display_name: string;
  }) => {
    const newUser: User = {
      id: users.length + 1,
      username: data.username,
      display_name: data.display_name,
      bio: '',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      followers_count: 0,
      following_count: 0,
      posts_count: 0,
      is_verified: false
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
  };

  const createPost = (content: string) => {
    if (!content.trim() || !currentUser) return;
    
    const post: Post = {
      id: posts.length + 1,
      user_id: currentUser.id,
      content: content,
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
      user: currentUser
    };
    
    setPosts([post, ...posts]);
  };

  const likePost = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes_count: post.likes_count + 1 }
        : post
    ));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  if (!isLoggedIn) {
    return (
      <AuthForm 
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Sidebar currentUser={currentUser} users={users} />
          
          <MainContent 
            activeTab={activeTab}
            currentUser={currentUser}
            posts={posts}
            onCreatePost={createPost}
            onLikePost={likePost}
          />
        </div>
      </main>

      <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default SocialNetwork;