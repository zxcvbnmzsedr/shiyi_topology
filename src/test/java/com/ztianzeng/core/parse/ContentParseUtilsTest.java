package com.ztianzeng.core.parse;

import com.ztianzeng.core.dto.Involution;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

class ContentParseUtilsTest {
    @Test
    @DisplayName("解析标题")
    public void testTitle() {
        var content = """
                # 快哦
                asfasfasdf
                [involution: 除了非阻塞I/O你还知道哪些IO模型 -> 5种IO模型]
                [involution: 多路复用的原理你能说一下吗 -> 5种IO模型]
                asfdasfdasfd
                """;
        String title = ContentParseUtils.parseTitle(content);
        Assertions.assertEquals(title,"快哦");
    }

    @Test
    @DisplayName("解析问题")
    public void test() {
        var content = """
                as
                asfasfasdf
                [involution: 除了非阻塞I/O你还知道哪些IO模型 -> 5种IO模型]
                [involution: 多路复用的原理你能说一下吗 -> 5种IO模型|啦啦啦|BBB]
                asfdasfdasfd
                """;
        List<Involution> involutions = ContentParseUtils.parseInvolution(content);
        Assertions.assertEquals(involutions.get(0), new Involution("除了非阻塞I/O你还知道哪些IO模型", "5种IO模型"));
        Assertions.assertEquals(involutions.get(1), new Involution("多路复用的原理你能说一下吗", "5种IO模型"));
        Assertions.assertEquals(involutions.get(2), new Involution("多路复用的原理你能说一下吗", "啦啦啦"));
        Assertions.assertEquals(involutions.get(3), new Involution("多路复用的原理你能说一下吗", "BBB"));

    }
}