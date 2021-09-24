package com.ztianzeng.controller;

import com.meilisearch.sdk.model.SearchResult;
import com.ztianzeng.controller.vo.NodeOptionsVO;
import com.ztianzeng.controller.vo.QuestionVO;
import com.ztianzeng.core.dto.Question;
import com.ztianzeng.core.dto.Result;
import com.ztianzeng.core.parse.ContentParseUtils;
import com.ztianzeng.repo.QuestionRepo;
import com.ztianzeng.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 解决不了问题，就解决提出问题的人
 *
 * @author zhaotianzeng
 */
@RestController
@RequestMapping("/question")
public class QuestionController {

    @Autowired
    private QuestionRepo questionRepo;
    @Autowired
    private QuestionService questionService;

    /**
     * 获取问题详情
     *
     * @return
     */
    @GetMapping("/detail")
    public Result<QuestionVO> getQuestion(@RequestParam String id) {
        Question question = questionRepo.getById(id);
        if (question == null) {
            question = questionRepo.getByAnyId(id);
        }
        var content = ContentParseUtils.parseContent(question.getContent());
        return Result.getSuccessResult(new QuestionVO(question.getId(), question.getTitle(), null, content, question.getCategory()));
    }

    /**
     * 搜索全部关系及路径
     */
    @RequestMapping("/searchAll")
    public Result<NodeOptionsVO> searchAll() {
        return Result.getSuccessResult(questionService.searchAll());
    }

    /**
     * 查询节点
     *
     * @param q
     */
    @RequestMapping("/search")
    public Result<List<QuestionVO>> search(@RequestParam String q) {
        return Result.getSuccessResult(questionService.queryQuestion(q));
    }
}
