# Log Store
## Fsync
fsync() is a system call that forces data from the operating system's memory buffers to be physically written to permanent disk storage, ensuring data durability, but it's slow because it bypasses OS caching for immediate, guaranteed write completion, forcing a wait for the slow physical disk to confirm the write, creating a performance bottleneck, especially with frequent calls. It's crucial for databases like PostgreSQL or MongoDB to prevent data loss on crashes but significantly impacts speed compared to just letting the OS handle writes late.

## Kafka's Scalability
How can Kafka do millions of writes per second without locking, even with many producers?

That question forced us to understand:
- Partitioning
- Single-writer principle
- Broker-assigned offsets

When you shared the TabletServer diagram, suddenly all concepts aligned:

- Tablet = partition
- Log tablet = append-only log
- Leader = single writer
- Replicas = durability
- KV Store = read optimization

## Why this LogStore:
✅ Unifies everything you learned

- Append-only logs
- Sequential disk I/O
- Partitioning
- Replication
- Recovery


Good Reads:

- “Everything You Know About Latency Is Wrong” – Jeff Dean

Memory IO 
- “mmap() is a Really Big Hammer” – Brendan Gregg
- “File I/O on Linux” – LWN

Storage Fundamentals
- “The Log-Structured Merge Tree (LSM)” – original paper
- “Designing Data-Intensive Applications” (DDIA)
→ Chapter 3 (Storage and Retrieval)
Row vs Column storage
- “Column-Oriented Database Systems” – Stonebraker
- ClickHouse docs: “Why Column-Oriented?”

Indexing and DS
- Kafka Internals – “Log Segments & Index Files”
- “How SQLite Works” – file format section

LSM Tree
- “LSM Trees Explained” – Martin Kleppmann
- RocksDB Architecture Guide

Concurrency and Ordering
-“The Single-Writer Principle” – Pat Helland
- "You Can’t Have Exactly Once” – Pat Helland

Lock Free Thinking:
-Scalability, But at What COST?” – Brendan Gregg

Distributed Systems Funda:
- DDIA Chapter 5 (Replication)
- “Replication in Distributed Systems” – MIT notes

Ordering
- “Time, Clocks, and the Ordering of Events” – Lamport
- “Linearizability vs Sequential Consistency” – Herlihy

Read Systems:
- Kafka Definitive Guide (Ch 3–5)
- Confluent blog: “Kafka Internals”

BigTable
- Google Bigtable paper
- HBase Architecture Guide

Raft:
- Raft paper (only sections 2–4)

Failure & Recovery:
- “Crash-Only Software” – Candea & Fox
- PostgreSQL WAL recovery docs

Backpressure:
- Reactive Streams spec (conceptual)
- Kafka producer batching docs
- “Backpressure in Distributed Systems” – Martin Kleppmann

Engineering Mindet
- “End-to-End Arguments in System Design”
- DDIA (entire book if possible)
