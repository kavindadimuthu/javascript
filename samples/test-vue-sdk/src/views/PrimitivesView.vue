<script setup lang="ts">
import { ref, h } from 'vue';
import {
  Card,
  Typography,
  Button,
  TextField,
  PasswordField,
  Select,
  Checkbox,
  DatePicker,
  OtpField,
  Alert,
  Divider,
  Logo,
  Spinner,
  UserIcon,
  EyeIcon,
  EyeOffIcon,
  ChevronDownIcon,
  CheckIcon,
  XIcon,
  PlusIcon,
  LogOutIcon,
  ArrowLeftRightIcon,
  BuildingIcon,
  GlobeIcon,
  type SelectOption,
} from '@asgardeo/vue';

// Button state
const buttonLoading = ref(false);
const toggleButtonLoading = () => {
  buttonLoading.value = true;
  setTimeout(() => {
    buttonLoading.value = false;
  }, 2000);
};

// Form values
const textFieldValue = ref('');
const textFieldValue2 = ref('');
const textFieldValue3 = ref('');
const textFieldErrorValue = ref('Error value');
const passwordValue = ref('');
const passwordValue2 = ref('');

const selectValue = ref('');
const multiSelectValue = ref<string>('');
const selectOptions: SelectOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Disabled Option', value: 'disabled', disabled: true },
];

const checkboxValue = ref(false);
const checkboxValue2 = ref(false);
const checkboxValue3 = ref(true);

const dateValue = ref('');
const otpValue = ref('');

const cardFormName = ref('');
const cardFormEmail = ref('');
</script>

<template>
  <div class="space-y-6">
    <!-- Section Header -->
    <div class="border-b border-slate-200 pb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Primitive Components</h2>
      <p class="text-gray-600">Basic UI components like buttons, inputs, and cards</p>
    </div>

    <!-- Buttons -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Buttons</Typography>
        </div>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">Button Variants</Typography>
            <div class="flex gap-3 flex-wrap">
              <Button variant="solid">Solid Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="text">Text Button</Button>
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Button Colors</Typography>
            <div class="flex gap-3 flex-wrap">
              <Button color="primary">Primary</Button>
              <Button color="secondary">Secondary</Button>
              <Button color="danger">Danger</Button>
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Button Sizes</Typography>
            <div class="flex gap-3 flex-wrap items-center">
              <Button size="small">Small</Button>
              <Button size="medium">Medium</Button>
              <Button size="large">Large</Button>
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Button States</Typography>
            <div class="flex gap-3 flex-wrap">
              <Button>Normal</Button>
              <Button :loading="buttonLoading" @click="toggleButtonLoading">
                {{ buttonLoading ? 'Loading...' : 'Click to Load' }}
              </Button>
              <Button disabled>Disabled</Button>
              <Button full-width>Full Width Button</Button>
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Buttons with Icons</Typography>
            <div class="flex gap-3 flex-wrap">
              <Button :start-icon="h(UserIcon)">With Start Icon</Button>
              <Button :end-icon="h(ChevronDownIcon)">With End Icon</Button>
              <Button :start-icon="h(PlusIcon)" :end-icon="h(ArrowLeftRightIcon)">
                Both Icons
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Typography -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Typography</Typography>
        </div>
        <div class="space-y-3">
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="h2">Heading 2</Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="h4">Heading 4</Typography>
          <Typography variant="h5">Heading 5</Typography>
          <Typography variant="h6">Heading 6</Typography>
          <Typography variant="body1">Body 1 - Default body text with good readability</Typography>
          <Typography variant="body2">Body 2 - Smaller body text for secondary content</Typography>
          <Typography variant="caption">Caption - Small text for labels and captions</Typography>
        </div>
      </div>
    </Card>

    <!-- Form Fields -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Form Fields</Typography>
        </div>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">Text Field</Typography>
            <div class="space-y-3 max-w-md">
              <TextField v-model="textFieldValue" label="Basic Text Field" placeholder="Enter some text..." />
              <TextField v-model="textFieldValue2" label="Required Field" placeholder="This field is required"
                required />
              <TextField v-model="textFieldValue3" label="With Helper Text" placeholder="Enter email"
                helper-text="We'll never share your email" />
              <TextField v-model="textFieldErrorValue" label="Field with Error" placeholder="This has an error" error="This field has an error"
                helper-text="This field has an error" />
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Password Field</Typography>
            <div class="space-y-3 max-w-md">
              <PasswordField v-model="passwordValue" label="Password" placeholder="Enter your password" />
              <PasswordField v-model="passwordValue2" label="Confirm Password" placeholder="Confirm your password"
                required helper-text="Must match your password" />
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Select Field</Typography>
            <div class="space-y-3 max-w-md">
              <Select v-model="selectValue" label="Select Option" :options="selectOptions"
                placeholder="Choose an option" />
              <Select v-model="multiSelectValue" label="Multi Select" :options="selectOptions"
                placeholder="Choose multiple options" />
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Checkbox</Typography>
            <div class="space-y-3">
              <Checkbox v-model="checkboxValue" label="Basic Checkbox" />
              <Checkbox v-model="checkboxValue2" label="Required Checkbox" required />
              <Checkbox v-model="checkboxValue3" label="Checkbox with helper text"
                helper-text="This provides additional context" />
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Date Picker</Typography>
            <div class="space-y-3 max-w-md">
              <DatePicker v-model="dateValue" label="Birth Date" placeholder="Select your birth date" />
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">OTP Field</Typography>
            <div class="space-y-3 max-w-md">
              <OtpField v-model="otpValue" :length="6" label="Enter OTP" placeholder="000000" />
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Cards -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Cards</Typography>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <Card>
            <Typography variant="h4" class="mb-2">Basic Card</Typography>
            <Typography variant="body1">
              This is a basic card component that can contain any content.
            </Typography>
          </Card>

          <Card>
            <Typography variant="h4" class="mb-2">Card with Form</Typography>
            <div class="space-y-3">
              <TextField v-model="cardFormName" label="Name" placeholder="Your name" />
              <TextField v-model="cardFormEmail" label="Email" placeholder="your@email.com" />
              <Button>Submit</Button>
            </div>
          </Card>
        </div>
      </div>
    </Card>

    <!-- Alerts -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Alerts</Typography>
        </div>
        <div class="space-y-3">
          <Alert severity="info">
            This is an informational alert with some helpful content.
          </Alert>
          <Alert severity="success">
            Your operation completed successfully!
          </Alert>
          <Alert severity="warning">
            Please review this information carefully.
          </Alert>
          <Alert severity="error">
            Something went wrong. Please try again.
          </Alert>
        </div>
      </div>
    </Card>

    <!-- Other Components -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Other Components</Typography>
        </div>
        <div class="space-y-4">
          <div>
            <Typography variant="h4" class="mb-2">Divider</Typography>
            <p>Content above divider</p>
            <Divider />
            <p>Content below divider</p>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Logo</Typography>
            <Logo class="h-12" />
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Spinner</Typography>
            <div class="flex gap-4 items-center">
              <Spinner size="small" />
              <Spinner size="medium" />
              <Spinner size="large" />
            </div>
          </div>

          <div>
            <Typography variant="h4" class="mb-2">Icons</Typography>
            <div class="flex gap-4 items-center text-2xl">
              <UserIcon />
              <EyeIcon />
              <EyeOffIcon />
              <ChevronDownIcon />
              <CheckIcon />
              <XIcon />
              <PlusIcon />
              <LogOutIcon />
              <BuildingIcon />
              <GlobeIcon />
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Form Values Display -->
    <Card>
      <div class="space-y-4">
        <div class="-mx-6 -mt-6 px-6 py-4 bg-gradient-to-br from-slate-50 to-indigo-50 border-b-2 border-slate-200 rounded-t-lg">
          <Typography variant="h3">Current Form Values</Typography>
        </div>
        <pre class="bg-gray-100 p-3 rounded text-sm overflow-auto">{{
          JSON.stringify({
            textFieldValue,
            textFieldValue2,
            textFieldValue3,
            textFieldErrorValue,
            passwordValue,
            passwordValue2,
            selectValue,
            multiSelectValue,
            checkboxValue,
            checkboxValue2,
            checkboxValue3,
            dateValue,
            otpValue,
            cardFormName,
            cardFormEmail,
          }, null, 2)
        }}</pre>
      </div>
    </Card>
  </div>
</template>