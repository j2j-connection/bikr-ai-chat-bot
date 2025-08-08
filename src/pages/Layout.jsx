

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MessageCircle, BarChart3, Wrench } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Diagnostics",
    url: createPageUrl("Chat"),
    icon: MessageCircle,
  },
  {
    title: "Analytics",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  // Don't show the main app layout on the home page
  if (currentPageName === 'Home') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar className="border-r border-slate-200 bg-white shadow-sm">
          <SidebarHeader className="border-b border-slate-200 p-6">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">BikeBot</h2>
                <p className="text-xs text-slate-500 font-medium">Enterprise Platform</p>
              </div>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 mb-2">
                Platform
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 rounded-lg px-3 py-2.5 font-medium ${
                          location.pathname === item.url 
                            ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100' 
                            : 'text-slate-700 hover:shadow-sm'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-slate-200 px-6 py-4 md:hidden sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">BikeBot</h1>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

