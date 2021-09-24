package com.ztianzeng.config;

import com.meilisearch.sdk.Client;
import com.meilisearch.sdk.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 搜索引擎配置
 *
 * @author zhaotianzeng
 */
@Configuration
public class SearchConfig {
    @Value("${search.url}")
    private String searchUrl;
    @Value("${search.key:''}")
    private String key;

    /**
     * 配置搜索服务器
     */
    @Bean
    public Client searchClient() {
        return new Client(new Config(searchUrl, key));
    }

}
