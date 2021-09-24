package com.ztianzeng.repo;

import cn.hutool.core.util.StrUtil;
import com.ztianzeng.core.dto.Edge;
import com.ztianzeng.core.dto.Node;
import net.bitnine.agensgraph.graph.Vertex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

/**
 * @author zhaotianzeng
 */
@Service
public class InterviewGraphRepo {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private void setPath() {
        jdbcTemplate.execute("SET graph_path = 'interview_graph'");
    }

    public void cleanAll() {
        setPath();
        jdbcTemplate.execute("match (n) detach delete n");
    }

    public void createNode(String id, String category, String title) {
        setPath();
        jdbcTemplate.execute(StrUtil.format(
                """
                         CREATE (n:{} { title: '{}',id:'{}'})
                        """, category, title, id));
    }

    public void updateNode(String id, String category, String title) {
        setPath();
        jdbcTemplate.execute(StrUtil.format(
                """
                         MATCH (n:{} {title: '{}'})
                           SET n.id = '{}'
                        RETURN n
                        """, category, title, id));
    }

    public void deleteNodeRelation(String id) {
        setPath();
        jdbcTemplate.execute(StrUtil.format("""
                MATCH (n {id: '{}'})
                DETACH DELETE n
                """, id));
    }

    public void createRelationship(String srcCategory, String targetCategory, String srcTitle, String targetTitle, String desc) {
        setPath();
        var sql = StrUtil.format("""
                MATCH (a:{}) WITH a MATCH (b:{}) WHERE a.title = '{}' AND b.title = '{}' CREATE (a)-[:r {r:'{}'}] -> (b)
                """, srcCategory, targetCategory, srcTitle, targetTitle, desc);
        jdbcTemplate.execute(sql);

    }

    public List<Edge> getAllEdge(Set<Node> nodes) {
        setPath();
        return jdbcTemplate.query("match (m)-[edge]->(n) return m,edge,n", (rs, i) -> {
            Vertex startNode = (Vertex) rs.getObject("m");
            net.bitnine.agensgraph.graph.Edge edge = (net.bitnine.agensgraph.graph.Edge) rs.getObject("edge");
            Vertex endNode = (Vertex) rs.getObject("n");
            nodes.add(new Node(startNode.getString("id"), startNode.getString("title"), startNode.getLabel()));
            nodes.add(new Node(endNode.getString("id"), endNode.getString("title"), endNode.getLabel()));

            return new Edge(startNode.getString("id"), edge.getString("r"), endNode.getString("id"));
        });
    }

    public List<Node> getAllNodes() {
        setPath();
        return jdbcTemplate.query("MATCH (n) RETURN n", (rs, i) -> {
            Vertex node = (Vertex) rs.getObject("n");
            return new Node(node.getString("id"), node.getString("title"), node.getLabel());
        });
    }
}
