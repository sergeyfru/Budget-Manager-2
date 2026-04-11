// import { Link, useLocation } from 'react-router';
// import { Home, BarChart3, Plus, Grid3x3, Settings, ServerCrash, LogOut,TestTube } from 'lucide-react';
// import { useAuthStore } from '../../store/useAuthStore';
// import { useState } from 'react';

// interface BottomNavProps {
//   onAddClick: () => void;
// }

// export const BottomNav = ({ onAddClick }: BottomNavProps) => {
//   const location = useLocation();
//   const authStore = useAuthStore();
//   const [openAddModal, setOpenAddModal] = useState(false);
  
//   const navItems = [
//     { path: '/', icon: Home, label: 'Home' },
//     { path: '/categories', icon: Grid3x3, label: 'Categories' },
//     { path: '/add', icon: Plus, label: 'Add' },
//     { path: '/settings', icon: Settings, label: 'Settings' },
//     // { path: '/error', icon: ServerCrash, label: 'Error' },
//     // { path: '/test', icon: TestTube, label: 'Test' },
//     { path: '/login', icon: LogOut, label: 'Logout' },
//   ];

//   return (
//       <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border z-50 safe-area-bottom">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
//           <div className="flex items-center justify-around h-16 sm:h-20">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = location.pathname === item.path;
//                 const isAddButton = item.path === '/add';
              
//               if (isAddButton) {
//                 return (
//                   <button
//                     key={item.path}
//                     onClick={onAddClick}
//                     className="flex flex-col items-center justify-center -mt-2 sm:-mt-6"
//                   >
//                     <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all">
//                       <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
//                     </div>
//                   </button>
//                 );
//               }
              
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={`flex flex-col items-center justify-center gap-1 py-2 px-3 sm:px-4 transition-colors rounded-lg ${
//                     isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
//                   }`}
//                 >
//                   <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
//                   <span className="text-xs sm:text-sm">{item.label}</span>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </nav>
//   )
// };


import { Link, useLocation } from 'react-router';
import { Home, BarChart3, Plus, Grid3x3, Settings } from 'lucide-react';

interface BottomNavProps {
  onAddClick: () => void;
}

export function BottomNav({ onAddClick }: BottomNavProps) {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { icon: Plus, label: 'Add', isButton: true },
    { path: '/categories', icon: Grid3x3, label: 'Categories' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border z-50 safe-area-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-around h-16 sm:h-20">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.path ? location.pathname === item.path : false;
            const isAddButton = item.isButton;
            
            if (isAddButton) {
              return (
                <button
                  key={index}
                  onClick={onAddClick}
                  className="flex flex-col items-center justify-center -mt-8 sm:-mt-10"
                  aria-label={item.label}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                </button>
              );
            }
            
            return (
              <Link
                key={item.path}
                to={item.path!}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-3 sm:px-4 transition-colors rounded-lg ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}