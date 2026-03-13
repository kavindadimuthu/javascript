<script setup lang="ts">
import { ref } from 'vue';
import {
  Card,
  Typography,
  Button,
  TextField,
  PasswordField,
  Alert,
  UserComponent,
  BaseUser,
  UserProfileComponent,
  BaseUserProfile,
  UserDropdown,
  BaseUserDropdown,
  OrganizationComponent,
  BaseOrganization,
  OrganizationList,
  BaseOrganizationList,
  OrganizationProfile,
  OrganizationSwitcher,
  BaseOrganizationSwitcher,
  CreateOrganization,
  BaseCreateOrganization,
  SignIn,
  BaseSignIn,
  SignUp,
  InviteUser,
  BaseInviteUser,
  AcceptInvite,
  LanguageSwitcher,
  BaseLanguageSwitcher,
  SignedIn,
  SignedOut,
  ChevronDownIcon,
  BuildingIcon,
} from '@asgardeo/vue';

// Custom Sign In
const customSignInEmail = ref('');
const customSignInPassword = ref('');

// Organization Creation
const newOrgName = ref('');
const newOrgDescription = ref('');

const handleCreateOrg = (createOrganization: Function) => {
  if (newOrgName.value.trim()) {
    createOrganization({
      name: newOrgName.value,
      description: newOrgDescription.value || undefined,
    });
  }
};

// User Invitation
const inviteEmail = ref('');
const inviteRole = ref('');

const handleInviteUser = (inviteUser: Function) => {
  if (inviteEmail.value.trim()) {
    inviteUser({
      email: inviteEmail.value,
      role: inviteRole.value || 'member',
    });
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Section Header -->
    <div class="border-b border-slate-200 pb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Presentation Components</h2>
      <p class="text-gray-600">Complete user interface components</p>
    </div>

    <!-- User Components -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">User Components</Typography>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">User Component</Typography>
            <UserComponent />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Base User Component (Unstyled)</Typography>
            <BaseUser class="p-4 border border-gray-200 rounded">
              <template #avatar="{ user }">
                <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {{ (user?.name?.givenName || user?.username || 'U')[0].toUpperCase() }}
                </div>
              </template>
              <template #default="{ user }">
                <div class="ml-3">
                  <p class="font-medium">{{ user?.name?.givenName }} {{ user?.name?.familyName }}</p>
                  <p class="text-sm text-gray-500">{{ user?.email || user?.username }}</p>
                </div>
              </template>
            </BaseUser>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">User Profile Component</Typography>
            <UserProfileComponent />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Base User Profile (Unstyled)</Typography>
            <BaseUserProfile class="space-y-4 p-4 border border-gray-200 rounded">
              <template #default="{ user, isLoading, error }">
                <div v-if="isLoading" class="text-center py-4">Loading user profile...</div>
                <div v-else-if="error" class="text-red-600">Error: {{ error }}</div>
                <div v-else-if="user" class="space-y-3">
                  <h3 class="text-lg font-semibold">Custom User Profile</h3>
                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <div><strong>Name:</strong> {{ user.name?.givenName }} {{ user.name?.familyName }}</div>
                    <div><strong>Email:</strong> {{ user.email }}</div>
                    <div><strong>Username:</strong> {{ user.username }}</div>
                    <div><strong>ID:</strong> {{ user.sub || user.id }}</div>
                  </div>
                </div>
              </template>
            </BaseUserProfile>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">User Dropdown</Typography>
            <UserDropdown />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Custom User Dropdown</Typography>
            <BaseUserDropdown class="relative inline-block">
              <template #trigger="{ user, isOpen }">
                <button class="flex items-center gap-2 p-2 border rounded hover:bg-gray-50">
                  <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {{ (user?.name?.givenName || 'U')[0].toUpperCase() }}
                  </div>
                  <span class="text-sm">{{ user?.name?.givenName || 'User' }}</span>
                  <ChevronDownIcon class="h-4 w-4" :class="{ 'rotate-180': isOpen }" />
                </button>
              </template>
              <template #content="{ user, signOut }">
                <div class="absolute right-0 mt-1 w-64 bg-white border rounded-lg shadow-lg py-1 z-50">
                  <div class="px-4 py-3 border-b">
                    <p class="font-medium">{{ user?.name?.givenName }} {{ user?.name?.familyName }}</p>
                    <p class="text-sm text-gray-500">{{ user?.email }}</p>
                  </div>
                  <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-50">Profile Settings</a>
                  <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-50">Account Settings</a>
                  <hr class="my-1">
                  <button @click="signOut" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600">
                    Sign Out
                  </button>
                </div>
              </template>
            </BaseUserDropdown>
          </div>
        </div>
      </div>
    </Card>

    <!-- Organization Components -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Organization Components</Typography>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">Organization Component</Typography>
            <OrganizationComponent />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Base Organization (Unstyled)</Typography>
            <BaseOrganization class="p-4 border border-gray-200 rounded">
              <template #default="{ organization, isLoading, error }">
                <div v-if="isLoading" class="text-center py-2">Loading organization...</div>
                <div v-else-if="error" class="text-red-600">Error: {{ error }}</div>
                <div v-else-if="organization" class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-600 rounded text-white flex items-center justify-center font-bold">
                    {{ organization.name?.[0]?.toUpperCase() || 'O' }}
                  </div>
                  <div>
                    <p class="font-medium">{{ organization.name }}</p>
                    <p class="text-sm text-gray-500">{{ organization.id }}</p>
                  </div>
                </div>
              </template>
            </BaseOrganization>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Organization List</Typography>
            <OrganizationList />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Custom Organization List</Typography>
            <BaseOrganizationList class="space-y-2">
              <template #default="{ organizations, isLoading, error, switchOrganization }">
                <div v-if="isLoading" class="text-center py-4">Loading organizations...</div>
                <div v-else-if="error" class="text-red-600">Error: {{ error }}</div>
                <div v-else-if="organizations?.length" class="grid gap-2">
                  <div
                    v-for="org in organizations"
                    :key="org.id"
                    @click="switchOrganization(org.id)"
                    class="p-3 border rounded cursor-pointer hover:bg-gray-50 flex items-center gap-3"
                  >
                    <div class="w-8 h-8 bg-indigo-600 rounded text-white flex items-center justify-center font-bold text-sm">
                      {{ org.name?.[0]?.toUpperCase() || 'O' }}
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-sm">{{ org.name }}</p>
                      <p class="text-xs text-gray-500">{{ org.id }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="text-gray-500 text-center py-4">No organizations found</div>
              </template>
            </BaseOrganizationList>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Organization Profile</Typography>
            <OrganizationProfile />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Organization Switcher</Typography>
            <OrganizationSwitcher />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Custom Organization Switcher</Typography>
            <BaseOrganizationSwitcher class="relative inline-block">
              <template #trigger="{ currentOrganization, isOpen }">
                <button class="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 min-w-48">
                  <BuildingIcon class="h-4 w-4 text-gray-400" />
                  <span class="text-sm flex-1 text-left">
                    {{ currentOrganization?.name || 'Select Organization' }}
                  </span>
                  <ChevronDownIcon class="h-4 w-4 text-gray-400" :class="{ 'rotate-180': isOpen }" />
                </button>
              </template>
              <template #content="{ organizations, switchOrganization, currentOrganization }">
                <div class="absolute top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-lg py-1 z-50 max-h-60 overflow-y-auto">
                  <div
                    v-for="org in organizations"
                    :key="org.id"
                    @click="switchOrganization(org.id)"
                    class="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                    :class="{ 'bg-blue-50': org.id === currentOrganization?.id }"
                  >
                    <div class="w-6 h-6 bg-blue-600 rounded text-white flex items-center justify-center font-bold text-xs">
                      {{ org.name?.[0]?.toUpperCase() || 'O' }}
                    </div>
                    <span class="text-sm">{{ org.name }}</span>
                  </div>
                </div>
              </template>
            </BaseOrganizationSwitcher>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Create Organization</Typography>
            <CreateOrganization />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Custom Create Organization</Typography>
            <BaseCreateOrganization>
              <template #default="{ createOrganization, isLoading, error }">
                <div class="max-w-md space-y-3">
                  <div class="p-4 border border-dashed border-gray-300 rounded-lg">
                    <h4 class="font-medium mb-3">Create New Organization</h4>
                    <div class="space-y-3">
                      <TextField 
                        v-model="newOrgName"
                        label="Organization Name"
                        placeholder="Enter organization name"
                        required
                      />
                      <TextField 
                        v-model="newOrgDescription"
                        label="Description (Optional)"
                        placeholder="Brief description"
                      />
                      <Button 
                        @click="handleCreateOrg(createOrganization)" 
                        :loading="isLoading"
                        full-width
                      >
                        Create Organization
                      </Button>
                      <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
                    </div>
                  </div>
                </div>
              </template>
            </BaseCreateOrganization>
          </div>
        </div>
      </div>
    </Card>

    <!-- Authentication Flow Components -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Authentication Flow Components</Typography>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">Sign In Component</Typography>
            <SignedOut>
              <SignIn />
            </SignedOut>
            <SignedIn>
              <Alert variant="info">You are already signed in</Alert>
            </SignedIn>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Sign Up Component</Typography>
            <SignedOut>
              <SignUp />
            </SignedOut>
            <SignedIn>
              <Alert variant="info">You are already signed in</Alert>
            </SignedIn>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Custom Sign In Form</Typography>
            <SignedOut>
              <BaseSignIn class="max-w-md">
                <template #default="{ signIn, isLoading, error }">
                  <div class="p-6 border border-gray-200 rounded-lg space-y-4">
                    <h3 class="text-lg font-semibold text-center">Custom Sign In</h3>
                    <div class="space-y-3">
                      <TextField 
                        v-model="customSignInEmail"
                        label="Email"
                        type="email"
                        placeholder="your@email.com"
                        required
                      />
                      <PasswordField 
                        v-model="customSignInPassword"
                        label="Password"
                        placeholder="Enter your password"
                        required
                      />
                      <Button 
                        @click="signIn({ email: customSignInEmail })"
                        :loading="isLoading"
                        full-width
                      >
                        Sign In
                      </Button>
                      <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>
                    </div>
                  </div>
                </template>
              </BaseSignIn>
            </SignedOut>
          </div>
        </div>
      </div>
    </Card>

    <!-- Invitation Components -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Invitation Components</Typography>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">Invite User</Typography>
            <InviteUser />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Custom Invite User</Typography>
            <BaseInviteUser>
              <template #default="{ inviteUser, isLoading, error }">
                <div class="max-w-md p-4 border border-gray-200 rounded-lg space-y-3">
                  <h4 class="font-medium">Invite New User</h4>
                  <div class="space-y-3">
                    <TextField 
                      v-model="inviteEmail"
                      label="Email Address"
                      type="email"
                      placeholder="user@example.com"
                      required
                    />
                    <TextField 
                      v-model="inviteRole"
                      label="Role"
                      placeholder="e.g., Member, Admin"
                    />
                    <Button 
                      @click="handleInviteUser(inviteUser)"
                      :loading="isLoading"
                      full-width
                    >
                      Send Invitation
                    </Button>
                    <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
                  </div>
                </div>
              </template>
            </BaseInviteUser>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Accept Invite</Typography>
            <AcceptInvite />
          </div>
        </div>
      </div>
    </Card>

    <!-- Utility Components -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Utility Components</Typography>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">Language Switcher</Typography>
            <LanguageSwitcher />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Custom Language Switcher</Typography>
            <BaseLanguageSwitcher>
              <template #default="{ currentLanguage, availableLanguages, setLanguage }">
                <div class="flex gap-2">
                  <button 
                    v-for="lang in availableLanguages"
                    :key="lang.code"
                    @click="setLanguage(lang.code)"
                    class="px-3 py-1 border rounded text-sm"
                    :class="currentLanguage?.code === lang.code ? 'bg-blue-500 text-white border-blue-500' : 'hover:bg-gray-50'"
                  >
                    {{ lang.name }}
                  </button>
                </div>
              </template>
            </BaseLanguageSwitcher>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>