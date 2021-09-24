package com.ztianzeng.repo;

import com.ztianzeng.core.dto.Question;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 面试题哦
 *
 * @author zhaotianzeng
 */
@Repository
public class QuestionRepo {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 根据id查询问题
     *
     * @param id
     */
    public Question getById(String id) {
        return jdbcTemplate.query("select id,title,category,content from question where id = ? ", (rs, rowNum) -> {
            Question question = new Question();
            question.setId(rs.getString("id"));
            question.setTitle(rs.getString("title"));
            question.setContent(rs.getString("content"));
            question.setCategory(rs.getString("category"));
            return question;
        }, id).stream().findFirst().orElse(null);
    }

    public Question getByAnyId(String title) {
        return jdbcTemplate.query("select id,title,category,content from question where ? = any (string_to_array(id, '_')) ", (rs, rowNum) -> {
            Question question = new Question();
            question.setId(rs.getString("id"));
            question.setTitle(rs.getString("title"));
            question.setContent(rs.getString("content"));
            question.setCategory(rs.getString("category"));
            return question;
        }, title).stream().findFirst().orElse(null);
    }

    /**
     * 清除所有问题
     */
    public void cleanAll() {
        jdbcTemplate.execute("delete from question where 1=1;");
    }

    /**
     * 创建问题
     *
     * @param id       id
     * @param category 分类
     * @param title    标题
     * @param content  内容
     */
    public void createQuestion(String id, String category, String title, String content) {
        jdbcTemplate.update("insert into question (id,category,title,content) values (?,?,?,?) on conflict(id) DO UPDATE set id =?,category=?,title = ?,content=?;", id, category, title, content, id, category, title, content);
    }


    public List<Question> queryQuestion(String q) {

        return jdbcTemplate.query("""
                select id, 
                        category,
                       ts_headline('chinese', title, to_tsquery('chinese', ?)) as title
                from question
                where to_tsvector('chinese', title) @@ to_tsquery('chinese', ?);
                """, (rs, rowNum) -> {
            Question question = new Question();
            question.setId(rs.getString("id"));
            question.setTitle(rs.getString("title"));
            question.setCategory(rs.getString("category"));
            return question;
        }, q, q);
    }
}
