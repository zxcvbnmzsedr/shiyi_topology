# LinkedList

LinkedList既实现了List接口也实现了Deque的接口，也就意味着LinkedList可以即当做顺序容器，也能够用来做队列。

![基本结构](http://java-engineer.ztianzeng.com/uPic/%E5%9F%BA%E6%9C%AC%E7%BB%93%E6%9E%84.png)

由于LinkedList维护了头尾指针，因此非常容易的能够获取到头尾的元素。

特点:

**插入**

1. 默认add方法为尾插法
2. 尾插法只需要常数的时间
3. 在中间位置插入，需要遍历节点到对应的位置,因此效率比较低

**删除**

1. 删除头部，只需修改头部的指针
2. 删除尾部，只需要修改尾部的指针
3. 删除中间，需要遍历找到对应的位置然后去删除，效率低

**查询**

需要遍历整个链表，速度相对于arrayList更慢



[involution: LinkedList的插入速度一定比ArrayList快吗? -> ArrayList和LinkedList插入效率对比]



