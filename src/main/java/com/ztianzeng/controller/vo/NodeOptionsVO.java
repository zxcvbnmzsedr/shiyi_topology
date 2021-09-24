package com.ztianzeng.controller.vo;

import com.ztianzeng.core.dto.Edge;
import com.ztianzeng.core.dto.Node;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

/**
 * @author zhaotianzeng
 */
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class NodeOptionsVO {
    private Set<Node> nodes;
    private List<Edge> edges;
}
