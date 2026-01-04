# Development Setup - Source Code Navigation

This configuration enables direct source code navigation when developing with the Asgardeo React package.

## How It Works

1. **Production/Distribution**: The sample project uses the compiled `dist` folder for actual runtime
2. **Development Navigation**: When you Ctrl+Click on components/functions, VS Code opens the original source files in `src` for easy debugging

## Configuration Files Modified

### React Package (`packages/react/`)

- **tsconfig.lib.json**: Added `declarationMap: true` and `sourceMap: true` for TypeScript declaration maps
- **esbuild.config.mjs**: Changed sourcemap to `'linked'` and added `sourcesContent: true` for proper source mapping

### Sample Project (`samples/teamspace-react/`)

- **vite.config.ts**: Added workspace aliases to resolve to source directories during development
- **tsconfig.json** & **tsconfig.app.json**: Added path mappings for all workspace packages
- **.vscode/settings.json**: Enhanced TypeScript and debugging settings

## Testing the Setup

1. Open `src/pages/SignUpPage.tsx` in the sample project
2. Hold Ctrl and click on `SignUp` from the import: `import {SignUp} from '@asgardeo/react';`
3. This should open `packages/react/src/components/presentation/auth/SignUp/SignUp.tsx` (source file)
4. Not `packages/react/dist/components/presentation/auth/SignUp/SignUp.d.ts` (declaration file)

## Benefits

- ✅ Runtime uses optimized compiled code from `dist/`
- ✅ Development navigation goes directly to source files
- ✅ Full IntelliSense and type checking
- ✅ Proper debugging with source maps
- ✅ Easy code walkthrough for understanding and modifications

## Usage in Sample Project

The sample project can import and use components normally:

```tsx
import { SignUp, SignIn, UserProfile } from '@asgardeo/react';

// Components work as expected, but Ctrl+Click takes you to source files
```

When you build for production, Vite will bundle the optimized dist files, but during development, the aliases ensure you can navigate to source code easily.
