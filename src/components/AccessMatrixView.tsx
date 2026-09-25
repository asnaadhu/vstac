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
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-600" /> Enterprise Access Matrix
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
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-semibold text-xs shrink-0">
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
              <strong className="text-amber-700 font-mono">{col.count}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Access Grid Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
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
                                ? 'bg-amber-100/80 text-amber-900 border border-amber-300 hover:bg-amber-200 shadow-2xs font-semibold'
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
          <span className="text-slate-400 text-[11px]">
            Changes to system access are instantly synchronized and logged to the security audit trail.
          </span>
        </div>
      </div>

    </div>
  );
};
