import React, { useState } from 'react';
import {
  Building2,
  Menu,
  Search,
  Plus,
  Download,
  RotateCcw,
  QrCode,
  MoreVertical
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20 shadow-sm">
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
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 hidden sm:inline">
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
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">
                VFAR
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  Avani+ Fares Maldives Resort
                </span>
                <span className="text-[10px] text-slate-500 font-medium leading-none">
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
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Quick Actions */}
            {/* QR Scanner — always visible (most useful on phones) */}
            {onOpenQRScanner && (
              <button
                onClick={onOpenQRScanner}
                className="p-2 text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors flex items-center gap-1 shrink-0"
                title="Scan / Lookup Hardware QR Asset Code"
              >
                <QrCode className="w-4 h-4 text-blue-600" />
              </button>
            )}

            {/* Desktop actions */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={onOpenImportExport}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                title="Import or Export CSV & JSON data"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={onResetDemoData}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                title="Reset to seed data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile overflow menu */}
            <div className="sm:hidden relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                title="More actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {mobileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMobileMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-xl shadow-lg py-1 min-w-[180px]">
                    <button
                      onClick={() => { onOpenImportExport(); setMobileMenuOpen(false); }}
                      className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Import / Export</span>
                    </button>
                    <button
                      onClick={() => { onResetDemoData(); setMobileMenuOpen(false); }}
                      className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reset Demo Data</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Add Member CTA */}
            <button
              onClick={onNewMember}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
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
