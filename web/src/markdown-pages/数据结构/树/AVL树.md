# AVL树

> AVL树是最早发明的自平衡二叉树。在AVL树中，任一节点对应的两棵子树的最大高度差为1，因此它也被称为**高度平衡树**。
> AVL树得名于它的发明者G. M. Adelson-Velsky和Evgenii Landis，他们在1962年的论文《An algorithm for the organization of information》中公开了这一数据结构。
>
> 动画: https://www.cs.usfca.edu/~galles/visualization/AVLtree.html

## AVL树的特点
+ 左右子树的高度差都不超过1
+ 左右子树都是AVL树
+ 查找、插入和删除在平均和最坏情况下的时间复杂度都是O(logN)。
+ 增加和删除元素的操作则可能需要借由一次或多次树旋转，以实现树的重新平衡。

## 理论

每次新增/删除节点后**判断平衡性**然后通过**调整**使整棵树重新平衡。

只要是一个平衡树，它的查询效率就是O(logN)

**判断平衡性：**每次新增/删除节点后，刷新受到影响的节点的高度，即可通过任一节点的左右子树高度差判断其平衡性

**调整：**通过对部分节点的父子关系的改变使树重新平衡，利用树旋转的特性，不影响元素的顺序，但会改变树的结构，将一个节点上移、一个节点下移。

## 节点旋转

插入或删除数据的时候，会导致树不平衡。需要根据数据的情况，对这个树重新进行平衡，让左右子树的深度相差最小。

** 四种不平衡的情况 **

### LL形

LL失去平衡的情况，可以通过一次旋转让AVL树恢复平衡。如下图:

![LL旋转](http://java-engineer.ztianzeng.com/uPic/LL%E6%97%8B%E8%BD%AC.png)

LL旋转是围绕"失去平衡的AVL根节点"进行的,也就是节点3.

节点3的左孩子不变，节点5进行旋转，节点3右子树变成节点5的左子树。

**伪代码:**

```java
void LL形旋转(AVLNode node5){
		声明指针AVLNode node3;
		node3 = node5的左子树;
		node5的左子树=node3的右子树;
		node3的右子树 = node5;
    node3的高度 = max(node3左子树高度, node3右子树高度) + 1;
    node5的高度 = max(node3左子树高度, node3的高度) + 1;
}
```

**RR形**

![RR旋转](http://java-engineer.ztianzeng.com/uPic/RR%E6%97%8B%E8%BD%AC.png)

RR形的旋转，和LL的类似，只是往相反的地方旋转而已。

节点4的右孩子不变，节点2进行旋转，节点4左子树变成节点2的右子树。

**伪代码:**

```
void RR形旋转(AVLNode node2){
		声明指针AVLNode node4;
		node4 = node2的右子树;
		node2的右子树=node4的左子树;
		node4的左子树 = node2;
}
```



**LR形**

![LR旋转](http://java-engineer.ztianzeng.com/uPic/LR%E6%97%8B%E8%BD%AC.png)

**伪代码:**

```java
void LR形旋转(AVLNode node90){
		 node90.left = RR形旋转(node90.left);
    LL形旋转(node90);
}
```

**RL形**

和LR形操作相反

**伪代码:**

```java
void RL形旋转(AVLNode node90){
		 node90.right = LL形旋转(node90.right);
     RR形旋转(node90);
}
```



插入节点和删除节点的时候，只要对树的高度进行判断即可



## 总结

虽然平衡树解决了二叉查找树退化为近似链表的缺点，能够把查找时间控制在 O(logn)，不过却不是最佳的。

因为平衡树要求**每个节点的左子树和右子树的高度差至多等于1**，这个要求实在是太严了，导致每次进行插入/删除节点的时候，几乎都会破坏平衡树的第二个规则，进而我们都需要通过**左旋**和**右旋**来进行调整，使之再次成为一颗符合要求的平衡树。

如果在那种插入、删除很频繁的场景中，平衡树需要频繁着进行调整，这会使平衡树的性能大打折扣。

[involution: 解决频繁插入删除导致的性能瓶颈 -> 红黑树]



### 完整代码

```java
著作权归https://pdai.tech所有。
链接：https://www.pdai.tech/md/algorithm/alg-basic-tree-balance.html

/**
 * Java 语言: AVL树
 *
 * @author skywang
 * @date 2013/11/07
 */

public class AVLTree<T extends Comparable<T>> {
    private AVLTreeNode<T> mRoot;    // 根结点

    // AVL树的节点(内部类)
    class AVLTreeNode<T extends Comparable<T>> {
        T key;                // 关键字(键值)
        int height;         // 高度
        AVLTreeNode<T> left;    // 左孩子
        AVLTreeNode<T> right;    // 右孩子

        public AVLTreeNode(T key, AVLTreeNode<T> left, AVLTreeNode<T> right) {
            this.key = key;
            this.left = left;
            this.right = right;
            this.height = 0;
        }
    }

    // 构造函数
    public AVLTree() {
        mRoot = null;
    }

    /*
     * 获取树的高度
     */
    private int height(AVLTreeNode<T> tree) {
        if (tree != null)
            return tree.height;

        return 0;
    }

    public int height() {
        return height(mRoot);
    }

    /*
     * 比较两个值的大小
     */
    private int max(int a, int b) {
        return a>b ? a : b;
    }

    /*
     * 前序遍历"AVL树"
     */
    private void preOrder(AVLTreeNode<T> tree) {
        if(tree != null) {
            System.out.print(tree.key+" ");
            preOrder(tree.left);
            preOrder(tree.right);
        }
    }

    public void preOrder() {
        preOrder(mRoot);
    }

    /*
     * 中序遍历"AVL树"
     */
    private void inOrder(AVLTreeNode<T> tree) {
        if(tree != null)
        {
            inOrder(tree.left);
            System.out.print(tree.key+" ");
            inOrder(tree.right);
        }
    }

    public void inOrder() {
        inOrder(mRoot);
    }

    /*
     * 后序遍历"AVL树"
     */
    private void postOrder(AVLTreeNode<T> tree) {
        if(tree != null) {
            postOrder(tree.left);
            postOrder(tree.right);
            System.out.print(tree.key+" ");
        }
    }

    public void postOrder() {
        postOrder(mRoot);
    }

    /*
     * (递归实现)查找"AVL树x"中键值为key的节点
     */
    private AVLTreeNode<T> search(AVLTreeNode<T> x, T key) {
        if (x==null)
            return x;

        int cmp = key.compareTo(x.key);
        if (cmp < 0)
            return search(x.left, key);
        else if (cmp > 0)
            return search(x.right, key);
        else
            return x;
    }

    public AVLTreeNode<T> search(T key) {
        return search(mRoot, key);
    }

    /*
     * (非递归实现)查找"AVL树x"中键值为key的节点
     */
    private AVLTreeNode<T> iterativeSearch(AVLTreeNode<T> x, T key) {
        while (x!=null) {
            int cmp = key.compareTo(x.key);

            if (cmp < 0)
                x = x.left;
            else if (cmp > 0)
                x = x.right;
            else
                return x;
        }

        return x;
    }

    public AVLTreeNode<T> iterativeSearch(T key) {
        return iterativeSearch(mRoot, key);
    }

    /* 
     * 查找最小结点: 返回tree为根结点的AVL树的最小结点。
     */
    private AVLTreeNode<T> minimum(AVLTreeNode<T> tree) {
        if (tree == null)
            return null;

        while(tree.left != null)
            tree = tree.left;
        return tree;
    }

    public T minimum() {
        AVLTreeNode<T> p = minimum(mRoot);
        if (p != null)
            return p.key;

        return null;
    }
     
    /* 
     * 查找最大结点: 返回tree为根结点的AVL树的最大结点。
     */
    private AVLTreeNode<T> maximum(AVLTreeNode<T> tree) {
        if (tree == null)
            return null;

        while(tree.right != null)
            tree = tree.right;
        return tree;
    }

    public T maximum() {
        AVLTreeNode<T> p = maximum(mRoot);
        if (p != null)
            return p.key;

        return null;
    }

    /*
     * LL: 左左对应的情况(左单旋转)。
     *
     * 返回值: 旋转后的根节点
     */
    private AVLTreeNode<T> leftLeftRotation(AVLTreeNode<T> k2) {
        AVLTreeNode<T> k1;

        k1 = k2.left;
        k2.left = k1.right;
        k1.right = k2;

        k2.height = max( height(k2.left), height(k2.right)) + 1;
        k1.height = max( height(k1.left), k2.height) + 1;

        return k1;
    }

    /*
     * RR: 右右对应的情况(右单旋转)。
     *
     * 返回值: 旋转后的根节点
     */
    private AVLTreeNode<T> rightRightRotation(AVLTreeNode<T> k1) {
        AVLTreeNode<T> k2;

        k2 = k1.right;
        k1.right = k2.left;
        k2.left = k1;

        k1.height = max( height(k1.left), height(k1.right)) + 1;
        k2.height = max( height(k2.right), k1.height) + 1;

        return k2;
    }

    /*
     * LR: 左右对应的情况(左双旋转)。
     *
     * 返回值: 旋转后的根节点
     */
    private AVLTreeNode<T> leftRightRotation(AVLTreeNode<T> k3) {
        k3.left = rightRightRotation(k3.left);

        return leftLeftRotation(k3);
    }

    /*
     * RL: 右左对应的情况(右双旋转)。
     *
     * 返回值: 旋转后的根节点
     */
    private AVLTreeNode<T> rightLeftRotation(AVLTreeNode<T> k1) {
        k1.right = leftLeftRotation(k1.right);

        return rightRightRotation(k1);
    }

    /* 
     * 将结点插入到AVL树中，并返回根节点
     *
     * 参数说明: 
     *     tree AVL树的根结点
     *     key 插入的结点的键值
     * 返回值: 
     *     根节点
     */
    private AVLTreeNode<T> insert(AVLTreeNode<T> tree, T key) {
        if (tree == null) {
            // 新建节点
            tree = new AVLTreeNode<T>(key, null, null);
            if (tree==null) {
                System.out.println("ERROR: create avltree node failed!");
                return null;
            }
        } else {
            int cmp = key.compareTo(tree.key);

               if (cmp < 0) {    // 应该将key插入到"tree的左子树"的情况
                tree.left = insert(tree.left, key);
                // 插入节点后，若AVL树失去平衡，则进行相应的调节。
                if (height(tree.left) - height(tree.right) == 2) {
                    if (key.compareTo(tree.left.key) < 0)
                        tree = leftLeftRotation(tree);
                    else
                        tree = leftRightRotation(tree);
                }
            } else if (cmp > 0) {    // 应该将key插入到"tree的右子树"的情况
                tree.right = insert(tree.right, key);
                // 插入节点后，若AVL树失去平衡，则进行相应的调节。
                if (height(tree.right) - height(tree.left) == 2) {
                    if (key.compareTo(tree.right.key) > 0)
                        tree = rightRightRotation(tree);
                    else
                        tree = rightLeftRotation(tree);
                }
            } else {    // cmp==0
                System.out.println("添加失败: 不允许添加相同的节点！");
            }
        }

        tree.height = max( height(tree.left), height(tree.right)) + 1;

        return tree;
    }

    public void insert(T key) {
        mRoot = insert(mRoot, key);
    }

    /* 
     * 删除结点(z)，返回根节点
     *
     * 参数说明: 
     *     tree AVL树的根结点
     *     z 待删除的结点
     * 返回值: 
     *     根节点
     */
    private AVLTreeNode<T> remove(AVLTreeNode<T> tree, AVLTreeNode<T> z) {
        // 根为空 或者 没有要删除的节点，直接返回null。
        if (tree==null || z==null)
            return null;

        int cmp = z.key.compareTo(tree.key);
        if (cmp < 0) {        // 待删除的节点在"tree的左子树"中
            tree.left = remove(tree.left, z);
            // 删除节点后，若AVL树失去平衡，则进行相应的调节。
            if (height(tree.right) - height(tree.left) == 2) {
                AVLTreeNode<T> r =  tree.right;
                if (height(r.left) > height(r.right))
                    tree = rightLeftRotation(tree);
                else
                    tree = rightRightRotation(tree);
            }
        } else if (cmp > 0) {    // 待删除的节点在"tree的右子树"中
            tree.right = remove(tree.right, z);
            // 删除节点后，若AVL树失去平衡，则进行相应的调节。
            if (height(tree.left) - height(tree.right) == 2) {
                AVLTreeNode<T> l =  tree.left;
                if (height(l.right) > height(l.left))
                    tree = leftRightRotation(tree);
                else
                    tree = leftLeftRotation(tree);
            }
        } else {    // tree是对应要删除的节点。
            // tree的左右孩子都非空
            if ((tree.left!=null) && (tree.right!=null)) {
                if (height(tree.left) > height(tree.right)) {
                    // 如果tree的左子树比右子树高；
                    // 则(01)找出tree的左子树中的最大节点
                    //   (02)将该最大节点的值赋值给tree。
                    //   (03)删除该最大节点。
                    // 这类似于用"tree的左子树中最大节点"做"tree"的替身；
                    // 采用这种方式的好处是: 删除"tree的左子树中最大节点"之后，AVL树仍然是平衡的。
                    AVLTreeNode<T> max = maximum(tree.left);
                    tree.key = max.key;
                    tree.left = remove(tree.left, max);
                } else {
                    // 如果tree的左子树不比右子树高(即它们相等，或右子树比左子树高1)
                    // 则(01)找出tree的右子树中的最小节点
                    //   (02)将该最小节点的值赋值给tree。
                    //   (03)删除该最小节点。
                    // 这类似于用"tree的右子树中最小节点"做"tree"的替身；
                    // 采用这种方式的好处是: 删除"tree的右子树中最小节点"之后，AVL树仍然是平衡的。
                    AVLTreeNode<T> min = minimum(tree.right);
                    tree.key = min.key;
                    tree.right = remove(tree.right, min);
                }
            } else {
                AVLTreeNode<T> tmp = tree;
                tree = (tree.left!=null) ? tree.left : tree.right;
                tmp = null;
            }
        }

        tree.height = max(height(tree.left), height(tree.right)) + 1;

        return tree;
    }

    public void remove(T key) {
        AVLTreeNode<T> z; 

        if ((z = search(mRoot, key)) != null)
            mRoot = remove(mRoot, z);
    }

    /* 
     * 销毁AVL树
     */
    private void destroy(AVLTreeNode<T> tree) {
        if (tree==null)
            return ;

        if (tree.left != null)
            destroy(tree.left);
        if (tree.right != null)
            destroy(tree.right);

        tree = null;
    }

    public void destroy() {
        destroy(mRoot);
    }

    /*
     * 打印"二叉查找树"
     *
     * key        -- 节点的键值 
     * direction  --  0，表示该节点是根节点;
     *               -1，表示该节点是它的父结点的左孩子;
     *                1，表示该节点是它的父结点的右孩子。
     */
    private void print(AVLTreeNode<T> tree, T key, int direction) {
        if(tree != null) {
            if(direction==0)    // tree是根节点
                System.out.printf("%2d is root\n", tree.key, key);
            else                // tree是分支节点
                System.out.printf("%2d is %2d's %6s child\n", tree.key, key, direction==1?"right" : "left");

            print(tree.left, tree.key, -1);
            print(tree.right,tree.key,  1);
        }
    }

    public void print() {
        if (mRoot != null)
            print(mRoot, mRoot.key, 0);
    }
}
```



参考: https://www.pdai.tech/md/algorithm/alg-basic-tree-balance.html#%E6%A0%91---%E5%B9%B3%E8%A1%A1%E4%BA%8C%E5%8F%89%E6%A0%91avl