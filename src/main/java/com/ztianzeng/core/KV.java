package com.ztianzeng.core;

import lombok.AllArgsConstructor;

/**
 * 简单KV对象
 *
 * @param <K>
 * @param <V>
 * @author zhaotianzeng
 */
@AllArgsConstructor
public class KV<K, V> {
    public K k;
    public V v;
}
