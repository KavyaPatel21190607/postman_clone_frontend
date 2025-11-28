import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import RequestBuilder from './RequestBuilder';
import ResponseViewer from './ResponseViewer';

export default function Workspace() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [response, setResponse] = useState<any>(null);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && <Sidebar />}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <RequestBuilder onResponse={setResponse} />
          </div>
          
          {response && (
            <div className="h-1/2 border-t border-gray-200 dark:border-gray-700">
              <ResponseViewer response={response} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
