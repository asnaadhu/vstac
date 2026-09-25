import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  QrCode, 
  Printer, 
  Download, 
  Check, 
  Copy, 
  UserCheck, 
  Building2, 
  ExternalLink,
  ShieldCheck,
  Mail,
  Laptop,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  KeyRound,
  Wifi
} from 'lucide-react';
import QRCode from 'qrcode';
import { TeamMemberRecord } from '../types';

interface MemberQRModalProps {
  isOpen: boolean;
  member: TeamMemberRecord | null;
  onClose: () => void;
  onViewHardware?: (assetTag: string) => void;
}

export const MemberQRModal: React.FC<MemberQRModalProps> = ({
  isOpen,
  member,
  onClose,
  onViewHardware
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrMode, setQrMode] = useState<'url' | 'vcard'>('url');
  const [isCopied, setIsCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!member) return;

    // Generate scan payload with full unique URL query routing (?tab=directory&member=ID)
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const deepLinkUrl = `${baseUrl}?tab=directory&member=${encodeURIComponent(member.id)}`;

    // Optional vCard payload for smartphone contact import
    const vCardPayload = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${member.employeeName}`,
      `TITLE:${member.jobTitle}`,
      `ORG:Avani+ Fares Maldives Resort;${member.department}`,
      `EMAIL:${member.email.address}`,
      `TEL;TYPE=WORK:${member.telephony.companyNumber || '+960 660 8888'}`,
      `NOTE:Minor Hotels IT ID: ${member.id} | AD: ${member.activeDirectory.username} | Tag: ${member.hardware.assetTag || (member.hardware.pcLaptopModel || member.hardware.mobileModel ? 'Untagged' : 'None')} | Direct Link: ${deepLinkUrl}`,
      `URL:${deepLinkUrl}`,
      'END:VCARD'
    ].join('\n');

    const payloadToEncode = qrMode === 'url' ? deepLinkUrl : vCardPayload;

    QRCode.toDataURL(payloadToEncode, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0f172a', // slate-900
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate Member QR Code', err));
  }, [member, qrMode]);

  if (!isOpen || !member) return null;

  const deepLinkUrl = `${window.location.origin}${window.location.pathname}?tab=directory&member=${encodeURIComponent(member.id)}`;

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Staff_Badge_${member.employeeName.replace(/\s+/g, '_')}_QR.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(deepLinkUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handlePrintBadge = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print staff IT credential badge.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Staff IT Pass - ${member.employeeName} (${member.id})</title>
          <style>
            @page {
              size: 85.6mm 54mm; /* Standard CR80 badge / ID-1 size */
              margin: 0;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              padding: 10px;
              background: #ffffff;
              color: #0f172a;
              box-sizing: border-box;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .badge-card {
              border: 1.5px solid #d97706;
              border-radius: 8px;
              padding: 10px;
              display: flex;
              gap: 12px;
              align-items: center;
              height: 100%;
              box-sizing: border-box;
              position: relative;
              background: linear-gradient(135deg, #fffbeb 0%, #ffffff 60%);
            }
            .qr-box {
              width: 96px;
              height: 96px;
              flex-shrink: 0;
              background: white;
              padding: 4px;
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .qr-box img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            .info {
              flex: 1;
              font-size: 9px;
              line-height: 1.3;
            }
            .header-brand {
              font-size: 8px;
              font-weight: 800;
              letter-spacing: 0.8px;
              text-transform: uppercase;
              color: #b45309;
              margin-bottom: 2px;
            }
            .name {
              font-size: 13px;
              font-weight: 800;
              color: #0f172a;
              line-height: 1.15;
            }
            .title {
              font-size: 9.5px;
              font-weight: 600;
              color: #b45309;
              margin-bottom: 4px;
            }
            .dept {
              font-size: 8.5px;
              color: #475569;
              font-weight: 500;
              margin-bottom: 6px;
            }
            .meta-row {
              display: flex;
              justify-content: space-between;
              font-size: 8px;
              padding: 2px 0;
              border-top: 1px dashed #e2e8f0;
              font-family: monospace;
            }
            .url-footer {
              margin-top: 4px;
              font-size: 7px;
              color: #64748b;
              font-family: monospace;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="badge-card">
            <div class="qr-box">
              <img src="${qrDataUrl}" alt="Staff QR Badge" />
            </div>
            <div class="info">
              <div class="header-brand">Avani+ Fares Maldives · IT Pass</div>
              <div class="name">${member.employeeName}</div>
              <div class="title">${member.jobTitle}</div>
              <div class="dept">${member.department} · ${member.propertyOrLocation}</div>
              
              <div class="meta-row">
                <span><strong>ID:</strong> ${member.id}</span>
                <span><strong>AD:</strong> ${member.activeDirectory.username || '—'}</span>
              </div>
              <div class="meta-row">
                <span><strong>Status:</strong> ${member.status}</span>
                <span><strong>Hardware Tag:</strong> ${member.hardware.assetTag || 'None'}</span>
              </div>
              <div class="url-footer">
                Scan to open digital personnel profile: ${deepLinkUrl}
              </div>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                  Digital Staff IT ID & Clearance Pass
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs font-mono text-slate-300">{member.id}</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
                <span>{member.employeeName}</span>
                <span className="text-xs font-normal text-slate-400">({member.jobTitle})</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Direct Scan Deep Link Banner */}
          <div className="bg-blue-50/90 border border-blue-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-200 text-blue-900 rounded-md tracking-wide uppercase">
                  Direct Deep Link URL
                </span>
                <span className="text-[11px] text-blue-900 font-medium">Bypasses home screen and opens staff profile immediately</span>
              </div>
              <div className="font-mono text-[11px] text-slate-700 truncate select-all bg-white px-2.5 py-1.5 rounded-lg border border-blue-200/80">
                {deepLinkUrl}
              </div>
            </div>

            <button
              onClick={handleCopyLink}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                isCopied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'URL Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              QR Code Payload
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setQrMode('url')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  qrMode === 'url'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Deep Link URL (?member=ID)
              </button>
              <button
                type="button"
                onClick={() => setQrMode('vcard')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  qrMode === 'vcard'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                vCard Contact Card
              </button>
            </div>
          </div>

          {/* Printable Staff Badge Preview */}
          <div 
            ref={printRef}
            className="border-2 border-blue-500/40 rounded-2xl p-5 bg-gradient-to-br from-blue-50/60 via-white to-slate-50 relative overflow-hidden shadow-xs"
          >
            <div className="flex flex-col sm:flex-row items-center gap-5">
              
              {/* QR Code Container */}
              <div className="relative group shrink-0">
                <div className="w-40 h-40 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt={`Staff QR Code for ${member.employeeName}`} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="animate-pulse bg-slate-100 w-full h-full rounded flex items-center justify-center text-slate-400">
                      Generating QR...
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-center text-slate-500 font-mono mt-1">
                  CR80 Digital Pass
                </div>
              </div>

              {/* Staff Details & Custody */}
              <div className="flex-1 space-y-3 w-full">
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Avani+ Fares Maldives
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-[11px] font-mono text-slate-500">ID: {member.id}</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {member.employeeName}
                  </h3>
                  <div className="text-xs font-semibold text-blue-800 mt-0.5">
                    {member.jobTitle}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.department} · {member.propertyOrLocation}</span>
                  </div>
                </div>

                {/* Identity & Access Matrix Summary */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
                  <div>
                    <span className="text-slate-500">Active Directory:</span>
                    <div className="font-mono font-semibold text-slate-800 truncate">
                      {member.activeDirectory.username || '—'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">M365 Account:</span>
                    <div className="font-semibold text-sky-800 truncate">
                      {member.email.licenseType}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Assigned Hardware:</span>
                    <div className="font-mono font-semibold text-blue-900 truncate">
                      {member.hardware.assetTag ? (
                        <span className="bg-blue-100 px-1 rounded">{member.hardware.assetTag}</span>
                      ) : (
                        <span className="text-slate-400">No Hardware Tag</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Access Status:</span>
                    <div className="font-semibold text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {member.status}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Quick Details Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500 text-[11px] flex items-center gap-1 mb-1">
                <Mail className="w-3.5 h-3.5 text-sky-600" /> Email & DL
              </div>
              <div className="font-mono text-slate-900 font-medium truncate" title={member.email.address}>
                {member.email.address}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {member.email.leadersDL ? 'Enrolled in Leaders DL' : 'Standard Distribution'}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500 text-[11px] flex items-center gap-1 mb-1">
                <Laptop className="w-3.5 h-3.5 text-blue-600" /> Device Model
              </div>
              <div className="text-slate-900 font-medium truncate">
                {member.hardware.pcLaptopModel || 'BYOD / None'}
              </div>
              {member.hardware.assetTag && onViewHardware && (
                <button
                  type="button"
                  onClick={() => onViewHardware(member.hardware.assetTag)}
                  className="text-[10px] font-semibold text-blue-800 hover:underline mt-0.5 flex items-center gap-1"
                >
                  <span>View Equipment QR ({member.hardware.assetTag})</span>
                </button>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500 text-[11px] flex items-center gap-1 mb-1">
                <KeyRound className="w-3.5 h-3.5 text-violet-600" /> Systems & VPN
              </div>
              <div className="text-slate-900 font-medium truncate">
                {[
                  member.systems.operaCloud.assigned && 'Opera',
                  member.systems.microsSimphony.assigned && 'Simphony',
                  member.systems.oracleFusion.assigned && 'Fusion',
                  member.vpn.vfarLocalVpn && 'VFAR VPN'
                ].filter(Boolean).join(', ') || 'Standard Access'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {member.security.visionline.assigned ? 'Visionline RFID Keycard Active' : 'No Keycard'}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Encodes permanent direct deep link. Compatible with any mobile camera.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadQR}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save PNG</span>
            </button>

            <button
              type="button"
              onClick={handlePrintBadge}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Badge Card</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
