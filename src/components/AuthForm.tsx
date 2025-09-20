import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { RegisterData } from '@/types';

interface AuthFormProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (data: RegisterData) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onRegister }) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    display_name: '' 
  });

  const handleLogin = () => {
    onLogin(loginForm.username, loginForm.password);
  };

  const handleRegister = () => {
    onRegister(registerForm);
  };

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
};

export default AuthForm;