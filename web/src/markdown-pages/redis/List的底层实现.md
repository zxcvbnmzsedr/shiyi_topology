# List的底层实现

List的底层采用quickList进行编码。

QuickList是ZipList和LinkList的混合体.

它将 linkedList按段切分，每一段使用 zipList 来紧凑存储，多个 zipList 之间使用双向指针串接起来。

![结构](https://www.shiyitopo.tech/uPic/redis_quicklist_%E7%BB%93%E6%9E%84.jpg)
