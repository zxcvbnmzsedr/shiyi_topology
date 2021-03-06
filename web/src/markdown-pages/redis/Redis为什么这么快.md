# Redis为什么这么快

## 完全基于内存

[involution:如果内存满了怎么办? -> Redis数据淘汰策略|Redis数据删除策略]

所有的运算都是内存级别的。

## 数据结构简单

[involution: 请说一下，Redis提供了哪几种数据结构 -> Redis基本数据结构]


Redis中所有的数据结构都是重新设计过的，这些重新设计的数据结构大部分时间复杂度都是O(1)。 举例：string这个类型没有采用C原生的string，而是重新设计了一套sds(simple dynamic string)的结构

## 工作线程采用单线程，避免了线程上下文切换所带来的损耗

[involution: 既然单线程这么好用，为何6.0又推出了多线程 -> redis单线程的问题]

redis的作者认为，性能瓶颈是在于内存或者网络带宽并非cpu，所以多线程并不会带来更大的提升（其实是作者懒，强行解释）。

Redis的网络IO和键值对读写是由一个线程来完成的，Redis在处理客户端的请求时包括获取 (socket 读)、解析、执行、内容返回 (socket 写) 等都由一个顺序串行的主线程处理，这就是所谓的“单线程”。
这也是Redis对外提供键值存储服务的主要流程。

6.0之后，Redis的其他功能， 比如持久化、异步删除、集群数据同步等等，其实是由额外的线程执行的。 因此说，Redis工作线程是单线程的，但是，整个Redis来说，是多线程的(多线程默认是关闭的).

## 对于客户端的连接采用多路复用和非阻塞I/O

[involution: 除了非阻塞I/O你还知道哪些IO模型 -> 5种IO模型]

Redis使用I/O多路复用功能来监听多个socket连接客户端， 这样就可以使用一个线程连接来处理多个请求，减少线程切换带来的开销，同时也避免了 I/O 阻塞操作