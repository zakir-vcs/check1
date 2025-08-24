import React from 'react';
import logoFull from '/src/assets/full-light-maxfinder-corner-152x32.svg';
import logoX from '/src/assets/X-light-logo-corner-32x32.svg';

// NavItem component encapsulates the navigation link styling and logic.
const NavItem = ({ icon, text, isActive, onClick, isSidebarOpen }) => {
  // Base classes for all nav items
  const baseClasses = "flex items-center no-underline mx-2.5 cursor-pointer list-none";
  const transitionClasses = "transition-all duration-200 ease-in-out";
  
  // Classes for hover state (only applies if not active)
  const hoverClasses = !isActive ? "hover:bg-[rgba(73,66,85,0.2)] hover:rounded-[6px] hover:px-3" : "";

  // Conditional classes based on the active state
  const activeStateClasses = isActive
    ? "bg-[rgba(73,66,85,0.6)] text-[rgba(233,221,255,0.8)] rounded-[4px] px-0 "
    : "text-text-secondary";

  // Consistent padding for both active and inactive states
  const paddingClasses = "py-2.5";

  // Dynamically sets icon classes for stroke color and margin
  const iconClasses = `w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out ${
    isActive ? "stroke-primary" : "stroke-text-secondary"
  } ${isSidebarOpen ? "mr-[10px]" : "mr-10"}`;

  // Fades and collapses the navigation text based on the sidebar state
  const textClasses = `whitespace-nowrap overflow-hidden transition-[width,opacity] duration-300 ease-in-out ${
    isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"
  }`;

  return (
    <li>
      <a
        href="#"
        onClick={onClick}
        className={`${baseClasses} ${transitionClasses} ${paddingClasses} ${activeStateClasses} ${hoverClasses}`}
      >
        {/* The SVG icon is cloned to inject the dynamic classes */}
        {React.cloneElement(icon, { className: iconClasses })}
        <span className={textClasses}>{text}</span>
      </a>
    </li>
  );
};


function Sidebar({ isOpen, toggleSidebar, activeNavItem, setActiveNavItem, onSignInClick, user }) {
  const handleNavItemClick = (e, itemName) => {
    e.preventDefault();
    setActiveNavItem(itemName);
  };

  const handleMouseEnter = () => {
    if (!isOpen) {
      toggleSidebar();
    }
  };

  const handleMouseLeave = () => {
    if (isOpen) {
      toggleSidebar();
    }
  };

  const handleUserClick = (e) => {
    e.preventDefault();
    if (user) {
      setActiveNavItem('User');
    }
  };

  // An array to define the navigation items for easier mapping
  const navItems = [
    {
      name: 'Mess',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 14l9-5-9-5-9 5 9 5zM3 17.998l9 5 9-5M3 12l9 5 9-5"></path>
        </svg>
      ),
    },
    {
      name: 'Hostels',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 12l9-9 9 9M5 10v9a2 2 0 002 2h10a2 2 0 002-2v-9"></path>
        </svg>
      ),
    },
     {
      name: 'Community',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 18a6 6 0 100-12 6 6 0 000 12zM12 22v-4M15 21h-6"></path>
        </svg>
      ),
    },
     {
      name: 'Health',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7l2 2 4-4"></path>
        </svg>
      ),
    },
    {
      name: 'ChatMaX',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>
      ),
    },
  ];

  const getUserDisplayName = (email) => {
    return email ? email.split('@')[0] : '';
  };

  return (
    <aside
      className={`relative flex flex-col h-screen bg-secondary text-text text-[15px] border-r border-[rgb(65,60,75)] transition-[width,min-width] duration-300 ease-in-out ${isOpen ? 'w-[220px] min-w-[220px]' : 'w-[50px] min-w-[50px]'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sidebar Header with Logo */}
      <div
        className={`relative text-left overflow-hidden whitespace-nowrap mb-[15px] transition-padding duration-300 ease-in-out after:content-[''] after:absolute after:bottom-[15px] after:left-[10px] after:right-[10px] after:h-[1px] after:bg-[rgb(65,60,75)] ${isOpen ? 'px-10 pb-[15px]' : 'px-[10px] pb-[15px]'}`}
      >
        <img
            src={isOpen ? logoFull : logoX}
            alt={isOpen ? "MMX Logo" : "X Logo"}
            className="h-13 w-32"
        />
      </div>

      {/* Navigation Section */}
      <nav className="flex-grow">
        <ul className="list-none p-1 m-0 -mt-2.5">
          {navItems.map((item) => (
             <NavItem
              key={item.name}
              icon={item.icon}
              text={item.name}
              isActive={activeNavItem === item.name}
              onClick={(e) => handleNavItemClick(e, item.name)}
              isSidebarOpen={isOpen}
            />
          ))}
        </ul>
      </nav>

      {/* Updated User Profile Section */}
      <div className={`text-center flex-shrink-0 mt-auto transition-all duration-300 ease-in-out ${isOpen ? 'p-2' : 'p-2'}`}>
        <div className="h-[1px] bg-[rgb(65,60,75)] mb-5 mx-[-10px]"></div>

        {user ? (
          <div 
            onClick={handleUserClick}
            className={`flex items-center gap-2 ${isOpen ? 'px-0 pb-2' : 'px-0 pb-2'} cursor-pointer hover:bg-[rgba(73,66,85,0.2)] rounded-lg p-2 transition-all duration-200`}
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
              {getUserDisplayName(user).charAt(0).toUpperCase()}
            </div>
            {isOpen && (
              <span className="text-left flex-1 text-primary truncate">
                {getUserDisplayName(user)}
              </span>
            )}
          </div>
        ) : (
          <>
            {isOpen && (
              <>
                <p className="text-text-secondary text-[0.85em] mb-[15px] leading-[1.4]">
                  In Progress. Sign in to unlock more features.
                </p>
                <button
                  className="group flex items-center justify-center gap-2 w-[calc(100%-40px)] mx-auto py-3 px-5 bg-surface text-primary border border-border rounded-xl font-semibold uppercase text-base cursor-pointer transition-all duration-200 ease-in-out hover:bg-primary hover:text-secondary hover:border-secondary hover:-translate-y-0.5 hover:shadow-[0_4px_10px_rgba(var(--primary-rgb),0.3)] focus:outline-none focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.5)] focus-visible:bg-primary focus-visible:text-text"
                  onClick={onSignInClick}
                >
                  <svg className="w-5 h-5 stroke-primary transition-all duration-200 ease-in-out group-hover:stroke-secondary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 4v16"></path>
                  </svg>
                  SIGN IN
                </button>
              </>
            )}
          </>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;