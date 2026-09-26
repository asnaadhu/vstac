import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Server, 
  Search
} from 'lucide-react';
import { TeamMemberRecord } from '../types';

interface AccessMatrixViewProps {
  members: TeamMemberRecord[];
  onToggleSystemAccess: (
    memberId: string, 
    systemKey: keyof TeamMemberRecord['systems'] | 'visionline' | 'adobeCc' | 'minorVpn' | 'vfarLocalVpn',
    currentVal: boolean
  ) => void;
}

export const AccessMatrixView: React.FC<AccessMatrixViewProps> = ({
  members,
  onToggleSystemAccess
}) => {
  const [search, setSearch] = useState('');

  const activeMembers = members.filter(m => m.status === 'Active');

  const filteredMembers = activeMembers.filter(m => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = m.employeeName.toLowerCase().includes(q) ||
                    m.jobTitle.toLowerCase().includes(q) ||
                    m.department.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Matrix Columns Definition
  const systemsCols = [
    { key: 'operaCloud', label: 'Opera Cloud', category: 'PMS', count: activeMembers.filter(m => m.systems.operaCloud.assigned).length },
    { key: 'microsSimphony', label: 'Micros Simphony', category: 'POS', count: activeMembers.filter(m => m.systems.microsSimphony.assigned).length },
    { key: 'oracleFusion', label: 'Oracle Fusion', category: 'ERP', count: activeMembers.filter(m => m.systems.oracleFusion.assigned).length },
    { key: 'zenoti', label: 'Zenoti Spa', category: 'Spa', count: activeMembers.filter(m => m.systems.zenoti.assigned).length },
    { key: 'messageBox', label: 'MessageBox', category: 'Ops', count: activeMembers.filter(m => m.systems.messageBox.assigned).length },
    { key: 'tableCheck', label: 'TableCheck', category: 'F&B', count: activeMembers.filter(m => m.systems.tableCheck.assigned).length },
    { key: 'minorHotelsApp', label: 'Minor App', category: 'Guest', count: activeMembers.filter(m => m.systems.minorHotelsApp.assigned).length },
    { key: 'visionline', label: 'Visionline Key', category: 'Door RFID', count: activeMembers.filter(m => m.security.visionline.assigned).length },
    { key: 'adobeCc', label: 'Adobe CC', category: 'Creative', count: activeMembers.filter(m => m.creativeProductivity.adobeCc.assigned).length },
    { key: 'vfarLocalVpn', label: 'VFAR Island VPN', category: 'Island VFAR', count: activeMembers.filter(m => m.vpn.vfarLocalVpn).length },
    { key: 'minorVpn', label: 'Minor VPN', category: 'Corporate', count: activeMembers.filter(m => m.vpn.minorVpn).length },
  ] as const;

  return (
    <div className="space-y-4">
      
      {/* Overview & Quick Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-600" /> Enterprise Access Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live authorization matrix across Minor Hotels core hospitality platforms and PMS tools. Click any cell to toggle.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff in matrix..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 font-semibold text-xs shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="font-mono font-bold">VFAR</span>
              <span className="text-[11px] text-slate-600 hidden sm:inline">· {activeMembers.length} active staff</span>
            </div>
          </div>
        </div>

        {/* Seat Usage Stats Pill Strip */}
        <div className="flex items-center gap-3 overflow-x-auto pt-4 mt-3 border-t border-slate-100 text-xs scrollbar-none">
          {systemsCols.map(col => (
            <div key={col.key} className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium">{col.label}:</span>
              <strong className="text-blue-700 font-mono">{col.count}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Access Grid Table (md and up) */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 sticky top-0 select-none">
              <tr>
                <th className="py-3 px-3.5 min-w-[200px] font-semibold text-slate-700">
                  Staff Member & Title
                </th>
                <th className="py-3 px-3.5 min-w-[140px] font-semibold text-slate-700">
                  Property
                </th>
                {systemsCols.map(col => (
                  <th key={col.key} className="py-3 px-2 text-center min-w-[85px]">
                    <div className="font-semibold text-slate-700">{col.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{col.category}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredMembers.map((member) => {
                const getIsAssigned = (key: string): { assigned: boolean; remarks: string } => {
                  if (key === 'visionline') {
                    return { assigned: member.security.visionline.assigned, remarks: member.security.visionline.remarks };
                  }
                  if (key === 'adobeCc') {
                    return { assigned: member.creativeProductivity.adobeCc.assigned, remarks: member.creativeProductivity.adobeCc.remarks };
                  }
                  if (key === 'minorVpn') {
                    return { assigned: member.vpn.minorVpn, remarks: member.vpn.remarks };
                  }
                  if (key === 'vfarLocalVpn') {
                    return { assigned: member.vpn.vfarLocalVpn, remarks: member.vpn.remarks };
                  }
                  const sys = member.systems[key as keyof TeamMemberRecord['systems']];
                  return sys ? { assigned: sys.assigned, remarks: sys.remarks } : { assigned: false, remarks: '' };
                };

                return (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name & Job */}
                    <td className="py-2.5 px-3.5">
                      <div className="font-semibold text-slate-900">{member.employeeName}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{member.jobTitle}</div>
                    </td>

                    {/* Property */}
                    <td className="py-2.5 px-3.5 text-slate-700">
                      <div className="line-clamp-1">{member.propertyOrLocation}</div>
                      <div className="text-[11px] text-slate-400">{member.department}</div>
                    </td>

                    {/* System Cells */}
                    {systemsCols.map(col => {
                      const { assigned, remarks } = getIsAssigned(col.key);

                      return (
                        <td key={col.key} className="py-2 px-2 text-center">
                          <button
                            onClick={() => onToggleSystemAccess(member.id, col.key as any, assigned)}
                            className={`w-8 h-8 rounded-lg inline-flex items-center justify-center transition-all ${
                              assigned
                                ? 'bg-blue-100/80 text-blue-900 border border-blue-300 hover:bg-blue-200 shadow-sm font-semibold'
                                : 'bg-slate-50 text-slate-400 border border-slate-200 hover:text-slate-700 hover:border-slate-300'
                            }`}
                            title={remarks ? `${col.label}: ${remarks}` : `${col.label}: ${assigned ? 'Assigned' : 'Unassigned'} (Click to toggle)`}
                          >
                            {assigned ? (
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            ) : (
                              <X className="w-3.5 h-3.5 stroke-[1.5]" />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Displaying <strong>{filteredMembers.length}</strong> active members in authorization matrix
          </span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            Changes to system access are instantly synchronized and logged to the security audit trail.
          </span>
        </div>
      </div>

      {/* Mobile Card View (below md) */}
      <div className="md:hidden space-y-3">
        {filteredMembers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl py-12 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-700">No staff found</p>
            <p className="text-xs text-slate-500 mt-1">Try a different search.</p>
          </div>
        ) : (
          filteredMembers.map((member) => {
            const getIsAssigned = (key: string): boolean => {
              if (key === 'visionline') return member.security.visionline.assigned;
              if (key === 'adobeCc') return member.creativeProductivity.adobeCc.assigned;
              if (key === 'minorVpn') return member.vpn.minorVpn;
              if (key === 'vfarLocalVpn') return member.vpn.vfarLocalVpn;
              const sys = member.systems[key as keyof TeamMemberRecord['systems']];
              return sys ? sys.assigned : false;
            };
            const assignedCount = systemsCols.filter(col => getIsAssigned(col.key)).length;

            return (
              <div key={member.id} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900 text-sm truncate">{member.employeeName}</div>
                    <div className="text-xs text-slate-500 truncate">{member.jobTitle} · {member.department}</div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full shrink-0 ml-2">
                    {assignedCount}/{systemsCols.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {systemsCols.map(col => {
                    const assigned = getIsAssigned(col.key);
                    return (
                      <button
                        key={col.key}
                        onClick={() => onToggleSystemAccess(member.id, col.key as any, assigned)}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-[11px] font-medium transition-all ${
                          assigned
                            ? 'bg-blue-50 text-blue-900 border border-blue-200'
                            : 'bg-slate-50 text-slate-500 border border-slate-200'
                        }`}
                      >
                        <span className="truncate">{col.label}</span>
                        {assigned ? (
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
        <div className="text-center text-xs text-slate-500 py-2">
          Displaying <strong>{filteredMembers.length}</strong> active members
        </div>
      </div>

    </div>
  );
};
