import React, { useState } from 'react';
import { 
  DollarSign, 
  Layers, 
  Server, 
  ShieldCheck, 
  Laptop, 
  Users, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Wifi, 
  KeyRound, 
  ArrowRight, 
  TrendingUp, 
  FileSpreadsheet, 
  QrCode, 
  Shield, 
  Clock, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';
import { TeamMemberRecord, AuditLogEntry, ActiveTab } from '../types';
import { DEPARTMENT_OPTIONS } from '../data/initialData';

interface DashboardViewProps {
  members: TeamMemberRecord[];
  auditLogs: AuditLogEntry[];
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectMember: (member: TeamMemberRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  members,
  auditLogs,
  onNavigateTab,
  onSelectMember
}) => {
  const activeMembers = members.filter(m => m.status === 'Active');
  const onboardingMembers = members.filter(m => m.status === 'Onboarding');
  const offboardedMembers = members.filter(m => m.status === 'Offboarded');

  // M365 Counts
  const e5Count = activeMembers.filter(m => m.email.licenseType === 'M365 E5').length;
  const e3Count = activeMembers.filter(m => m.email.licenseType === 'M365 E3').length;
  const f3Count = activeMembers.filter(m => m.email.licenseType === 'M365 F3').length;
  const exchangeCount = activeMembers.filter(m => m.email.licenseType === 'Exchange Online').length;
  const noneCount = activeMembers.filter(m => m.email.licenseType === 'None').length;

  const monthlySaaS = (e5Count * 57) + (e3Count * 36) + (f3Count * 8) + (exchangeCount * 4);
  const annualSaaS = monthlySaaS * 12;

  // Hospitality Systems
  const operaCount = activeMembers.filter(m => m.systems.operaCloud.assigned).length;
  const simphonyCount = activeMembers.filter(m => m.systems.microsSimphony.assigned).length;
  const oracleCount = activeMembers.filter(m => m.systems.oracleFusion.assigned).length;
  const zenotiCount = activeMembers.filter(m => m.systems.zenoti.assigned).length;
  const msgBoxCount = activeMembers.filter(m => m.systems.messageBox.assigned).length;
  const tableCheckCount = activeMembers.filter(m => m.systems.tableCheck.assigned).length;
  const minorAppCount = activeMembers.filter(m => m.systems.minorHotelsApp.assigned).length;

  // Hardware
  const deployedHardware = members.filter(m => Boolean(m.hardware.pcLaptopModel) && m.status !== 'Offboarded');
  const taggedHardware = deployedHardware.filter(m => Boolean(m.hardware.assetTag));
  const untaggedHardware = deployedHardware.filter(m => !m.hardware.assetTag);
  const tagCompliancePct = deployedHardware.length > 0 
    ? Math.round((taggedHardware.length / deployedHardware.length) * 100) 
    : 100;

  // Security & Remote
  const vpnCount = activeMembers.filter(m => m.vpn.vfarLocalVpn || m.vpn.minorVpn).length;
  const vfarVpnOnlyCount = activeMembers.filter(m => m.vpn.vfarLocalVpn).length;
  const visionlineCount = activeMembers.filter(m => m.security.visionline.assigned).length;
  const leadersDLCount = activeMembers.filter(m => m.email.leadersDL).length;
  const mfaEnforcedCount = activeMembers.filter(m => m.email.functionalAccountMfa).length;

  // Avani+ Fares Departmental Breakdown
  const departmentStats = DEPARTMENT_OPTIONS.map(dept => {
    const deptMembers = members.filter(m => m.department === dept && m.status === 'Active');
    const deptOpera = deptMembers.filter(m => m.systems.operaCloud.assigned).length;
    const deptSimphony = deptMembers.filter(m => m.systems.microsSimphony.assigned).length;
    const deptM365 = deptMembers.filter(m => m.email.licenseType !== 'None').length;
    const deptTagged = deptMembers.filter(m => Boolean(m.hardware.assetTag)).length;
    const deptVpn = deptMembers.filter(m => m.vpn.vfarLocalVpn).length;
    return {
      department: dept,
      totalActive: deptMembers.length,
      operaSeats: deptOpera,
      simphonySeats: deptSimphony,
      m365Assigned: deptM365,
      vfarVpnCount: deptVpn,
      taggedPct: deptMembers.length > 0 ? Math.round((deptTagged / deptMembers.length) * 100) : 100
    };
  }).filter(d => d.totalActive > 0);

  return (
    <div className="space-y-6">
      
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-amber-50/90 via-white to-amber-50/50 border border-amber-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm ring-1 ring-amber-500/40">
              VFAR
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300">
                  Avani+ Fares Maldives Resort
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  On-Island IT Active
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Baa Atoll UNESCO Biosphere Reserve
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                IT Asset, Access & License Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Dedicated resort IT tracker for Avani+ Fares Maldives. Managing on-island systems (Opera Cloud, Micros Simphony, Zenoti, Visionline), Microsoft 365 licensing, and VFAR hardware inventory.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900 font-mono">+960 660-8888</div>
              <div className="text-[10px] text-slate-500 font-mono">Gateway: vfarLocalVpn</div>
            </div>
            <button
              onClick={() => onNavigateTab('directory')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            >
              <span>View Roster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Workforce Status */}
        <div 
          onClick={() => onNavigateTab('directory')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-600" /> Active Personnel
            </span>
            <span className="text-[11px] text-slate-400 font-mono group-hover:text-amber-700 transition-colors">
              Directory &rarr;
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-slate-900 font-mono">{activeMembers.length}</span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-amber-800 font-medium">{onboardingMembers.length} Onboarding</span>
            <span className="text-slate-300">·</span>
            <span>{offboardedMembers.length} Offboarded</span>
          </div>
        </div>

        {/* KPI 2: M365 Monthly SaaS Run-rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> M365 SaaS Run-rate
            </span>
            <span className="text-[11px] text-emerald-700 font-mono font-semibold">
              ${annualSaaS.toLocaleString()}/yr
            </span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-bold text-slate-900 font-mono">
              ${monthlySaaS.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ month</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono text-[11px]">
            <span>E5: <strong>{e5Count}</strong></span>
            <span className="text-slate-300">·</span>
            <span>E3: <strong>{e3Count}</strong></span>
            <span className="text-slate-300">·</span>
            <span>F3: <strong>{f3Count}</strong></span>
          </div>
        </div>

        {/* KPI 3: Hospitality PMS Footprint */}
        <div 
          onClick={() => onNavigateTab('matrix')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-sky-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-sky-600" /> Opera Cloud Seats
            </span>
            <span className="text-[11px] text-slate-400 group-hover:text-sky-700 transition-colors">
              Matrix &rarr;
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-slate-900 font-mono">{operaCount}</span>
            <span className="text-xs text-slate-500">PMS Operators</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100 text-[11px]">
            <span>Simphony: <strong className="text-slate-800 font-mono">{simphonyCount}</strong></span>
            <span className="text-slate-300">·</span>
            <span>Oracle: <strong className="text-slate-800 font-mono">{oracleCount}</strong></span>
          </div>
        </div>

        {/* KPI 4: Asset Tagging Health */}
        <div 
          onClick={() => onNavigateTab('hardware')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Asset Tag Coverage
            </span>
            <span className="text-[11px] text-slate-400 group-hover:text-indigo-700 transition-colors">
              Fleet &rarr;
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-slate-900 font-mono">{tagCompliancePct}%</span>
            <span className="text-xs text-slate-500">{taggedHardware.length}/{deployedHardware.length}</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-[11px]">
            {untaggedHardware.length > 0 ? (
              <span className="text-rose-700 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" /> {untaggedHardware.length} Untagged Devices
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 100% Tagged
              </span>
            )}
            <span className="text-slate-400">{vpnCount} VPN Active</span>
          </div>
        </div>

      </div>

      {/* Untagged Hardware Alert (if any) */}
      {untaggedHardware.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                Physical IT Tagging Audit Required ({untaggedHardware.length} Devices Pending Tag)
              </h4>
              <p className="text-xs text-rose-800 mt-0.5">
                The following active staff members are deployed with PCs/laptops missing standard barcode asset tags ({untaggedHardware.map(u => u.employeeName).join(', ')}).
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('hardware')}
            className="shrink-0 px-3.5 py-1.5 text-xs font-semibold text-rose-950 bg-rose-200/80 hover:bg-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Open Asset Tagger</span>
          </button>
        </div>
      )}

      {/* SECTION 1: SaaS License Breakdown & Core Hospitality Systems */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Microsoft 365 License Allocation Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600" /> Microsoft 365 License Utilization
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tier distribution and run-rate cost per seat
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900 font-mono">
                ${monthlySaaS.toLocaleString()}/mo
              </div>
              <div className="text-[10px] text-slate-400">Total Run-rate</div>
            </div>
          </div>

          {/* Tier Bars */}
          <div className="space-y-3">
            {[
              { 
                tier: 'M365 E5 (Enterprise Advanced Security & Voice)', 
                count: e5Count, 
                unitCost: '$57/seat',
                totalCost: `$${(e5Count * 57).toLocaleString()}/mo`,
                color: 'bg-sky-600' 
              },
              { 
                tier: 'M365 E3 (Enterprise Productivity & Compliance)', 
                count: e3Count, 
                unitCost: '$36/seat',
                totalCost: `$${(e3Count * 36).toLocaleString()}/mo`,
                color: 'bg-indigo-600' 
              },
              { 
                tier: 'M365 F3 (Hospitality Frontline Worker)', 
                count: f3Count, 
                unitCost: '$8/seat',
                totalCost: `$${(f3Count * 8).toLocaleString()}/mo`,
                color: 'bg-amber-600' 
              },
              { 
                tier: 'Exchange Online (Dedicated Mailbox Only)', 
                count: exchangeCount, 
                unitCost: '$4/seat',
                totalCost: `$${(exchangeCount * 4).toLocaleString()}/mo`,
                color: 'bg-emerald-600' 
              },
              { 
                tier: 'No License Assigned (De-provisioned / Shared)', 
                count: noneCount, 
                unitCost: '$0',
                totalCost: '$0',
                color: 'bg-slate-300' 
              },
            ].map(item => {
              const pct = activeMembers.length > 0 ? Math.round((item.count / activeMembers.length) * 100) : 0;

              return (
                <div key={item.tier} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-800 font-medium truncate max-w-xs">{item.tier}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-slate-900 font-bold">{item.count} seats</span>
                      <span className="text-slate-400 text-[11px]">({pct}%)</span>
                      <span className="text-slate-500 font-mono text-[11px] w-20 text-right">{item.totalCost}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Leaders DL Enrollment: <strong className="text-slate-900 font-mono">{leadersDLCount}</strong></span>
            <span>MFA Security Enforced: <strong className="text-emerald-700 font-mono">{mfaEnforcedCount}</strong></span>
          </div>
        </div>

        {/* Core Hospitality Systems Footprint Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-600" /> Hospitality Platforms & System Adoption
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Property Management, Point-of-Sale, ERP & Guest Service
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('matrix')}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
            >
              <span>Access Matrix</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Opera Cloud PMS', count: operaCount, category: 'Front Desk & Cashiering', badge: 'PMS' },
              { name: 'Micros Simphony', count: simphonyCount, category: 'F&B POS Revenue Centers', badge: 'POS' },
              { name: 'Oracle Fusion ERP', count: oracleCount, category: 'Financials & Supply Chain', badge: 'ERP' },
              { name: 'Zenoti Wellness', count: zenotiCount, category: 'Spa Rostering & Retail', badge: 'Spa' },
              { name: 'MessageBox Orders', count: msgBoxCount, category: 'Guest Service & Runners', badge: 'Ops' },
              { name: 'TableCheck Dining', count: tableCheckCount, category: 'Restaurant Reservations', badge: 'F&B' },
              { name: 'Minor Hotels App', count: minorAppCount, category: 'Discovery Loyalty Mobile', badge: 'Guest' },
              { name: 'Visionline Door Locks', count: visionlineCount, category: 'RFID Keycard Encoders', badge: 'Access' },
            ].map(sys => (
              <div 
                key={sys.name} 
                onClick={() => onNavigateTab('matrix')}
                className="p-3 bg-slate-50/70 hover:bg-slate-100/70 rounded-xl border border-slate-200 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-600 font-semibold border border-slate-200">
                    {sys.badge}
                  </span>
                  <span className="text-lg font-bold text-slate-900 font-mono group-hover:text-amber-700 transition-colors">
                    {sys.count}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">{sys.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">{sys.category}</div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Minor Corporate VPN: <strong className="text-sky-700 font-mono">{activeMembers.filter(m => m.vpn.minorVpn).length}</strong></span>
            <span>VFAR Island VPN: <strong className="text-sky-700 font-mono">{activeMembers.filter(m => m.vpn.vfarLocalVpn).length}</strong></span>
          </div>
        </div>

      </div>

      {/* SECTION 2: Avani+ Fares Departmental IT & Systems Allocation Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" /> Avani+ Fares — Departmental IT & Systems Allocation
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Active resort personnel, PMS & POS seats, M365 accounts, on-island VPN, and VFAR hardware tag compliance
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {departmentStats.length} Resort Departments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200 select-none">
              <tr>
                <th className="py-2.5 px-3.5 font-semibold">Resort Department</th>
                <th className="py-2.5 px-3.5 font-semibold text-center">Active Staff</th>
                <th className="py-2.5 px-3.5 font-semibold text-center">Opera Cloud</th>
                <th className="py-2.5 px-3.5 font-semibold text-center">Simphony POS</th>
                <th className="py-2.5 px-3.5 font-semibold text-center">M365 Accounts</th>
                <th className="py-2.5 px-3.5 font-semibold text-center">VFAR VPN</th>
                <th className="py-2.5 px-3.5 font-semibold text-center">Hardware Tagged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentStats.map(stat => (
                <tr key={stat.department} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3.5">
                    <div className="font-semibold text-slate-900">{stat.department}</div>
                  </td>
                  <td className="py-2.5 px-3.5 text-center font-mono font-bold text-slate-800">
                    {stat.totalActive}
                  </td>
                  <td className="py-2.5 px-3.5 text-center font-mono text-sky-700 font-medium">
                    {stat.operaSeats > 0 ? stat.operaSeats : '—'}
                  </td>
                  <td className="py-2.5 px-3.5 text-center font-mono text-emerald-700 font-medium">
                    {stat.simphonySeats > 0 ? stat.simphonySeats : '—'}
                  </td>
                  <td className="py-2.5 px-3.5 text-center font-mono text-indigo-700 font-medium">
                    {stat.m365Assigned}
                  </td>
                  <td className="py-2.5 px-3.5 text-center font-mono text-amber-700 font-medium">
                    {stat.vfarVpnCount > 0 ? stat.vfarVpnCount : '—'}
                  </td>
                  <td className="py-2.5 px-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 font-mono text-xs font-semibold ${
                      stat.taggedPct === 100 ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {stat.taggedPct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Onboarding Pipeline & Recent Audit Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Onboarding Operations Queue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" /> Pending IT Onboarding Pipeline ({onboardingMembers.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Staff members currently undergoing account and hardware provisioning
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('lifecycle')}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
            >
              <span>View Lifecycle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {onboardingMembers.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-700">All incoming personnel provisioned</p>
            </div>
          ) : (
            <div className="space-y-3">
              {onboardingMembers.map(member => (
                <div 
                  key={member.id}
                  onClick={() => onSelectMember(member)}
                  className="p-3 bg-slate-50/70 hover:bg-slate-100/70 rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{member.employeeName}</div>
                    <div className="text-[11px] text-slate-500">
                      {member.jobTitle} · <span className="text-slate-700">{member.department}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      Provisioning
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security & Operational Governance Audit Feed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" /> Recent Security & IT Operations Trail
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest credential changes and administrative modifications
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('audit')}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
            >
              <span>Full Audit Trail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {auditLogs.slice(0, 4).map(log => (
              <div key={log.id} className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-200">
                      {log.action}
                    </span>
                    <strong className="text-slate-900">{log.memberName}</strong>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-1">
                  {log.details}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
