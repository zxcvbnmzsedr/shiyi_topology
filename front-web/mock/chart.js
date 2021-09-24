const json = {
    "relationships": [
      "redis单线程的问题-问题_单线程_解决-redis单线程的问题",
      "Redis为什么这么快-IO_非_阻塞-非阻塞IO",
      "Redis为什么这么快-说_原理_多路复用-redis单线程的问题",
      "Redis为什么这么快-单线程_会_问题-redis单线程的问题"
    ],
    "nodes": [
      "redis单线程的问题",
      "非阻塞IO",
      "Redis为什么这么快"
    ]
  }
;

const content = {
  "content":"# Redis为什么这么快\n" +
    "\n" +
    "+ 完全基于内存，所有的运算都是内存级别的。\n" +
    "\n" +
    "+ 数据结构简单，Redis中所有的数据结构都是重新设计过的，这些重新设计的数据结构大部分时间复杂度都是O(1)。\n" +
    "举例：string这个类型没有采用C原生的string，而是重新设计了一套sds的结构\n" +
    "\n" +
    "\n" +
    "+ 工作线程采用单线程，避免了线程上下文切换所带来的损耗，redis的作者认为，性能瓶颈是在于内存或者网络带宽并非cpu，所以多线程并不会带来更大的提升。\n" +
    "\n" +
    "\n" +
    "+ 对于客户端的连接采用多路复用和非阻塞I/O, Redis使用I/O多路复用功能来监听多个socket连接客户端，\n" +
    "这样就可以使用一个线程连接来处理多个请求，减少线程切换带来的开销，同时也避免了 I/O 阻塞操作"
}
function getJson(_, res) {
  return res.json({data: json});
}

function getContent(_,res){
  return res.json({data: content})
}

export default {
  'GET  /api/chart/basic': getJson,
  'GET  /api/question/getContent': getContent,
};
