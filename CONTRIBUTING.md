# 🤝 Contributing Guidelines

Terima kasih atas interesse Anda untuk berkontribusi pada AgentSpy! Panduan ini akan membantu Anda memulai proses kontribusi.

## 📋 Daftar Isi

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Guidelines](#coding-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## 📖 Code of Conduct

Dengan berpartisipasi dalam proyek ini, Anda diharapkan untuk mempertahankan standar perilaku yang profesional dan ramah. Kami berkomitmen untuk menyediakan lingkungan yang welcoming bagi semua kontributor.

### Standar Perilaku

- Gunakan bahasa yang ramah dan inklusif
- Hormati opini dan pengalaman yang berbeda
- Terima kritik konstruktif dengan baik
- Fokus pada yang terbaik untuk komunitas
- Tunjukkan empati terhadap kontributor lain

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ dan npm/pnpm
- Git
- Akun Supabase (untuk backend development)
- Editor code (VS Code direkomendasikan)

### Setup Development Environment

1. **Fork Repository**
   ```bash
   git clone https://github.com/your-username/AgentSpy.git
   cd AgentSpy
   ```

2. **Buat Branch Baru**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Setup Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local dengan credentials Anda
   ```

## 🔄 Development Workflow

### Branch Naming Convention

Gunakan prefix yang jelas untuk branch Anda:

- `feature/` - Fitur baru
- `bugfix/` - Perbaikan bug
- `docs/` - Dokumentasi
- `refactor/` - Refactoring kode
- `test/` - Testing related
- `hotfix/` - Perbaikan urgent

**Contoh:**
```bash
feature/whale-notifications
bugfix/search-functionality
docs/api-documentation
```

### Commit Message Convention

Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types yang didukung:**
- `feat`: fitur baru
- `fix`: perbaikan bug
- `docs`: perubahan dokumentasi
- `style`: formatting, missing semi colons, etc
- `refactor`: refactoring kode
- `test`: menambah atau mengubah tests
- `chore`: perubahan build process atau auxiliary tools

**Contoh:**
```bash
feat(whale): add real-time notifications for large transactions
fix(market): resolve DEX data loading timeout
docs(api): update endpoint documentation
```

## 📝 Coding Guidelines

### TypeScript Standards

- Gunakan TypeScript strict mode
- Definisikan interface untuk semua data structures
- Gunakan proper types untuk API responses
- Avoid `any` type, gunakan `unknown` jika perlu

```typescript
// ✅ Good
interface WhaleTransaction {
  signature: string;
  amount: number;
  timestamp: number;
  wallet_address: string;
}

// ❌ Bad
const transaction: any = {
  // unpredictable structure
};
```

### React Components

- Functional components dengan hooks
- PropTypes atau TypeScript interfaces untuk props
- Descriptive component names (PascalCase)
- One component per file

```typescript
// ✅ Good
interface MarketFlowProps {
  timeframe: '24h' | '7d' | '30d';
  onDataUpdate: (data: MarketData[]) => void;
}

export const MarketFlow: React.FC<MarketFlowProps> = ({ 
  timeframe, 
  onDataUpdate 
}) => {
  // Component logic
};
```

### Styling Guidelines

- Gunakan Tailwind CSS classes
- Mobile-first responsive design
- Consistent spacing (tailwind spacing scale)
- Color palette sesuai design system

### Error Handling

- Always handle API errors gracefully
- Provide user-friendly error messages
- Log errors untuk debugging
- Use error boundaries untuk React components

```typescript
try {
  const data = await fetchMarketData();
  setMarketData(data);
} catch (error) {
  console.error('Market data fetch failed:', error);
  setError('Unable to load market data. Please try again.');
}
```

## 🔧 Pull Request Process

### Before Submitting

1. **Run Tests**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

2. **Update Documentation**
   - Update relevant docs
   - Add code comments jika perlu
   - Update CHANGELOG.md

3. **Test Your Changes**
   - Test di local development
   - Test pada multiple screen sizes
   - Verify API integrations work

### PR Template

Setiap Pull Request harus mengikuti template yang sudah disediakan di `.github/PULL_REQUEST_TEMPLATE.md`.

### Review Process

1. **Automated Checks**
   - Linting must pass
   - Type checking must pass
   - Tests must pass

2. **Code Review**
   - Reviewer akan memeriksa:
     - Code quality dan maintainability
     - Performance implications
     - Security considerations
     - Documentation completeness

3. **Testing**
   - Reviewer akan test functionality
   - Check responsive design
   - Verify API integrations

### Merge Requirements

- Minimum 1 approval dari maintainer
- All automated checks harus pass
- No pending changes dari author
- Documentation updated (jika diperlukan)

## 🐛 Issue Reporting

### Bug Reports

Gunakan template di `.github/ISSUE_TEMPLATE/bug_report.md` untuk melaporkan bug.

**Information yang dibutuhkan:**
- Deskripsi bug yang detail
- Langkah untuk reproduce
- Expected vs actual behavior
- Screenshots jika applicable
- Environment details (browser, OS, etc.)

### Feature Requests

Gunakan template di `.github/ISSUE_TEMPLATE/feature_request.md` untuk request fitur baru.

**Information yang dibutuhkan:**
- Deskripsi fitur yang jelas
- Problem yang ingin diselesaikan
- Proposed solution atau alternatif
- Additional context atau use cases

## 🎯 Performance Guidelines

### Frontend Performance

- Optimize bundle size
- Use React.memo untuk expensive components
- Implement proper loading states
- Lazy load non-critical components

### Backend Performance

- Optimize database queries
- Implement caching strategy
- Use efficient Solana RPC calls
- Monitor function execution time

## 🔒 Security Guidelines

- Never expose API keys dalam code
- Validate all user inputs
- Use HTTPS untuk semua API calls
- Implement proper CORS policies
- Review security implications sebelum merge

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Solana Documentation](https://docs.solana.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## ❓ Getting Help

Jika Anda butuh bantuan:

1. **GitHub Discussions** - Untuk pertanyaan umum
2. **GitHub Issues** - Untuk bug reports atau feature requests
3. **Documentation** - Baca docs yang sudah ada

## 🙏 Recognition

Contributors akan diakui dalam:
- CHANGELOG.md untuk significant contributions
- README.md contributors section (opt-in)
- GitHub contributors graph

Terima kasih atas kontribusi Anda ke AgentSpy! 🚀