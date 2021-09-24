package com.ztianzeng.core.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 边定义
 *
 * @author zhaotianzeng
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Edge {
    private String source;
    private String label;
    private String target;
}
