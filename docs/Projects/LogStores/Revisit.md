Below is a **complete, detailed learning markdown** you can keep in your repo (e.g. `docs/learning-notes.md`).
It is written as **future-you documentation**: what you built, *why* you built it that way, the doubts you had, mistakes you made, and the key systems lessons you learned.

You can copy–paste this directly.

---

# 📘 Mini Log Store — Learning Notes & Design Journey

> **Problem Statement**
> Design and implement a **single-node, append-only log store** with partitioning (tablets), correct offset management, and a clean write API (`/append`).
> This project is intentionally focused on **systems learning**, not frameworks or shortcuts.

---

## 1️⃣ High-Level Goal

The objective was to build the **write path** of a distributed log system, step by step, while understanding:

* Disk I/O behavior
* Append-only logs
* Offsets and durability
* Partitioning (tablets)
* Clean system boundaries
* Dependency Injection pitfalls in Spring
* Why real log systems are slow without batching

The final API we implemented:

```
POST /append
```

which:

* accepts a key-value record
* routes it to the correct tablet
* assigns a monotonically increasing offset
* appends it durably to disk
* returns the offset

---

## 2️⃣ Core Architectural Concepts Learned

### 2.1 Append-Only Log (Fundamental Concept)

An append-only log is:

* A file that is **never modified in-place**
* New records are **always appended**
* Records are immutable
* Reads happen by offset

Why this matters:

* Sequential disk writes are fast
* Crash recovery is simple
* Concurrency is easier to reason about

---

### 2.2 Log Record Format

We standardized on a **simple, readable record format**:

```
[offset]|[timestamp]|[key]|[value]\n
```

Example:

```
12|1712345678901|user123|clicked_button
```

Design decisions:

* Offset is **tablet-local**
* Timestamp is assigned at append time
* Human-readable format for debugging
* Binary format can come later

---

## 3️⃣ Write Path — End-to-End Flow

This is the **most important section**.

### Final Write Flow

```
Client
  ↓
Controller (/append)
  ↓
TabletServer.append(data)
  ↓
TabletRouter.route(key) → tabletId
  ↓
TabletRegistry.getTabletById(tabletId)
  ↓
Tablet.append(key, value)
  ↓
AppendOnlyLog.append(filePath, bytes)
  ↓
fsync (durability)
  ↓
offset returned to client
```

Each layer has **exactly one responsibility**.

---

## 4️⃣ Components and Responsibilities

### 4.1 Controller (API Boundary)

**Responsibility**

* Validate HTTP input
* Reject invalid requests early
* Delegate to TabletServer

**Key learning**

* Validation belongs at the boundary
* Lower layers should assume valid input
* Controller must not know about tablets, routing, or files

**Important checks added**

* `data != null`
* `data.key != null`
* `data.value != null`

---

### 4.2 TabletServer (Orchestrator)

**Responsibility**

* Coordinate the write
* Call Router → Registry → Tablet
* No business logic of its own

**What it must NOT do**

* Create tablets
* Hash keys
* Manage offsets
* Touch disk

**Key learning**

> Controllers talk to coordinators, not domain objects.

TabletServer is the **single entry point** for write operations.

---

### 4.3 TabletRouter (Partitioning Logic)

**Responsibility**

* Decide *where* a record goes

**Routing rule**

```
tabletId = abs(hash(key)) % totalTablets
```

**Design constraints**

* Stateless
* Deterministic
* Thread-safe
* No file access
* No tablet creation

**Key learning**

> If a class decides “where”, it must not decide “how”.

---

### 4.4 TabletRegistry (Lifecycle Owner)

This was one of the most important and subtle components.

**Responsibility**

* Create all tablets **once at startup**
* Assign tabletIds
* Assign file paths
* Store tablets for lookup
* Never modify tablet set after startup

**Lifecycle**

* Reads configuration
* Creates `N` tablets
* Each tablet recovers its offset
* Exposes `getTabletById(int)`

**Key learning**

> Tablets must be long-lived objects, not per-request objects.

---

### 4.5 Tablet (Core Domain Object)

**Responsibility**

* Own exactly one log file
* Own exactly one offset counter
* Be the **single writer** for that file
* Build records
* Call AppendOnlyLog

**Offset management**

* Uses `AtomicLong`
* Offset assigned before write
* Offset incremented atomically

**Crash recovery**

* On startup:

  * If file exists → read last record
  * Extract last offset
  * Initialize `nextOffset = lastOffset + 1`
* If file doesn’t exist → start from 0

**Key learning**

> Offset ownership belongs to the tablet, not the log writer.

---

### 4.6 AppendOnlyLog (Physical Storage Layer)

**Responsibility**

* Open file in append mode
* Create file if missing
* Write bytes
* Call `fsync` (`channel.force(true)`)

**What it must NOT know**

* Tablet IDs
* Keys or values
* Routing
* Offsets

**Key learning**

> AppendOnlyLog owns file creation. Tablet owns file awareness.

---

## 5️⃣ Configuration & Dependency Injection Lessons (Critical)

This was a major source of confusion and learning.

### 5.1 TabletProperties (`@ConfigurationProperties`)

**Role**

* Pure configuration holder
* Reads from `application.yml`
* No logic
* No object creation

Correct YAML:

```yaml
tablet:
  base-dir: data/logstore/
  total-tablets: 10
```

**Key learning**

* YAML uses kebab-case
* Java uses camelCase
* Names must match semantically

---

### 5.2 The BIG DI Mistake (and Fix)

❌ **Mistake**

```java
new RegistryTablet(new TabletProperties());
```

Why it broke things:

* Bypassed Spring
* Created an unbound config object
* Resulted in `baseDir = null`, `totalTablets = 0`

✅ **Fix**

* Let Spring create `TabletProperties`
* Inject the SAME instance everywhere

**Key learning**

> Never call `new` on a class that Spring is supposed to manage.

---

### 5.3 Correct DI Pattern Used

* `TabletProperties` → created by Spring
* `TabletConfig` → creates infrastructure beans (TabletRouter)
* `TabletRegistry`, `TabletServer` → injected via constructor

**Rule remembered**

> Properties classes hold data. Config classes create objects.

---

## 6️⃣ Performance Observation: Why Writes Are Slow

### Observation

* API responds correctly
* First writes (and every write) feel slow

### Root Cause

```
channel.force(true)
```

This forces:

* OS page cache flush
* Disk controller flush
* Physical disk acknowledgment

**This is real durability cost.**

### Key learning

> If your durable log feels slow, that means it’s working correctly.

### Industry context

* Kafka, PostgreSQL, RocksDB **do not fsync every write**
* They use batching and group commit
* You intentionally didn’t (for learning)

---

## 7️⃣ Major Design Principles Learned

### 7.1 Separation of Responsibilities

Each class must answer **one question only**:

| Class          | Question it answers           |
| -------------- | ----------------------------- |
| Controller     | Is the request valid?         |
| TabletServer   | Who should handle this write? |
| TabletRouter   | Which tablet ID?              |
| TabletRegistry | Which tablet instance?        |
| Tablet         | What offset and record?       |
| AppendOnlyLog  | How to write bytes to disk?   |

---

### 7.2 Lifecycle Matters More Than Code

* Creating objects once vs per request is critical
* Offset correctness depends on object lifetime
* Startup logic is as important as request logic

---

### 7.3 Real Systems Are Slow by Default

* Disk I/O dominates
* fsync is expensive
* Throughput requires batching
* Correctness comes before performance

---

## 8️⃣ What Is Complete So Far

✅ Phase 1: Single-node append-only log
✅ Phase 2: Partitioning via tablets
✅ Task 3.2: Tablet routing
✅ End-to-end `/append` API
✅ Offset management & crash recovery
✅ Correct DI and configuration wiring

You have built the **core write path of a real log system**.

---

## 9️⃣ What Comes Next (Future Work)

* Read API (`/read?offset=…`)
* Multi-tablet reads
* Replication (leader–follower)
* Batching & group commit
* Compaction
* gRPC-based inter-node communication

---

## 🔑 Final One-Line Takeaway

> **This project taught me how real log systems work, why durability is expensive, and how clean system boundaries matter more than code.**

---

If you want, next we can:

* design the **Read Path**
* or convert this into a **formal design document**
* or add **batching (theory + design)**

Just tell me.
