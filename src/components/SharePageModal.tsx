import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  ExternalLink, 
  Printer, 
  Sparkles,
  Layers,
  Globe
} from 'lucide-react';
import QRCode from 'qrcode';
import { ActiveTab } from '../types';

interface SharePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  tabTitle: string;
}

export const SharePageModal: React.FC<SharePageModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  tabTitle
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    // Build the clean full deep-link URL for current page
    const fullUrl = window.location.href;
    setCurrentUrl(fullUrl);

    QRCode.toDataURL(fullUrl, {
      width: 380,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate page QR code', err));
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Avani_Fares_IT_${activeTab}_QR.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>IT Portal Quick Link - ${tabTitle}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              color: #0f172a;
            }
            .card {
              border: 2px solid #d97706;
              border-radius: 12px;
              padding: 24px;
              text-align: center;
              max-width: 320px;
            }
            .brand {
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #b45309;
            }
            h1 {
              font-size: 18px;
              margin: 6px 0 16px 0;
            }
            img {
              width: 220px;
              height: 220px;
              margin: 0 auto 12px auto;
              display: block;
            }
            .url {
              font-family: monospace;
              font-size: 9px;
              word-break: break-all;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="brand">Avani+ Fares Maldives · IT Operations</div>
            <h1>${tabTitle}</h1>
            <img src="${qrDataUrl}" alt="Page QR Code" />
            <div class="url">${currentUrl}</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Share Screen & View Deep Link
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {tabTitle}
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

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-48 h-48 bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-center relative group">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="Page Deep Link QR Code" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="animate-pulse bg-slate-100 w-full h-full rounded flex items-center justify-center text-slate-400">
                  Generating QR...
                </div>
              )}
            </div>
            <div className="mt-2.5 text-xs text-slate-500 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span>Scan with any smartphone camera to open directly to this screen</span>
            </div>
          </div>

          {/* Deep link address box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Full Deep Link URL
              </span>
              <span className="text-[10px] text-amber-800 font-mono font-medium">
                Tab: ?tab={activeTab}
              </span>
            </div>
            <div className="font-mono text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 break-all select-all">
              {currentUrl}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDownloadQR}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save QR Image</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Label</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-all ${
                isCopied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'URL Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
