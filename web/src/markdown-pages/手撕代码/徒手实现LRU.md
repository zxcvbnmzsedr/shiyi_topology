# 徒手实现LRU


LRU 算法，全称是Least Recently Used。

翻译过来就是最近最少使用算法。

这个算法的思想就是：

**如果一个数据在最近一段时间没有被访问到，那么在将来它被访问的可能性也很小。所以，当指定的空间已存满数据时，应当把最久没有被访问到的数据淘汰**



Letcode上面也有对应的面试题: https://leetcode-cn.com/problems/lru-cache-lcci/



## 方案一: 数组

假设我们有个定长数组。数组中的元素都有一个标记，比如是自增的数字。

每放入一个元素就把元素中已经存在的数据标记更新一下，进行自增。

每访问一个蒜素，就讲被访问的元素的数字置为0。

当数组满了之后就将数字最大的元素删除掉。

**但是这一种方案的弊端也是很明显：需要不停地维护数组中元素的标记。**

时间复杂度为O(n)

## 方案二: 链表

维护一个有序单链表，越靠近链表头部的结点是越早之前访问的。

每插入一个元素的时候，就追加在数组的末尾。

每访问一次元素，就把被访问的元素移动到数组的末尾。

这样最近被用的一定是在最后面的，头部的就是最近最少使用的。

当指定长度被用完了之后，就把头部元素移除掉就行了。

当有一个新的数据被访问时，我们从链表头部开始顺序遍历链表。

如果此数据之前已经被缓存在链表中了，我们遍历得到这个数据的对应结点，并将其从原来的位置删除，并插入到链表尾部。

如果此数据没在缓存链表中，怎么办？

分两种情况：

- 如果此时缓存未满，可直接在链表尾部插入新节点存储此数据；
- 如果此时缓存已满，则删除链表头部节点，再在链表尾部插入新节点

从时间复杂度的角度看，因为链表插入、查询的时候都要遍历链表，查看数据是否存在，所以它还是O(n)。

## 方案三: 双向链表+哈希表

如果我们想要查询和插入的时间复杂度都是O(1)，那么我们需要一个满足下面三个条件的数据结构：

- 1.首先这个数据结构必须是有时序的，以区分最近使用的和很久没有使用的数据，当容量满了之后，要删除最久未使用的那个元素。
- 2.要在这个数据结构中快速找到某个 key 是否存在，并返回其对应的 value。
- 3.每次访问这个数据结构中的某个 key，需要将这个元素变为最近使用的。也就是说，这个数据结构要支持在任意位置快速插入和删除元素。

查找快，我们能想到哈希表。但是哈希表的数据是乱序的。

有序，我们能想到链表，插入、删除都很快，但是查询慢。

**所以，我们得让哈希表和链表结合一下，成长一下，形成一个新的数据结构，那就是：哈希链表，LinkedHashMap。**

![img](https://www.shiyitopo.tech/uPic/1460000038714635.png)

借助这个结构，我们再来分析一下上面的三个条件：

- 1.如果每次默认从链表尾部添加元素，那么显然越靠近尾部的元素就越是最近使用的。越靠近头部的元素就是越久未使用的。
- 2.对于某一个 key ，可以通过哈希表快速定位到链表中的节点，从而取得对应的 value。
- 3.链表显然是支持在任意位置快速插入和删除的，修改指针就行。但是单链表无法按照索引快速访问某一个位置的元素，都是需要遍历链表的，所以这里借助哈希表，可以通过 key，快速的映射到任意一个链表节点，然后进行插入和删除。



对于 get 操作，首先判断 key 是否存在：

+ 如果 key 不存在，则返回 -1−1；
  + 如果 key 存在，则 key 对应的节点是最近被使用的节点。通过哈希表定位到该节点在双向链表中的位置，并将其移动到双向链表的头部，最后返回该节点的值。

+ 对于 put 操作，首先判断 key 是否存在：
  + 如果 key 不存在，使用 key 和 value 创建一个新的节点，在双向链表的头部添加该节点，并将 key 和该节点添加进哈希表中。然后判断双向链表的节点数是否超出容量，如果超出容量，则删除双向链表的尾部节点，并删除哈希表中对应的项；

  + 如果 key 存在，则与 get 操作类似，先通过哈希表定位，再将对应的节点的值更新为 value，并将该节点移到双向链表的头部。

时间复杂度为O(1)



```java
public class LRUCache {
    class DLinkedNode {
        int key;
        int value;
        DLinkedNode prev;
        DLinkedNode next;
        public DLinkedNode() {}
        public DLinkedNode(int _key, int _value) {key = _key; value = _value;}
    }

    private Map<Integer, DLinkedNode> cache = new HashMap<Integer, DLinkedNode>();
    private int size;
    private int capacity;
    private DLinkedNode head, tail;

    public LRUCache(int capacity) {
        this.size = 0;
        this.capacity = capacity;
        // 使用伪头部和伪尾部节点
        head = new DLinkedNode();
        tail = new DLinkedNode();
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        DLinkedNode node = cache.get(key);
        if (node == null) {
            return -1;
        }
        // 如果 key 存在，先通过哈希表定位，再移到头部
        moveToHead(node);
        return node.value;
    }

    public void put(int key, int value) {
        DLinkedNode node = cache.get(key);
        if (node == null) {
            // 如果 key 不存在，创建一个新的节点
            DLinkedNode newNode = new DLinkedNode(key, value);
            // 添加进哈希表
            cache.put(key, newNode);
            // 添加至双向链表的头部
            addToHead(newNode);
            ++size;
            if (size > capacity) {
                // 如果超出容量，删除双向链表的尾部节点
                DLinkedNode tail = removeTail();
                // 删除哈希表中对应的项
                cache.remove(tail.key);
                --size;
            }
        }
        else {
            // 如果 key 存在，先通过哈希表定位，再修改 value，并移到头部
            node.value = value;
            moveToHead(node);
        }
    }

    private void addToHead(DLinkedNode node) {
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }

    private void removeNode(DLinkedNode node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void moveToHead(DLinkedNode node) {
        removeNode(node);
        addToHead(node);
    }

    private DLinkedNode removeTail() {
        DLinkedNode res = tail.prev;
        removeNode(res);
        return res;
    }
}
```



