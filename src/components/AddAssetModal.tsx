import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Employee } from '../types';
import { SearchableSelect } from './SearchableSelect';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export function AddAssetModal({ isOpen, onClose, onSuccess }: AddAssetModalProps) {
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newAsset, setNewAsset] = useState({
    name: '',
    type: 'laptop',
    serial_number: '',
    status: 'available',
    purchase_date: new Date().toISOString().split('T')[0],
    purchase_price: '',
    assigned_to: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const { data } = await supabase.from('employees').select('*');
    if (data) {
      setEmployees(data);
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newAsset.name || !newAsset.serial_number || !newAsset.purchase_date || !newAsset.purchase_price) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const { data: asset, error: assetError } = await supabase
        .from('assets')
        .insert([{
          name: newAsset.name,
          type: newAsset.type,
          serial_number: newAsset.serial_number,
          status: newAsset.assigned_to ? 'assigned' : 'available',
          purchase_date: newAsset.purchase_date,
          purchase_price: parseFloat(newAsset.purchase_price)
        }])
        .select()
        .single();

      if (assetError) throw assetError;

      if (newAsset.assigned_to && asset) {
        const { error: assignmentError } = await supabase
          .from('asset_assignments')
          .insert([{
            asset_id: asset.id,
            employee_id: newAsset.assigned_to,
            assigned_date: new Date().toISOString(),
            notes: `Initial assignment on asset creation`
          }]);

        if (assignmentError) throw assignmentError;
      }

      await onSuccess();
      onClose();
      setNewAsset({
        name: '',
        type: 'laptop',
        serial_number: '',
        status: 'available',
        purchase_date: new Date().toISOString().split('T')[0],
        purchase_price: '',
        assigned_to: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding the asset');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">Add New Asset</h3>
                <form onSubmit={handleAddAsset} className="mt-4 space-y-4">
                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Asset Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={newAsset.name}
                      onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={newAsset.type}
                      onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="laptop">Laptop</option>
                      <option value="desktop">Desktop</option>
                      <option value="mobile">Mobile Device</option>
                      <option value="tablet">Tablet</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700">
                      Serial Number
                    </label>
                    <input
                      type="text"
                      name="serial_number"
                      id="serial_number"
                      value={newAsset.serial_number}
                      onChange={(e) => setNewAsset({ ...newAsset, serial_number: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700">
                      Assign To (Optional)
                    </label>
                    <SearchableSelect
                      options={employees}
                      value={newAsset.assigned_to}
                      onChange={(value) => setNewAsset({ ...newAsset, assigned_to: value })}
                      getOptionLabel={(employee) => employee.name}
                      getOptionValue={(employee) => employee.id}
                      placeholder="Search employees..."
                    />
                  </div>
                  <div>
                    <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      name="purchase_date"
                      id="purchase_date"
                      value={newAsset.purchase_date}
                      onChange={(e) => setNewAsset({ ...newAsset, purchase_date: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="purchase_price" className="block text-sm font-medium text-gray-700">
                      Purchase Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="purchase_price"
                      id="purchase_price"
                      value={newAsset.purchase_price}
                      onChange={(e) => setNewAsset({ ...newAsset, purchase_price: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Add Asset
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}