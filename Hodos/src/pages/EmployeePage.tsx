import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Socket } from "socket.io-client";
import ChatPage from "../chat/ChatPage";
import Sidebar from "../components/Sidebar";
import FlowReact from "../workflow/FlowEditor";
import TravelDetails from "../travel/TravelDetails";
import ClaimsApprovalPage from "./ClaimApproval";
import BudgetMonitoringPage from "../budget/BudgetMonitoring";
import Profile from "./Profile";
import Dashboard from "./Dashboard";
import "../styles/EmployeePage.css";

interface EmployeePageProps {
  socket1: Socket;
  socket2: Socket;
}

const pageConfigs = {
  "/": { title: "Dashboard", component: Dashboard },
  "/profile": { title: "My Profile", component: Profile },
  "/workflow": { title: "Workflow Editor", component: FlowReact },
  "/chats": { title: "Messages", component: null }, // Special case for chat
  "/trip-approval": { title: "Trip Approval", component: TravelDetails },
  "/claims-approval": { title: "Claims Approval", component: ClaimsApprovalPage },
  "/budget-monitoring": { title: "Budget Monitoring", component: BudgetMonitoringPage },
};

const EmployeePage: React.FC<EmployeePageProps> = ({ socket1, socket2 }) => {
  const location = useLocation();
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const currentPage = pageConfigs[location.pathname as keyof typeof pageConfigs] || { title: "Page Not Found", component: null };

  // Connect to socket when navigating to chat page
  useEffect(() => {
    if (location.pathname === "/chats" && !isSocketConnected) {
      socket1.connect();
      socket2.connect();
      setIsSocketConnected(true);

      const handleDisconnect = () => {
        setIsSocketConnected(false);
      };

      socket1.on("disconnect", handleDisconnect);
      socket2.on("disconnect", handleDisconnect);

      return () => {
        socket1.off("disconnect", handleDisconnect);
        socket2.off("disconnect", handleDisconnect);
      };
    }
  }, [location.pathname, isSocketConnected, socket1, socket2]);

  // Listen for sidebar collapse state changes
  useEffect(() => {
    const handleSidebarChange = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed);
    };

    window.addEventListener('sidebarStateChange' as any, handleSidebarChange);

    return () => {
      window.removeEventListener('sidebarStateChange' as any, handleSidebarChange);
    };
  }, []);

  // Render page content based on current path
  const renderContent = () => {
    if (location.pathname === "/") {
      return <Dashboard />
    } else if (location.pathname === "/chats") {
      return <ChatPage socket1={socket1} socket2={socket2} />;
    } else if (location.pathname === "/workflow") {
      return <FlowReact />;
    } else if (location.pathname === "/trip-approval") {
      return <TravelDetails />;
    } else if (location.pathname === "/profile") {
      return <Profile />;
    } else if (location.pathname === "/claims-approval") {
      return <ClaimsApprovalPage />;
    } else if (location.pathname === "/budget-monitoring") {
      return <BudgetMonitoringPage />;
    }

    const PageComponent = currentPage.component;
    return PageComponent ? <PageComponent /> : <div>Page not found</div>;
  };

  return (
    <div className="sidebar-container-fluid">
      <div className="sidebar-row sidebar-flex-nowrap">
        <Sidebar />
        <main className={`content-wrapper ${sidebarCollapsed ? 'content-wrapper-expanded' : ''}`}>
          <div className="content-header">
            <h1 className="content-title">{currentPage.title}</h1>
            {/* <div className="content-actions">
              
            </div> */}
          </div>
          <div className="content-container">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeePage;
