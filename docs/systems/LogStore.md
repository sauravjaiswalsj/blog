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
