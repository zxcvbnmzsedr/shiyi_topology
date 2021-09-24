package com.ztianzeng.util;

import java.io.File;
import java.io.FileFilter;
import java.net.URL;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * 文件工具类
 *
 * @author zhaotianzeng
 */
public class FileUtil {

    /**
     * 递归获取文件
     *
     * @param filePath 文件路径
     * @return 文件列表
     */
    public static Set<File> extractFiles(String filePath) {
        var fileResource = new File(filePath);
        return extractFiles(fileResource);
    }

    /**
     * 递归获取文件
     *
     * @param fileSource 文件
     * @return 文件列表
     */
    public static Set<File> extractFiles(File fileSource) {
        Set<File> fileSet = new HashSet<>();
        extractFiles(fileSet, fileSource);
        return fileSet;
    }

    /**
     * 递归获取目标package里面的所有class文件（包括子package里的class文件）
     *
     * @param fileSet    文件集合
     * @param fileSource 文件或者目录
     */
    private static void extractFiles(Set<File> fileSet, File fileSource) {
        if (!fileSource.isDirectory()) {
            fileSet.add(fileSource);
            return;
        }
        var files = fileSource.listFiles(new FileFilter() {
            @Override
            public boolean accept(File file) {
                if (file.isDirectory()) {
                    return true;
                } else {
                    String abcPath = file.getAbsolutePath();
                    // 只解析md文件
                    if (abcPath.endsWith(".md")) {
                        addToClassSet(file);
                    }
                    return false;
                }
            }
            private void addToClassSet(File file) {
                fileSet.add(file);
            }
        });
        if (files != null) {
            for (File file : files) {
                extractFiles(fileSet, file);
            }
        }

    }
}
