import React from 'react';
import {
  DollarSign,
  Layers,
  Server,
  ShieldCheck,
  Users,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { TeamMemberRecord, AuditLogEntry, ActiveTab, memberHasHardware, memberHasUntaggedHardware, memberPrimaryAssetTag } from '../types';
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

  const e5Count = activeMembers.filter(m => m.email.licenseType === 'M365 E5').length;
  const e3Count = activeMembers.filter(m => m.email.licenseType === 'M365 E3').length;
  const f3Count = activeMembers.filter(m => m.email.licenseType === 'M365 F3').length;
  const exchangeCount = activeMembers.filter(m => m.email.licenseType === 'Exchange Online').length;
  const noneCount = activeMembers.filter(m => m.email.licenseType === 'None').length;

  const monthlySaaS = (e5Count * 57) + (e3Count * 36) + (f3Count * 8) + (exchangeCount * 4);
  const annualSaaS = monthlySaaS * 12;

  const operaCount = activeMembers.filter(m => m.systems.operaCloud.assigned).length;
  const simphonyCount = activeMembers.filter(m => m.systems.microsSimphony.assigned).length;
  const oracleCount = activeMembers.filter(m => m.systems.oracleFusion.assigned).length;
  const zenotiCount = activeMembers.filter(m => m.systems.zenoti.assigned).length;
  const msgBoxCount = activeMembers.filter(m => m.systems.messageBox.assigned).length;
  const tableCheckCount = activeMembers.filter(m => m.systems.tableCheck.assigned).length;
  const minorAppCount = activeMembers.filter(m => m.systems.minorHotelsApp.assigned).length;
  const visionlineCount = activeMembers.filter(m => m.security.visionline.assigned).length;

  const deployedHardware = members.filter(m => memberHasHardware(m) && m.status !== 'Offboarded');
  const taggedHardware = deployedHardware.filter(m => m.hardware.every(h => h.assetTag));
  const untaggedHardware = deployedHardware.filter(m => m.hardware.some(h => !h.assetTag));
  const tagCompliancePct = deployedHardware.length > 0
    ? Math.round((taggedHardware.length / deployedHardware.length) * 100)
    : 100;

  const vpnCount = activeMembers.filter(m => m.vpn.vfarLocalVpn || m.vpn.minorVpn).length;

  const departmentStats = DEPARTMENT_OPTIONS.map(dept => {
    const deptMembers = members.filter(m => m.department === dept && m.status === 'Active');
    const deptOpera = deptMembers.filter(m => m.systems.operaCloud.assigned).length;
    const deptSimphony = deptMembers.filter(m => m.systems.microsSimphony.assigned).length;
    const deptM365 = deptMembers.filter(m => m.email.licenseType !== 'None').length;
    const deptVpn = deptMembers.filter(m => m.vpn.vfarLocalVpn).length;
    const deptWithHardware = deptMembers.filter(m => memberHasHardware(m));
    const deptTagged = deptMembers.filter(m => memberHasHardware(m) && m.hardware.every(h => h.assetTag)).length;
    return {
      department: dept,
      totalActive: deptMembers.length,
      operaSeats: deptOpera,
      simphonySeats: deptSimphony,
      m365Assigned: deptM365,
      vfarVpnCount: deptVpn,
      taggedPct: deptWithHardware.length > 0 ? Math.round((deptTagged / deptWithHardware.length) * 100) : 100
    };
  }).filter(d => d.totalActive > 0);

  return (
    <div className="space-y-8">

      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">IT Asset, Access & License Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Avani+ Fares Maldives Resort · Baa Atoll UNESCO Biosphere Reserve
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => onNavigateTab('directory')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Active Personnel</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{activeMembers.length}</div>
          <div className="flex items-center gap-3 mt-3 text-sm text-slate-500">
            <span>{onboardingMembers.length} onboarding</span>
            <span className="text-slate-300">·</span>
            <span>{offboardedMembers.length} offboarded</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium">M365 Monthly Cost</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">${monthlySaaS.toLocaleString()}</div>
          <div className="flex items-center gap-3 mt-3 text-sm text-slate-500 font-mono">
            <span>E5: {e5Count}</span>
            <span className="text-slate-300">·</span>
            <span>E3: {e3Count}</span>
            <span className="text-slate-300">·</span>
            <span>F3: {f3Count}</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('matrix')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-sky-400 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <Server className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-medium">Opera Cloud Seats</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{operaCount}</div>
          <div className="flex items-center gap-3 mt-3 text-sm text-slate-500">
            <span>Simphony: {simphonyCount}</span>
            <span className="text-slate-300">·</span>
            <span>Oracle: {oracleCount}</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('hardware')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Asset Tag Coverage</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{tagCompliancePct}%</div>
          <div className="flex items-center justify-between mt-3 text-sm">
            {untaggedHardware.length > 0 ? (
              <span className="text-rose-600 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {untaggedHardware.length} untagged
              </span>
            ) : (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All tagged
              </span>
            )}
            <span className="text-slate-400">{vpnCount} VPN</span>
          </div>
        </div>
      </div>

      {/* Untagged Alert */}
      {untaggedHardware.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-rose-900">
                {untaggedHardware.length} devices need asset tags
              </h4>
              <p className="text-sm text-rose-700 mt-0.5">
                {untaggedHardware.map(u => u.employeeName).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('hardware')}
            className="shrink-0 px-4 py-2 text-sm font-medium text-rose-900 bg-white hover:bg-rose-50 border border-rose-300 rounded-lg transition-colors"
          >
            Open Asset Tagger
          </button>
        </div>
      )}

      {/* License & Systems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* M365 License Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-600" />
              <h3 className="text-base font-semibold text-slate-900">Microsoft 365 Licenses</h3>
            </div>
            <span className="text-sm font-mono text-slate-500">${annualSaaS.toLocaleString()}/yr</span>
          </div>

          <div className="space-y-4">
            {[
              { tier: 'M365 E5', count: e5Count, cost: e5Count * 57, color: 'bg-sky-600' },
              { tier: 'M365 E3', count: e3Count, cost: e3Count * 36, color: 'bg-blue-600' },
              { tier: 'M365 F3', count: f3Count, cost: f3Count * 8, color: 'bg-blue-500' },
              { tier: 'Exchange Online', count: exchangeCount, cost: exchangeCount * 4, color: 'bg-emerald-600' },
              { tier: 'No License', count: noneCount, cost: 0, color: 'bg-slate-300' },
            ].map(item => {
              const pct = activeMembers.length > 0 ? Math.round((item.count / activeMembers.length) * 100) : 0;
              return (
                <div key={item.tier}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-slate-700 font-medium">{item.tier}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900">{item.count}</span>
                      <span className="text-slate-400 text-sm">{pct}%</span>
                      {item.cost > 0 && <span className="text-slate-500 font-mono text-sm">${item.cost}/mo</span>}
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hospitality Systems Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-semibold text-slate-900">Hospitality Systems</h3>
            </div>
            <button
              onClick={() => onNavigateTab('matrix')}
              className="text-sm font-medium text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              View Matrix <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Opera Cloud', count: operaCount, badge: 'PMS' },
              { name: 'Micros Simphony', count: simphonyCount, badge: 'POS' },
              { name: 'Oracle Fusion', count: oracleCount, badge: 'ERP' },
              { name: 'Zenoti Wellness', count: zenotiCount, badge: 'Spa' },
              { name: 'MessageBox', count: msgBoxCount, badge: 'Ops' },
              { name: 'TableCheck', count: tableCheckCount, badge: 'F&B' },
              { name: 'Minor Hotels App', count: minorAppCount, badge: 'Guest' },
              { name: 'Visionline', count: visionlineCount, badge: 'Access' },
            ].map(sys => (
              <div
                key={sys.name}
                onClick={() => onNavigateTab('matrix')}
                className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-white text-slate-600 font-semibold border border-slate-200">
                    {sys.badge}
                  </span>
                  <span className="text-xl font-bold text-slate-900">{sys.count}</span>
                </div>
                <div className="text-sm font-medium text-slate-700">{sys.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-semibold text-slate-900">Departmental IT Allocation</h3>
          </div>
          <span className="text-sm text-slate-400">{departmentStats.length} departments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 px-4 font-medium">Department</th>
                <th className="py-3 px-4 font-medium text-center">Staff</th>
                <th className="py-3 px-4 font-medium text-center">Opera</th>
                <th className="py-3 px-4 font-medium text-center">Simphony</th>
                <th className="py-3 px-4 font-medium text-center">M365</th>
                <th className="py-3 px-4 font-medium text-center">VPN</th>
                <th className="py-3 px-4 font-medium text-center">Tagged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentStats.map(stat => (
                <tr key={stat.department} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900">{stat.department}</td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-slate-800">{stat.totalActive}</td>
                  <td className="py-3 px-4 text-center font-mono text-sky-700">{stat.operaSeats || '—'}</td>
                  <td className="py-3 px-4 text-center font-mono text-emerald-700">{stat.simphonySeats || '—'}</td>
                  <td className="py-3 px-4 text-center font-mono text-blue-700">{stat.m365Assigned}</td>
                  <td className="py-3 px-4 text-center font-mono text-blue-700">{stat.vfarVpnCount || '—'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-mono font-semibold ${stat.taggedPct === 100 ? 'text-emerald-700' : 'text-blue-700'}`}>
                      {stat.taggedPct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboarding & Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-semibold text-slate-900">Onboarding Pipeline</h3>
            </div>
            <button
              onClick={() => onNavigateTab('lifecycle')}
              className="text-sm font-medium text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              View Lifecycle <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {onboardingMembers.length === 0 ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm text-slate-600">All personnel provisioned</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {onboardingMembers.map(member => (
                <div
                  key={member.id}
                  onClick={() => onSelectMember(member)}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{member.employeeName}</div>
                    <div className="text-sm text-slate-500">{member.jobTitle} · {member.department}</div>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                    Provisioning
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
            </div>
            <button
              onClick={() => onNavigateTab('audit')}
              className="text-sm font-medium text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              Full Audit <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {log.action}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">{log.memberName}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-1">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
