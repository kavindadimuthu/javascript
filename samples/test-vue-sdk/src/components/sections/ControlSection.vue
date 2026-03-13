<script setup lang="ts">
import { ref } from 'vue';
import {
  useAsgardeo,
  Card,
  Typography,
  Button,
  Alert,
  SignedIn,
  SignedOut,
  Loading,
  Spinner,
  SignInButton,
  SignUpButton,
  SignOutButton,
  UserDropdown,
  Logo,
} from '@asgardeo/vue';

const { isSignedIn, isLoading, isInitialized } = useAsgardeo();

const manualLoading = ref(false);

const toggleManualLoading = () => {
  manualLoading.value = true;
  setTimeout(() => {
    manualLoading.value = false;
  }, 3000);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Conditional Rendering -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Conditional Rendering Components</Typography>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">SignedIn Component</Typography>
            <div class="p-4 border border-gray-200 rounded-lg">
              <SignedIn>
                <Alert variant="success" title="Authenticated">
                  This content is only visible when the user is signed in!
                </Alert>
                <div class="mt-3 space-y-2">
                  <p class="text-sm text-gray-600">You can see this because you're authenticated.</p>
                  <div class="flex gap-3">
                    <Button variant="outline">Profile</Button>
                    <Button variant="outline">Settings</Button>
                    <SignOutButton />
                  </div>
                </div>
              </SignedIn>
              <SignedOut>
                <Alert variant="info" title="Not Authenticated">
                  You need to sign in to see the authenticated content above.
                </Alert>
              </SignedOut>
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">SignedOut Component</Typography>
            <div class="p-4 border border-gray-200 rounded-lg">
              <SignedOut>
                <Alert variant="warning" title="Guest Access">
                  This content is only visible when the user is NOT signed in!
                </Alert>
                <div class="mt-3 space-y-2">
                  <p class="text-sm text-gray-600">Sign in to access more features.</p>
                  <div class="flex gap-3">
                    <SignInButton />
                    <SignUpButton />
                    <Button variant="outline">Learn More</Button>
                  </div>
                </div>
              </SignedOut>
              <SignedIn>
                <Alert variant="info" title="Already Signed In">
                  You are already authenticated, so the guest content above is hidden.
                </Alert>
              </SignedIn>
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Loading Component</Typography>
            <div class="p-4 border border-gray-200 rounded-lg space-y-3">
              <div>
                <Typography variant="h5" class="mb-2">Default Loading Component</Typography>
                <Loading />
              </div>
              
              <div>
                <Typography variant="h5" class="mb-2">Loading with Custom Content</Typography>
                <Loading>
                  <div class="flex items-center gap-3 p-4">
                    <Spinner />
                    <div>
                      <div class="font-medium">Loading your data...</div>
                      <div class="text-sm text-gray-600">Please wait while we fetch your information</div>
                    </div>
                  </div>
                </Loading>
              </div>

              <div>
                <Typography variant="h5" class="mb-2">Manual Loading State</Typography>
                <div class="space-y-3">
                  <Button @click="toggleManualLoading" :loading="manualLoading">
                    {{ manualLoading ? 'Loading...' : 'Trigger Loading' }}
                  </Button>
                  <div v-if="manualLoading">
                    <Loading>
                      <div class="text-center py-8">
                        <Spinner size="large" />
                        <div class="mt-3">
                          <div class="font-medium">Processing your request...</div>
                          <div class="text-sm text-gray-600 mt-1">This may take a moment</div>
                        </div>
                      </div>
                    </Loading>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Nested Conditional Rendering -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Nested Conditional Rendering</Typography>
        <div class="space-y-4">
          <div class="p-4 border border-gray-200 rounded-lg">
            <Typography variant="h4" class="mb-3">Complex Authentication Flow</Typography>
            
            <!-- Loading state -->
            <div v-if="isLoading" class="text-center py-8">
              <Loading>
                <div class="space-y-2">
                  <Spinner size="large" />
                  <div class="text-lg font-medium">Initializing Asgardeo...</div>
                  <div class="text-sm text-gray-600">Setting up your authentication session</div>
                </div>
              </Loading>
            </div>
            
            <!-- Authenticated state -->
            <SignedIn>
              <div class="space-y-4">
                <Alert variant="success" title="Welcome Back!">
                  You are successfully authenticated and can access all features.
                </Alert>
                
                <div class="bg-green-50 p-4 rounded-lg">
                  <Typography variant="h5" class="mb-2">Available Actions for Authenticated Users</Typography>
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <h6 class="font-medium mb-2">Profile Management</h6>
                      <div class="space-y-1">
                        <Button variant="outline" size="small" full-width>View Profile</Button>
                        <Button variant="outline" size="small" full-width>Edit Profile</Button>
                        <Button variant="outline" size="small" full-width>Change Password</Button>
                      </div>
                    </div>
                    <div>
                      <h6 class="font-medium mb-2">Account Settings</h6>
                      <div class="space-y-1">
                        <Button variant="outline" size="small" full-width>Security Settings</Button>
                        <Button variant="outline" size="small" full-width>Privacy Settings</Button>
                        <Button variant="outline" size="small" color="danger" full-width>Sign Out</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SignedIn>

            <!-- Unauthenticated state -->
            <SignedOut>
              <div class="space-y-4">
                <Alert variant="info" title="Welcome, Guest!">
                  Sign in to access your personalized dashboard and all features.
                </Alert>
                
                <div class="bg-blue-50 p-4 rounded-lg">
                  <Typography variant="h5" class="mb-2">Get Started</Typography>
                  <div class="space-y-3">
                    <p class="text-sm text-gray-700">
                      Create an account or sign in to access powerful features like profile management, 
                      organization switching, and more.
                    </p>
                    <div class="flex gap-3">
                      <SignInButton>Sign In to Continue</SignInButton>
                      <SignUpButton>Create Account</SignUpButton>
                    </div>
                    <p class="text-xs text-gray-500">
                      By signing up, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </Card>

    <!-- Conditional Content Examples -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Practical Examples</Typography>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-3">Navigation Menu Example</Typography>
            <div class="bg-gray-100 p-4 rounded-lg">
              <nav class="flex items-center justify-between">
                <div class="flex items-center gap-6">
                  <Logo class="h-8" />
                  <div class="hidden md:flex gap-4">
                    <a href="#" class="text-gray-700 hover:text-gray-900">Home</a>
                    <SignedIn>
                      <a href="#" class="text-gray-700 hover:text-gray-900">Dashboard</a>
                      <a href="#" class="text-gray-700 hover:text-gray-900">Projects</a>
                      <a href="#" class="text-gray-700 hover:text-gray-900">Team</a>
                    </SignedIn>
                    <SignedOut>
                      <a href="#" class="text-gray-700 hover:text-gray-900">About</a>
                      <a href="#" class="text-gray-700 hover:text-gray-900">Pricing</a>
                    </SignedOut>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <SignedOut>
                    <Button variant="ghost" size="small">Sign In</Button>
                    <Button size="small">Get Started</Button>
                  </SignedOut>
                  <SignedIn>
                    <UserDropdown />
                  </SignedIn>
                </div>
              </nav>
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-3">Feature Card Example</Typography>
            <div class="grid md:grid-cols-2 gap-4">
              <!-- Free features for everyone -->
              <Card>
                <Typography variant="h5" class="mb-2">Basic Features</Typography>
                <p class="text-sm text-gray-600 mb-3">Available to all users</p>
                <ul class="space-y-1 text-sm">
                  <li>✓ View public content</li>
                  <li>✓ Browse products</li>
                  <li>✓ Access help docs</li>
                </ul>
                <SignedOut>
                  <Button class="mt-4" full-width>Sign Up for Free</Button>
                </SignedOut>
              </Card>

              <!-- Premium features for authenticated users -->
              <Card>
                <Typography variant="h5" class="mb-2">Premium Features</Typography>
                <SignedIn>
                  <p class="text-sm text-green-600 mb-3">Available with your account</p>
                  <ul class="space-y-1 text-sm">
                    <li>✓ Save favorites</li>
                    <li>✓ Create custom projects</li>
                    <li>✓ Team collaboration</li>
                    <li>✓ Priority support</li>
                  </ul>
                  <Button class="mt-4" full-width>Access Dashboard</Button>
                </SignedIn>
                <SignedOut>
                  <p class="text-sm text-gray-600 mb-3">Sign in to unlock</p>
                  <ul class="space-y-1 text-sm text-gray-400">
                    <li>🔒 Save favorites</li>
                    <li>🔒 Create custom projects</li>
                    <li>🔒 Team collaboration</li>
                    <li>🔒 Priority support</li>
                  </ul>
                  <SignInButton class="mt-4" full-width>Sign In to Unlock</SignInButton>
                </SignedOut>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Authentication State Display -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Current Authentication State</Typography>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="grid md:grid-cols-3 gap-4 text-sm">
            <div class="text-center">
              <div class="font-medium text-gray-600 mb-1">Is Signed In</div>
              <div :class="['inline-block px-3 py-1 rounded-full text-sm font-medium', isSignedIn ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                {{ isSignedIn ? 'Yes' : 'No' }}
              </div>
            </div>
            <div class="text-center">
              <div class="font-medium text-gray-600 mb-1">Is Loading</div>
              <div :class="['inline-block px-3 py-1 rounded-full text-sm font-medium', isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800']">
                {{ isLoading ? 'Yes' : 'No' }}
              </div>
            </div>
            <div class="text-center">
              <div class="font-medium text-gray-600 mb-1">Is Initialized</div>
              <div :class="['inline-block px-3 py-1 rounded-full text-sm font-medium', isInitialized ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                {{ isInitialized ? 'Yes' : 'No' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>