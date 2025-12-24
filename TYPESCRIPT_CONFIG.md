# TypeScript Configuration Guide

## Unused Import Warnings

If you're getting errors like:
```
error TS6133: 'React' is declared but its value is never read.
```

This happens because with React 17+ and `jsx: "react-jsx"`, you don't need to import React for JSX.

## Solution Options

### Option 1: Disable noUnusedLocals (Current)

Already configured in `tsconfig.json`:
```json
{
  "noUnusedLocals": false
}
```

This will ignore ALL unused local variables, not just React imports.

### Option 2: Remove Unused React Imports (Recommended)

Since React 17+, you can remove `import React from "react"` from files that only use JSX:

**Before:**
```tsx
import React from "react";  // ← Not needed
export function MyComponent() {
  return <div>Hello</div>;
}
```

**After:**
```tsx
// No React import needed!
export function MyComponent() {
  return <div>Hello</div>;
}
```

**Keep React import only if you use:**
- `React.FC`
- `React.memo`
- `React.forwardRef`
- `React.createElement`
- Other React APIs

### Option 3: Use TypeScript Comments

Add `// @ts-ignore` or `// eslint-disable-next-line`:

```tsx
// @ts-ignore - React import not needed but kept for compatibility
import React from "react";
```

### Option 4: Configure ESLint Instead

If using ESLint, configure it in `eslint.config.js`:

```js
rules: {
  '@typescript-eslint/no-unused-vars': ['warn', { 
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^React$'  // Ignore unused React
  }]
}
```

## Current Configuration

Your `tsconfig.json` has:
- `noUnusedLocals: false` - Ignores unused local variables
- `noUnusedParameters: true` - Still warns about unused function parameters

This is a good balance - you won't get warnings about unused imports, but you'll still be warned about unused function parameters.

## For Library Build

When building the library, TypeScript will still check types but won't fail on unused imports. This is fine for a library package.

