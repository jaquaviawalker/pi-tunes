# RFID Spotify Player - TDD Vertical Slice Development Tasks (Hybrid Development)

## 🏗️ Development Environment Strategy

**Computer Development**: Core logic, API integration, and business logic with mocked hardware  
**Pi Development**: Hardware integration, GPIO testing, and final deployment  
**Sync Method**: Git repository for code synchronization between environments

## Slice 1: Computer-Only Development Setup

**🎯 DELIVERABLE**: Complete development environment with hardware mocks for testing
**💻 LOCATION**: Computer only (no Pi needed yet)

### Tests (TDD - Write FIRST, watch fail)

- [x] T001 **Computer**: Environment detection tests in tests/unit/test_environment.test.js
- [x] T002 **Computer**: Mock hardware validation tests in tests/unit/test_hardware_mocks.test.js
- [x] T003 **Computer**: Project structure validation tests in tests/unit/test_project_setup.test.js

### Implementation (Make tests pass)

- [ ] T004 **Computer**: Project structure setup with package.json and dependencies
- [ ] T005 **Computer**: Environment detection utilities in src/utils/EnvironmentDetector.js
- [ ] T006 **Computer**: Mock hardware classes in src/hardware/mocks/
- [ ] T007 **Computer**: Git repository creation and version control setup
- [ ] T008 **Computer**: Jest testing framework configuration
- [ ] T009 **Computer**: Basic Express server setup for testing

**Acceptance Criteria**:

- ✅ Project runs on computer with mocked hardware
- ✅ Environment automatically detects development vs Pi mode
- ✅ All mock classes provide realistic hardware simulation
- ✅ Test suite runs successfully with mocks
- ✅ Git repository initialized for future Pi deployment
- ✅ Express server starts and responds to health checks

---

## Slice 2: RFID Reader System with Mock Development

**🎯 DELIVERABLE**: RFID reader working on Pi with computer-friendly mocks for development
**💻 LOCATION**: Computer (mocks) + Pi (real hardware)

### Tests (TDD - Write FIRST, watch fail)

- [ ] T010 **Computer**: Mock RFID reader behavior tests in tests/unit/test_mock_rfid.test.js
- [ ] T011 **Computer**: RFID interface contract tests in tests/unit/test_rfid_interface.test.js
- [ ] T012 **Pi**: Real RFID hardware tests in tests/integration/test_rfid_hardware.spec.js

### Implementation (Make tests pass)

- [ ] T013 **Computer**: RFID reader interface definition in src/interfaces/IRFIDReader.js
- [ ] T014 **Computer**: Mock RFID reader with simulated scanning in src/hardware/mocks/MockRFIDReader.js
- [ ] T015 **Pi**: RC522 RFID reader physical wiring and connection
- [ ] T016 **Pi**: Real RFID reader implementation in src/hardware/RealRFIDReader.js
- [ ] T017 **Both**: RFID factory service with environment detection in src/services/RFIDFactory.js
- [ ] T018 **Both**: Tag scanning service with unified interface in src/services/TagScannerService.js

**Acceptance Criteria**:

- ✅ Mock RFID reader simulates tag scanning on computer
- ✅ Real RFID reader detects physical tags on Pi
- ✅ Same interface works for both mock and real implementations
- ✅ Tests pass on both environments
- ✅ Tag IDs are consistent and unique

---

## Slice 3: Spotify API Integration (Computer Development)

**🎯 DELIVERABLE**: Complete Spotify integration developed and tested on computer
**💻 LOCATION**: Computer

### Tests (TDD - Write FIRST, watch fail)

- [ ] T019 **Computer**: Spotify authentication flow tests in tests/unit/test_spotify_auth.test.js
- [ ] T020 **Computer**: Playback control integration tests in tests/integration/test_spotify_playback.spec.js
- [ ] T021 **Computer**: Token refresh and error handling tests in tests/unit/test_spotify_token_manager.test.js

### Implementation (Make tests pass)

- [ ] T022 **Computer**: Spotify Developer app registration and credential management
- [ ] T023 **Computer**: OAuth 2.0 authentication service in src/services/SpotifyAuthService.js
- [ ] T024 **Computer**: Playback control methods in src/services/SpotifyPlaybackService.js
- [ ] T025 **Computer**: Token refresh mechanism in src/utils/TokenManager.js
- [ ] T026 **Computer**: API rate limiting and error handling in src/utils/SpotifyAPIClient.js

**Acceptance Criteria**:

- ✅ Successful OAuth authentication with Spotify
- ✅ Play, pause, and skip track functionality working
- ✅ Album/playlist search and selection working
- ✅ Token refresh handles expired credentials automatically
- ✅ API rate limits respected with proper error handling

---

## Slice 4: Tag-to-Album Mapping System (Computer Development)

**🎯 DELIVERABLE**: Complete mapping system with persistent storage, developed on computer
**💻 LOCATION**: Computer

### Tests (TDD - Write FIRST, watch fail)

- [ ] T027 **Computer**: Mapping data validation tests in tests/unit/test_tag_mapping_model.test.js
- [ ] T028 **Computer**: CRUD operations tests in tests/integration/test_mapping_storage.spec.js
- [ ] T029 **Computer**: Tag resolution and fallback tests in tests/unit/test_tag_resolver.test.js

### Implementation (Make tests pass)

- [ ] T030 **Computer**: Mapping data model with validation in src/models/TagMapping.js
- [ ] T031 **Computer**: JSON storage service with file operations in src/services/MappingStorageService.js
- [ ] T032 **Computer**: Tag-to-album resolution service in src/services/TagResolverService.js
- [ ] T033 **Computer**: Mapping CRUD operations in src/controllers/MappingController.js
- [ ] T034 **Computer**: Default mapping and fallback behavior in src/config/DefaultMappings.js

**Acceptance Criteria**:

- ✅ RFID tag IDs mapped to Spotify album URIs persistently
- ✅ Mapping data survives system restarts
- ✅ CRUD operations for adding/updating/removing mappings
- ✅ Graceful handling of unmapped tags with fallback behavior
- ✅ Spotify URI validation before storage

---

## Slice 5: Core Integration - Computer Testing, Pi Deployment

**🎯 DELIVERABLE**: Complete scan-to-play workflow tested on computer, deployed to Pi
**💻 LOCATION**: Computer (development) → Pi (integration testing)

### Tests (TDD - Write FIRST, watch fail)

- [ ] T035 **Computer**: End-to-end workflow tests with mocks in tests/integration/test_core_workflow_mock.spec.js
- [ ] T036 **Computer**: Error handling integration tests in tests/integration/test_error_scenarios.spec.js
- [ ] T037 **Pi**: Real hardware integration tests in tests/integration/test_pi_integration.spec.js

### Implementation (Make tests pass)

- [ ] T038 **Computer**: Express server setup with middleware in src/server/app.js
- [ ] T039 **Computer**: Main application orchestrator in src/controllers/MainController.js
- [ ] T040 **Computer**: RFID scan event handling in src/handlers/ScanEventHandler.js
- [ ] T041 **Computer**: Spotify playback trigger service in src/services/PlaybackTriggerService.js
- [ ] T042 **Both**: Git deployment and Pi synchronization
- [ ] T043 **Pi**: Real hardware integration testing and debugging

**Acceptance Criteria**:

- ✅ Mock workflow works perfectly on computer
- ✅ Code deploys successfully to Pi via Git
- ✅ Real RFID scan triggers Spotify playbook on Pi
- ✅ Error handling works on both environments
- ✅ Scan-to-play latency under 2 seconds on Pi

---

## Slice 6: LCD Display Integration (Pi Development)

**🎯 DELIVERABLE**: LCD display shows current album/artist and system status
**💻 LOCATION**: Pi (hardware required)

### Tests (TDD - Write FIRST, watch fail)

- [ ] T044 **Computer**: Mock LCD display tests in tests/unit/test_mock_lcd.test.js
- [ ] T045 **Pi**: Real LCD hardware connection tests in tests/integration/test_lcd_hardware.spec.js
- [ ] T046 **Pi**: Display content and updates tests in tests/integration/test_display_updates.spec.js

### Implementation (Make tests pass)

- [ ] T047 **Computer**: Mock LCD display for computer development in src/hardware/mocks/MockLCDDisplay.js
- [ ] T048 **Computer**: Display interface definition in src/interfaces/ILCDDisplay.js
- [ ] T049 **Pi**: LCD display I2C wiring and hardware setup
- [ ] T050 **Pi**: Real LCD display driver in src/hardware/RealLCDDisplay.js
- [ ] T051 **Both**: Display factory with environment detection in src/services/DisplayFactory.js
- [ ] T052 **Both**: Display content manager in src/services/DisplayContentService.js

**Acceptance Criteria**:

- ✅ Mock display works during computer development
- ✅ Real LCD displays startup welcome message on Pi
- ✅ Album name and artist shown when tag is scanned
- ✅ Display handles special characters correctly
- ✅ Same code works with both mock and real displays

---

## Slice 7: System Integration & Pi Testing

**🎯 DELIVERABLE**: Complete system tested end-to-end on Pi hardware
**💻 LOCATION**: Pi (final integration)

### Tests (TDD - Write FIRST, watch fail)

- [ ] T053 **Pi**: Multi-tag scenario tests in tests/integration/test_multiple_tags_pi.spec.js
- [ ] T054 **Pi**: System reliability tests in tests/integration/test_system_reliability_pi.spec.js
- [ ] T055 **Pi**: Performance benchmark tests in tests/performance/test_pi_performance.spec.js

### Implementation (Make tests pass)

- [ ] T056 **Pi**: Final code deployment and synchronization
- [ ] T057 **Pi**: System integration validation and bug fixes
- [ ] T058 **Pi**: Performance optimization for Pi hardware
- [ ] T059 **Pi**: Network connectivity resilience testing
- [ ] T060 **Pi**: Memory management validation on Pi

**Acceptance Criteria**:

- ✅ 5+ different RFID tags work with distinct albums on Pi
- ✅ System handles rapid successive scans gracefully
- ✅ 99% successful tag recognition rate on Pi hardware
- ✅ System recovers from network/API interruptions
- ✅ 24+ hour continuous operation without issues

---

## Slice 8: Production Polish & Deployment (Pi Finalization)

**🎯 DELIVERABLE**: Production-ready system with user-friendly features
**💻 LOCATION**: Pi (final deployment)

### Tests (TDD - Write FIRST, watch fail)

- [ ] T061 **Pi**: User experience flow tests in tests/integration/test_user_workflows_pi.spec.js
- [ ] T062 **Pi**: Auto-startup functionality tests in tests/integration/test_system_startup_pi.spec.js
- [ ] T063 **Pi**: Production deployment validation tests in tests/integration/test_production_ready.spec.js

### Implementation (Make tests pass)

- [ ] T064 **Pi**: Production configuration management
- [ ] T065 **Pi**: Auto-start on Pi boot configuration
- [ ] T066 **Pi**: System service setup and management
- [ ] T067 **Pi**: User documentation and setup validation
- [ ] T068 **Pi**: Final production testing and validation

**Acceptance Criteria**:

- ✅ System starts automatically on Pi boot
- ✅ Professional user experience with error handling
- ✅ System runs reliably in production environment
- ✅ Clear documentation for setup and operation
- ✅ Graceful handling of all edge cases

---

## 🏗️ Hybrid Development Guidelines

### Development Environment Setup

```bash
# On your computer - Initial setup
mkdir rfid-spotify-player
cd rfid-spotify-player
npm init -y
npm install --save express spotify-web-api-sdk
npm install --save-dev jest supertest

# Pi-specific hardware dependencies
npm install --save mfrc522-rpi rpi-gpio i2c-bus

# Set up Git for sync
git init
git remote add origin https://github.com/yourusername/rfid-spotify-player.git
```

### Environment Detection Pattern

```javascript
// src/utils/EnvironmentDetector.js
class EnvironmentDetector {
  static isRaspberryPi() {
    return (
      process.platform === 'linux' &&
      (process.arch === 'arm' || process.arch === 'arm64')
    );
  }

  static getHardwareFactory() {
    return this.isRaspberryPi() ? 'real' : 'mock';
  }
}
```

### Mock Development Strategy

- **Computer Development**: Use mocks for all hardware (RFID, LCD, GPIO)
- **Interface-Driven**: Ensure mocks implement same interface as real hardware
- **Behavior Simulation**: Mocks should simulate realistic hardware behavior
- **Test Coverage**: Same tests should pass on both mock and real hardware

### Git Sync Workflow

```bash
# Initial setup - Computer
git init
git remote add origin https://github.com/yourusername/rfid-spotify-player.git
git push -u origin main

# Development cycle
# Option A: Remote-SSH (Recommended)
# 1. VS Code Remote-SSH → Edit files directly on Pi
# 2. Git commit/push from Pi via VS Code terminal

# Option B: Local development with sync
# Computer: git add . && git commit -m "message" && git push
# Pi (via Remote-SSH): git pull origin main
```

### Remote-SSH Setup Steps

```bash
# 1. Enable SSH on Pi
sudo systemctl enable ssh && sudo systemctl start ssh

# 2. Find Pi IP address
hostname -I

# 3. Install "Remote - SSH" extension in VS Code

# 4. Add SSH config (Ctrl+Shift+P → "Remote-SSH: Add New SSH Host")
Host my-raspberry-pi
    HostName 192.168.1.100  # Your Pi's IP
    User pi
    Port 22

# 5. Connect via Remote Explorer → Connect to Host
# 6. Open /home/pi/rfid-spotify-player folder
```

### TDD Development Guidelines

### Test Structure

```javascript
// Example test structure
describe('RFID Scanner Service', () => {
  beforeEach(() => {
    // Setup test environment
  });

  it('should return unique tag ID when valid tag is scanned', () => {
    // Arrange, Act, Assert pattern
  });

  it('should handle no tag present gracefully', () => {
    // Test error scenarios
  });
});
```

### Development Cycle

1. **Red Phase**: Write failing test first
2. **Green Phase**: Write minimal code to pass test
3. **Refactor Phase**: Improve code quality while keeping tests green

### Test Categories

- **Unit Tests**: Individual component/function testing
- **Integration Tests**: Component interaction testing
- **Performance Tests**: Response time and reliability testing

### Success Metrics

- All tests pass before moving to next slice
- Code coverage > 80% for core functionality
- Integration tests validate real hardware behavior
- Performance tests confirm < 2 second scan-to-play latency
