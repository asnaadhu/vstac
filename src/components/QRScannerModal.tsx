import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Camera, 
  Search, 
  QrCode, 
  AlertCircle, 
  CheckCircle2, 
  Laptop, 
  Upload, 
  Sparkles, 
  HardDrive 
} from 'lucide-react';
import { HardwareItem } from '../types';

interface QRScannerModalProps {
  isOpen: boolean;
  hardwareInventory: HardwareItem[];
  onClose: () => void;
  onSelectHardware: (item: HardwareItem) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  hardwareInventory,
  onClose,
  onSelectHardware
}) => {
  const [tagInput, setTagInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera stream when closed
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setTagInput('');
      setErrorMessage('');
    }
  }, [isOpen]);

  const startCamera = async () => {
    setErrorMessage('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage('Camera access is not supported by your browser environment.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);

        // Check if BarcodeDetector is available
        if ('BarcodeDetector' in window) {
          // @ts-expect-error - BarcodeDetector is a modern browser feature
          const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const scanFrame = async () => {
            if (!videoRef.current || !streamRef.current) return;
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0) {
                const rawValue = barcodes[0].rawValue;
                handleScannedValue(rawValue);
                return;
              }
            } catch (err) {
              // frame detection error, keep scanning
            }
            requestAnimationFrame(scanFrame);
          };
          requestAnimationFrame(scanFrame);
        }
      }
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      const error = err as Error;
      setErrorMessage(`Camera could not be started: ${error?.message || 'Permission denied'}`);
      setCameraActive(false);
    }
  };

  const handleScannedValue = (scannedText: string) => {
    stopCamera();
    
    // Extract part ID, SKU, or asset tag from URL if scanned from web link (e.g. ...?part=hw-001 or ...?sku=123)
    let extractedKey = scannedText.trim();
    
    // Check if scanned value is a URL or query string
    if (scannedText.includes('?') || scannedText.startsWith('http://') || scannedText.startsWith('https://')) {
      try {
        const urlToParse = scannedText.startsWith('http') ? scannedText : `https://dummy.host/${scannedText.replace(/^\/?/, '')}`;
        const parsedUrl = new URL(urlToParse);
        const queryParam = parsedUrl.searchParams.get('part') ||
                           parsedUrl.searchParams.get('sku') ||
                           parsedUrl.searchParams.get('id') ||
                           parsedUrl.searchParams.get('assetTag') ||
                           parsedUrl.searchParams.get('tag') ||
                           parsedUrl.searchParams.get('scan');
        if (queryParam) {
          extractedKey = queryParam;
        }
      } catch (e) {
        const match = scannedText.match(/(?:part|sku|id|assetTag|tag)=([^&]+)/i);
        if (match) {
          extractedKey = decodeURIComponent(match[1]);
        }
      }
    } else if (scannedText.trim().startsWith('{')) {
      // JSON payload
      try {
        const parsed = JSON.parse(scannedText);
        if (parsed.partId) extractedKey = parsed.partId;
        else if (parsed.id) extractedKey = parsed.id;
        else if (parsed.sku) extractedKey = parsed.sku;
        else if (parsed.assetTag) extractedKey = parsed.assetTag;
      } catch (e) {
        // ignore JSON parse error
      }
    }

    const cleanKey = extractedKey.toLowerCase();
    const matched = hardwareInventory.find(h => 
      h.id.toLowerCase() === cleanKey ||
      h.assetTag.toLowerCase() === cleanKey ||
      (h.serialNumber && h.serialNumber.toLowerCase() === cleanKey)
    );

    if (matched) {
      onSelectHardware(matched);
      onClose();
    } else {
      setErrorMessage(`No equipment found matching scanned code or parameter "${extractedKey}".`);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) return;

    handleScannedValue(tagInput.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Scan & Lookup Equipment QR Code
              </h3>
              <p className="text-[11px] text-slate-500">
                Avani+ Fares Maldives IT Fleet Scanner
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          {/* Camera View Area */}
          <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center text-white border border-slate-700">
            {cameraActive ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-8 border-2 border-blue-400 rounded-lg pointer-events-none opacity-80 animate-pulse"></div>
                <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/90 bg-slate-900/70 py-1">
                  Point camera at equipment asset sticker
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <QrCode className="w-12 h-12 text-slate-500 mx-auto mb-2 opacity-80" />
                <p className="text-xs text-slate-300 font-medium">Ready to scan hardware QR sticker</p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Start Camera Scanner</span>
                </button>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Manual Input or Barcode Reader Input */}
          <form onSubmit={handleManualSearch} className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Or Enter / Paste Asset Tag / Barcode
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g. VFAR-IT-0001 or serial number"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
              <button
                type="submit"
                disabled={!tagInput.trim()}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
              >
                Lookup
              </button>
            </div>
          </form>

          {/* Quick Click Asset Tags in Inventory */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Quick Test Tags in Fleet:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {hardwareInventory.slice(0, 8).map(hw => (
                <button
                  key={hw.id}
                  type="button"
                  onClick={() => {
                    onSelectHardware(hw);
                    onClose();
                  }}
                  className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 hover:bg-blue-100 hover:text-blue-900 text-slate-700 rounded border border-slate-200 transition-colors"
                >
                  {hw.assetTag}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
