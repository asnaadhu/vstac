import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Download, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { AuditLogEntry } from '../types';
import { downloadFile } from '../utils/storage';

interface AuditLogViewProps {
  logs: AuditLogEntry[];
  onClearLogs: () => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs, onClearLogs }) => {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState<string>('All');

  const filteredLogs = logs.filter(log => {
    if (filterAction !== 'All' && log.action !== filterAction) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return log.memberName.toLowerCase().includes(q) ||
             log.details.toLowerCase().includes(q) ||
             log.action.toLowerCase().includes(q);
    }
    return true;
  });

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    downloadFile(jsonStr, `minor_hotels_audit_trail_${Date.now()}.json`, 'application/json');
  };

  const getActionBadge = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'Created':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Updated':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Status Changed':
        return 'bg-blue-50 text-blue-900 border-blue-200';
      case 'Access Modified':
        return 'bg-violet-50 text-violet-800 border-violet-200';
      case 'Deleted':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header & Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" /> IT Governance & Audit Trail
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable record of user creation, system credential adjustments, and offboarding events.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search audit trail..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="All">All Actions</option>
              <option value="Created">Created</option>
              <option value="Updated">Updated</option>
              <option value="Status Changed">Status Changed</option>
              <option value="Access Modified">Access Modified</option>
              <option value="Deleted">Deleted</option>
              <option value="Bulk Action">Bulk Action</option>
            </select>

            <button
              onClick={handleExportLogs}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Audit</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Clear audit trail history? This cannot be undone.')) {
                  onClearLogs();
                }
              }}
              className="p-1.5 text-slate-500 hover:text-rose-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 shadow-sm"
              title="Clear Log"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">No audit log records match filter</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map(log => (
              <div key={log.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getActionBadge(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-900">{log.memberName}</span>
                    <span className="text-slate-400 font-mono text-[11px]">(ID: {log.memberId})</span>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    {log.details}
                  </p>
                </div>

                <div className="shrink-0 text-slate-400 text-[11px] flex items-center gap-1.5 sm:text-right font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
