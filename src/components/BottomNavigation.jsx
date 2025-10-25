import React from 'react';

const BottomNavigation = ({ activeSection, onSectionChange }) => {
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'workout', icon: '💪', label: 'Workout' },
    { id: 'stats', icon: '📊', label: 'Stats' },
    { id: 'profile', icon: '👤', label: 'Profilo' }
  ];

  const handleClick = (sectionId, event) => {
    // Ripple effect
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = button.getBoundingClientRect();
    // Ridotto: ora usa solo la larghezza invece del massimo, e ridotto del 30%
    const size = rect.width * 0.7;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    setTimeout(() => ripple.remove(), 1000);
    
    // Change section
    onSectionChange(sectionId);
  };

  return (
    <>
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-slate-800 flex justify-around py-2 z-50 border-t border-slate-700/30" 
        style={{
          boxShadow: '0 -4px 12px rgba(0,0,0,0.3)'
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={(e) => handleClick(item.id, e)}
            className={`
              flex-1 flex flex-col items-center py-3 px-2 cursor-pointer transition-all duration-300
              relative overflow-hidden border-none bg-transparent
              ${activeSection === item.id ? 'text-blue-400' : 'text-slate-500'}
            `}
            style={{
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            {/* Linea indicatore sopra quando attivo */}
            <div 
              className="absolute top-0 left-1/2 h-[3px] rounded-b transition-all duration-300"
              style={{
                width: activeSection === item.id ? '60%' : '0',
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                transform: 'translateX(-50%)'
              }}
            />
            
            <div className="text-[26px] mb-1">{item.icon}</div>
            <div className="text-xs font-semibold">{item.label}</div>
          </button>
        ))}
      </nav>

      {/* Ripple CSS inline */}
      <style>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple-animation 1s ease-out;
          pointer-events: none;
        }

        @keyframes ripple-animation {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }

        nav button:active {
          transform: scale(0.9);
          background-color: rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </>
  );
};

export default BottomNavigation;
