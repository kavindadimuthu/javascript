<script setup lang="ts">
import {
  Card,
  Typography,
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
  SignUp,
  InviteUser,
  AcceptInvite,
  LanguageSwitcher,
  BaseLanguageSwitcher,
  ChevronDownIcon,
  BuildingIcon,
} from '@asgardeo/vue';

const getInputValue = (e: Event): string => (e.target as HTMLInputElement)?.value ?? '';
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
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">User Components</Typography>
        </div>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">User Component</Typography>
            <UserComponent />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Base User Component (Unstyled)</Typography>
            <BaseUser class="p-4 border border-gray-200 rounded">
              <template #default="{ user }">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {{ (user?.name?.givenName || user?.username || 'U')[0].toUpperCase() }}
                  </div>
                  <div class="ml-3">
                    <p class="font-medium">{{ user?.name?.givenName }} {{ user?.name?.familyName }}</p>
                    <p class="text-sm text-gray-500">{{ user?.email || user?.username }}</p>
                  </div>
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
              <template #default="{ profile, isLoading, error }">
                <div v-if="isLoading" class="text-center py-4">Loading user profile...</div>
                <div v-else-if="error" class="text-red-600">Error: {{ error }}</div>
                <div v-else-if="profile" class="space-y-3">
                  <h3 class="text-lg font-semibold">Custom User Profile</h3>
                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <div><strong>Name:</strong> {{ profile.name?.givenName }} {{ profile.name?.familyName }}</div>
                    <div><strong>Email:</strong> {{ profile.email }}</div>
                    <div><strong>Username:</strong> {{ profile.username }}</div>
                    <div><strong>ID:</strong> {{ profile.sub || profile.id }}</div>
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
              <template #default="{ user, isOpen, toggle }">
                <button @click="toggle" class="flex items-center gap-2 p-2 border rounded hover:bg-gray-50">
                  <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {{ (user?.name?.givenName || user?.displayName || 'U')[0]?.toUpperCase?.() || 'U' }}
                  </div>
                  <span class="text-sm">{{ user?.name?.givenName || user?.displayName || 'User' }}</span>
                  <ChevronDownIcon class="h-4 w-4" :class="{ 'rotate-180': isOpen }" />
                </button>
              </template>
              <template #items>
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-50">Profile Settings</a>
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-50">Account Settings</a>
              </template>
            </BaseUserDropdown>
          </div>
        </div>
      </div>
    </Card>

    <!-- Organization Components -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Organization Components</Typography>
        </div>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">Organization Component</Typography>
            <OrganizationComponent />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Base Organization (Unstyled)</Typography>
            <BaseOrganization class="p-4 border border-gray-200 rounded">
              <template #default="{ organization }">
                <div v-if="organization" class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-600 rounded text-white flex items-center justify-center font-bold">
                    {{ organization.name?.[0]?.toUpperCase() || 'O' }}
                  </div>
                  <div>
                    <p class="font-medium">{{ organization.name }}</p>
                    <p class="text-sm text-gray-500">{{ organization.id }}</p>
                  </div>
                </div>
                <div v-else class="text-gray-500">No organization selected</div>
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
              <template #default="{ organizations, isLoading }">
                <div v-if="isLoading" class="text-center py-4">Loading organizations...</div>
                <div v-else-if="organizations?.length" class="grid gap-2">
                  <div
                    v-for="org in organizations"
                    :key="org.id"
                    class="p-3 border rounded flex items-center gap-3"
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
              <template #default="{ currentOrganization, organizations, isOpen, toggle, handleSelect }">
                <div>
                  <button @click="toggle" class="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 min-w-48">
                    <BuildingIcon class="h-4 w-4 text-gray-400" />
                    <span class="text-sm flex-1 text-left">
                      {{ currentOrganization?.name || 'Select Organization' }}
                    </span>
                    <ChevronDownIcon class="h-4 w-4 text-gray-400" :class="{ 'rotate-180': isOpen }" />
                  </button>
                  <div v-if="isOpen" class="absolute top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-lg py-1 z-50 max-h-60 overflow-y-auto">
                    <div
                      v-for="org in organizations"
                      :key="org.id"
                      @click="handleSelect(org)"
                      class="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                      :class="{ 'bg-blue-50': org.id === currentOrganization?.id }"
                    >
                      <div class="w-6 h-6 bg-blue-600 rounded text-white flex items-center justify-center font-bold text-xs">
                        {{ org.name?.[0]?.toUpperCase() || 'O' }}
                      </div>
                      <span class="text-sm">{{ org.name }}</span>
                    </div>
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
              <template #default="{ orgName, setOrgName, isSubmitting, error, handleSubmit }">
                <div class="max-w-md space-y-3">
                  <div class="p-4 border border-dashed border-gray-300 rounded-lg">
                    <h4 class="font-medium mb-3">Create New Organization</h4>
                    <div class="space-y-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                        <input 
                          :value="orgName"
                          @input="e => setOrgName(getInputValue(e))"
                          type="text"
                          placeholder="Enter organization name"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          required
                        />
                      </div>
                      <button 
                        @click="handleSubmit"
                        :disabled="isSubmitting || !orgName"
                        class="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                      >
                        {{ isSubmitting ? 'Creating...' : 'Create Organization' }}
                      </button>
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

    <!-- Authentication Flow Components (Coming Soon) -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Authentication Flow Components (Coming Soon)</Typography>
          <p class="text-sm text-gray-500 mt-1">These embedded authentication components will be available when app-native flow is implemented.</p>
        </div>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">Sign In Component</Typography>
            <SignIn />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Sign Up Component</Typography>
            <SignUp />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Accept Invite</Typography>
            <AcceptInvite />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Invite User</Typography>
            <InviteUser />
          </div>
        </div>
      </div>
    </Card>

    <!-- Utility Components -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Utility Components</Typography>
        </div>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">Language Switcher</Typography>
            <LanguageSwitcher />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Custom Language Switcher</Typography>
            <BaseLanguageSwitcher>
              <template #default="{ currentLanguage, languages, isOpen, toggle, handleSelect }">
                <div class="relative inline-block">
                  <button @click="toggle" class="px-3 py-1 border rounded text-sm hover:bg-gray-50">
                    {{ currentLanguage || 'Select Language' }}
                    <ChevronDownIcon class="inline h-4 w-4 ml-1" :class="{ 'rotate-180': isOpen }" />
                  </button>
                  <div v-if="isOpen" class="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg py-1 z-50">
                    <button
                      v-for="lang in languages"
                      :key="lang.value"
                      @click="handleSelect(lang.value)"
                      class="block w-full text-left px-3 py-1 text-sm hover:bg-gray-50"
                      :class="currentLanguage === lang.value ? 'bg-blue-50 text-blue-600' : ''"
                    >
                      {{ lang.label }}
                    </button>
                  </div>
                </div>
              </template>
            </BaseLanguageSwitcher>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>