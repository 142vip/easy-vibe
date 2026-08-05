# An Introduction to File and Object Storage

::: tip Introduction
**A user uploads an avatar, and you save it in the server's `/uploads` directory — then the server's disk fills up, or you add a second server and the user finds their avatar appears and disappears.** File storage seems simple, but in distributed environments it's an architectural problem that requires serious attention. Object storage is the standard answer to this problem in the internet age.
:::

**What will you learn in this article?**

After reading this chapter, you will gain:

- **Storage type awareness**: Understand the differences and use cases for block storage, file storage, and object storage
- **Object storage core concepts**: Master Bucket, Object, Key, Pre-signed URL, and other core concepts
- **Upload solution design**: Learn to choose between client-side direct upload and server-side relay
- **CDN acceleration principles**: Understand how CDN accelerates global distribution of static assets
- **Best practices**: Master file naming, access control, lifecycle management, and other practical techniques

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | Storage type comparison | Block storage, file storage, object storage |
| **Chapter 2** | Object storage core concepts | Bucket, Object, Key, Metadata |
| **Chapter 3** | File upload solutions | Client-side direct upload, Pre-signed URL |
| **Chapter 4** | CDN acceleration | Edge nodes, cache policies, origin fetch |
| **Chapter 5** | Best practices | Naming conventions, permissions, lifecycle |

---

## 0. The Big Picture: Motivation for Caning 't You Store Files on the Server Locally

When starting a project, saving user-uploaded files in a local server directory is the most intuitive approach. But as the project grows, you'll encounter a series of problems:

- **Limited disk space**: Server disks always fill up; expanding capacity is troublesome
- **Multi-server non-sharing**: With load balancing, user requests may hit different servers, and files can't be found
- **No backup**: If the server goes down, the files are gone
- **No CDN**: Users worldwide accessing a single server experience slow speeds

::: tip The Core Value of Object Storage
Object storage (like AWS S3, Alibaba Cloud OSS) solves all these problems: **infinite capacity, globally accessible, automatic backup, native CDN support**. It has become the de facto standard for file storage in internet applications.
:::

---

## 1. Storage Type Comparison: Block, File, Object

There are three main storage types in the computing world, each solving problems at different levels.

<FileStorageTypeDemo />

| Dimension | Block Storage | File Storage | Object Storage |
|------|--------|---------|---------|
| Data unit | Fixed-size blocks | Files + directories | Objects (Key-Value) |
| Access protocol | iSCSI/FC | NFS/SMB | HTTP REST API |
| Performance | Highest (millisecond) | Medium | Lower (but sufficient) |
| Scalability | Limited | Medium | Nearly infinite |
| Cost | Highest | Medium | Lowest |
| Typical use case | Databases | Shared files | Images/video/backups |

::: tip Simple Mnemonic
- **Block storage** is like a hard drive — for databases
- **File storage** is like a network shared folder — for sharing configurations across multiple servers
- **Object storage** is like cloud storage — for user-uploaded images and videos
:::

---

## 2. Object Storage Core Concepts

The data model of object storage is very simple: a **Bucket** is the container, an **Object** is the file, and each object is identified by a unique **Key**.

```
my-app-bucket/                    ← Bucket
├── avatars/user-123.jpg          ← Object Key
├── avatars/user-456.png          ← Object Key
├── reports/2024/q1-report.pdf    ← Object Key ("directory" is just a Key prefix)
└── uploads/temp/file.zip         ← Object Key
```

| Concept | Description | Example |
|------|------|------|
| Bucket | Storage container, globally unique name | `my-app-prod`, `company-assets` |
| Object | The stored file itself + metadata | An image, a PDF |
| Key | The object's unique identifier | `avatars/user-123.jpg` |
| Metadata | Additional information about the object | Content-Type, custom tags |
| ACL | Access Control List | public-read, private |
| Pre-signed URL | Temporary authorized access link | Upload/download link valid for 15 minutes |

::: tip Object Storage Has No Real "Directories"
`avatars/user-123.jpg` — the `avatars/` part is not a directory, just a Key prefix. Object storage is a flat structure; all objects are at the same level. The "folders" displayed in the console are just visual grouping by prefix.
:::

---

## 3. File Upload Solutions: Who Uploads the File

There are two mainstream approaches for file upload: server-side relay and client-side direct upload. For most scenarios, **client-side direct upload** is the better choice.

<FileUploadFlowDemo />

::: tip Advantages of Client-Side Direct Upload
1. **Saves server bandwidth**: Files don't pass through your server; they go directly to OSS
2. **Avoids timeouts**: Large file uploads won't trigger Nginx/gateway timeout limits
3. **Reduces server load**: The server only needs to issue credentials, not process file streams
4. **Supports resumable uploads**: OSS natively supports multipart upload; the frontend can implement resumable uploads

Implementation steps: Frontend requests a Pre-signed URL from the backend → Frontend uses this URL to upload directly to OSS → OSS callback notifies the backend
:::

---

## 4. CDN Acceleration: Making It Fast for Users Worldwide

When your users are distributed globally, downloading files from a single origin server is slow. CDN (Content Delivery Network) deploys edge nodes worldwide, caching files at nodes closest to users, dramatically reducing access latency.

<CDNAccelerationDemo />

| CDN Concept | Description |
|---------|------|
| Edge node | Cache servers distributed around the world |
| Origin fetch | When an edge node doesn't have a cached copy, it requests the file from the origin server |
| Cache hit rate | The proportion of requests served directly by edge nodes; the higher the better |
| TTL | Cache validity period; after expiration, a new origin fetch is needed |
| Cache invalidation | Proactively clearing edge node caches to make new files take effect |

::: tip CDN Best Practices
- **Add hash to filenames**: `logo.a3f2b1.png` instead of `logo.png`, so you don't need to invalidate cache when updating files
- **Set reasonable TTLs**: Static assets (JS/CSS/images) get long TTLs (1 year), HTML gets short TTLs (5 minutes)
- **Enable Gzip/Brotli compression**: Text-based resources can be reduced by 60-80% after compression
:::

---

## 5. Best Practices

| Practice | Description | Example |
|------|------|------|
| Key naming convention | Use meaningful prefixes to organize files | `{type}/{date}/{uuid}.{ext}` |
| Avoid hot spot Keys | Don't start with incrementing numbers | Use UUID or hash prefixes |
| Minimum necessary permissions | Bucket defaults to private | Only set public-read for files that need to be public |
| Lifecycle rules | Automatically clean up expired files | Temp files auto-deleted after 7 days |
| CORS configuration | Frontend direct upload requires CORS setup | Allow your domain to PUT/POST |
| Server-side encryption | Enable SSE for sensitive files | SSE-S3 or SSE-KMS |

---

## Summary

File storage is a fundamental issue that every web application encounters. Object storage, with its infinite capacity, low cost, and high availability, has become the standard choice for internet applications.

Key takeaways from this chapter:

1. **Three storage types**: Block storage for databases, file storage for sharing, object storage for user files
2. **Object storage model**: Bucket + Key + Object, flat structure, HTTP API access
3. **Client-side direct upload**: Pre-signed URL approach — files don't pass through the server, efficient and resource-saving
4. **CDN acceleration**: Edge node caching + filename hashing, making it fast for users worldwide
5. **Security and management**: Minimum necessary permissions, lifecycle rules, server-side encryption

## Further Reading

- [AWS S3 Developer Guide](https://docs.aws.amazon.com/s3/) - The benchmark documentation for object storage
- [Alibaba Cloud OSS Best Practices](https://help.aliyun.com/document_detail/31853.html) - The most commonly used object storage in China
- [MinIO Documentation](https://min.io/docs/minio/linux/index.html) - Open-source S3-compatible object storage
- [Cloudflare R2](https://developers.cloudflare.com/r2/) - Object storage with zero egress fees
- [Pre-signed URL Details](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) - The core mechanism for client-side direct upload
