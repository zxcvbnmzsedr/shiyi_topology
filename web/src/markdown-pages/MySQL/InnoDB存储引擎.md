# InnoDB存储引擎

innoDB存储引擎，是mysql默认的存储引擎，而且现在大多数的互联网公司也是采用的InnoDB作为存储引擎，InnoDB从众多的存储引擎中脱颖而出，是由其特点决定的，支持行锁设计、支持MVCC、支持外键、提供一致性非锁定读、同时被设计用来最有效的利用以及使用内存和CPU。

这是一张来自于mysql官网的，InnoDB引擎特性表

![image-20220104220325376](https://www.shiyitopo.tech/uPic/image-20220104220325376.png)

## InnoDB的体系架构

InnoDB的体系架构分为两个部分，内存结构和磁盘结构

![InnoDB架构图](https://www.shiyitopo.tech/uPic/innodb-architecture.png)

## 内存结构

内存架构中有`缓冲池Buffer Pool`，`修改缓冲ChangeBuffer`,`自适应Hash索引 Adaptive HashIndex`以及`日志缓冲区Log Buffer`。

这四部分共同组成了InnoDB的内存架构部分。

### 缓冲池Buffer Pool

Buffer Pool 主要是通过内存的速度来弥补磁盘速度较慢对数据库性能的影响，其中缓存了表信息以及索引信息。它是mysql数据库中内存占比最大的一块，采用LRU算法进行内存管理。

Buffer Pool 的工作流程和正常的缓存的用法一致，缓存中取不到则打到磁盘中取，然后回写。

![InnoDB](https://www.shiyitopo.tech/uPic/InnoDB.png)

### Change Buffer

在以前的版本中，这个ChangeBuffer只支持缓存insert 的操作，所以最初又被称之为insert buffer, 在后续的版本中增加的更多的操作类型，所以现在被称之为Change Buffer。

Change Buffer现在支持五种配置:

```javascript
--all：      默认值。开启buffer inserts、delete-marking operations、purges
--none： 不开启change buffer
--inserts：  只是开启buffer insert操作
--deletes:  只是开delete-marking操作
--changes：  开启buffer insert操作和delete-marking操作
--purges：   对只是在后台执行的物理删除操作开启buffer功能
```

工作原理:

在对数据变更时，如果数据所在的数据页没有在Buffer Pool中的话，在不影响数据一致性的情况下，InnoDB引擎将对数据的操作缓存在Change Buffer中，这样就避免了从磁盘中去读入这个数据页。将数据页从磁盘中读入内存中进行操作，减少随机IO的操作。

Change Buffer 在一定条件下，会将Change Buffer中的操作和具体的数据取进行merge，然后回写磁盘，这样得到的数据就是正确的了。一下这三种情况会发生merge操作:

1. 原始数据页加载到Buffer Pool中
2. mysql定时触发merge操作
3. mysql 数据库正常关闭时

### 自适应Hash索引

随着数据的逐渐增多，即使采用了B+树这种数据结构，树的高度也变得越来越高，通过sql进行数据查询的时候，定位到具体数据的次数也会变得更高。

InnoDB提供了一个哈希表Adaptive HashIndex，根据检索的条件，直接查询到对应的数据页，跳过逐层定位的步骤，这种数据结构被称之为AHI。

它是从某个检索条件到某个数据页的哈希表，其哈希表不能太大，太大的话维护哈希表的成本就会大于收益；也不能太小，大小会导致缓存命中率太低，无任何收益。

### 日志缓冲区

保存要写入磁盘的日志文件的数据，日志缓冲区的内容会定期刷新到磁盘。较大的日志缓冲区使大型事务可以运行，而无需在事务提交之前将重做日志数据写入磁盘。因此，如果有更新，插入或删除许多行的事务，则增加日志缓冲区的大小可以节省磁盘 I/O。

## 磁盘结构

InndoDB的磁盘结构6个方面:

1. 表
2. 索引
3. 表空间
4. 双写缓冲区
5. redo 日志
6. undo 日志

### 表

磁盘结构的表就是我们最常用的那个表，使用 `CREATE TABLE`命令进行创建，默认引擎为InnoDB

### 索引

用于加快查询速度，对数据建立B+的树结构，查询时从这课树上进行获取

### 表空间

表空间是实际存在的存储着表数据的物理文件。

InndoDB提供两种数据库表的存储方式

1. 共享表空间
2. 独立表空间

在不通过innodb_file_per_table指定的情况下，默认是独占的

#### 共享表空间

整个数据库的表数据和索引存储在一个文件中，默认放在/usr/local/mysqldata中，每一个表有一个.frm表描述文件，放在mysqldata下的具体数据库目录

优点：
1、表空间可以自动分成多个文件存放到各个磁盘上，一个表的数据可以分布在不同的文件上。表数据的大小限制不再是文件系统单个文件大小的限制，而是InnoDB自身的限制。从Innodb官方文档可知，其表空间的最大限制为64TB，也就是说，Innodb的单表大小限制也在64TB左右。

缺点：
1、所有的数据和索引存放到一个文件中，会是一个很常大的文件，虽然可以把一个大文件分成多个小文件，但是整个数据库的表及索引在表空间中混合存储，这样对于数据库做了大量删除操作后表空间中将会有大量的空隙。

#### 独立表空间：

在/var/lib/mysql下，每一个表都有一个.frm表描述文件，还有一个.ibd，每个表的数据和索引单独存放在以表命名的ibd文件中

优点：
1、每个表都有自已独立的表空间物理文件，数据存储清晰，灾难恢复相对容易，不会影响其他表。
2、可以实现单表在不同的数据库中移动。
3、空间更容易回收。

4、一般情况，使用独占表空间的性能会更高一点。

对于使用独立表空间的表，不管怎么删除，表空间的碎片不会太严重的影响性能，而且还有机会处理，处理方式如下：
Drop table操作时自动回收表空间；
对于innodb-plugin的Innodb使用turncate table收缩表空间

缺点：

使用独享表空间来存放Innodb的表，每个表的数据以一个单独的文件来存放，这个时候的单表数据量的限制，又变成文件系统的大小限制了，不过像linux新的文件系统ext3、ext4等，文件大小也够用了。

### 双写缓冲区

双写缓冲区是InnoDB的三大特性之一,旨在提高数据页的可靠性。

> InnoDB的page size一般是16KB，其数据校验也是针对这16KB来计算的，将数据写入到磁盘是以page为单位进行操作的。操作系统写文件是以4KB作为单位的，那么每写一个InnoDB的page到磁盘上，操作系统需要写4个块。而计算机硬件和操作系统，在极端情况下（比如断电）往往并不能保证这一操作的原子性，16K的数据，写入4K时，发生了系统断电或系统崩溃，只有一部分写是成功的，这种情况下就是partial page write（部分页写入）问题。这时page数据出现不一样的情形，从而形成一个”断裂”的page，使数据产生混乱。这个时候InnoDB对这种块错误是无 能为力的.
>
> InndoDB在未采用Doublewrite buffer之前，曾经出现过因为写失效导致的数据丢失的情况。

doublewrite buffer本质是一块存储区域，在InnoDB将页面写到对应的数据文件的适当位置之前，会在这里写入从缓冲池中刷新的页面。

如果在写page的过程中发生意外崩溃，InnoDB在稍后的恢复过程中在doublewrite buffer中找到完好的page副本用于恢复。

![img](https://www.shiyitopo.tech/uPic/FmlA70PGEO5qW2Tx71Mpaf4kiG-1.png)

doublewrite buffer 是顺序写入，开销不大

所以在正常的情况下, MySQL写数据page时，会写两遍到磁盘上，第一遍是写到doublewrite buffer，第二遍是从doublewrite buffer写到真正的数据文件中。如果发生了极端情况（断电），InnoDB再次启动后，发现了一个page数据已经损坏，那么此时就可以从doublewrite buffer中进行数据恢复了。

### redo日志

redo日志是实现事务持久性的一个手段，在每次事务提交的时候，将事务涉及到的数据页全部刷新到磁盘中，但是实时取刷盘会有严重的性能问题

1. 因为InnoDB是以页为单位进行磁盘交互的，而一个事务很可能只修改了一个数据页中的几个字节，这时候进行刷盘太浪费IO资源
2. 一个事务可能设计修改多个数据页，这些数据页在物理上并不连续，随机IO性能太差

因此，就诞生了redo日志，redo log 主要就是降低对数据页的刷盘要求，mysql每执行一条DML语句，先将操作记录记录到redo log buffer中，后续某个时间点再一次性将多个操作记录写到read log file中。read log 记录了数据页的变更，而这种变更记录没有必要全部保存，因此，read log 实现上采用了大小固定、循环写入的方式，当写到结尾时，会回到开头循环写日志。

![img](https://www.shiyitopo.tech/uPic/1460000023827699.png)

在上图中， `write pos `表示 `redo log `当前记录的 `LSN` (逻辑序列号)位置， `check point `表示 数据页更改记录 刷盘后对应 `redo log `所处的 `LSN `(逻辑序列号)位置。 `write pos `到 `check point `之间的部分是 `redo log `空着的部分，用于记录新的记录；` check point `到 `write pos `之间是 `redo log `待落盘的数据页更改记录。当 `write pos `追上 `check point `时，会先推动 `check point `向前移动，空出位置再记录新的日志。

启动 `innodb `的时候，不管上次是正常关闭还是异常关闭，总是会进行恢复操作。因为 `redo log `记录的是数据页的物理变化，因此恢复的时候速度比逻辑日志(如 `binlog `)要快很多。 重启 `innodb `时，首先会检查磁盘中数据页的 `LSN `，如果数据页的 `LSN `小于日志中的 `LSN `，则会从 `checkpoint `开始恢复。 还有一种情况，在宕机前正处于
`checkpoint `的刷盘过程，且数据页的刷盘进度超过了日志页的刷盘进度，此时会出现数据页中记录的 `LSN `大于日志中的 `LSN`
，这时超出日志进度的部分将不会重做，因为这本身就表示已经做过的事情，无需再重做。

### undo日志

undo日志是实现事务原子性的手段，提供回滚和多个行版本控制。

undo log 记录了数据的逻辑变化。

比如:

一条 ` INSERT
`语句，对应一条 `DELETE `的 `undo log `。

对于每个 `UPDATE `语句，对应一条相反的 `UPDATE `的`
undo log `，这样在发生错误时，就能回滚到事务之前的数据状态。`
