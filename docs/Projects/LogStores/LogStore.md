# Storage Layouts

1. Row Storage -> Transaction
2. Columnar Storage -> Analytics

They are data organization models and physical data layout on disk/memory. They describe how data is arranged.

Storage
 └── Storage Medium
      ├── HDD
      ├── SSD
      └── Memory
 └── Storage Engine / Layout
      ├── Row-Oriented Storage
      ├── Column-Oriented Storage
      ├── Log-Structured Storage

## Row-Oriented Storage

Data is stored row-wise, with all columns of a record placed together.

E.G:
- MySql
- PostgresSql
- Oracle
- SQL Server (row-store engine)
- MongoDB (Document = row -like)

Typical Use case:
- OLTP (transaction, CRUD)

## Column-Oriented Storage

Data is stored column-wise, with each column stored as a separate file or segment.

E.G:
- Cassandra
- HBase
- ClickHouse
- Apache Parquet (file format)
- Apache Iceberg (table format)
- Apache ORC
- Snowflake
- BigQuery
- Redshift
- Vertica

Typical Use case:
- OLAP (analytics, aggregation, reporting)

## Log-Structured Storage

Data is stored in append-only segments, with each segment optimized for sequential writes.

E.G:
- Apache Kafka
- Apache Pulsar
- Apache BookKeeper

Typical Use case:
- Event Streaming

Hybrid storage – systems supporting both (e.g., HTAP)
LSM-based storage – write-optimized, append-heavy
Append-only storage – immutability-based design
Log-structured storage – sequential-write-based systems

## Kafka's Scalability
How can Kafka do millions of writes per second without locking, even with many producers?

That question forced us to understand:
- Partitioning
- Single-writer principle
- Broker-assigned offsets

They differ in:

- Scale
- Engineering effort
- Optimizations

But the core ideas are simple:
- Append-only
- Sharding
- Leader-based ordering
- Replication

