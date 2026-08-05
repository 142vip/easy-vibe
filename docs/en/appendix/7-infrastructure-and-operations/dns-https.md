# Principles of Domain Names, DNS, and HTTPS

::: tip Foreword
**When you type `www.google.com` in your browser and press Enter, what happens behind the scenes?** This seemingly simple action involves a series of precisely coordinated processes: domain name resolution, DNS queries, and TLS encryption handshakes. Understanding these mechanisms is essential for every developer — it directly determines whether your website can be accessed and whether your data can be intercepted.
:::

**What will you learn from this article?**

After completing this chapter, you will gain:

- **DNS Principles**: Understand the complete process of how domain names are translated into IP addresses
- **Record Types**: Master the uses of common DNS records like A, CNAME, and MX
- **HTTPS Mechanisms**: Understand how TLS handshakes establish secure connections
- **Certificate System**: Learn about the trust chain of digital certificates and verification mechanisms
- **Security Awareness**: Understand why HTTPS is the baseline requirement for the modern web

| Chapter | Content | Core Concepts |
|---------|---------|---------------|
| **Chapter 1** | DNS Resolution | Recursive queries, iterative queries |
| **Chapter 2** | DNS Records | A, CNAME, MX, TXT |
| **Chapter 3** | HTTPS and TLS | Handshake process, encrypted communication |
| **Chapter 4** | Certificate Trust Chain | CA, root certificates, intermediate certificates |
| **Chapter 5** | HTTP vs HTTPS | Plain text vs encrypted, security comparison |

---

## 0. Big Picture: From Domain Names to Secure Connections

Internet communication is based on IP addresses (like 142.250.80.46), but humans can't remember these numbers. So we invented the **Domain Name System (DNS)** — the internet's "phonebook" that translates human-readable domain names into machine-readable IP addresses.

But finding the server isn't enough. If communication is transmitted in plain text, any man-in-the-middle can eavesdrop on or tamper with your data. **HTTPS** solves this problem — it adds a layer of TLS encryption on top of HTTP, ensuring the confidentiality and integrity of data during transmission.

::: tip A Complete Web Page Visit
1. **Domain Resolution**: The browser asks DNS "What's the IP for www.google.com?" DNS responds "142.250.80.46"
2. **TCP Connection**: The browser establishes a TCP three-way handshake with the server
3. **TLS Handshake**: Both parties negotiate encryption algorithms, verify certificates, and exchange keys
4. **Encrypted Communication**: All HTTP data is transmitted through the encrypted channel
:::

---

## 1. DNS Resolution: The Internet's "Phonebook"

DNS (Domain Name System) works like looking up a phonebook: you know the other person's name (domain name) and need to find their phone number (IP address). But the internet's "phonebook" isn't a single book — it's a hierarchical, distributed system.

<DnsResolutionDemo />

::: tip Four Steps of DNS Resolution
1. **Browser Cache**: Check the local cache first. If you've visited this domain before, use the cached IP directly
2. **Recursive Resolver**: If the cache misses, the request goes to the ISP's recursive resolver (like 8.8.8.8)
3. **Hierarchical Query**: The recursive resolver asks the root name server → top-level domain server (.com) → authoritative name server (google.com) in sequence
4. **Return Result**: The authoritative server returns the final IP, the recursive resolver caches the result and returns it to the browser
:::

| Level | Server | Responsibility | Count |
|-------|--------|---------------|-------|
| Root | Root Server | Knows the addresses of all top-level domains | 13 groups globally |
| Top-level Domain | TLD Server | Manages .com, .cn, .org, etc. | One group per suffix |
| Authoritative | Authoritative | Stores DNS records for specific domains | At least 2 per domain |
| Recursive Resolver | Resolver | Completes the entire query process on behalf of the user | ISP or public DNS |

---

## 2. DNS Record Types: The "Configuration Table" Behind Domain Names

DNS does more than just translate domain names to IPs. Through different types of DNS records, you can control email delivery, domain redirection, service discovery, and more. Understanding these record types is fundamental for configuring domain names and troubleshooting network issues.

<DnsRecordTypeDemo />

| Record Type | Purpose | Example |
|------------|---------|---------|
| A | Domain → IPv4 address | `example.com → 93.184.216.34` |
| AAAA | Domain → IPv6 address | `example.com → 2606:2800:220:1:...` |
| CNAME | Domain → another domain (alias) | `www.example.com → example.com` |
| MX | Specifies mail server | `example.com → mail.example.com` |
| TXT | Stores text information | SPF verification, domain ownership verification |
| NS | Specifies authoritative name server | `example.com → ns1.example.com` |

::: tip DNS Configuration in Real Scenarios
- **Deploying a website**: Add an A record pointing to the server IP, or CNAME pointing to a CDN domain
- **Configuring email**: Add MX records pointing to the mail server, TXT records for SPF/DKIM anti-spam
- **Verifying domain ownership**: Cloud providers require you to add specific TXT records to prove you own the domain
- **Load balancing**: Configure multiple A records for the same domain, DNS round-robin distributes traffic
:::

---

## 3. HTTPS and TLS: Putting "Body Armor" on Your Data

HTTP protocol transmits data in plain text — like sending a postcard where the mailman (man-in-the-middle) can read the contents at will. HTTPS adds a layer of TLS (Transport Layer Security) encryption on top of HTTP, equivalent to putting the postcard in a sealed envelope.

The TLS handshake is the critical step for establishing a secure connection. It completes identity verification and key negotiation before正式 transmitting data.

<HttpsHandshakeDemo />

::: tip Core Steps of TLS 1.3 Handshake
1. **Client Hello**: The client sends a list of supported encryption algorithms and a random number
2. **Server Hello**: The server selects an encryption algorithm, returns the digital certificate and a random number
3. **Certificate Verification**: The client verifies whether the server's certificate is trustworthy (checks CA signature, validity period, domain match)
4. **Key Exchange**: Both parties negotiate a shared key through the ECDHE algorithm (the key itself is not transmitted over the network)
5. **Encrypted Communication**: All subsequent data is encrypted using the negotiated symmetric key
:::

| Feature | TLS 1.2 | TLS 1.3 |
|---------|---------|---------|
| Handshake round trips | 2-RTT | 1-RTT (first time) / 0-RTT (resumption) |
| Key exchange | RSA or ECDHE | ECDHE only (forward secrecy) |
| Cipher suites | Supports more legacy algorithms | Only secure algorithms retained |
| Performance | Slower | Faster |

---

## 4. Certificate Trust Chain: Motivation for Trusting This Website

The most critical step in the TLS handshake is "certificate verification." How does the browser determine whether a website's certificate is genuine and not forged by an attacker? The answer is the **certificate trust chain** — a system of endorsements at every level.

<CertificateChainDemo />

::: tip Three-Layer Structure of the Certificate Trust Chain
1. **Root Certificate (Root CA)**: Issued by trusted certificate authorities, pre-installed in operating systems and browsers. This is the "anchor" of trust.
2. **Intermediate Certificate (Intermediate CA)**: Issued by the root CA, used to issue end-entity certificates. Root CAs don't directly issue website certificates for security isolation.
3. **End-entity Certificate (Leaf Certificate)**: The certificate your website actually uses, issued by the intermediate CA, containing the domain name, public key, validity period, and other information.
:::

| Certificate Type | Verification Level | Issuance Speed | Use Case |
|-----------------|-------------------|---------------|----------|
| DV (Domain Validation) | Only verifies domain ownership | Minutes | Personal websites, blogs |
| OV (Organization Validation) | Verifies organizational identity | Days | Corporate websites |
| EV (Extended Validation) | Strict identity verification | Weeks | Banks, financial institutions |
| Wildcard Certificate | Covers all subdomains | Varies by type | Multi-subdomain scenarios |

---

## 5. HTTP vs HTTPS: Why Encryption Is the Baseline

In 2024, over 95% of global web traffic was transmitted via HTTPS. Chrome marks HTTP websites with a "Not Secure" warning, and search engines lower the ranking of HTTP websites. HTTPS is no longer an "optional extra" — it's the baseline requirement for the modern web.

<DnsHttpsComparisonDemo />

| Dimension | HTTP | HTTPS |
|-----------|------|-------|
| Data transmission | Plain text, can be eavesdropped | Encrypted, cannot be eavesdropped |
| Identity verification | None, cannot confirm server identity | Yes, server verified through certificates |
| Data integrity | No protection, can be tampered with | Protected, tampering will be detected |
| Port | 80 | 443 |
| SEO impact | Lower search ranking | Search ranking boost |
| Browser display | Shows "Not Secure" warning | Shows lock icon |

::: tip Getting Free HTTPS Certificates
**Let's Encrypt** is a free, automated certificate authority that enables any website to enable HTTPS at zero cost. Combined with the Certbot tool, you can apply for and auto-renew certificates with a single command. Most cloud platforms and CDN providers also offer free SSL certificates.
:::

---

## Summary

Domain names, DNS, and HTTPS are the three pillars of internet infrastructure. DNS enables us to access websites using human-readable names, and HTTPS ensures the communication process is secure and trustworthy.

Key takeaways from this chapter:

1. **DNS is a hierarchical system**: Root → Top-level domain → Authoritative, queried level by level, accelerated by caching
2. **Record types have different purposes**: A records point to IPs, CNAME creates aliases, MX manages email, TXT handles verification
3. **TLS handshake establishes trust**: Certificate verification + key negotiation, TLS 1.3 requires only 1-RTT
4. **Certificate trust chain**: Root CA → Intermediate CA → Leaf certificate, endorsed at every level
5. **HTTPS is the baseline**: Free certificates (Let's Encrypt) make encryption zero-barrier

## Further Reading

- [How DNS Works](https://howdns.works/) - A comic-style explanation of DNS
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/) - Free SSL certificate application guide
- [Cloudflare Learning Center](https://www.cloudflare.com/learning/dns/what-is-dns/) - DNS and network security tutorials
- [TLS 1.3 RFC 8446](https://datatracker.ietf.org/doc/html/rfc8446) - TLS 1.3 protocol specification
- [SSL Labs](https://www.ssllabs.com/ssltest/) - Online HTTPS configuration quality checker
