import React from 'react';
import { 
  Building2, 
  Menu, 
  Search, 
  Plus, 
  Download, 
  RotateCcw,
  QrCode
} from 'lucide-react';
import { TeamMemberRecord, ActiveTab } from '../types';

interface HeaderProps {
  members: TeamMemberRecord[];
  activeTab: ActiveTab;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewMember: () => void;
  onOpenImportExport: () => void;
  onResetDemoData: () => void;
  onOpenMobileSidebar: () => void;
  onOpenQRScanner?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  members,
  activeTab,
  searchQuery,
  onSearchChange,
  onNewMember,
  onOpenImportExport,
  onResetDemoData,
  onOpenMobileSidebar,
  onOpenQRScanner
}) => {
  const getTabLabel = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard': return 'Statistics & Operations Dashboard';
      case 'directory': return 'Master Personnel Directory';
      case 'matrix': return 'Core Systems Access Matrix';
      case 'hardware': return 'Hardware Fleet & Asset Inventory';
      case 'lifecycle': return 'IT Provisioning & Lifecycle';
      case 'audit': return 'Governance & Security Audit Trail';
      default: return 'IT Tracker';
    }
  };

  const activeMembers = members.filter(m => m.status === 'Active').length;
  const operaSeats = members.filter(m => m.systems.operaCloud.assigned && m.status === 'Active').length;
  const m365Assigned = members.filter(m => m.email.licenseType !== 'None' && m.status === 'Active').length;

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Mobile Menu Toggle & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 hidden sm:inline">
                  Avani+ Fares
                </span>
                <span className="text-slate-300 hidden sm:inline">/</span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {getTabLabel(activeTab)}
                </h2>
              </div>
            </div>
          </div>

          {/* Quick Search & Actions */}
          <div className="flex items-center gap-2.5">
            
            {/* Avani+ Fares Identity Badge */}
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-amber-50/80 border border-amber-200/90 rounded-xl">
              <div className="w-6 h-6 rounded-lg bg-amber-700 text-white font-bold text-[10px] flex items-center justify-center font-mono shadow-xs">
                VFAR
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  Avani+ Fares Maldives Resort
                </span>
                <span className="text-[10px] text-amber-800 font-medium leading-none">
                  Baa Atoll · UNESCO Biosphere Reserve
                </span>
              </div>
            </div>

            {/* Global Search */}
            <div className="relative w-36 sm:w-48 lg:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search staff, serial, tag..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Quick Actions */}
            <div className="hidden sm:flex items-center gap-1.5">
              {onOpenQRScanner && (
                <button
                  onClick={onOpenQRScanner}
                  className="p-2 text-amber-800 hover:text-amber-950 bg-amber-50/70 hover:bg-amber-100 border border-amber-300 rounded-xl transition-colors shadow-2xs flex items-center gap-1"
                  title="Scan / Lookup Hardware QR Asset Code"
                >
                  <QrCode className="w-4 h-4 text-amber-700" />
                </button>
              )}

              <button
                onClick={onOpenImportExport}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
                title="Import or Export CSV & JSON data"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={onResetDemoData}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
                title="Reset to seed data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Add Member CTA */}
            <button
              onClick={onNewMember}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Member</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
