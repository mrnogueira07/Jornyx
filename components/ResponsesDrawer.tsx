import React, { useState } from 'react';
import { Submission, StepConfig } from '../types';
import { Button } from './UIComponents';
import { Download, ChevronUp, ChevronDown, List } from 'lucide-react';

interface ResponsesDrawerProps {
  submissions: Submission[];
  steps: StepConfig[];
}

export const ResponsesDrawer: React.FC<ResponsesDrawerProps> = ({ submissions, steps }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(!isOpen);

  const exportCSV = () => {
    if (submissions.length === 0) return;

    // Create Headers
    const headers = [
      'Timestamp',
      'Data',
      'Hora',
      ...steps.map(s => `"${s.question}"`) // Quote headers to handle commas
    ];

    // Create Rows
    const rows = submissions.map(sub => {
      const dateObj = new Date(sub.timestamp);
      const dateStr = dateObj.toLocaleDateString('pt-BR');
      const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const stepValues = steps.map(step => {
        const val = sub[step.id] || '';
        // Escape quotes and wrap in quotes for CSV safety
        return `"${val.replace(/"/g, '""')}"`;
      });

      return [sub.timestamp, dateStr, timeStr, ...stepValues].join(';');
    });

    const csvContent = [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    link.setAttribute('download', `jornyx_leads_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
      <div className="w-full max-w-5xl px-4 pointer-events-auto">
        {/* Handle / Toggle Button */}
        <button
          onClick={toggleDrawer}
          className="mx-auto flex items-center justify-center gap-2 bg-[#1f1f1f] border border-b-0 border-gray-700 text-gray-200 px-6 py-3 rounded-t-2xl shadow-2xl w-full sm:w-96 cursor-pointer hover:bg-[#2a2a2a] transition-colors"
        >
          {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          <span className="font-medium text-sm tracking-wide uppercase">Respostas ({submissions.length})</span>
        </button>

        {/* Drawer Content */}
        <div 
          className={`
            bg-[#0a0a0a] border-x border-t border-gray-800 rounded-t-xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)]
            overflow-hidden transition-all duration-300 ease-in-out w-full
            ${isOpen ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="p-4 sm:p-6 flex flex-col gap-4 h-full">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-gray-200 font-semibold">Respostas Coletadas</h3>
                <p className="text-xs text-gray-500 mt-1">Armazenado localmente neste navegador</p>
              </div>
              <Button variant="small" onClick={exportCSV} disabled={submissions.length === 0}>
                <span className="flex items-center gap-2">
                  <Download size={14} />
                  Exportar CSV
                </span>
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-auto flex-1 min-h-0 relative">
              {submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500 gap-2">
                  <List size={24} className="opacity-50" />
                  <span className="text-sm">Nenhuma resposta registrada ainda.</span>
                </div>
              ) : (
                <table className="w-full text-left text-xs sm:text-sm text-gray-400">
                  <thead className="text-xs uppercase bg-[#151515] text-gray-500 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 font-medium">Data</th>
                      {steps.slice(3).map(s => ( // Only show Name, WhatsApp, Email columns for brevity in preview
                        <th key={s.id} className="px-4 py-3 font-medium whitespace-nowrap">{s.id}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {submissions.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          {new Date(sub.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                         {steps.slice(3).map(s => (
                           <td key={s.id} className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                             {sub[s.id]}
                           </td>
                         ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
