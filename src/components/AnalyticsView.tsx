import React from 'react';
import { 
  DollarSign, 
  Layers, 
  Server, 
  ShieldCheck, 
  Building2,
  PieChart
} from 'lucide-react';
import { TeamMemberRecord } from '../types';

interface AnalyticsViewProps {
  members: TeamMemberRecord[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ members }) => {
  const activeMembers = members.filter(m => m.status === 'Active');

  // M365 Counts
  const e5Count = activeMembers.filter(m => m.email.licenseType === 'M365 E5').length;
  const e3Count = activeMembers.filter(m => m.email.licenseType === 'M365 E3').length;
  const f3Count = activeMembers.filter(m => m.email.licenseType === 'M365 F3').length;
  const exchangeCount = activeMembers.filter(m => m.email.licenseType === 'Exchange Online').length;
  const noneCount = activeMembers.filter(m => m.email.licenseType === 'None').length;

  const estimatedM365Monthly = (e5Count * 57) + (e3Count * 36) + (f3Count * 8) + (exchangeCount * 4);

  // Property distribution
  const propertyCounts: Record<string, number> = {};
  activeMembers.forEach(m => {
    propertyCounts[m.propertyOrLocation] = (propertyCounts[m.propertyOrLocation] || 0) + 1;
  });

  // Department distribution
  const departmentCounts: Record<string, number> = {};
  activeMembers.forEach(m => {
    departmentCounts[m.department] = (departmentCounts[m.department] || 0) + 1;
  });

  // Core Hospitality Systems
  const operaCount = activeMembers.filter(m => m.systems.operaCloud.assigned).length;
  const simphonyCount = activeMembers.filter(m => m.systems.microsSimphony.assigned).length;
  const oracleCount = activeMembers.filter(m => m.systems.oracleFusion.assigned).length;
  const zenotiCount = activeMembers.filter(m => m.systems.zenoti.assigned).length;
  const msgBoxCount = activeMembers.filter(m => m.systems.messageBox.assigned).length;
  const tableCheckCount = activeMembers.filter(m => m.systems.tableCheck.assigned).length;
  const visionlineCount = activeMembers.filter(m => m.security.visionline.assigned).length;
  const vpnCount = activeMembers.filter(m => m.vpn.minorVpn || m.vpn.vfarLocalVpn).length;
  const adobeCcCount = activeMembers.filter(m => m.creativeProductivity.adobeCc.assigned).length;

  return (
    <div className="space-y-6">
      
      {/* Top Level SaaS Cost & Allocation Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" /> Estimated M365 SaaS Run-rate
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono">
            ${estimatedM365Monthly.toLocaleString()}
            <span className="text-xs text-slate-500 font-sans font-normal ml-1.5">/ month</span>
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Across {e5Count + e3Count + f3Count + exchangeCount} allocated cloud productivity seats.
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
            <Server className="w-4 h-4 text-sky-600" /> Opera Cloud PMS Allocation
          </div>
          <div className="text-3xl font-bold text-sky-700 font-mono">
            {operaCount}
            <span className="text-xs text-slate-500 font-sans font-normal ml-1.5">active operators</span>
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Front office, cashiers, reservations, & duty managers.
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Elevated Security Privileges
          </div>
          <div className="text-3xl font-bold text-blue-800 font-mono">
            {visionlineCount}
            <span className="text-xs text-slate-500 font-sans font-normal ml-1.5">key encoders</span>
          </div>
          <div className="text-xs text-slate-500 mt-2">
            ASSA ABLOY Visionline lock authorization clearance.
          </div>
        </div>

      </div>

      {/* License Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Microsoft 365 Tier Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-sky-600" /> Microsoft 365 License Allocation
          </h3>

          <div className="space-y-3.5">
            {[
              { tier: 'M365 E5 (Enterprise Advanced Security)', count: e5Count, color: 'bg-sky-500' },
              { tier: 'M365 E3 (Standard Enterprise Cloud)', count: e3Count, color: 'bg-blue-400' },
              { tier: 'M365 F3 (Hospitality Frontline Worker)', count: f3Count, color: 'bg-blue-500' },
              { tier: 'Exchange Online (Dedicated Mailbox)', count: exchangeCount, color: 'bg-emerald-500' },
              { tier: 'No License Assigned (De-provisioned)', count: noneCount, color: 'bg-slate-300' },
            ].map(item => {
              const pct = activeMembers.length > 0 ? Math.round((item.count / activeMembers.length) * 100) : 0;

              return (
                <div key={item.tier} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">{item.tier}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-900 font-bold">{item.count} seats</span>
                      <span className="text-slate-400 text-[11px]">({pct}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enterprise Hospitality Systems Utilization */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-blue-600" /> Hotel Systems & Network Utilization
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Opera Cloud PMS', count: operaCount, desc: 'Front Office & Night Audit' },
              { name: 'Micros Simphony POS', count: simphonyCount, desc: 'F&B Revenue Centers' },
              { name: 'Oracle Fusion ERP', count: oracleCount, desc: 'Financial Approvers' },
              { name: 'Zenoti Spa', count: zenotiCount, desc: 'Wellness & Appointments' },
              { name: 'MessageBox Orders', count: msgBoxCount, desc: 'Guest Request Dispatch' },
              { name: 'TableCheck Dining', count: tableCheckCount, desc: 'Restaurant Seating' },
              { name: 'Remote VPN Tunnels', count: vpnCount, desc: 'Minor & VFAR Access' },
              { name: 'Adobe Creative Cloud', count: adobeCcCount, desc: 'Marketing & Graphic Design' },
            ].map(sys => (
              <div key={sys.name} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-800">{sys.name}</div>
                <div className="text-xl font-bold text-blue-700 font-mono mt-1">{sys.count}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{sys.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Property & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Properties */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-emerald-600" /> Personnel by Minor Hotels Property
          </h3>

          <div className="space-y-2.5">
            {Object.entries(propertyCounts).map(([prop, count]) => {
              const pct = Math.round((count / activeMembers.length) * 100);
              return (
                <div key={prop} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-none">
                  <span className="text-slate-700 truncate max-w-xs">{prop}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-900 font-bold">{count} staff</span>
                    <span className="text-slate-400 text-[11px] w-8 text-right font-mono">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Departments */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-3">
            <PieChart className="w-4 h-4 text-blue-600" /> Personnel by Operational Department
          </h3>

          <div className="space-y-2.5">
            {Object.entries(departmentCounts).map(([dept, count]) => {
              const pct = Math.round((count / activeMembers.length) * 100);
              return (
                <div key={dept} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-none">
                  <span className="text-slate-700">{dept}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-900 font-bold">{count}</span>
                    <span className="text-slate-400 text-[11px] w-8 text-right font-mono">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
