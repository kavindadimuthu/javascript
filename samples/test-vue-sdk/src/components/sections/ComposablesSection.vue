<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  useAsgardeo,
  useUser,
  useOrganization,
  useBranding,
  useTheme,
  useI18n,
  useFlow,
  Card,
  Typography,
  Button,
  Alert,
  SignedIn,
  SignedOut,
} from '@asgardeo/vue';

// Main useAsgardeo composable
const {
  isSignedIn,
  isLoading,
  isInitialized,
  user,
  organization,
  signIn,
  signOut,
  signUp,
  signInSilently,
  getAccessToken,
  getIdToken,
  clearSession,
} = useAsgardeo();

// User composable
const userComposable = useUser();
// Use the user from useAsgardeo instead since userComposable might not have user property
// const userInfo = userComposable.user;

// Organization composable
const organizationComposable = useOrganization();

// Branding composable
const brandingComposable = useBranding();

// Theme composable
const themeComposable = useTheme();

// I18n composable
const { t } = useI18n();
const currentLanguage = ref('en');

// Flow composable
const flowComposable = useFlow();

// Action loading states
const actionLoading = reactive({
  signIn: false,
  signOut: false,
  signUp: false,
  signInSilently: false,
  getAccessToken: false,
  getIdToken: false,
  clearSession: false,
});

// Action results
const actionResults = ref<Array<{ timestamp: string; action: string; result: string }>>([]);

const addActionResult = (action: string, result: any) => {
  actionResults.value.push({
    timestamp: new Date().toLocaleTimeString(),
    action,
    result: typeof result === 'object' ? JSON.stringify(result) : String(result),
  });
};

const clearActionResults = () => {
  actionResults.value = [];
};

// Test functions for useAsgardeo
const testSignIn = async () => {
  actionLoading.signIn = true;
  try {
    const result = await signIn();
    addActionResult('signIn', result || 'Success');
  } catch (error: any) {
    addActionResult('signIn', `Error: ${error.message}`);
  } finally {
    actionLoading.signIn = false;
  }
};

const testSignOut = async () => {
  actionLoading.signOut = true;
  try {
    await signOut();
    addActionResult('signOut', 'Success');
  } catch (error: any) {
    addActionResult('signOut', `Error: ${error.message}`);
  } finally {
    actionLoading.signOut = false;
  }
};

const testSignUp = async () => {
  actionLoading.signUp = true;
  try {
    const result = await signUp();
    addActionResult('signUp', result || 'Success');
  } catch (error: any) {
    addActionResult('signUp', `Error: ${error.message}`);
  } finally {
    actionLoading.signUp = false;
  }
};

const testSignInSilently = async () => {
  actionLoading.signInSilently = true;
  try {
    const result = await signInSilently();
    addActionResult('signInSilently', result || 'Success');
  } catch (error: any) {
    addActionResult('signInSilently', `Error: ${error.message}`);
  } finally {
    actionLoading.signInSilently = false;
  }
};

const testGetAccessToken = async () => {
  actionLoading.getAccessToken = true;
  try {
    const token = await getAccessToken();
    addActionResult('getAccessToken', token ? 'Token received' : 'No token');
  } catch (error: any) {
    addActionResult('getAccessToken', `Error: ${error.message}`);
  } finally {
    actionLoading.getAccessToken = false;
  }
};

const testGetIdToken = async () => {
  actionLoading.getIdToken = true;
  try {
    const token = await getIdToken();
    addActionResult('getIdToken', token ? 'Token received' : 'No token');
  } catch (error: any) {
    addActionResult('getIdToken', `Error: ${error.message}`);
  } finally {
    actionLoading.getIdToken = false;
  }
};

const testClearSession = async () => {
  actionLoading.clearSession = true;
  try {
    await clearSession();
    addActionResult('clearSession', 'Session cleared');
  } catch (error: any) {
    addActionResult('clearSession', `Error: ${error.message}`);
  } finally {
    actionLoading.clearSession = false;
  }
};

// User operations
const userLoading = reactive({
  refresh: false,
  update: false,
});

const refreshUserInfo = async () => {
  userLoading.refresh = true;
  // Simulate user refresh
  setTimeout(() => {
    userLoading.refresh = false;
  }, 1000);
};

const updateUserProfile = async () => {
  userLoading.update = true;
  // Simulate profile update
  setTimeout(() => {
    userLoading.update = false;
  }, 1000);
};

// Organization operations
const organizationLoading = reactive({
  getAll: false,
  switch: false,
  create: false,
});

const organizationResults = reactive({
  allOrganizations: null as any,
});

const getAllOrganizations = async () => {
  organizationLoading.getAll = true;
  // Simulate API call
  setTimeout(() => {
    organizationResults.allOrganizations = [
      { id: 'org-1', name: 'Organization 1' },
      { id: 'org-2', name: 'Organization 2' },
    ];
    organizationLoading.getAll = false;
  }, 1000);
};

const switchOrganization = async () => {
  organizationLoading.switch = true;
  // Simulate organization switch
  setTimeout(() => {
    organizationLoading.switch = false;
  }, 1000);
};

const createOrganization = async () => {
  organizationLoading.create = true;
  // Simulate organization creation
  setTimeout(() => {
    organizationLoading.create = false;
  }, 1000);
};

// Branding operations
const brandingLoading = ref(false);
const brandingInfo = ref<any>(null);

const getBrandingInfo = async () => {
  brandingLoading.value = true;
  // Simulate branding API call
  setTimeout(() => {
    brandingInfo.value = {
      logo: 'https://example.com/logo.png',
      primaryColor: '#007bff',
      theme: 'light',
    };
    brandingLoading.value = false;
  }, 1000);
};

// Theme operations
const currentTheme = ref('light');

const setTheme = (theme: string) => {
  currentTheme.value = theme;
  // Here you would typically call the theme composable method
};

// Language operations
const changeLanguageLocal = (lang: string) => {
  currentLanguage.value = lang;
  // Here you would typically call the i18n composable method
  console.log('Language changed to:', lang);
};

// Flow operations
const flowLoading = ref(false);
const flowInfo = ref<any>(null);

const getFlowInfo = async () => {
  flowLoading.value = true;
  // Simulate flow API call
  setTimeout(() => {
    flowInfo.value = {
      currentFlow: 'authentication',
      step: 1,
      totalSteps: 3,
    };
    flowLoading.value = false;
  }, 1000);
};
</script>

<template>
  <div class="space-y-6">
    <!-- useAsgardeo Composable -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">useAsgardeo Composable</Typography>
        <Typography variant="body1" class="text-gray-600">
          The main composable that provides authentication state, configuration, and actions.
        </Typography>
        
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-3">Authentication State</Typography>
            <div class="grid md:grid-cols-3 gap-4">
              <div class="p-3 border rounded-lg text-center">
                <div class="text-2xl mb-1">{{ isSignedIn ? '✅' : '❌' }}</div>
                <div class="font-medium">isSignedIn</div>
                <div class="text-sm text-gray-500">{{ isSignedIn }}</div>
              </div>
              <div class="p-3 border rounded-lg text-center">
                <div class="text-2xl mb-1">{{ isLoading ? '⏳' : '✅' }}</div>
                <div class="font-medium">isLoading</div>
                <div class="text-sm text-gray-500">{{ isLoading }}</div>
              </div>
              <div class="p-3 border rounded-lg text-center">
                <div class="text-2xl mb-1">{{ isInitialized ? '✅' : '❌' }}</div>
                <div class="font-medium">isInitialized</div>
                <div class="text-sm text-gray-500">{{ isInitialized }}</div>
              </div>
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-3">Available Actions</Typography>
            <div class="space-y-3">
              <div class="flex gap-3 flex-wrap">
                <Button @click="testSignIn" :loading="actionLoading.signIn">
                  Test signIn()
                </Button>
                <Button @click="testSignOut" :loading="actionLoading.signOut" variant="outline">
                  Test signOut()
                </Button>
                <Button @click="testSignUp" :loading="actionLoading.signUp" variant="outline">
                  Test signUp()
                </Button>
                <Button @click="testSignInSilently" :loading="actionLoading.signInSilently" variant="outline">
                  Test signInSilently()
                </Button>
              </div>
              <div class="flex gap-3 flex-wrap">
                <Button @click="testGetAccessToken" :loading="actionLoading.getAccessToken" size="small">
                  getAccessToken()
                </Button>
                <Button @click="testGetIdToken" :loading="actionLoading.getIdToken" size="small">
                  getIdToken()
                </Button>
                <Button @click="testClearSession" :loading="actionLoading.clearSession" size="small">
                  clearSession()
                </Button>
              </div>
            </div>
            
            <div v-if="actionResults.length > 0" class="mt-4">
              <Typography variant="h5" class="mb-2">Action Results</Typography>
              <div class="bg-gray-900 text-green-400 p-3 rounded-lg max-h-40 overflow-y-auto">
                <div v-for="(result, index) in actionResults.slice().reverse()" :key="index" class="text-sm font-mono">
                  [{{ result.timestamp }}] {{ result.action }}: {{ result.result }}
                </div>
              </div>
              <Button @click="clearActionResults" variant="ghost" size="small" class="mt-2">
                Clear Results
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- useUser Composable -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">useUser Composable</Typography>
        <Typography variant="body1" class="text-gray-600">
          Provides user profile information and user-related operations.
        </Typography>
        
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-3">User Information</Typography>
            <SignedIn>
              <div class="space-y-3">
                <div class="flex gap-3 flex-wrap">
                  <Button @click="refreshUserInfo" :loading="userLoading.refresh">
                    Refresh User Info
                  </Button>
                  <Button @click="updateUserProfile" :loading="userLoading.update">
                    Update Profile
                  </Button>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <Typography variant="h5" class="mb-2">Basic Info</Typography>
                      <div class="space-y-2 text-sm">
                        <div><strong>Name:</strong> {{ user?.name?.givenName }} {{ user?.name?.familyName }}</div>
                        <div><strong>Email:</strong> {{ user?.email || 'N/A' }}</div>
                        <div><strong>Username:</strong> {{ user?.username || 'N/A' }}</div>
                        <div><strong>ID:</strong> {{ user?.sub || user?.id || 'N/A' }}</div>
                      </div>
                    </div>
                    <div>
                      <Typography variant="h5" class="mb-2">Raw User Object</Typography>
                      <pre class="bg-white border p-2 rounded text-xs overflow-auto max-h-32">{{ JSON.stringify(user, null, 2) }}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </SignedIn>
            <SignedOut>
              <Alert variant="info">Sign in to see user information</Alert>
            </SignedOut>
          </div>
        </div>
      </div>
    </Card>

    <!-- useOrganization Composable -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">useOrganization Composable</Typography>
        <Typography variant="body1" class="text-gray-600">
          Manages organization context and provides organization-related operations.
        </Typography>
        
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-3">Organization Operations</Typography>
            <SignedIn>
              <div class="space-y-3">
                <div class="flex gap-3 flex-wrap">
                  <Button @click="getAllOrganizations" :loading="organizationLoading.getAll">
                    Get All Organizations
                  </Button>
                  <Button @click="switchOrganization" :loading="organizationLoading.switch">
                    Switch Organization
                  </Button>
                  <Button @click="createOrganization" :loading="organizationLoading.create">
                    Create Organization
                  </Button>
                </div>
                
                <div v-if="organizationResults.allOrganizations" class="bg-gray-50 p-4 rounded-lg">
                  <Typography variant="h5" class="mb-2">All Organizations</Typography>
                  <pre class="bg-white border p-2 rounded text-xs overflow-auto max-h-32">{{ JSON.stringify(organizationResults.allOrganizations, null, 2) }}</pre>
                </div>
                
                <div v-if="organization" class="bg-gray-50 p-4 rounded-lg">
                  <Typography variant="h5" class="mb-2">Current Organization</Typography>
                  <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2 text-sm">
                      <div><strong>Name:</strong> {{ organization?.name || 'N/A' }}</div>
                      <div><strong>ID:</strong> {{ organization?.id || 'N/A' }}</div>
                    </div>
                    <pre class="bg-white border p-2 rounded text-xs overflow-auto max-h-20">{{ JSON.stringify(organization, null, 2) }}</pre>
                  </div>
                </div>
              </div>
            </SignedIn>
            <SignedOut>
              <Alert variant="info">Sign in to see organization information</Alert>
            </SignedOut>
          </div>
        </div>
      </div>
    </Card>

    <!-- useBranding & useTheme Composables -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">useBranding & useTheme Composables</Typography>
        <Typography variant="body1" class="text-gray-600">
          Handle branding and theme customization for the application.
        </Typography>
        
        <div class="space-y-4">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <Typography variant="h4" class="mb-3">Branding</Typography>
              <div class="space-y-3">
                <Button @click="getBrandingInfo" :loading="brandingLoading">
                  Get Branding Info
                </Button>
                <div v-if="brandingInfo" class="bg-gray-50 p-3 rounded-lg">
                  <pre class="text-xs overflow-auto max-h-32">{{ JSON.stringify(brandingInfo, null, 2) }}</pre>
                </div>
              </div>
            </div>
            
            <div>
              <Typography variant="h4" class="mb-3">Theme</Typography>
              <div class="space-y-3">
                <div class="flex gap-2">
                  <Button @click="setTheme('light')" size="small" :class="{ 'bg-blue-500 text-white': currentTheme === 'light' }">
                    Light
                  </Button>
                  <Button @click="setTheme('dark')" size="small" :class="{ 'bg-blue-500 text-white': currentTheme === 'dark' }">
                    Dark
                  </Button>
                  <Button @click="setTheme('auto')" size="small" :class="{ 'bg-blue-500 text-white': currentTheme === 'auto' }">
                    Auto
                  </Button>
                </div>
                <div class="text-sm">
                  <strong>Current Theme:</strong> {{ currentTheme }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- useI18n & useFlow Composables -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">useI18n & useFlow Composables</Typography>
        <Typography variant="body1" class="text-gray-600">
          Internationalization and flow management composables.
        </Typography>
        
        <div class="space-y-4">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <Typography variant="h4" class="mb-3">Internationalization</Typography>
              <div class="space-y-3">
                <div class="flex gap-2 flex-wrap">
                  <Button @click="changeLanguageLocal('en')" size="small" :class="{ 'bg-blue-500 text-white': currentLanguage === 'en' }">
                    English
                  </Button>
                  <Button @click="changeLanguageLocal('es')" size="small" :class="{ 'bg-blue-500 text-white': currentLanguage === 'es' }">
                    Español
                  </Button>
                  <Button @click="changeLanguageLocal('fr')" size="small" :class="{ 'bg-blue-500 text-white': currentLanguage === 'fr' }">
                    Français
                  </Button>
                </div>
                <div class="text-sm">
                  <strong>Current Language:</strong> {{ currentLanguage }}
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                  <div class="text-sm">
                    <div><strong>Sample Translation:</strong> {{ t('elements.buttons.signin.text') }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Typography variant="h4" class="mb-3">Flow Management</Typography>
              <div class="space-y-3">
                <Button @click="getFlowInfo" :loading="flowLoading">
                  Get Flow Info
                </Button>
                <div v-if="flowInfo" class="bg-gray-50 p-3 rounded-lg">
                  <pre class="text-xs overflow-auto max-h-32">{{ JSON.stringify(flowInfo, null, 2) }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Composable Usage Examples -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Composable Usage Examples</Typography>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-3">Code Examples</Typography>
            <div class="space-y-4">
              <div>
                <Typography variant="h5" class="mb-2">Basic Authentication Check</Typography>
                <pre class="bg-gray-900 text-green-400 p-3 rounded-lg text-sm overflow-auto"><code>import { useAsgardeo } from '@asgardeo/vue';

const { isSignedIn, user, signIn, signOut } = useAsgardeo();

// Watch for authentication changes
watch(isSignedIn, (signedIn) => {
  if (signedIn) {
    console.log('User signed in:', user.value);
  } else {
    console.log('User signed out');
  }
});</code></pre>
              </div>

              <div>
                <Typography variant="h5" class="mb-2">Organization Management</Typography>
                <pre class="bg-gray-900 text-green-400 p-3 rounded-lg text-sm overflow-auto"><code>import { useOrganization } from '@asgardeo/vue';

const { 
  organization, 
  getAllOrganizations, 
  switchOrganization 
} = useOrganization();

// Get all organizations
const orgs = await getAllOrganizations();

// Switch to a specific organization
await switchOrganization('org-id-123');</code></pre>
              </div>

              <div>
                <Typography variant="h5" class="mb-2">User Profile Updates</Typography>
                <pre class="bg-gray-900 text-green-400 p-3 rounded-lg text-sm overflow-auto"><code>import { useUser } from '@asgardeo/vue';

const { user, updateProfile } = useUser();

// Update user profile
await updateProfile({
  name: {
    givenName: 'John',
    familyName: 'Doe'
  },
  email: 'john.doe@example.com'
});</code></pre>
              </div>

              <div>
                <Typography variant="h5" class="mb-2">Internationalization</Typography>
                <pre class="bg-gray-900 text-green-400 p-3 rounded-lg text-sm overflow-auto"><code>import { useI18n } from '@asgardeo/vue';

const { t, changeLanguage, currentLanguage } = useI18n();

// Get translated text
const signInText = t('elements.buttons.signin.text');

// Change language
await changeLanguage('es');</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- All Composables Summary -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">All Available Composables</Typography>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <div class="p-3 border rounded-lg">
              <Typography variant="h5" class="mb-1">useAsgardeo</Typography>
              <Typography variant="body2" class="text-gray-600">Main authentication composable</Typography>
            </div>
            <div class="p-3 border rounded-lg">
              <Typography variant="h5" class="mb-1">useUser</Typography>
              <Typography variant="body2" class="text-gray-600">User profile and operations</Typography>
            </div>
            <div class="p-3 border rounded-lg">
              <Typography variant="h5" class="mb-1">useOrganization</Typography>
              <Typography variant="body2" class="text-gray-600">Organization management</Typography>
            </div>
            <div class="p-3 border rounded-lg">
              <Typography variant="h5" class="mb-1">useBranding</Typography>
              <Typography variant="body2" class="text-gray-600">Branding customization</Typography>
            </div>
          </div>
          <div class="space-y-2">
            <div class="p-3 border rounded-lg">
              <Typography variant="h5" class="mb-1">useTheme</Typography>
              <Typography variant="body2" class="text-gray-600">Theme management</Typography>
            </div>
            <div class="p-3 border rounded-lg">
              <Typography variant="h5" class="mb-1">useI18n</Typography>
              <Typography variant="body2" class="text-gray-600">Internationalization</Typography>
            </div>
            <div class="p-3 border rounded-lg">
              <Typography variant="h5" class="mb-1">useFlow</Typography>
              <Typography variant="body2" class="text-gray-600">Authentication flow management</Typography>
            </div>
            <div class="p-3 border rounded-lg">
              <Typography variant="h5" class="mb-1">useFlowMeta</Typography>
              <Typography variant="body2" class="text-gray-600">Flow metadata and configuration</Typography>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>