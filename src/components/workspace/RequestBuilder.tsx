import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Send, Plus, Trash2 } from 'lucide-react';
import type { KeyValue } from '../../contexts/DataContext';

interface RequestBuilderProps {
  onResponse: (response: any) => void;
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export default function RequestBuilder({ onResponse }: RequestBuilderProps) {
  const { currentRequest, setCurrentRequest, addToHistory } = useData();
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');
  const [loading, setLoading] = useState(false);

  const updateRequest = (updates: Partial<typeof currentRequest>) => {
    setCurrentRequest({ ...currentRequest, ...updates });
  };

  const addKeyValue = (type: 'params' | 'headers') => {
    const items = currentRequest[type];
    updateRequest({
      [type]: [...items, { key: '', value: '', enabled: true }],
    });
  };

  const updateKeyValue = (type: 'params' | 'headers', index: number, updates: Partial<KeyValue>) => {
    const items = [...currentRequest[type]];
    items[index] = { ...items[index], ...updates };
    updateRequest({ [type]: items });
  };

  const deleteKeyValue = (type: 'params' | 'headers', index: number) => {
    const items = currentRequest[type].filter((_, i) => i !== index);
    updateRequest({ [type]: items });
  };

  const buildUrlWithParams = () => {
    const enabledParams = currentRequest.params.filter((p) => p.enabled && p.key);
    if (enabledParams.length === 0) return currentRequest.url;

    const queryString = enabledParams.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&');
    const separator = currentRequest.url.includes('?') ? '&' : '?';
    return `${currentRequest.url}${separator}${queryString}`;
  };

  const sendRequest = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const url = buildUrlWithParams();
      const enabledHeaders = currentRequest.headers
        .filter((h) => h.enabled && h.key)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {} as Record<string, string>);

      // Use the proxy endpoint
      // We import api from utils/api-client to handle our backend auth
      const { data } = await import('../../utils/api-client').then(m =>
        m.default.post(
          '/proxy',
          {
            url,
            method: currentRequest.method,
            headers: enabledHeaders,
            body: ['POST', 'PUT', 'PATCH'].includes(currentRequest.method) ? currentRequest.body : undefined,
          },
          { validateStatus: () => true }
        )
      );

      const responseTime = Date.now() - startTime;

      const responseData = {
        status: data.status,
        statusText: data.statusText,
        headers: data.headers,
        body: data.data,
        responseTime,
      };

      onResponse(responseData);

      // Add to history
      addToHistory({
        ...currentRequest,
        timestamp: Date.now(),
        status: data.status,
        statusText: data.statusText,
        responseTime,
      });
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      // Handle axios error structure
      const errorMessage = error.response?.data?.message || error.message || 'Network error occurred';

      const errorResponse = {
        status: 0,
        statusText: 'Error',
        headers: {},
        body: { error: errorMessage },
        responseTime,
      };

      onResponse(errorResponse);

      addToHistory({
        ...currentRequest,
        timestamp: Date.now(),
        status: 0,
        statusText: 'Error',
        responseTime,
      });
    } finally {
      setLoading(false);
    }
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-green-500 hover:bg-green-600',
      POST: 'bg-blue-500 hover:bg-blue-600',
      PUT: 'bg-orange-500 hover:bg-orange-600',
      PATCH: 'bg-purple-500 hover:bg-purple-600',
      DELETE: 'bg-red-500 hover:bg-red-600',
    };
    return colors[method] || 'bg-gray-500 hover:bg-gray-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* URL Section */}
      <div className="flex gap-3">
        <div className="relative">
          <select
            value={currentRequest.method}
            onChange={(e) => updateRequest({ method: e.target.value })}
            className={`${getMethodColor(
              currentRequest.method
            )} text-white px-4 py-3 rounded-lg appearance-none pr-10 cursor-pointer transition-colors`}
          >
            {HTTP_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <input
          type="text"
          value={currentRequest.url}
          onChange={(e) => updateRequest({ url: e.target.value })}
          placeholder="https://api.example.com/endpoint"
          className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
        />

        <button
          onClick={sendRequest}
          disabled={loading || !currentRequest.url}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('params')}
            className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === 'params'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            Query Params
            {currentRequest.params.filter((p) => p.enabled && p.key).length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                {currentRequest.params.filter((p) => p.enabled && p.key).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('headers')}
            className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === 'headers'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            Headers
            {currentRequest.headers.filter((h) => h.enabled && h.key).length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                {currentRequest.headers.filter((h) => h.enabled && h.key).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('body')}
            className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === 'body'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              } ${!['POST', 'PUT', 'PATCH'].includes(currentRequest.method)
                ? 'opacity-50 cursor-not-allowed'
                : ''
              }`}
            disabled={!['POST', 'PUT', 'PATCH'].includes(currentRequest.method)}
          >
            Body (JSON)
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'params' && (
          <div className="space-y-3">
            {currentRequest.params.map((param, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  checked={param.enabled}
                  onChange={(e) =>
                    updateKeyValue('params', index, { enabled: e.target.checked })
                  }
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <input
                  type="text"
                  value={param.key}
                  onChange={(e) => updateKeyValue('params', index, { key: e.target.value })}
                  placeholder="Key"
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  value={param.value}
                  onChange={(e) => updateKeyValue('params', index, { value: e.target.value })}
                  placeholder="Value"
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => deleteKeyValue('params', index)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addKeyValue('params')}
              className="flex items-center gap-2 px-4 py-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Param
            </button>
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-3">
            {currentRequest.headers.map((header, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  checked={header.enabled}
                  onChange={(e) =>
                    updateKeyValue('headers', index, { enabled: e.target.checked })
                  }
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => updateKeyValue('headers', index, { key: e.target.value })}
                  placeholder="Key (e.g., Authorization)"
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) => updateKeyValue('headers', index, { value: e.target.value })}
                  placeholder="Value"
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => deleteKeyValue('headers', index)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addKeyValue('headers')}
              className="flex items-center gap-2 px-4 py-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Header
            </button>
          </div>
        )}

        {activeTab === 'body' && (
          <div>
            <textarea
              value={currentRequest.body}
              onChange={(e) => updateRequest({ body: e.target.value })}
              placeholder={'{\n  "key": "value"\n}'}
              rows={12}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-gray-900 dark:text-white"
            />
            {currentRequest.body && (
              <div className="mt-2">
                {(() => {
                  try {
                    JSON.parse(currentRequest.body);
                    return (
                      <p className="text-green-600 dark:text-green-400">✓ Valid JSON</p>
                    );
                  } catch {
                    return <p className="text-red-600 dark:text-red-400">✗ Invalid JSON</p>;
                  }
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
