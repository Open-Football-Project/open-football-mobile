### Run a Closed Test (Alpha) for 14 days

This is **mandatory** before applying for production.

1. Play Console → **Closed testing → Create new release**
2. Upload the AAB (use the one from internal testing or trigger a new workflow run)
3. Play Console → **Closed testing → Testers** → create a list and add 12+ email addresses
4. Share the **opt-in URL** with your testers
5. Each tester must:
   - Click the opt-in link and accept
   - Install the app from Play Store on their Android device
   - Keep it installed
6. Wait **14 days** with 12+ active testers opted in
7. The 14-day clock starts once you have 12+ opted-in testers

---

### Apply for Production access

1. Play Console → **Production → Apply for access to production**
2. Answer questions about your closed test
3. Google reviews the application (can take a few days)
4. Once approved, you can publish to production

---

### First Production release

1. Play Console → **Production → Create new release**
2. Upload the AAB
3. Write release notes
4. **Review and publish**
5. Google reviews the app (first review typically 1-3 days)
6. Once approved, the app is live on the Play Store

---

### Subsequent releases (automated)

Once the app is live, update the workflow status from `draft` to `completed`:

```yaml
# .github/workflows/release-android.yml
status: completed  # was: draft
```

From this point on, triggering the workflow publishes directly to internal testing and users on that track get the update automatically.

To promote a release to production: Play Console → Internal testing → promote to Production.

---

## Version numbering

- `versionCode` — integer, auto-incremented by the workflow on every release (1, 2, 3...)
- `versionName` — human-readable string, you provide it when triggering the workflow (e.g. `1.0.0`, `1.1.0`)

Both are defined in `android/app/build.gradle`.
