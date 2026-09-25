import { TeamMemberRecord, AuditLogEntry, M365LicenseType, MemberStatus, HardwareItem } from '../types';
import { INITIAL_MEMBERS, INITIAL_HARDWARE_INVENTORY } from '../data/initialData';

const MEMBERS_KEY = 'vfar_it_asset_tracker_records_v1';
const AUDIT_KEY = 'vfar_it_asset_tracker_audit_v1';
const HARDWARE_KEY = 'vfar_it_asset_tracker_hardware_v1';

export function loadHardwareInventory(): HardwareItem[] {
  try {
    const raw = localStorage.getItem(HARDWARE_KEY);
    if (!raw) {
      saveHardwareInventory(INITIAL_HARDWARE_INVENTORY);
      return INITIAL_HARDWARE_INVENTORY;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_HARDWARE_INVENTORY;
  } catch (err) {
    console.error('Failed to load hardware inventory from localStorage', err);
    return INITIAL_HARDWARE_INVENTORY;
  }
}

export function saveHardwareInventory(items: HardwareItem[]): void {
  try {
    localStorage.setItem(HARDWARE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save hardware inventory to localStorage', err);
  }
}

export function loadMembers(): TeamMemberRecord[] {
  try {
    const raw = localStorage.getItem(MEMBERS_KEY);
    if (!raw) {
      saveMembers(INITIAL_MEMBERS);
      return INITIAL_MEMBERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Strictly retain ONLY Avani+ Fares Maldives Resort team members
      const vfarOnly = parsed.filter((m: TeamMemberRecord) => m.propertyOrLocation === 'Avani+ Fares Maldives Resort');
      if (vfarOnly.length === 0) {
        saveMembers(INITIAL_MEMBERS);
        return INITIAL_MEMBERS;
      }
      if (vfarOnly.length !== parsed.length) {
        saveMembers(vfarOnly);
      }
      return vfarOnly;
    }
    return INITIAL_MEMBERS;
  } catch (err) {
    console.error('Failed to load members from localStorage', err);
    return INITIAL_MEMBERS;
  }
}

export function saveMembers(members: TeamMemberRecord[]): void {
  try {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  } catch (err) {
    console.error('Failed to save members to localStorage', err);
  }
}

export function loadAuditLog(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    if (!raw) {
      const initialLogs: AuditLogEntry[] = [
        {
          id: 'log-001',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          memberId: 'mem-108',
          memberName: 'Marcus Van Der Bilt',
          action: 'Created',
          details: 'Initialized executive profile with M365 E5 and Opera Cloud executive dashboard access.'
        },
        {
          id: 'log-002',
          timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
          memberId: 'mem-112',
          memberName: 'Ahmed Zahir',
          action: 'Status Changed',
          details: 'Status transitioned to Offboarded; M365 license reclaimed and AD account disabled.'
        },
        {
          id: 'log-003',
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
          memberId: 'mem-109',
          memberName: 'Sirilak Thongkam',
          action: 'Updated',
          details: 'Onboarding staged in IT inventory room (MH-SIAM-IT-0299).'
        }
      ];
      saveAuditLog(initialLogs);
      return initialLogs;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load audit log', err);
    return [];
  }
}

export function saveAuditLog(logs: AuditLogEntry[]): void {
  try {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(logs.slice(0, 200)));
  } catch (err) {
    console.error('Failed to save audit log', err);
  }
}

export function createAuditEntry(
  memberId: string,
  memberName: string,
  action: AuditLogEntry['action'],
  details: string
): AuditLogEntry {
  return {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    memberId,
    memberName,
    action,
    details
  };
}

// Quick role templates for hospitality operations
export const ROLE_PRESETS: Record<string, Partial<TeamMemberRecord>> = {
  'Front Office Associate / Supervisor': {
    department: 'Front Office',
    email: {
      address: '',
      leadersDL: false,
      dhDL: false,
      licenseType: 'M365 E3',
      functionalAccountMfa: true,
      remarks: ''
    },
    hardware: [{
      pcLaptopModel: 'Lenovo ThinkPad T14 Gen 4',
      serialNumber: '',
      assetTag: '',
      remarks: 'Standard Front Desk station'
    }],
    systems: {
      oracleFusion: { assigned: false, remarks: '' },
      operaCloud: { assigned: true, remarks: 'Front Desk Cashier & Check-in Profile' },
      microsSimphony: { assigned: false, remarks: '' },
      zenoti: { assigned: true, remarks: 'Spa appointment inquiry' },
      messageBox: { assigned: true, remarks: 'Guest services agent' },
      tableCheck: { assigned: true, remarks: 'Dining inquiry' },
      minorHotelsApp: { assigned: true, remarks: 'VIP discovery check-in' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: true, remarks: 'Guest registration form signatures' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: true, remarks: 'Guest RFID keycard issuing' }
    },
    vpn: { minorVpn: false, vfarLocalVpn: false, remarks: '' }
  },
  'Food & Beverage Captain / Manager': {
    department: 'Food & Beverage',
    email: {
      address: '',
      leadersDL: true,
      dhDL: false,
      licenseType: 'M365 E3',
      functionalAccountMfa: true,
      remarks: ''
    },
    hardware: [{
      pcLaptopModel: 'Dell Latitude 3440',
      serialNumber: '',
      assetTag: '',
      remarks: ''
    }],
    systems: {
      oracleFusion: { assigned: false, remarks: '' },
      operaCloud: { assigned: true, remarks: 'Guest in-house room verification' },
      microsSimphony: { assigned: true, remarks: 'POS Operator & Void Authorization' },
      zenoti: { assigned: false, remarks: '' },
      messageBox: { assigned: true, remarks: 'In-room dining dispatch' },
      tableCheck: { assigned: true, remarks: 'Restaurant floor seating manager' },
      minorHotelsApp: { assigned: true, remarks: 'F&B member offers' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: true, remarks: 'Daily special menu printing' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: false, remarks: '' }
    },
    vpn: { minorVpn: false, vfarLocalVpn: false, remarks: '' }
  },
  'Department Head / HOD': {
    email: {
      address: '',
      leadersDL: true,
      dhDL: true,
      licenseType: 'M365 E5',
      functionalAccountMfa: true,
      remarks: ''
    },
    hardware: [{
      pcLaptopModel: 'Lenovo ThinkPad T14s Gen 4',
      serialNumber: '',
      assetTag: '',
      remarks: 'Executive HOD package'
    }],
    systems: {
      oracleFusion: { assigned: true, remarks: 'PR/PO Approvals & Budget tracking' },
      operaCloud: { assigned: true, remarks: 'Departmental reports & forecasts' },
      microsSimphony: { assigned: true, remarks: 'Reporting' },
      zenoti: { assigned: false, remarks: '' },
      messageBox: { assigned: true, remarks: 'HOD supervisor escalation' },
      tableCheck: { assigned: false, remarks: '' },
      minorHotelsApp: { assigned: true, remarks: 'Brand engagement' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: true, remarks: 'Contract signing' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: false, remarks: '' }
    },
    vpn: { minorVpn: true, vfarLocalVpn: true, remarks: 'Corporate remote access' }
  },
  'Frontline / Housekeeping / Engineering': {
    email: {
      address: '',
      leadersDL: false,
      dhDL: false,
      licenseType: 'M365 F3',
      functionalAccountMfa: false,
      remarks: 'Frontline worker license'
    },
    hardware: [{
      pcLaptopModel: 'Dell OptiPlex Micro',
      serialNumber: '',
      assetTag: '',
      remarks: 'Department shared PC'
    }],
    systems: {
      oracleFusion: { assigned: false, remarks: '' },
      operaCloud: { assigned: true, remarks: 'Room status update only' },
      microsSimphony: { assigned: false, remarks: '' },
      zenoti: { assigned: false, remarks: '' },
      messageBox: { assigned: true, remarks: 'Task completion & runner queue' },
      tableCheck: { assigned: false, remarks: '' },
      minorHotelsApp: { assigned: false, remarks: '' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: false, remarks: '' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: true, remarks: 'Staff master lock key' }
    },
    vpn: { minorVpn: false, vfarLocalVpn: false, remarks: '' }
  }
};

export function exportToCSV(members: TeamMemberRecord[]): string {
  const headers = [
    'Record ID',
    'Employee Name',
    'Job Title',
    'Department',
    'Property / Location',
    'Status',
    'Email Address',
    'M365 License',
    'Leaders DL',
    'DH DL',
    'Functional MFA',
    'Email Remarks',
    'PC / Laptop Model',
    'Hardware Serial Number',
    'Asset Tag',
    'Hardware Remarks',
    'AD Username',
    'AD OU Group',
    'AD Remarks',
    'Minor Corporate VPN',
    'VFAR Local Property VPN',
    'VPN Remarks',
    'Oracle Fusion Assigned',
    'Oracle Fusion Remarks',
    'Opera Cloud Assigned',
    'Opera Cloud Remarks',
    'Micros Simphony Assigned',
    'Micros Simphony Remarks',
    'Zenoti Spa Assigned',
    'Zenoti Spa Remarks',
    'MessageBox Assigned',
    'MessageBox Remarks',
    'TableCheck Assigned',
    'TableCheck Remarks',
    'Minor Hotels App Assigned',
    'Minor Hotels App Remarks',
    'Adobe Acrobat Assigned',
    'Adobe CC Assigned',
    'Visionline Security Assigned',
    'Visionline Remarks',
    'Company Phone Number',
    'Company Phone Model',
    'Telephony Remarks',
    'General Remarks',
    'Last Updated'
  ];

  const rows = members.map(m => [
    m.id,
    m.employeeName,
    m.jobTitle,
    m.department,
    m.propertyOrLocation,
    m.status,
    m.email.address,
    m.email.licenseType,
    m.email.leadersDL ? 'YES' : 'NO',
    m.email.dhDL ? 'YES' : 'NO',
    m.email.functionalAccountMfa ? 'YES' : 'NO',
    m.email.remarks,
    m.hardware.map(h => h.pcLaptopModel).join('; '),
    m.hardware.map(h => h.serialNumber).join('; '),
    m.hardware.map(h => h.assetTag).join('; '),
    m.hardware.map(h => h.remarks).join('; '),
    m.activeDirectory.username,
    m.activeDirectory.ouGroup,
    m.activeDirectory.remarks,
    m.vpn.minorVpn ? 'YES' : 'NO',
    m.vpn.vfarLocalVpn ? 'YES' : 'NO',
    m.vpn.remarks,
    m.systems.oracleFusion.assigned ? 'YES' : 'NO',
    m.systems.oracleFusion.remarks,
    m.systems.operaCloud.assigned ? 'YES' : 'NO',
    m.systems.operaCloud.remarks,
    m.systems.microsSimphony.assigned ? 'YES' : 'NO',
    m.systems.microsSimphony.remarks,
    m.systems.zenoti.assigned ? 'YES' : 'NO',
    m.systems.zenoti.remarks,
    m.systems.messageBox.assigned ? 'YES' : 'NO',
    m.systems.messageBox.remarks,
    m.systems.tableCheck.assigned ? 'YES' : 'NO',
    m.systems.tableCheck.remarks,
    m.systems.minorHotelsApp.assigned ? 'YES' : 'NO',
    m.systems.minorHotelsApp.remarks,
    m.creativeProductivity.adobeAcrobat.assigned ? 'YES' : 'NO',
    m.creativeProductivity.adobeCc.assigned ? 'YES' : 'NO',
    m.security.visionline.assigned ? 'YES' : 'NO',
    m.security.visionline.remarks,
    m.telephony.companyNumber,
    m.telephony.companyPhoneModel,
    m.telephony.remarks,
    m.generalRemarks,
    m.updatedAt
  ]);

  const csvContent = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => row.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\r\n');

  return csvContent;
}

export function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseCSVToMembers(csvText: string): TeamMemberRecord[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Helper to split CSV line taking quotes into account
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const records: TeamMemberRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    if (cols.length < 5 || !cols[1]) continue;

    const bool = (val?: string) => val?.toUpperCase() === 'YES' || val?.toUpperCase() === 'TRUE' || val === '1';

    const id = cols[0] || `mem-${Date.now()}-${i}`;
    const employeeName = cols[1] || 'Unnamed Staff';
    const jobTitle = cols[2] || '';
    const department = cols[3] || 'Operations';
    const propertyOrLocation = cols[4] || 'Minor Hotels Property';
    const statusVal = cols[5] as MemberStatus;
    const status: MemberStatus = ['Active', 'Onboarding', 'Offboarded', 'Suspended'].includes(statusVal)
      ? statusVal
      : 'Active';

    const licenseVal = cols[7] as M365LicenseType;
    const licenseType: M365LicenseType = ['M365 E3', 'M365 E5', 'M365 F3', 'Exchange Online', 'None'].includes(licenseVal)
      ? licenseVal
      : 'M365 E3';

    records.push({
      id,
      employeeName,
      jobTitle,
      department,
      propertyOrLocation,
      status,
      email: {
        address: cols[6] || '',
        licenseType,
        leadersDL: bool(cols[8]),
        dhDL: bool(cols[9]),
        functionalAccountMfa: bool(cols[10]),
        remarks: cols[11] || ''
      },
      hardware: (cols[12] || cols[13] || cols[14])
        ? [{
            pcLaptopModel: cols[12] || '',
            serialNumber: cols[13] || '',
            assetTag: cols[14] || '',
            remarks: cols[15] || ''
          }]
        : [],
      activeDirectory: {
        username: cols[16] || '',
        ouGroup: cols[17] || '',
        remarks: cols[18] || ''
      },
      vpn: {
        minorVpn: bool(cols[19]),
        vfarLocalVpn: bool(cols[20]),
        remarks: cols[21] || ''
      },
      systems: {
        oracleFusion: { assigned: bool(cols[22]), remarks: cols[23] || '' },
        operaCloud: { assigned: bool(cols[24]), remarks: cols[25] || '' },
        microsSimphony: { assigned: bool(cols[26]), remarks: cols[27] || '' },
        zenoti: { assigned: bool(cols[28]), remarks: cols[29] || '' },
        messageBox: { assigned: bool(cols[30]), remarks: cols[31] || '' },
        tableCheck: { assigned: bool(cols[32]), remarks: cols[33] || '' },
        minorHotelsApp: { assigned: bool(cols[34]), remarks: cols[35] || '' }
      },
      creativeProductivity: {
        adobeAcrobat: { assigned: bool(cols[36]), remarks: '' },
        adobeCc: { assigned: bool(cols[37]), remarks: '' }
      },
      security: {
        visionline: { assigned: bool(cols[38]), remarks: cols[39] || '' }
      },
      telephony: {
        companyNumber: cols[40] || '',
        companyPhoneModel: cols[41] || '',
        remarks: cols[42] || ''
      },
      generalRemarks: cols[43] || '',
      updatedAt: cols[44] || new Date().toISOString()
    });
  }

  return records;
}

export function createBlankMember(): TeamMemberRecord {
  return {
    id: `mem-${Date.now()}`,
    employeeName: '',
    department: 'Front Office',
    jobTitle: '',
    propertyOrLocation: 'Avani+ Fares Maldives Resort',
    status: 'Active',
    email: {
      address: '',
      leadersDL: false,
      dhDL: false,
      licenseType: 'M365 E3',
      functionalAccountMfa: true,
      remarks: ''
    },
    hardware: [],
    activeDirectory: {
      username: '',
      ouGroup: 'OU=Staff,OU=AvaniFares,DC=minor,DC=corp',
      remarks: ''
    },
    vpn: {
      minorVpn: false,
      vfarLocalVpn: true,
      remarks: 'Avani+ Fares local gateway enabled'
    },
    systems: {
      oracleFusion: { assigned: false, remarks: '' },
      operaCloud: { assigned: false, remarks: '' },
      microsSimphony: { assigned: false, remarks: '' },
      zenoti: { assigned: false, remarks: '' },
      messageBox: { assigned: false, remarks: '' },
      tableCheck: { assigned: false, remarks: '' },
      minorHotelsApp: { assigned: false, remarks: '' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: false, remarks: '' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: false, remarks: '' }
    },
    telephony: {
      companyNumber: '+960 660-8888',
      companyPhoneModel: '',
      remarks: ''
    },
    generalRemarks: '',
    updatedAt: new Date().toISOString()
  };
}
