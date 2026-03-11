import {AsgardeoProvider, OrganizationContext} from '@asgardeo/nextjs/server';
import OrgInstancePanel from '@/components/MultiInstance/OrgInstancePanel';
import OrgContextPanel from '@/components/MultiInstance/OrgContextPanel';
import {ArrowLeft} from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/Header/Header';

/**
 * Multi-Instance Demo Page
 *
 * Demonstrates §12.4 "Multi-Instance — Two Providers" from the Next.js SDK docs.
 *
 * Two sibling <AsgardeoProvider> components are rendered at the same level,
 * each with a different instanceId and (optionally) different Asgardeo org config.
 *
 * - useAsgardeo() inside each section reads from its nearest ancestor provider.
 * - Each instance writes to its own session cookie.
 * - Signing in/out of one instance does not affect the other.
 */
export default function MultiInstancePage() {
  // Instance 0 — Primary org (uses the standard env vars)
  const orgABaseUrl = process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL ?? '';
  const orgAClientId = process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID ?? '';
  const orgAClientSecret = process.env.ASGARDEO_CLIENT_SECRET ?? '';

  // Instance 1 — Secondary org (use _2 vars; falls back to primary if not set)
  const orgBBaseUrl = process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL_2 ?? orgABaseUrl;
  const orgBClientId = process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID_2 ?? orgAClientId;
  const orgBClientSecret = process.env.ASGARDEO_CLIENT_SECRET_2 ?? orgAClientSecret;
  const orgBAfterSignInUrl = process.env.NEXT_PUBLIC_ASGARDEO_2_AFTER_SIGN_IN_URL;

  // Instance 2 — Child organization context (organization_switch from Instance 0)
  const targetOrgId = process.env.ASGARDEO_TARGET_ORG_ID ?? '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Multi-Instance Provider Demo</h1>
          <p className="text-gray-600">
            Demonstrates how two sibling{' '}
            <code className="font-mono text-sm bg-gray-100 px-1 rounded">AsgardeoProvider</code> components work, each with
            an isolated session and an independent sign-in flow.
          </p>
        </div>

        {/* Explainer banner */}
        {/* <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-sm text-blue-800">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">How this works</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>
                Each panel is wrapped by its own{' '}
                <code className="font-mono bg-blue-100 px-1 rounded">{'<AsgardeoProvider instanceId={N}>'}</code>.
              </li>
              <li>
                <code className="font-mono bg-blue-100 px-1 rounded">useAsgardeo()</code> reads from the nearest
                ancestor provider — so each panel sees only its own session.
              </li>
              <li>Each instance uses a separate session cookie (see the footer of each panel).</li>
              <li>Signing in or out of one instance does not affect the other.</li>
            </ul>
          </div>
        </div> */}

        {/* Two sibling providers usage pattern*/}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* ── Instance 0: Primary Organization in root provider ── */}
            <OrgInstancePanel instanceId={0} label="Primary Organization" baseUrl={orgABaseUrl} />

          {/* ── Instance 1: Partner Organization ── */}
          <AsgardeoProvider
            instanceId={1}
            baseUrl={orgBBaseUrl}
            clientId={orgBClientId}
            clientSecret={orgBClientSecret}
            afterSignInUrl={orgBAfterSignInUrl}
            preferences={{theme:{inheritFromBranding: false}}}
          >
            <OrgInstancePanel instanceId={1} label="Partner Organization" baseUrl={orgBBaseUrl} />
          </AsgardeoProvider>
        </div>

        {/* ── OrganizationContext: Child Org via organization_switch ── */}
        <div className="mt-8">
          <h2 className="text-base font-semibold text-gray-700 mb-1">Organization Context</h2>
          <p className="text-sm text-gray-500 mb-4">
            <code className="font-mono bg-gray-100 px-1 rounded">OrganizationContext</code> automatically performs an{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">organization_switch</code> token exchange once the
            parent (Instance 0) is signed in, providing an isolated session for the child organization.
          </p>
          <div className="max-w-sm">
            {targetOrgId ? (
              <OrganizationContext instanceId={2} targetOrganizationId={targetOrgId}>
                <OrgContextPanel instanceId={2} targetOrganizationId={targetOrgId} />
              </OrganizationContext>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-400">
                Set <code className="font-mono bg-gray-100 px-1 rounded">ASGARDEO_TARGET_ORG_ID</code> in{' '}
                <code className="font-mono bg-gray-100 px-1 rounded">.env.local</code> to enable this demo.
              </div>
            )}
          </div>
        </div>

        {/* Code snippet */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Pattern used (layout.tsx)</h2>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto leading-relaxed">
            {`// ── Sibling providers (independent sessions) ──
<AsgardeoProvider instanceId={0} baseUrl={orgABaseUrl} clientId={...} clientSecret={...}>
  <OrgInstancePanel label="Primary Organization" />
</AsgardeoProvider>

<AsgardeoProvider instanceId={1} baseUrl={orgBBaseUrl} clientId={...} clientSecret={...}>
  <OrgInstancePanel label="Partner Organization" />
</AsgardeoProvider>

// ── Organization context (child org via organization_switch) ──
// Must be nested inside the parent AsgardeoProvider (instanceId=0 in layout.tsx).
<OrganizationContext instanceId={2} targetOrganizationId="<child-org-id>">
  {/* useAsgardeo() here reads the child org session */}
  <OrgContextPanel instanceId={2} targetOrganizationId="<child-org-id>" />
</OrganizationContext>`}
          </pre>
        </div>

        {/* Env var guidance */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <p className="font-semibold mb-1">Configure a second Asgardeo org</p>
          <p className="text-amber-700 mb-2">
            Add these to your <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code> to point Instance
            1 at a different organization or to enable the OrganizationContext demo:
          </p>
          <pre className="bg-amber-100 rounded p-3 text-xs font-mono text-amber-900 overflow-x-auto">
            {`NEXT_PUBLIC_ASGARDEO_BASE_URL_2=https://api.asgardeo.io/t/<partner_org>
NEXT_PUBLIC_ASGARDEO_CLIENT_ID_2=<partner_client_id>
ASGARDEO_CLIENT_SECRET_2=<partner_client_secret>

# OrganizationContext demo — child org to switch into from Instance 0
ASGARDEO_TARGET_ORG_ID=<child_organization_id>`}
          </pre>
          <p className="text-amber-700 mt-2 text-xs">
            When these are not set, Instance 1 falls back to the same org as Instance 0 — useful for local testing.
          </p>
        </div>
      </div>
    </div>
  );
}
