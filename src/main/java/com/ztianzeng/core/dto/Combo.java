package com.ztianzeng.core.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @author zhaotianzeng
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Combo {
    private List<String> members;
}
