
https://duthanhduoc.com/blog/tao-du-an-react-webpack-typescript-babel-eslint

Set-ExecutionPolicy -ExecutionPolicy bypass -Scope LocalMachine
yarn init --yes
# Cài đặt React vào dependencies
yarn add react react-dom

# Cài type cho React vào devDependencies
yarn add -D @types/react @types/react-dom typescript

# Cài đặt Webpack
yarn add -D webpack webpack-cli webpack-dev-server

# Cài đặt Babel
yarn add -D @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript babel-loader

# Cài đặt các loader và plugins bổ trợ
yarn add -D clean-webpack-plugin compression-webpack-plugin copy-webpack-plugin css-loader css-minimizer-webpack-plugin dotenv-webpack file-loader html-webpack-plugin mini-css-extract-plugin sass sass-loader serve webpack-bundle-analyzer

# Cài đặt ESLint và Prettier
yarn add -D eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-webpack-plugin eslint-import-resolver-typescript
