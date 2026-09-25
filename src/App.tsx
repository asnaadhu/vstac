import React, { useState, useEffect } from 'react';
import { 
  TeamMemberRecord, 
  AuditLogEntry, 
  ActiveTab, 
  FilterState, 
  MemberStatus,
  HardwareItem 
} from './types';
import { 
  loadMembers, 
  saveMembers, 
  loadAuditLog, 
  saveAuditLog, 
  createAuditEntry,
  loadHardwareInventory,
  saveHardwareInventory
} from './utils/storage';
import { INITIAL_MEMBERS, INITIAL_HARDWARE_INVENTORY } from './data/initialData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { MemberTable } from './components/MemberTable';
import { MemberDetailDrawer } from './components/MemberDetailDrawer';
import { MemberModal } from './components/MemberModal';
import { AccessMatrixView } from './components/AccessMatrixView';
import { HardwareInventoryView } from './components/HardwareInventoryView';
import { LifecycleView } from './components/LifecycleView';
import { AuditLogView } from './components/AuditLogView';
import { ImportExportModal } from './components/ImportExportModal';
import { HardwareQRModal } from './components/HardwareQRModal';
import { QRScannerModal } from './components/QRScannerModal';

// Helper to extract part identifier from URL query (?part=ID, ?sku=123) or hash
const getPartParamFromUrl = (): string | null => {
  const searchParams = new URLSearchParams(window.location.search);
  let param = searchParams.get('part') || 
              searchParams.get('sku') || 
              searchParams.get('id') || 
              searchParams.get('assetTag') || 
              searchParams.get('tag') || 
              searchParams.get('scan');

  if (!param && window.location.hash) {
    const hashClean = window.location.hash.replace(/^#\/?/, '');
    const hashParams = new URLSearchParams(hashClean);
    param = hashParams.get('part') || hashParams.get('sku') || hashParams.get('id') || hashParams.get('assetTag') || hashParams.get('tag') || hashParams.get('scan');
  }
  return param ? param.trim() : null;
};

const findPartInInventory = (query: string, inventory: HardwareItem[]): HardwareItem | null => {
  if (!query) return null;
  const clean = query.trim().toLowerCase();
  return inventory.find(h => 
    h.id.toLowerCase() === clean ||
    h.assetTag.toLowerCase() === clean ||
    (h.serialNumber && h.serialNumber.toLowerCase() === clean)
  ) || null;
};

export default function App() {
  const [members, setMembers] = useState<TeamMemberRecord[]>(() => loadMembers());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => loadAuditLog());
  const [hardwareInventory, setHardwareInventory] = useState<HardwareItem[]>(() => loadHardwareInventory());
  
  // 2. On-Load Detection: Check if URL has ?part=ID. If found, bypass home screen ('dashboard') and jump to 'hardware'
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    const initialPartQuery = getPartParamFromUrl();
    return initialPartQuery ? 'hardware' : 'dashboard';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Search & Filter State - Defaults to Avani+ Fares Maldives Resort (VFAR Flagship)
  const initialFilter: FilterState = {
    search: '',
    status: 'All',
    property: 'Avani+ Fares Maldives Resort',
    department: 'All',
    licenseType: 'All',
    systemFilter: 'All',
    vpnOnly: false,
    leadersDLOnly: false,
    missingAssetTag: false
  };
  const [filterState, setFilterState] = useState<FilterState>(initialFilter);

  // Modals & Drawers
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberRecord | null>(null);
  const [selectedDrawerMember, setSelectedDrawerMember] = useState<TeamMemberRecord | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  // Global QR Scanner & Detail Modal states:
  // 2. On-Load Detection: immediately open details view for part found in URL on first load
  const [globalQRItem, setGlobalQRItem] = useState<HardwareItem | null>(() => {
    const initialPartQuery = getPartParamFromUrl();
    if (!initialPartQuery) return null;
    const initialInventory = loadHardwareInventory();
    return findPartInInventory(initialPartQuery, initialInventory);
  });
  const [isGlobalScannerOpen, setIsGlobalScannerOpen] = useState(false);

  // 1 & 2. URL Query Routing & On-Load Detection effect + popstate listener for back/forward browser buttons
  useEffect(() => {
    const syncFromUrl = () => {
      const partQuery = getPartParamFromUrl();
      if (partQuery) {
        const match = findPartInInventory(partQuery, hardwareInventory);
        if (match) {
          setActiveTab('hardware');
          setGlobalQRItem(match);

          // Normalize the query string to ?part=ID if it used an alias
          const currentParams = new URLSearchParams(window.location.search);
          if (currentParams.get('part') !== match.id) {
            currentParams.set('part', match.id);
            window.history.replaceState({ partId: match.id }, '', `${window.location.pathname}?${currentParams.toString()}`);
          }
        }
      }
    };

    syncFromUrl();

    // Listen to browser Back / Forward buttons (popstate)
    const handlePopState = () => {
      const partQuery = getPartParamFromUrl();
      if (partQuery) {
        const match = findPartInInventory(partQuery, hardwareInventory);
        if (match) {
          setActiveTab('hardware');
          setGlobalQRItem(match);
        }
      } else {
        setGlobalQRItem(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [hardwareInventory]);

  // Sync to localStorage
  useEffect(() => {
    saveMembers(members);
  }, [members]);

  useEffect(() => {
    saveAuditLog(auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    saveHardwareInventory(hardwareInventory);
  }, [hardwareInventory]);

  // Keep drawer member updated if modified in background
  useEffect(() => {
    if (selectedDrawerMember) {
      const refreshed = members.find(m => m.id === selectedDrawerMember.id);
      if (refreshed) {
        setSelectedDrawerMember(refreshed);
      } else {
        setSelectedDrawerMember(null);
      }
    }
  }, [members]);

  const addAuditLog = (
    memberId: string, 
    memberName: string, 
    action: AuditLogEntry['action'], 
    details: string
  ) => {
    const entry = createAuditEntry(memberId, memberName, action, details);
    setAuditLogs(prev => [entry, ...prev]);
  };

  // Handlers
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilters }));
    // If user is searching or applying filters, switch to directory so they see immediate results
    if (newFilters.search !== undefined && newFilters.search.trim().length > 0 && activeTab !== 'directory') {
      setActiveTab('directory');
    }
  };

  const handleResetFilters = () => {
    setFilterState(initialFilter);
  };

  const handleOpenNewMember = () => {
    setEditingMember(null);
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (member: TeamMemberRecord) => {
    setEditingMember(member);
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = (record: TeamMemberRecord) => {
    const isExisting = members.some(m => m.id === record.id);
    const prevMember = members.find(m => m.id === record.id);
    const prevHwId = prevMember?.hardware.hardwareId;
    const prevTag = prevMember?.hardware.assetTag?.trim().toLowerCase();

    const currentHwId = record.hardware.hardwareId;
    const currentTag = record.hardware.assetTag?.trim().toLowerCase();

    if (isExisting) {
      setMembers(prev => prev.map(m => m.id === record.id ? record : m));
      addAuditLog(record.id, record.employeeName, 'Updated', `Updated record details and access configurations.`);
    } else {
      setMembers(prev => [record, ...prev]);
      addAuditLog(record.id, record.employeeName, 'Created', `Provisioned new member record with status "${record.status}".`);
    }

    // Keep hardware inventory in 100% two-way sync with Fleet
    setHardwareInventory(prev => {
      // 1. Release any equipment previously assigned to this member that was unassigned, changed, or if offboarded
      let updated = prev.map(h => {
        const wasAssignedToThisMember = h.assignedMemberId === record.id || 
                                       (prevHwId && h.id === prevHwId) || 
                                       (prevTag && h.assetTag.toLowerCase() === prevTag);
        
        const isStillAssignedToThisItem = (currentHwId && h.id === currentHwId) || 
                                          (currentTag && h.assetTag.toLowerCase() === currentTag);

        if (wasAssignedToThisMember && (!currentTag || !isStillAssignedToThisItem || record.status === 'Offboarded')) {
          return {
            ...h,
            status: 'Available' as const,
            assignedMemberId: null,
            assignedMemberName: null,
            assignedDepartment: null,
            updatedAt: new Date().toISOString()
          };
        }
        return h;
      });

      // 2. If member has hardware assigned and is not offboarded, link or create in fleet inventory
      if (record.hardware.assetTag && record.status !== 'Offboarded') {
        const matchedIndex = updated.findIndex(h => 
          (record.hardware.hardwareId && h.id === record.hardware.hardwareId) ||
          h.assetTag.toLowerCase() === record.hardware.assetTag.trim().toLowerCase()
        );

        if (matchedIndex >= 0) {
          updated = updated.map((h, idx) => {
            if (idx === matchedIndex) {
              return {
                ...h,
                deviceModel: record.hardware.pcLaptopModel || h.deviceModel,
                serialNumber: record.hardware.serialNumber || h.serialNumber,
                status: 'Assigned' as const,
                assignedMemberId: record.id,
                assignedMemberName: record.employeeName,
                assignedDepartment: record.department,
                updatedAt: new Date().toISOString()
              };
            }
            return h;
          });
        } else {
          // Not currently in inventory: register it into Hardware & Fleet inventory
          const newHwItem: HardwareItem = {
            id: record.hardware.hardwareId || `hw-${Date.now()}`,
            assetTag: record.hardware.assetTag.trim(),
            deviceModel: record.hardware.pcLaptopModel || 'Assigned Laptop',
            deviceCategory: 'Laptop',
            serialNumber: record.hardware.serialNumber || '',
            specifications: record.hardware.remarks || 'Standard Resort SOE',
            status: 'Assigned' as const,
            assignedMemberId: record.id,
            assignedMemberName: record.employeeName,
            assignedDepartment: record.department,
            condition: 'Good',
            notes: 'Registered via Staff Profile Hardware Assignment',
            purchaseDate: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString()
          };
          updated = [newHwItem, ...updated];
        }
      }

      return updated;
    });

    setIsMemberModalOpen(false);
    setEditingMember(null);
  };

  const handleDeleteMember = (id: string, name: string) => {
    // If deleted member held hardware, return it to stock
    setHardwareInventory(prev => prev.map(h => {
      if (h.assignedMemberId === id) {
        return {
          ...h,
          status: 'Available',
          assignedMemberId: null,
          assignedMemberName: null,
          assignedDepartment: null,
          updatedAt: new Date().toISOString()
        };
      }
      return h;
    }));

    setMembers(prev => prev.filter(m => m.id !== id));
    addAuditLog(id, name, 'Deleted', `Permanently removed member record from IT inventory.`);
    if (selectedDrawerMember?.id === id) {
      setSelectedDrawerMember(null);
    }
  };

  const handleBulkUpdateStatus = (ids: string[], newStatus: MemberStatus) => {
    if (newStatus === 'Offboarded') {
      // Return hardware of offboarded members to stock
      setHardwareInventory(prev => prev.map(h => {
        if (h.assignedMemberId && ids.includes(h.assignedMemberId)) {
          return {
            ...h,
            status: 'Available',
            assignedMemberId: null,
            assignedMemberName: null,
            assignedDepartment: null,
            updatedAt: new Date().toISOString()
          };
        }
        return h;
      }));
    }

    setMembers(prev => prev.map(m => {
      if (ids.includes(m.id)) {
        return {
          ...m,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return m;
    }));
    addAuditLog('bulk-update', `${ids.length} members`, 'Bulk Action', `Transitioned status of ${ids.length} staff records to "${newStatus}".`);
  };

  const handleToggleMemberStatus = (member: TeamMemberRecord) => {
    const nextStatus: MemberStatus = member.status === 'Active' ? 'Offboarded' : 'Active';
    const updated: TeamMemberRecord = {
      ...member,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    };

    if (nextStatus === 'Offboarded' && member.hardware.assetTag) {
      // Automatically return hardware to Available stock
      setHardwareInventory(prev => prev.map(h => {
        if (h.assignedMemberId === member.id || (member.hardware.hardwareId && h.id === member.hardware.hardwareId)) {
          return {
            ...h,
            status: 'Available',
            assignedMemberId: null,
            assignedMemberName: null,
            assignedDepartment: null,
            updatedAt: new Date().toISOString()
          };
        }
        return h;
      }));
    }

    setMembers(prev => prev.map(m => m.id === member.id ? updated : m));
    addAuditLog(member.id, member.employeeName, 'Status Changed', `Status shifted from ${member.status} to ${nextStatus}.`);
  };

  const handleToggleSystemAccess = (
    memberId: string, 
    systemKey: keyof TeamMemberRecord['systems'] | 'visionline' | 'adobeCc' | 'minorVpn' | 'vfarLocalVpn',
    currentVal: boolean
  ) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    let updated: TeamMemberRecord;
    let label: string = systemKey;

    if (systemKey === 'visionline') {
      label = 'Visionline Keycard';
      updated = {
        ...member,
        security: {
          ...member.security,
          visionline: {
            ...member.security.visionline,
            assigned: !currentVal
          }
        },
        updatedAt: new Date().toISOString()
      };
    } else if (systemKey === 'adobeCc') {
      label = 'Adobe CC';
      updated = {
        ...member,
        creativeProductivity: {
          ...member.creativeProductivity,
          adobeCc: {
            ...member.creativeProductivity.adobeCc,
            assigned: !currentVal
          }
        },
        updatedAt: new Date().toISOString()
      };
    } else if (systemKey === 'minorVpn') {
      label = 'Minor Corporate VPN';
      updated = {
        ...member,
        vpn: {
          ...member.vpn,
          minorVpn: !currentVal
        },
        updatedAt: new Date().toISOString()
      };
    } else if (systemKey === 'vfarLocalVpn') {
      label = 'VFAR Local Island VPN';
      updated = {
        ...member,
        vpn: {
          ...member.vpn,
          vfarLocalVpn: !currentVal
        },
        updatedAt: new Date().toISOString()
      };
    } else {
      const sysObj = member.systems[systemKey];
      updated = {
        ...member,
        systems: {
          ...member.systems,
          [systemKey]: {
            ...sysObj,
            assigned: !currentVal
          }
        },
        updatedAt: new Date().toISOString()
      };
    }

    setMembers(prev => prev.map(m => m.id === memberId ? updated : m));
    addAuditLog(
      memberId, 
      member.employeeName, 
      'Access Modified', 
      `Toggled access for ${label} to ${!currentVal ? 'ASSIGNED' : 'UNASSIGNED'}.`
    );
  };

  const handleAssignHardware = (hardwareId: string, memberId: string, remarks?: string) => {
    const hw = hardwareInventory.find(h => h.id === hardwareId);
    const targetMember = members.find(m => m.id === memberId);
    if (!hw || !targetMember) return;

    // Check if targetMember already had another hardware assigned, and return it to stock
    const prevHwId = targetMember.hardware.hardwareId;
    const prevAssetTag = targetMember.hardware.assetTag;

    // Update hardware inventory
    setHardwareInventory(prev => prev.map(item => {
      if (item.id === hardwareId) {
        return {
          ...item,
          status: 'Assigned',
          assignedMemberId: targetMember.id,
          assignedMemberName: targetMember.employeeName,
          assignedDepartment: targetMember.department,
          notes: remarks ? remarks : item.notes,
          updatedAt: new Date().toISOString()
        };
      }
      // If another hardware was previously assigned to this member, return it to Available stock
      if (item.id !== hardwareId && (item.assignedMemberId === targetMember.id || (prevHwId && item.id === prevHwId) || (prevAssetTag && item.assetTag.toLowerCase() === prevAssetTag.toLowerCase()))) {
        return {
          ...item,
          status: 'Available',
          assignedMemberId: null,
          assignedMemberName: null,
          assignedDepartment: null,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    }));

    // Update member record
    const updatedMember: TeamMemberRecord = {
      ...targetMember,
      hardware: {
        ...targetMember.hardware,
        hardwareId: hw.id,
        pcLaptopModel: hw.deviceModel,
        serialNumber: hw.serialNumber,
        assetTag: hw.assetTag,
        remarks: remarks || targetMember.hardware.remarks || `Assigned from VFAR Fleet inventory (${hw.deviceCategory})`
      },
      updatedAt: new Date().toISOString()
    };

    setMembers(prev => prev.map(m => m.id === targetMember.id ? updatedMember : m));

    addAuditLog(
      targetMember.id,
      targetMember.employeeName,
      'Updated',
      `Assigned fleet hardware ${hw.deviceModel} (Tag: ${hw.assetTag}, S/N: ${hw.serialNumber || 'N/A'}) from Hardware & Fleet inventory.`
    );
  };

  const handleUnassignHardware = (hardwareId: string) => {
    const hw = hardwareInventory.find(h => h.id === hardwareId);
    if (!hw) return;

    const assignedMemberId = hw.assignedMemberId;
    const assignedMemberName = hw.assignedMemberName;

    // Update hardware in inventory to Available
    setHardwareInventory(prev => prev.map(item => {
      if (item.id === hardwareId) {
        return {
          ...item,
          status: 'Available',
          assignedMemberId: null,
          assignedMemberName: null,
          assignedDepartment: null,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    }));

    // If assigned to a member, clear their hardware assignment
    if (assignedMemberId) {
      setMembers(prev => prev.map(m => {
        if (m.id === assignedMemberId) {
          return {
            ...m,
            hardware: {
              ...m.hardware,
              hardwareId: undefined,
              pcLaptopModel: '',
              serialNumber: '',
              assetTag: '',
              remarks: 'Hardware unassigned and returned to IT stock pool'
            },
            updatedAt: new Date().toISOString()
          };
        }
        return m;
      }));

      addAuditLog(
        assignedMemberId,
        assignedMemberName || 'Staff Member',
        'Updated',
        `Returned hardware ${hw.deviceModel} (${hw.assetTag}) to IT stock pool.`
      );
    }
  };

  const handleAddHardware = (newItem: HardwareItem, assignToMemberId?: string) => {
    if (assignToMemberId) {
      const targetMember = members.find(m => m.id === assignToMemberId);
      if (targetMember) {
        const assignedItem: HardwareItem = {
          ...newItem,
          status: 'Assigned',
          assignedMemberId: targetMember.id,
          assignedMemberName: targetMember.employeeName,
          assignedDepartment: targetMember.department
        };
        setHardwareInventory(prev => [assignedItem, ...prev]);

        // Update target member
        setMembers(prev => prev.map(m => {
          if (m.id === targetMember.id) {
            return {
              ...m,
              hardware: {
                ...m.hardware,
                hardwareId: assignedItem.id,
                pcLaptopModel: assignedItem.deviceModel,
                serialNumber: assignedItem.serialNumber,
                assetTag: assignedItem.assetTag,
                remarks: assignedItem.notes || m.hardware.remarks
              },
              updatedAt: new Date().toISOString()
            };
          }
          return m;
        }));

        addAuditLog(
          targetMember.id,
          targetMember.employeeName,
          'Created',
          `Registered and assigned new equipment ${assignedItem.deviceModel} (Tag: ${assignedItem.assetTag}) to personnel.`
        );
        return;
      }
    }

    setHardwareInventory(prev => [newItem, ...prev]);
    addAuditLog(
      'hardware',
      'Hardware Inventory',
      'Created',
      `Registered new ${newItem.deviceCategory}: ${newItem.deviceModel} (Tag: ${newItem.assetTag}, S/N: ${newItem.serialNumber || 'N/A'}) to stock pool.`
    );
  };

  const handleUpdateHardwareItem = (updatedItem: HardwareItem) => {
    setHardwareInventory(prev => prev.map(h => h.id === updatedItem.id ? updatedItem : h));
    // If assigned to a member, update member's hardware details
    if (updatedItem.assignedMemberId) {
      setMembers(prev => prev.map(m => {
        if (m.id === updatedItem.assignedMemberId) {
          return {
            ...m,
            hardware: {
              ...m.hardware,
              pcLaptopModel: updatedItem.deviceModel,
              serialNumber: updatedItem.serialNumber,
              assetTag: updatedItem.assetTag
            },
            updatedAt: new Date().toISOString()
          };
        }
        return m;
      }));
    }
  };

  const handleDeleteHardwareItem = (hardwareId: string) => {
    const hw = hardwareInventory.find(h => h.id === hardwareId);
    if (!hw) return;

    if (hw.assignedMemberId) {
      // Clear member assignment
      setMembers(prev => prev.map(m => {
        if (m.id === hw.assignedMemberId) {
          return {
            ...m,
            hardware: {
              ...m.hardware,
              hardwareId: undefined,
              pcLaptopModel: '',
              serialNumber: '',
              assetTag: '',
              remarks: 'Equipment decommissioned / removed from fleet'
            },
            updatedAt: new Date().toISOString()
          };
        }
        return m;
      }));
    }

    setHardwareInventory(prev => prev.filter(h => h.id !== hardwareId));
    addAuditLog(
      'hardware',
      'Hardware Fleet',
      'Deleted',
      `Decommissioned and removed equipment ${hw.assetTag} (${hw.deviceModel}) from fleet.`
    );
  };

  const handleResetDemoData = () => {
    if (confirm('Reset tracker with default Avani+ Fares Maldives Resort IT demo data? Any unsaved edits will be refreshed.')) {
      setMembers(INITIAL_MEMBERS);
      setHardwareInventory(INITIAL_HARDWARE_INVENTORY);
      addAuditLog('system', 'System Roster', 'Bulk Action', 'Reset repository to Avani+ Fares seed database & fleet inventory.');
      setSelectedDrawerMember(null);
    }
  };

  const handleImportMembers = (newMembers: TeamMemberRecord[], mode: 'replace' | 'append') => {
    if (mode === 'replace') {
      setMembers(newMembers);
      addAuditLog('system', 'System Roster', 'Bulk Action', `Imported ${newMembers.length} records (replace mode).`);
    } else {
      setMembers(prev => [...newMembers, ...prev]);
      addAuditLog('system', 'System Roster', 'Bulk Action', `Appended ${newMembers.length} imported records.`);
    }
  };

  // 1. Add URL Query Routing: When a user clicks to view a part's details, update the browser's URL address
  // bar to include a query parameter (?part=ID) using window.history.pushState so the page doesn't reload.
  const handleOpenHardwareDetails = (item: HardwareItem) => {
    setGlobalQRItem(item);

    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('part', item.id);
    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
    window.history.pushState({ partId: item.id }, '', newUrl);
  };

  const handleCloseHardwareDetails = () => {
    setGlobalQRItem(null);

    // Clean up query parameters on close without reloading the page
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.delete('part');
    currentParams.delete('sku');
    currentParams.delete('id');
    currentParams.delete('assetTag');
    currentParams.delete('tag');
    currentParams.delete('scan');

    const searchStr = currentParams.toString();
    const newUrl = searchStr ? `${window.location.pathname}?${searchStr}` : window.location.pathname;
    window.history.pushState(null, '', newUrl);
  };

  const handleOpenHardwareQRByTag = (assetTagOrId: string) => {
    if (!assetTagOrId) return;
    const match = findPartInInventory(assetTagOrId, hardwareInventory);
    if (match) {
      handleOpenHardwareDetails(match);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        members={members}
        onNewMember={handleOpenNewMember}
        onOpenImportExport={() => setIsImportExportOpen(true)}
        onResetDemoData={handleResetDemoData}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Header */}
        <Header
          members={members}
          activeTab={activeTab}
          searchQuery={filterState.search}
          onSearchChange={(q) => handleFilterChange({ search: q })}
          onNewMember={handleOpenNewMember}
          onOpenImportExport={() => setIsImportExportOpen(true)}
          onResetDemoData={handleResetDemoData}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenQRScanner={() => setIsGlobalScannerOpen(true)}
        />

        {/* Dynamic Views */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* 1. Main Page: Statistics & Executive Dashboard */}
          {activeTab === 'dashboard' && (
            <DashboardView
              members={members}
              auditLogs={auditLogs}
              onNavigateTab={setActiveTab}
              onSelectMember={setSelectedDrawerMember}
            />
          )}

          {/* 2. Master Personnel Directory */}
          {activeTab === 'directory' && (
            <MemberTable
              members={members}
              filterState={filterState}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              onSelectMember={setSelectedDrawerMember}
              onEditMember={handleOpenEditMember}
              onDeleteMember={handleDeleteMember}
              onBulkUpdateStatus={handleBulkUpdateStatus}
              onViewHardwareQR={handleOpenHardwareQRByTag}
            />
          )}

          {/* 3. Core Systems Access Matrix */}
          {activeTab === 'matrix' && (
            <AccessMatrixView
              members={members}
              onToggleSystemAccess={handleToggleSystemAccess}
            />
          )}

          {/* 4. Hardware Fleet & Asset Inventory */}
          {activeTab === 'hardware' && (
            <HardwareInventoryView
              members={members}
              hardwareInventory={hardwareInventory}
              onAssignHardware={handleAssignHardware}
              onUnassignHardware={handleUnassignHardware}
              onAddHardware={handleAddHardware}
              onUpdateHardwareItem={handleUpdateHardwareItem}
              onDeleteHardwareItem={handleDeleteHardwareItem}
              onSelectMember={setSelectedDrawerMember}
              onViewHardwareDetails={handleOpenHardwareDetails}
            />
          )}

          {/* 5. IT Lifecycle & Provisioning Workflows */}
          {activeTab === 'lifecycle' && (
            <LifecycleView
              members={members}
              onUpdateMember={(updated) => {
                setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
                addAuditLog(updated.id, updated.employeeName, 'Status Changed', `IT Lifecycle status updated to "${updated.status}".`);
              }}
              onSelectMember={setSelectedDrawerMember}
            />
          )}

          {/* 6. Governance & Security Audit Trail */}
          {activeTab === 'audit' && (
            <AuditLogView
              logs={auditLogs}
              onClearLogs={() => setAuditLogs([])}
            />
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm py-4 mt-auto text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              Minor Hotels Global IT Infrastructure & Access Management Portal
            </div>
            <div className="flex items-center gap-3">
              <span>Security Classification: Restricted</span>
              <span>·</span>
              <span>Local Persistent Store Active</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Slide-over Profile Drawer */}
      <MemberDetailDrawer
        member={selectedDrawerMember}
        onClose={() => setSelectedDrawerMember(null)}
        onEdit={(m) => {
          setSelectedDrawerMember(null);
          handleOpenEditMember(m);
        }}
        onToggleStatus={handleToggleMemberStatus}
        onViewHardwareQR={handleOpenHardwareQRByTag}
      />

      {/* Add / Edit Member Modal */}
      <MemberModal
        isOpen={isMemberModalOpen}
        member={editingMember}
        onClose={() => {
          setIsMemberModalOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSaveMember}
        hardwareInventory={hardwareInventory}
        onAddNewHardwareToInventory={(newItem) => {
          setHardwareInventory(prev => [newItem, ...prev]);
        }}
      />

      {/* Import / Export Dialog */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        members={members}
        onImport={handleImportMembers}
      />

      {/* Global QR Code Camera Scanner & Tag Lookup */}
      <QRScannerModal
        isOpen={isGlobalScannerOpen}
        hardwareInventory={hardwareInventory}
        onClose={() => setIsGlobalScannerOpen(false)}
        onSelectHardware={(item) => handleOpenHardwareDetails(item)}
      />

      {/* Global Hardware QR Code & Full Custody Details Modal */}
      <HardwareQRModal
        isOpen={Boolean(globalQRItem)}
        item={globalQRItem}
        assignedMember={globalQRItem?.assignedMemberId ? (members.find(m => m.id === globalQRItem.assignedMemberId) || null) : null}
        onClose={handleCloseHardwareDetails}
        onAssign={(item) => {
          handleCloseHardwareDetails();
          setActiveTab('hardware');
        }}
        onUnassign={(hwId) => handleUnassignHardware(hwId)}
        onSelectMember={(member) => {
          handleCloseHardwareDetails();
          setSelectedDrawerMember(member);
        }}
      />

    </div>
  );
}
