import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, FolderOpen, ChevronRight, ChevronDown, Trash2, Save, Edit2, X } from 'lucide-react';

export default function CollectionsTab() {
  const {
    collections,
    createCollection,
    deleteCollection,
    addItemToCollection,
    deleteItemFromCollection,
    loadFromCollection,
    currentRequest,
    updateCollectionItem,
  } = useData();

  const [newCollectionName, setNewCollectionName] = useState('');
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());
  const [saveToCollection, setSaveToCollection] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [editingItem, setEditingItem] = useState<{ collectionId: string; itemId: string } | null>(
    null
  );
  const [editName, setEditName] = useState('');

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName.trim());
      setNewCollectionName('');
    }
  };

  const toggleCollection = (id: string) => {
    const newExpanded = new Set(expandedCollections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCollections(newExpanded);
  };

  const handleSaveToCollection = (collectionId: string) => {
    if (itemName.trim()) {
      addItemToCollection(collectionId, {
        name: itemName.trim(),
        ...currentRequest,
      });
      setItemName('');
      setSaveToCollection(null);
    }
  };

  const handleUpdateItem = (collectionId: string, itemId: string) => {
    if (editName.trim()) {
      updateCollectionItem(collectionId, itemId, { name: editName.trim() });
      setEditingItem(null);
      setEditName('');
    }
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'text-green-600 dark:text-green-400',
      POST: 'text-blue-600 dark:text-blue-400',
      PUT: 'text-orange-600 dark:text-orange-400',
      PATCH: 'text-purple-600 dark:text-purple-400',
      DELETE: 'text-red-600 dark:text-red-400',
    };
    return colors[method] || 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
            placeholder="New collection name"
            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleCreateCollection}
            className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {collections.length === 0 ? (
          <div className="p-8 text-center">
            <FolderOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No collections yet</p>
            <p className="text-gray-400 dark:text-gray-500">
              Create a collection to organize your requests
            </p>
          </div>
        ) : (
          <div>
            {collections.map((collection) => (
              <div key={collection.id} className="border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <button
                    onClick={() => toggleCollection(collection.id)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    {expandedCollections.has(collection.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                    <FolderOpen className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-900 dark:text-white">
                      {collection.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({collection.items.length})
                    </span>
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSaveToCollection(collection.id);
                        setItemName('');
                      }}
                      className="p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                      title="Save current request"
                    >
                      <Save className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </button>
                    <button
                      onClick={() => deleteCollection(collection.id)}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Delete collection"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                {saveToCollection === collection.id && (
                  <div className="px-3 pb-3 flex gap-2">
                    <input
                      type="text"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleSaveToCollection(collection.id)
                      }
                      placeholder="Request name"
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveToCollection(collection.id)}
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setSaveToCollection(null)}
                      className="px-3 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {expandedCollections.has(collection.id) && (
                  <div className="bg-gray-50 dark:bg-gray-900">
                    {collection.items.length === 0 ? (
                      <p className="p-4 text-gray-500 dark:text-gray-400 text-center">
                        No requests saved
                      </p>
                    ) : (
                      collection.items.map((item) => (
                        <div
                          key={item.id}
                          className="px-6 py-2 border-t border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          {editingItem?.collectionId === collection.id &&
                          editingItem?.itemId === item.id ? (
                            <div className="flex gap-2 py-1">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={(e) =>
                                  e.key === 'Enter' &&
                                  handleUpdateItem(collection.id, item.id)
                                }
                                className="flex-1 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
                                autoFocus
                              />
                              <button
                                onClick={() => handleUpdateItem(collection.id, item.id)}
                                className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                              >
                                <Save className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingItem(null);
                                  setEditName('');
                                }}
                                className="px-2 py-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 rounded"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => loadFromCollection(item)}
                                className="flex items-center gap-2 flex-1 text-left py-1"
                              >
                                <span className={`${getMethodColor(item.method)}`}>
                                  {item.method}
                                </span>
                                <span className="text-gray-900 dark:text-white">
                                  {item.name}
                                </span>
                              </button>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    setEditingItem({
                                      collectionId: collection.id,
                                      itemId: item.id,
                                    });
                                    setEditName(item.name);
                                  }}
                                  className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                                  title="Edit name"
                                >
                                  <Edit2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteItemFromCollection(collection.id, item.id)
                                  }
                                  className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
