import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Edit3, 
  Building2, 
  Mail, 
  Laptop, 
  Shield, 
  Wifi, 
  Server, 
  KeyRound, 
  Phone, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Layers,
  FileText,
  QrCode
} from 'lucide-react';
import { TeamMemberRecord } from '../types';

interface MemberDetailDrawerProps {
  member: TeamMemberRecord | null;
  onClose: () => void;
  onEdit: (member: TeamMemberRecord) => void;
  onToggleStatus: (member: TeamMemberRecord) => void;
  onViewHardwareQR?: (assetTag: string) => void;
  onViewMemberQR?: (member: TeamMemberRecord) => void;
}

export const MemberDetailDrawer: React.FC<MemberDetailDrawerProps> = ({
  member,
  onClose,
  onEdit,
  onToggleStatus,
  onViewHardwareQR,
  onViewMemberQR
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!member) return null;

  const deepLinkUrl = `${window.location.origin}${window.location.pathname}?tab=directory&member=${encodeURIComponent(member.id)}`;

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Status styling
  let statusDot = 'bg-emerald-500';
  let statusTextColor = 'text-emerald-700';
  if (member.status === 'Onboarding') {
    statusDot = 'bg-amber-500 animate-pulse';
    statusTextColor = 'text-amber-700';
  } else if (member.status === 'Offboarded') {
    statusDot = 'bg-slate-400';
    statusTextColor = 'text-slate-500';
  } else if (member.status === 'Suspended') {
    statusDot = 'bg-rose-500';
    statusTextColor = 'text-rose-700';
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white border-l border-slate-200 h-full overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${statusDot}`}></span>
                <span className={`text-xs font-bold uppercase tracking-wider ${statusTextColor}`}>
                  {member.status}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-mono">ID: {member.id}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {member.employeeName}
              </h2>
              <p className="text-xs text-amber-800 font-medium mt-0.5">
                {member.jobTitle} · <span className="text-slate-600">{member.department}</span>
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {member.propertyOrLocation}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onViewMemberQR && (
                <button
                  type="button"
                  onClick={() => onViewMemberQR(member)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg shadow-2xs transition-colors"
                  title="View / Print Digital Staff QR Pass"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-700" />
                  <span>QR Pass</span>
                </button>
              )}
              <button
                onClick={() => onEdit(member)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-2xs transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Copy Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100">
            {/* Direct Deep Link Copy */}
            <button
              onClick={() => copyToClipboard(deepLinkUrl, 'deeplink')}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono bg-amber-50/80 hover:bg-amber-100 border border-amber-200 rounded text-amber-900 font-semibold transition-colors"
              title="Copy direct deep link URL (?member=ID)"
            >
              {copiedKey === 'deeplink' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-amber-600" />}
              <span>Link: ?member={member.id}</span>
            </button>
            {member.email.address && (
              <button
                onClick={() => copyToClipboard(member.email.address, 'email')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 transition-colors"
                title="Copy Email"
              >
                {copiedKey === 'email' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                <span>{member.email.address}</span>
              </button>
            )}

            {member.activeDirectory.username && (
              <button
                onClick={() => copyToClipboard(member.activeDirectory.username, 'ad')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 transition-colors"
                title="Copy AD Username"
              >
                {copiedKey === 'ad' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                <span>AD: {member.activeDirectory.username}</span>
              </button>
            )}

            {member.hardware.assetTag && (
              <button
                onClick={() => copyToClipboard(member.hardware.assetTag, 'asset')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded text-amber-900 font-semibold transition-colors"
                title="Copy Asset Tag"
              >
                {copiedKey === 'asset' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-amber-600" />}
                <span>Tag: {member.hardware.assetTag}</span>
              </button>
            )}
          </div>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-6 flex-1 text-xs">
          
          {/* Section 1: Email Address & Identity */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-sky-600" /> 1. Email Address & Identity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <div className="text-slate-500 text-[11px]">Primary Email Address</div>
                <div className="text-slate-900 font-mono font-medium mt-0.5">
                  {member.email.address || '—'}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">M365 License Type</div>
                <div className="text-sky-700 font-bold mt-0.5">
                  {member.email.licenseType}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Leaders Distribution List (DL)</div>
                <div className="flex items-center gap-1.5 mt-0.5 font-medium">
                  {member.email.leadersDL ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Not Enrolled
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Department Head (DH) DL</div>
                <div className="flex items-center gap-1.5 mt-0.5 font-medium">
                  {member.email.dhDL ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Not Enrolled
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Functional Account MFA</div>
                <div className="flex items-center gap-1.5 mt-0.5 font-medium">
                  {member.email.functionalAccountMfa ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" /> Enforced & Active
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Standard MFA
                    </span>
                  )}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-slate-500 text-[11px]">Email Remarks / Delegations</div>
                <div className="text-slate-700 mt-0.5 italic">
                  {member.email.remarks || 'None'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Hardware & Device */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Laptop className="w-4 h-4 text-amber-600" /> 2. Hardware & Fleet Device
              </h3>
              {member.hardware.assetTag && onViewHardwareQR && (
                <button
                  type="button"
                  onClick={() => onViewHardwareQR(member.hardware.assetTag)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg border border-amber-300 transition-colors shadow-2xs"
                  title="View full QR sticker, printable label & equipment details"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-800" />
                  <span>View QR Sticker</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <div className="text-slate-500 text-[11px]">PC / Laptop Model</div>
                <div className="text-slate-900 font-medium mt-0.5">
                  {member.hardware.pcLaptopModel || '—'}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Serial Number (S/N)</div>
                <div className="text-slate-900 font-mono font-medium mt-0.5">
                  {member.hardware.serialNumber || '—'}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Asset Tag</div>
                <div className="text-amber-800 font-mono font-bold mt-0.5">
                  {member.hardware.assetTag || 'Untagged'}
                </div>
              </div>
              <div className="sm:col-span-3">
                <div className="text-slate-500 text-[11px]">Hardware Remarks</div>
                <div className="text-slate-700 mt-0.5 italic">
                  {member.hardware.remarks || 'None'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 & 4: Active Directory & Remote Connectivity (VPN) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-emerald-600" /> 3. Active Directory
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-slate-500 text-[11px]">AD Username</div>
                  <div className="text-slate-900 font-mono font-medium mt-0.5">
                    {member.activeDirectory.username || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Organizational Unit (OU)</div>
                  <div className="text-slate-700 font-mono text-[10px] break-all mt-0.5">
                    {member.activeDirectory.ouGroup || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">AD Remarks</div>
                  <div className="text-slate-600 text-[11px] italic">
                    {member.activeDirectory.remarks || 'None'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-2 mb-3">
                <Wifi className="w-4 h-4 text-sky-600" /> 4. Remote VPN
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Minor Corporate VPN</span>
                  {member.vpn.minorVpn ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                    </span>
                  ) : (
                    <span className="text-slate-400">Disabled</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">VFAR Island Gateway (Avani+ Fares)</span>
                  {member.vpn.vfarLocalVpn ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                    </span>
                  ) : (
                    <span className="text-slate-400">Disabled</span>
                  )}
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">VPN Remarks</div>
                  <div className="text-slate-600 text-[11px] italic">
                    {member.vpn.remarks || 'Standard gateway'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Enterprise Core & PMS Systems */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-2 mb-3">
              <Server className="w-4 h-4 text-amber-600" /> 5. Enterprise Core & PMS Systems
            </h3>
            
            <div className="space-y-2.5">
              {[
                { name: 'Opera Cloud PMS', data: member.systems.operaCloud, badge: 'PMS' },
                { name: 'Micros Simphony', data: member.systems.microsSimphony, badge: 'POS' },
                { name: 'Oracle Fusion ERP/HCM', data: member.systems.oracleFusion, badge: 'ERP' },
                { name: 'Zenoti Spa & Wellness', data: member.systems.zenoti, badge: 'Spa' },
                { name: 'MessageBox Work Orders', data: member.systems.messageBox, badge: 'Ops' },
                { name: 'TableCheck Reservations', data: member.systems.tableCheck, badge: 'F&B' },
                { name: 'Minor Hotels App / Discovery', data: member.systems.minorHotelsApp, badge: 'Guest' },
              ].map((sys, idx) => (
                <div 
                  key={idx} 
                  className={`p-2.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    sys.data.assigned 
                      ? 'bg-white border-slate-200 shadow-2xs' 
                      : 'bg-slate-100/50 border-slate-200/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {sys.badge}
                    </span>
                    <span className={`font-semibold ${sys.data.assigned ? 'text-slate-900' : 'text-slate-500'}`}>
                      {sys.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {sys.data.remarks && (
                      <span className="text-[11px] text-slate-600 max-w-xs truncate" title={sys.data.remarks}>
                        {sys.data.remarks}
                      </span>
                    )}
                    <span className="shrink-0 font-medium">
                      {sys.data.assigned ? (
                        <span className="text-emerald-700 flex items-center gap-1 text-[11px] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Assigned
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Unassigned</span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6, 7 & 8: Creative, Security & Telephony */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* 6. Creative */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-2.5">
                <Layers className="w-3.5 h-3.5 text-purple-600" /> 6. Creative Suites
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Adobe Acrobat</span>
                  {member.creativeProductivity.adobeAcrobat.assigned ? (
                    <span className="text-emerald-700 font-semibold">Assigned</span>
                  ) : (
                    <span className="text-slate-400">None</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Adobe CC</span>
                  {member.creativeProductivity.adobeCc.assigned ? (
                    <span className="text-emerald-700 font-semibold">Assigned</span>
                  ) : (
                    <span className="text-slate-400">None</span>
                  )}
                </div>
              </div>
            </div>

            {/* 7. Security */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-2.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-600" /> 7. Key Management
              </h3>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Visionline RFID Door Lock</span>
                  {member.security.visionline.assigned ? (
                    <span className="text-emerald-700 font-semibold">Active Key</span>
                  ) : (
                    <span className="text-slate-400">None</span>
                  )}
                </div>
                {member.security.visionline.remarks && (
                  <div className="text-[11px] text-slate-600 mt-2 italic">
                    {member.security.visionline.remarks}
                  </div>
                )}
              </div>
            </div>

            {/* 8. Telephony */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-2.5">
                <Phone className="w-3.5 h-3.5 text-sky-600" /> 8. Telephony & Mobile
              </h3>
              <div className="space-y-1.5">
                <div className="text-slate-900 font-mono text-[11px]">
                  {member.telephony.companyNumber || 'No company number'}
                </div>
                <div className="text-slate-600 text-[11px]">
                  {member.telephony.companyPhoneModel || 'No hardware'}
                </div>
                {member.telephony.remarks && (
                  <div className="text-[11px] text-slate-500 italic mt-1">
                    {member.telephony.remarks}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Section 9: Overall Notes & Timestamps */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-slate-500" /> 9. General Remarks & Operational Log
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {member.generalRemarks || 'No general operational remarks recorded.'}
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-3 pt-3 border-t border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Record Last Modified:</span>
              <span className="font-mono text-slate-700">
                {new Date(member.updatedAt).toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* Footer Quick Actions */}
        <div className="p-4 border-t border-slate-200 bg-white sticky bottom-0 z-10 flex items-center justify-between gap-3 shadow-xs">
          <button
            onClick={() => onToggleStatus(member)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
          >
            {member.status === 'Active' ? 'Transition to Offboarded' : 'Transition to Active'}
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(member)}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors"
            >
              Edit Member Details
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
