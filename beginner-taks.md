# RFID Spotify Player - Beginner Learning Tasks

## 🎯 **Learning Philosophy**

You'll figure out HOW to code each piece yourself. I'll only tell you WHAT to build and WHY.
**This is how you become a real developer - by solving problems yourself!**

---

## 🌱 **Slice 1: Project Foundation**

**🎯 LEARN**: How to set up a Node.js project from scratch
**💻 WHERE**: Your computer only
**⏱️ TIME**: 1-2 hours

### **Concepts You'll Learn:**

- What is `package.json` and why do we need it?
- What are npm packages and how do they work?
- What is project structure and why does it matter?
- What is Test Driven Development (TDD)?

### **Your Tasks (Figure Out How):**

#### **Task 1A: Create Project Structure**

**WHAT TO DO**: Create a new Node.js project called "rfid-spotify-player"
**RESEARCH**: Look up "how to create new Node.js project" and "npm init"
**SUCCESS**: You have a folder with `package.json` file
**HINT**: The terminal command `npm init` is your friend

#### **Task 1B: Add Basic Dependencies**

**WHAT TO DO**: Install `express` (for web server) and `jest` (for testing)
**RESEARCH**: Look up "how to install npm packages"
**SUCCESS**: You see `node_modules` folder and your `package.json` shows the dependencies
**HINT**: There's an `npm install` command

#### **Task 1C: Organize Your Code**

**WHAT TO DO**: Create folders for organizing different types of files
**RESEARCH**: Look up "Node.js project folder structure best practices"
**SUCCESS**: You have separate folders for source code and tests
**HINT**: Most projects have `src/` and `tests/` folders

#### **Task 1D: Write Your First Test**

**WHAT TO DO**: Create a simple test that checks if your project name is correct
**RESEARCH**: Look up "Jest testing framework" and "how to write first test"
**SUCCESS**: You can run `npm test` and see a test result (pass or fail)
**HINT**: Tests use `expect()` and should initially FAIL

#### **Task 1E: Make Test Pass**

**WHAT TO DO**: Fix whatever makes your test fail
**RESEARCH**: Look at the test error message and figure out what's wrong
**SUCCESS**: Your test turns from red (failing) to green (passing)
**HINT**: Usually involves changing some value in your code

### **Questions to Answer Yourself:**

- What does `package.json` actually contain?
- Why do we write tests BEFORE writing code?
- What happens when you run `npm install`?
- Why don't we commit the `node_modules` folder to Git?

---

## 🔧 **Slice 2: Mock Hardware System**

**🎯 LEARN**: How to simulate hardware when you don't have it yet
**💻 WHERE**: Your computer only
**⏱️ TIME**: 2-3 hours

### **Concepts You'll Learn:**

- What are classes and objects in JavaScript?
- How to use `module.exports` and `require()`
- What is "mocking" and why do developers do it?
- How to generate random data for testing

### **Your Tasks (Figure Out How):**

#### **Task 2A: Design RFID Scanner Interface**

**WHAT TO DO**: Write tests that describe how an RFID scanner should behave
**RESEARCH**: Look up "JavaScript classes" and "Jest testing methods"
**SUCCESS**: You have tests that expect a scanner to return tag IDs
**HINT**: Think about what methods an RFID scanner would need

#### **Task 2B: Build Mock Scanner Class**

**WHAT TO DO**: Create a fake RFID scanner that your tests can use
**RESEARCH**: Look up "JavaScript class constructor" and "Math.random()"
**SUCCESS**: Your mock scanner can pretend to scan different fake tags
**HINT**: Store fake tag names in an array and pick randomly

#### **Task 2C: Test Scanner Behavior**

**WHAT TO DO**: Verify your mock scanner works consistently
**RESEARCH**: Look up "JavaScript loops" and "console.log debugging

**SUCCESS**: You can manually test your scanner and see different results each time
**HINT**: Create a simple test script to call your scanner multiple times

#### **Task 2D: Add Scanner Configuration**

**WHAT TO DO**: Make your scanner configurable (different tag sets, scan success rates)
**RESEARCH**: Look up "JavaScript constructor parameters" and "default values"
**SUCCESS**: You can create scanners with different behaviors for testing
**HINT**: Some real RFID scanners don't always successfully read tags

### **Questions to Answer Yourself:**

- Why create fake hardware instead of waiting for real hardware?
- How do classes help organize your code?
- What's the difference between a class and an object instance?
- How can you make your mock behave more like real hardware?

---

## 🎵 **Slice 3: Spotify API Integration**

**🎯 LEARN**: How to work with external APIs and handle authentication
**💻 WHERE**: Your computer only
**⏱️ TIME**: 3-4 hours

### **Concepts You'll Learn:**

- What are APIs and how do you use them?
- How does OAuth authentication work?
- What are environment variables and why use them?
- How to handle async operations in JavaScript

### **Your Tasks (Figure Out How):**

#### **Task 3A: Get Spotify Developer Access**

**WHAT TO DO**: Register as a Spotify developer and create an app
**RESEARCH**: Look up "Spotify Developer Dashboard" and "how to create Spotify app"
**SUCCESS**: You have Client ID and Client Secret from Spotify
**HINT**: You'll need a Spotify account (free is fine)

#### **Task 3B: Secure Your Credentials**

**WHAT TO DO**: Store your Spotify secrets safely without hardcoding them
**RESEARCH**: Look up "environment variables Node.js" and "dotenv package"
**SUCCESS**: Your secrets are in a `.env` file that's not committed to Git
**HINT**: Also create a `.gitignore` file

#### **Task 3C: Install Spotify SDK**

**WHAT TO DO**: Add the official Spotify Web API SDK to your project
**RESEARCH**: Look up "Spotify Web API SDK npm" and "how to install npm packages"
**SUCCESS**: You can import/require the Spotify SDK in your code
**HINT**: Check the official Spotify developer documentation

#### **Task 3D: Create Spotify Connection Class**

**WHAT TO DO**: Write tests for a class that can search for albums on Spotify
**RESEARCH**: Look up "async/await JavaScript" and "Jest async testing"
**SUCCESS**: You have tests that describe how Spotify searching should work
**HINT**: API calls are asynchronous - they take time to complete

#### **Task 3E: Implement Spotify Search**

**WHAT TO DO**: Build a class that can actually search for albums using Spotify's API
**RESEARCH**: Look up "Spotify API authentication" and "Spotify search endpoint"
**SUCCESS**: You can search for an album and get back its information
**HINT**: Start with Client Credentials flow (simpler than user authentication)

#### **Task 3F: Test Real Spotify Connection**

**WHAT TO DO**: Create a simple script to test your Spotify integration manually
**RESEARCH**: Look up "Node.js script execution" and "async function calls"
**SUCCESS**: You can search for your favorite album and see its Spotify data
**HINT**: Try searching for something popular like "Taylor Swift 1989"

### **Questions to Answer Yourself:**

- What's the difference between synchronous and asynchronous code?
- Why do APIs require authentication?
- What information does Spotify return when you search for an album?
- How would you handle API errors gracefully?

---

## 🗺️ **Slice 4: Tag-to-Album Mapping System**

**🎯 LEARN**: How to store and retrieve data relationships
**💻 WHERE**: Your computer only
**⏱️ TIME**: 2-3 hours

### **Concepts You'll Learn:**

- How to design simple data storage
- What is JSON and how to use it for data persistence
- How to implement CRUD operations (Create, Read, Update, Delete)
- How to validate data before storing it

### **Your Tasks (Figure Out How):**

#### **Task 4A: Design Mapping Data Structure**

**WHAT TO DO**: Write tests that describe how tag-to-album mapping should work
**RESEARCH**: Look up "JavaScript objects" and "JSON data format"
**SUCCESS**: You have tests for storing, retrieving, and updating tag mappings
**HINT**: Think about what information you need to store for each tag

#### **Task 4B: Create Mapping Storage Class**

**WHAT TO DO**: Build a class that can save mappings between tags and albums
**RESEARCH**: Look up "Node.js file system" and "JSON.stringify/parse"
**SUCCESS**: Your mappings persist between program runs (saved to a file)
**HINT**: Start simple - just save to a JSON file

#### **Task 4C: Add Mapping Validation**

**WHAT TO DO**: Ensure only valid mappings can be stored
**RESEARCH**: Look up "JavaScript input validation" and "error handling"
**SUCCESS**: Bad data gets rejected with helpful error messages
**HINT**: Check that tag IDs and album information are properly formatted

#### **Task 4D: Test Mapping Operations**

**WHAT TO DO**: Create comprehensive tests for all mapping functionality
**RESEARCH**: Look up "Jest test coverage" and "testing edge cases"
**SUCCESS**: You can add, find, update, and delete mappings reliably
**HINT**: Test what happens with duplicate tags and missing data

### **Questions to Answer Yourself:**

- Why use JSON instead of a database for this project?
- How do you prevent data corruption when multiple operations happen?
- What happens if your data file gets deleted?
- How would you backup and restore your mappings?

---

## 🔗 **Slice 5: Connect Everything Together**

**🎯 LEARN**: How to integrate separate components into a working system
**💻 WHERE**: Your computer only
**⏱️ TIME**: 3-4 hours

### **Concepts You'll Learn:**

- How to create a web server with Express
- What are routes and how do they work?
- How to coordinate between different parts of your system
- How to handle errors gracefully in a full application

### **Your Tasks (Figure Out How):**

#### **Task 5A: Create Express Web Server**

**WHAT TO DO**: Set up a basic web server that can respond to requests
**RESEARCH**: Look up "Express.js tutorial" and "creating REST API"
**SUCCESS**: You can visit localhost:3000 and see your server running
**HINT**: Start with just a "Hello World" response

#### **Task 5B: Add Scan Simulation Endpoint**

**WHAT TO DO**: Create a web route that simulates scanning an RFID tag
**RESEARCH**: Look up "Express routes" and "URL parameters"
**SUCCESS**: You can visit a URL to trigger a fake tag scan
**HINT**: Something like `/scan/tag-taylor-swift` should work

#### **Task 5C: Integrate All Components**

**WHAT TO DO**: Connect your scanner, mapping system, and Spotify integration
**RESEARCH**: Look up "dependency injection" and "class composition"
**SUCCESS**: Scanning a tag looks up its album and searches Spotify
**HINT**: Your main controller needs to use all your other classes

#### **Task 5D: Add Error Handling**

**WHAT TO DO**: Handle what happens when things go wrong
**RESEARCH**: Look up "Express error handling" and "try-catch blocks"
**SUCCESS**: Your app doesn't crash when APIs fail or tags aren't found
**HINT**: Think about network errors, missing mappings, and invalid data

#### **Task 5E: Test Complete Workflow**

**WHAT TO DO**: Write integration tests that test the entire scan-to-play flow
**RESEARCH**: Look up "integration testing" and "supertest for Express"
**SUCCESS**: You can test the full workflow without manual clicking
**HINT**: Mock the parts you can't control (like actual Spotify playback)

### **Questions to Answer Yourself:**

- What's the difference between unit tests and integration tests?
- How do you structure code so components can work together easily?
- What should happen when the internet connection fails?
- How would you add logging to help debug problems?

---

## 🖥️ **Slice 6: User Interface (Web-Based)**

**🎯 LEARN**: How to create a simple web interface for your system
**💻 WHERE**: Your computer only
**⏱️ TIME**: 2-3 hours

### **Concepts You'll Learn:**

- How to serve static HTML/CSS/JavaScript files
- What is client-server architecture?
- How to make web pages interactive with JavaScript
- How to style web interfaces with CSS

### **Your Tasks (Figure Out How):**

#### **Task 6A: Serve Static Web Files**

**WHAT TO DO**: Make your Express server serve HTML pages
**RESEARCH**: Look up "Express static files" and "serving HTML with Express"
**SUCCESS**: You can visit your server and see a web page
**HINT**: Create a `public` folder for your web files

#### **Task 6B: Create Tag Management Interface**

**WHAT TO DO**: Build a web page where you can see and manage tag mappings
**RESEARCH**: Look up "HTML forms" and "HTML tables"
**SUCCESS**: You can view existing mappings and add new ones via web interface
**HINT**: Start with simple HTML, no fancy styling needed

#### **Task 6C: Add Tag Scanning Simulation**

**WHAT TO DO**: Create buttons or interface elements that simulate tag scans
**RESEARCH**: Look up "HTML buttons" and "JavaScript fetch API"
**SUCCESS**: Clicking a button triggers the same workflow as a real RFID scan
**HINT**: Each button can represent a different RFID tag

#### **Task 6D: Display System Status**

**WHAT TO DO**: Show what's currently happening (what song would play, errors, etc.)
**RESEARCH**: Look up "JavaScript DOM manipulation" and "updating HTML content"
**SUCCESS**: The web page shows real-time feedback about scan results
**HINT**: Use JavaScript to update the page content without refreshing

### **Questions to Answer Yourself:**

- Why create a web interface instead of a command-line interface?
- How does the browser communicate with your Express server?
- What's the difference between frontend and backend code?
- How would you make the interface look more professional?

---

## 🧪 **Slice 7: Comprehensive Testing**

**🎯 LEARN**: How to thoroughly test a complete system
**💻 WHERE**: Your computer only
**⏱️ TIME**: 2-3 hours

### **Concepts You'll Learn:**

- What are the different types of testing?
- How to measure test coverage
- How to test asynchronous operations
- How to organize and maintain test suites

### **Your Tasks (Figure Out How):**

#### **Task 7A: Review Test Coverage**

**WHAT TO DO**: Check how much of your code is covered by tests
**RESEARCH**: Look up "Jest coverage report" and "npm run scripts"
**SUCCESS**: You can see a report showing which lines of code are tested
**HINT**: Add a test coverage script to your package.json

#### **Task 7B: Add Missing Unit Tests**

**WHAT TO DO**: Write tests for any functions/classes that aren't covered
**RESEARCH**: Look up "unit testing best practices" and "Jest mocking"
**SUCCESS**: Every important function has at least one test
**HINT**: Focus on business logic and error conditions

#### **Task 7C: Create End-to-End Tests**

**WHAT TO DO**: Test complete user workflows from start to finish
**RESEARCH**: Look up "end-to-end testing" and "testing Express applications"
**SUCCESS**: You can test the entire scan-to-result workflow automatically
**HINT**: Use your web interface or API endpoints for testing

#### **Task 7D: Test Error Scenarios**

**WHAT TO DO**: Verify your app handles problems gracefully
**RESEARCH**: Look up "error handling testing" and "negative test cases"
**SUCCESS**: Your tests verify the app behaves correctly when things go wrong
**HINT**: Test network failures, invalid data, and missing files

### **Questions to Answer Yourself:**

- What's the difference between unit, integration, and end-to-end tests?
- How do you test code that depends on external services?
- What percentage of test coverage is "good enough"?
- How do you maintain tests as your code changes?

---

## 📚 **Slice 8: Documentation and Deployment Prep**

**🎯 LEARN**: How to document and prepare your project for others
**💻 WHERE**: Your computer only
**⏱️ TIME**: 1-2 hours

### **Concepts You'll Learn:**

- How to write good documentation
- What is a README file and what should it contain?
- How to document your API
- How to prepare code for deployment

### **Your Tasks (Figure Out How):**

#### **Task 8A: Create Project README**

**WHAT TO DO**: Write a comprehensive README.md file for your project
**RESEARCH**: Look up "how to write good README" and "markdown syntax"
**SUCCESS**: Someone else could understand and run your project from your README
**HINT**: Include purpose, setup instructions, and usage examples

#### **Task 8B: Document Your API**

**WHAT TO DO**: Create documentation for all your Express routes/endpoints
**RESEARCH**: Look up "API documentation best practices" and "documenting REST APIs"
**SUCCESS**: Someone could use your API without reading your source code
**HINT**: Document what each endpoint does, what parameters it needs, and what it returns

#### **Task 8C: Add Code Comments**

**WHAT TO DO**: Add helpful comments to your code explaining complex logic
**RESEARCH**: Look up "JavaScript commenting best practices" and "JSDoc"
**SUCCESS**: Your code is self-explanatory even months later
**HINT**: Comment WHY you did something, not just WHAT you did

#### **Task 8D: Prepare for Hardware Integration**

**WHAT TO DO**: Document what you'll need to do when you get real hardware
**RESEARCH**: Think about your mock classes and what they'll need to be replaced with
**SUCCESS**: You have a clear plan for transitioning from mocks to real hardware
**HINT**: Create a checklist of what needs to change

### **Questions to Answer Yourself:**

- Why is documentation important for solo projects?
- What makes documentation helpful vs. confusing?
- How do you keep documentation up-to-date as code changes?
- What would someone need to know to contribute to your project?

---

## 🎯 **Final Victory Conditions**

By completing all 8 slices, you should have:

✅ **A fully functional RFID-to-Spotify system** (with simulated hardware)
✅ **Deep understanding of Node.js, APIs, and testing**
✅ **A professional project structure and documentation**
✅ **Experience with Test-Driven Development**
✅ **Knowledge of how to integrate external services**
✅ **Confidence to tackle similar projects independently**

## 🚀 **What You've Learned**

### **Technical Skills:**

- Node.js and npm ecosystem
- Express.js web server development
- API integration and authentication
- Test-Driven Development with Jest
- Object-oriented programming in JavaScript
- Async/await and Promise handling
- File system operations and data persistence
- Web interface development

### **Development Practices:**

- Project organization and structure
- Version control with Git
- Environment variable management
- Error handling and logging
- Code documentation
- Testing strategies and coverage

### **Problem-Solving Abilities:**

- Breaking complex problems into smaller pieces
- Reading documentation and finding solutions
- Debugging code and fixing errors
- Designing mock systems for testing
- Integrating multiple components

**🎉 Congratulations! You're now ready to add real hardware and become a full-stack IoT developer!**# RFID Spotify Player - Beginner Learning Tasks

## 🎯 **Learning Philosophy**

You'll figure out HOW to code each piece yourself. I'll only tell you WHAT to build and WHY.
**This is how you become a real developer - by solving problems yourself!**

---

## 🌱 **Slice 1: Project Foundation**

**🎯 LEARN**: How to set up a Node.js project from scratch
**💻 WHERE**: Your computer only
**⏱️ TIME**: 1-2 hours

### **Concepts You'll Learn:**

- What is `package.json` and why do we need it?
- What are npm packages and how do they work?
- What is project structure and why does it matter?
- What is Test Driven Development (TDD)?

### **Your Tasks (Figure Out How):**

#### **Task 1A: Create Project Structure**

**WHAT TO DO**: Create a new Node.js project called "rfid-spotify-player"
**RESEARCH**: Look up "how to create new Node.js project" and "npm init"
**SUCCESS**: You have a folder with `package.json` file
**HINT**: The terminal command `npm init` is your friend

#### **Task 1B: Add Basic Dependencies**

**WHAT TO DO**: Install `express` (for web server) and `jest` (for testing)
**RESEARCH**: Look up "how to install npm packages"
**SUCCESS**: You see `node_modules` folder and your `package.json` shows the dependencies
**HINT**: There's an `npm install` command

#### **Task 1C: Organize Your Code**

**WHAT TO DO**: Create folders for organizing different types of files
**RESEARCH**: Look up "Node.js project folder structure best practices"
**SUCCESS**: You have separate folders for source code and tests
**HINT**: Most projects have `src/` and `tests/` folders

#### **Task 1D: Write Your First Test**

**WHAT TO DO**: Create a simple test that checks if your project name is correct
**RESEARCH**: Look up "Jest testing framework" and "how to write first test"
**SUCCESS**: You can run `npm test` and see a test result (pass or fail)
**HINT**: Tests use `expect()` and should initially FAIL

#### **Task 1E: Make Test Pass**

**WHAT TO DO**: Fix whatever makes your test fail
**RESEARCH**: Look at the test error message and figure out what's wrong
**SUCCESS**: Your test turns from red (failing) to green (passing)
**HINT**: Usually involves changing some value in your code

### **Questions to Answer Yourself:**

- What does `package.json` actually contain?
- Why do we write tests BEFORE writing code?
- What happens when you run `npm install`?
- Why don't we commit the `node_modules` folder to Git?

---

## 🔧 **Slice 2: Mock Hardware System**

**🎯 LEARN**: How to simulate hardware when you don't have it yet
**💻 WHERE**: Your computer only
**⏱️ TIME**: 2-3 hours

### **Concepts You'll Learn:**

- What are classes and objects in JavaScript?
- How to use `module.exports` and `require()`
- What is "mocking" and why do developers do it?
- How to generate random data for testing

### **Your Tasks (Figure Out How):**

#### **Task 2A: Design RFID Scanner Interface**

**WHAT TO DO**: Write tests that describe how an RFID scanner should behave
**RESEARCH**: Look up "JavaScript classes" and "Jest testing methods"
**SUCCESS**: You have tests that expect a scanner to return tag IDs
**HINT**: Think about what methods an RFID scanner would need

#### **Task 2B: Build Mock Scanner Class**

**WHAT TO DO**: Create a fake RFID scanner that your tests can use
**RESEARCH**: Look up "JavaScript class constructor" and "Math.random()"
**SUCCESS**: Your mock scanner can pretend to scan different fake tags
**HINT**: Store fake tag names in an array and pick randomly

#### **Task 2C: Test Scanner Behavior**

**WHAT TO DO**: Verify your mock scanner works consistently
**RESEARCH**: Look up "JavaScript loops" and "console.log debugging
