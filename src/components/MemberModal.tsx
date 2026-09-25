import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Sparkles, 
  Building2, 
  Mail, 
  Laptop, 
  Shield, 
  Server, 
  KeyRound,
  QrCode,
  HardDrive,
  AlertTriangle,
  Plus,
  Check,
  RotateCcw,
  Box
} from 'lucide-react';
import { TeamMemberRecord, MemberStatus, M365LicenseType, HardwareItem, DeviceCategory } from '../types';
import { PROPERTY_OPTIONS, DEPARTMENT_OPTIONS } from '../data/initialData';
import { createBlankMember, ROLE_PRESETS } from '../utils/storage';
import { HardwareQRModal } from './HardwareQRModal';

interface MemberModalProps {
  isOpen: boolean;
  member: TeamMemberRecord | null;
  onClose: () => void;
  onSave: (record: TeamMemberRecord) => void;
  hardwareInventory?: HardwareItem[];
  onAddNewHardwareToInventory?: (item: HardwareItem) => void;
}

type ModalTab = 'identity' | 'email' | 'hardware' | 'adVpn' | 'systems' | 'securityPhone';

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  member,
  onClose,
  onSave,
  hardwareInventory = [],
  onAddNewHardwareToInventory
}) => {
  const [formData, setFormData] = useState<TeamMemberRecord>(createBlankMember());
  const [activeTab, setActiveTab] = useState<ModalTab>('identity');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Quick Register Device state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickModel, setQuickModel] = useState('');
  const [quickSerial, setQuickSerial] = useState('');
  const [quickTag, setQuickTag] = useState('');
  const [quickCategory, setQuickCategory] = useState<DeviceCategory>('Laptop');
  const [quickSpecs, setQuickSpecs] = useState('');

  // QR Modal state
  const [viewingQRItem, setViewingQRItem] = useState<HardwareItem | null>(null);

  useEffect(() => {
    if (member) {
      setFormData(JSON.parse(JSON.stringify(member)));
    } else {
      setFormData(createBlankMember());
    }
    setActiveTab('identity');
    setErrors({});
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleApplyPreset = (presetName: string) => {
    const preset = ROLE_PRESETS[presetName];
    if (!preset) return;

    setFormData(prev => ({
      ...prev,
      ...preset,
      employeeName: prev.employeeName,
      jobTitle: prev.jobTitle || presetName,
      propertyOrLocation: prev.propertyOrLocation,
      status: prev.status,
      email: {
        ...prev.email,
        ...(preset.email || {})
      },
      hardware: {
        ...prev.hardware,
        ...(preset.hardware || {})
      },
      systems: {
        ...prev.systems,
        ...(preset.systems || {})
      },
      creativeProductivity: {
        ...prev.creativeProductivity,
        ...(preset.creativeProductivity || {})
      },
      security: {
        ...prev.security,
        ...(preset.security || {})
      },
      vpn: {
        ...prev.vpn,
        ...(preset.vpn || {})
      }
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.employeeName.trim()) {
      newErrors.employeeName = 'Employee name is required';
    }
    if (!formData.propertyOrLocation.trim()) {
      newErrors.propertyOrLocation = 'Property / location is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setActiveTab('identity');
      return;
    }

    const updatedRecord: TeamMemberRecord = {
      ...formData,
      updatedAt: new Date().toISOString()
    };
    onSave(updatedRecord);
  };

  const tabs: { id: ModalTab; label: string; icon: React.ElementType }[] = [
    { id: 'identity', label: '1. Identity & Role', icon: Building2 },
    { id: 'email', label: '2. Email & M365', icon: Mail },
    { id: 'hardware', label: '3. Hardware & Tag', icon: Laptop },
    { id: 'adVpn', label: '4. AD & Remote VPN', icon: Shield },
    { id: 'systems', label: '5. Core PMS & ERP', icon: Server },
    { id: 'securityPhone', label: '6. Security & Telephony', icon: KeyRound },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              {member ? 'Edit Personnel Record' : 'Provision New Personnel Record'}
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              {formData.employeeName || 'New Team Member'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Role Template Selector */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Apply Template:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) handleApplyPreset(e.target.value);
                  e.target.value = '';
                }}
                className="px-2 py-1 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                defaultValue=""
              >
                <option value="" disabled>Select hospitality role...</option>
                {Object.keys(ROLE_PRESETS).map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-white px-6 overflow-x-auto scrollbar-none">
          <nav className="flex space-x-1 py-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 text-xs space-y-6 bg-white">
          
          {/* TAB 1: Identity & Role */}
          {activeTab === 'identity' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Employee Name */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Employee Name <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.employeeName}
                    onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                    placeholder="e.g. Aishath Mariyam"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  />
                  {errors.employeeName && <p className="text-rose-600 text-[11px] mt-1">{errors.employeeName}</p>}
                </div>

                {/* Job Title */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="e.g. Assistant Front Office Manager"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  />
                </div>

                {/* Property / Location */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Property or Location <span className="text-blue-600">*</span>
                  </label>
                  <select
                    value={formData.propertyOrLocation}
                    onChange={(e) => setFormData({ ...formData, propertyOrLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  >
                    {PROPERTY_OPTIONS.map(prop => (
                      <option key={prop} value={prop}>{prop}</option>
                    ))}
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  >
                    {DEPARTMENT_OPTIONS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Operational Status */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Operational Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as MemberStatus })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Offboarded">Offboarded</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

              </div>

              {/* General Remarks */}
              <div className="pt-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  General Operational Remarks & Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.generalRemarks}
                  onChange={(e) => setFormData({ ...formData, generalRemarks: e.target.value })}
                  placeholder="Duty manager rotation, special SLAs, equipment assignment notes..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Email & M365 */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Email Address */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email.address}
                    onChange={(e) => setFormData({
                      ...formData,
                      email: { ...formData.email, address: e.target.value }
                    })}
                    placeholder="staff_name@avanihotels.com"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-mono"
                  />
                </div>

                {/* License Type */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    M365 License Type
                  </label>
                  <select
                    value={formData.email.licenseType}
                    onChange={(e) => setFormData({
                      ...formData,
                      email: { ...formData.email, licenseType: e.target.value as M365LicenseType }
                    })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="M365 E5">M365 E5 (Enterprise Advanced Security)</option>
                    <option value="M365 E3">M365 E3 (Standard Enterprise)</option>
                    <option value="M365 F3">M365 F3 (Frontline Worker)</option>
                    <option value="Exchange Online">Exchange Online (Mailbox Only)</option>
                    <option value="None">None (De-provisioned)</option>
                  </select>
                </div>

              </div>

              {/* Toggles: Leaders DL, DH DL, Functional MFA */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/70 cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.email.leadersDL}
                    onChange={(e) => setFormData({
                      ...formData,
                      email: { ...formData.email, leadersDL: e.target.checked }
                    })}
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">Leaders DL</span>
                    <span className="text-[11px] text-slate-500">Property leadership group</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/70 cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.email.dhDL}
                    onChange={(e) => setFormData({
                      ...formData,
                      email: { ...formData.email, dhDL: e.target.checked }
                    })}
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">DH DL</span>
                    <span className="text-[11px] text-slate-500">Department Head distribution</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/70 cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.email.functionalAccountMfa}
                    onChange={(e) => setFormData({
                      ...formData,
                      email: { ...formData.email, functionalAccountMfa: e.target.checked }
                    })}
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">Functional MFA</span>
                    <span className="text-[11px] text-slate-500">Enforced security key/token</span>
                  </div>
                </label>
              </div>

              {/* Email Remarks */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Email Remarks & Shared Mailbox Delegations
                </label>
                <input
                  type="text"
                  value={formData.email.remarks}
                  onChange={(e) => setFormData({
                    ...formData,
                    email: { ...formData.email, remarks: e.target.value }
                  })}
                  placeholder="Delegated access to fares@avanihotels.com, mailbox forwarding..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Hardware & Fleet Inventory Assignment */}
          {activeTab === 'hardware' && (() => {
            const currentHardwareId = formData.hardware.hardwareId;
            const currentAssetTag = formData.hardware.assetTag.trim().toLowerCase();
            
            // Find if this member currently matches an inventory item
            const matchedItem = hardwareInventory.find(h => 
              (currentHardwareId && h.id === currentHardwareId) ||
              (currentAssetTag && h.assetTag.toLowerCase() === currentAssetTag) ||
              (formData.hardware.serialNumber && h.serialNumber && h.serialNumber.toLowerCase() === formData.hardware.serialNumber.toLowerCase())
            );

            // Devices available in stock (or the device currently assigned to this member)
            const availableDevices = hardwareInventory.filter(h => 
              h.status === 'Available' || 
              (matchedItem && h.id === matchedItem.id) ||
              h.assignedMemberId === formData.id
            );

            const handleSelectHardware = (hwId: string) => {
              if (!hwId) {
                // Unassign
                setFormData(prev => ({
                  ...prev,
                  hardware: {
                    ...prev.hardware,
                    hardwareId: undefined,
                    pcLaptopModel: '',
                    serialNumber: '',
                    assetTag: ''
                  }
                }));
                return;
              }

              const item = hardwareInventory.find(h => h.id === hwId);
              if (item) {
                setFormData(prev => ({
                  ...prev,
                  hardware: {
                    ...prev.hardware,
                    hardwareId: item.id,
                    pcLaptopModel: item.deviceModel,
                    serialNumber: item.serialNumber,
                    assetTag: item.assetTag,
                    remarks: prev.hardware.remarks || item.specifications || `Assigned from VFAR Fleet inventory (${item.deviceCategory})`
                  }
                }));
              }
            };

            const handleUnassignHardware = () => {
              setFormData(prev => ({
                ...prev,
                hardware: {
                  ...prev.hardware,
                  hardwareId: undefined,
                  pcLaptopModel: '',
                  serialNumber: '',
                  assetTag: '',
                  remarks: 'Hardware returned to IT stock / unassigned'
                }
              }));
            };

            const handleGenerateTag = () => {
              const randomNum = Math.floor(1000 + Math.random() * 9000);
              const newTag = `VFAR-IT-${randomNum}`;
              setFormData(prev => ({
                ...prev,
                hardware: {
                  ...prev.hardware,
                  assetTag: newTag
                }
              }));
            };

            const handleQuickCreateAndAssign = (e: React.FormEvent) => {
              e.preventDefault();
              if (!quickModel.trim()) return;

              const generatedTag = quickTag.trim() || `VFAR-IT-${Math.floor(1000 + Math.random() * 9000)}`;
              const newItem: HardwareItem = {
                id: `hw-${Date.now()}`,
                assetTag: generatedTag,
                deviceModel: quickModel.trim(),
                deviceCategory: quickCategory,
                serialNumber: quickSerial.trim(),
                specifications: quickSpecs.trim(),
                status: 'Assigned',
                assignedMemberId: formData.id,
                assignedMemberName: formData.employeeName || 'Assigned Staff',
                assignedDepartment: formData.department,
                condition: 'Brand New',
                notes: 'Registered and assigned via staff profile setup',
                updatedAt: new Date().toISOString()
              };

              onAddNewHardwareToInventory?.(newItem);

              setFormData(prev => ({
                ...prev,
                hardware: {
                  ...prev.hardware,
                  hardwareId: newItem.id,
                  pcLaptopModel: newItem.deviceModel,
                  serialNumber: newItem.serialNumber,
                  assetTag: newItem.assetTag,
                  remarks: prev.hardware.remarks || newItem.specifications || 'New fleet device assigned'
                }
              }));

              setIsQuickAddOpen(false);
              setQuickModel('');
              setQuickSerial('');
              setQuickTag('');
              setQuickSpecs('');
              setViewingQRItem(newItem);
            };

            return (
              <div className="space-y-5">
                
                {/* 1. Fleet Inventory Assignment Selector Header */}
                <div className="p-4 bg-blue-50/70 border border-blue-200/90 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Box className="w-4 h-4 text-blue-700" />
                        Hardware & Fleet Inventory Assignment
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Assign verified devices directly from the on-island IT inventory stock pool.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
                        className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-50 border border-blue-300 text-blue-800 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Register New Device</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Register New Device Form (Collapsible) */}
                  {isQuickAddOpen && (
                    <div className="p-3.5 bg-white border border-blue-300 rounded-lg shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                          Add New Device to Fleet & Assign to {formData.employeeName || 'Member'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsQuickAddOpen(false)}
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Category</label>
                          <select
                            value={quickCategory}
                            onChange={(e) => setQuickCategory(e.target.value as DeviceCategory)}
                            className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                          >
                            <option value="Laptop">Laptop</option>
                            <option value="Desktop">Desktop / Tiny</option>
                            <option value="Tablet">Tablet / iPad</option>
                            <option value="POS Terminal">POS Terminal</option>
                            <option value="Mobile Phone">Mobile Phone</option>
                            <option value="Workstation">Workstation</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Model Name *</label>
                          <input
                            type="text"
                            value={quickModel}
                            onChange={(e) => setQuickModel(e.target.value)}
                            placeholder="e.g. Lenovo ThinkPad T14s"
                            className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Serial Number</label>
                          <input
                            type="text"
                            value={quickSerial}
                            onChange={(e) => setQuickSerial(e.target.value)}
                            placeholder="e.g. PF-VFAR-XXXX"
                            className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Asset Tag</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={quickTag}
                              onChange={(e) => setQuickTag(e.target.value)}
                              placeholder="Auto-assigned"
                              className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-blue-800 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                            />
                            <button
                              type="button"
                              onClick={() => setQuickTag(`VFAR-IT-${Math.floor(1000 + Math.random() * 9000)}`)}
                              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded text-[10px] font-mono"
                              title="Generate tag"
                            >
                              Tag
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsQuickAddOpen(false)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleQuickCreateAndAssign}
                          disabled={!quickModel.trim()}
                          className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded shadow-xs"
                        >
                          Register & Assign
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Device Status Card or Inventory Dropdown */}
                  {formData.hardware.assetTag || formData.hardware.pcLaptopModel ? (
                    <div className="p-3.5 bg-white border border-emerald-200 rounded-xl shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0">
                            <Laptop className="w-5 h-5 text-emerald-700" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-900">
                                {formData.hardware.pcLaptopModel || 'Assigned Fleet Device'}
                              </span>
                              {formData.hardware.assetTag && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
                                  <QrCode className="w-3 h-3 text-blue-700" />
                                  {formData.hardware.assetTag}
                                </span>
                              )}
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Assigned to Member
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              S/N: {formData.hardware.serialNumber || 'Pending S/N'}
                              {matchedItem && ` · Category: ${matchedItem.deviceCategory} · Condition: ${matchedItem.condition}`}
                            </div>
                            {matchedItem?.specifications && (
                              <div className="text-[11px] text-slate-600 mt-1 font-medium">
                                Specs: {matchedItem.specifications}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {matchedItem && (
                            <button
                              type="button"
                              onClick={() => setViewingQRItem(matchedItem)}
                              className="px-2.5 py-1.5 text-xs font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                              title="View QR Code sticker & print physical label"
                            >
                              <QrCode className="w-3.5 h-3.5 text-blue-700" />
                              <span>View QR Label</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={handleUnassignHardware}
                            className="px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                            title="Unassign this hardware and return device to available IT stock"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Unassign / Return to Stock</span>
                          </button>
                        </div>
                      </div>

                      {/* Direct Switch to another in-stock device */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                          Switch to another available fleet device:
                        </span>
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) handleSelectHardware(e.target.value);
                          }}
                          className="flex-1 px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-mono"
                        >
                          <option value="">-- Choose from available IT stock ({availableDevices.filter(d => d.status === 'Available').length} devices) --</option>
                          {availableDevices.filter(d => d.status === 'Available').map(item => (
                            <option key={item.id} value={item.id}>
                              [{item.assetTag}] {item.deviceModel} ({item.deviceCategory}) — S/N: {item.serialNumber || 'N/A'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    /* Selector for Available Hardware in Stock */
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-800">
                        Choose Available Device from IT Stock ({availableDevices.filter(d => d.status === 'Available').length} available)
                      </label>
                      <select
                        value={formData.hardware.hardwareId || ''}
                        onChange={(e) => handleSelectHardware(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-mono"
                      >
                        <option value="">-- No device assigned (or choose from stock below) --</option>
                        {availableDevices.map(item => (
                          <option key={item.id} value={item.id}>
                            [{item.assetTag}] {item.deviceModel} ({item.deviceCategory}) — S/N: {item.serialNumber || 'N/A'} {item.status === 'Available' ? '· [AVAILABLE IN STOCK]' : '· [CURRENTLY ASSIGNED]'}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-500">
                        Selecting a device from stock links the fleet asset tag and specifications to this staff member.
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Hardware Detail Verification & Adjustments */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5 text-slate-500" />
                      Hardware Technical Specifications
                    </h5>
                    <button
                      type="button"
                      onClick={handleGenerateTag}
                      className="text-xs text-blue-700 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Auto-Generate VFAR Tag</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Model */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1 text-xs">
                        PC / Laptop Model
                      </label>
                      <input
                        type="text"
                        value={formData.hardware.pcLaptopModel}
                        onChange={(e) => setFormData({
                          ...formData,
                          hardware: { ...formData.hardware, pcLaptopModel: e.target.value }
                        })}
                        placeholder="e.g. Lenovo ThinkPad T14s Gen 4"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      />
                    </div>

                    {/* Serial Number */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1 text-xs">
                        Serial Number (S/N)
                      </label>
                      <input
                        type="text"
                        value={formData.hardware.serialNumber}
                        onChange={(e) => setFormData({
                          ...formData,
                          hardware: { ...formData.hardware, serialNumber: e.target.value }
                        })}
                        placeholder="e.g. PF-VFAR-XXXX"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-mono"
                      />
                    </div>

                    {/* Asset Tag */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1 text-xs">
                        Asset Tag (VFAR-IT-XXXX)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={formData.hardware.assetTag}
                          onChange={(e) => setFormData({
                            ...formData,
                            hardware: { ...formData.hardware, assetTag: e.target.value }
                          })}
                          placeholder="e.g. VFAR-IT-0104"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-blue-800 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Hardware Remarks & Accessories */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Hardware Condition, Accessories & Peripherals
                    </label>
                    <textarea
                      rows={2}
                      value={formData.hardware.remarks}
                      onChange={(e) => setFormData({
                        ...formData,
                        hardware: { ...formData.hardware, remarks: e.target.value }
                      })}
                      placeholder="Includes Lenovo USB-C dock, dual 27-inch Dell monitors, keyboard/mouse kit, Kensington lock..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                </div>

              </div>
            );
          })()}

          {/* TAB 4: AD & Remote VPN */}
          {activeTab === 'adVpn' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Active Directory Username */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Active Directory Username
                  </label>
                  <input
                    type="text"
                    value={formData.activeDirectory.username}
                    onChange={(e) => setFormData({
                      ...formData,
                      activeDirectory: { ...formData.activeDirectory, username: e.target.value }
                    })}
                    placeholder="e.g. asnaadhu_mo"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-mono"
                  />
                </div>

                {/* OU Group */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    AD Organizational Unit (OU) Path
                  </label>
                  <input
                    type="text"
                    value={formData.activeDirectory.ouGroup}
                    onChange={(e) => setFormData({
                      ...formData,
                      activeDirectory: { ...formData.activeDirectory, ouGroup: e.target.value }
                    })}
                    placeholder="OU=FrontOffice,OU=AvaniFares,DC=minor,DC=corp"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-mono text-[11px]"
                  />
                </div>

              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Active Directory Remarks & Security Group Memberships
                </label>
                <input
                  type="text"
                  value={formData.activeDirectory.remarks}
                  onChange={(e) => setFormData({
                    ...formData,
                    activeDirectory: { ...formData.activeDirectory, remarks: e.target.value }
                  })}
                  placeholder="G_VFAR_AllStaff, G_VFAR_Excom_Ops..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              {/* VPN Toggles */}
              <div className="pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Remote VPN Access</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/70 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.vpn.minorVpn}
                      onChange={(e) => setFormData({
                        ...formData,
                        vpn: { ...formData.vpn, minorVpn: e.target.checked }
                      })}
                      className="rounded border-slate-300 bg-white text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block">Minor Corporate VPN</span>
                      <span className="text-[11px] text-slate-500">Global Palo Alto GlobalProtect gateway</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/70 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.vpn.vfarLocalVpn}
                      onChange={(e) => setFormData({
                        ...formData,
                        vpn: { ...formData.vpn, vfarLocalVpn: e.target.checked }
                      })}
                      className="rounded border-slate-300 bg-white text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block">VFAR Local Island VPN (Avani+ Fares)</span>
                      <span className="text-[11px] text-slate-500">Avani+ Fares Baa Atoll firewall & on-island gateway</span>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    VPN Routing & Policy Remarks
                  </label>
                  <input
                    type="text"
                    value={formData.vpn.remarks}
                    onChange={(e) => setFormData({
                      ...formData,
                      vpn: { ...formData.vpn, remarks: e.target.value }
                    })}
                    placeholder="Remote night audit access, restricted subnet..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Core PMS & ERP Systems */}
          {activeTab === 'systems' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-xs">
                Toggle access and specify operational privileges, cashier IDs, or operator roles for hospitality core systems.
              </p>

              <div className="space-y-3">
                {[
                  { key: 'operaCloud', label: 'Opera Cloud PMS', desc: 'Hotel Property Management System, Cashiering & Reservations' },
                  { key: 'microsSimphony', label: 'Micros Simphony POS', desc: 'F&B Point-of-Sale, Revenue Centers & Kitchen Display' },
                  { key: 'oracleFusion', label: 'Oracle Fusion ERP / HCM', desc: 'Financials, General Ledger, Procurement & HR' },
                  { key: 'zenoti', label: 'Zenoti Spa & Wellness', desc: 'Spa Booking, Rosters & Product Inventory' },
                  { key: 'messageBox', label: 'MessageBox Work Orders', desc: 'Guest Request Management & Engineering Tickets' },
                  { key: 'tableCheck', label: 'TableCheck Dining', desc: 'Restaurant Reservations & Guest Seating Management' },
                  { key: 'minorHotelsApp', label: 'Minor Hotels App / Discovery', desc: 'GHA Loyalty & Guest Mobile Experience' },
                ].map((sys) => {
                  const sysKey = sys.key as keyof TeamMemberRecord['systems'];
                  const current = formData.systems[sysKey];

                  return (
                    <div 
                      key={sys.key}
                      className={`p-3 rounded-xl border transition-colors ${
                        current.assigned 
                          ? 'bg-blue-50/50 border-blue-300' 
                          : 'bg-slate-50/60 border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={current.assigned}
                            onChange={(e) => setFormData({
                              ...formData,
                              systems: {
                                ...formData.systems,
                                [sysKey]: { ...current, assigned: e.target.checked }
                              }
                            })}
                            className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">{sys.label}</span>
                            <span className="text-[11px] text-slate-500">{sys.desc}</span>
                          </div>
                        </label>

                        {current.assigned && (
                          <input
                            type="text"
                            value={current.remarks}
                            onChange={(e) => setFormData({
                              ...formData,
                              systems: {
                                ...formData.systems,
                                [sysKey]: { ...current, remarks: e.target.value }
                              }
                            })}
                            placeholder="Role / Cashier ID / Privileges..."
                            className="sm:w-80 px-2.5 py-1 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: Security, Creative & Telephony */}
          {activeTab === 'securityPhone' && (
            <div className="space-y-5">
              
              {/* Creative Suites */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Productivity & Creative Suites</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.creativeProductivity.adobeAcrobat.assigned}
                      onChange={(e) => setFormData({
                        ...formData,
                        creativeProductivity: {
                          ...formData.creativeProductivity,
                          adobeAcrobat: { ...formData.creativeProductivity.adobeAcrobat, assigned: e.target.checked }
                        }
                      })}
                      className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block">Adobe Acrobat Pro</span>
                      <span className="text-[11px] text-slate-500">PDF editing & digital signatures</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.creativeProductivity.adobeCc.assigned}
                      onChange={(e) => setFormData({
                        ...formData,
                        creativeProductivity: {
                          ...formData.creativeProductivity,
                          adobeCc: { ...formData.creativeProductivity.adobeCc, assigned: e.target.checked }
                        }
                      })}
                      className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block">Adobe Creative Cloud (All Apps)</span>
                      <span className="text-[11px] text-slate-500">Marketing & graphics suite</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* ASSA ABLOY Visionline Door Security */}
              <div className="pt-3 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Security & Keycard Management</h4>
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.security.visionline.assigned}
                      onChange={(e) => setFormData({
                        ...formData,
                        security: {
                          ...formData.security,
                          visionline: { ...formData.security.visionline, assigned: e.target.checked }
                        }
                      })}
                      className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block">Visionline RFID Door Lock Encoder</span>
                      <span className="text-[11px] text-slate-500">Ability to cut guest keycards, master cards, or lock maintenance tools</span>
                    </div>
                  </label>

                  {formData.security.visionline.assigned && (
                    <div className="pl-6 pt-1">
                      <label className="block text-slate-600 text-[11px] mb-1">Keycard Clearance Level / Remarks</label>
                      <input
                        type="text"
                        value={formData.security.visionline.remarks}
                        onChange={(e) => setFormData({
                          ...formData,
                          security: {
                            ...formData.security,
                            visionline: { ...formData.security.visionline, remarks: e.target.value }
                          }
                        })}
                        placeholder="Master level 2, Housekeeping Section A..."
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Telephony & Mobile */}
              <div className="pt-3 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Telephony & Mobile Device</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Company Number / Extension
                    </label>
                    <input
                      type="text"
                      value={formData.telephony.companyNumber}
                      onChange={(e) => setFormData({
                        ...formData,
                        telephony: { ...formData.telephony, companyNumber: e.target.value }
                      })}
                      placeholder="+960 664-4100 Ext 8112"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Phone Hardware Model
                    </label>
                    <input
                      type="text"
                      value={formData.telephony.companyPhoneModel}
                      onChange={(e) => setFormData({
                        ...formData,
                        telephony: { ...formData.telephony, companyPhoneModel: e.target.value }
                      })}
                      placeholder="e.g. Cisco IP 8841 / iPhone 15"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Telephony Remarks
                    </label>
                    <input
                      type="text"
                      value={formData.telephony.remarks}
                      onChange={(e) => setFormData({
                        ...formData,
                        telephony: { ...formData.telephony, remarks: e.target.value }
                      })}
                      placeholder="Roaming package, speed dial, on-call rotation..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{member ? 'Save Changes' : 'Create Record'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>

      {/* QR Details Modal */}
      <HardwareQRModal
        isOpen={Boolean(viewingQRItem)}
        item={viewingQRItem}
        assignedMember={formData}
        onClose={() => setViewingQRItem(null)}
      />

    </div>
  );
};
