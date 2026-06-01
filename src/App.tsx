import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import IssueList from "@/pages/IssueList";
import Kanban from "@/pages/Kanban";
import IssueDetail from "@/pages/IssueDetail";
import WeeklyReport from "@/pages/WeeklyReport";
import Analytics from "@/pages/Analytics";
import NewIssue from "@/pages/NewIssue";
import Settings from "@/pages/Settings";
import DevDashboard from "@/pages/DevDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          {/* 登录页 — 不需要 Layout */}
          <Route path="/login" element={<Login />} />

          {/* 受保护的页面 — 套 Layout */}
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/issues" element={<IssueList />} />
                  <Route path="/issues/:id" element={<IssueDetail />} />
                  <Route path="/kanban" element={<Kanban />} />
                  <Route path="/weekly" element={<WeeklyReport />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/new" element={<NewIssue />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/dev" element={<DevDashboard />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
