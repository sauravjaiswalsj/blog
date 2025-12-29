# Fsync
`fsync()` is a system call that forces data from the operating system's memory buffers to be physically written to permanent disk storage, ensuring data durability, but it's slow because it bypasses OS caching for immediate, guaranteed write completion, forcing a wait for the slow physical disk to confirm the write, creating a performance bottleneck, especially with frequent calls. It's crucial for databases like PostgreSQL or MongoDB to prevent data loss on crashes but significantly impacts speed compared to just letting the OS handle writes later. 

## Why fsync is Slow
- Physical Disk Latency: Data must travel from RAM through the OS to the disk controller and finally to the storage platters (HDD) or NAND flash (SSD), a slow physical process compared to RAM speed.
- Bypasses Caching: `fsync()` forces data out of the fast OS buffer cache, preventing the OS from grouping writes for efficiency (batching).
- Blocking Operation: The call waits (blocks) until the disk hardware confirms the write is complete, halting the application's progress.
- Disk-Intensive: Frequent fsync calls on busy systems lead to heavy, synchronous I/O, saturating the disk's capabilities.
- Data Size/Type: Writes that change file size (like appending) are often slower than in-place updates because they involve more complex disk management. 

## `fsync` Use Cases
- Databases (PostgreSQL, MongoDB, Redis): Ensures transaction logs (WAL) or data files are durable, so data isn't lost if the server crashes.
- Log Stores (Kafka, Apache Pulsar): Ensures messages are written to disk before acknowledging the producer, maintaining message durability.
- Package Managers (APT): Ensures files are physically on disk before proceeding, though often done once at the end for efficiency. 

## How to Improve Performance
- Use Faster Storage: NVMe SSDs, especially those with robust caching (like Intel Optane), handle fsync much better than traditional HDDs.
- Optimize Application Logic: Use fsync sparingly; batch writes where possible or use techniques like asynchronous I/O.
- Dedicated Hardware: Run database services exclusively on hosts to avoid contention from other software (like NodeJS, Splunk). 

Good Read:
[Fsync](http://oldblog.antirez.com/post/fsync-different-thread-useless.html#:~:text=fsync()%20is%20the%20kind,a%20system%20crash%20or%20alike.)