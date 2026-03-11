'use client';

import {useAsgardeo} from '@asgardeo/nextjs';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {CheckCircle, Loader2, User, XCircle} from 'lucide-react';

interface OrgContextPanelProps {
  instanceId: number;
  targetOrganizationId: string;
}

/**
 * Displays the authentication state of a child organization context.
 *
 * Must be rendered inside an <OrganizationContext> server component so that
 * useAsgardeo() reads from the child org's AsgardeoClientProvider.
 *
 * Authentication is automatic — when the parent provider (instanceId=0) is
 * signed in, OrganizationContextController performs an `organization_switch`
 * token exchange and stores the result in a dedicated session cookie for this
 * child instance.
 */
export default function OrgContextPanel({instanceId, targetOrganizationId}: OrgContextPanelProps) {
  const {user, isSignedIn, isLoading} = useAsgardeo();

  return (
    <Card className="border-2 border-emerald-400 bg-emerald-50 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-800">Child Organization Context</CardTitle>
          <Badge variant="outline" className="text-xs font-mono bg-emerald-100 text-emerald-800 border-emerald-200">
            instanceId={instanceId}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 font-mono truncate" title={targetOrganizationId}>
          org: {targetOrganizationId || '(not configured)'}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Session status */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : isSignedIn ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-gray-400" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {isLoading
              ? 'Switching organization context…'
              : isSignedIn
                ? 'Authenticated'
                : 'Waiting for parent sign-in'}
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

        {/* How it works note */}
        <p className="text-xs text-gray-500 italic">
          Auto-switches when Instance 0 is signed in via{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">organization_switch</code> grant.
        </p>

        {/* Cookie info */}
        <p className="text-xs text-gray-400 font-mono">
          cookie: {`__asgardeo__session.${instanceId}`}
        </p>
      </CardContent>
    </Card>
  );
}
