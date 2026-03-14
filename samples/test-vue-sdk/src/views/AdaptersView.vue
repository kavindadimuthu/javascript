<script setup lang="ts">
import { ref } from 'vue';
import {
  Card,
  Typography,
  Button,
  TextField,
  PasswordField,
  Alert,
  Divider,
  GoogleButton,
  GitHubButton,
  MicrosoftButton,
  FacebookButton,
  SignedIn,
  SignedOut,
} from '@asgardeo/vue';

// Event tracking
const events = ref<Array<{ timestamp: string; message: string }>>([]);

const addEvent = (message: string) => {
  events.value.push({
    timestamp: new Date().toLocaleTimeString(),
    message,
  });
};

const handleSocialLogin = (provider: string) => {
  addEvent(`🚀 ${provider} login attempted`);
};

const handleSocialError = (error: Error) => {
  addEvent(`❌ Login error: ${error.message}`);
};

const clearEvents = () => {
  events.value = [];
};

// Email sign in form
const signInEmail = ref('');
const signInPassword = ref('');
const emailSignInLoading = ref(false);

const handleEmailSignIn = async () => {
  emailSignInLoading.value = true;
  addEvent(`📧 Email sign in attempted for: ${signInEmail.value}`);
  
  // Simulate API call
  setTimeout(() => {
    emailSignInLoading.value = false;
    addEvent(`✅ Email sign in completed`);
  }, 2000);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Section Header -->
    <div class="border-b border-slate-200 pb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Social Login Adapters</h2>
      <p class="text-gray-600">Social media login buttons</p>
    </div>

    <!-- Google Authentication -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Google Authentication</Typography>
          <Typography variant="body1" class="text-slate-500 mt-1">Standard and custom Google sign-in button examples.</Typography>
        </div>
        
        <div class="grid grid-cols-2 gap-8">
          <div>
            <Typography variant="h5" class="mb-3">Standard Button</Typography>
            <GoogleButton />
          </div>
          
          <div>
            <Typography variant="h5" class="mb-3">Custom Button</Typography>
            <GoogleButton>
              <template #default="{ isLoading }">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>{{ isLoading ? 'Connecting...' : 'Continue with Google' }}</span>
                </div>
              </template>
            </GoogleButton>
          </div>
        </div>
      </div>
    </Card>

    <!-- GitHub Authentication -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">GitHub Authentication</Typography>
          <Typography variant="body1" class="text-slate-500 mt-1">Standard and custom GitHub sign-in button examples.</Typography>
        </div>
        
        <div class="grid grid-cols-2 gap-8">
          <div>
            <Typography variant="h5" class="mb-3">Standard Button</Typography>
            <GitHubButton />
          </div>
          
          <div>
            <Typography variant="h5" class="mb-3">Custom Button</Typography>
            <GitHubButton class="bg-gray-900 hover:bg-gray-800 text-white">
              <template #default="{ isLoading }">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>{{ isLoading ? 'Connecting...' : 'Continue with GitHub' }}</span>
                </div>
              </template>
            </GitHubButton>
          </div>
        </div>
      </div>
    </Card>

    <!-- Microsoft Authentication -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Microsoft Authentication</Typography>
          <Typography variant="body1" class="text-slate-500 mt-1">Standard and custom Microsoft sign-in button examples.</Typography>
        </div>
        
        <div class="grid grid-cols-2 gap-8">
          <div>
            <Typography variant="h5" class="mb-3">Standard Button</Typography>
            <MicrosoftButton />
          </div>
          
          <div>
            <Typography variant="h5" class="mb-3">Custom Button</Typography>
            <MicrosoftButton class="bg-blue-600 hover:bg-blue-700 text-white">
              <template #default="{ isLoading }">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#f25022" d="M11.4 11.4H0V0h11.4v11.4z"/>
                    <path fill="#00a4ef" d="M24 11.4H12.6V0H24v11.4z"/>
                    <path fill="#7fba00" d="M11.4 24H0V12.6h11.4V24z"/>
                    <path fill="#ffb900" d="M24 24H12.6V12.6H24V24z"/>
                  </svg>
                  <span>{{ isLoading ? 'Connecting...' : 'Continue with Microsoft' }}</span>
                </div>
              </template>
            </MicrosoftButton>
          </div>
        </div>
      </div>
    </Card>

    <!-- Facebook Authentication -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Facebook Authentication</Typography>
          <Typography variant="body1" class="text-slate-500 mt-1">Standard and custom Facebook sign-in button examples.</Typography>
        </div>
        
        <div class="grid grid-cols-2 gap-8">
          <div>
            <Typography variant="h5" class="mb-3">Standard Button</Typography>
            <FacebookButton />
          </div>
          
          <div>
            <Typography variant="h5" class="mb-3">Custom Button</Typography>
            <FacebookButton class="bg-blue-600 hover:bg-blue-700 text-white">
              <template #default="{ isLoading }">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>{{ isLoading ? 'Connecting...' : 'Continue with Facebook' }}</span>
                </div>
              </template>
            </FacebookButton>
          </div>
        </div>
      </div>
    </Card>

    <!-- All Social Buttons Together -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Social Login Options</Typography>
          <Typography variant="body1" class="text-slate-500 mt-1">Complete social login selection with all available providers.</Typography>
        </div>
        
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-3">Standard Layout</Typography>
            <div class="space-y-3 max-w-sm">
              <GoogleButton class="w-full justify-center" />
              <GitHubButton class="w-full justify-center" />
              <MicrosoftButton class="w-full justify-center" />
              <FacebookButton class="w-full justify-center" />
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-3">Grid Layout</Typography>
            <div class="grid grid-cols-2 gap-3 max-w-md">
              <GoogleButton />
              <GitHubButton />
              <MicrosoftButton />
              <FacebookButton />
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-3">Horizontal Layout</Typography>
            <div class="flex gap-3 items-center">
              <GoogleButton />
              <GitHubButton />
              <MicrosoftButton />
              <FacebookButton />
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Event Handling Examples -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Event Handling</Typography>
          <Typography variant="body1" class="text-slate-500 mt-1">Demonstrate event handling and error catching with social login buttons.</Typography>
        </div>
        
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-3">Buttons with Event Handlers</Typography>
            <div class="space-y-3">
              <GoogleButton 
                @click="handleSocialLogin('Google')"
                @error="handleSocialError"
              >
                Google with Events
              </GoogleButton>
              
              <GitHubButton 
                @click="handleSocialLogin('GitHub')"
                @error="handleSocialError"
              >
                GitHub with Events
              </GitHubButton>
              
              <MicrosoftButton 
                @click="handleSocialLogin('Microsoft')"
                @error="handleSocialError"
              >
                Microsoft with Events
              </MicrosoftButton>
              
              <FacebookButton 
                @click="handleSocialLogin('Facebook')"
                @error="handleSocialError"
              >
                Facebook with Events
              </FacebookButton>
            </div>
          </div>

          <!-- Event Log -->
          <div v-if="events.length > 0">
            <Typography variant="h4" class="mb-3">Event Log</Typography>
            <div class="bg-gray-900 text-green-400 p-4 rounded-lg">
              <div class="text-sm font-medium text-white mb-2">Recent Events:</div>
              <div class="space-y-1 max-h-40 overflow-y-auto">
                <div 
                  v-for="(event, index) in events.slice().reverse()" 
                  :key="index"
                  class="text-xs font-mono"
                >
                  [{{ event.timestamp }}] {{ event.message }}
                </div>
              </div>
              <Button 
                @click="clearEvents" 
                variant="outline" 
                size="small" 
                class="mt-3"
              >
                Clear Log
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Integration Examples -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Integration Examples</Typography>
        </div>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-3">Sign In Form with Social Options</Typography>
            <div class="max-w-md">
              <SignedOut>
                <div class="p-6 border border-gray-200 rounded-lg space-y-4">
                  <div class="text-center">
                    <Typography variant="h4" class="mb-2">Welcome Back</Typography>
                    <Typography variant="body2" class="text-gray-600">
                      Sign in to your account to continue
                    </Typography>
                  </div>

                  <!-- Email/Password Form -->
                  <form @submit.prevent="handleEmailSignIn" class="space-y-3">
                    <TextField 
                      v-model="signInEmail"
                      label="Email"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                    <PasswordField 
                      v-model="signInPassword"
                      label="Password"
                      placeholder="Enter your password"
                      required
                    />
                    <Button type="submit" full-width :loading="emailSignInLoading">
                      Sign In with Email
                    </Button>
                  </form>

                  <!-- Divider -->
                  <div class="relative">
                    <Divider />
                    <div class="absolute inset-0 flex items-center justify-center">
                      <span class="bg-white px-3 text-sm text-gray-500">or continue with</span>
                    </div>
                  </div>

                  <!-- Social Login Options -->
                  <div class="space-y-2">
                    <GoogleButton class="w-full justify-center" />
                    <GitHubButton class="w-full justify-center" />
                  </div>

                  <div class="text-center text-sm text-gray-600">
                    Don't have an account? 
                    <button class="text-blue-600 hover:underline">Sign up</button>
                  </div>
                </div>
              </SignedOut>
              
              <SignedIn>
                <Alert variant="info">
                  You are already signed in. Sign out to see the login form.
                </Alert>
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>