import React from 'react';
// Importa le icone necessarie da lucide-react
import { LayoutDashboard, Dumbbell, BarChart3, MoreHorizontal } from 'lucide-react';

const BottomNavigation = ({ activeSection, onSectionChange }) => {
  // Array navItems (invariato)
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'workout', icon: Dumbbell, label: 'Workout' },
    { id: 'progresso', icon: BarChart3, label: 'Progresso' },
    { id: 'altro', icon: MoreHorizontal, label: 'Altro' }
  ];

  const handleClick = (sectionId, event) => {
    // === RIPPLE EFFECT ===
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const rect = button.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height) * 0.8;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    // Rimuovi ripple precedenti
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }

    button.appendChild(ripple);
    // === MODIFICATO: Rimuovi dopo 800ms ===
    setTimeout(() => {
        if (ripple.parentElement === button) {
           ripple.remove();
        }
    }, 800); // Corrisponde alla nuova durata dell'animazione (0.8s)

    // Haptic feedback (invariato)
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    // Change section (invariato)
    onSectionChange(sectionId);
  };

  return (
    <>
      <nav
        // Padding ridotto
        className="fixed bottom-0 left-0 right-0 bg-slate-800 flex justify-around py-1 z-50 border-t border-slate-700/30"
        style={{
          boxShadow: '0 -4px 12px rgba(0,0,0,0.3)'
        }}
      >
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={(e) => handleClick(item.id, e)}
              // Padding ridotto
              className={`
                flex-1 flex flex-col items-center py-2 px-2 cursor-pointer transition-colors duration-200
                relative overflow-hidden border-none bg-transparent group focus:outline-none
                ${isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}
              `}
              style={{
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              {/* Icona (invariata) */}
              <IconComponent
                className="w-6 h-6 mb-1 transition-transform duration-200 group-active:scale-90"
                strokeWidth={isActive ? 2.5 : 2}
              />
              {/* Etichetta (invariata) */}
              <div className="text-xs font-semibold">{item.label}</div>
            </button>
          );
        })}
      </nav>

      {/* === RIPPLE CSS MODIFICATO === */}
      <style>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.3);
          transform: scale(0);
          /* MODIFICATO: Durata animazione ridotta a 0.8s */
          animation: ripple-animation 0.8s ease-out; /* Era 1s */
          pointer-events: none;
          z-index: 10;
        }

        @keyframes ripple-animation {
          to {
            /* Scala finale invariata */
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default BottomNavigation; 
