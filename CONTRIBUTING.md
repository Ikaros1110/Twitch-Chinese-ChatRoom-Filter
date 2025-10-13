# Contributing to Twitch Chinese ChatRoom Filter

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Twitch-Chinese-ChatRoom-Filter.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`

## Development Setup

1. Load the extension in your browser (see README.md for instructions)
2. Make your changes
3. Test thoroughly using the test cases in TESTING.md
4. Commit your changes with clear commit messages

## Code Style

- Use consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing code patterns in the project

## Testing

Before submitting a pull request:

1. Run the automated tests: `node test.js`
2. Manually test all functionality (see TESTING.md)
3. Test in multiple browsers if possible (Chrome, Edge, Firefox)
4. Verify that settings persist across browser restarts
5. Check browser console for any errors

## Pull Request Process

1. Update README.md if you add new features
2. Update TESTING.md if you add new test cases
3. Ensure all tests pass
4. Update the version number in manifest.json if appropriate
5. Create a pull request with a clear description of changes

## Types of Contributions

### Bug Fixes
- Report bugs via GitHub Issues
- Include steps to reproduce
- Provide browser version and extension version

### New Features
- Discuss new features in GitHub Issues first
- Keep changes focused and minimal
- Ensure backwards compatibility
- Update documentation

### Documentation
- Fix typos and improve clarity
- Add examples and use cases
- Translate documentation (if applicable)

### Ideas for Contributions

- Support for other character sets (Japanese Kanji, Korean, etc.)
- Whitelist/blacklist specific users
- Custom filter patterns
- Statistics on filtered messages
- Export/import settings
- Dark/light theme for popup
- Keyboard shortcuts
- Filter by message length or patterns

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on the issue, not the person
- Assume good intentions

## Questions?

Feel free to open an issue for any questions or concerns.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
