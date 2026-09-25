import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Eye,
  Edit3,
  Trash2,
  Mail,
  Wifi,
  Download,
  AlertCircle,
  QrCode,
} from 'lucide-react';
import { TeamMemberRecord, MemberStatus, FilterState, memberHasHardware, memberHasUntaggedHardware, memberPrimaryAssetTag } from '../types';
import { DEPARTMENT_OPTIONS } from '../data/initialData';
import { exportToCSV, downloadFile } from '../utils/storage';

interface MemberTableProps {
  members: TeamMemberRecord[];
  filterState: FilterState;
  onFilterChange: (newFilter: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onSelectMember: (member: TeamMemberRecord) => void;
  onEditMember: (member: TeamMemberRecord) => void;
  onDeleteMember: (id: string, name: string) => void;
  onBulkUpdateStatus: (ids: string[], newStatus: MemberStatus) => void;
  onViewHardwareQR?: (assetTag: string) => void;
  onViewMemberQR?: (member: TeamMemberRecord) => void;
}

type SortField = 'employeeName' | 'jobTitle' | 'department' | 'propertyOrLocation' | 'status' | 'updatedAt';

export const MemberTable: React.FC<MemberTableProps> = ({
  members,
  filterState,
  onFilterChange,
  onResetFilters,
  onSelectMember,
  onEditMember,
  onDeleteMember,
  onBulkUpdateStatus,
  onViewHardwareQR,
  onViewMemberQR
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('employeeName');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (filterState.search.trim()) {
        const q = filterState.search.toLowerCase();
        const matchName = m.employeeName.toLowerCase().includes(q);
        const matchJob = m.jobTitle.toLowerCase().includes(q);
        const matchEmail = m.email.address.toLowerCase().includes(q);
        const matchAD = m.activeDirectory.username.toLowerCase().includes(q);
        const matchSerial = m.hardware.some(h => h.serialNumber.toLowerCase().includes(q));
        const matchAsset = m.hardware.some(h => h.assetTag.toLowerCase().includes(q));
        const matchPhone = m.telephony.companyNumber.toLowerCase().includes(q);
        if (!matchName && !matchJob && !matchEmail && !matchAD && !matchSerial && !matchAsset && !matchPhone) {
          return false;
        }
      }
      if (filterState.status !== 'All' && m.status !== filterState.status) return false;
      if (filterState.property !== 'All' && m.propertyOrLocation !== filterState.property) return false;
      if (filterState.department !== 'All' && m.department !== filterState.department) return false;
      if (filterState.licenseType !== 'All' && m.email.licenseType !== filterState.licenseType) return false;
      if (filterState.systemFilter !== 'All') {
        const sysKey = filterState.systemFilter as keyof TeamMemberRecord['systems'];
        if (m.systems[sysKey] && !m.systems[sysKey].assigned) return false;
      }
      if (filterState.vpnOnly && !m.vpn.minorVpn && !m.vpn.vfarLocalVpn) return false;
      if (filterState.leadersDLOnly && !m.email.leadersDL) return false;
      if (filterState.missingAssetTag && (!memberHasHardware(m) || !memberHasUntaggedHardware(m) || m.status === 'Offboarded')) return false;
      return true;
    });
  }, [members, filterState]);

  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string' && typeof valB === 'string') {
        const cmp = valA.localeCompare(valB);
        return sortAsc ? cmp : -cmp;
      }
      return 0;
    });
  }, [filteredMembers, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(sortedMembers.map(m => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBulkExport = () => {
    const selectedRecords = members.filter(m => selectedIds.includes(m.id));
    const csvData = exportToCSV(selectedRecords);
    downloadFile(csvData, `minor_hotels_selected_members_${Date.now()}.csv`, 'text/csv');
  };

  const hasActiveFilters =
    filterState.status !== 'All' ||
    filterState.property !== 'All' ||
    filterState.department !== 'All' ||
    filterState.licenseType !== 'All' ||
    filterState.systemFilter !== 'All' ||
    filterState.vpnOnly ||
    filterState.leadersDLOnly ||
    filterState.missingAssetTag ||
    filterState.search !== '';

  return (
    <div className="space-y-5">

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterState.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              placeholder="Search by name, email, asset tag..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterState.department}
              onChange={(e) => onFilterChange({ department: e.target.value })}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="All">All Departments</option>
              {DEPARTMENT_OPTIONS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={filterState.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Offboarded">Offboarded</option>
              <option value="Suspended">Suspended</option>
            </select>

            <select
              value={filterState.licenseType}
              onChange={(e) => onFilterChange({ licenseType: e.target.value })}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="All">All Licenses</option>
              <option value="M365 E5">M365 E5</option>
              <option value="M365 E3">M365 E3</option>
              <option value="M365 F3">M365 F3</option>
              <option value="Exchange Online">Exchange Online</option>
              <option value="None">No License</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="px-3 py-2 text-sm text-slate-500 hover:text-blue-700 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Operations Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-blue-900">{selectedIds.length} selected</span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-blue-700 hover:underline"
            >
              Deselect all
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleBulkExport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-lg font-medium transition-colors text-sm"
            >
              <Download className="w-4 h-4 text-blue-700" />
              Export CSV
            </button>
            <button
              onClick={() => { onBulkUpdateStatus(selectedIds, 'Active'); setSelectedIds([]); }}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-medium transition-colors text-sm"
            >
              Set Active
            </button>
            <button
              onClick={() => { onBulkUpdateStatus(selectedIds, 'Offboarded'); setSelectedIds([]); }}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-medium transition-colors text-sm"
            >
              Set Offboarded
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/90 text-slate-500 border-b border-slate-200 select-none">
              <tr>
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={sortedMembers.length > 0 && selectedIds.length === sortedMembers.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th
                  onClick={() => handleSort('employeeName')}
                  className="py-3 px-4 font-medium text-slate-700 cursor-pointer hover:text-blue-700 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Member</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('department')}
                  className="py-3 px-4 font-medium text-slate-700 cursor-pointer hover:text-blue-700 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Department</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 font-medium text-slate-700 cursor-pointer hover:text-blue-700 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 font-medium text-slate-700">License</th>
                <th className="py-3 px-4 font-medium text-slate-700">Asset Tag</th>
                <th className="py-3 px-4 font-medium text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-base font-medium text-slate-700">No personnel records found</p>
                    <p className="text-sm text-slate-500 mt-1">Try broadening your search or clearing filters.</p>
                  </td>
                </tr>
              ) : (
                sortedMembers.map((member) => {
                  const isSelected = selectedIds.includes(member.id);
                  let statusDot = 'bg-emerald-500';
                  let statusText = 'text-emerald-700';
                  if (member.status === 'Onboarding') {
                    statusDot = 'bg-blue-500 animate-pulse';
                    statusText = 'text-blue-700';
                  } else if (member.status === 'Offboarded') {
                    statusDot = 'bg-slate-400';
                    statusText = 'text-slate-500';
                  } else if (member.status === 'Suspended') {
                    statusDot = 'bg-rose-500';
                    statusText = 'text-rose-700';
                  }
                  const hasVpn = member.vpn.minorVpn || member.vpn.vfarLocalVpn;

                  return (
                    <tr
                      key={member.id}
                      className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(member.id)}
                          className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onSelectMember(member)}
                          className="text-left font-semibold text-slate-900 hover:text-blue-700 transition-colors block text-sm"
                        >
                          {member.employeeName}
                        </button>
                        <div className="text-sm text-slate-500">{member.jobTitle}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="text-sm text-slate-500 truncate max-w-[200px]" title={member.email.address}>
                            {member.email.address || '—'}
                          </span>
                          {hasVpn && (
                            <>
                              <span className="text-slate-300">·</span>
                              <Wifi className="w-3 h-3 text-sky-600" />
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{member.department}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${statusDot}`} />
                          <span className={`font-medium ${statusText}`}>{member.status}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-sm ${member.email.licenseType === 'None' ? 'text-slate-400' : 'text-sky-700 font-medium'}`}>
                          {member.email.licenseType}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {(() => {
                          const primaryTag = memberPrimaryAssetTag(member);
                          if (primaryTag) {
                            return (
                              <button
                                type="button"
                                onClick={() => onViewHardwareQR ? onViewHardwareQR(primaryTag) : onSelectMember(member)}
                                className="text-sm font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-50 px-2 py-1 rounded border border-blue-200 transition-colors flex items-center gap-1.5"
                                title="View QR code & hardware details"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                                {primaryTag}
                                {member.hardware.length > 1 && (
                                  <span className="text-slate-400 font-normal">+{member.hardware.length - 1}</span>
                                )}
                              </button>
                            );
                          }
                          if (memberHasUntaggedHardware(member)) {
                            return (
                              <span className="text-sm text-rose-600 font-medium flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> Untagged
                              </span>
                            );
                          }
                          return <span className="text-sm text-slate-400">No hardware</span>;
                        })()}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {onViewMemberQR && (
                            <button
                              onClick={() => onViewMemberQR(member)}
                              className="p-2 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View QR Pass"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onSelectMember(member)}
                            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditMember(member)}
                            className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Record"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove record for "${member.employeeName}"?`)) {
                                onDeleteMember(member.id, member.employeeName);
                              }
                            }}
                            className="p-2 text-slate-500 hover:text-rose-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3.5 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <div>
            Showing <strong className="text-slate-900 font-mono">{sortedMembers.length}</strong> of{' '}
            <strong className="text-slate-900 font-mono">{members.length}</strong> members
          </div>
        </div>
      </div>
    </div>
  );
};
