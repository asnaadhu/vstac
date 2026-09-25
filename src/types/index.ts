export type MemberStatus = 'Active' | 'Onboarding' | 'Offboarded' | 'Suspended';

export type M365LicenseType = 'M365 E3' | 'M365 E5' | 'M365 F3' | 'Exchange Online' | 'None';

export type DeviceCategory = 'Laptop' | 'Desktop' | 'Workstation' | 'Tablet' | 'POS Terminal' | 'Mobile Phone' | 'Other';
export type HardwareStatus = 'Available' | 'Assigned' | 'Maintenance' | 'Retired';
export type HardwareCondition = 'Brand New' | 'Good' | 'Fair' | 'Under Repair';

export interface HardwareItem {
  id: string;
  assetTag: string;
  deviceModel: string;
  deviceCategory: DeviceCategory;
  serialNumber: string;
  specifications: string;
  status: HardwareStatus;
  assignedMemberId: string | null;
  assignedMemberName: string | null;
  assignedDepartment: string | null;
  condition: HardwareCondition;
  purchaseDate?: string;
  notes?: string;
  updatedAt: string;
}

export interface SystemAccessItem {
  assigned: boolean;
  remarks: string;
}

export interface TeamMemberRecord {
  id: string; // UUID / timestamp
  employeeName: string;
  department: string;
  jobTitle: string;
  propertyOrLocation: string;
  status: MemberStatus;

  // 1. Email Address & Identity
  email: {
    address: string;
    leadersDL: boolean; // Leaders Distribution List
    dhDL: boolean;      // Department Head Distribution List
    licenseType: M365LicenseType;
    functionalAccountMfa: boolean;
    remarks: string;
  };

  // 2. Hardware & Device
  hardware: {
    hardwareId?: string;
    pcLaptopModel: string;
    serialNumber: string;
    assetTag: string;
    remarks: string;
  };

  // 3. Active Directory
  activeDirectory: {
    username: string;
    ouGroup: string;
    remarks: string;
  };

  // 4. Remote Connectivity (VPN)
  vpn: {
    minorVpn: boolean;
    vfarLocalVpn: boolean;
    remarks: string;
  };

  // 5. Enterprise Core & PMS Systems
  systems: {
    oracleFusion: SystemAccessItem;
    operaCloud: SystemAccessItem;
    microsSimphony: SystemAccessItem;
    zenoti: SystemAccessItem;
    messageBox: SystemAccessItem;
    tableCheck: SystemAccessItem;
    minorHotelsApp: SystemAccessItem;
  };

  // 6. Productivity & Creative Suites
  creativeProductivity: {
    adobeAcrobat: SystemAccessItem;
    adobeCc: SystemAccessItem;
  };

  // 7. Security & Key Management
  security: {
    visionline: SystemAccessItem;
  };

  // 8. Telephony & Mobile
  telephony: {
    companyNumber: string;
    companyPhoneModel: string;
    remarks: string;
  };

  // 9. Overall Notes
  generalRemarks: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  memberId: string;
  memberName: string;
  action: 'Created' | 'Updated' | 'Deleted' | 'Status Changed' | 'Access Modified' | 'Bulk Action';
  details: string;
}

export type ActiveTab = 'dashboard' | 'directory' | 'matrix' | 'hardware' | 'lifecycle' | 'audit';

export interface FilterState {
  search: string;
  status: string; // 'All' | MemberStatus
  property: string; // 'All' | Property Name
  department: string; // 'All' | Department Name
  licenseType: string; // 'All' | M365LicenseType
  systemFilter: string; // 'All' | keyof systems
  vpnOnly: boolean;
  leadersDLOnly: boolean;
  missingAssetTag: boolean;
}
