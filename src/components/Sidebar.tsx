import React from 'react';
import { 
  BarChart3, 
  Users, 
  Grid3X3, 
  Laptop, 
  UserCheck, 
  History, 
  Building2, 
  ShieldCheck, 
  Plus, 
  Download, 
  RotateCcw,
  X,
  Server,
  Layers,
  HardDrive
} from 'lucide-react';
import { ActiveTab, TeamMemberRecord } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  members: TeamMemberRecord[];
  onNewMember: () => void;
  onOpenImportExport: () => void;
  onResetDemoData: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  members,
  onNewMember,
  onOpenImportExport,
  onResetDemoData,
  isMobileOpen,
  onCloseMobile
}) => {
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const pendingOnboarding = members.filter(m => m.status === 'Onboarding').length;
  const missingAssetTag = members.filter(m => !m.hardware.assetTag && m.status !== 'Offboarded').length;
  const operaSeats = members.filter(m => m.systems.operaCloud.assigned && m.status === 'Active').length;
  const m365Licenses = members.filter(m => m.email.licenseType !== 'None' && m.status === 'Active').length;

  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: string | number; badgeColor?: string }[] = [
    { 
      id: 'dashboard', 
      label: 'Statistics & Overview', 
      icon: BarChart3,
      badge: 'Main',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { 
      id: 'directory', 
      label: 'Master Directory', 
      icon: Users, 
      badge: members.length 
    },
    { 
      id: 'matrix', 
      label: 'Core Access Matrix', 
      icon: Grid3X3,
      badge: `${operaSeats} PMS`
    },
    { 
      id: 'hardware', 
      label: 'Hardware & Fleet', 
      icon: Laptop,
      badge: missingAssetTag > 0 ? `${missingAssetTag} untagged` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 font-semibold'
    },
    { 
      id: 'lifecycle', 
      label: 'IT Lifecycle & Tasks', 
      icon: UserCheck, 
      badge: pendingOnboarding > 0 ? `${pendingOnboarding} new` : undefined,
      badgeColor: 'bg-amber-100 text-amber-900 font-semibold'
    },
    { 
      id: 'audit', 
      label: 'Governance & Audit', 
      icon: History 
    },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      
      {/* Brand & System Title */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold shadow-sm shadow-amber-500/20 ring-1 ring-amber-400/40">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold tracking-widest uppercase text-amber-700">
                  Avani+ Fares
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">
                  Maldives IT
                </span>
              </div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                IT Asset & Access Tracker
              </h1>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resort Identity Box */}
        <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-amber-700" />
              Resort Operations
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              VFAR
            </span>
          </div>

          <div className="mt-1 text-xs font-bold text-slate-900 leading-tight">
            Avani+ Fares Maldives Resort
          </div>
          <p className="text-[10px] text-amber-800/80 mt-0.5 font-medium">
            Baa Atoll UNESCO Biosphere Reserve
          </p>

          <div className="mt-2 pt-1.5 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-slate-600">
            <span className="font-mono text-[10px] text-slate-500">Gateway: vfarLocalVpn</span>
            <span className="font-bold text-amber-900 font-mono text-[11px]">
              {members.length} staff
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="p-4 border-b border-slate-100">
        <button
          onClick={() => {
            onNewMember();
            onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Provision New Member</span>
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-xl transition-all ${
                isActive
                  ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-700' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    item.badgeColor
                      ? item.badgeColor
                      : isActive
                        ? 'bg-amber-200/60 text-amber-950 font-semibold'
                        : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Data Tools Section */}
        <div className="pt-4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Repository Tools
        </div>

        <button
          onClick={() => {
            onOpenImportExport();
            onCloseMobile();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Import / Export (CSV & JSON)</span>
        </button>

        <button
          onClick={() => {
            onResetDemoData();
            onCloseMobile();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Reset Demo Repository</span>
        </button>
      </div>

      {/* Compact Telemetry Footer in Sidebar */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/70">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
          <span>Fleet Health</span>
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
          </span>
        </div>

        <div className="space-y-1.5 text-xs text-slate-600 font-sans">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Users className="w-3.5 h-3.5" /> Personnel:
            </span>
            <strong className="text-slate-900 font-mono">{activeMembers} Active</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Server className="w-3.5 h-3.5" /> Opera Seats:
            </span>
            <strong className="text-slate-900 font-mono">{operaSeats} Seats</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Layers className="w-3.5 h-3.5" /> M365 Cloud:
            </span>
            <strong className="text-slate-900 font-mono">{m365Licenses} Licenses</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <HardDrive className="w-3.5 h-3.5" /> Barcode Tags:
            </span>
            {missingAssetTag > 0 ? (
              <span className="text-rose-700 font-mono font-semibold text-[11px]">{missingAssetTag} untagged</span>
            ) : (
              <span className="text-emerald-700 font-mono font-semibold text-[11px]">100% Tagged</span>
            )}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Minor Hotels Ops v2.4</span>
          <span className="text-amber-700 font-semibold">Class: Internal</span>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 h-screen sticky top-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden bg-slate-900/40 backdrop-blur-xs flex"
          onClick={onCloseMobile}
        >
          <div 
            className="w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
