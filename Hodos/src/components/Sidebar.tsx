import React, { useState, useEffect } from 'react';
import { 
  User,
  LogOut,
  ChevronLeft,
  Activity, 
  MessageSquare, 
  Plane, 
  FileText,
  LayoutDashboard,
  PieChart
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { logout } from '../store/authSlice';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  action?: () => void;
}

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const navItems: NavItem[] = [
    { path: '/', icon: <LayoutDashboard className="sidebar-icon" />, label: 'Dashboard' },
    { path: '/profile', icon: <User className="sidebar-icon" />, label: 'Profile' },
    { path: '/workflow', icon: <Activity className="sidebar-icon" />, label: 'Workflow' },
    { path: '/chats', icon: <MessageSquare className="sidebar-icon" />, label: 'Chat' },
    { path: '/trip-approval', icon: <Plane className="sidebar-icon" />, label: 'Trip Approval' },
    { path: '/claims-approval', icon: <FileText className="sidebar-icon" />, label: 'Claims Approval' },
    { path: '/budget-monitoring', icon: <PieChart className="sidebar-icon" />, label: 'Budget Monitoring' },
    { path: '/logout', icon: <LogOut className="sidebar-icon" />, label: 'Logout', action: handleLogout },
  ];

  return (
    <div className={`sidebar-wrapper ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {!isMobile && (
        <button className="sidebar-toggle-button" onClick={toggleSidebar}>
          <ChevronLeft className={`sidebar-toggle-icon ${isCollapsed ? 'sidebar-rotated' : ''}`} />
        </button>
      )}

      <div className="sidebar-content">
        <h1 className={`sidebar-title ${isCollapsed ? 'sidebar-scaled' : ''}`}>
          ADMIN PANEL
        </h1>

        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            {navItems.map((item) => (
              <li
                key={item.label}
                className="sidebar-nav-item"
                onClick={item.action ? item.action : () => navigate(item.path)}
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: location.pathname === item.path ? '#334155' : 'transparent'
                }}
              >
                {item.icon}
                <span className={`sidebar-nav-label ${isCollapsed ? 'sidebar-hidden' : ''}`}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;