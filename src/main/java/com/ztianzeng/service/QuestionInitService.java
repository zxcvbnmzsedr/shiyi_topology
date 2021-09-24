package com.ztianzeng.service;

import cn.hutool.core.convert.Convert;
import cn.hutool.core.io.file.FileNameUtil;
import cn.hutool.core.util.StrUtil;
import com.ztianzeng.core.QuestionDefinition;
import com.ztianzeng.core.dto.Involution;
import com.ztianzeng.core.dto.Question;
import com.ztianzeng.core.parse.ContentParseUtils;
import com.ztianzeng.repo.InterviewGraphRepo;
import com.ztianzeng.repo.QuestionRepo;
import com.ztianzeng.search.QuestionSearch;
import com.ztianzeng.util.FileUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.monitor.FileAlterationListener;
import org.apache.commons.io.monitor.FileAlterationMonitor;
import org.apache.commons.io.monitor.FileAlterationObserver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.*;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 问题服务
 *
 * @author zhaotianzeng
 */
@Service
@Slf4j
public class QuestionInitService {
    @Value("${interview.local-path}")
    private String interviewPath;
    @Autowired
    private InterviewGraphRepo interviewGraphRepo;
    @Autowired
    private QuestionRepo questionRepo;
    @Autowired
    private QuestionSearch questionSearch;
    /**
     * 忽略的文件，不加入到文件中
     */
    private static final List<String> IGNORE_FILE = new ArrayList<>() {
        {
            add("README");
        }
    };

    /**
     * 初始化
     */
    @PostConstruct
    public void initBefore() throws Exception {
        this.init();
        this.listenFileChange();
    }

    /**
     * 监听文件改变，初始化文件
     *
     * @throws Exception
     */
    public void listenFileChange() throws Exception {
        File currentPath = new File(interviewPath);
        FileAlterationObserver observer = new FileAlterationObserver(currentPath);
        observer.addListener(new FileAlterationListener() {
            @Override
            public void onStart(FileAlterationObserver observer) {

            }

            @Override
            public void onDirectoryCreate(File directory) {
                init();
            }

            @Override
            public void onDirectoryChange(File directory) {
                init();
            }

            @Override
            public void onDirectoryDelete(File directory) {
                init();
            }

            @Override
            public void onFileCreate(File file) {
                log.info("创建：{}-> {}", currentPath, file);
                init();
            }

            @Override
            public void onFileChange(File file) {
                log.info("修改：{}-> {}", currentPath, file);
                init();
            }

            @Override
            public void onFileDelete(File file) {
                log.info("删除：{}-> {}", currentPath, file);
                init();
            }

            @Override
            public void onStop(FileAlterationObserver observer) {

            }
        });
        // 创建文件变化监听器
        FileAlterationMonitor monitor = new FileAlterationMonitor(10000, observer);
        // 开始监控
        monitor.start();
    }

    /**
     * 初始化
     * 1. 情况所有创建的文件
     * 2. 读取所有文件，并弥补上关系
     * 3. 创建节点
     * 4. 管理关系
     * 5. 建立索引
     */
    public void init() {
        clean();
        // loadFile
        var questionDefinitions = loadFiles(interviewPath);
        var defMap = getAllMap(questionDefinitions);
        // 创建节点
        for (QuestionDefinition question : defMap.values()) {
            // 创建节点
            createNode(question);
        }
        // 创建关系
        for (QuestionDefinition question : questionDefinitions) {
            if (question.getInvolutions() == null) {
                continue;
            }
            // 创建关系
            for (Involution involution : question.getInvolutions()) {
                var target = defMap.get(involution.getQuestion());
                createRelationship(question, target, involution.getAsk());
            }
        }
        // 建立查询索引
        createQuestionIndex(defMap.values());
    }


    /**
     * 加载到map中
     *
     * @param definitions 文件定义
     */
    private Map<String, QuestionDefinition> getAllMap(Set<QuestionDefinition> definitions) {
        Map<String, QuestionDefinition> questionDefMap = new HashMap<>();
        for (QuestionDefinition definition : definitions) {
            if (!StrUtil.equals(definition.getTitle(), definition.getFileName())) {
                log.warn("文章和标题尽量保持一致: title:{} -> fileName:{}", definition.getTitle(), definition.getFileName());
                questionDefMap.put(definition.getFileName(), definition);
            }
            if (definition.getTitle() != null) {
                questionDefMap.put(definition.getTitle(), definition);
            }
        }
        // 加载还没有写完的文章
        for (QuestionDefinition definition : definitions) {
            for (Involution involution : definition.getInvolutions()) {
                var q = involution.getQuestion();
                if (!questionDefMap.containsKey(involution.getQuestion())) {
                    questionDefMap.put(q, QuestionDefinition.todoQuestion(q));
                }
            }
        }

        return questionDefMap;
    }

    /**
     * 加载所有的文件,解析,验证塞入到questionMap中
     *
     * @param path 文件路径
     */
    private Set<QuestionDefinition> loadFiles(String path) {
        // 解析所有的文件
        var fileSet = FileUtil.extractFiles(path);
        return fileSet.stream().filter(a -> !IGNORE_FILE.contains(FileNameUtil.mainName(a.getName()))).map(this::read).collect(Collectors.toSet());
    }


    /**
     * 读取文件具体内容，并且生成定义
     *
     * @param file 文件
     * @return 原始文件定义
     */
    public QuestionDefinition read(File file) {
        StringBuilder contentSb = new StringBuilder();
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
            String line;
            while ((line = br.readLine()) != null) {
                // 具体内容属性
                contentSb.append(line).append(System.lineSeparator());
            }
            br.close();
        } catch (IOException e) {
            throw new RuntimeException("解析文件【" + file.getName() + "】失败,路径:" + file.getAbsolutePath(), e);
        }

        var content = contentSb.toString();
        // 解析标题
        var title = ContentParseUtils.parseTitle(content);
        // 主文件名
        var fileName = FileNameUtil.mainName(file);
        // 解析内卷问题，让他们关联起来
        var involutions = ContentParseUtils.parseInvolution(content);
        // 文件的父级就是分类
        var category = FileNameUtil.mainName(file.getParentFile());
        return new QuestionDefinition(category, title, fileName, null, involutions, content);
    }

    /**
     * 清除所有重新建立
     * 这个方法，可能不太好，但是少些好多代码
     */
    private void clean() {
        interviewGraphRepo.cleanAll();
        questionRepo.cleanAll();
    }

    /**
     * 创建节点
     * 1. 创建节点的图
     * 2. 持久化到DB中
     *
     * @param question 问题定义
     */
    private void createNode(QuestionDefinition question) {
        String id = question.getId();
        String category = question.getCategory();
        String title = question.getTitle();
        String content = question.getContent();
        interviewGraphRepo.createNode(id, category, title);
        questionRepo.createQuestion(id, category, title, content);
    }

    /**
     * 创建关系
     *
     * @param src    原节点
     * @param target 目标节点`
     * @param desc   连接线的描述`
     */
    private void createRelationship(QuestionDefinition src, QuestionDefinition target, String desc) {
        var srcCategory = src.getCategory();
        var targetCategory = target.getCategory();
        var srcTitle = src.getTitle();
        var targetTitle = target.getTitle();
        interviewGraphRepo.createRelationship(srcCategory, targetCategory, srcTitle, targetTitle, desc);
    }

    /**
     * 建立问题的查询索引
     */
    private void createQuestionIndex(Collection<QuestionDefinition> questionDefinitions) {
        var questions = questionDefinitions.stream()
                .map(a -> {
                    var convert = Convert.convert(Question.class, a);
                    convert.setId(a.getId());
                    return convert;
                })
                .collect(Collectors.toList());
        questionSearch.addQuestion(questions);
    }
}
