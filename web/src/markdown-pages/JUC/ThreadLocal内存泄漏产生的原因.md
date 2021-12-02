# ThreadLocal内存泄漏产生的原因

要剖析ThreadLocal产生内存泄漏的原因，先要了解ThreadLocal的出现是为了解决什么问题，又适用于什么场景。

## ThreadLocal解决的问题以及场景

ThreadLocal提供了本地线程的实例，它与普通变量的区别在于，ThreadLocal的变量只存在于当前线程当中，每个使用ThreadLocal变量的线程都会完全初始化一个完全独立的实例副本，简而言之ThreadLocal只和当前线程相关。

ThreadLocal 变量通常被`private static`修饰。当一个线程结束时，它所使用的所有 ThreadLocal 相对的实例副本都可被回收。

ThreadLocal适用于变量在线程中隔离，但是在方法或者类之间是共享的场景下。当然改场景下也并非是使用ThreadLocal不可，只是相对使用变量一层层传下去，使用ThreadLocal可以使方法更加简洁。



## ThreadLocal的实现原理

ThreadLocal的保存变量，是维护在Thread中的。

但是由于每个线程在访问ThreadLocal对象之后，都会在Thread中的Map中留下ThreadLocal对象与具体实例的引用，如果不删除这些引用则这些ThreadLocal则不能进行回收，会造成内存泄漏

![ThreadLocal](http://java-engineer.ztianzeng.com/uPic/ThreadLocal.png)

## 内存泄漏的案例

网上有一段说明ThreadLocal内存泄漏非常好的代码。

通过线程池去持有ThreadLocal对象，由于线程池的特性，线程被用完之后不会被释放。

因此，总是存在<ThreadLocal,LocalVariable>的强引用，file static修饰的变量不会被释放，所以即使TreadLocalMap的key是弱引用，但由于强引用的存在，弱引用一直会有值，不会被GC回收。

内存泄漏的大小 = `核心线程数 *LocalVariable` 

```java
public class ThreadLocalDemo {
    static class LocalVariable {
        private Long[] a = new Long[1024 * 1024];
    }

    // (1)
    final static ThreadPoolExecutor poolExecutor = new ThreadPoolExecutor(5, 5, 1, TimeUnit.MINUTES,
            new LinkedBlockingQueue<>());
    // (2)
    final static ThreadLocal<LocalVariable> localVariable = new ThreadLocal<LocalVariable>();

    public static void main(String[] args) throws InterruptedException {
        // (3)
        Thread.sleep(5000 * 4);
        for (int i = 0; i < 50; ++i) {
            poolExecutor.execute(new Runnable() {
                public void run() {
                    // (4)
                    localVariable.set(new LocalVariable());
                    // (5)
                    System.out.println("use local varaible" + localVariable.get());
                    localVariable.remove();
                }
            });
        }
        // (6)
        System.out.println("pool execute over");
    }
}
```

所以, 为了避免出现内存泄露的情况, ThreadLocal提供了一个清除线程中对象的方法, 即 remove, 其实内部实现就是调用 ThreadLocalMap 的remove方法

```java
private void remove(ThreadLocal<?> key) {
    Entry[] tab = table;
    int len = tab.length;
    int i = key.threadLocalHashCode & (len-1);
    for (Entry e = tab[i];
         e != null;
         e = tab[i = nextIndex(i, len)]) {
        if (e.get() == key) {
            e.clear();
            expungeStaleEntry(i);
            return;
        }
    }
}

```

找到Key对应的Entry, 并且清除Entry的Key(ThreadLocal)置空, 随后清除过期的Entry即可避免内存泄露。

