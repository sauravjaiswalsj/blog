# System Design Document

## Distributed Append-Only Log Store

---

## 1. Overview

This document describes the **system design** of a Distributed Append-Only Log Store inspired by Kafka-style architectures. It focuses on **how the system is built**, **why specific design decisions were made**, and **how components interact at runtime**.

This document complements the PRD/SRS by explaining the **architecture, data flow, and trade-offs**.

---

## 2. Design Goals

### Primary Goals

* High-throughput writes using append-only storage
* Strong ordering guarantees per partition
* Lock-free write path
* Simple replication for fault tolerance
* Crash recovery using log replay

### Non-Goals

* Exactly-once semantics
* Distributed consensus (Raft/Paxos)
* Transactions
* Schema enforcement

---

## 3. Key Design Decisions

### 3.1 Append-Only Log

**Decision:** All writes are append-only; no in-place updates or deletes.

**Rationale:**

* Sequential disk I/O is significantly faster than random I/O
* Simplifies concurrency and recovery
* Enables deterministic replication

---

### 3.2 Partitioning via Tablets

**Decision:** Data is partitioned into tablets using key hashing.

**Rationale:**

* Enables horizontal scalability
* Limits contention to per-tablet scope
* Allows independent offset sequences

Each tablet owns:

* Its own log file
* Its own offset counter

---

### 3.3 Single Leader per Tablet

**Decision:** Exactly one leader is responsible for writes per tablet.

**Rationale:**

* Guarantees ordering without locks
* Eliminates write-write conflicts
* Simplifies offset assignment

Concurrency is achieved **across tablets**, not within them.

---

## 4. High-Level Architecture

```
Client
   ↓
TabletServer (Leader)
   ↓
Tablet (Partition)
   ↓
Append-Only Log
   ↓
Replica TabletServers
```

---

## 5. Component Design

### 5.1 TabletServer

**Responsibilities:**

* Hosts multiple tablets
* Routes incoming requests to tablets
* Initiates replication to followers

**Key Properties:**

* Stateless with respect to offsets
* Manages tablet lifecycle

---

### 5.2 Tablet

**Responsibilities:**

* Maintain a monotonically increasing offset
* Serialize writes to its log
* Provide read access by offset

**Concurrency Model:**

* Single-threaded write path
* No locks required

---

### 5.3 AppendOnlyLog

**Responsibilities:**

* Append records sequentially to disk
* Read records by offset
* Support log replay

**Storage Model:**

* One file per tablet
* File grows monotonically

---

### 5.4 Replication Module

**Responsibilities:**

* Send appended records to replicas
* Preserve order during replication

**Replication Strategy:**

* Leader-driven
* Log-based
* Best-effort (replica failure does not block leader)

---

### 5.5 Recovery Module

**Responsibilities:**

* Scan log on startup
* Restore last committed offset
* Resume normal operation

---

## 6. Write Path (Detailed Flow)

```
Client → /append
   ↓
TabletRouter
   ↓
Tablet (Leader)
   ↓
AppendOnlyLog.append()
   ↓
Offset assigned
   ↓
Replication triggered
   ↓
Response returned
```

**Guarantees:**

* Sequential offset assignment
* Append-only persistence
* No locking in write path

---

## 7. Read Path (Detailed Flow)

```
Client → /read
   ↓
Tablet
   ↓
AppendOnlyLog.read(offset)
   ↓
Record returned
```

Reads do not interfere with writes.

---

## 8. Offset Management

* Offset is a monotonically increasing long
* Stored in memory and recoverable from log
* Assigned only by tablet leader

---

## 9. Crash Recovery Design

### Startup Behavior

1. Locate log files
2. Scan records sequentially
3. Identify last offset
4. Resume appends from next offset

**Guarantee:** No offset duplication or data loss

---

## 10. Logging & Observability

### Logging Stack

```
Application Code
   ↓
SLF4J API
   ↓
Logback
   ↓
Console / Rolling File
```

### Logged Events

* Append requests
* Offset assignment
* Replication attempts
* Recovery progress

---

## 11. Failure Scenarios & Handling

| Failure       | Handling              |
| ------------- | --------------------- |
| Replica down  | Log warning, continue |
| Disk full     | Fail append           |
| Process crash | Recover via replay    |

---

## 12. Trade-Offs

| Decision      | Trade-Off                          |
| ------------- | ---------------------------------- |
| Single leader | No write parallelism within tablet |
| Append-only   | Storage growth                     |
| No consensus  | Simpler but weaker guarantees      |

---

## 13. Extensibility

Future improvements can include:

* Log compaction
* Segment rolling
* Metrics dashboard
* Leader election

---

## 14. Summary

This design prioritizes **clarity, correctness, and learning**. It mirrors real-world log systems while remaining implementable within a small codebase.

The system demonstrates how **append-only logs and leader-based ordering** can achieve high throughput without locks.
