# Alert Modular System

A modular web application for a support team's alerting system built with React and TypeScript.

## Features

- Modular architecture with dynamic module loading
- Centralized alert management system
- Module isolation with error boundaries
- Color-coded alert visualization based on severity
- Module-specific alert toggles
- Expandable/collapsible alert panel
- Comprehensive dashboard showing alert summaries

## Architecture

The application follows a modular architecture with:

1. **Core Structure**:
   - Header across the top
   - Sidebar on the left for navigation
   - Main content area on the right for displaying tabbed content
   - Floating alert panel that can overlay other content

2. **Tab Component Management**:
   - Each tab corresponds to a loaded module
   - Clicking a tab displays that module's content and updates the sidebar
   - The first tab (core tab) always shows a comprehensive summary of all alerts

3. **Dynamic Module Loading**:
   - Modules are loaded dynamically at startup
   - Each module is isolated using error boundaries
   - Modules implement a standard interface to interact with the core

4. **Alert Management System**:
   - Modules can send alerts to a central alert manager
   - Alerts are tracked by their source module
   - Alerts are color-coded based on severity
   - Module-specific alert toggles control which module's alerts are displayed

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## Running Tests

The application includes unit tests and integration tests:

```bash
npm test
```

## Project Structure

```
src/
├── components/      # Shared UI components
├── core/            # Core application logic and contexts
├── modules/         # Modules that plug into the core
├── tests/           # Test files
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Module Development

To create a new module:

1. Create a new directory under `src/modules/`
2. Create an index.tsx file that exports a ModuleDefinition object
3. Implement the necessary components for your module
4. The module will be loaded automatically by the ModuleLoader

## License

MIT