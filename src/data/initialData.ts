import { TeamMemberRecord, HardwareItem } from '../types';

export const INITIAL_MEMBERS: TeamMemberRecord[] = [
  {
    id: 'vfar-001',
    employeeName: 'Asnaadhu Mohamed',
    department: 'Information Technology',
    jobTitle: 'Assistant IT Manager & Systems Lead',
    propertyOrLocation: 'Avani+ Fares Maldives Resort',
    status: 'Active',
    email: {
      address: 'asnaadhu@avanihotels.com',
      leadersDL: true,
      dhDL: true,
      licenseType: 'M365 E5',
      functionalAccountMfa: true,
      remarks: 'Primary IT systems administrator for Avani+ Fares Maldives Resort (VFAR)'
    },
    hardware: [
      {
        pcLaptopModel: 'Lenovo ThinkPad T14s Gen 4',
        serialNumber: 'PF-VFAR-0019',
        assetTag: 'VFAR-IT-0001',
        remarks: 'Issued with field IT diagnostic kit, dual 27" Dell monitors & docking station'
      }
    ],
    activeDirectory: {
      username: 'asnaadhu_vfar',
      ouGroup: 'OU=IT,OU=AvaniFares,OU=Maldives,DC=minor,DC=corp',
      remarks: 'Domain Admin, G_VFAR_HOD, G_Corp_IT_Engineers'
    },
    vpn: {
      minorVpn: true,
      vfarLocalVpn: true,
      remarks: 'Full local Palo Alto GlobalProtect gateway & Minor Hotels global corporate tunnel'
    },
    systems: {
      oracleFusion: { assigned: true, remarks: 'IT procurement, CAPEX & OPEX approvals' },
      operaCloud: { assigned: true, remarks: 'PMS System Administrator profile & cashier audits' },
      microsSimphony: { assigned: true, remarks: 'Simphony EMC Master Admin & POS workstation maintenance' },
      zenoti: { assigned: true, remarks: 'Spa system admin & payment gateway bridge' },
      messageBox: { assigned: true, remarks: 'Resort service dispatcher admin & telephony integration' },
      tableCheck: { assigned: true, remarks: 'F&B reservation system administrator' },
      minorHotelsApp: { assigned: true, remarks: 'Avani app mobile concierge & digital key integration' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: true, remarks: 'Vendor agreement signing' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: true, remarks: 'Visionline Master Keycard Server Administrator & encoder setup' }
    },
    telephony: {
      companyNumber: '+960 660-8888 Ext 1010',
      companyPhoneModel: 'Cisco IP Phone 8851 / iPhone 15 Pro',
      remarks: 'IT on-call emergency line & Baa Atoll duty rotation'
    },
    generalRemarks: 'Resort IT operations lead. Manages on-island fiber backbone, server room, and satellite/microwave backhaul.',
    updatedAt: '2026-09-24T08:30:00Z'
  },
  {
    id: 'vfar-002',
    employeeName: 'Hawwa Niuma',
    department: 'Front Office',
    jobTitle: 'Front Office Manager / Island Host Lead',
    propertyOrLocation: 'Avani+ Fares Maldives Resort',
    status: 'Active',
    email: {
      address: 'hniuma@avanihotels.com',
      leadersDL: true,
      dhDL: true,
      licenseType: 'M365 E3',
      functionalAccountMfa: true,
      remarks: 'Primary custodian of fares_frontoffice@avanihotels.com'
    },
    hardware: [
      {
        pcLaptopModel: 'Dell Latitude 7440',
        serialNumber: 'DL-VFAR-4412',
        assetTag: 'VFAR-IT-0012',
        remarks: 'Front Desk primary supervisory laptop with dual displays'
      }
    ],
    activeDirectory: {
      username: 'hniuma_vfar',
      ouGroup: 'OU=FrontOffice,OU=AvaniFares,OU=Maldives,DC=minor,DC=corp',
      remarks: 'Member of G_VFAR_HOD, G_VFAR_FrontDesk'
    },
    vpn: {
      minorVpn: true,
      vfarLocalVpn: true,
      remarks: 'Access to Opera Cloud night audit & Seaplane arrival flight manifests'
    },
    systems: {
      oracleFusion: { assigned: false, remarks: 'Self-service leave only' },
      operaCloud: { assigned: true, remarks: 'Duty Manager / Cashier Master / Room Assignment profile' },
      microsSimphony: { assigned: false, remarks: '' },
      zenoti: { assigned: true, remarks: 'Read-only guest wellness package cross-billing' },
      messageBox: { assigned: true, remarks: 'Island Host guest concierge dispatch lead' },
      tableCheck: { assigned: true, remarks: 'Guest dining reservations concierge' },
      minorHotelsApp: { assigned: true, remarks: 'Avani digital check-in & guest chat monitoring' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: true, remarks: 'Registration card archives' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: true, remarks: 'Guest RFID keycard creation & emergency room access' }
    },
    telephony: {
      companyNumber: '+960 660-8888 Ext 1100',
      companyPhoneModel: 'Cisco IP Phone 8841',
      remarks: 'Lobby & Arrival Lounge master console'
    },
    generalRemarks: 'Oversees Arrival Jetty, Island Host team, and Dharavandhoo domestic airport transfers.',
    updatedAt: '2026-09-22T11:20:00Z'
  },
  {
    id: 'vfar-003',
    employeeName: 'Ibrahim Ziyan',
    department: 'Food & Beverage',
    jobTitle: 'Director of Food & Beverage',
    propertyOrLocation: 'Avani+ Fares Maldives Resort',
    status: 'Active',
    email: {
      address: 'iziyan@avanihotels.com',
      leadersDL: true,
      dhDL: true,
      licenseType: 'M365 E5',
      functionalAccountMfa: true,
      remarks: 'Access to fares_fboperations@avanihotels.com'
    },
    hardware: [
      {
        pcLaptopModel: 'Lenovo ThinkPad T14 Gen 4',
        serialNumber: 'PF-VFAR-8831',
        assetTag: 'VFAR-IT-0025',
        remarks: 'Allocated to F&B management office (Skipjack / Ocean Terrace)'
      }
    ],
    activeDirectory: {
      username: 'iziyan_vfar',
      ouGroup: 'OU=FoodBeverage,OU=AvaniFares,OU=Maldives,DC=minor,DC=corp',
      remarks: 'Member of G_VFAR_HOD, G_VFAR_FNB_Managers'
    },
    vpn: {
      minorVpn: true,
      vfarLocalVpn: true,
      remarks: 'Simphony inventory & menu pricing remote updates'
    },
    systems: {
      oracleFusion: { assigned: true, remarks: 'F&B purchase requisitions, food cost & beverage stock approvals' },
      operaCloud: { assigned: true, remarks: 'In-house guest roster & meal plan verification' },
      microsSimphony: { assigned: true, remarks: 'Simphony EMC supervisor across Ocean Terrace, Charcoal & Skipjack' },
      zenoti: { assigned: false, remarks: '' },
      messageBox: { assigned: true, remarks: 'In-villa dining & VIP amenity orders' },
      tableCheck: { assigned: true, remarks: 'Table management for Charcoal, Ocean Terrace & Tribe bar' },
      minorHotelsApp: { assigned: true, remarks: 'Menu specials & F&B promotional broadcasting' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: true, remarks: 'Wine list & seasonal menu signing' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: false, remarks: '' }
    },
    telephony: {
      companyNumber: '+960 660-8888 Ext 1200',
      companyPhoneModel: 'Cisco IP Phone 8841',
      remarks: 'F&B central office extension'
    },
    generalRemarks: 'Oversees 7 dining outlets, In-Villa Dining, and beach destination dinners.',
    updatedAt: '2026-09-23T14:45:00Z'
  },
  {
    id: 'vfar-004',
    employeeName: 'Dr. Mariyam Latheef',
    department: 'Spa & Wellness',
    jobTitle: 'Resident Marine Biologist & Conservationist',
    propertyOrLocation: 'Avani+ Fares Maldives Resort',
    status: 'Active',
    email: {
      address: 'mlatheef@avanihotels.com',
      leadersDL: false,
      dhDL: false,
      licenseType: 'M365 E3',
      functionalAccountMfa: true,
      remarks: 'Marine biology education & guest diving center coordinator'
    },
    hardware: [
      {
        pcLaptopModel: 'Apple MacBook Air 15" M3',
        serialNumber: 'C02-VFAR-9102',
        assetTag: 'VFAR-IT-0040',
        remarks: 'Underwater photo processing & Hanifaru Bay research presentation station'
      }
    ],
    activeDirectory: {
      username: 'mlatheef_vfar',
      ouGroup: 'OU=MarineBiology,OU=AvaniFares,OU=Maldives,DC=minor,DC=corp',
      remarks: 'Member of G_VFAR_Aquaholics'
    },
    vpn: {
      minorVpn: false,
      vfarLocalVpn: true,
      remarks: 'Local VFAR file server for 4K reef survey and manta ray tracking datasets'
    },
    systems: {
      oracleFusion: { assigned: false, remarks: '' },
      operaCloud: { assigned: false, remarks: '' },
      microsSimphony: { assigned: false, remarks: '' },
      zenoti: { assigned: false, remarks: '' },
      messageBox: { assigned: true, remarks: 'Guest excursion inquiries' },
      tableCheck: { assigned: false, remarks: '' },
      minorHotelsApp: { assigned: true, remarks: 'UNESCO Biosphere Reserve marine talks in Avani App' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: true, remarks: 'Marine research permits' },
      adobeCc: { assigned: true, remarks: 'Lightroom & Photoshop for guest underwater photography' }
    },
    security: {
      visionline: { assigned: false, remarks: '' }
    },
    telephony: {
      companyNumber: '+960 660-8888 Ext 1350',
      companyPhoneModel: 'Cisco Wireless IP Phone 8821',
      remarks: 'Aquaholics Dive Centre main desk'
    },
    generalRemarks: 'Leads coral propagation nursery and Baa Atoll Hanifaru Bay manta excursions.',
    updatedAt: '2026-09-20T09:10:00Z'
  },
  {
    id: 'vfar-005',
    employeeName: 'Mohamed Shaffaf',
    department: 'Engineering',
    jobTitle: 'Director of Engineering & Facilities',
    propertyOrLocation: 'Avani+ Fares Maldives Resort',
    status: 'Active',
    email: {
      address: 'mshaffaf@avanihotels.com',
      leadersDL: true,
      dhDL: true,
      licenseType: 'M365 E3',
      functionalAccountMfa: true,
      remarks: 'Island power, water & environmental engineering alerts'
    },
    hardware: [
      {
        pcLaptopModel: 'Dell Latitude 5440 Rugged',
        serialNumber: 'DL-VFAR-7182',
        assetTag: 'VFAR-IT-0033',
        remarks: 'Field rugged laptop with IP53 splash resistance for plant room'
      }
    ],
    activeDirectory: {
      username: 'mshaffaf_vfar',
      ouGroup: 'OU=Engineering,OU=AvaniFares,OU=Maldives,DC=minor,DC=corp',
      remarks: 'Member of G_VFAR_HOD, G_VFAR_BMS_Admins'
    },
    vpn: {
      minorVpn: true,
      vfarLocalVpn: true,
      remarks: 'Local VFAR SCADA / PLC access for Reverse Osmosis desalination & generator sync'
    },
    systems: {
      oracleFusion: { assigned: true, remarks: 'Engineering spare parts, diesel procurement & CAPEX requisitions' },
      operaCloud: { assigned: true, remarks: 'Room maintenance status & out-of-order blocks' },
      microsSimphony: { assigned: false, remarks: '' },
      zenoti: { assigned: false, remarks: '' },
      messageBox: { assigned: true, remarks: 'Engineering work orders & guest defect escalations' },
      tableCheck: { assigned: false, remarks: '' },
      minorHotelsApp: { assigned: false, remarks: '' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: true, remarks: 'AutoCAD electrical diagrams review' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: true, remarks: 'Visionline Lock Maintenance Tool (LMT) controller & battery diagnostics' }
    },
    telephony: {
      companyNumber: '+960 660-8888 Ext 1400',
      companyPhoneModel: 'Samsung Galaxy XCover 6 Pro',
      remarks: 'Rugged island mobile with 24/7 power plant priority'
    },
    generalRemarks: 'Oversees 2.4MW island generation plant, seawater RO plant (350 m3/day) & sewage treatment.',
    updatedAt: '2026-09-21T16:00:00Z'
  },
  {
    id: 'vfar-006',
    employeeName: 'Ali Hussain',
    department: 'Housekeeping',
    jobTitle: 'Executive Housekeeper',
    propertyOrLocation: 'Avani+ Fares Maldives Resort',
    status: 'Active',
    email: {
      address: 'ahussain@avanihotels.com',
      leadersDL: true,
      dhDL: true,
      licenseType: 'M365 E3',
      functionalAccountMfa: true,
      remarks: 'Villa turn-down & linen inventory custodian'
    },
    hardware: [
      {
        pcLaptopModel: 'Lenovo ThinkPad L14 Gen 4',
        serialNumber: 'PF-VFAR-3390',
        assetTag: 'VFAR-IT-0062',
        remarks: 'Housekeeping control desk station'
      }
    ],
    activeDirectory: {
      username: 'ahussain_vfar',
      ouGroup: 'OU=Housekeeping,OU=AvaniFares,OU=Maldives,DC=minor,DC=corp',
      remarks: 'Member of G_VFAR_HOD, G_VFAR_HK'
    },
    vpn: {
      minorVpn: false,
      vfarLocalVpn: true,
      remarks: 'Local VFAR Opera Cloud PMS room assignment & runner tracking'
    },
    systems: {
      oracleFusion: { assigned: true, remarks: 'Linen, guest amenities & eco-cleaning chemical purchase orders' },
      operaCloud: { assigned: true, remarks: 'Full room status management (Clean, Inspected, Dirty, Out of Service)' },
      microsSimphony: { assigned: false, remarks: '' },
      zenoti: { assigned: false, remarks: '' },
      messageBox: { assigned: true, remarks: 'Housekeeping runner dispatch & minibar restock task coordinator' },
      tableCheck: { assigned: false, remarks: '' },
      minorHotelsApp: { assigned: false, remarks: '' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: true, remarks: 'SOP compliance documents' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: true, remarks: 'Housekeeping Master Keycard creation & floor section assignment' }
    },
    telephony: {
      companyNumber: '+960 660-8888 Ext 1500',
      companyPhoneModel: 'Cisco IP Phone 8841',
      remarks: 'Housekeeping central desk'
    },
    generalRemarks: 'Manages 176 Beach Pool Villas, Overwater Pavilions, and public island areas.',
    updatedAt: '2026-09-22T07:45:00Z'
  },
  {
    id: 'vfar-007',
    employeeName: 'Fathimath Shifa',
    department: 'Finance',
    jobTitle: 'Assistant Financial Controller & Purchasing',
    propertyOrLocation: 'Avani+ Fares Maldives Resort',
    status: 'Active',
    email: {
      address: 'fshifa@avanihotels.com',
      leadersDL: true,
      dhDL: true,
      licenseType: 'M365 E5',
      functionalAccountMfa: true,
      remarks: 'Custodian of fares_finance@avanihotels.com'
    },
    hardware: [
      {
        pcLaptopModel: 'Dell Latitude 7440',
        serialNumber: 'DL-VFAR-9932',
        assetTag: 'VFAR-IT-0018',
        remarks: 'Finance secure machine with encrypted BitLocker SSD'
      }
    ],
    activeDirectory: {
      username: 'fshifa_vfar',
      ouGroup: 'OU=Finance,OU=AvaniFares,OU=Maldives,DC=minor,DC=corp',
      remarks: 'Member of G_VFAR_HOD, G_VFAR_Finance_Full'
    },
    vpn: {
      minorVpn: true,
      vfarLocalVpn: true,
      remarks: 'Minor Hotels Oracle Fusion Financials & VFAR local banking token bridge'
    },
    systems: {
      oracleFusion: { assigned: true, remarks: 'General Ledger, AP/AR, Bank Reconciliation & Month-end Close' },
      operaCloud: { assigned: true, remarks: 'City Ledger, Deposit accounts, Guest folio reconciliation' },
      microsSimphony: { assigned: true, remarks: 'Daily F&B revenue audit & cashier tip distributions' },
      zenoti: { assigned: true, remarks: 'Spa revenue audit & package commission reconciliation' },
      messageBox: { assigned: false, remarks: '' },
      tableCheck: { assigned: false, remarks: '' },
      minorHotelsApp: { assigned: false, remarks: '' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: true, remarks: 'Electronic check signing & tax filing' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: false, remarks: '' }
    },
    telephony: {
      companyNumber: '+960 660-8888 Ext 1600',
      companyPhoneModel: 'Cisco IP Phone 8851',
      remarks: 'Finance directorate speed dial'
    },
    generalRemarks: 'Oversees Maldivian MIRA tax filings, TGST/Green Tax compliance, and resort payroll.',
    updatedAt: '2026-09-24T12:00:00Z'
  },
  {
    id: 'vfar-008',
    employeeName: 'Ahmed Naseer',
    department: 'Front Office',
    jobTitle: 'Island Host / Villa Butler Trainee',
    propertyOrLocation: 'Avani+ Fares Maldives Resort',
    status: 'Onboarding',
    email: {
      address: 'anaseer@avanihotels.com',
      leadersDL: false,
      dhDL: false,
      licenseType: 'M365 F3',
      functionalAccountMfa: true,
      remarks: 'Pending mobile authentication token setup in IT store'
    },
    hardware: [
      {
        pcLaptopModel: 'Dell Latitude 3440',
        serialNumber: 'DL-VFAR-1198',
        assetTag: '',
        remarks: 'Pending physical asset barcode tagging in IT staging rack'
      }
    ],
    activeDirectory: {
      username: 'anaseer_vfar',
      ouGroup: 'OU=FrontOffice,OU=AvaniFares,OU=Maldives,DC=minor,DC=corp',
      remarks: 'Account staged; awaiting completion of Minor Hotels Cyber Security module'
    },
    vpn: {
      minorVpn: false,
      vfarLocalVpn: false,
      remarks: 'No remote VPN required for on-island host role'
    },
    systems: {
      oracleFusion: { assigned: false, remarks: '' },
      operaCloud: { assigned: true, remarks: 'Front Office Island Host profile provisioned' },
      microsSimphony: { assigned: false, remarks: '' },
      zenoti: { assigned: false, remarks: '' },
      messageBox: { assigned: true, remarks: 'Runner queue access assigned' },
      tableCheck: { assigned: false, remarks: '' },
      minorHotelsApp: { assigned: true, remarks: 'Avani App guest messenger' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: false, remarks: '' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: true, remarks: 'Staff keycard issued' }
    },
    telephony: {
      companyNumber: '+960 660-8888 Ext 1115',
      companyPhoneModel: 'Cisco Wireless IP Phone 8821',
      remarks: 'Mobile buggy phone'
    },
    generalRemarks: 'Joined 22 Sep 2026. Undergoing 2-week cross-training between Jetty and Ocean Villas.',
    updatedAt: '2026-09-24T15:30:00Z'
  },
  {
    id: 'vfar-009',
    employeeName: 'Hussain Rasheed',
    department: 'Culinary',
    jobTitle: 'Executive Chef',
    propertyOrLocation: 'Avani+ Fares Maldives Resort',
    status: 'Active',
    email: {
      address: 'hrasheed@avanihotels.com',
      leadersDL: true,
      dhDL: true,
      licenseType: 'M365 E3',
      functionalAccountMfa: true,
      remarks: 'Oversees resort culinary operations & food hygiene HACCP audits'
    },
    hardware: [
      {
        pcLaptopModel: 'Lenovo ThinkPad T14 Gen 4',
        serialNumber: 'PF-VFAR-4491',
        assetTag: 'VFAR-IT-0045',
        remarks: 'Main culinary office station (equipped with water-resistant keyboard protector)'
      }
    ],
    activeDirectory: {
      username: 'hrasheed_vfar',
      ouGroup: 'OU=Culinary,OU=AvaniFares,OU=Maldives,DC=minor,DC=corp',
      remarks: 'Member of G_VFAR_HOD, G_VFAR_Culinary_Admins'
    },
    vpn: {
      minorVpn: false,
      vfarLocalVpn: true,
      remarks: 'Local VFAR Simphony POS menu item maintenance & recipe engineering'
    },
    systems: {
      oracleFusion: { assigned: true, remarks: 'Food stock purchase requisitions, butchery and fresh produce orders' },
      operaCloud: { assigned: true, remarks: 'Daily guest count & VIP dietary requirement lookup' },
      microsSimphony: { assigned: true, remarks: 'KDS (Kitchen Display System) routing & menu master pricing' },
      zenoti: { assigned: false, remarks: '' },
      messageBox: { assigned: true, remarks: 'Special guest dietary request tracker' },
      tableCheck: { assigned: true, remarks: 'Chef table tasting menu bookings' },
      minorHotelsApp: { assigned: false, remarks: '' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: true, remarks: 'Recipe cards & seasonal menu proofing' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: true, remarks: 'Cold room & dry store master access' }
    },
    telephony: {
      companyNumber: '+960 660-8888 Ext 1250',
      companyPhoneModel: 'Cisco IP Phone 8841',
      remarks: 'Executive Chef kitchen office'
    },
    generalRemarks: 'Oversees Ocean Terrace, Charcoal, Skipjack Bar, Petit Bistro, and In-Villa Dining culinary teams.',
    updatedAt: '2026-09-23T11:00:00Z'
  },
  {
    id: 'vfar-010',
    employeeName: 'Aminath Shana',
    department: 'Human Resources',
    jobTitle: 'Human Resources & Talent Development Manager',
    propertyOrLocation: 'Avani+ Fares Maldives Resort',
    status: 'Active',
    email: {
      address: 'ashana@avanihotels.com',
      leadersDL: true,
      dhDL: true,
      licenseType: 'M365 E5',
      functionalAccountMfa: true,
      remarks: 'Custodian of fares_hr@avanihotels.com and island staff welfare'
    },
    hardware: [
      {
        pcLaptopModel: 'Dell Latitude 7440',
        serialNumber: 'DL-VFAR-2289',
        assetTag: 'VFAR-IT-0015',
        remarks: 'HR confidential workstation with privacy screen filter'
      }
    ],
    activeDirectory: {
      username: 'ashana_vfar',
      ouGroup: 'OU=HumanResources,OU=AvaniFares,OU=Maldives,DC=minor,DC=corp',
      remarks: 'Member of G_VFAR_HOD, G_VFAR_HR_Confidential'
    },
    vpn: {
      minorVpn: true,
      vfarLocalVpn: true,
      remarks: 'Minor Hotels Oracle Fusion HCM & Ministry of Economic Development Maldives portal'
    },
    systems: {
      oracleFusion: { assigned: true, remarks: 'Employee records, work permits, payroll processing & onboarding workflows' },
      operaCloud: { assigned: false, remarks: '' },
      microsSimphony: { assigned: false, remarks: '' },
      zenoti: { assigned: false, remarks: '' },
      messageBox: { assigned: false, remarks: '' },
      tableCheck: { assigned: false, remarks: '' },
      minorHotelsApp: { assigned: true, remarks: 'Team member engagement and internal announcements' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: true, remarks: 'Employment contract digital signing' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: true, remarks: 'Staff Village accommodation keycard programming supervisor' }
    },
    telephony: {
      companyNumber: '+960 660-8888 Ext 1700',
      companyPhoneModel: 'Cisco IP Phone 8851',
      remarks: 'HR office direct extension'
    },
    generalRemarks: 'Manages expatriate work visas, local Maldivian apprentice programs, and staff village facilities.',
    updatedAt: '2026-09-24T09:40:00Z'
  },
  {
    id: 'vfar-011',
    employeeName: 'Rilwan Latheef',
    department: 'Security',
    jobTitle: 'Director of Safety & Security',
    propertyOrLocation: 'Avani+ Fares Maldives Resort',
    status: 'Active',
    email: {
      address: 'rlatheef@avanihotels.com',
      leadersDL: true,
      dhDL: true,
      licenseType: 'M365 E3',
      functionalAccountMfa: true,
      remarks: '24/7 Island security command center lead'
    },
    hardware: [
      {
        pcLaptopModel: 'Dell Latitude 5440 Rugged',
        serialNumber: 'DL-VFAR-6601',
        assetTag: 'VFAR-IT-0070',
        remarks: 'Security command center CCTV & access control monitoring console'
      }
    ],
    activeDirectory: {
      username: 'rlatheef_vfar',
      ouGroup: 'OU=Security,OU=AvaniFares,OU=Maldives,DC=minor,DC=corp',
      remarks: 'Member of G_VFAR_HOD, G_VFAR_Security_Admins'
    },
    vpn: {
      minorVpn: false,
      vfarLocalVpn: true,
      remarks: 'Local VFAR CCTV network & Visionline door lock security database'
    },
    systems: {
      oracleFusion: { assigned: false, remarks: 'Self-service leave only' },
      operaCloud: { assigned: true, remarks: 'Emergency room roster & guest evacuation reports' },
      microsSimphony: { assigned: false, remarks: '' },
      zenoti: { assigned: false, remarks: '' },
      messageBox: { assigned: true, remarks: 'Security incident log & duty officer dispatch' },
      tableCheck: { assigned: false, remarks: '' },
      minorHotelsApp: { assigned: false, remarks: '' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: true, remarks: 'Incident report filing' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: true, remarks: 'Visionline Master Emergency Key Authority & door audit extraction' }
    },
    telephony: {
      companyNumber: '+960 660-8888 Ext 1999',
      companyPhoneModel: 'Cisco Wireless IP Phone 8821',
      remarks: 'Island emergency response speed dial'
    },
    generalRemarks: 'Oversees island perimeter marine patrols, fire safety systems, and guest privacy standards.',
    updatedAt: '2026-09-22T16:15:00Z'
  },
  {
    id: 'vfar-012',
    employeeName: 'Hassan Fayaz',
    department: 'Information Technology',
    jobTitle: 'IT Officer & Network Specialist',
    propertyOrLocation: 'Avani+ Fares Maldives Resort',
    status: 'Active',
    email: {
      address: 'hfayaz@avanihotels.com',
      leadersDL: false,
      dhDL: false,
      licenseType: 'M365 E3',
      functionalAccountMfa: true,
      remarks: 'On-island hardware support and network patching specialist'
    },
    hardware: [
      {
        pcLaptopModel: 'Lenovo ThinkPad T14 Gen 4',
        serialNumber: 'PF-VFAR-1104',
        assetTag: 'VFAR-IT-0002',
        remarks: 'Field technician laptop with USB console cable & Fluke network tester'
      }
    ],
    activeDirectory: {
      username: 'hfayaz_vfar',
      ouGroup: 'OU=IT,OU=AvaniFares,OU=Maldives,DC=minor,DC=corp',
      remarks: 'Member of G_VFAR_IT_Staff, G_LocalAdmins'
    },
    vpn: {
      minorVpn: true,
      vfarLocalVpn: true,
      remarks: 'On-island Palo Alto firewall administration and Cisco Meraki switch management'
    },
    systems: {
      oracleFusion: { assigned: false, remarks: '' },
      operaCloud: { assigned: true, remarks: 'Workstation IFC configuration & cashier printer setup' },
      microsSimphony: { assigned: true, remarks: 'Simphony CAPS server & workstation client imaging' },
      zenoti: { assigned: true, remarks: 'Zenoti receipt printer & iPad terminal deployment' },
      messageBox: { assigned: true, remarks: 'Service desk ticket dispatcher' },
      tableCheck: { assigned: false, remarks: '' },
      minorHotelsApp: { assigned: true, remarks: 'Wi-Fi portal captive gateway management' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: true, remarks: 'Standard documentation' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: true, remarks: 'Visionline encoder repair & online lock gateway maintenance' }
    },
    telephony: {
      companyNumber: '+960 660-8888 Ext 1012',
      companyPhoneModel: 'Cisco IP Phone 8841',
      remarks: 'IT helpdesk line'
    },
    generalRemarks: 'Assists Asnaadhu Mohamed with villa IPTV systems, guest Wi-Fi 6 coverage, and POS maintenance.',
    updatedAt: '2026-09-24T14:10:00Z'
  },
  {
    id: 'vfar-013',
    employeeName: 'Priya Sharma',
    department: 'Spa & Wellness',
    jobTitle: 'Spa & Wellness Director (AvaniSpa)',
    propertyOrLocation: 'Avani+ Fares Maldives Resort',
    status: 'Active',
    email: {
      address: 'psharma@avanihotels.com',
      leadersDL: true,
      dhDL: true,
      licenseType: 'M365 E3',
      functionalAccountMfa: true,
      remarks: 'Oversees AvaniSpa treatment packages & therapists'
    },
    hardware: [
      {
        pcLaptopModel: 'Lenovo ThinkPad X13 Gen 4',
        serialNumber: 'PF-VFAR-7712',
        assetTag: 'VFAR-IT-0051',
        remarks: 'Spa reception supervisory workstation'
      }
    ],
    activeDirectory: {
      username: 'psharma_vfar',
      ouGroup: 'OU=SpaWellness,OU=AvaniFares,OU=Maldives,DC=minor,DC=corp',
      remarks: 'Member of G_VFAR_HOD, G_VFAR_Spa_Admins'
    },
    vpn: {
      minorVpn: false,
      vfarLocalVpn: true,
      remarks: 'Zenoti local PMS bridge and credit card terminal server'
    },
    systems: {
      oracleFusion: { assigned: true, remarks: 'Spa retail product orders & therapist commissions' },
      operaCloud: { assigned: true, remarks: 'Guest folio posting & wellness package redemption' },
      microsSimphony: { assigned: false, remarks: '' },
      zenoti: { assigned: true, remarks: 'Master Zenoti Administrator (Therapist rosters, service pricing, inventory)' },
      messageBox: { assigned: true, remarks: 'Guest wellness bookings and special occasion setups' },
      tableCheck: { assigned: false, remarks: '' },
      minorHotelsApp: { assigned: true, remarks: 'AvaniSpa digital menu and app booking portal' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: true, remarks: 'Treatment menu signing' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: true, remarks: 'Spa treatment pavilion access cards' }
    },
    telephony: {
      companyNumber: '+960 660-8888 Ext 1300',
      companyPhoneModel: 'Cisco IP Phone 8841',
      remarks: 'AvaniSpa reception'
    },
    generalRemarks: 'Oversees 8 overwater and garden treatment rooms, hydrotherapy pools, and salon services.',
    updatedAt: '2026-09-21T13:00:00Z'
  },
  {
    id: 'vfar-014',
    employeeName: 'Ali Moosa',
    department: 'Food & Beverage',
    jobTitle: 'Bartender & Mixologist',
    propertyOrLocation: 'Avani+ Fares Maldives Resort',
    status: 'Offboarded',
    email: {
      address: 'amoosa@avanihotels.com',
      leadersDL: false,
      dhDL: false,
      licenseType: 'None',
      functionalAccountMfa: false,
      remarks: 'Account disabled on 2026-09-15. Mailbox converted to shared archive.'
    },
    hardware: [
      {
        pcLaptopModel: 'Lenovo ThinkPad E14 Gen 4',
        serialNumber: 'PF-VFAR-9901',
        assetTag: 'VFAR-IT-0088',
        remarks: 'Returned to IT inventory room; wiped and SOE re-imaged.'
      }
    ],
    activeDirectory: {
      username: 'amoosa_vfar',
      ouGroup: 'OU=DisabledAccounts,OU=AvaniFares,OU=Maldives,DC=minor,DC=corp',
      remarks: 'Account disabled; removed from G_VFAR_AllStaff and F&B security groups'
    },
    vpn: {
      minorVpn: false,
      vfarLocalVpn: false,
      remarks: 'Access revoked'
    },
    systems: {
      oracleFusion: { assigned: false, remarks: 'Access revoked' },
      operaCloud: { assigned: false, remarks: '' },
      microsSimphony: { assigned: false, remarks: 'Simphony operator ID #2041 closed and purged' },
      zenoti: { assigned: false, remarks: '' },
      messageBox: { assigned: false, remarks: 'User deactivated' },
      tableCheck: { assigned: false, remarks: '' },
      minorHotelsApp: { assigned: false, remarks: '' }
    },
    creativeProductivity: {
      adobeAcrobat: { assigned: false, remarks: 'License reclaimed' },
      adobeCc: { assigned: false, remarks: '' }
    },
    security: {
      visionline: { assigned: false, remarks: 'Staff keycard cancelled and wiped' }
    },
    telephony: {
      companyNumber: '',
      companyPhoneModel: '',
      remarks: 'SIM card returned and deactivated'
    },
    generalRemarks: 'Resigned effective 15 Sep 2026. Complete IT exit offboarding checklist verified by Asnaadhu Mohamed.',
    updatedAt: '2026-09-16T10:00:00Z'
  }
];

export const PROPERTY_OPTIONS = [
  'Avani+ Fares Maldives Resort'
];

export const DEPARTMENT_OPTIONS = [
  'Front Office',
  'Food & Beverage',
  'Culinary',
  'Housekeeping',
  'Spa & Wellness',
  'Information Technology',
  'Engineering',
  'Finance',
  'Human Resources',
  'Sales & Marketing',
  'Revenue Management',
  'Executive Office',
  'Security'
];

export const SYSTEM_METADATA = [
  { key: 'operaCloud', label: 'Opera Cloud', category: 'PMS', desc: 'Hotel PMS & Cashiering' },
  { key: 'microsSimphony', label: 'Micros Simphony', category: 'POS', desc: 'F&B POS & Cashier Workstation' },
  { key: 'oracleFusion', label: 'Oracle Fusion', category: 'ERP/HCM', desc: 'Financials, Supply Chain & HR' },
  { key: 'zenoti', label: 'Zenoti Spa', category: 'Wellness', desc: 'Spa Booking & Retail Management' },
  { key: 'messageBox', label: 'MessageBox', category: 'Service', desc: 'Guest Request & Work Order Dispatch' },
  { key: 'tableCheck', label: 'TableCheck', category: 'F&B', desc: 'Restaurant Reservation & Table Ops' },
  { key: 'minorHotelsApp', label: 'Minor Hotels App', category: 'Guest/Loyalty', desc: 'Discovery VIP & App Management' }
] as const;

export const INITIAL_HARDWARE_INVENTORY: HardwareItem[] = [
  {
    id: 'hw-001',
    assetTag: 'VFAR-IT-0001',
    deviceModel: 'Lenovo ThinkPad T14s Gen 4',
    deviceCategory: 'Laptop',
    serialNumber: 'PF-VFAR-0019',
    specifications: 'Intel Core i7-1365U, 32GB RAM, 1TB SSD, 14" WUXGA',
    status: 'Assigned',
    assignedMemberId: 'vfar-001',
    assignedMemberName: 'Asnaadhu Mohamed',
    assignedDepartment: 'Information Technology',
    condition: 'Good',
    purchaseDate: '2023-04-15',
    notes: 'Dual Dell 27" 4K displays & Lenovo Thunderbolt 4 workstation dock',
    updatedAt: '2026-09-20T08:30:00Z'
  },
  {
    id: 'hw-002',
    assetTag: 'VFAR-IT-0012',
    deviceModel: 'Dell Latitude 7440',
    deviceCategory: 'Laptop',
    serialNumber: 'DL-VFAR-4412',
    specifications: 'Intel Core i7-1365U, 16GB RAM, 512GB SSD',
    status: 'Assigned',
    assignedMemberId: 'vfar-002',
    assignedMemberName: 'Hawwa Niuma',
    assignedDepartment: 'Front Office',
    condition: 'Good',
    purchaseDate: '2023-05-10',
    notes: 'Front Desk supervisory station with dual displays & card reader',
    updatedAt: '2026-09-18T10:15:00Z'
  },
  {
    id: 'hw-003',
    assetTag: 'VFAR-IT-0025',
    deviceModel: 'Lenovo ThinkPad T14 Gen 4',
    deviceCategory: 'Laptop',
    serialNumber: 'PF-VFAR-8831',
    specifications: 'Intel Core i5-1345U, 16GB RAM, 512GB SSD',
    status: 'Assigned',
    assignedMemberId: 'vfar-003',
    assignedMemberName: 'Ibrahim Ziyan',
    assignedDepartment: 'Food & Beverage',
    condition: 'Good',
    purchaseDate: '2023-06-01',
    notes: 'Allocated to F&B management office (Skipjack / Ocean Terrace)',
    updatedAt: '2026-09-15T09:00:00Z'
  },
  {
    id: 'hw-004',
    assetTag: 'VFAR-IT-0040',
    deviceModel: 'Apple MacBook Air 15" M3',
    deviceCategory: 'Laptop',
    serialNumber: 'C02-VFAR-9102',
    specifications: 'Apple M3 chip, 16GB Unified RAM, 512GB SSD',
    status: 'Assigned',
    assignedMemberId: 'vfar-004',
    assignedMemberName: 'Dr. Mariyam Latheef',
    assignedDepartment: 'Spa & Wellness',
    condition: 'Good',
    purchaseDate: '2024-01-20',
    notes: 'Hanifaru Bay marine biology presentation & high-res media workstation',
    updatedAt: '2026-09-12T14:20:00Z'
  },
  {
    id: 'hw-005',
    assetTag: 'VFAR-IT-0033',
    deviceModel: 'Dell Latitude 5440 Rugged',
    deviceCategory: 'Laptop',
    serialNumber: 'DL-VFAR-7182',
    specifications: 'Intel Core i5-1335U, 16GB RAM, 512GB SSD, IP53 Rugged',
    status: 'Assigned',
    assignedMemberId: 'vfar-005',
    assignedMemberName: 'Mohamed Shaffaf',
    assignedDepartment: 'Engineering',
    condition: 'Good',
    purchaseDate: '2023-07-15',
    notes: 'Field rugged laptop with splash resistance for desalination plant & generators',
    updatedAt: '2026-09-19T11:45:00Z'
  },
  {
    id: 'hw-006',
    assetTag: 'VFAR-IT-0062',
    deviceModel: 'Lenovo ThinkPad L14 Gen 4',
    deviceCategory: 'Laptop',
    serialNumber: 'PF-VFAR-3390',
    specifications: 'Intel Core i5-1335U, 16GB RAM, 256GB SSD',
    status: 'Assigned',
    assignedMemberId: 'vfar-006',
    assignedMemberName: 'Ahmed Zahir',
    assignedDepartment: 'Housekeeping',
    condition: 'Good',
    purchaseDate: '2023-08-01',
    notes: 'Housekeeping control desk station for villa turnaround coordination',
    updatedAt: '2026-09-14T08:10:00Z'
  },
  {
    id: 'hw-007',
    assetTag: 'VFAR-IT-0018',
    deviceModel: 'Dell Latitude 7440',
    deviceCategory: 'Laptop',
    serialNumber: 'DL-VFAR-9932',
    specifications: 'Intel Core i7-1365U, 16GB RAM, 512GB SSD, BitLocker Hardware Encrypted',
    status: 'Assigned',
    assignedMemberId: 'vfar-007',
    assignedMemberName: 'Fathimath Shuba',
    assignedDepartment: 'Finance',
    condition: 'Good',
    purchaseDate: '2023-05-15',
    notes: 'Finance secure machine with encrypted BitLocker SSD & USB lock',
    updatedAt: '2026-09-21T13:00:00Z'
  },
  {
    id: 'hw-008',
    assetTag: 'VFAR-IT-0045',
    deviceModel: 'Lenovo ThinkPad T14 Gen 4',
    deviceCategory: 'Laptop',
    serialNumber: 'PF-VFAR-4491',
    specifications: 'Intel Core i5-1345U, 16GB RAM, 512GB SSD',
    status: 'Assigned',
    assignedMemberId: 'vfar-009',
    assignedMemberName: 'Chef Simone Conti',
    assignedDepartment: 'Culinary',
    condition: 'Good',
    purchaseDate: '2023-09-10',
    notes: 'Main culinary office station with silicone splash guard cover',
    updatedAt: '2026-09-10T16:40:00Z'
  },
  {
    id: 'hw-009',
    assetTag: 'VFAR-IT-0015',
    deviceModel: 'Dell Latitude 7440',
    deviceCategory: 'Laptop',
    serialNumber: 'DL-VFAR-2289',
    specifications: 'Intel Core i7-1365U, 16GB RAM, 512GB SSD',
    status: 'Assigned',
    assignedMemberId: 'vfar-010',
    assignedMemberName: 'Aishath Reema',
    assignedDepartment: 'Human Resources',
    condition: 'Good',
    purchaseDate: '2023-05-20',
    notes: 'HR confidential workstation with 3M privacy screen filter',
    updatedAt: '2026-09-17T09:20:00Z'
  },
  {
    id: 'hw-010',
    assetTag: 'VFAR-IT-0070',
    deviceModel: 'Dell Latitude 5440 Rugged',
    deviceCategory: 'Laptop',
    serialNumber: 'DL-VFAR-6601',
    specifications: 'Intel Core i5-1335U, 16GB RAM, 512GB SSD',
    status: 'Assigned',
    assignedMemberId: 'vfar-011',
    assignedMemberName: 'Hussain Manik',
    assignedDepartment: 'Security',
    condition: 'Good',
    purchaseDate: '2023-06-25',
    notes: 'Security command center CCTV & access control monitoring console',
    updatedAt: '2026-09-16T15:30:00Z'
  },
  {
    id: 'hw-011',
    assetTag: 'VFAR-IT-0002',
    deviceModel: 'Lenovo ThinkPad T14 Gen 4',
    deviceCategory: 'Laptop',
    serialNumber: 'PF-VFAR-1104',
    specifications: 'Intel Core i5-1345U, 16GB RAM, 512GB SSD',
    status: 'Assigned',
    assignedMemberId: 'vfar-012',
    assignedMemberName: 'Abdulla Sinan',
    assignedDepartment: 'Information Technology',
    condition: 'Good',
    purchaseDate: '2023-04-18',
    notes: 'Field technician laptop with USB console cable & Fluke tester kit',
    updatedAt: '2026-09-22T08:15:00Z'
  },
  {
    id: 'hw-012',
    assetTag: 'VFAR-IT-0051',
    deviceModel: 'Lenovo ThinkPad X13 Gen 4',
    deviceCategory: 'Laptop',
    serialNumber: 'PF-VFAR-7712',
    specifications: 'Intel Core i5-1335U, 16GB RAM, 512GB SSD, Ultra-light 1.2kg',
    status: 'Assigned',
    assignedMemberId: 'vfar-013',
    assignedMemberName: 'Nareerat Suksawat',
    assignedDepartment: 'Spa & Wellness',
    condition: 'Good',
    purchaseDate: '2023-11-05',
    notes: 'Spa reception supervisory workstation connected to receipt printer',
    updatedAt: '2026-09-11T12:00:00Z'
  },
  // INVENTORY ITEMS AVAILABLE IN IT STOCK (READY FOR DEPLOYMENT)
  {
    id: 'hw-stock-01',
    assetTag: 'VFAR-IT-0101',
    deviceModel: 'Lenovo ThinkPad T14s Gen 4',
    deviceCategory: 'Laptop',
    serialNumber: 'PF-VFAR-9101',
    specifications: 'Intel Core i7-1365U, 16GB RAM, 512GB SSD, Windows 11 Pro Minor SOE',
    status: 'Available',
    assignedMemberId: null,
    assignedMemberName: null,
    assignedDepartment: null,
    condition: 'Brand New',
    purchaseDate: '2024-02-15',
    notes: 'IT Server Room Stock Rack A - Pre-imaged with Minor SOE & BitLocker',
    updatedAt: '2026-09-24T10:00:00Z'
  },
  {
    id: 'hw-stock-02',
    assetTag: 'VFAR-IT-0102',
    deviceModel: 'Dell Latitude 7440',
    deviceCategory: 'Laptop',
    serialNumber: 'DL-VFAR-8812',
    specifications: 'Intel Core i5-1345U, 16GB RAM, 512GB SSD',
    status: 'Available',
    assignedMemberId: null,
    assignedMemberName: null,
    assignedDepartment: null,
    condition: 'Brand New',
    purchaseDate: '2024-03-01',
    notes: 'IT Staging Cabinet - Ready for staff onboarding assignment',
    updatedAt: '2026-09-24T10:00:00Z'
  },
  {
    id: 'hw-stock-03',
    assetTag: 'VFAR-IT-0103',
    deviceModel: 'Apple MacBook Pro 14" M3',
    deviceCategory: 'Laptop',
    serialNumber: 'C02-VFAR-3391',
    specifications: 'Apple M3 Pro (11-core CPU, 14-core GPU), 18GB RAM, 512GB SSD',
    status: 'Available',
    assignedMemberId: null,
    assignedMemberName: null,
    assignedDepartment: null,
    condition: 'Brand New',
    purchaseDate: '2024-04-10',
    notes: 'Executive & Marketing reserve hardware pool in secure safe',
    updatedAt: '2026-09-24T10:00:00Z'
  },
  {
    id: 'hw-stock-04',
    assetTag: 'VFAR-IT-0104',
    deviceModel: 'Lenovo ThinkCentre M70q Tiny',
    deviceCategory: 'Desktop',
    serialNumber: 'PF-VFAR-4402',
    specifications: 'Intel Core i5-13400T, 16GB RAM, 512GB SSD, Ultra Small Form Factor',
    status: 'Available',
    assignedMemberId: null,
    assignedMemberName: null,
    assignedDepartment: null,
    condition: 'Brand New',
    purchaseDate: '2024-01-15',
    notes: 'Front Desk & Back Office spare workstation with VESA mount',
    updatedAt: '2026-09-24T10:00:00Z'
  },
  {
    id: 'hw-stock-05',
    assetTag: 'VFAR-IT-0105',
    deviceModel: 'Apple iPad Air 11" M2',
    deviceCategory: 'Tablet',
    serialNumber: 'DMP-VFAR-7719',
    specifications: 'Apple M2, 128GB Wi-Fi, Survivor Rugged Case + Hand Strap',
    status: 'Available',
    assignedMemberId: null,
    assignedMemberName: null,
    assignedDepartment: null,
    condition: 'Brand New',
    purchaseDate: '2024-05-01',
    notes: 'F&B Ocean Terrace / Skipjack spare ordering & guest check-in tablet',
    updatedAt: '2026-09-24T10:00:00Z'
  },
  {
    id: 'hw-stock-06',
    assetTag: 'VFAR-IT-0106',
    deviceModel: 'Oracle MICROS Workstation 6',
    deviceCategory: 'POS Terminal',
    serialNumber: 'MC-VFAR-1190',
    specifications: '15.6" Full HD Touch Screen, Simphony POS Client, Cash Drawer & Fiscal Port',
    status: 'Available',
    assignedMemberId: null,
    assignedMemberName: null,
    assignedDepartment: null,
    condition: 'Good',
    purchaseDate: '2023-03-20',
    notes: 'Outlets spare POS terminal; configured with Avani+ Fares restaurant image',
    updatedAt: '2026-09-24T10:00:00Z'
  },
  {
    id: 'hw-stock-07',
    assetTag: 'VFAR-IT-0088',
    deviceModel: 'Lenovo ThinkPad E14 Gen 4',
    deviceCategory: 'Laptop',
    serialNumber: 'PF-VFAR-9901',
    specifications: 'AMD Ryzen 5 5625U, 16GB RAM, 512GB SSD',
    status: 'Available',
    assignedMemberId: null,
    assignedMemberName: null,
    assignedDepartment: null,
    condition: 'Good',
    purchaseDate: '2023-04-10',
    notes: 'Returned from offboarded personnel; sanitized, wiped and re-imaged with Minor SOE',
    updatedAt: '2026-09-20T10:00:00Z'
  },
  // IN MAINTENANCE / REPAIR
  {
    id: 'hw-maint-01',
    assetTag: 'VFAR-IT-0092',
    deviceModel: 'Lenovo ThinkPad T14 Gen 3',
    deviceCategory: 'Laptop',
    serialNumber: 'PF-VFAR-3329',
    specifications: 'Intel Core i5-1245U, 16GB RAM, 256GB SSD',
    status: 'Maintenance',
    assignedMemberId: null,
    assignedMemberName: null,
    assignedDepartment: null,
    condition: 'Under Repair',
    purchaseDate: '2022-11-15',
    notes: 'Display backlight flickering. Warranty repair ticket logged with Lenovo Maldives partner in Male.',
    updatedAt: '2026-09-18T14:00:00Z'
  }
];
