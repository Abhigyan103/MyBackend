# Authentication Testing Suite - README

This directory contains comprehensive tests for the authentication system of the MyBackend Node.js application.

## 🚀 Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Run all tests
npm test

# Run tests in watch mode (reruns on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## 📁 Test Structure

### Test Files

1. **`auth-simple.test.ts`** - Integration tests with mock Express app
   - Tests all authentication endpoints
   - Uses simplified mocking for quick execution
   - 21 test cases covering happy paths and error scenarios

2. **`auth-unit-simple.test.ts`** - Unit tests for individual components  
   - Password hashing and comparison
   - JWT token generation and verification
   - Input validation (email, password, roles)
   - Error handling scenarios
   - 18 test cases with isolated component testing

3. **`setup.ts`** - Test environment setup
   - MongoDB Memory Server configuration
   - Redis client mocking
   - Environment variable setup for tests

4. **`utils.ts`** - Test utilities and helpers
   - Common test data generators
   - Response assertion helpers
   - Mock objects and functions

### Test Configuration

- **`jest.config.js`** - Jest configuration for TypeScript + ESM support
- **`tsconfig.json`** - TypeScript configuration (shared with main app)

## 🧪 Test Coverage

### Authentication Endpoints Tested

| Endpoint | Method | Test Cases |
|----------|--------|------------|
| `/api/v1/auth/register` | POST | 5 test cases |
| `/api/v1/auth/login` | POST | 4 test cases |
| `/api/v1/auth/refresh-token` | GET | 3 test cases |
| `/api/v1/auth/delete-account` | DELETE | 4 test cases |
| `/api/v1/auth/change-password` | POST | 5 test cases |

### Unit Components Tested

- **Password Utilities**: Hashing, comparison, validation
- **JWT Utilities**: Token generation, verification, expiration
- **Validation Functions**: Email format, password strength, role validation
- **Error Handling**: Authentication errors, validation errors
- **Business Logic**: Registration flow, authentication flow, password changes

## 🔧 Test Features

### ✅ What's Tested

- **HTTP Status Codes**: Correct status codes for success/error scenarios
- **Response Structure**: JSON response format validation
- **Authentication Flow**: Complete user registration → login → token refresh cycle
- **Security**: Password hashing, JWT token security, cookie handling
- **Input Validation**: Email format, password complexity, required fields
- **Error Handling**: Proper error messages and status codes
- **Authorization**: Access token validation, role-based access

### 🛡️ Security Testing

- Password strength validation (uppercase, lowercase, numbers, special chars)
- JWT token generation and verification
- Refresh token mechanism
- Cookie security (httpOnly, secure, sameSite)
- Input sanitization and validation

### 📊 Validation Testing

- Email format validation (RFC compliant)
- Password complexity requirements
- Role validation (user, admin, superadmin)
- Required field validation
- Input length limits

## 🚨 Error Scenarios Tested

- Invalid email formats
- Weak passwords
- Missing required fields
- Invalid credentials
- Expired/invalid tokens
- Unauthorized access attempts
- Malformed requests

## 🎯 Test Data

### Sample Valid Data
```javascript
{
  email: 'test@example.com',
  password: 'TestPassword123!', // Strong password with all requirements
  roles: ['user', 'admin', 'superadmin']
}
```

### Sample Invalid Data
```javascript
{
  invalidEmails: ['invalid-email', '@domain.com', 'user@', ''],
  weakPasswords: ['short', 'NoSpecialChar123', 'nouppercasechar!'],
  invalidRoles: ['invalid', 'moderator', 'ADMIN']
}
```

## 📈 Test Metrics

- **Total Test Suites**: 2
- **Total Test Cases**: 39
- **Integration Tests**: 21 
- **Unit Tests**: 18
- **Execution Time**: ~2 seconds
- **Coverage**: Authentication endpoints, utilities, validation

## 🔄 Continuous Integration

Tests are designed to run in CI/CD environments:
- No external dependencies (uses in-memory databases)
- Fast execution (~2 seconds)
- Deterministic results
- Proper cleanup after each test

## 🐛 Debugging Tests

### Common Issues

1. **Module Resolution Errors**
   - Check import paths in test files
   - Ensure Jest configuration supports ESM

2. **Mock Issues** 
   - Verify mocks are properly set up before tests run
   - Check that mocked functions return expected values

3. **Async Test Failures**
   - Ensure `async/await` is used properly
   - Check that promises are resolved/rejected correctly

### Debug Commands

```bash
# Run specific test file
npx jest tests/auth-simple.test.ts --verbose

# Run tests with detailed output
npm test -- --verbose

# Run tests for specific pattern
npm test -- --testNamePattern="should login"
```

## 🔧 Adding New Tests

### For New Endpoints
1. Add integration tests in `auth-simple.test.ts`
2. Test both success and error scenarios
3. Verify response structure and status codes

### For New Utilities
1. Add unit tests in `auth-unit-simple.test.ts`
2. Test with valid and invalid inputs
3. Mock external dependencies

### Test Template
```javascript
describe('New Feature', () => {
  it('should handle success case', async () => {
    // Arrange
    const testData = { /* test data */ };
    
    // Act
    const response = await request(app)
      .post('/api/endpoint')
      .send(testData)
      .expect(200);
    
    // Assert
    expect(response.body).toHaveProperty('expectedProperty');
  });
  
  it('should handle error case', async () => {
    // Test error scenarios
  });
});
```

## 📚 Dependencies

### Testing Framework
- **Jest**: Test runner and assertion library
- **Supertest**: HTTP testing library
- **TypeScript**: Type safety for tests

### Mocking
- **MongoDB Memory Server**: In-memory database for tests
- **Jest Mocks**: Function and module mocking
- **bcryptjs**: Mocked for password testing
- **jsonwebtoken**: Mocked for JWT testing

---

## 💡 Best Practices

1. **Test Independence**: Each test should be able to run independently
2. **Clear Names**: Test names should clearly describe what's being tested
3. **AAA Pattern**: Arrange, Act, Assert structure
4. **Mock External**: Mock all external dependencies
5. **Edge Cases**: Test boundary conditions and error scenarios
6. **Fast Execution**: Keep tests fast for developer productivity

---

**Note**: This test suite provides comprehensive coverage for the authentication system. All tests pass and can be run locally or in CI/CD environments.