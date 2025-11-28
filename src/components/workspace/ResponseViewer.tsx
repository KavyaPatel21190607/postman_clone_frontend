import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ResponseViewerProps {
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: any;
    responseTime: number;
  };
}

export default function ResponseViewer({ response }: ResponseViewerProps) {
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');
  const [viewMode, setViewMode] = useState<'pretty' | 'raw'>('pretty');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = () => {
    if (response.status === 0) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
    if (response.status >= 200 && response.status < 300)
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    if (response.status >= 300 && response.status < 400)
      return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
    if (response.status >= 400 && response.status < 500)
      return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
    return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
  };

  const formatJson = (data: any) => {
    try {
      if (typeof data === 'string') {
        return JSON.stringify(JSON.parse(data), null, 2);
      }
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const renderBody = () => {
    if (!response.body) return <p className="text-gray-500 dark:text-gray-400">No response body</p>;

    const isJson =
      typeof response.body === 'object' ||
      (typeof response.body === 'string' &&
        (response.body.trim().startsWith('{') || response.body.trim().startsWith('[')));

    if (viewMode === 'raw') {
      return (
        <pre className="text-gray-900 dark:text-white font-mono overflow-auto">
          {typeof response.body === 'string' ? response.body : JSON.stringify(response.body)}
        </pre>
      );
    }

    if (isJson) {
      try {
        const formatted = formatJson(response.body);
        return (
          <pre className="text-gray-900 dark:text-white font-mono overflow-auto">{formatted}</pre>
        );
      } catch {
        return (
          <pre className="text-gray-900 dark:text-white font-mono overflow-auto">
            {String(response.body)}
          </pre>
        );
      }
    }

    return (
      <pre className="text-gray-900 dark:text-white font-mono overflow-auto">
        {String(response.body)}
      </pre>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Response Info */}
      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded ${getStatusColor()}`}>
            {response.status === 0
              ? 'Error'
              : `${response.status} ${response.statusText}`}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            Time: {response.responseTime}ms
          </span>
        </div>

        {activeTab === 'body' && (
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('pretty')}
                className={`px-3 py-1 rounded transition-colors ${
                  viewMode === 'pretty'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Pretty
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1 rounded transition-colors ${
                  viewMode === 'raw'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Raw
              </button>
            </div>

            <button
              onClick={() =>
                copyToClipboard(
                  typeof response.body === 'string'
                    ? response.body
                    : JSON.stringify(response.body, null, 2)
                )
              }
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  Copy
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('body')}
            className={`pb-3 px-2 border-b-2 transition-colors ${
              activeTab === 'body'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Response Body
          </button>
          <button
            onClick={() => setActiveTab('headers')}
            className={`pb-3 px-2 border-b-2 transition-colors ${
              activeTab === 'headers'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Headers ({Object.keys(response.headers).length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'body' ? (
          renderBody()
        ) : (
          <div className="space-y-2">
            {Object.keys(response.headers).length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No headers</p>
            ) : (
              Object.entries(response.headers).map(([key, value]) => (
                <div
                  key={key}
                  className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <span className="text-orange-600 dark:text-orange-400 min-w-[200px]">
                    {key}:
                  </span>
                  <span className="text-gray-900 dark:text-white flex-1 break-all">
                    {value}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
