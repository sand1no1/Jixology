# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# Structure

## client/
Frontend application and UI logic.

## server/
API integrations.

## supabase/
Supabase configuration, database migrations, and project resources.



## #######################################################################################################################################
## What to run after db reset --local
-- npx supabase functions serve register_user --no-verify-jwt 

in supabase client to run the edgefunction for the first user.

-- powershell -ExecutionPolicy Bypass -File .\scripts\bootstrap-users.ps1
in a terminal to run the script that creates the first user

-- Copy paste this in the supabase local client to add the values for the inventory for the first user

INSERT INTO public.usuario_inventario_avatar (id_usuario, id_elemento, fecha_obtencion)
SELECT u.id, v.id_elemento, NOW()
FROM public.usuario u
JOIN (
  VALUES
      (1), (2), (5), (6), (11), (12),
      (19), (23), (40), (44), (49), (51),
      (55), (57), (60), (67), (72),
      (74), (81), (88),
      (95), (99), (116), (125), (141), (142), (150),
      (153), (156), (162), (164),
      (170), (172), (183), (193), (195),
      (198), (199), (201), (204), (205),
      (210), (212), (213)
) AS v(id_elemento)
ON TRUE
WHERE u.email = 'juan.guarnizo@gmail.com';


