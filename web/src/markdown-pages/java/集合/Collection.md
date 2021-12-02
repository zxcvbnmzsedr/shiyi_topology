# Collection

容器，可以存入其他Java对象的对象。在Java1.2加入到了JDK中。

+ 降低编程难度
+ 提高程序性能
+ 降低程序猿的心智负担，更专注于处理业务
+ 降低学习难度
+ 增加程序的重用性

由于Collection中只能够存放Java对象，因此在使用基本类型（long、int、float、double等）的时候需要对其包装成对象类型（Long、IInteger、Float、Double）才能够放到容器里面，在很多时候拆装箱这个操作能够自动完成，这样虽然会降低了性能，但是简化了设计和编程。

## Collection

collection主要包括Collection和Map两种，Collection存储着对象的集合，Map则存储着键值对。它们无一例外的实现了面试中常问的哪些数据结构。

### Set

**TreeSet**

基于红黑树实现，支持有序性操作，例如根据一个范围查找元素的操作。但是查找效率不如 HashSet，HashSet 查找的时间复杂度为 O(1)，TreeSet 则为 O(logN)。

**HashSet**

基于哈希表实现，支持快速查找，但不支持有序性操作。

并且失去了元素的插入顺序信息，也就是说使用 Iterator 遍历 HashSet 得到的结果是不确定的。 

**LinkedHashSet**

具有 HashSet 的查找效率，且内部使用双向链表维护元素的插入顺序。

### List

[involution: -> ArrayList]

**ArrayList**

基于动态数组实现

[involution: -> LinkedList]

**LinkedList**

基于双向链表实现，只能顺序访问，但是可以快速地在链表中间插入和删除元素。不仅如此，LinkedList 还可以用作栈、队列和双向队列。

**Vector**

和 ArrayList 类似，但它是线程安全的。

### Queue

**LinkedList**

可以用它来实现双向队列。

**PriorityQueue**

基于堆结构实现，可以用它来实现优先队列。

### Map

**HashMap**

基于哈希表实现

**TreeMap**

基于红黑树实现

**HashTable**

和 HashMap 类似，但它是线程安全的。它是遗留类，不应该去使用它。

现在可以使用 ConcurrentHashMap 来支持线程安全，并且 ConcurrentHashMap 的效率会更高，因为 ConcurrentHashMap 引入了分段锁。

**LinkedHashMap**

使用双向链表来维护元素的顺序，顺序为插入顺序或者最近最少使用(LRU)顺序。





