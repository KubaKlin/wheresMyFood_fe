import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Ensure Vite env is present for API helpers.
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000');
