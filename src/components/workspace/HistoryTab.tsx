import { useData } from '../../contexts/DataContext';
import { Clock, Trash2 } from 'lucide-react';

export default function HistoryTab() {
  const { history, clearHistory, loadFromHistory } = useData();

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
      POST: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
      PUT: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
      PATCH: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
      DELETE: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    };
    return colors[method] || 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700';
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (history.length === 0) {
    return (
      <div className="p-8 text-center">
        <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">No history yet</p>
        <p className="text-gray-400 dark:text-gray-500">
          Your API requests will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span className="text-gray-700 dark:text-gray-300">
          {history.length} {history.length === 1 ? 'request' : 'requests'}
        </span>
        <button
          onClick={clearHistory}
          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => loadFromHistory(item)}
            className="w-full p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2 py-1 rounded text-xs ${getMethodColor(
                  item.method
                )}`}
              >
                {item.method}
              </span>
              {item.status && (
                <span
                  className={`text-xs ${
                    item.status >= 200 && item.status < 300
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {item.status}
                </span>
              )}
              {item.responseTime && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.responseTime}ms
                </span>
              )}
            </div>
            <p className="text-gray-900 dark:text-white truncate mb-1">
              {item.url || 'No URL'}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {formatTime(item.timestamp)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
