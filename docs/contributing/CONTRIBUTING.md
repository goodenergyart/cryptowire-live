# Contributing to CryptoWire LIVE

Thank you for your interest in contributing to CryptoWire LIVE! This document provides guidelines and information for contributors.

## 🌟 How to Contribute

### Reporting Bugs
- Use the [GitHub Issues](https://github.com/goodenergyart/cryptowire-live/issues) page
- Search existing issues before creating a new one
- Use the bug report template
- Include steps to reproduce, expected behavior, and actual behavior
- Add screenshots or logs when helpful

### Suggesting Features
- Open a feature request issue using the template
- Describe the problem you're trying to solve
- Explain your proposed solution
- Consider how it fits with the project's goals

### Code Contributions
1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ or Bun
- Git
- A code editor (VS Code recommended)

### Local Development
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/cryptowire-live.git
cd cryptowire-live

# Install dependencies
bun install

# Start development server
bun run dev

# Run tests
bun test

# Run linting
bun run lint

# Format code
bun run format
```

### Environment Setup
Copy `.env.example` to `.env.local` and fill in the required values:
```env
VITE_LAKESAIL_API_KEY=your_development_api_key
VITE_LAKESAIL_ENDPOINT=wss://dev-api.lakesail.com/v1/streams
VITE_LOG_LEVEL=debug
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── charts/         # Chart components
│   ├── ui/             # Basic UI elements
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── services/           # API and data services
├── utils/              # Utility functions
├── types/              # TypeScript definitions
└── tests/              # Test files
```

## 🎯 Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Avoid `any` types
- Use meaningful variable and function names

```typescript
// Good
interface TransactionData {
  id: string;
  amount: number;
  timestamp: number;
}

// Avoid
const data: any = {};
```

### React Components
- Use functional components with hooks
- Keep components focused and small
- Use TypeScript interfaces for props
- Include proper error boundaries

```typescript
interface TransactionCardProps {
  transaction: TransactionData;
  onSelect?: (id: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onSelect
}) => {
  // Component implementation
};
```

### CSS/Styling
- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use semantic class names for custom CSS
- Maintain consistent spacing and colors

### Testing
- Write unit tests for utilities and hooks
- Write integration tests for components
- Aim for 80%+ test coverage
- Use meaningful test descriptions

```typescript
describe('TransactionCard', () => {
  it('should display transaction amount correctly', () => {
    // Test implementation
  });

  it('should call onSelect when clicked', () => {
    // Test implementation
  });
});
```

## 🔄 Git Workflow

### Branch Naming
- `feature/add-whale-detection`
- `fix/transaction-display-bug`
- `docs/update-api-examples`
- `refactor/optimize-chart-rendering`

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(charts): add real-time price chart component
fix(websocket): handle connection timeouts properly
docs(api): update WebSocket event documentation
refactor(utils): optimize data transformation functions
```

### Pull Request Process
1. **Update your branch** with the latest changes from `main`
2. **Test thoroughly** - ensure all tests pass
3. **Update documentation** if needed
4. **Fill out the PR template** completely
5. **Request review** from maintainers

### PR Checklist
- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)

## 🧪 Testing Guidelines

### Unit Tests
```typescript
// utils/formatCurrency.test.ts
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('should format USD amounts correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });
});
```

### Component Tests
```typescript
// components/TransactionCard.test.tsx
import { render, screen } from '@testing-library/react';
import { TransactionCard } from './TransactionCard';

describe('TransactionCard', () => {
  const mockTransaction = {
    id: '1',
    amount: 1000,
    timestamp: Date.now()
  };

  it('renders transaction data', () => {
    render(<TransactionCard transaction={mockTransaction} />);
    expect(screen.getByText('$1,000')).toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
// tests/integration/realtime-feed.test.ts
describe('Real-time Transaction Feed', () => {
  it('should display new transactions as they arrive', async () => {
    // Mock WebSocket connection
    // Test real-time updates
  });
});
```

## 📚 Documentation

### Code Documentation
- Use JSDoc for functions and classes
- Include examples for complex utilities
- Document component props with TypeScript interfaces

```typescript
/**
 * Formats a cryptocurrency amount with proper decimal places
 * @param amount - The amount to format
 * @param symbol - The cryptocurrency symbol
 * @returns Formatted string with symbol
 * @example
 * formatCryptoAmount(1.5, 'ETH') // returns "1.50 ETH"
 */
function formatCryptoAmount(amount: number, symbol: string): string {
  // Implementation
}
```

### README Updates
- Update feature lists when adding new functionality
- Add new environment variables to setup instructions
- Include breaking changes in upgrade guides

## 🚀 Performance Guidelines

### Frontend Optimization
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Debounce user inputs
- Optimize bundle size with code splitting

### Data Handling
- Implement efficient WebSocket message processing
- Use appropriate data structures for performance
- Cache frequently accessed data
- Minimize re-renders with proper dependencies

## 🔒 Security Considerations

### API Keys
- Never commit API keys to version control
- Use environment variables for sensitive data
- Validate all user inputs
- Implement proper error handling

### Data Sanitization
```typescript
// Good - sanitize user inputs
const sanitizedInput = DOMPurify.sanitize(userInput);

// Avoid - direct HTML insertion
element.innerHTML = userInput; // Potential XSS
```

## 🏷️ Release Process

### Versioning
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped appropriately
- [ ] Release notes prepared

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Credit others for their contributions

### Communication
- Use clear, concise language
- Ask questions when unsure
- Share knowledge and help others
- Be patient with code reviews

## 🎯 Areas for Contribution

### High Priority
- [ ] Enhanced whale detection algorithms
- [ ] Additional blockchain network support
- [ ] Mobile responsiveness improvements
- [ ] Performance optimizations

### Medium Priority
- [ ] Dark mode implementation
- [ ] Notification system
- [ ] Export functionality
- [ ] Advanced filtering options

### Good First Issues
- [ ] UI/UX improvements
- [ ] Documentation improvements
- [ ] Test coverage increases
- [ ] Bug fixes

## 🏆 Recognition

Contributors will be recognized in:
- GitHub contributor list
- Project README
- Release notes
- Annual contributor highlights

## 📞 Getting Help

- **Discord**: [Join our development channel](https://discord.gg/cryptowire-dev)
- **GitHub Discussions**: For general questions
- **Issues**: For bug reports and feature requests
- **Email**: dev@cryptowire.live for security issues

## 📄 License

By contributing to CryptoWire LIVE, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to CryptoWire LIVE! Together, we're building the future of blockchain intelligence. 🚀
