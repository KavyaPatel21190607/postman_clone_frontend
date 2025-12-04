import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { dataApi } from '../utils/api-client';

export interface KeyValue {
  key: string;
  value: string;
  enabled: boolean;
}

export interface ApiRequest {
  url: string;
  method: string;
  params: KeyValue[];
  headers: KeyValue[];
  body: string;
}

export interface HistoryItem extends ApiRequest {
  id: string;
  timestamp: number;
  status?: number;
  statusText?: string;
  responseTime?: number;
}

export interface CollectionItem extends ApiRequest {
  id: string;
  name: string;
}

export interface Collection {
  id: string;
  name: string;
  items: CollectionItem[];
}

interface DataContextType {
  history: HistoryItem[];
  collections: Collection[];
  currentRequest: ApiRequest;
  setCurrentRequest: (request: ApiRequest) => void;
  addToHistory: (item: Omit<HistoryItem, 'id'>) => void;
  clearHistory: () => void;
  loadFromHistory: (item: HistoryItem) => void;
  createCollection: (name: string) => void;
  deleteCollection: (id: string) => void;
  addItemToCollection: (collectionId: string, item: Omit<CollectionItem, 'id'>) => void;
  deleteItemFromCollection: (collectionId: string, itemId: string) => void;
  loadFromCollection: (item: CollectionItem) => void;
  updateCollectionItem: (collectionId: string, itemId: string, updates: Partial<CollectionItem>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultRequest: ApiRequest = {
  url: '',
  method: 'GET',
  params: [],
  headers: [{ key: 'Content-Type', value: 'application/json', enabled: true }],
  body: '',
};

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [currentRequest, setCurrentRequest] = useState<ApiRequest>(defaultRequest);

  // Load data from API
  useEffect(() => {
    // Clear state immediately when user changes (including logout)
    setHistory([]);
    setCollections([]);
    setCurrentRequest(defaultRequest);

    if (user) {
      const fetchData = async () => {
        try {
          const [historyRes, collectionsRes] = await Promise.all([
            dataApi.getHistory(),
            dataApi.getCollections()
          ]);

          // Map backend history to frontend format if needed
          const mappedHistory = historyRes.data.map((item: any) => ({
            ...item,
            id: item._id,
            timestamp: new Date(item.createdAt).getTime()
          }));

          // Map backend collections to frontend format
          const mappedCollections = collectionsRes.data.map((col: any) => ({
            ...col,
            id: col._id,
            items: col.items.map((item: any) => ({
              ...item,
              id: item._id
            }))
          }));

          setHistory(mappedHistory);
          setCollections(mappedCollections);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [user]);

  const addToHistory = async (item: Omit<HistoryItem, 'id'>) => {
    try {
      const { data } = await dataApi.addToHistory(item);
      const newItem: HistoryItem = {
        ...data,
        id: data._id,
        timestamp: new Date(data.createdAt).getTime()
      };
      setHistory((prev) => [newItem, ...prev]);
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await dataApi.clearHistory();
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setCurrentRequest({
      url: item.url,
      method: item.method,
      params: item.params,
      headers: item.headers,
      body: item.body,
    });
  };

  const createCollection = async (name: string) => {
    try {
      const { data } = await dataApi.createCollection({ name });
      const newCollection: Collection = {
        ...data,
        id: data._id,
        items: []
      };
      setCollections((prev) => [...prev, newCollection]);
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      await dataApi.deleteCollection(id);
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  const addItemToCollection = async (collectionId: string, item: Omit<CollectionItem, 'id'>) => {
    try {
      const { data } = await dataApi.addItemToCollection(collectionId, item);

      // The backend returns the updated collection
      const updatedCollection = {
        ...data,
        id: data._id,
        items: data.items.map((i: any) => ({ ...i, id: i._id }))
      };

      setCollections((prev) =>
        prev.map((collection) =>
          collection.id === collectionId ? updatedCollection : collection
        )
      );
    } catch (error) {
      console.error('Error adding item to collection:', error);
    }
  };

  const deleteItemFromCollection = async (collectionId: string, itemId: string) => {
    // Note: Backend endpoint for deleting item needs to be implemented or we can just update the collection
    // For now, we'll implement it as a client-side filter + update if needed, 
    // but ideally we should have a specific endpoint or use PUT /collections/:id
    console.warn('Delete item from collection not fully implemented on backend yet');

    setCollections((prev) =>
      prev.map((collection) =>
        collection.id === collectionId
          ? {
            ...collection,
            items: collection.items.filter((item) => item.id !== itemId),
          }
          : collection
      )
    );
  };

  const loadFromCollection = (item: CollectionItem) => {
    setCurrentRequest({
      url: item.url,
      method: item.method,
      params: item.params,
      headers: item.headers,
      body: item.body,
    });
  };

  const updateCollectionItem = (
    collectionId: string,
    itemId: string,
    updates: Partial<CollectionItem>
  ) => {
    // Similar to delete, this would ideally be an API call
    console.warn('Update collection item not fully implemented on backend yet');

    setCollections((prev) =>
      prev.map((collection) =>
        collection.id === collectionId
          ? {
            ...collection,
            items: collection.items.map((item) =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
          }
          : collection
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        history,
        collections,
        currentRequest,
        setCurrentRequest,
        addToHistory,
        clearHistory,
        loadFromHistory,
        createCollection,
        deleteCollection,
        addItemToCollection,
        deleteItemFromCollection,
        loadFromCollection,
        updateCollectionItem,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
