# Testing Guide

This directory contains automated tests for the n8n-nodes-defuddle package using Jest.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

### Unit Tests
Tests for individual functions in isolation. These tests:
- Don't require n8n to be running
- Are fast and numerous
- Test pure functions like `convertToMarkdown()`

### Integration Tests
Tests for the node's `execute()` method with mocked n8n context. These tests:
- Mock the `IExecuteFunctions` interface that n8n provides
- Test the full execution flow without needing n8n running
- Verify input/output behavior

### E2E Tests
Manual tests in your actual n8n instance (what you do by linking the package). These are:
- Slower and fewer
- Test real-world workflows
- Validate the final user experience

## How Mocking Works

The key to testing outside n8n is **mocking the n8n context**. Here's what happens:

```typescript
// In real n8n:
// n8n provides IExecuteFunctions with methods like:
// - getInputData() - returns workflow data
// - getNodeParameter() - returns user-configured parameters
// - getNode() - returns node metadata

// In tests:
// We create a mock that simulates these methods:
const mockExecuteFunctions = {
  getInputData: jest.fn(() => [{ json: { data: '<html>...</html>' } }]),
  getNodeParameter: jest.fn((name) => { ... }),
  getNode: jest.fn(() => ({ name: 'Test Node', ... })),
  continueOnFail: jest.fn(() => false),
};

// Then call the node method with the mock context:
const result = await defuddleNode.execute.call(mockExecuteFunctions);
```

## Test Coverage

After running `npm run test:coverage`, open `coverage/index.html` in your browser to see:
- Which lines of code are tested
- Which branches are tested
- Overall coverage percentage

Aim for:
- **80%+ line coverage** for production code
- **100% coverage** for critical paths (error handling, data transformation)

## Adding New Tests

When adding a new feature:
1. Write tests first (TDD approach) or alongside the feature
2. Test happy path (expected behavior)
3. Test error cases (invalid input, missing data, etc.)
4. Test edge cases (empty arrays, null values, etc.)

Example:
```typescript
describe('My New Feature', () => {
  it('should work with valid input', () => { ... });
  it('should throw error with invalid input', () => { ... });
  it('should handle empty data gracefully', () => { ... });
});
```

## Why Test Outside n8n?

| Aspect | Manual (in n8n) | Automated (Jest) |
|--------|----------------|------------------|
| Speed | 30-60 seconds | < 1 second |
| Setup | Start n8n, link package, create workflow | `npm test` |
| Coverage | Hard to test edge cases | Easy to test all paths |
| Debugging | Limited logs | Full stack traces |
| CI/CD | Can't automate easily | Runs on every commit |
| Regression | Manual re-testing | Automatic |

**Both are valuable:**
- Jest for fast iteration and catching bugs early
- Manual testing for validating the real user experience

## Common Jest Patterns

### Test a function throws an error
```typescript
await expect(myFunction()).rejects.toThrow('Error message');
```

### Test async code
```typescript
it('should do async work', async () => {
  const result = await asyncFunction();
  expect(result).toBe(expected);
});
```

### Test object properties
```typescript
expect(result).toHaveProperty('content');
expect(result.content).toContain('text');
```

### Test array length
```typescript
expect(result).toHaveLength(3);
```

### Test with matchers
```typescript
expect(result).toMatch(/regex/);
expect(result).toBe('exact match');
expect(result).toContain('substring');
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest Matchers](https://jestjs.io/docs/expect)
- [n8n Node Development](https://docs.n8n.io/integrations/creating-nodes/)
