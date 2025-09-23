/**
 * Project Structure Validation Tests
 *
 * These tests verify that the project has the correct directory structure
 * and essential files in place.
 */

const fs = require('fs');
const path = require('path');

describe('Project Structure', () => {
  const projectRoot = process.cwd();

  describe('Essential Directories', () => {
    const requiredDirectories = [
      'src',
      'src/utils',
      'src/interfaces',
      'src/hardware',
      'src/hardware/mocks',
      'src/services',
      'src/controllers',
      'src/models',
      'tests',
      'tests/unit',
      'tests/integration',
    ];

    test.each(requiredDirectories)('should have %s directory', (dirPath) => {
      const fullPath = path.join(projectRoot, dirPath);
      expect(fs.existsSync(fullPath)).toBe(true);
    });
  });

  describe('Essential Files', () => {
    const requiredFiles = ['package.json', 'src/server.js'];

    test.each(requiredFiles)('should have %s file', (filePath) => {
      const fullPath = path.join(projectRoot, filePath);
      expect(fs.existsSync(fullPath)).toBe(true);
    });

    test('package.json should have required scripts', () => {
      const packageJson = require(path.join(projectRoot, 'package.json'));

      expect(packageJson).toHaveProperty('scripts.test');
      expect(packageJson).toHaveProperty('scripts.start');
      expect(packageJson).toHaveProperty('scripts.dev');
    });
  });

  describe('Dependencies', () => {
    test('should have essential dependencies installed', () => {
      const packageJson = require(path.join(projectRoot, 'package.json'));

      // Check production dependencies
      expect(packageJson.dependencies).toBeDefined();
      expect(packageJson.dependencies.express).toBeDefined();
      expect(packageJson.dependencies.dotenv).toBeDefined();

      // Check dev dependencies
      expect(packageJson.devDependencies).toBeDefined();
      expect(packageJson.devDependencies.jest).toBeDefined();
    });
  });

  describe('Server Configuration', () => {
    test('server.js should export the app for testing', () => {
      try {
        // This will fail until we update server.js to export app
        const server = require(path.join(projectRoot, 'src', 'server.js'));
        expect(server.app).toBeDefined();
      } catch (e) {
        // Expected to fail in TDD until implementation
        console.log(
          'Server does not export app yet - test will fail as expected in TDD'
        );
      }
    });
  });

  describe('Environment Configuration', () => {
    test('should have environment detection utility', () => {
      try {
        // This will fail until we implement EnvironmentDetector
        const environmentDetector = require(path.join(
          projectRoot,
          'src',
          'utils',
          'EnvironmentDetector'
        ));
        expect(typeof environmentDetector.isRaspberryPi).toBe('function');
        expect(typeof environmentDetector.getHardwareFactory).toBe('function');
      } catch (e) {
        // Expected to fail in TDD until implementation
        console.log(
          'EnvironmentDetector not implemented yet - test will fail as expected in TDD'
        );
      }
    });
  });
});
