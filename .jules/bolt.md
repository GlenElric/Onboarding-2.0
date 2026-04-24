## 2025-05-15 - Prisma Batch Operations and Algorithm Complexity
**Learning:** Replacing loop-based Prisma operations with `$transaction`, relation filters for `deleteMany`, and nested `create` calls significantly reduces database round-trips. In-memory data lookups should use `Map` for O(1) performance instead of O(N) `find()` when processing large datasets in loops.
**Action:** Always look for batching opportunities in Prisma and check for nested loop lookups that can be optimized with hash maps.
