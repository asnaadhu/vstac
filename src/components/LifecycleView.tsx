import React, { useState } from 'react';
import { 
  UserCheck, 
  UserMinus, 
  CheckCircle2, 
  Circle, 
  ShieldAlert
} from 'lucide-react';
import { TeamMemberRecord } from '../types';

interface LifecycleViewProps {
  members: TeamMemberRecord[];
  onUpdateMember: (member: TeamMemberRecord) => void;
  onSelectMember: (member: TeamMemberRecord) => void;
}

export const LifecycleView: React.FC<LifecycleViewProps> = ({
  members,
  onUpdateMember,
  onSelectMember
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'onboarding' | 'offboarding'>('onboarding');

  const onboardingMembers = members.filter(m => m.status === 'Onboarding');
  const activeMembers = members.filter(m => m.status === 'Active');
  const offboardedMembers = members.filter(m => m.status === 'Offboarded');

  const getOnboardingTasks = (m: TeamMemberRecord) => [
    { 
      id: 'ad', 
      title: 'Active Directory Account & OU Provisioning', 
      completed: Boolean(m.activeDirectory.username && m.activeDirectory.ouGroup),
      desc: m.activeDirectory.username ? `Created: ${m.activeDirectory.username}` : 'Pending user creation'
    },
    { 
      id: 'm365', 
      title: 'M365 License & Email Mailbox Enrollment', 
      completed: m.email.licenseType !== 'None' && Boolean(m.email.address),
      desc: m.email.licenseType !== 'None' ? `${m.email.licenseType} (${m.email.address})` : 'License pending'
    },
    { 
      id: 'hardware', 
      title: 'Laptop Preparation, Asset Tag & Serial Log', 
      completed: Boolean(m.hardware.pcLaptopModel && m.hardware.assetTag),
      desc: m.hardware.assetTag ? `Tag: ${m.hardware.assetTag} (${m.hardware.pcLaptopModel})` : 'Hardware staging pending'
    },
    { 
      id: 'systems', 
      title: 'Hospitality PMS/POS Access (Opera / Simphony)', 
      completed: m.systems.operaCloud.assigned || m.systems.microsSimphony.assigned || m.systems.oracleFusion.assigned,
      desc: m.systems.operaCloud.assigned ? 'Opera Cloud assigned' : 'Systems configuration pending'
    },
    { 
      id: 'security', 
      title: 'Security, Visionline Keycard & VPN', 
      completed: m.security.visionline.assigned || m.vpn.minorVpn,
      desc: m.security.visionline.assigned ? 'Visionline encoder ready' : 'Keycard/VPN pending'
    }
  ];

  const getOffboardingTasks = (m: TeamMemberRecord) => [
    { 
      id: 'ad_disable', 
      title: 'Active Directory Disabled & Revoked', 
      completed: m.status === 'Offboarded' || m.activeDirectory.ouGroup.includes('Disabled'),
      desc: m.status === 'Offboarded' ? 'Account disabled' : 'Account active'
    },
    { 
      id: 'm365_reclaim', 
      title: 'M365 License Reclaimed & Converted', 
      completed: m.email.licenseType === 'None',
      desc: m.email.licenseType === 'None' ? 'License reclaimed' : `Currently on ${m.email.licenseType}`
    },
    { 
      id: 'hardware_return', 
      title: 'Laptop & Hardware Reclaimed to IT Storage', 
      completed: m.status === 'Offboarded' && !m.hardware.assetTag,
      desc: m.status === 'Offboarded' ? 'Hardware returned' : (m.hardware.pcLaptopModel || m.hardware.mobileModel) ? `Checked out (${m.hardware.assetTag || 'Untagged'})` : 'No hardware assigned'
    },
    { 
      id: 'systems_revoke', 
      title: 'Opera Cloud, Simphony & Oracle Access Revoked', 
      completed: !m.systems.operaCloud.assigned && !m.systems.microsSimphony.assigned && !m.systems.oracleFusion.assigned,
      desc: (!m.systems.operaCloud.assigned && !m.systems.microsSimphony.assigned) ? 'All systems closed' : 'Access still assigned'
    },
    { 
      id: 'keys_cancel', 
      title: 'Visionline RFID Keycard Cancelled & VPN Removed', 
      completed: !m.security.visionline.assigned && !m.vpn.minorVpn,
      desc: (!m.security.visionline.assigned && !m.vpn.minorVpn) ? 'Keys wiped & VPN revoked' : 'Keys/VPN still active'
    }
  ];

  const handleCompleteOnboarding = (m: TeamMemberRecord) => {
    onUpdateMember({
      ...m,
      status: 'Active',
      updatedAt: new Date().toISOString()
    });
  };

  const handleInitiateOffboarding = (m: TeamMemberRecord) => {
    if (confirm(`Begin offboarding workflow for "${m.employeeName}"? This will reclaim licenses and disable system access.`)) {
      onUpdateMember({
        ...m,
        status: 'Offboarded',
        email: {
          ...m.email,
          licenseType: 'None',
          remarks: `Offboarded on ${new Date().toISOString().split('T')[0]}; mailbox converted to shared.`
        },
        activeDirectory: {
          ...m.activeDirectory,
          ouGroup: `OU=DisabledAccounts,${m.activeDirectory.ouGroup.split(',').slice(1).join(',')}`,
          remarks: 'Account disabled and sessions revoked'
        },
        vpn: {
          minorVpn: false,
          vfarLocalVpn: false,
          remarks: 'VPN revoked'
        },
        systems: {
          oracleFusion: { assigned: false, remarks: 'Revoked' },
          operaCloud: { assigned: false, remarks: 'Cashier ID deactivated' },
          microsSimphony: { assigned: false, remarks: 'Operator closed' },
          zenoti: { assigned: false, remarks: '' },
          messageBox: { assigned: false, remarks: 'Deactivated' },
          tableCheck: { assigned: false, remarks: '' },
          minorHotelsApp: { assigned: false, remarks: '' }
        },
        creativeProductivity: {
          adobeAcrobat: { assigned: false, remarks: '' },
          adobeCc: { assigned: false, remarks: '' }
        },
        security: {
          visionline: { assigned: false, remarks: 'Keycard cancelled' }
        },
        generalRemarks: `${m.generalRemarks} (Offboarded on ${new Date().toLocaleDateString()})`,
        updatedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Tab Switcher: Onboarding vs Offboarding */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" /> IT Lifecycle & Operations Protocols
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Standard operating procedures (SOP) for hospitality staff provisioning and secure departure audits.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveSubTab('onboarding')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'onboarding'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Onboarding Queue ({onboardingMembers.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('offboarding')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'offboarding'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserMinus className="w-3.5 h-3.5" />
              <span>Offboarding Protocols ({offboardedMembers.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ONBOARDING WORKFLOW */}
      {activeSubTab === 'onboarding' && (
        <div className="space-y-4">
          {onboardingMembers.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">Onboarding Queue Clear</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                All scheduled staff have completed IT provisioning and are active in their respective property systems.
              </p>
            </div>
          ) : (
            onboardingMembers.map((member) => {
              const tasks = getOnboardingTasks(member);
              const completedCount = tasks.filter(t => t.completed).length;
              const progressPct = Math.round((completedCount / tasks.length) * 100);

              return (
                <div key={member.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-xs font-bold uppercase text-blue-700">Onboarding in progress</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500">{member.propertyOrLocation}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {member.employeeName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {member.jobTitle} · <span className="text-slate-700 font-semibold">{member.department}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-500 font-medium">Provisioning Readiness</div>
                        <div className="text-sm font-bold text-blue-800 font-mono">{progressPct}% Complete</div>
                      </div>

                      <button
                        onClick={() => handleCompleteOnboarding(member)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Sign Off as Active</span>
                      </button>
                    </div>
                  </div>

                  {/* Checklist items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tasks.map(t => (
                      <div 
                        key={t.id} 
                        className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                          t.completed 
                            ? 'bg-emerald-50/60 border-emerald-200' 
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {t.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className={`font-semibold ${t.completed ? 'text-emerald-950' : 'text-slate-600'}`}>
                            {t.title}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {t.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Operational Notes */}
                  {member.generalRemarks && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 italic">
                      Remarks: {member.generalRemarks}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      )}

      {/* OFFBOARDING WORKFLOW */}
      {activeSubTab === 'offboarding' && (
        <div className="space-y-4">
          
          {/* Quick Trigger Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Initiate Personnel Departure / Offboarding
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Select any active team member to execute the standard Minor Hotels IT security de-provisioning sequence.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <select
                id="offboard-select"
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/40"
                defaultValue=""
              >
                <option value="" disabled>Select active staff to offboard...</option>
                {activeMembers.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.employeeName} ({m.jobTitle} - {m.propertyOrLocation})
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  const sel = document.getElementById('offboard-select') as HTMLSelectElement;
                  const memberToOffboard = activeMembers.find(m => m.id === sel.value);
                  if (memberToOffboard) {
                    handleInitiateOffboarding(memberToOffboard);
                    sel.value = '';
                  }
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
              >
                Execute Offboarding Protocol
              </button>
            </div>
          </div>

          {/* Offboarded Records */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Completed Exit Audits ({offboardedMembers.length})
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Historical archive of deactivated accounts, returned assets, and revoked licenses.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {offboardedMembers.map(m => {
                const offTasks = getOffboardingTasks(m);

                return (
                  <div key={m.id} className="p-4 hover:bg-slate-50/70 transition-colors space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                          <span className="font-bold text-slate-900 text-sm">{m.employeeName}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-500">{m.jobTitle}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {m.propertyOrLocation} ({m.department})
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> De-provisioned & Reclaimed
                        </span>
                        <button
                          onClick={() => onSelectMember(m)}
                          className="px-2.5 py-1 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded border border-slate-200 shadow-sm"
                        >
                          View Record
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-[11px]">
                      {offTasks.map(t => (
                        <div key={t.id} className="flex items-center gap-1.5 text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{t.title}</span>
                        </div>
                      ))}
                    </div>

                    {m.generalRemarks && (
                      <p className="text-[11px] text-slate-500 italic mt-1">
                        Exit Note: {m.generalRemarks}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
