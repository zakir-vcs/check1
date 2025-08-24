import React from 'react';
import ChatMaX from './ChatMax';
import Community from './Community';
import Health from './Health';
import Hostels from './Hostels';
import Mess from './Mess';
import User from './User';

export default function MainContent({ activeNavItem, user, onSignOut }) {
  const renderContent = () => {
      switch (activeNavItem) {
        case 'ChatMaX':
            return <ChatMaX />;
        case 'Community':
            return <Community />;
        case 'Health':
            return <Health />;
        case 'Mess':
            return <Mess />;
        case 'Hostels':
            return <Hostels />;
        case 'User':
            return <User user={user} onSignOut={onSignOut} />;
          default:
              return (
                  <div className="flex items-center justify-center h-full">
                      <h1>Welcome to {activeNavItem}</h1>
                  </div>
              );
      }
  };

  return (
    <main className="flex-1 p-6">
      {renderContent()}
    </main>
  );
}