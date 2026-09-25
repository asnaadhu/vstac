import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  Database
} from 'lucide-react';
import { TeamMemberRecord } from '../types';
import { exportToCSV, downloadFile, parseCSVToMembers } from '../utils/storage';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMemberRecord[];
  onImport: (newMembers: TeamMemberRecord[], mode: 'replace' | 'append') => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  members,
  onImport
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importMode, setImportMode] = useState<'append' | 'replace'>('replace');
  const [importPreview, setImportPreview] = useState<TeamMemberRecord[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    const csv = exportToCSV(members);
    downloadFile(csv, `minor_hotels_it_tracker_${Date.now()}.csv`, 'text/csv');
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(members, null, 2);
    downloadFile(jsonStr, `minor_hotels_it_tracker_${Date.now()}.json`, 'application/json');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportPreview(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setImportPreview(parsed);
          } else {
            setImportError('JSON file does not contain a valid array of member records.');
          }
        } else {
          // Assume CSV
          const records = parseCSVToMembers(text);
          if (records.length > 0) {
            setImportPreview(records);
          } else {
            setImportError('Could not parse any valid records from this CSV file. Ensure header matches exported schema.');
          }
        }
      } catch (err: any) {
        setImportError(`File parse failure: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCommitImport = () => {
    if (!importPreview) return;
    onImport(importPreview, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              Data Management & Backup
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('export')}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import / Restore</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 text-xs space-y-4">
          
          {activeTab === 'export' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                Download current tracking data for <strong>{members.length} team members</strong> in enterprise standard formats.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* CSV */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>CSV Spreadsheet</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Excel-ready CSV containing all 45 columns (Systems, Hardware, OU, Licenses, MFA, Remarks).
                    </p>
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-2xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV</span>
                  </button>
                </div>

                {/* JSON */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                      <FileText className="w-4 h-4 text-sky-600" />
                      <span>JSON Backup</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Full raw structured schema backup preserving complete nested data structures.
                    </p>
                  </div>

                  <button
                    onClick={handleExportJSON}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold shadow-2xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                Upload a CSV or JSON file generated by this system to restore or append personnel records.
              </p>

              {/* Upload Drop Zone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-slate-100/60 transition-colors"
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="font-semibold text-slate-800">Click to browse file (.csv or .json)</div>
                <div className="text-[11px] text-slate-500 mt-1">Supports UTF-8 formatted Minor Hotels export files</div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Error Alert */}
              {importError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Preview & Commit */}
              {importPreview && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Successfully parsed <strong>{importPreview.length} records</strong> ready to import.
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Replace existing records ({members.length} currently)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'append'}
                        onChange={() => setImportMode('append')}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Append to current list</span>
                    </label>
                  </div>

                  <button
                    onClick={handleCommitImport}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm transition-colors"
                  >
                    Commit & Import {importPreview.length} Records
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
