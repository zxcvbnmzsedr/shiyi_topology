package com.ztianzeng.core;

import com.ztianzeng.core.dto.Involution;
import lombok.*;

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;

/**
 * @author zhaotianzeng
 */
@AllArgsConstructor
@Data
@ToString
@NoArgsConstructor
@Builder
public class QuestionDefinition {
    /**
     * 问题分类
     */
    private String category;
    /**
     * 问题标题
     */
    private String title;

    private String fileName;

    /**
     * 问题标签
     */
    private String tag;

    /**
     * 不要问，问就是卷
     */
    private List<Involution> involutions;

    /**
     * 文件内容
     */
    private String content;

    public String getTitle() {
        return Optional.ofNullable(title).orElse(fileName);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        QuestionDefinition that = (QuestionDefinition) o;
        return Objects.equals(getId(), that.getId());
    }

    public String getId() {
        return category + "_" + getTitle() + "_" + getFileName();
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

    public static QuestionDefinition todoQuestion(String title) {
        return QuestionDefinition.builder().category("TODO").title("TODO:" + title).content("# TODO:" + title).build();
    }
}
