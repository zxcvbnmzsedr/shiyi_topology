# JVM

下图列出了，整个JVM的框架图。

从JDK1.6开始，每个版本都有不同的改变，主要是将原本存储在方法区的数据迁移到堆和元空间中。

JVM可以从5个方面来循序渐进的了解。

1. 字节码相关，Java源文件编译成字节码的过程
2. 类加载，将字节码加载到虚拟机中
3. 类运行，解析字节码放置到不同的内存实例中
4. JMM，用于处理类运行过程中的并发问题
5. GC,由于Java无需手动释放内存，需要通过垃圾收集器手动回收创建出来的对象

![JVM](http://java-engineer.ztianzeng.com/uPic/JVM.png)
