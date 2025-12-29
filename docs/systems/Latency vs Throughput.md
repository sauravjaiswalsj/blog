# Latency vs Throughput

Latency (delay) and throughput are two important metrics in computer systems that measure the performance of a system or of a computer network. It shows the time that data takes to transfer across the network. Networks with a longer delay or lag have high latency, while those with fast response times have lower latency. 
In contrast, throughput refers to the average volume of data that can actually pass through the network over a specific time. It indicates the number of data packets that arrive at their destinations successfully and the data packet loss.


## What is latency? 

Def: Latency is the delay in the network between the initiation of a request and the receipt of its response. 


Latency is the time it takes for data to pass from one point on a network to another. 
Suppose server A in NYC sends data packet to Server b in London. Server A sends the packet at 04:38:00.000 GMT and server B receives it at 04:38:00.145 GMT.
The amount of latency on this path is the difference between these two time, which is 0.145 seconds.


The amount of time it takes for a response to reach a client device after a client request is known as round trip time (RTT). RTT is equal to double the amount of latency, since data has to travel in both directions — there and back again.

[https://aws.amazon.com/what-is/latency/](https://aws.amazon.com/what-is/latency/)

## Throughput

Def: Throughput is the amount of data that can be transferred per unit of time. It is typically measured in bits per second (bps) or bytes per second (Bps).

 Throughput refers to the average volume of data that can actually pass through the network over a specific time. It indicates the number of data packets that arrive at their destination successfully and the data packet loss.

### Comparison of latency to throughput
Throughput measures the impact of latency on network bandwidth. It indicates the available bandwidth after latency. For example, a network's bandwidth may be 100 Mbps, but due to latency, its throughput is only 50 Mbps during the day but increases to 80 Mbps at night.

[https://aws.amazon.com/compare/the-difference-between-throughput-and-latency/](https://aws.amazon.com/compare/the-difference-between-throughput-and-latency/)