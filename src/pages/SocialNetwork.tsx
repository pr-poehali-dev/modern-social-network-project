import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

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
  const [newPost, setNewPost] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    display_name: '' 
  });

  // Имитация загрузки данных
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

  const handleLogin = () => {
    const user = users.find(u => u.username === loginForm.username);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  };

  const handleRegister = () => {
    const newUser: User = {
      id: users.length + 1,
      username: registerForm.username,
      display_name: registerForm.display_name,
      bio: '',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${registerForm.username}`,
      followers_count: 0,
      following_count: 0,
      posts_count: 0,
      is_verified: false
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
  };

  const createPost = () => {
    if (!newPost.trim() || !currentUser) return;
    
    const post: Post = {
      id: posts.length + 1,
      user_id: currentUser.id,
      content: newPost,
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
      user: currentUser
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const likePost = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes_count: post.likes_count + 1 }
        : post
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="Users" size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">SocialNet</h1>
            <p className="text-gray-600">Современная социальная сеть</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="animate-scale-in">
                <CardHeader>
                  <h2 className="text-2xl font-semibold text-center">Войти в аккаунт</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Имя пользователя"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  />
                  <Input
                    type="password"
                    placeholder="Пароль"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  />
                  <Button 
                    onClick={handleLogin} 
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    Войти
                  </Button>
                  <div className="text-center text-sm text-gray-600">
                    Тест: используйте <code className="bg-gray-100 px-1 rounded">maria_smile</code>, <code className="bg-gray-100 px-1 rounded">alex_dev</code> или <code className="bg-gray-100 px-1 rounded">natasha_art</code>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="animate-scale-in">
                <CardHeader>
                  <h2 className="text-2xl font-semibold text-center">Создать аккаунт</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Имя пользователя"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                  />
                  <Input
                    placeholder="Отображаемое имя"
                    value={registerForm.display_name}
                    onChange={(e) => setRegisterForm({...registerForm, display_name: e.target.value})}
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  />
                  <Input
                    type="password"
                    placeholder="Пароль"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  />
                  <Button 
                    onClick={handleRegister} 
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    Зарегистрироваться
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={20} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-primary">SocialNet</h1>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              <Button 
                variant={activeTab === 'feed' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('feed')}
                className="flex items-center space-x-2"
              >
                <Icon name="Home" size={20} />
                <span>Лента</span>
              </Button>
              <Button 
                variant={activeTab === 'messages' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('messages')}
                className="flex items-center space-x-2"
              >
                <Icon name="MessageCircle" size={20} />
                <span>Сообщения</span>
              </Button>
              <Button 
                variant={activeTab === 'profile' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('profile')}
                className="flex items-center space-x-2"
              >
                <Icon name="User" size={20} />
                <span>Профиль</span>
              </Button>
              <Button 
                variant={activeTab === 'notifications' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('notifications')}
                className="flex items-center space-x-2"
              >
                <Icon name="Bell" size={20} />
                <span>Уведомления</span>
              </Button>
            </nav>

            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={currentUser?.avatar_url} />
                <AvatarFallback>{currentUser?.display_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                onClick={() => setIsLoggedIn(false)}
                size="sm"
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={currentUser?.avatar_url} />
                    <AvatarFallback>{currentUser?.display_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-1">
                      <h3 className="font-semibold">{currentUser?.display_name}</h3>
                      {currentUser?.is_verified && (
                        <Icon name="BadgeCheck" size={16} className="text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">@{currentUser?.username}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">{currentUser?.posts_count}</div>
                    <div className="text-xs text-gray-500">Постов</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{currentUser?.followers_count}</div>
                    <div className="text-xs text-gray-500">Подписчиков</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{currentUser?.following_count}</div>
                    <div className="text-xs text-gray-500">Подписок</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Быстрые действия</h4>
                  <div className="space-y-1">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Icon name="Camera" size={16} className="mr-2" />
                      Создать Story
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Icon name="Video" size={16} className="mr-2" />
                      Прямой эфир
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Icon name="Users" size={16} className="mr-2" />
                      Найти друзей
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'feed' && (
              <div className="space-y-6">
                {/* Create Post */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src={currentUser?.avatar_url} />
                        <AvatarFallback>{currentUser?.display_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Что у вас нового?"
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          className="min-h-[100px] border-0 resize-none focus-visible:ring-0"
                        />
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Icon name="Image" size={16} className="mr-1" />
                              Фото
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Icon name="Video" size={16} className="mr-1" />
                              Видео
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Icon name="Smile" size={16} className="mr-1" />
                              Эмодзи
                            </Button>
                          </div>
                          <Button 
                            onClick={createPost}
                            disabled={!newPost.trim()}
                            className="bg-primary hover:bg-primary/90"
                          >
                            Опубликовать
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts Feed */}
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post.id} className="animate-fade-in">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-3">
                          <Avatar>
                            <AvatarImage src={post.user?.avatar_url} />
                            <AvatarFallback>{post.user?.display_name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold">{post.user?.display_name}</h4>
                              {post.user?.is_verified && (
                                <Icon name="BadgeCheck" size={16} className="text-primary" />
                              )}
                              <span className="text-sm text-gray-500">@{post.user?.username}</span>
                              <span className="text-sm text-gray-500">·</span>
                              <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
                            </div>
                            
                            <p className="text-gray-900 mb-3">{post.content}</p>
                            
                            {post.image_url && (
                              <div className="mb-4">
                                <img 
                                  src={post.image_url} 
                                  alt="Post content" 
                                  className="w-full rounded-lg max-h-96 object-cover"
                                />
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-6">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => likePost(post.id)}
                                className="text-gray-500 hover:text-red-500"
                              >
                                <Icon name="Heart" size={16} className="mr-1" />
                                {post.likes_count}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                                <Icon name="MessageCircle" size={16} className="mr-1" />
                                {post.comments_count}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                                <Icon name="Repeat2" size={16} className="mr-1" />
                                Поделиться
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-500">
                                <Icon name="Bookmark" size={16} className="mr-1" />
                                Сохранить
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Сообщения</h2>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Icon name="MessageCircle" size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ваши сообщения</h3>
                    <p className="text-gray-500">Здесь будут отображаться ваши личные сообщения</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Профиль</h2>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={currentUser?.avatar_url} />
                      <AvatarFallback className="text-2xl">{currentUser?.display_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <h2 className="text-2xl font-bold">{currentUser?.display_name}</h2>
                      {currentUser?.is_verified && (
                        <Icon name="BadgeCheck" size={20} className="text-primary" />
                      )}
                    </div>
                    <p className="text-gray-500 mb-4">@{currentUser?.username}</p>
                    <p className="text-gray-700 mb-6">{currentUser?.bio || 'Пользователь еще не добавил описание'}</p>
                    
                    <div className="grid grid-cols-3 gap-8 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{currentUser?.posts_count}</div>
                        <div className="text-gray-500">Постов</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{currentUser?.followers_count}</div>
                        <div className="text-gray-500">Подписчиков</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{currentUser?.following_count}</div>
                        <div className="text-gray-500">Подписок</div>
                      </div>
                    </div>

                    <Button className="bg-primary hover:bg-primary/90">
                      Редактировать профиль
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Уведомления</h2>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Icon name="Bell" size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Уведомления</h3>
                    <p className="text-gray-500">Здесь будут отображаться ваши уведомления</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Suggested Users */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Рекомендации</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {users.filter(user => user.id !== currentUser?.id).slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>{user.display_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-1">
                            <p className="font-medium text-sm">{user.display_name}</p>
                            {user.is_verified && (
                              <Icon name="BadgeCheck" size={12} className="text-primary" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Подписаться
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Trending */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">В тренде</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <p className="font-medium">#photography</p>
                    <p className="text-sm text-gray-500">15.2K постов</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">#react</p>
                    <p className="text-sm text-gray-500">8.7K постов</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">#art</p>
                    <p className="text-sm text-gray-500">23.1K постов</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">#travel</p>
                    <p className="text-sm text-gray-500">12.3K постов</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 py-2">
          <Button 
            variant={activeTab === 'feed' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('feed')}
            className="flex flex-col items-center space-y-1 h-auto py-2"
          >
            <Icon name="Home" size={20} />
            <span className="text-xs">Лента</span>
          </Button>
          <Button 
            variant={activeTab === 'messages' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('messages')}
            className="flex flex-col items-center space-y-1 h-auto py-2"
          >
            <Icon name="MessageCircle" size={20} />
            <span className="text-xs">Чаты</span>
          </Button>
          <Button 
            variant={activeTab === 'notifications' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('notifications')}
            className="flex flex-col items-center space-y-1 h-auto py-2"
          >
            <Icon name="Bell" size={20} />
            <span className="text-xs">Уведомления</span>
          </Button>
          <Button 
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('profile')}
            className="flex flex-col items-center space-y-1 h-auto py-2"
          >
            <Icon name="User" size={20} />
            <span className="text-xs">Профиль</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SocialNetwork;