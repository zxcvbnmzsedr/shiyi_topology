package com.ztianzeng.core.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author zhaotianzeng
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Involution {
    /**
     * 提问
     */
    private String ask;

    /**
     * 回答
     */
    private String question;
}
