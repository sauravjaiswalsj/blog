# Data Replication Technique

1. Gossip/multicast Protocols
    - Epidemic broadcast trees, bimodal multicast, SWIM, HyParView
    - Used for node-to-node communication
    - Efficient for broadcasting messages to multiple nodes
    - Works well in dynamic environments with node failures
    - Can handle network partitions and node crashes
    - Good with eventual consistency
2. Consensus Protocols
    - 2PC/3PC, Paxos, Raft, Zab, chain replication
    - Used for maintaining a consistent view of the system state
    - Ensures that all nodes agree on the same order of operations
    - Works well in dynamic environments with node failures
    - Can handle network partitions and node crashes
    - Good with strong consistency

#
   
# Replication in Kafka
1. Select a leader
2. Maintain in-sync replica set (ISR) (initially every replica).
3. Leader writes message to write-ahead log (WAL).
4. Leader comits messages when all replicas in ISR ack.
5. Leader maintains high-water mark (HW) of last commited message.
6. Piggyback HW on replica fetch responses which replicas periodically checkpoints to disk.

ISR - In-sync replica set is a set of all replicas/broker that have caught up with the leader.