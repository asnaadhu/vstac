import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  QrCode, 
  Printer, 
  Download, 
  Check, 
  Copy, 
  Laptop, 
  Monitor, 
  Tablet, 
  Store, 
  Smartphone, 
  HardDrive, 
  UserCheck, 
  Building2, 
  RotateCcw, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import QRCode from 'qrcode';
import { HardwareItem, TeamMemberRecord, DeviceCategory } from '../types';

interface HardwareQRModalProps {
  isOpen: boolean;
  item: HardwareItem | null;
  assignedMember: TeamMemberRecord | null;
  onClose: () => void;
  onAssign?: (item: HardwareItem) => void;
  onUnassign?: (hardwareId: string) => void;
  onSelectMember?: (member: TeamMemberRecord) => void;
}

export const HardwareQRModal: React.FC<HardwareQRModalProps> = ({
  isOpen,
  item,
  assignedMember,
  onClose,
  onAssign,
  onUnassign,
  onSelectMember
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrMode, setQrMode] = useState<'url' | 'details'>('url');
  const [isCopied, setIsCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item) return;

    // Generate scan payload with full unique URL query routing (?part=ID)
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const deepLinkUrl = `${baseUrl}?part=${encodeURIComponent(item.id)}`;
    
    const detailsPayload = JSON.stringify({
      resort: 'Avani+ Fares Maldives Resort',
      partId: item.id,
      sku: item.id,
      assetTag: item.assetTag,
      model: item.deviceModel,
      category: item.deviceCategory,
      serialNumber: item.serialNumber,
      specs: item.specifications || 'Standard Resort SOE',
      condition: item.condition,
      status: item.status,
      assignedCustodian: item.status === 'Assigned' ? {
        name: item.assignedMemberName || assignedMember?.employeeName || 'Staff Member',
        department: item.assignedDepartment || assignedMember?.department || 'Operations',
        jobTitle: assignedMember?.jobTitle || 'Team Member',
        email: assignedMember?.email.address || 'fares@avanihotels.com',
        adUsername: assignedMember?.activeDirectory.username || 'staff_vfar',
        accountStatus: assignedMember?.status || 'Active'
      } : 'Available in IT Stock Pool',
      storageOrLocation: item.notes || 'IT Operations Rack',
      deepLinkUrl: deepLinkUrl
    }, null, 2);

    const payloadToEncode = qrMode === 'url' ? deepLinkUrl : detailsPayload;

    QRCode.toDataURL(payloadToEncode, {
      width: 400,
      margin: 2,
      color: {
        dark: '#1e293b', // slate-800
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate QR Code', err));
  }, [item, assignedMember, qrMode]);

  if (!isOpen || !item) return null;

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

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${item.assetTag}_QR_Code.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    const deepLinkUrl = `${window.location.origin}${window.location.pathname}?part=${encodeURIComponent(item.id)}`;
    navigator.clipboard.writeText(deepLinkUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handlePrintSticker = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print asset label.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Asset Label - ${item.assetTag}</title>
          <style>
            @page {
              size: 80mm 50mm;
              margin: 3mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              padding: 6px;
              color: #0f172a;
              background: #fff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .label-card {
              border: 2px solid #0f172a;
              border-radius: 8px;
              padding: 8px;
              display: flex;
              gap: 10px;
              align-items: center;
              box-sizing: border-box;
              height: 44mm;
            }
            .qr-col {
              flex-shrink: 0;
              text-align: center;
            }
            .qr-col img {
              width: 32mm;
              height: 32mm;
              display: block;
            }
            .info-col {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: 100%;
            }
            .brand-header {
              font-size: 9px;
              font-weight: 800;
              letter-spacing: 0.5px;
              text-transform: uppercase;
              color: #b45309;
            }
            .resort-title {
              font-size: 11px;
              font-weight: bold;
              line-height: 1.1;
              color: #0f172a;
            }
            .asset-tag-box {
              margin: 3px 0;
              padding: 2px 4px;
              background: #f1f5f9;
              border: 1px solid #cbd5e1;
              border-radius: 4px;
              font-family: monospace;
              font-size: 13px;
              font-weight: bold;
              color: #0f172a;
            }
            .model-text {
              font-size: 10px;
              font-weight: 600;
              color: #334155;
            }
            .sn-text {
              font-size: 9px;
              font-family: monospace;
              color: #64748b;
            }
            .status-text {
              font-size: 8.5px;
              font-weight: bold;
              color: #047857;
            }
            .footer-disclaimer {
              font-size: 6.5px;
              color: #64748b;
              font-weight: bold;
              text-transform: uppercase;
              border-top: 1px dashed #cbd5e1;
              padding-top: 2px;
            }
          </style>
        </head>
        <body>
          <div class="label-card">
            <div class="qr-col">
              <img src="${qrDataUrl}" alt="${item.assetTag}" />
              <div style="font-size: 7px; font-weight: bold; margin-top: 2px; color: #475569;">SCAN FOR LIVE DETAILS</div>
            </div>
            <div class="info-col">
              <div>
                <div class="brand-header">Minor Hotels · VFAR</div>
                <div class="resort-title">Avani+ Fares Maldives</div>
                <div class="asset-tag-box">${item.assetTag}</div>
                <div class="model-text">${item.deviceModel}</div>
                <div class="sn-text">S/N: ${item.serialNumber || 'N/A'}</div>
                <div class="status-text">${item.status === 'Assigned' ? `Custody: ${item.assignedMemberName || 'Staff'}` : 'Status: IT Stock Pool'}</div>
              </div>
              <div class="footer-disclaimer">
                Property of Avani+ Fares Maldives · Do Not Remove
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden my-auto">
        
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/80 via-white to-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs ring-1 ring-blue-400/40">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                  QR ASSET STICKER
                </span>
                <span className="text-xs font-semibold text-blue-800">
                  Avani+ Fares Maldives
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-tight mt-0.5">
                Hardware Asset Details & QR Scanner Label
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          
          {/* Printable Sticker Section */}
          <div 
            ref={printRef}
            className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 border-2 border-slate-800 rounded-2xl shadow-xs"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4">
              
              {/* QR Code Graphic */}
              <div className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl shadow-xs shrink-0">
                {qrDataUrl ? (
                  <img 
                    src={qrDataUrl} 
                    alt={`QR for ${item.assetTag}`} 
                    className="w-32 h-32 object-contain"
                  />
                ) : (
                  <div className="w-32 h-32 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-400">
                    Generating QR...
                  </div>
                )}
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Scan for live details
                </span>
              </div>

              {/* Asset Badge & Core Identity */}
              <div className="flex-1 w-full space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-700" />
                    Avani+ Fares Maldives Resort
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-white font-bold">
                    IT FLEET
                  </span>
                </div>

                <div>
                  <div className="text-xl font-mono font-bold text-blue-900 tracking-tight">
                    {item.assetTag}
                  </div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    {getCategoryIcon(item.deviceCategory)}
                    <span>{item.deviceModel}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Serial No: <strong className="text-slate-800">{item.serialNumber || 'N/A'}</strong>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Current Custody:</span>
                    {item.status === 'Assigned' ? (
                      <span className="font-bold text-blue-800 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        {item.assignedMemberName || assignedMember?.employeeName || 'Assigned Staff'}
                      </span>
                    ) : item.status === 'Available' ? (
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Available in IT Stock
                      </span>
                    ) : (
                      <span className="font-bold text-blue-800 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Under Maintenance
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    Condition: {item.condition}
                  </span>
                </div>

                <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider pt-1">
                  Property of Avani+ Fares Maldives Resort · Do Not Remove
                </div>
              </div>

            </div>
          </div>

          {/* Unique Item Deep Link URL Card */}
          <div className="bg-blue-50/70 border border-blue-200/90 rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Unique Scan Deep Link (Encoded in QR)</span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-blue-200/70 text-blue-900 ml-1">
                  ?part={item.id}
                </span>
              </div>
              <div className="font-mono text-xs text-slate-800 truncate select-all mt-1 bg-white/95 border border-blue-200 rounded-lg px-2.5 py-1.5 shadow-sm">
                {`${window.location.origin}${window.location.pathname}?part=${encodeURIComponent(item.id)}`}
              </div>
              <div className="text-[10px] text-blue-800/80 mt-1">
                Scanning or loading this full URL immediately bypasses the home screen and opens this part's details.
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="shrink-0 self-start sm:self-center flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-900 bg-white hover:bg-blue-100/80 border border-blue-300 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-700" />}
              <span>{isCopied ? 'Link Copied!' : 'Copy Deep Link'}</span>
            </button>
          </div>

          {/* Detailed Hardware Specifications Table */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-blue-600" />
              Complete Hardware & Inventory Record
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Asset Tag</span>
                <span className="font-mono font-bold text-blue-900">{item.assetTag}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Device Category</span>
                <span className="font-semibold text-slate-900">{item.deviceCategory}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Serial Number (S/N)</span>
                <span className="font-mono text-slate-800">{item.serialNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Physical Condition</span>
                <span className="font-semibold text-slate-900">{item.condition}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Inventory Status</span>
                <span className={`font-bold ${item.status === 'Assigned' ? 'text-blue-700' : item.status === 'Available' ? 'text-emerald-700' : 'text-blue-700'}`}>
                  {item.status}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Resort Property</span>
                <span className="font-semibold text-slate-900">Avani+ Fares Maldives</span>
              </div>
            </div>

            {item.specifications && (
              <div className="pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-500 text-[11px] block">Technical Specs & Configuration</span>
                <p className="font-mono text-slate-800 mt-0.5">{item.specifications}</p>
              </div>
            )}

            {item.notes && (
              <div className="pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-500 text-[11px] block">Storage Location & Handover Remarks</span>
                <p className="text-slate-700 mt-0.5 italic">{item.notes}</p>
              </div>
            )}

            {/* Custody Information Card */}
            {item.status === 'Assigned' && (
              <div className="mt-3 p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-950 flex items-center gap-1.5 text-xs">
                    <UserCheck className="w-4 h-4 text-blue-700" />
                    Currently Assigned Custodian
                  </span>
                  {assignedMember && onSelectMember && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectMember(assignedMember);
                      }}
                      className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-100/70 px-2 py-1 rounded-md border border-blue-200 transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <span>View Staff Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-blue-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-slate-900 font-bold text-sm">
                      {item.assignedMemberName || assignedMember?.employeeName}
                    </div>
                    {assignedMember && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {assignedMember.status}
                      </span>
                    )}
                  </div>
                  <div className="text-slate-600 text-xs">
                    {assignedMember?.jobTitle || 'Team Member'} · <strong className="text-slate-800">{item.assignedDepartment || assignedMember?.department || 'Operations'}</strong>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 border-t border-slate-100 text-[11px]">
                    {assignedMember?.email.address && (
                      <div className="text-slate-600 font-mono">
                        Email: <span className="text-slate-900 font-semibold">{assignedMember.email.address}</span>
                      </div>
                    )}
                    {assignedMember?.activeDirectory.username && (
                      <div className="text-slate-600 font-mono">
                        AD Account: <span className="text-slate-900 font-semibold">{assignedMember.activeDirectory.username}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Available Stock Card */}
            {item.status === 'Available' && (
              <div className="mt-3 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Available Fleet Stock Pool
                  </span>
                  {onAssign && (
                    <button
                      type="button"
                      onClick={() => onAssign(item)}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Assign to Staff Member</span>
                    </button>
                  )}
                </div>
                <p className="text-emerald-800 text-[11px]">
                  This equipment is verified and in stock at Avani+ Fares Maldives IT Storage. Ready for deployment and team member allocation.
                </p>
              </div>
            )}
          </div>

          {/* QR Code Payload Option Switcher */}
          <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-600 font-medium">QR Scanning Target:</span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-200/80 rounded-lg">
              <button
                type="button"
                onClick={() => setQrMode('url')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  qrMode === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Web Direct Link (Scan to Open)
              </button>
              <button
                type="button"
                onClick={() => setQrMode('details')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  qrMode === 'details' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Full JSON Payload
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintSticker}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-colors"
                title="Print standard 80mm x 50mm asset label"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Asset Sticker</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadQR}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-colors"
                title="Download QR code image"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-colors"
                title="Copy shareable asset link"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{isCopied ? 'Link Copied' : 'Copy Link'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {item.status === 'Available' && onAssign && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAssign(item);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Assign to Staff</span>
                </button>
              )}

              {item.status === 'Assigned' && onUnassign && (
                <button
                  type="button"
                  onClick={() => {
                    onUnassign(item.id);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl shadow-sm transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Return to Stock</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
