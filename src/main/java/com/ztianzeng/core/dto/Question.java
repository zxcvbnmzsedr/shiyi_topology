package com.ztianzeng.core.dto;

import lombok.Data;

/**
 * 问题
 * @author zhaotianzeng
 */
@Data
public class Question {
    private String id;

    private String content;
    private String category;

    private String title;
}
