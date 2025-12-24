# [The Log](https://bravenewgeek.com/building-a-distributed-log-from-scratch-part-1-storage-mechanics/)

Log is an ordeered, immutable, sequence of messages. Messages are atomic, meaning they can't be broken up. 

Logs are append-only:
- New messages are always added to the end
- Existing messages are never modified in place

We mostly add message to the log and never modify them.
The log has a notion of message retention based on certain policies, which allows us to control how the log is truncated.
The log is stored on disk, and sequential disk I/O is used to append messages to the log.

Key properties of a log

- Ordered: messages are strictly ordered
- Immutable: once written, messages never change
- Append-only: writes only happen at the tail
- Durable: messages survive process crashes
- Replayable: messages can be read again from disk

These properties make logs ideal as the core data structure for distributed systems.
## What happens internally when we append a message to the log?

Modern operating systems use a page cache, which means that sequential file access often does not hit disk immediately.

### Write path (simplified)

1. Application issues a write() (or equivalent)
2. Data is copied into the page cache (RAM)
3. The OS marks these pages as dirty
4. The kernel later flushes dirty pages to disk asynchronously
5. Optionally, the application may call fsync() to force durability

### Read path (simplified)

1. Application issues a read() (or equivalent)
2. If the data is in the page cache, it is returned immediately
3. If not, the kernel reads the data from disk into the page cache
4. The data is then returned to the application

Because of this:
- Writes are fast: data is copied into the page cache, and the OS marks these pages as dirty. The kernel later flushes dirty pages to disk asynchronously.
- Sequential access benefits from prefetching: the kernel reads data from disk into the page cache in chunks, which allows it to predict future reads and prefetch them.
- Reads are fast: if the data is in the page cache, it is returned immediately. Otherwise, the kernel reads the data from disk into the page cache and returns it.
- Disk I/O is batched: the kernel flushes dirty pages to disk in batches, which reduces the number of disk seeks and improves performance.

Role of the page cache
The page cache is part of the Virtual File System (VFS) layer.
Its primary goals are:

- Reduce disk I/O latency
- Convert random access into sequential access
- Allow applications to write without blocking on disk

Both reads and writes usually interact with memory first, not the physical disk.
This is one of the main reasons append-only logs scale so well.

## How does log look like
At a logical level, the log can be viewed as a table:

| offset | timestamp | Key | value |
|--------|-----------|-----|-------|
| 0      | 123456789 | K1  | V1    |
| 1      | 123456790 | K2  | V2    |


Meaning of fields

### offset

- A monotonically increasing integer
- Assigned by the log (not the producer)
- Represents the position of the message

timestamp

- Time when the message was appended
- Used for retention and ordering diagnostics

Used for retention and ordering diagnostics

### key

- Used for partitioning or routing
- Optional depending on use case

Optional depending on use case

### value

- The actual payload
- Treated as an opaque byte sequence

## How the log looks on disk (physical layout)

On disk, the log is stored as one or more segment files:
``` lua
Tablet-0/
 ├── log-000000.log   (offsets 0–999)
 ├── log-000001.log   (offsets 1000–1999)
 └── log-000002.log   (offsets 2000–2999)

Tablet-1/
 ├── log-000000.log   (offsets 0–799)
 ├── log-000001.log   (offsets 800–1599)
 └── log-000002.log   (offsets 1600–2399)
```
Each segment:

Is append-only

Has a fixed maximum size

Contains messages in offset order