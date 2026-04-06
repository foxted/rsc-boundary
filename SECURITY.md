# Security policy

## Reporting a vulnerability

If you believe you have found a security vulnerability in **RSC Boundary**, please report it **privately** so we can assess and fix it before details are public.

**How to report:** use GitHub [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) for this repository (`foxted/rsc-boundary`). Open the repo’s **Security** tab and choose **Report a vulnerability**.

Please include:

- A short description of the issue and its impact
- Steps to reproduce, or a minimal proof of concept, if you can share one safely
- Affected versions or commits, if known

We do not publish a maintainer email in this repository; GitHub is the intended reporting path.

## Scope

In scope for coordinated disclosure:

- The published [`rsc-boundary`](https://www.npmjs.com/package/rsc-boundary) package (`packages/rsc-boundary`)
- The demo and documentation site in `apps/web` when deployed from this repository

Out of scope (report upstream or to the relevant vendor):

- Issues in **Next.js**, **React**, or other dependencies unless RSC Boundary is clearly mishandling their APIs
- General support questions or feature requests (use issues or discussions as appropriate)

## Supported versions

Security fixes are applied to the **latest published** `rsc-boundary` release on npm. Backports to older lines may be done when practical; if you are on an older version, upgrading is the most reliable way to receive fixes.

## Disclosure

Please give maintainers a reasonable window to investigate and release a fix before public disclosure. We will credit reporters in release notes or advisories when they wish to be named.
