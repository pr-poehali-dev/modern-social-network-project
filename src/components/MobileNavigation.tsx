import React from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface MobileNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
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
  );
};

export default MobileNavigation;