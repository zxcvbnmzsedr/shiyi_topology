package com.ztianzeng.core.dto;

import java.util.HashMap;
import java.util.Objects;

@SuppressWarnings("all")
public class Result<T> {
    private String msg;
    private int code;
    private T data;

    protected Result() {
    }

    private Result(ResultCode code, String msg, T t) {
        this.setResultCode(code);
        this.setMsg(msg);
        this.setData(t);
    }

    public static <T> Result<T> failResult(ResultCode resultCode) {
        return new Result(resultCode, resultCode.getMsg(), new HashMap<>());
    }

    public static <T> Result<T> failResult() {
        return Result.failResult(ResultCode.SYSTEM_ERROR);
    }

    public static <T> Result<T> failResult(String msg) {
        return Result.buildResult(ResultCode.SYSTEM_ERROR, msg);
    }

    public static <T> Result<T> getSuccessResult(T t) {
        return Result.buildResult(ResultCode.SUCCESS, t);
    }

    public static <T> Result getSuccessResult() {
        return Result.buildResult(ResultCode.SUCCESS, new HashMap<>());
    }

    public static <T> Result<T> buildResult(ResultCode resultCode) {
        return Result.buildResult(resultCode, null);
    }

    public static <T> Result<T> buildResult(ResultCode resultCode, T t) {
        if (null == resultCode) {
            resultCode = ResultCode.SYSTEM_ERROR;
        }
        return new Result<>(resultCode, resultCode.getMsg(), t);
    }

    public static <T> Result<T> buildResult(ResultCode resultCode, String msg) {
        if (null == resultCode) {
            resultCode = ResultCode.SYSTEM_ERROR;
        }
        return new Result(resultCode, msg, new HashMap<>());
    }

    public static <T> Result<T> buildResult(ResultCode resultCode, String msg, T t) {
        if (null == resultCode) {
            resultCode = ResultCode.SYSTEM_ERROR;
        }
        return new Result<>(resultCode, msg, t);
    }

    public static <T> Result<T> customResult(boolean flag, T object, ResultCode failureResultCode) {
        if (flag) {
            if (Objects.nonNull(object)) {
                return Result.getSuccessResult(object);
            }
            return Result.getSuccessResult();
        }
        if (Objects.nonNull(failureResultCode)) {
            return Result.failResult(failureResultCode);
        }
        return Result.failResult();
    }

    public static <T> Result<T> customResult(boolean flag, T object) {
        if (flag) {
            if (Objects.nonNull(object)) {
                return Result.getSuccessResult(object);
            }
            return Result.getSuccessResult();
        }
        return Result.failResult();
    }

    public static <T> Result<T> customResult(boolean flag) {
        return Result.customResult(flag, null);
    }

    public int getCode() {
        return code;
    }

    public void setResultCode(ResultCode code) {
        if (null == code) {
            code = ResultCode.SYSTEM_ERROR;
        }
        this.code = code.getCode();
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public void setCode(int code) {
        this.code = code;
    }
}
