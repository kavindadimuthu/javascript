import { AsgardeoProvider, SignInButton, SignOutButton, useAsgardeo } from "@asgardeo/react";
import { useEffect, useState } from "react";

// Component to display root provider details
function ProviderInfo({ providername, providerid }: { providername: string; providerid: number }) {
    const asgardeo = useAsgardeo();
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userUsername, setUserUsername] = useState<string | null>(null);
    const [organizationName, setOrganizationName] = useState<string | null>(null);
    const [platform, setPlatform] = useState<string | null>(null);
    const [baseUrl, setBaseUrl] = useState<string | null>(null);

    // Check user sign-in status when component mounts
    useEffect(() => {
        setIsSignedIn(!!asgardeo?.isSignedIn);
        setIsLoading(!!asgardeo?.isLoading);
        setIsInitialized(!!asgardeo?.isInitialized);
    }, [asgardeo]);

    // Fetch access token when user is signed in
    useEffect(() => {
        if (asgardeo?.isSignedIn) {
            asgardeo.getAccessToken().then(token => setAccessToken(token));
            setUserEmail(asgardeo?.user?.email || null);
            setUserUsername(asgardeo?.user?.username || null);
            setOrganizationName(asgardeo?.organization?.name || null);
            setPlatform(asgardeo?.platform || null);
            setBaseUrl(asgardeo?.baseUrl || null);
        }
    }, [asgardeo?.isSignedIn]);


    return (
        <div style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "16px", borderRadius: "8px" }}>
            <h2>{providername} Asgardeo Provider (ID: {providerid})</h2>

            {/* Display sign-in or sign-out buttons according to the user's authentication status */}
            {!isSignedIn ? (
                <div className="pb-4"><SignInButton signInOptions={{ prompt: "login" }} /></div>
            ) : (
                <div className="pb-4"><SignOutButton /></div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                <div>
                    <strong>Is Signed In:</strong>
                    <p>{isSignedIn ? "✅ Yes" : "❌ No"}</p>
                </div>
                <div>
                    <strong>Is Loading:</strong>
                    <p>{isLoading ? "⏳ Yes" : "✅ No"}</p>
                </div>
                <div>
                    <strong>Is Initialized:</strong>
                    <p>{isInitialized ? "✅ Yes" : "❌ No"}</p>
                </div>
                <div>
                    <strong>User Email:</strong>
                    <p>{userEmail || "Not available"}</p>
                </div>
                <div>
                    <strong>Access Token:</strong>
                    <p>{accessToken || "Not available"}</p>
                </div>
                <div>
                    <strong>User Username:</strong>
                    <p>{userUsername || "Not available"}</p>
                </div>
                <div>
                    <strong>Organization:</strong>
                    <p>{organizationName || "None"}</p>
                </div>
                <div>
                    <strong>Platform:</strong>
                    <p>{platform || "Not detected"}</p>
                </div>
                <div>
                    <strong>Base URL:</strong>
                    <p style={{ fontSize: "12px", wordBreak: "break-all" }}>{baseUrl || "Not set"}</p>
                </div>
            </div>
        </div>
    );
}

export default function LogPage() {
    return (
        <div style={{ padding: "24px" }}>
            <h1>Nested Asgardeo Providers Support</h1>
            <p style={{ color: "#666", marginBottom: "24px" }}>
                This page demonstrates the support for multiple nested Asgardeo providers with different client IDs.
            </p>

            <div className="flex w-full gap-8 border p-4 rounded-lg">
                <div className="flex-1">
                    <ProviderInfo
                        providername="Root"
                        providerid={0}
                    />
                </div>

                {/* 
                NESTED PROVIDER
                
                KEY POINTS FOR SEPARATE LOGIN:
                1. Different Client ID: Instance 2 uses VITE_ASGARDEO_NESTED_CLIENT_ID (different OAuth app)
                   - This must be registered as a separate application in Asgardeo
                   - Without this, both providers share the same OAuth session
                
                2. Independent Instance: id={2} keeps sessions separated in sessionStorage
                   - config_data-instance_2-{clientId}
                   - session_data-instance_2-{clientId}
                   - Each instance maintains its own tokens and state
                
                3. Different Scopes: Reduced scope for nested provider (optional)
                   - Root: Full organizational scopes
                   - Nested: Minimal scopes (openid profile internal_login)
            */}
                {/* <RootProviderInfo /> */}

                {/* 
                NESTED PROVIDER
                
                KEY POINTS FOR SEPARATE LOGIN:
                1. Different Client ID: Instance 2 uses VITE_ASGARDEO_NESTED_CLIENT_ID (different OAuth app)
                   - This must be registered as a separate application in Asgardeo
                   - Without this, both providers share the same OAuth session
                
                2. Independent Instance: id={2} keeps sessions separated in sessionStorage
                   - config_data-instance_2-{clientId}
                   - session_data-instance_2-{clientId}
                   - Each instance maintains its own tokens and state
                
                3. Different Scopes: Reduced scope for nested provider (optional)
                   - Root: Full organizational scopes
                   - Nested: Minimal scopes (openid profile internal_login)
            */}
                {/* Nested Provider */}
                <div className="flex-1">
                    <AsgardeoProvider
                        id={2}
                        baseUrl={import.meta.env.VITE_ASGARDEO_NESTED_BASE_URL}
                        clientId={import.meta.env.VITE_ASGARDEO_NESTED_CLIENT_ID}
                        afterSignInUrl={import.meta.env.VITE_ASGARDEO_NESTED_AFTER_SIGN_IN_URL}
                        afterSignOutUrl={import.meta.env.VITE_ASGARDEO_NESTED_AFTER_SIGN_OUT_URL}
                        // baseUrl={import.meta.env.VITE_ASGARDEO_BASE_URL}
                        // clientId={import.meta.env.VITE_ASGARDEO_CLIENT_ID}
                        // afterSignInUrl={import.meta.env.VITE_ASGARDEO_AFTER_SIGN_IN_URL}
                        // afterSignOutUrl={import.meta.env.VITE_ASGARDEO_AFTER_SIGN_OUT_URL}
                        scopes="openid profile internal_login"
                    >
                        <ProviderInfo
                            providername="Nested"
                            providerid={1}
                        />
                    </AsgardeoProvider>
                </div>
            </div>

            {/* Support Status */}
            {/* <div style={{ border: "1px solid #ffb84d", padding: "16px", marginTop: "16px", borderRadius: "8px", backgroundColor: "#fffbf0" }}>
        <h3>✨ Nested Providers Support Status</h3>
        <ul>
          <li>✅ Multiple AsgardeoProvider instances are supported</li>
          <li>✅ Each provider can have a unique client ID</li>
          <li>✅ Each provider maintains independent session state</li>
          <li>✅ Context switching works correctly between providers</li>
          <li>✅ Nested providers inherit from parent when no explicit config is provided</li>
        </ul>
      </div> */}
        </div>
    );
}
