import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Eye, 
  Edit3, 
  Trash2, 
  Laptop, 
  Mail, 
  Wifi, 
  KeyRound, 
  Download,
  AlertCircle,
  QrCode
} from 'lucide-react';
import { TeamMemberRecord, MemberStatus, FilterState } from '../types';
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

  // Filtering
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // 1. Search text
      if (filterState.search.trim()) {
        const q = filterState.search.toLowerCase();
        const matchName = m.employeeName.toLowerCase().includes(q);
        const matchJob = m.jobTitle.toLowerCase().includes(q);
        const matchEmail = m.email.address.toLowerCase().includes(q);
        const matchAD = m.activeDirectory.username.toLowerCase().includes(q);
        const matchSerial = m.hardware.serialNumber.toLowerCase().includes(q);
        const matchAsset = m.hardware.assetTag.toLowerCase().includes(q);
        const matchPhone = m.telephony.companyNumber.toLowerCase().includes(q);

        if (!matchName && !matchJob && !matchEmail && !matchAD && !matchSerial && !matchAsset && !matchPhone) {
          return false;
        }
      }

      // 2. Status
      if (filterState.status !== 'All' && m.status !== filterState.status) {
        return false;
      }

      // 3. Property
      if (filterState.property !== 'All' && m.propertyOrLocation !== filterState.property) {
        return false;
      }

      // 4. Department
      if (filterState.department !== 'All' && m.department !== filterState.department) {
        return false;
      }

      // 5. License Type
      if (filterState.licenseType !== 'All' && m.email.licenseType !== filterState.licenseType) {
        return false;
      }

      // 6. System Filter
      if (filterState.systemFilter !== 'All') {
        const sysKey = filterState.systemFilter as keyof TeamMemberRecord['systems'];
        if (m.systems[sysKey] && !m.systems[sysKey].assigned) {
          return false;
        }
      }

      // 7. VPN Only
      if (filterState.vpnOnly && !m.vpn.minorVpn && !m.vpn.vfarLocalVpn) {
        return false;
      }

      // 8. Leaders DL only
      if (filterState.leadersDLOnly && !m.email.leadersDL) {
        return false;
      }

      // 9. Missing Asset Tag
      if (filterState.missingAssetTag && (m.hardware.assetTag.trim().length > 0 || m.status === 'Offboarded')) {
        return false;
      }

      return true;
    });
  }, [members, filterState]);

  // Sorting
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
    <div className="space-y-4">
      
      {/* Search & Advanced Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterState.search}
                onChange={(e) => onFilterChange({ search: e.target.value })}
                placeholder="Search staff name, job title, email, AD user, serial, asset tag..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Avani+ Fares Scope Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-semibold text-xs shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="font-mono font-bold">VFAR</span>
              <span className="text-[11px] text-slate-600 hidden md:inline">· Avani+ Fares Maldives</span>
            </div>

            {/* Department Filter */}
            <select
              value={filterState.department}
              onChange={(e) => onFilterChange({ department: e.target.value })}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Departments</option>
              {DEPARTMENT_OPTIONS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterState.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Offboarded">Offboarded</option>
              <option value="Suspended">Suspended</option>
            </select>

            {/* License Filter */}
            <select
              value={filterState.licenseType}
              onChange={(e) => onFilterChange({ licenseType: e.target.value })}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All M365 Licenses</option>
              <option value="M365 E5">M365 E5</option>
              <option value="M365 E3">M365 E3</option>
              <option value="M365 F3">M365 F3</option>
              <option value="Exchange Online">Exchange Online</option>
              <option value="None">No License</option>
            </select>

            {/* Core System filter */}
            <select
              value={filterState.systemFilter}
              onChange={(e) => onFilterChange({ systemFilter: e.target.value })}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">Any System</option>
              <option value="operaCloud">Opera Cloud PMS</option>
              <option value="microsSimphony">Micros Simphony POS</option>
              <option value="oracleFusion">Oracle Fusion ERP</option>
              <option value="zenoti">Zenoti Spa</option>
              <option value="messageBox">MessageBox</option>
              <option value="tableCheck">TableCheck</option>
            </select>
          </div>

          {/* Quick flags & Reset */}
          <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <button
              onClick={() => onFilterChange({ leadersDLOnly: !filterState.leadersDLOnly })}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filterState.leadersDLOnly
                  ? 'bg-amber-100/80 border-amber-300 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              Leaders DL
            </button>
            <button
              onClick={() => onFilterChange({ vpnOnly: !filterState.vpnOnly })}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filterState.vpnOnly
                  ? 'bg-sky-100/80 border-sky-300 text-sky-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              VPN Active
            </button>
            <button
              onClick={() => onFilterChange({ missingAssetTag: !filterState.missingAssetTag })}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filterState.missingAssetTag
                  ? 'bg-rose-100/80 border-rose-300 text-rose-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              Untagged Device
            </button>

            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-amber-700 underline underline-offset-4"
              >
                Clear
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Bulk Operations Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-950">{selectedIds.length} members selected</span>
            <span className="text-amber-400">·</span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-amber-800 hover:underline"
            >
              Deselect all
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleBulkExport}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-lg font-medium transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-amber-700" />
              <span>Export Selected CSV</span>
            </button>
            
            <button
              onClick={() => {
                onBulkUpdateStatus(selectedIds, 'Active');
                setSelectedIds([]);
              }}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-medium transition-colors"
            >
              Set as Active
            </button>

            <button
              onClick={() => {
                onBulkUpdateStatus(selectedIds, 'Offboarded');
                setSelectedIds([]);
              }}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-medium transition-colors"
            >
              Set as Offboarded
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 select-none">
              <tr>
                <th className="py-3 px-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={sortedMembers.length > 0 && selectedIds.length === sortedMembers.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 bg-white text-amber-600 focus:ring-amber-500"
                  />
                </th>
                <th 
                  onClick={() => handleSort('employeeName')}
                  className="py-3 px-3.5 font-semibold text-slate-700 cursor-pointer hover:text-amber-800 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Member & Title</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('department')}
                  className="py-3 px-3.5 font-semibold text-slate-700 cursor-pointer hover:text-amber-800 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Department</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('status')}
                  className="py-3 px-3.5 font-semibold text-slate-700 cursor-pointer hover:text-amber-800 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3.5 font-semibold text-slate-700">
                  Email & License
                </th>
                <th className="py-3 px-3.5 font-semibold text-slate-700">
                  Hardware & Asset Tag
                </th>
                <th className="py-3 px-3.5 font-semibold text-slate-700">
                  AD User & VPN
                </th>
                <th className="py-3 px-3.5 font-semibold text-slate-700">
                  Core PMS / POS
                </th>
                <th className="py-3 px-3.5 font-semibold text-slate-700 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedMembers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">No personnel records found</p>
                    <p className="text-xs text-slate-500 mt-1">Try broadening your search query or clearing active filters.</p>
                  </td>
                </tr>
              ) : (
                sortedMembers.map((member) => {
                  const isSelected = selectedIds.includes(member.id);

                  // Status dot and style
                  let statusDot = 'bg-emerald-500';
                  let statusText = 'text-emerald-700';
                  if (member.status === 'Onboarding') {
                    statusDot = 'bg-amber-500 animate-pulse';
                    statusText = 'text-amber-700';
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
                      className={`hover:bg-slate-50/80 transition-colors group ${
                        isSelected ? 'bg-amber-50/60' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(member.id)}
                          className="rounded border-slate-300 bg-white text-amber-600 focus:ring-amber-500"
                        />
                      </td>

                      {/* Name & Title */}
                      <td className="py-3 px-3.5">
                        <button
                          onClick={() => onSelectMember(member)}
                          className="text-left font-semibold text-slate-900 hover:text-amber-700 transition-colors block text-sm"
                        >
                          {member.employeeName}
                        </button>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {member.jobTitle}
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-3.5">
                        <div className="text-slate-800 font-semibold line-clamp-1">
                          {member.department}
                        </div>
                        <div className="text-[10px] text-amber-800 font-mono flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          VFAR Island
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${statusDot}`}></span>
                          <span className={`font-semibold ${statusText}`}>
                            {member.status}
                          </span>
                        </div>
                      </td>

                      {/* Email & License */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-800">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[170px]" title={member.email.address}>
                            {member.email.address || '—'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <span className={member.email.licenseType === 'None' ? 'text-slate-400' : 'text-sky-700 font-medium'}>
                            {member.email.licenseType}
                          </span>
                          {member.email.leadersDL && (
                            <>
                              <span className="text-slate-300">·</span>
                              <span className="text-amber-800 font-medium">Leaders DL</span>
                            </>
                          )}
                          {member.email.dhDL && (
                            <>
                              <span className="text-slate-300">·</span>
                              <span className="text-amber-700 font-medium">DH DL</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Hardware & Asset Tag */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-1.5 text-slate-800 line-clamp-1">
                          <Laptop className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[160px]" title={member.hardware.pcLaptopModel}>
                            {member.hardware.pcLaptopModel || 'No hardware'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] mt-0.5">
                          {member.hardware.assetTag ? (
                            <button
                              type="button"
                              onClick={() => onViewHardwareQR ? onViewHardwareQR(member.hardware.assetTag) : onSelectMember(member)}
                              className="text-amber-800 font-semibold hover:text-amber-950 hover:bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-300/80 transition-colors flex items-center gap-1 group shadow-2xs"
                              title="Click to view QR Code sticker & hardware assignment details"
                            >
                              <QrCode className="w-3 h-3 text-amber-700 group-hover:scale-110 transition-transform" />
                              <span>{member.hardware.assetTag}</span>
                            </button>
                          ) : member.status !== 'Offboarded' ? (
                            <span className="text-rose-700 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Untagged
                            </span>
                          ) : (
                            <span className="text-slate-400">None</span>
                          )}
                          {member.hardware.serialNumber && (
                            <span className="text-slate-400">
                              (S/N: {member.hardware.serialNumber})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* AD User & VPN */}
                      <td className="py-3 px-3.5">
                        <div className="font-mono text-[11px] text-slate-800 line-clamp-1">
                          {member.activeDirectory.username || '—'}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          {hasVpn ? (
                            <span className="text-sky-700 font-medium flex items-center gap-1">
                              <Wifi className="w-3 h-3 text-sky-600" />
                              {member.vpn.minorVpn && member.vpn.vfarLocalVpn ? 'Dual VPN' : member.vpn.minorVpn ? 'Minor VPN' : 'VFAR VPN'}
                            </span>
                          ) : (
                            <span className="text-slate-400">No VPN</span>
                          )}
                          {member.security.visionline.assigned && (
                            <>
                              <span className="text-slate-300">·</span>
                              <span className="text-amber-800 flex items-center gap-0.5" title="Visionline keycard access">
                                <KeyRound className="w-3 h-3" /> Key
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Core PMS / POS Badges */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {member.systems.operaCloud.assigned && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-medium" title="Opera Cloud PMS">
                              Opera
                            </span>
                          )}
                          {member.systems.microsSimphony.assigned && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium" title="Micros Simphony POS">
                              Simphony
                            </span>
                          )}
                          {member.systems.oracleFusion.assigned && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium" title="Oracle Fusion ERP">
                              Fusion
                            </span>
                          )}
                          {member.systems.zenoti.assigned && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-medium" title="Zenoti Spa">
                              Zenoti
                            </span>
                          )}
                          {member.systems.messageBox.assigned && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium" title="MessageBox Work Orders">
                              MsgBox
                            </span>
                          )}
                          {!member.systems.operaCloud.assigned && 
                           !member.systems.microsSimphony.assigned && 
                           !member.systems.oracleFusion.assigned && 
                           !member.systems.zenoti.assigned && 
                           !member.systems.messageBox.assigned && (
                            <span className="text-[11px] text-slate-400">—</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {onViewMemberQR && (
                            <button
                              onClick={() => onViewMemberQR(member)}
                              className="p-1.5 text-amber-700 hover:text-amber-900 hover:bg-amber-100/80 rounded transition-colors"
                              title="Generate & View Staff QR Pass"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onSelectMember(member)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditMember(member)}
                            className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-slate-100 rounded transition-colors"
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
                            className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-slate-100 rounded transition-colors"
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

        {/* Table Footer */}
        <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900 font-mono">{sortedMembers.length}</strong> of{' '}
            <strong className="text-slate-900 font-mono">{members.length}</strong> team members
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-slate-400">Click any row name to open quick inspector</span>
          </div>
        </div>

      </div>

    </div>
  );
};
