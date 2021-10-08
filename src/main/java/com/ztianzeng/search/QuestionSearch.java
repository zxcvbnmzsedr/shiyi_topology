package com.ztianzeng.search;

import cn.hutool.core.convert.Convert;
import cn.hutool.crypto.digest.MD5;
import cn.hutool.json.JSONUtil;
import com.meilisearch.sdk.Client;
import com.meilisearch.sdk.Index;
import com.meilisearch.sdk.SearchRequest;
import com.meilisearch.sdk.model.SearchResult;
import com.ztianzeng.core.dto.Question;
import com.ztianzeng.core.parse.ContentParseUtils;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.ztianzeng.core.Constant.QUESTION_SEARCH_INDEX;

/**
 * 问题搜索服务
 *
 * @author zhaotianzeng
 */
@Service
@Slf4j
public class QuestionSearch {

    @Autowired
    private Client searchClient;

    /**
     * 因为这个search引擎，id不支持中文。
     */
    @EqualsAndHashCode(callSuper = true)
    @Data
    static class Tmp extends Question {
        private String idCopy;
    }

    /**
     * 建立问题索引
     *
     * @param questionList 问题集合
     */
    public void addQuestion(List<Question> questionList) {
        try {
            // 清空索引重新建立
            searchClient.deleteIndex(QUESTION_SEARCH_INDEX);
            var data = questionList.stream().map(a -> {
                Tmp convert = Convert.convert(Tmp.class, a);
                convert.setIdCopy(a.getId());
                convert.setId(MD5.create().digestHex(a.getId()));
                // todo: 在对content建立索引的时候，非常的慢，不知道为啥，后面得深入研究一下
//                convert.setContent(ContentParseUtils.parseContent(a.getContent()));
                convert.setContent(null);
                return convert;
            }).collect(Collectors.toList());
            Index index = searchClient.index(QUESTION_SEARCH_INDEX);
            System.out.println(JSONUtil.toJsonStr(data));
            final String result = index.addDocuments(JSONUtil.toJsonStr(data));
            log.info("建立索引成功~~ {}", result);
        } catch (Exception e) {
            log.error("建立索引失败~~~", e);
            throw new RuntimeException("建立索引失败~~~", e);
        }
    }

    public SearchResult search(String q) {
        try {
            var index = searchClient.index(QUESTION_SEARCH_INDEX);
            return index.search(
                    new SearchRequest(q)
                            .setCropLength(150)
                            .setAttributesToCrop(new String[]{"title"})
                            .setLimit(5)
                            .setAttributesToHighlight(new String[]{"title", "content", "category"})
            );
        } catch (Exception e) {
            log.error("查询失败~~~", e);
            throw new RuntimeException("查询失败~~~", e);
        }


    }
}
