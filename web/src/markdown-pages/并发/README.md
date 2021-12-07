# Java并发工具包

## 并发基础

### 线程基础

+ [进程和线程的区别](进程与线程.md)
- [线程的实现方法](Thread的实现方式.md)

- [如何正确地停止线程](正确停止线程的方式.md)

- [线程有哪些状态](Thread的状态.md)

- [wait、notify/notifyAll、sleep方法](waitnotifynotifyAll.md)

- [生产者消费者模型](生产者消费者模型.md)

### 线程安全

- [3类线程安全问题](线程安全.md)
- [哪些情景下需要注意线程安全问题](需要注意线程安全问题的情况.md)

## 并发工具

### 线程池

+ [多线程的性能问题](为什么多线程会带来性能问题.md)
+ [线程池的优势](线程池的优势.md)
+ [如何创建线程池](创建线程池的参数.md)
+ [线程池复用原理](线程池线程复用原理.md)
+ [特殊的线程池Forkjoin](ForkJoin框架.md)

### 各种锁

+ [锁的种类和特点](锁的种类和特点.md)
+ [synchronized 和 Lock的对比](synchronized和Lock的对比.md)
+ [JVM锁优化](JVM锁优化.md)

### 并发容器

+ [线程不安全的HashMap](HashMap.md)
+ [线程安全的ConcurrentHashMap](ConcurrentHashMap详解.md)
+ [线程安全ArrayList集合-CopyOnWriteArrayList](CopyOnWriteArrayList.md)

### 阻塞队列

+ [什么是阻塞队列](什么是阻塞队列.md)
+ [阻塞队列的常用方法](阻塞队列的常用方法.md)
+ [常见的阻塞队列](常见的阻塞队列.md)

### 原子类

+ [原子类的作用概览](原子类的作用概览.md)
+ [原子类的性能分析](原子类的性能分析.md)

### ThreadLocal

+ [使用场景](ThreadLocal使用场景.md)
+ 内存泄漏

### Feature

### 线程协作



## 底层原理

### Java内存模型

### CAS原理

### 死锁问题

### final关键字和不变性

### AQS框架