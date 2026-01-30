# Parent-Sub Organization Coordination

## Problem Statement

When both parent and sub-organization `AsgardeoProvider` components mount simultaneously, they attempt to authenticate independently without coordination. This causes a race condition where the sub-organization provider tries to perform token exchange before the parent has completed authentication, resulting in failure.

## Solution Overview

The implementation adds a coordination mechanism that:

1. **Tracks authentication status** across multiple provider instances using sessionStorage
2. **Delays sub-org authentication** until parent completes sign-in
3. **Provides helper utilities** for checking parent instance readiness
4. **Handles errors gracefully** with timeouts and proper error messages

## Implementation Details

### 1. Instance Status Tracking (`instance-coordination.ts`)

A new utility module provides functions to track and coordinate authentication status:

- **`setInstanceStatus(instanceId, status)`**: Records an instance's current auth state
- **`getInstanceStatus(instanceId)`**: Retrieves an instance's status
- **`waitForParentAuthentication(parentInstanceId, timeout)`**: Polls parent status until authenticated or timeout
- **`clearInstanceStatus(instanceId)`**: Cleanup function

Status transitions:
- `initializing` → Provider is mounting
- `authenticating` → OAuth flow in progress (parent only)
- `authenticated` → Successfully signed in
- `failed` → Authentication failed
- `idle` → No active authentication

### 2. Updated AsgardeoProvider

The provider now:

1. **Sets initial status** on mount
2. **Waits for parent** if `parentInstanceId` and `organizationId` are provided
3. **Updates status** throughout the authentication lifecycle
4. **Cleans up** status on unmount

Key changes:
```tsx
// Set initial status
setInstanceStatus(instanceId, 'initializing');

// For sub-org providers, wait for parent
if (organizationId && parentInstanceId !== undefined) {
  const parentReady = await waitForParentAuthentication(parentInstanceId);
  if (!parentReady) {
    throw new Error('Parent authentication failed or timed out');
  }
  // Proceed with token exchange...
}

// Cleanup on unmount
return () => {
  clearInstanceStatus(instanceId);
};
```

### 3. AsgardeoReactClient Enhancements

Added helper methods:

- **`isParentReady(parentInstanceId)`**: Non-blocking check if parent is authenticated
- **`getParentAccessToken(parentInstanceId)`**: Safely retrieves parent's access token

## Usage Example

```tsx
import { AsgardeoProvider } from '@asgardeo/react';

function App() {
  return (
    <>
      {/* Parent Organization Provider */}
      <AsgardeoProvider
        clientId="parent-client-id"
        baseUrl="https://api.asgardeo.io/t/parentorg"
        instanceId={0}
      >
        <ParentOrgApp />
      </AsgardeoProvider>

      {/* Sub-Organization Provider */}
      {/* Automatically waits for parent (instanceId: 0) to authenticate */}
      <AsgardeoProvider
        clientId="parent-client-id"
        baseUrl="https://api.asgardeo.io/t/parentorg/o/suborg"
        instanceId={1}
        parentInstanceId={0}
        organizationId="sub-org-id"
      >
        <SubOrgApp />
      </AsgardeoProvider>
    </>
  );
}
```

## Flow Diagram

```
┌─────────────────────┐
│ Parent Provider (0) │
│   initializing      │
└──────────┬──────────┘
           │
           ├─ Initialize SDK
           ├─ Set status: authenticating
           ├─ OAuth sign-in flow
           │
           ▼
┌─────────────────────┐        ┌────────────────────┐
│ Parent Provider (0) │        │ Sub Provider (1)   │
│   authenticating    │◄───────┤  initializing      │
└──────────┬──────────┘  polls │  (waiting...)      │
           │                    └────────────────────┘
           ├─ Complete OAuth
           ├─ Set status: authenticated
           │
           ▼
┌─────────────────────┐        ┌────────────────────┐
│ Parent Provider (0) │        │ Sub Provider (1)   │
│   authenticated     │───────►│  detected parent   │
└─────────────────────┘ ready  └──────────┬─────────┘
                                           │
                                           ├─ Get parent token
                                           ├─ Exchange for sub-org token
                                           ├─ Set status: authenticated
                                           │
                                           ▼
                                ┌────────────────────┐
                                │ Sub Provider (1)   │
                                │  authenticated     │
                                └────────────────────┘
```

## Configuration

### Timeout Settings

Default timeout is 30 seconds, configurable via `waitForParentAuthentication`:

```typescript
const parentReady = await waitForParentAuthentication(
  parentInstanceId,
  45000, // 45 second timeout
  200    // Poll every 200ms
);
```

### Error Handling

The implementation throws descriptive errors:

- **Parent timeout**: "Parent authentication timed out"
- **Parent not authenticated**: "Parent instance is not signed in"
- **Token retrieval failure**: "Cannot retrieve parent access token"

All errors are logged to console with context.

## Benefits

1. **Eliminates race conditions** between parent and child providers
2. **Automatic coordination** - no manual intervention needed
3. **Configurable timeouts** prevent infinite waiting
4. **Clear error messages** for debugging
5. **Backward compatible** - works with existing single-provider setups
6. **Clean architecture** - status tracking is isolated in utility module

## Testing Considerations

When testing multi-instance scenarios:

1. Mock `sessionStorage` to simulate cross-instance communication
2. Test timeout scenarios by delaying parent authentication
3. Verify cleanup on unmount to prevent status leaks
4. Test with multiple sequential mount/unmount cycles (React StrictMode)

## Limitations

- Uses `sessionStorage` (cleared when tab closes)
- 30-second default timeout (may need adjustment for slow networks)
- Polling-based (could be optimized with custom events if needed)

## Future Enhancements

Potential improvements:

1. Custom events instead of polling for better performance
2. Persistent status tracking across page reloads (localStorage)
3. Visual loading states for sub-org providers waiting on parent
4. Metrics/telemetry for coordination timing
