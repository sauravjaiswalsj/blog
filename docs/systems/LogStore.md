# Log Store

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

Append-only logs

Sequential disk I/O

Partitioning

Replication

Recovery

# Performance

## Latency Test Results


Total requests sent: 100
Successful requests: 100
Failed requests: 0
Average successful latency: 49.99 ms
Total test duration: 0.51 seconds
Throughput: 195.60 requests/second

--- Test Results ---
Total requests sent: 10000
Successful requests: 10000
Failed requests: 0
Average successful latency: 360.26 ms
Total test duration: 37.18 seconds
Throughput: 268.98 requests/second

## Analysis:

The latency test results show that the log store can handle a high throughput of 268.98 requests per second with an average latency of 360.26 ms.

The system where every request is processed sequentially, write this data to disk and make sure it is 100% safely stored before returning the offset to the client.

### Test 1
```lua
Average latency: ~50 ms
Throughput: ~200 requests/sec
```

- Each request took ~50 ms
- Disk can safely store 200 requests(items) per second

### Test 2
```lua
Average latency: ~360 ms
Throughput: ~270 requests/sec
```
- Disk is now busy
- Requests are waiting in line
- Each requests waits longer
- But disk speed stays about the same
- Overall system latency increases
- But throughput increases significantly ~270 requests/sec
- And each request takes ~360 ms

Disk speed ≠ Request speed
- CPU: millions of ops/sec
- RAM: millions of ops/sec
- Disk (safe writes): hundreds of ops/sec

Your system is limited by the slowest part — disk safety.

Current System answers:
Why databases are slow sometimes
Why Kafka batches messages
Why “disk is the bottleneck”
Why latency grows under load
Why throughput stops increasing