package com.ztianzeng.core.parse;

import cn.hutool.core.lang.PatternPool;
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import com.ztianzeng.core.dto.Involution;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * @author zhaotianzeng
 */
public class ContentParseUtils {
    /**
     * 匹配问题
     */
    private static final Pattern INVOLUTION_PATTERN = PatternPool.get("(?<=\\[involution:).*?(?=\\])");
    private static final Pattern INVOLUTION_HAS_PATTERN = PatternPool.get("\\[involution:.*\\]");
    /**
     * 匹配标题
     */
    private static final Pattern TITLE_PATTERN = PatternPool.get("(?<=#).*");

    /**
     * 将所有的内卷问题，转换成对应的URL链接
     *
     * @param content content
     * @return 新的内容
     */
    public static String parseContent(String content) {
        for (String s : ReUtil.findAllGroup0(INVOLUTION_PATTERN, content)) {
            final String ask = s.split("->")[0].trim();
            final String question = s.split("->")[1].trim();
            String[] split = question.split("\\|");
            if (split.length > 1) {
                StringBuilder sb = new StringBuilder();
                sb.append(ask).append("\n\n");
                for (String st : split) {
                    sb.append("[%s](/welcome?id=%s)".formatted(st, st)).append("\n\n");
                }
                content = ReUtil.replaceFirst(INVOLUTION_HAS_PATTERN, content, sb.toString());
            } else {
                content = ReUtil.replaceFirst(INVOLUTION_HAS_PATTERN, content, "[%s](/welcome?id=%s)".formatted(ask, question));
            }
        }
        return content;
    }

    /**
     * 解析标题
     *
     * @param content 内容
     */
    public static String parseTitle(String content) {
        return StrUtil.trim(ReUtil.get(TITLE_PATTERN, content, 0));
    }

    /**
     * 解析内卷问题
     *
     * @param content 内容
     * @return 数组 标记提问 -> 回答
     */
    public static List<Involution> parseInvolution(String content) {
        var groups = ReUtil.findAllGroup0(INVOLUTION_PATTERN, content);
        return groups.stream()
                .map(group -> {
                    var involution = group.split("->");
                    var ask = involution[0].trim();
                    var question = involution[1].trim();
                    return new Involution(ask, question);
                })
                .flatMap(a -> {
                    String[] split = a.getQuestion().split("\\|");
                    List<Involution> list = new ArrayList<>();
                    if (split.length > 1) {
                        for (String s : split) {
                            list.add(new Involution(a.getAsk(), s));
                        }
                    } else {
                        list.add(a);
                    }
                    return list.stream();
                })
                .collect(Collectors.toList());
    }


}
