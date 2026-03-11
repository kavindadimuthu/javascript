'use client';

import {SignInButton, SignOutButton, useAsgardeo} from '@asgardeo/nextjs';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {CheckCircle, User, XCircle} from 'lucide-react';

interface OrgInstancePanelProps {
  instanceId: number;
  label: string;
  baseUrl: string;
}

/**
 * Demonstrates how `useAsgardeo()` reads from the nearest ancestor AsgardeoProvider.
 * When rendered inside <AsgardeoProvider instanceId={N}>, this component shows
 * the authentication state for that specific provider instance.
 */
export default function OrgInstancePanel({instanceId, label, baseUrl}: OrgInstancePanelProps) {
  const {user, isSignedIn, isLoading} = useAsgardeo();

  const accentClass = instanceId === 0 ? 'border-blue-400 bg-blue-50' : 'border-purple-400 bg-purple-50';
  const badgeClass =
    instanceId === 0
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-purple-100 text-purple-800 border-purple-200';
  const signedInClass = instanceId === 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700';

  return (
    <Card className={`border-2 ${accentClass} h-full`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-800">{label}</CardTitle>
          <Badge variant="outline" className={`text-xs font-mono ${badgeClass}`}>
            instanceId={instanceId}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 font-mono truncate" title={baseUrl}>
          {baseUrl}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Session status */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
          ) : isSignedIn ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-gray-400" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {isLoading ? 'Checking session…' : isSignedIn ? 'Authenticated' : 'Not signed in'}
          </span>
        </div>

        {/* User info */}
        {isSignedIn && user && (
          <div className="rounded-lg bg-white border border-gray-200 p-3 space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">User</span>
            </div>
            {(user.displayName || user.username) && (
              <p className="text-sm font-medium text-gray-800">{user.displayName || user.username}</p>
            )}
            {user.emails?.[0] && <p className="text-xs text-gray-500">{user.emails[0]}</p>}
          </div>
        )}

        {/* Action button */}
        <div className="pt-1">
          {isSignedIn ? (
            <SignOutButton className={`w-full text-white text-sm py-2 px-4 rounded-md ${signedInClass} transition-colors`}>
              Sign out of {label}
            </SignOutButton>
          ) : (
            <SignInButton className={`w-full text-white text-sm py-2 px-4 rounded-md ${signedInClass} transition-colors`}>
              Sign in to {label}
            </SignInButton>
          )}
        </div>

        {/* Cookie info */}
        <p className="text-xs text-gray-400 font-mono">
          cookie: {instanceId === 0 ? '__asgardeo__session' : `__asgardeo__session.${instanceId}`}
        </p>
      </CardContent>
    </Card>
  );
}
