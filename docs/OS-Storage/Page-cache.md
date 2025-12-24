# [Linux Page Cache or Buffer Cache](https://www.thomas-krenn.com/en/wiki/Linux_Page_Cache_Basics)

Page Cache is a part of the Virtual File System (VFS) whose primary purpose, is improving the IO latency of read and write operations. 
A write-back cache algorithm is a core building block of the Page Cache.

“Page” in the Page Cache means that linux kernel works with memory units called pages. It would be cumbersome and hard to track and manage bites or even bits of information. So instead, Linux’s approach (and not only Linux’s) is to use pages (usually 4K in length) in almost all structures and operations. Hence the minimal unit of storage in Page Cache is a page, and it doesn’t matter how much data you want to read or write. All file IO requests are aligned to some number of pages.

The above leads to the important fact that if your write is smaller than the page size, the kernel will read the entire page before your write can be finished.

<img width="861" height="584" alt="Image" src="https://github.com/user-attachments/assets/452c9757-b1b1-43bf-83ef-3e8e0938c54b" />

As you can see, all data reads and writes go through Page Cache. However, there are some exceptions for Direct IO (DIO), and I’m talking about it at the end of the series. 

## Read requests
Generally speaking, reads are handled by the kernel in the following way:

① – When a user-space application wants to read data from disks, it asks the kernel for data using special system calls such as read(), pread(), vread(), mmap(), sendfile(), etc.

② – Linux kernel, in turn, checks whether the pages are present in Page Cache and immediately returns them to the caller if so. As you can see kernel has made 0 disk operations in this case.

③ – If there are no such pages in Page Cache, the kernel must load them from disks. In order to do that, it has to find a place in Page Cache for the requested pages. A memory reclaim process must be performed if there is no free memory (in the caller’s cgroup or system). Afterward, kernel schedules a read disk IO operation, stores the target pages in the memory, and finally returns the requested data from Page Cache to the target process. Starting from this moment, any future requests to read this part of the file (no matter from which process or cgroup) will be handled by Page Cache without any disk IOP until these pages have not been evicted.

## Write requests
Let’s repeat a step-by-step process for writes:

(Ⅰ) – When a user-space program wants to write some data to disks, it also uses a bunch of syscalls, for instance: write(), pwrite(), writev(), mmap(), etc. The one big difference from the reads is that writes are usually faster because real disk IO operations are not performed immediately. However, this is correct only if the system or a cgroup doesn’t have memory pressure issues and there are enough free pages (we will talk about the eviction process later). So usually, the kernel just updates pages in Page Cache. it makes the write pipeline asynchronous in nature. The caller doesn’t know when the actual page flush occurs, but it does know that the subsequent reads will return the latest data. Page Cache protects data consistency across all processes and cgroups. Such pages, that contain un-flushed data have a special name: dirty pages.

(II) – If a process’ data is not critical, it can lean on the kernel and its flush process, which eventually persists data to a physical disk. But if you develop a database management system (for instance, for money transactions), you need write guarantees in order to protect your records from a sudden blackout. For such situations, Linux provides fsync(), fdatasync() and msync() syscalls which block until all dirty pages of the file get committed to disks. There are also open() flags: O_SYNC and O_DSYNC, which you also can use in order to make all file write operations durable by default. I’m showing some examples of this logic later.


Synchronize file changes with fsync(), fdatasync() and msync() #
We already used sync (man 1 sync) to flush all dirty pages to disks before every test to get a fresh system without any interference. But what if we want to write a database management system, and we need to be sure that all writes will get to disks before a power outage or other hardware errors occur? For such cases, Linux provides several methods to force the kernel to run a sync of pages for the file in Page Cache:

fsync() – blocks until all dirty pages of the target file and its metadata are synced;
fdatasync() – the same as the above but excluding metadata;
msync() – the same as the fsync() but for memory mapped file;
open a file with O_SYNC or O_DSYNC flags to make all file writes synchronous by default and work as a corresponding fsync() and fdatasync() syscalls accordingly.


## Page Cache Eviction

we have talked about adding data to Page Cache by reading and writing files, checking the existence of files in the cache, and flushing the cache content manually. But the most crucial part of any cache system is its eviction policy, or regarding Linux Page Cache, it’s also the memory page reclaim policy. Like any other cache, Linux Page Cache continuously monitors the last used pages and makes decisions about which pages should be deleted and which should be kept in the cache.

The primary approach to control and tune Page Cache is the cgroup subsystem. You can divide the server’s memory into several smaller caches (cgroups) and thus control and protect applications and services. In addition, the cgroup memory and IO controllers provide a lot of statistics that are useful for tuning your software and understanding the internals of the cache.

Linux Page Cache is closely tightened with Linux Memory Management, cgroup and virtual file system (VFS). So, in order to understand how eviction works, we need to start with some basic internals of the memory reclaim policy. Its core building block is a per cgroup pair of active and inactive lists:

- the first pair for anonymous memory (for instance, allocated with `malloc()` or not file backended `mmap()`);
- the second pair for Page Cache file memory (all file operations including `read()`, `write`, `filemmap()` accesses, etc.).

The former is exactly what we are interested in. This pair is what linux uses for Page Cache evection process. The `least recently used algorithm LRU` is the core of each list. In turn, these 2 lists form a double clock data structure. In general, Linux should choose pages that have not been used recently (inactive) based on the fact that the pages that have not been used recently will not be used frequently in a short period of time. It is the basic idea of ​​the LRU algorithm. Both the active and the inactive lists adopt the form of FIFO (First In First Out) for their entries. New elements are added to the head of the linked list, and the elements in between gradually move toward the end. When memory reclamation is needed, the kernel always selects the page at the end of the inactive list for releasing. The following figure shows the simplified concept of the idea:

[Further read:](https://biriukov.dev/docs/page-cache/4-page-cache-eviction-and-page-reclaim/)