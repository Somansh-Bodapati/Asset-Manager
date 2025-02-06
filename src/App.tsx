import React, { useState, useEffect } from 'react';
import { Package, Laptop2, Users } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { Asset, Employee, Assignment } from './types';
import { AddAssetModal } from './components/AddAssetModal';
import { AddEmployeeModal } from './components/AddEmployeeModal';
import { AssetsTable } from './components/AssetsTable';
import { EmployeesTable } from './components/EmployeesTable';

function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState('assets');
  const [loading, setLoading] = useState(true);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [assetsData, employeesData, assignmentsData] = await Promise.all([
      supabase.from('assets').select('*'),
      supabase.from('employees').select('*'),
      supabase.from('asset_assignments')
        .select('*, asset:assets(*), employee:employees(*)')
        .order('assigned_date', { ascending: false })
    ]);

    if (assetsData.data) setAssets(assetsData.data);
    if (employeesData.data) setEmployees(employeesData.data);
    if (assignmentsData.data) setAssignments(assignmentsData.data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Package className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">Asset Manager</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('assets')}
                  className={`${
                    activeTab === 'assets'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <Laptop2 className="h-4 w-4 mr-2" />
                  Assets
                </button>
                <button
                  onClick={() => setActiveTab('employees')}
                  className={`${
                    activeTab === 'employees'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Employees
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="px-4 py-6 sm:px-0">
            {activeTab === 'assets' && (
              <AssetsTable
                assets={assets}
                onAddAsset={() => setShowAddAssetModal(true)}
              />
            )}

            {activeTab === 'employees' && (
              <EmployeesTable
                employees={employees}
                assignments={assignments}
                onAddEmployee={() => setShowAddEmployeeModal(true)}
              />
            )}
          </div>
        )}
      </main>

      <AddAssetModal
        isOpen={showAddAssetModal}
        onClose={() => setShowAddAssetModal(false)}
        onSuccess={fetchData}
      />

      <AddEmployeeModal
        isOpen={showAddEmployeeModal}
        onClose={() => setShowAddEmployeeModal(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}

export default App;