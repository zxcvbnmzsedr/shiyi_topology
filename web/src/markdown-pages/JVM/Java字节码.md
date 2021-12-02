# Java字节码

> Java字节码优秀的设计，是Java经久不衰的原因之一。

我们用Java编写的源文件，是高级语言，而计算机并不能读懂这高级语言，需要将Java编译成字节码才能够运行在JVM之上。

由于JVM跨平台特性，因此编译后的字节码需要屏蔽底层相关的指令，只有JVM所支持的指令。而不像C语言编译之后是二进制且二进制和底层CPU的指令集相关联。



## 知道字节码么? 字节码都有哪些?

Java字节码是Java源文件经过编译之后生成的class文件，本质上是以8个字节为一个单位的二进制流，各个数据项目严格按照顺序紧凑的排列在class文件中。JVM通过解析二进制数据，从而得到相关信息。

指令可以分为以下几类:

- 存储指令 （例如：aload_0, istore）
- 算术与逻辑指令 （例如: ladd, fcmpl）
- 类型转换指令 （例如：i2b, d2i）
- 对象创建与操作指令 （例如：new, putfield）
- 堆栈操作指令 （例如：swap, dup2）
- 控制转移指令 （例如：ifeq, goto）
- 方法调用与返回指令 （例如：invokespecial, areturn)



##  Integer x=5,int y=5比较x==y经过哪些步骤?

直接上代码

```java
public class Test {
  public static void main(String[] args){
     Integer x = 5;
     int y = 5;
     boolean flag = x==y;
	}
}

```

通过javac编译之后，输出Test.class文件，我们用javap -p Test.class进行输出

```java
Compiled from "Test.java"
public class Test
  minor version: 0
  major version: 59
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER
  this_class: #17                         // Test
  super_class: #2                         // java/lang/Object
  interfaces: 0, fields: 0, methods: 2, attributes: 1
Constant pool:
   #1 = Methodref          #2.#3          // java/lang/Object."<init>":()V
   #2 = Class              #4             // java/lang/Object
   #3 = NameAndType        #5:#6          // "<init>":()V
   #4 = Utf8               java/lang/Object
   #5 = Utf8               <init>
   #6 = Utf8               ()V
   #7 = Methodref          #8.#9          // java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
   #8 = Class              #10            // java/lang/Integer
   #9 = NameAndType        #11:#12        // valueOf:(I)Ljava/lang/Integer;
  #10 = Utf8               java/lang/Integer
  #11 = Utf8               valueOf
  #12 = Utf8               (I)Ljava/lang/Integer;
  #13 = Methodref          #8.#14         // java/lang/Integer.intValue:()I
  #14 = NameAndType        #15:#16        // intValue:()I
  #15 = Utf8               intValue
  #16 = Utf8               ()I
  #17 = Class              #18            // Test
  #18 = Utf8               Test
  #19 = Utf8               Code
  #20 = Utf8               LineNumberTable
  #21 = Utf8               main
  #22 = Utf8               ([Ljava/lang/String;)V
  #23 = Utf8               StackMapTable
  #24 = Utf8               SourceFile
  #25 = Utf8               Test.java
{
  public Test();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 1: 0

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: (0x0009) ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=4, args_size=1
         0: iconst_5
         1: invokestatic  #7                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
         4: astore_1
         5: iconst_5
         6: istore_2
         7: aload_1
         8: invokevirtual #13                 // Method java/lang/Integer.intValue:()I
        11: iload_2
        12: if_icmpne     19
        15: iconst_1
        16: goto          20
        19: iconst_0
        20: istore_3
        21: return
      LineNumberTable:
        line 3: 0
        line 4: 5
        line 5: 7
        line 6: 21
      StackMapTable: number_of_entries = 2
        frame_type = 253 /* append */
          offset_delta = 19
          locals = [ class java/lang/Integer, int ]
        frame_type = 64 /* same_locals_1_stack_item */
          stack = [ int ]
}
SourceFile: "Test.java"
```

主要是这段,这段才是真正虚拟机需要执行的指令

```java
  0: iconst_5                      		 // int型常量5压入栈顶 -> 栈顶=5
  1: invokestatic  #7                  // 调用静态方法,调用Integer.valueOf()进行自动装包。
  4: astore_1                          // 将栈顶Integer 5存入第二个本地变量
  5: iconst_5                          // int型常量5压入栈顶 -> 栈顶=5,5
  6: istore_2                          // 栈顶int数值存入第三个局部变量
  7: aload_1                           // 将局部变量表的二个变量压入到栈顶
  8: invokevirtual #13                 // 执行Integer.intValue命令，也就是将Integer x=5再给拆包
  11: iload_2                          // 加载第三个变量到栈顶，int y=5,现在栈变成了 int y=5;
    																																					 int x=5;
  12: if_icmpne     19                 // 从栈中弹出两个元素进行比较，如果false则跳转到19
  15: iconst_1                         // int型将1压入栈顶
  16: goto          20                 // 跳转到20行
  19: iconst_0                         // 将int型的0压入栈顶
  20: istore_3                         // 将栈顶的元素1存储第四变量（0或者1）
  21: return                           // 返回，结束
```

