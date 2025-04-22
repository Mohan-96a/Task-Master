# Installation Guide

Follow these steps to run Task Master on your local machine.

## Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

## Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-master.git
   cd task-master
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

## Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Environment Variables

No environment variables are required for local development.

## Troubleshooting

### Common Issues

1. **Port 5173 is already in use**
   - Kill the process using the port or use a different port:
     ```bash
     npm run dev -- --port 3000
     ```

2. **Dependencies installation fails**
   - Clear npm cache and try again:
     ```bash
     npm cache clean --force
     npm install
     ```

3. **Page not loading properly**
   - Make sure you're using a modern browser
   - Clear your browser cache
   - Check console for any errors

For more issues, please check the GitHub issues page or create a new issue.
