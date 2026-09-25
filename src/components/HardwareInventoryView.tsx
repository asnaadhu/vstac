import React, { useState } from 'react';
import { 
  Laptop, 
  Smartphone, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  QrCode, 
  Edit2, 
  Check, 
  X, 
  HardDrive,
  Plus,
  UserCheck,
  RotateCcw,
  Monitor,
  Tablet,
  Store,
  Trash2,
  SlidersHorizontal,
  Building2,
  Box,
  Layers,
  Wrench,
  Camera,
  Eye
} from 'lucide-react';
import { TeamMemberRecord, HardwareItem, DeviceCategory, HardwareStatus, HardwareCondition } from '../types';
import { HardwareQRModal } from './HardwareQRModal';
import { QRScannerModal } from './QRScannerModal';

interface HardwareInventoryViewProps {
  members: TeamMemberRecord[];
  hardwareInventory: HardwareItem[];
  onAssignHardware: (hardwareId: string, memberId: string, remarks?: string) => void;
  onUnassignHardware: (hardwareId: string) => void;
  onAddHardware: (newItem: HardwareItem, assignToMemberId?: string) => void;
  onUpdateHardwareItem: (item: HardwareItem) => void;
  onDeleteHardwareItem: (hardwareId: string) => void;
  onSelectMember: (member: TeamMemberRecord) => void;
  onViewHardwareDetails?: (item: HardwareItem) => void;
}

export const HardwareInventoryView: React.FC<HardwareInventoryViewProps> = ({
  members,
  hardwareInventory,
  onAssignHardware,
  onUnassignHardware,
  onAddHardware,
  onUpdateHardwareItem,
  onDeleteHardwareItem,
  onSelectMember,
  onViewHardwareDetails
}) => {
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState<'all' | 'available' | 'assigned' | 'maintenance'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal states
  const [assigningItem, setAssigningItem] = useState<HardwareItem | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [assignmentRemarks, setAssignmentRemarks] = useState('');

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HardwareItem | null>(null);

  // QR Modal and Scanner states
  const [qrModalItem, setQrModalItem] = useState<HardwareItem | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Centralized handler for viewing part details
  const handleViewItemDetails = (item: HardwareItem) => {
    if (onViewHardwareDetails) {
      onViewHardwareDetails(item);
    } else {
      setQrModalItem(item);
    }
  };

  // Form states for Add / Edit
  const [formModel, setFormModel] = useState('');
  const [formCategory, setFormCategory] = useState<DeviceCategory>('Laptop');
  const [formSerial, setFormSerial] = useState('');
  const [formTag, setFormTag] = useState('');
  const [formSpecs, setFormSpecs] = useState('');
  const [formCondition, setFormCondition] = useState<HardwareCondition>('Brand New');
  const [formStatus, setFormStatus] = useState<HardwareStatus>('Available');
  const [formAssignToMemberId, setFormAssignToMemberId] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Filtering
  const filtered = hardwareInventory.filter(item => {
    // Status filter
    if (statusTab === 'available' && item.status !== 'Available') return false;
    if (statusTab === 'assigned' && item.status !== 'Assigned') return false;
    if (statusTab === 'maintenance' && item.status !== 'Maintenance') return false;

    // Category filter
    if (categoryFilter !== 'all' && item.deviceCategory !== categoryFilter) return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = 
        item.assetTag.toLowerCase().includes(q) ||
        item.deviceModel.toLowerCase().includes(q) ||
        item.serialNumber.toLowerCase().includes(q) ||
        (item.specifications && item.specifications.toLowerCase().includes(q)) ||
        (item.assignedMemberName && item.assignedMemberName.toLowerCase().includes(q)) ||
        (item.assignedDepartment && item.assignedDepartment.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  // Metrics
  const totalCount = hardwareInventory.length;
  const availableCount = hardwareInventory.filter(h => h.status === 'Available').length;
  const assignedCount = hardwareInventory.filter(h => h.status === 'Assigned').length;
  const maintenanceCount = hardwareInventory.filter(h => h.status === 'Maintenance').length;

  const getCategoryIcon = (cat: DeviceCategory) => {
    switch (cat) {
      case 'Laptop': return <Laptop className="w-4 h-4 text-blue-600" />;
      case 'Desktop': 
      case 'Workstation': return <Monitor className="w-4 h-4 text-cyan-600" />;
      case 'Tablet': return <Tablet className="w-4 h-4 text-emerald-600" />;
      case 'POS Terminal': return <Store className="w-4 h-4 text-teal-600" />;
      case 'Mobile Phone': return <Smartphone className="w-4 h-4 text-sky-600" />;
      default: return <HardDrive className="w-4 h-4 text-slate-500" />;
    }
  };

  // Open Assign Modal
  const handleOpenAssignModal = (item: HardwareItem) => {
    setAssigningItem(item);
    setSelectedMemberId('');
    setAssignmentRemarks(item.notes || 'Assigned from VFAR IT stock pool');
  };

  // Confirm Assignment
  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningItem || !selectedMemberId) return;

    onAssignHardware(assigningItem.id, selectedMemberId, assignmentRemarks);
    setAssigningItem(null);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormModel('');
    setFormCategory('Laptop');
    setFormSerial('');
    setFormTag(`VFAR-IT-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormSpecs('');
    setFormCondition('Brand New');
    setFormStatus('Available');
    setFormAssignToMemberId('');
    setFormNotes('IT Stock Room Rack A');
    setIsAddEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: HardwareItem) => {
    setEditingItem(item);
    setFormModel(item.deviceModel);
    setFormCategory(item.deviceCategory);
    setFormSerial(item.serialNumber);
    setFormTag(item.assetTag);
    setFormSpecs(item.specifications);
    setFormCondition(item.condition);
    setFormStatus(item.status);
    setFormAssignToMemberId(item.assignedMemberId || '');
    setFormNotes(item.notes || '');
    setIsAddEditModalOpen(true);
  };

  // Save Add/Edit
  const handleSaveAddEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formModel.trim()) return;

    const targetTag = formTag.trim() || `VFAR-IT-${Math.floor(1000 + Math.random() * 9000)}`;

    if (editingItem) {
      const updated: HardwareItem = {
        ...editingItem,
        deviceModel: formModel.trim(),
        deviceCategory: formCategory,
        serialNumber: formSerial.trim(),
        assetTag: targetTag,
        specifications: formSpecs.trim(),
        condition: formCondition,
        status: formStatus,
        notes: formNotes.trim(),
        updatedAt: new Date().toISOString()
      };
      onUpdateHardwareItem(updated);
    } else {
      const newItem: HardwareItem = {
        id: `hw-${Date.now()}`,
        assetTag: targetTag,
        deviceModel: formModel.trim(),
        deviceCategory: formCategory,
        serialNumber: formSerial.trim(),
        specifications: formSpecs.trim(),
        status: formAssignToMemberId ? 'Assigned' : formStatus,
        assignedMemberId: formAssignToMemberId || null,
        assignedMemberName: formAssignToMemberId ? (members.find(m => m.id === formAssignToMemberId)?.employeeName || null) : null,
        assignedDepartment: formAssignToMemberId ? (members.find(m => m.id === formAssignToMemberId)?.department || null) : null,
        condition: formCondition,
        notes: formNotes.trim(),
        purchaseDate: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString()
      };
      onAddHardware(newItem, formAssignToMemberId || undefined);
      // Immediately open QR Code details modal & update URL query routing for the newly registered hardware
      handleViewItemDetails(newItem);
    }

    setIsAddEditModalOpen(false);
  };

  return (
    <div className="space-y-5">
      
      {/* 1. Fleet Operations Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold shadow-xs ring-1 ring-blue-400/30">
              <Box className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                  VFAR FLEET
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Avani+ Fares Maldives Resort
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                Hardware & Fleet Inventory Management
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Centralized equipment pool. Assign in-stock laptops, POS terminals, and tablets to resort team members or return decommissioned assets to stock.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-all"
              title="Scan QR Code with camera or lookup tag"
            >
              <Camera className="w-4 h-4 text-blue-700" />
              <span>Scan / Lookup QR</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Register New Device</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div 
          onClick={() => setStatusTab('all')}
          className={`cursor-pointer bg-white border rounded-xl p-4 shadow-sm transition-all ${
            statusTab === 'all' ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-slate-600" /> Total Fleet Devices
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{totalCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Laptops, desktops, POS & tablets</div>
        </div>

        <div 
          onClick={() => setStatusTab('available')}
          className={`cursor-pointer bg-white border rounded-xl p-4 shadow-sm transition-all ${
            statusTab === 'available' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Available in Stock
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono">{availableCount}</div>
          <div className="text-[11px] text-emerald-800/80 mt-1 font-medium">Ready for immediate assignment</div>
        </div>

        <div 
          onClick={() => setStatusTab('assigned')}
          className={`cursor-pointer bg-white border rounded-xl p-4 shadow-sm transition-all ${
            statusTab === 'assigned' ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-blue-700 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Assigned to Personnel
          </div>
          <div className="text-2xl font-bold text-blue-700 font-mono">{assignedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Active team member custody</div>
        </div>

        <div 
          onClick={() => setStatusTab('maintenance')}
          className={`cursor-pointer bg-white border rounded-xl p-4 shadow-sm transition-all ${
            statusTab === 'maintenance' ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-blue-700 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-blue-600" /> Under Maintenance
          </div>
          <div className="text-2xl font-bold text-blue-700 font-mono">{maintenanceCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Repairs, testing & parts order</div>
        </div>
      </div>

      {/* 3. Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs overflow-x-auto">
            <button
              onClick={() => setStatusTab('all')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors whitespace-nowrap ${
                statusTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Devices ({totalCount})
            </button>
            <button
              onClick={() => setStatusTab('available')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                statusTab === 'available' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Available in Stock ({availableCount})
            </button>
            <button
              onClick={() => setStatusTab('assigned')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                statusTab === 'assigned' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Assigned ({assignedCount})
            </button>
            <button
              onClick={() => setStatusTab('maintenance')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                statusTab === 'maintenance' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Maintenance ({maintenanceCount})
            </button>
          </div>

          {/* Search & Category */}
          <div className="flex items-center gap-2.5 flex-1 max-w-lg justify-end">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search asset tag, model, serial, staff..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="all">All Categories</option>
              <option value="Laptop">Laptops</option>
              <option value="Desktop">Desktops</option>
              <option value="Tablet">Tablets</option>
              <option value="POS Terminal">POS Terminals</option>
              <option value="Mobile Phone">Mobile Phones</option>
              <option value="Workstation">Workstations</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Hardware Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 select-none">
              <tr>
                <th className="py-3 px-3.5 font-semibold text-slate-700">Asset Tag</th>
                <th className="py-3 px-3.5 font-semibold text-slate-700">Device Model & Category</th>
                <th className="py-3 px-3.5 font-semibold text-slate-700">Serial Number (S/N)</th>
                <th className="py-3 px-3.5 font-semibold text-slate-700">Inventory Status & Custody</th>
                <th className="py-3 px-3.5 font-semibold text-slate-700">Condition</th>
                <th className="py-3 px-3.5 font-semibold text-slate-700 text-right">Assignment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Box className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-semibold text-slate-600">No hardware found matching criteria</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try clearing filters or register a new device to the fleet.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const assignedMember = item.assignedMemberId ? members.find(m => m.id === item.assignedMemberId) : null;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Asset Tag */}
                      <td className="py-3 px-3.5">
                        <button
                          type="button"
                          onClick={() => handleViewItemDetails(item)}
                          className="flex items-center gap-1.5 font-mono font-bold text-blue-800 hover:text-blue-950 hover:bg-blue-100/70 px-2 py-1 rounded-lg border border-blue-200/80 transition-colors group cursor-pointer"
                          title="Click to view QR Code sticker & full hardware details (deep link URL ?part=ID)"
                        >
                          <QrCode className="w-3.5 h-3.5 text-blue-700 group-hover:scale-110 transition-transform" />
                          <span>{item.assetTag}</span>
                        </button>
                      </td>

                      {/* Device & Category */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-start gap-2">
                          <div className="p-1.5 bg-slate-100 rounded-lg shrink-0 mt-0.5">
                            {getCategoryIcon(item.deviceCategory)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-2">
                              <span>{item.deviceModel}</span>
                              <span className="text-[10px] font-medium text-slate-500 px-1.5 py-0.2 bg-slate-100 rounded">
                                {item.deviceCategory}
                              </span>
                            </div>
                            {item.specifications && (
                              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                                {item.specifications}
                              </div>
                            )}
                            {item.notes && (
                              <div className="text-[10px] text-slate-400 mt-0.5 italic">
                                {item.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Serial Number */}
                      <td className="py-3 px-3.5 font-mono text-slate-800">
                        {item.serialNumber || '—'}
                      </td>

                      {/* Inventory Status & Custody */}
                      <td className="py-3 px-3.5">
                        {item.status === 'Assigned' ? (
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              {assignedMember ? (
                                <button
                                  type="button"
                                  onClick={() => onSelectMember(assignedMember)}
                                  className="font-bold text-slate-900 hover:text-blue-800 transition-colors text-left"
                                >
                                  {item.assignedMemberName || assignedMember.employeeName}
                                </button>
                              ) : (
                                <span className="font-bold text-slate-900">
                                  {item.assignedMemberName || 'Staff Member'}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 pl-3.5">
                              {assignedMember?.jobTitle || item.assignedDepartment || 'Staff'} · {item.assignedDepartment || 'Resort Operations'}
                            </div>
                          </div>
                        ) : item.status === 'Available' ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Available in IT Stock</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span>Under Repair / Testing</span>
                          </div>
                        )}
                      </td>

                      {/* Condition */}
                      <td className="py-3 px-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          item.condition === 'Brand New' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : item.condition === 'Good' 
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : item.condition === 'Fair'
                            ? 'bg-slate-100 text-slate-700 border-slate-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {item.condition}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === 'Available' ? (
                            <button
                              onClick={() => handleOpenAssignModal(item)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                              title="Assign this hardware device to a resort team member"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Assign to Staff</span>
                            </button>
                          ) : item.status === 'Assigned' ? (
                            <button
                              onClick={() => onUnassignHardware(item.id)}
                              className="px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                              title="Return device back to available IT stock"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Return to Stock</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onUpdateHardwareItem({ ...item, status: 'Available' })}
                              className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                            >
                              Mark Ready
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleViewItemDetails(item)}
                            className="p-1.5 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                            title="View QR Code & Full Details (?part=ID)"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                            title="Edit Device Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Decommission / remove ${item.assetTag} (${item.deviceModel}) from inventory?`)) {
                                onDeleteHardwareItem(item.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Delete / Decommission"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      </div>

      {/* 5. MODAL: Assign Hardware to Team Member */}
      {assigningItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
            
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Assign Hardware to Team Member
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Avani+ Fares Maldives IT Equipment Assignment
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setAssigningItem(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAssignment} className="p-5 space-y-4">
              
              {/* Selected Hardware Summary */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {assigningItem.deviceModel}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-900 border border-blue-300">
                    {assigningItem.assetTag}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  S/N: {assigningItem.serialNumber || 'N/A'} · Category: {assigningItem.deviceCategory}
                </div>
                {assigningItem.specifications && (
                  <div className="text-[11px] text-slate-600">
                    Specs: {assigningItem.specifications}
                  </div>
                )}
              </div>

              {/* Select Team Member */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Select Team Member to Receive Hardware <span className="text-blue-600">*</span>
                </label>
                <select
                  required
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="">-- Choose active resort team member --</option>
                  {members
                    .filter(m => m.status !== 'Offboarded')
                    .map(m => {
                      const alreadyHasHardware = m.hardware.length > 0;
                      return (
                        <option key={m.id} value={m.id}>
                          {m.employeeName} ({m.jobTitle} · {m.department}) {alreadyHasHardware ? `[Has ${m.hardware.length} device(s)]` : '[No hardware currently]'}
                        </option>
                      );
                    })}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Assigning this equipment will automatically update the member's profile and asset inventory records.
                </p>
              </div>

              {/* Assignment Notes & Accessories */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Handover Remarks & Accessories
                </label>
                <textarea
                  rows={2}
                  value={assignmentRemarks}
                  onChange={(e) => setAssignmentRemarks(e.target.value)}
                  placeholder="Includes 65W USB-C charger, laptop bag, wireless mouse, HDMI adapter..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssigningItem(null)}
                  className="px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedMemberId}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-xs"
                >
                  Confirm Hardware Assignment
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 6. MODAL: Register New Device / Edit Fleet Device */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
            
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingItem ? 'Edit Fleet Equipment' : 'Register New Device to Fleet'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Avani+ Fares Maldives Resort IT Inventory
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddEdit} className="p-5 space-y-3.5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Device Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as DeviceCategory)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop / Tiny PC</option>
                    <option value="Tablet">Tablet / iPad</option>
                    <option value="POS Terminal">POS Terminal</option>
                    <option value="Mobile Phone">Mobile Phone</option>
                    <option value="Workstation">Workstation</option>
                    <option value="Other">Other Peripheral</option>
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Physical Condition
                  </label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as HardwareCondition)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Good">Good / Working</option>
                    <option value="Fair">Fair / Minor wear</option>
                    <option value="Under Repair">Under Repair</option>
                  </select>
                </div>
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Device Model Name *
                </label>
                <input
                  type="text"
                  required
                  value={formModel}
                  onChange={(e) => setFormModel(e.target.value)}
                  placeholder="e.g. Lenovo ThinkPad T14s Gen 4"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Serial */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Serial Number (S/N)
                  </label>
                  <input
                    type="text"
                    value={formSerial}
                    onChange={(e) => setFormSerial(e.target.value)}
                    placeholder="e.g. PF-VFAR-XXXX"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                {/* Asset Tag */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Asset Tag (VFAR-IT-XXXX)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={formTag}
                      onChange={(e) => setFormTag(e.target.value)}
                      placeholder="e.g. VFAR-IT-0110"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-blue-800 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <button
                      type="button"
                      onClick={() => setFormTag(`VFAR-IT-${Math.floor(1000 + Math.random() * 9000)}`)}
                      className="px-2 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-lg font-mono"
                      title="Auto-generate tag"
                    >
                      Gen
                    </button>
                  </div>
                </div>
              </div>

              {/* Specs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specifications (Processor, RAM, Storage, OS)
                </label>
                <input
                  type="text"
                  value={formSpecs}
                  onChange={(e) => setFormSpecs(e.target.value)}
                  placeholder="e.g. Intel Core i7-1365U, 16GB RAM, 512GB SSD"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              {!editingItem && (
                /* Immediate Assignment Option */
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assign Immediately to Team Member (Optional)
                  </label>
                  <select
                    value={formAssignToMemberId}
                    onChange={(e) => setFormAssignToMemberId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="">-- Leave in available IT stock --</option>
                    {members
                      .filter(m => m.status !== 'Offboarded')
                      .map(m => (
                        <option key={m.id} value={m.id}>
                          {m.employeeName} ({m.jobTitle} · {m.department})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Storage Location & Remarks
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. IT Storage Cabinet A, shelf 2"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formModel.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-xs"
                >
                  {editingItem ? 'Save Changes' : 'Register Equipment'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 7. MODAL: Hardware QR Asset Details & Sticker Modal (Fallback if not handled centrally by parent) */}
      {!onViewHardwareDetails && (
        <HardwareQRModal
          isOpen={Boolean(qrModalItem)}
          item={qrModalItem}
          assignedMember={qrModalItem?.assignedMemberId ? (members.find(m => m.id === qrModalItem.assignedMemberId) || null) : null}
          onClose={() => setQrModalItem(null)}
          onAssign={(item) => handleOpenAssignModal(item)}
          onUnassign={(hwId) => onUnassignHardware(hwId)}
          onSelectMember={onSelectMember}
        />
      )}

      {/* 8. MODAL: QR Scanner / Lookup */}
      <QRScannerModal
        isOpen={isScannerOpen}
        hardwareInventory={hardwareInventory}
        onClose={() => setIsScannerOpen(false)}
        onSelectHardware={(item) => handleViewItemDetails(item)}
      />

    </div>
  );
};
