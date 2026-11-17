---
id: publishing-npm-packages
title: Publishing custom NPM packages
sidebar_label: NPM Package Publishing
description: Guide for initializing, authoring, and publishing an ES Module package to the NPM registry.
tags: [npm, nodejs, javascript, packaging, workflow]
---

Guide for initializing, authoring, and publishing an ES Module package to the NPM registry.

## Prerequisites

- **Node.js**: Ensure Node.js (v14+) is installed.
- **NPM Account**: An account registered at [npmjs.com](https://www.npmjs.com/signup) with a verified email address.

```bash
# Verify Node and NPM installation
node -v
npm -v
```

---

## 1. Environment & Package Initialization

1. Create a workspace directory for your package (package names must be unique across the entire NPM registry):

```bash
mkdir my-custom-package
cd my-custom-package
```

1. Generate the default `package.json` manifest:

```bash
npm init -y
```

1. Update `package.json` to enable ES module support and declare the package entry point:

```json
{
  "name": "my-custom-package",
  "version": "1.0.0",
  "description": "A lightweight utility package",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "Your Name",
  "license": "ISC"
}
```

*Note: Setting `"type": "module"` enables native ES `import`/`export` syntax within Node.js.*

---

## 2. Module Implementation

Create `index.js` in the project root to define the package logic:

```javascript
/**
 * Generates a random integer within a specified range [min, max].
 * 
 * @param {number} min - Lower bound (inclusive, default: 0)
 * @param {number} max - Upper bound (inclusive, default: 100)
 * @returns {number}
 */
const randomNumberGenerator = (min = 0, max = 100) => {
  return Math.round(Math.random() * (max - min) + min);
};

export default randomNumberGenerator;
```

---

## 3. Package Documentation (`README.md`)

Create a `README.md` file in the root directory. This content renders on the package's NPM registry page:

```markdown
# my-custom-package

A lightweight utility for generating bounded random numbers.

## Installation

```bash
npm i my-custom-package
```

## Usage

```javascript
import randomNumberGenerator from 'my-custom-package';

// Returns a random number between 5 and 95
const num = randomNumberGenerator(5, 95);
console.log(num);
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `min` | `number` | `0` | Minimum boundary value |
| `max` | `number` | `100` | Maximum boundary value |

---

## 4. Authentication & Publishing

Authenticate the CLI session with your NPM account:

```bash
npm login
```

Verify active authentication session:

```bash
npm whoami
```

Publish the package to the public registry:

```bash
npm publish
```

---

## 5. End-to-End Verification

Verify the live package within an isolated environment:

Create a separate test directory outside the package repository:

```bash
mkdir ../test-environment
cd ../test-environment
npm init -y

```

Configure `package.json` for ES modules and install the published package:

```bash
npm pkg set type="module"
npm install my-custom-package
```

Create `test.js` to execute the published module:

```javascript
import randomNumberGenerator from 'my-custom-package';

console.log('Result:', randomNumberGenerator(1, 10));
```

Execute test script:

```bash
node test.js
```
