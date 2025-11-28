import { useState } from 'react';
import { History, FolderOpen } from 'lucide-react';
import HistoryTab from './HistoryTab';
import CollectionsTab from './CollectionsTab';

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<'history' | 'collections'>('history');

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'history'
              ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <History className="w-4 h-4" />
          <span>History</span>
        </button>
        <button
          onClick={() => setActiveTab('collections')}
          className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'collections'
              ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Collections</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'history' ? <HistoryTab /> : <CollectionsTab />}
      </div>
    </div>
  );
}
