import { useState } from 'react';
import { createSuperAdmin } from '@/utils/createSuperAdmin';

export default function SetupAdmin() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleCreateAdmin = async () => {
    setLoading(true);
    try {
      const response = await createSuperAdmin();
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Setup Superadmin Account</h1>
      <div className="p-4 border rounded mb-4 bg-yellow-50">
        <p className="text-amber-800 mb-2">
          <strong>Warning:</strong> This page will create a superadmin account with the following credentials:
        </p>
        <ul className="list-disc pl-5 text-amber-700">
          <li><strong>Email:</strong> superadmin@campuscore.edu</li>
          <li><strong>Password:</strong> Password123!</li>
          <li><strong>Role:</strong> super_admin</li>
        </ul>
      </div>
      
      <button 
        onClick={handleCreateAdmin}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Superadmin Account'}
      </button>
      
      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded overflow-auto max-h-[400px]">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
