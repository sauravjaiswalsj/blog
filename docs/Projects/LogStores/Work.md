# Tech Doc
So far, we implemented Tablet and AppenOnlyLog
```lua
| offset (8B) | timestamp (8B) | keySize (4B) | key | valueSize (4B) | value |

```

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

## Tablet  
A Tablet must:
- Own one file
- Own one AtomicLong offset
- Perform offset recovery for its file
- Guarantee single-writer semantics
- Delegate disk I/O to AppendOnlyLog

## AppendOnlyLog Responsibilities (Reduced)
AppendOnlyLog should:
- Open file
- Append bytes
- fsync
- NOTHING else

# 3.1

## Tablet Router:
- Pure Routing component
- Hash key to determine tablet ID
- Helps in maintaining the scalability of the system
- Routes requests to the appropriate tablet

### Hash Based Partitioning

``` java
tabletId = hash(key) % numberOfTablets
```
Example:
```java
tablets = 3

key = "user123"
hash("user123") = 8457392

tabletId = 8457392 % 3 = 1
```
➡ Append goes to Tablet-1

- Same key → same tablet
- Ordering preserved per key
- Writes distributed across tablets
- No global locks

### TabletRouter
- deterministically maps a key → tabletId
- assumes a fixed number of tablets
- guarantees:
    - same key → same tablet
    -  different keys → spread across tablets

This is partitioning, not load-balancing.

Why this is wrong:

Tablets must be created once at startup

Tablets must maintain offsets across requests

Creating a new Tablet per request means:

new file per request

offset reset per request

no persistence

no isolation

TabletRouter must NEVER call new Tablet()

## Tablet Registry
What is TabletRegistry?

TabletRegistry is the owner of all Tablets in the system.

It is responsible for:

creating tablets

storing tablets

giving tablets to other components