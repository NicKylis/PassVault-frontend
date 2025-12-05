# PassVault frontend
[![Build Status](https://github.com/NicKylis/PassVault-frontend/actions/workflows/ci.yaml/badge.svg)](https://github.com/NicKylis/PassVault-frontend/actions)
[![Website](https://img.shields.io/badge/Website-212121?style=flat&logo=render&logoColor=white)](https://passvault-frontend.onrender.com/)

Passvault is a password manager application developed for the second course
of Software Engineering at the Aristotle University of Thessaloniki. The frontend
of the application is developed with Typescript, React and Vite.

## PREREQUISITES (for frontend)

- nodejs npm
- typescript

## Installing and running Passvault's frontend as a developer

- clone the repository:

```
git clone git@github.com:NicKylis/PassVault-frontend.git
```

- install the node modules with:

```
npm i
```

- start the backend with:

```
npm run dev
```

- run the tests with:

```
npm run cypress:run
```

### React + TypeScript + Vite template information

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

#### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
