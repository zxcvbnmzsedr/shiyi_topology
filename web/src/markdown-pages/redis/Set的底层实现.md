# Set的底层实现


Redis用intset或hashtable存储set。

如果元素都是整数类型，就用intset存储。

如果不是整数类型，就用hashtable（数组+链表的存来储结构）。key就是元素的值，value为null。 
