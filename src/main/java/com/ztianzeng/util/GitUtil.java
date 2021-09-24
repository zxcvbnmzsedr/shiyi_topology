package com.ztianzeng.util;

import lombok.extern.slf4j.Slf4j;
import org.eclipse.jgit.api.CloneCommand;
import org.eclipse.jgit.api.Git;

import java.io.File;

/**
 * @author zhaotianzeng
 */
@Slf4j
public class GitUtil {
    public static void cloneRepository(String url, String localPath) {
        try {
            log.info("开始下载...... {}", url);

            CloneCommand cc = Git.cloneRepository().setURI(url);
            cc.setDirectory(new File(localPath)).call();

            log.info("下载完成......");

        } catch (Exception e) {
            e.printStackTrace();
            log.error("下载失败....", e);
        }
    }
}
