import React from 'react';
import { 
  Users, 
  Layers, 
  Server, 
  Laptop, 
  ShieldCheck, 
  KeyRound, 
  Wifi, 
  AlertTriangle 
} from 'lucide-react';
import { TeamMemberRecord, memberHasUntaggedHardware } from '../types';

interface StatsOverviewProps {
  members: TeamMemberRecord[];
  onFilterStatus?: (status: string) => void;
  onFilterMissingAsset?: () => void;
  onFilterVpn?: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  members,
  onFilterStatus,
  onFilterMissingAsset,
  onFilterVpn
}) => {
  const total = members.length;
  const active = members.filter(m => m.status === 'Active').length;
  const onboarding = members.filter(m => m.status === 'Onboarding').length;
  const offboarded = members.filter(m => m.status === 'Offboarded').length;

  const m365E5 = members.filter(m => m.email.licenseType === 'M365 E5' && m.status === 'Active').length;
  const m365E3 = members.filter(m => m.email.licenseType === 'M365 E3' && m.status === 'Active').length;
  const m365F3 = members.filter(m => m.email.licenseType === 'M365 F3' && m.status === 'Active').length;

  const operaCount = members.filter(m => m.systems.operaCloud.assigned && m.status === 'Active').length;
  const simphonyCount = members.filter(m => m.systems.microsSimphony.assigned && m.status === 'Active').length;
  const oracleCount = members.filter(m => m.systems.oracleFusion.assigned && m.status === 'Active').length;
  const zenotiCount = members.filter(m => m.systems.zenoti.assigned && m.status === 'Active').length;

  const taggedHardware = members.filter(m => m.hardware.length > 0 && m.hardware.every(h => h.assetTag) && m.status === 'Active').length;
  const missingAssetTag = members.filter(m => memberHasUntaggedHardware(m) && m.status === 'Active').length;

  const vpnCount = members.filter(m => (m.vpn.minorVpn || m.vpn.vfarLocalVpn) && m.status === 'Active').length;
  const visionlineCount = members.filter(m => m.security.visionline.assigned && m.status === 'Active').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Workforce Status */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-600" /> Personnel Roster
          </span>
          <span className="text-[11px] text-slate-400 font-mono">{total} total</span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-slate-900 font-mono">{active}</span>
          <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Staff
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <button 
            onClick={() => onFilterStatus && onFilterStatus('Onboarding')}
            className="hover:text-blue-800 transition-colors flex items-center gap-1 text-[11px]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>{onboarding} Onboarding</span>
          </button>
          <span className="text-slate-300">·</span>
          <button 
            onClick={() => onFilterStatus && onFilterStatus('Offboarded')}
            className="hover:text-slate-800 transition-colors flex items-center gap-1 text-[11px]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span>{offboarded} Offboarded</span>
          </button>
        </div>
      </div>

      {/* 2. M365 Licenses */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-600" /> Microsoft 365
          </span>
          <span className="text-[11px] text-sky-700 font-mono font-medium">{m365E5 + m365E3 + m365F3} in use</span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-slate-900 font-mono">{m365E5 + m365E3}</span>
          <span className="text-xs text-slate-500">E5 & E3 Enterprise</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100 font-mono text-[11px]">
          <div><span className="text-slate-400">E5:</span> <span className="text-slate-800 font-semibold">{m365E5}</span></div>
          <span className="text-slate-300">·</span>
          <div><span className="text-slate-400">E3:</span> <span className="text-slate-800 font-semibold">{m365E3}</span></div>
          <span className="text-slate-300">·</span>
          <div><span className="text-slate-400">F3:</span> <span className="text-slate-800 font-semibold">{m365F3}</span></div>
        </div>
      </div>

      {/* 3. Core Hospitality Systems */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-emerald-600" /> Hotel Systems
          </span>
          <span className="text-[11px] text-slate-400">PMS & POS</span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-slate-900 font-mono">{operaCount}</span>
          <span className="text-xs text-slate-500">Opera Cloud Seats</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100 text-[11px]">
          <span>Simphony: <strong className="text-slate-800 font-mono">{simphonyCount}</strong></span>
          <span className="text-slate-300">·</span>
          <span>Fusion: <strong className="text-slate-800 font-mono">{oracleCount}</strong></span>
          <span className="text-slate-300">·</span>
          <span>Zenoti: <strong className="text-slate-800 font-mono">{zenotiCount}</strong></span>
        </div>
      </div>

      {/* 4. Hardware & Security Governance */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Hardware & Security
          </span>
          {missingAssetTag > 0 ? (
            <button 
              onClick={onFilterMissingAsset}
              className="text-[11px] text-rose-700 font-medium hover:underline flex items-center gap-1"
            >
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              <span>{missingAssetTag} untagged</span>
            </button>
          ) : (
            <span className="text-[11px] text-emerald-700 font-medium">100% Tagged</span>
          )}
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-slate-900 font-mono">{taggedHardware}</span>
          <span className="text-xs text-slate-500">Tagged Devices</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100 text-[11px]">
          <button 
            onClick={onFilterVpn}
            className="hover:text-sky-800 transition-colors flex items-center gap-1"
          >
            <Wifi className="w-3 h-3 text-sky-600" />
            <span>VPN: <strong className="text-slate-800 font-mono">{vpnCount}</strong></span>
          </button>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-blue-600" />
            <span>Visionline: <strong className="text-slate-800 font-mono">{visionlineCount}</strong></span>
          </div>
        </div>
      </div>

    </div>
  );
};
