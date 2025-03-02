import React, { useState } from 'react';
import { 
  PieChart,
  LogOut,
  ChevronLeft,
  Activity, 
  MessageSquare, 
  Plane, 
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
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
    { path: '/profile', icon: <PieChart className="sidebar-icon" />, label: 'Profile' },
    { path: '/workflow', icon: <Activity className="sidebar-icon" />, label: 'Workflow' },
    { path: '/chats', icon: <MessageSquare className="sidebar-icon" />, label: 'Chat' },
    { path: '/trip-approval', icon: <Plane className="sidebar-icon" />, label: 'Trip Approval' },
    { path: '/claims-approval', icon: <FileText className="sidebar-icon" />, label: 'Claims Approval' },
    { path: '/budget-monitoring', icon: <PieChart className="sidebar-icon" />, label: 'Budget Monitoring' },
    { path: '/logout', icon: <LogOut className="sidebar-icon" />, label: 'Logout', action: handleLogout },
  ];

  return (
    <div className={`sidebar-wrapper ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <button className="sidebar-toggle-button" onClick={toggleSidebar}>
        <ChevronLeft className={`sidebar-toggle-icon ${isCollapsed ? 'sidebar-rotated' : ''}`} />
      </button>

      <div className="sidebar-content">
        <h1 className={`sidebar-title ${isCollapsed ? 'sidebar-scaled' : ''}`}>
          Menus
        </h1>

        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            {navItems.map((item) => (
              <li
                key={item.label}
                className="sidebar-nav-item"
                onClick={item.action ? item.action : () => navigate(item.path)}
                style={{ cursor: 'pointer' }}
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
