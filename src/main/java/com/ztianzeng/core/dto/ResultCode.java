package com.ztianzeng.core.dto;

/**
 * @author zhaotianzeng
 */
public class ResultCode {

    public final static ResultCode SUCCESS = getResultCode(0, "成功");
    public final static ResultCode SYSTEM_ERROR = getResultCode(1, "系统错误");

    private int code;
    private String msg;

    protected ResultCode() {
    }

    private ResultCode(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    protected static ResultCode getResultCode(int code, String msg) {
        return new ResultCode(code, msg);
    }

    public int getCode() {
        return code;
    }

    private void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    private void setMsg(String msg) {
        this.msg = msg;
    }
}
