'use client';

import {Link} from 'react-router';
import { Plus, Building2, GitBranch, ChevronDown, ChevronUp, Users, Shield, ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Organization {
  id: string;
  name: string;
  organizationId: string;
  handle: string;
  role: string;
  memberCount: number;
  isRoot: boolean;
  level: number;
}

// Mock data for organizations
const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    organizationId: 'org-root-001',
    handle: '@acme',
    role: 'Owner',
    memberCount: 150,
    isRoot: true,
    level: 0,
  },
  {
    id: '2',
    name: 'Engineering Division',
    organizationId: 'org-sub-002',
    handle: '@acme-engineering',
    role: 'Admin',
    memberCount: 45,
    isRoot: false,
    level: 1,
  },
  {
    id: '5',
    name: 'Marketing Division',
    organizationId: 'org-sub-005',
    handle: '@acme-marketing',
    role: 'Member',
    memberCount: 25,
    isRoot: false,
    level: 1,
  },
];

function OrganizationCard({ org }: { org: Organization }) {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Auto-expand root organizations and collapse sub-organizations by default
    setIsExpanded(org.isRoot);
  }, [org.isRoot]);

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`relative ${org.level > 0 ? 'ml-8' : ''}`}>
      {/* Connecting lines for hierarchy */}
      {org.level > 0 && (
        <>
          {/* Horizontal line connecting to vertical line */}
          <div 
            className="absolute left-0 top-8 w-6 h-0.5 bg-gray-300"
            style={{ left: '-24px' }}
          />
        </>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
        {/* Card Header */}
        <div className="p-4 flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`p-2 rounded-lg ${org.isRoot ? 'bg-blue-100' : 'bg-green-100'}`}>
              {org.isRoot ? (
                <Building2 className="h-6 w-6 text-blue-600" />
              ) : (
                <GitBranch className="h-6 w-6 text-green-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
              <p className="text-sm text-gray-500">{org.handle}</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Card Details (collapsible) */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Organization ID
                </p>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                  {org.organizationId}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Your Role
                </p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(org.role)}`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {org.role}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Members
              </p>
              <div className="flex items-center text-sm text-gray-900">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                {org.memberCount} {org.memberCount === 1 ? 'member' : 'members'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrganizationsManager() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organization Manager</h1>
            <p className="text-gray-600 mt-2">Manage all organizations at one place</p>
          </div>
          <Link
            to="/organizations"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Organizations
          </Link>
        </div>

        {/* Organizations List with Hierarchy */}
        <div className="relative">
          {/* Vertical connecting line for hierarchy */}
          <div 
            className="absolute left-2 top-0 w-0.5 bg-gray-300"
            style={{ height: 'calc(100% - 50px)' }}
          />
          
          <div className="space-y-4">
            {mockOrganizations.map((org) => (
              <OrganizationCard key={org.id} org={org} />
            ))}
          </div>
        </div>

        {/* Empty State (shown when no organizations) */}
        {mockOrganizations.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new organization.</p>
            <div className="mt-6">
              <Link
                to="/organizations/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Organization
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
