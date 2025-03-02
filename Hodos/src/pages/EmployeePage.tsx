import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import ChatPage from '../chat/ChatPage';
import Sidebar from '../components/Sidebar';
import FlowReact from '../workflow/FlowEditor';
import TravelDetails from '../travel/TravelDetails';
import ClaimsApprovalPage from './ClaimApproval';
import BudgetMonitoringPage from './BudgetMonitoring';
import Profile from './Profile';

interface EmployeePageProps {
  socket1: Socket;
  socket2: Socket;
}

const EmployeePage: React.FC<EmployeePageProps> = ({ socket1, socket2 }) => {
  const location = useLocation();
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    if (location.pathname === "/chats" && !isSocketConnected) {
      socket1.connect();
      setIsSocketConnected(true);

      socket1.on('connect', () => {
        // console.log('Socket1 connected to server');
      });

      socket1.on('disconnect', () => {
        // console.log('Socket1 disconnected');
        setIsSocketConnected(false);
      });
      socket2.connect();
      setIsSocketConnected(true);

      socket2.on('connect', () => {
        // console.log('Socket2 connected to server');
      });

      socket2.on('disconnect', () => {
        // console.log('Socket2 disconnected');
        setIsSocketConnected(false);
      });
    }
  }, [location.pathname, isSocketConnected, socket1, socket2]);

  

  return (
    <>
      <div className="sidebar-container-fluid">
        <div className="sidebar-row sidebar-flex-nowrap">
          <Sidebar />
          {
          location.pathname === "/chats" ? <ChatPage socket1={socket1} socket2={socket2} /> : 
          location.pathname === "/workflow" ? <FlowReact/>:
          location.pathname === "/profile" ? <Profile/>:
          location.pathname === "/trip-approval" ? <TravelDetails/>: 
          location.pathname === "/claims-approval" ? <ClaimsApprovalPage/>: 
          location.pathname === "/budget-monitoring" ? <BudgetMonitoringPage/>: 
          <h3>Welcome to Employee Dashboard</h3>}
        </div>
      </div>
    </>
  )
}

export default EmployeePage
