# Log

Log is an ordeered, immutable, sequence of messages. Messages are atomic, meaning they can't be broken up. 

We mostly add message to the log and never modify them.
The log has a notion of message retention based on certain policies, which allows us to control how the log is truncated.
The log is stored on disk, and sequential disk I/O is used to append messages to the log.