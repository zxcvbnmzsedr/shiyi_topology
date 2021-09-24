package com.ztianzeng.controller.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author zhaotianzeng
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionVO {
    private String id;
    /**
     * 文章标题
     */
    private String title;

    /**
     * 文章标签
     */
    private String tag;
    /**
     * 文章内容
     */
    private String content;

    private String category;
}
