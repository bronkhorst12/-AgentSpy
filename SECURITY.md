# 🔒 Security Policy

Keamanan adalah prioritas utama dalam pengembangan AgentSpy. Kebijakan ini menguraikan cara melaporkan vulnerability dan standar keamanan yang kamipegang.

## 🛡️ Supported Versions

Kami mendukung security updates untuk versi berikut:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | ✅ Yes (Current)   |
| < 0.1   | ❌ No              |

## 🔍 Reporting Security Vulnerabilities

Kami mengambil security vulnerabilities secara serius. Jika Anda menemukan vulnerability, ikuti guidelines di bawah ini.

### How to Report

**DO NOT** melaporkan security issues melalui public GitHub issues.

**Preferred Method**: Email
- Email: `security@agentspy.dev` (placeholder)
- Subject: `[SECURITY] Brief description of vulnerability`
- Include detailed information (see template below)

**Alternative Method**: GitHub Security Advisories (akan diaktifkan soon)
- Gunakan GitHub's security advisory system
- Tag sebagai `security` untuk visibility

### What to Include

Template untuk security report:

```markdown
## Vulnerability Summary
- Brief description: [One-line summary]
- Affected component: [Frontend/Backend/API/Database]
- Severity: [Critical/High/Medium/Low]

## Impact Assessment
- What can be compromised: [Data/Functionality/System]
- Potential damage: [Financial/Data loss/Service disruption]
- Attack complexity: [Low/Medium/High]

## Technical Details
- Vulnerable code/function: [Specific function/component]
- Attack vector: [How to exploit]
- Proof of concept: [If available]

## Environment
- Version: [AgentSpy version]
- Environment: [Production/Staging/Development]
- Browser/OS: [If applicable]
- Additional context: [Any other relevant information]

## Suggested Fix
- Your proposed solution (if any)
- Priority level needed: [Immediate/Soon/Next release]
```

### Response Timeline

| Severity | Initial Response | Investigation | Fix Timeline |
|----------|------------------|---------------|--------------|
| Critical | 24 hours         | 48 hours      | 72 hours     |
| High     | 48 hours         | 5 days        | 2 weeks      |
| Medium   | 5 days           | 1 week        | 1 month      |
| Low      | 1 week           | 2 weeks       | Next release |

## 🔧 Security Practices

### Code Security

#### Input Validation
```typescript
// ✅ Good: Strict input validation
const validateAmount = (amount: string): number => {
  const parsed = parseFloat(amount);
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error('Invalid amount');
  }
  return parsed;
};

// ❌ Bad: No validation
const amount = parseFloat(userInput);
```

#### SQL Injection Prevention
```typescript
// ✅ Good: Parameterized queries
const { data, error } = await supabase
  .from('whale_events')
  .select('*')
  .eq('wallet_address', walletAddress);

// ❌ Bad: String concatenation
const query = `SELECT * FROM whale_events WHERE wallet_address = '${walletAddress}'`;
```

#### XSS Prevention
```typescript
// ✅ Good: Using React's built-in protection
const UserInput: React.FC<{ data: string }> = ({ data }) => (
  <div>{data}</div> // React escapes by default
);

// ❌ Bad: Dangerous HTML injection
const userInput = '<img src="x" onerror="alert(1)">';
document.getElementById('output').innerHTML = userInput;
```

### API Security

#### Rate Limiting
- Implement rate limiting untuk semua API endpoints
- Use IP-based dan user-based limiting
- Consider implement CAPTCHA untuk high-risk actions

```typescript
// Example rate limiting implementation
const rateLimiter = {
  requests: new Map(),
  limit: 100, // requests per minute
  window: 60000, // 1 minute
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside window
    const validRequests = requests.filter(
      req => now - req < this.window
    );
    
    if (validRequests.length >= this.limit) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }
};
```

#### Authentication & Authorization
- Use JWT tokens untuk authentication
- Implement proper role-based access control
- Always validate permissions pada server-side

```typescript
// ✅ Good: Proper authentication check
export const requireAuth = async (req: Request) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload; // Return user data
  } catch {
    return new Response('Invalid token', { status: 401 });
  }
};
```

### Database Security

#### Row Level Security (RLS)
- Implement RLS policies untuk semua tables
- Principle of least privilege
- Regular security audits

```sql
-- Example RLS policy
CREATE POLICY "Users can only access their own data"
ON whale_events
FOR ALL
USING (auth.uid()::text = user_id);

CREATE POLICY "Public read access for whale events"
ON whale_events
FOR SELECT
USING (true);
```

#### Data Encryption
- Encrypt sensitive data at rest
- Use HTTPS untuk all communications
- Hash passwords dengan salt

```typescript
// ✅ Good: Secure password hashing
import bcrypt from 'bcrypt';

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (
  password: string, 
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
```

### Frontend Security

#### Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:;">
```

#### Environment Variables
```env
# ✅ Good: Separate public dan private variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# ❌ Never expose sensitive data
SUPABASE_SERVICE_ROLE_KEY=never-in-client
JWT_SECRET=never-in-client
```

### Infrastructure Security

#### Dependency Management
- Regular security audits untuk dependencies
- Pin versions untuk production
- Monitor voor known vulnerabilities

```bash
# Security audit
npm audit
npm audit fix

# Dependency update monitoring
npm outdated
```

#### Server Configuration
- Disable unnecessary services
- Use firewall rules
- Regular security updates
- SSL/TLS certificates management

## 🚨 Security Incident Response

### Immediate Response (0-4 hours)
1. **Acknowledge** receipt of security report
2. **Assess** severity dan impact
3. **Assemble** incident response team
4. **Begin** initial investigation

### Investigation (4-24 hours)
1. **Reproduce** the vulnerability
2. **Determine** scope dan impact
3. **Develop** containment measures
4. **Document** findings

### Remediation (24-72 hours)
1. **Implement** fixes
2. **Test** fixes dalam isolated environment
3. **Prepare** deployment plan
4. **Coordinate** dengan stakeholders

### Recovery & Post-Incident
1. **Deploy** fixes to production
2. **Monitor** untuk signs of continued exploitation
3. **Communicate** dengan affected parties
4. **Conduct** post-incident review
5. **Update** security measures

## 🔒 Security Best Practices

### For Contributors

1. **Code Review**
   - All code changes harus di-review
   - Security-focused review checklist
   - Automated security scanning

2. **Development Environment**
   - Use separate development accounts
   - Never commit sensitive data
   - Regular dependency updates

3. **Testing**
   - Include security tests dalam CI/CD
   - Regular penetration testing
   - Vulnerability scanning

### For Users

1. **Account Security**
   - Use strong, unique passwords
   - Enable 2FA jika available
   - Regular password updates

2. **Browser Security**
   - Keep browser updated
   - Use ad blockers
   - Be cautious dengan browser extensions

3. **Network Security**
   - Use HTTPS connections
   - Avoid public WiFi untuk sensitive operations
   - Consider VPN usage

## 📊 Security Metrics

Kami track security metrics untuk continuously improve:

- **Vulnerability Response Time**: Average time to respond to reports
- **Security Incidents**: Number dan severity of incidents
- **Penetration Test Results**: Quarterly security assessments
- **Dependency Vulnerabilities**: Known CVEs dalam dependencies
- **Security Training**: Team security awareness metrics

## 📞 Contact Information

- **Security Team**: security@agentspy.dev
- **General Inquiries**: contact@agentspy.dev
- **Emergency**: [Phone number] (24/7)
- **PGP Key**: [Will be provided upon request]

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Solana Security Best Practices](https://docs.solana.com/developing/programming-model/security)
- [React Security](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [Supabase Security](https://supabase.com/docs/guides/auth/auth-security)

---

**Policy Version**: 1.0  
**Last Updated**: November 19, 2025  
**Next Review**: February 19, 2026

*Security is a shared responsibility. Thank you untuk membantu menjaga AgentSpy secure.* 🛡️