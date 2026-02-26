'use client';

import { Link } from 'react-router';
import { Plus } from 'lucide-react';
import { OrganizationList } from '@asgardeo/react';

export default function Organizations() {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
            <p className="text-gray-600 mt-2">Manage your organizations and switch between them</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/organizations/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New
            </Link>
            <Link
              to="/organizations-manager"
              className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg- hover:bg-blue-50"
            >
              Organization Manager
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <OrganizationList />
      </div>
    </div>
  );
}
