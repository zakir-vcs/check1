import React from 'react';
import { useState, useEffect } from 'react';
import Sidebar from './pages/Sidebar.jsx';
import SignInOverlay from './pages/SignInOverlay.jsx';
import MainContent from './pages/MainContent.jsx';
import './index.css';

function App() {
  // Initialize sidebar state from localStorage
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem('isSidebarOpen');
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  // Set initial active item to 'ChatMaX' instead of 'Home'
  const [activeNavItem, setActiveNavItem] = useState('ChatMaX');

  // State to manage the visibility of the sign-in overlay
  const [showSignInOverlay, setShowSignInOverlay] = useState(false);

  // New state variable to keep track of the logged-in user
  const [user, setUser] = useState(null);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isSidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignInClick = () => {
    setShowSignInOverlay(true);
  };

  const handleCloseSignInOverlay = () => {
    setShowSignInOverlay(false);
  };

  // New function to handle successful login
  const handleLoginSuccess = (email) => {
    setUser(email);
    setShowSignInOverlay(false);
  };

  const handleSignOut = () => {
    setUser(null);
    setActiveNavItem('ChatMaX'); // Redirect to ChatMaX after sign out
  };

  return (
    <div className="app-container flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        activeNavItem={activeNavItem}
        setActiveNavItem={setActiveNavItem}
        onSignInClick={handleSignInClick}
        user={user}
      />
      <MainContent 
        activeNavItem={activeNavItem} 
        user={user}
        onSignOut={handleSignOut}
      />
      {showSignInOverlay && (
        <SignInOverlay 
          onClose={handleCloseSignInOverlay} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;