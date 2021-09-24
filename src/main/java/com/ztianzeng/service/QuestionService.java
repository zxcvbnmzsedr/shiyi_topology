package com.ztianzeng.service;

import cn.hutool.core.convert.Convert;
import com.meilisearch.sdk.model.SearchResult;
import com.ztianzeng.controller.vo.NodeOptionsVO;
import com.ztianzeng.controller.vo.QuestionVO;
import com.ztianzeng.core.dto.Edge;
import com.ztianzeng.core.dto.Node;
import com.ztianzeng.core.dto.Question;
import com.ztianzeng.repo.InterviewGraphRepo;
import com.ztianzeng.repo.QuestionRepo;
import com.ztianzeng.search.QuestionSearch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 问题服务
 *
 * @author zhaotianzeng
 */
@Service
public class QuestionService {
    @Autowired
    private InterviewGraphRepo graphRepo;
    @Autowired
    private QuestionRepo questionRepo;
    @Autowired
    private QuestionSearch questionSearch;

    public NodeOptionsVO searchAll() {
        Set<Node> nodes = new HashSet<>();
        List<Edge> edges = graphRepo.getAllEdge(nodes);
        nodes.addAll(graphRepo.getAllNodes());
        return new NodeOptionsVO(nodes, edges);
    }

    public List<QuestionVO> queryQuestion(String q) {
        SearchResult result = questionSearch.search(q);
        return result.getHits().stream()
                .map(hit-> (Map<String, Object>) hit.get("_formatted"))
                .map(formatted->{
                    QuestionVO questionVO = new QuestionVO();
                    questionVO.setTitle((String) formatted.get("title"));
                    questionVO.setId((String) formatted.get("idCopy"));
                    questionVO.setContent((String) formatted.get("content"));
                    questionVO.setCategory((String) formatted.get("category"));
                    return questionVO;
                })
                .collect(Collectors.toList());

    }
}
