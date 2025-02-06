export const getAssetStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'available': return 'bg-green-100 text-green-800';
    case 'assigned': return 'bg-blue-100 text-blue-800';
    case 'maintenance': return 'bg-yellow-100 text-yellow-800';
    case 'retired': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};