<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  Card,
  Typography,
  Button,
  TextField,
  PasswordField,
  Select,
  Checkbox,
  Alert,
  type SelectOption,
} from '@asgardeo/vue';

// Form data
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  agreeToTerms: false,
});

const contactData = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
});

// Loading states
const submitting = ref(false);
const contactSubmitting = ref(false);

// Options
const subjectOptions: SelectOption[] = [
  { label: 'General Inquiry', value: 'general' },
  { label: 'Technical Support', value: 'support' },
  { label: 'Business Partnership', value: 'business' },
  { label: 'Other', value: 'other' },
];

// Handlers
const handleFormSubmit = async () => {
  submitting.value = true;
  // Simulate form submission
  setTimeout(() => {
    submitting.value = false;
    console.log('Registration form submitted:', formData);
  }, 1000);
};

const handleContactSubmit = async () => {
  contactSubmitting.value = true;
  // Simulate form submission
  setTimeout(() => {
    contactSubmitting.value = false;
    console.log('Contact form submitted:', contactData);
  }, 1000);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Section Header -->
    <div class="border-b border-slate-200 pb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Field Factory</h2>
      <p class="text-gray-600">Dynamic field generation</p>
    </div>

    <!-- Field Factory Overview -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Field Factory</Typography>
        <Typography variant="body1" class="text-gray-600">
          The FieldFactory component dynamically generates form fields based on configuration objects. 
          This is useful for building dynamic forms, user onboarding flows, and custom field layouts.
        </Typography>
        
        <Alert variant="info" title="Dynamic Form Generation">
          FieldFactory can create various field types including text, password, email, select, checkbox, 
          date picker, and OTP fields based on the configuration provided.
        </Alert>
      </div>
    </Card>

    <!-- Basic Usage Example -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Basic Usage Example</Typography>
        <Typography variant="body1" class="text-gray-600">
          Example of how to use FieldFactory in your application.
        </Typography>
        
        <div class="bg-gray-100 p-4 rounded-lg">
          <Typography variant="h4" class="mb-3">Code Example</Typography>
          <pre class="bg-gray-900 text-green-400 p-3 rounded-lg text-sm overflow-auto"><code>import { FieldFactory, createField, type FieldConfig } from '@asgardeo/vue';

// Basic field configuration
const fieldConfig: FieldConfig = {
  type: 'text',
  name: 'firstName',
  label: 'First Name',
  placeholder: 'Enter your first name',
  required: true,
  helperText: 'This field is required'
};

// Use in template
&lt;FieldFactory :config="fieldConfig" v-model="fieldValue" /&gt;</code></pre>
        </div>
      </div>
    </Card>

    <!-- Field Types Documentation -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Available Field Types</Typography>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-3">Supported Field Types</Typography>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="p-3 border rounded-lg">
                  <Typography variant="h5" class="mb-1">text</Typography>
                  <Typography variant="body2" class="text-gray-600">Standard text input field</Typography>
                </div>
                <div class="p-3 border rounded-lg">
                  <Typography variant="h5" class="mb-1">password</Typography>
                  <Typography variant="body2" class="text-gray-600">Password input with toggle visibility</Typography>
                </div>
                <div class="p-3 border rounded-lg">
                  <Typography variant="h5" class="mb-1">email</Typography>
                  <Typography variant="body2" class="text-gray-600">Email input with validation</Typography>
                </div>
                <div class="p-3 border rounded-lg">
                  <Typography variant="h5" class="mb-1">number</Typography>
                  <Typography variant="body2" class="text-gray-600">Numeric input field</Typography>
                </div>
              </div>
              <div class="space-y-2">
                <div class="p-3 border rounded-lg">
                  <Typography variant="h5" class="mb-1">select</Typography>
                  <Typography variant="body2" class="text-gray-600">Dropdown selection field</Typography>
                </div>
                <div class="p-3 border rounded-lg">
                  <Typography variant="h5" class="mb-1">checkbox</Typography>
                  <Typography variant="body2" class="text-gray-600">Boolean checkbox input</Typography>
                </div>
                <div class="p-3 border rounded-lg">
                  <Typography variant="h5" class="mb-1">date</Typography>
                  <Typography variant="body2" class="text-gray-600">Date picker field</Typography>
                </div>
                <div class="p-3 border rounded-lg">
                  <Typography variant="h5" class="mb-1">otp</Typography>
                  <Typography variant="body2" class="text-gray-600">OTP input field</Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Configuration Structure -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Field Configuration Structure</Typography>
        <div class="space-y-4">
          <Typography variant="body1" class="text-gray-600">
            The FieldConfig interface defines the structure for field configurations.
          </Typography>
          
          <div class="bg-gray-100 p-4 rounded-lg">
            <Typography variant="h4" class="mb-3">FieldConfig Interface</Typography>
            <pre class="bg-gray-900 text-green-400 p-3 rounded-lg text-sm overflow-auto"><code>interface FieldConfig {
  type: 'text' | 'password' | 'email' | 'number' | 'select' | 'checkbox' | 'date' | 'otp';
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    message?: string;
  };
  options?: Array&lt;{
    label: string;
    value: string;
    disabled?: boolean;
  }&gt;; // For select fields
}</code></pre>
          </div>
        </div>
      </div>
    </Card>

    <!-- Manual Field Examples -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Manual Field Examples</Typography>
        <Typography variant="body1" class="text-gray-600">
          Since FieldFactory may have typing issues, here are manual examples using the primitive components directly.
        </Typography>
        
        <div class="space-y-6">
          <div>
            <Typography variant="h4" class="mb-3">User Registration Form</Typography>
            <form @submit.prevent="handleFormSubmit" class="max-w-md space-y-4">
              <TextField 
                v-model="formData.firstName"
                label="First Name"
                placeholder="Enter your first name"
                required
              />
              <TextField 
                v-model="formData.lastName"
                label="Last Name"
                placeholder="Enter your last name"
                required
              />
              <TextField 
                v-model="formData.email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                required
              />
              <PasswordField 
                v-model="formData.password"
                label="Password"
                placeholder="Choose a strong password"
                required
              />
              <Checkbox 
                v-model="formData.agreeToTerms"
                label="I agree to the Terms of Service"
                required
              />
              <Button type="submit" :loading="submitting" full-width>
                Create Account
              </Button>
            </form>
          </div>

          <div>
            <Typography variant="h4" class="mb-3">Contact Form</Typography>
            <form @submit.prevent="handleContactSubmit" class="max-w-md space-y-4">
              <TextField 
                v-model="contactData.name"
                label="Your Name"
                placeholder="Enter your name"
                required
              />
              <TextField 
                v-model="contactData.email"
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                required
              />
              <Select 
                v-model="contactData.subject"
                label="Subject"
                :options="subjectOptions"
                placeholder="Choose a subject"
                required
              />
              <TextField 
                v-model="contactData.message"
                label="Message"
                placeholder="Enter your message"
                required
              />
              <Button type="submit" :loading="contactSubmitting" full-width>
                Send Message
              </Button>
            </form>
          </div>
        </div>

        <!-- Form Values Display -->
        <div v-if="Object.keys(formData).length > 0 || Object.keys(contactData).length > 0">
          <Typography variant="h4" class="mb-3">Form Values</Typography>
          <div class="space-y-3">
            <div v-if="Object.values(formData).some(v => v !== '' && v !== false)">
              <Typography variant="h5" class="mb-2">Registration Form</Typography>
              <pre class="bg-gray-100 p-3 rounded text-sm">{{ JSON.stringify(formData, null, 2) }}</pre>
            </div>
            <div v-if="Object.values(contactData).some(v => v !== '')">
              <Typography variant="h5" class="mb-2">Contact Form</Typography>
              <pre class="bg-gray-100 p-3 rounded text-sm">{{ JSON.stringify(contactData, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Helper Functions -->
    <Card>
      <div class="space-y-4">
        <Typography variant="h3">Helper Functions</Typography>
        <Typography variant="body1" class="text-gray-600">
          The FieldFactory exports helper functions for field creation and validation.
        </Typography>
        
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-3">createField</Typography>
            <div class="bg-gray-100 p-4 rounded-lg">
              <pre class="bg-gray-900 text-green-400 p-3 rounded-lg text-sm overflow-auto"><code>import { createField } from '@asgardeo/vue';

// Create a field with configuration
const field = createField({
  type: 'text',
  name: 'username',
  label: 'Username',
  placeholder: 'Enter username',
  required: true,
  validation: {
    pattern: /^[a-zA-Z0-9_]+$/,
    minLength: 3,
    message: 'Username must be 3+ characters, letters/numbers/underscores only'
  }
});</code></pre>
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-3">validateFieldValue</Typography>
            <div class="bg-gray-100 p-4 rounded-lg">
              <pre class="bg-gray-900 text-green-400 p-3 rounded-lg text-sm overflow-auto"><code>import { validateFieldValue } from '@asgardeo/vue';

// Validate a field value
const validationResult = validateFieldValue('test@email.com', {
  type: 'email',
  required: true,
  validation: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
});

if (!validationResult.isValid) {
  console.log('Validation error:', validationResult.message);
}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>