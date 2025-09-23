/**
 * Environment Detection Tests
 *
 * These tests verify that the system can properly detect whether it's running
 * on a Raspberry Pi or on a development computer.
 */

// We're writing tests first (TDD), so the module we're testing doesn't exist yet.
// This test will initially fail (RED), then we'll implement the module to make it pass (GREEN).

describe('Environment Detector', () => {
  // Save original process properties
  const originalPlatform = process.platform;
  const originalArch = process.arch;
  let EnvironmentDetector;

  // Mock the process properties before each test
  beforeEach(() => {
    // Clear the require cache to ensure fresh module loading
    jest.resetModules();

    // Create a mock for process properties
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      writable: true,
    });

    Object.defineProperty(process, 'arch', {
      value: originalArch,
      writable: true,
    });
  });

  // Restore original process properties after tests
  afterEach(() => {
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      writable: true,
    });

    Object.defineProperty(process, 'arch', {
      value: originalArch,
      writable: true,
    });

    // Remove any mocks
    jest.clearAllMocks();
  });

  test('should correctly identify a Raspberry Pi environment', () => {
    // Mock Linux ARM platform (Raspberry Pi)
    Object.defineProperty(process, 'platform', { value: 'linux' });
    Object.defineProperty(process, 'arch', { value: 'arm' });

    // Import the module under test after mocking
    EnvironmentDetector = require('../../src/utils/EnvironmentDetector');

    // Verify Pi is correctly detected
    expect(EnvironmentDetector.isRaspberryPi()).toBe(true);
    expect(EnvironmentDetector.getHardwareFactory()).toBe('real');
  });

  test('should correctly identify a Raspberry Pi 64-bit environment', () => {
    // Mock Linux ARM64 platform (Raspberry Pi 4 with 64-bit OS)
    Object.defineProperty(process, 'platform', { value: 'linux' });
    Object.defineProperty(process, 'arch', { value: 'arm64' });

    // Import the module under test after mocking
    EnvironmentDetector = require('../../src/utils/EnvironmentDetector');

    // Verify Pi is correctly detected
    expect(EnvironmentDetector.isRaspberryPi()).toBe(true);
    expect(EnvironmentDetector.getHardwareFactory()).toBe('real');
  });

  test('should correctly identify a non-Raspberry Pi environment on macOS', () => {
    // Mock macOS platform
    Object.defineProperty(process, 'platform', { value: 'darwin' });
    Object.defineProperty(process, 'arch', { value: 'x64' });

    // Import the module under test after mocking
    EnvironmentDetector = require('../../src/utils/EnvironmentDetector');

    // Verify non-Pi is correctly detected
    expect(EnvironmentDetector.isRaspberryPi()).toBe(false);
    expect(EnvironmentDetector.getHardwareFactory()).toBe('mock');
  });

  test('should correctly identify a non-Raspberry Pi environment on Windows', () => {
    // Mock Windows platform
    Object.defineProperty(process, 'platform', { value: 'win32' });
    Object.defineProperty(process, 'arch', { value: 'x64' });

    // Import the module under test after mocking
    EnvironmentDetector = require('../../src/utils/EnvironmentDetector');

    // Verify non-Pi is correctly detected
    expect(EnvironmentDetector.isRaspberryPi()).toBe(false);
    expect(EnvironmentDetector.getHardwareFactory()).toBe('mock');
  });

  test('should correctly identify a non-Raspberry Pi environment on Linux x86', () => {
    // Mock Linux x86 platform (standard Linux PC)
    Object.defineProperty(process, 'platform', { value: 'linux' });
    Object.defineProperty(process, 'arch', { value: 'x64' });

    // Import the module under test after mocking
    EnvironmentDetector = require('../../src/utils/EnvironmentDetector');

    // Verify non-Pi is correctly detected
    expect(EnvironmentDetector.isRaspberryPi()).toBe(false);
    expect(EnvironmentDetector.getHardwareFactory()).toBe('mock');
  });
});
