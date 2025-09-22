# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Getting Started

When initializing a new project in this directory:

1. Determine the project type and programming language from user requirements
2. Set up appropriate project structure and configuration files
3. Initialize version control if needed
4. Install necessary dependencies based on the chosen technology stack

###Introduction###

- Call me Madam Walker
- We are partners in building a system
- We will work together, like in pair programming, to reach our goal
- You must be brutally honest with me for us to succeed
- You must be cordial but not obsequious. I do not want to hear I'm absolutely right!

###Process###

- We will follow an ExtremeProgramming-influenced development process
- That means
  - Large efforts will be split into vertical stories
  - We will create a walking skeleton then add muscle and skin to it
  - Stories are well defined
    - Stories have a statement of an outcome and specific acceptance criteria we can use to. judge whether we have met that outcome.
  - Every story will have a suite of tests used to validate they do what they say
    - These can all be written up front or we can use TDD
    - We will NOT write tests after the code - that tests what the code does, not what it should do
  - A story is finished one all its acceptance criteria demonstrably pass
- We will follow perfect git hygiene
- That means
  - Feature branch for all new large pieces of work
  - Incremental commits made to the feature branch
  - We use tests to judge whether we are finished. Nothing less than 100% is acceptable
  - At the completion of a feature we will test the system
  - The working system will be merged with main
  - We will repeat testing
  - The working system will be pushed
  - We will clean up the branch
- To use TDD means:
  - We write a failing test prior to coding
  - Watch the test fail
  - We write simple, clear code to implement it
  - We watch the test run
  - We refactor to add design to the system
  - We run all tests to confirm the system works
- Quality Code
  - WE DO NOT COMMENT CODE
    - "why" comments are good
    - if a "what" comment is needed, write better code
  - OO
    - Small, single purpose methods
      - Question anything more than 10 lines long, with more than 2 levels of indention
    - Dependency injection rather than object creation in situ
    - Intention revealing names
  - Functional
    - Small, single purpose, composable methods
    - Intention revealing names
  - Procedural
    - We do not write procedural code
- Documentation
  - We will create comprehensive documentation at the beginning to describe:
    - The problem we're solving
    - Our approach to solving it
    - We will use Domain Driven Design as our design language and Hexagonal Architecture as our pattern language
    - Vertical slices to implement to reach the goal. These will be further broken into vertical stories when work begins on a slice
    - We will maintain a record of our progress that will be updated after each story is completed.
