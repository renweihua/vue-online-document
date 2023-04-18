/**
 * apidoc文档缓存
 */

import { ApidocDetail } from "@@/global";
import type { ApidocProjectHost, ApidocResponseState } from "@@/store"

type ServerInfo = ApidocProjectHost & {
    isLocal?: boolean,
};

class ApidocCache {
    constructor() {
        if (!localStorage.getItem("apidoc/paramsConfig")) {
            localStorage.setItem("apidoc/paramsConfig", "{}");
        }
        if (!localStorage.getItem("apidoc/apidoc")) {
            localStorage.setItem("apidoc/apidoc", "{}");
        }
    }

    /**
     * @description        获取当前选中params tab的值
     * @author             shuxiaokai
     * @create             2021-09-06 21:50
     * @param {string}     id - 当前tab的id
     */
    getActiveParamsTab(id: string): string | null {
        try {
            const localActiveTab: Record<string, string> = JSON.parse(localStorage.getItem("apidoc/paramsActiveTab") || "{}");
            if (!localActiveTab[id]) {
                return null;
            }
            return localActiveTab[id];
        } catch (error) {
            console.error(error);
            localStorage.setItem("apidoc/paramsActiveTab", "{}")
            return null;
        }
    }

    /**
     * @description        设置当前选中params tab的值
     * @author             shuxiaokai
     * @create             2021-09-06 21:50
     * @param {string}     id - 当前tab的id
     * @param {string}     val - 需要设置的值
     */
    setActiveParamsTab(id: string, val: string) {
        try {
            const localActiveTab = JSON.parse(localStorage.getItem("apidoc/paramsActiveTab") || "{}");
            localActiveTab[id] = val;
            localStorage.setItem("apidoc/paramsActiveTab", JSON.stringify(localActiveTab));
        } catch (error) {
            console.error(error);
            const data: Record<string, string> = {};
            data[id] = val;
            localStorage.setItem("apidoc/paramsActiveTab", JSON.stringify(data));
        }
    }

    /**
     * @description        缓存接口信息
     * @author             shuxiaokai
     * @create             2021-09-09 21:37
     */
    setApidoc(val: ApidocDetail) {
        try {
            const localApidoc = JSON.parse(localStorage.getItem("apidoc/apidoc") || "{}");
            localApidoc[val._id] = val;
            localStorage.setItem("apidoc/apidoc", JSON.stringify(localApidoc));
        } catch (error) {
            console.error(error);
            const data: Record<string, ApidocDetail> = {};
            data[val._id] = val;
            localStorage.setItem("apidoc/apidoc", JSON.stringify(data));
        }
    }

    /**
     * @description        获取缓存接口信息
     * @author             shuxiaokai
     * @create             2021-09-09 21:37
     * @param {string}     id 接口id
     */
    getApidoc(id: string): ApidocDetail | null {
        try {
            const localApidoc: Record<string, ApidocDetail> = JSON.parse(localStorage.getItem("apidoc/apidoc") || "{}");
            if (!localApidoc[id]) {
                return null;
            }
            return localApidoc[id];
        } catch (error) {
            console.error(error);
            localStorage.setItem("apidoc/apidoc", "{}")
            return null;
        }
    }

    /**
     * @description        缓存服务器地址
     * @author             shuxiaokai
     * @create             2021-09-09 21:37
     */
    addApidocServer(serverInfo: ServerInfo, projectId: string) {
        try {
            const localData = JSON.parse(localStorage.getItem("apidoc/apidocServer") || "{}");
            if (!localData[projectId]) {
                localData[projectId] = [];
            }
            // if (localData[projectId].find((v: ServerInfo) => v.url === serverInfo.url)) {
            //     return
            // }
            localData[projectId].push(serverInfo);
            localStorage.setItem("apidoc/apidocServer", JSON.stringify(localData));
        } catch (error) {
            console.error(error);
            const data: Record<string, ServerInfo[]> = {};
            data[projectId] = [serverInfo];
            localStorage.setItem("apidoc/apidocServer", JSON.stringify(data));
        }
    }

    /**
     * @description        删除缓存服务器地址
     * @author             shuxiaokai
     * @create             2021-09-09 21:37
     */
    deleteApidocServer(host: string, projectId: string) {
        try {
            const localData = JSON.parse(localStorage.getItem("apidoc/apidocServer") || "{}");
            if (!localData[projectId]) {
                localData[projectId] = [];
            }
            const delIndex = localData[projectId].findIndex((v: ServerInfo) => v.url === host);
            if (delIndex !== -1) {
                localData[projectId].splice(delIndex, 1);
            }
            localStorage.setItem("apidoc/apidocServer", JSON.stringify(localData));
        } catch (error) {
            console.error(error);
            const data: Record<string, ServerInfo[]> = {};
            data[projectId] = [];
            localStorage.setItem("apidoc/apidocServer", JSON.stringify(data));
        }
    }

    /**
     * @description        更新缓存服务器地址
     * @author             shuxiaokai
     * @create             2021-09-09 21:37
     */
    // updateApidocServer(serverInfo: ServerInfo, projectId: string) {
    //     try {
    //         const localData = JSON.parse(localStorage.getItem("apidoc/apidocServer") || "{}");
    //         if (!localData[projectId]) {
    //             localData[projectId] = [];
    //         }
    //         localData[projectId].push(serverInfo);
    //         localStorage.setItem("apidoc/apidocServer", JSON.stringify(localData));
    //     } catch (error) {
    //         console.error(error);
    //         const data: Record<string, ServerInfo[]> = {};
    //         data[projectId] = [serverInfo];
    //         localStorage.setItem("apidoc/apidocServer", JSON.stringify(data));
    //     }
    // }

    /**
     * @description        获取缓存服务器地址
     * @author             shuxiaokai
     * @create             2021-09-09 21:37
     * @param {string}     projectId 项目id
     */
    getApidocServer(projectId: string): ServerInfo[] | [] {
        try {
            const localData: Record<string, ServerInfo[]> = JSON.parse(localStorage.getItem("apidoc/apidocServer") || "{}");
            if (!localData[projectId]) {
                return [];
            }
            return localData[projectId];
        } catch (error) {
            console.error(error);
            localStorage.setItem("apidoc/apidocServer", "{}")
            return [];
        }
    }

    /**
     * @description        获取是否开启代理缓存
     * @author             shuxiaokai
     * @create             2021-09-09 21:37
     * @param {string}     projectId 项目id
     */
    getApidocProxyState(projectId: string): boolean | null {
        try {
            const localData: Record<string, boolean> = JSON.parse(localStorage.getItem("apidoc/apidocCacheState") || "{}");
            if (localData[projectId] == null) {
                return null;
            }
            return localData[projectId] === true;
        } catch (error) {
            console.error(error);
            localStorage.setItem("apidoc/apidocCacheState", "{}")
            return false;
        }
    }

    /**
     * @description        设置是否开启代理服务器
     * @author             shuxiaokai
     * @create             2021-09-09 21:37
     */
    setApidocProxyState(cacheState: boolean, projectId: string) {
        try {
            const localData = JSON.parse(localStorage.getItem("apidoc/apidocCacheState") || "{}");
            localData[projectId] = cacheState;
            localStorage.setItem("apidoc/apidocCacheState", JSON.stringify(localData));
        } catch (error) {
            console.error(error);
            localStorage.setItem("apidoc/apidocCacheState", "{}");
        }
    }

    /**
         * @description        缓存返回值
         * @author             shuxiaokai
         * @create             2021-09-09 21:37
         */
    setResponse(id: string, response: ApidocResponseState) {
        try {
            const localData = JSON.parse(localStorage.getItem("apidoc/response") || "{}");
            localData[id] = response;
            localStorage.setItem("apidoc/response", JSON.stringify(localData));
        } catch (error) {
            console.error(error);
            localStorage.setItem("apidoc/response", "{}");
        }
    }

    /**
     * @description        获取已缓存得返回值
     * @author             shuxiaokai
     * @create             2021-09-09 21:37
     * @param {string}     id 文档id
     */
    getResponse(id: string): ApidocResponseState | null {
        try {
            const localData: Record<string, ApidocResponseState> = JSON.parse(localStorage.getItem("apidoc/response") || "{}");
            if (localData[id] == null) {
                return null;
            }
            return localData[id];
        } catch (error) {
            console.error(error);
            localStorage.setItem("apidoc/response", "{}")
            return null;
        }
    }

    /**
     * @description        删除response缓存
     * @author             shuxiaokai
     * @create             2021-09-09 21:37
     */
    deleteResponse(id: string) {
        try {
            const localData = JSON.parse(localStorage.getItem("apidoc/response") || "{}");
            delete localData[id]
            localStorage.setItem("apidoc/response", JSON.stringify(localData));
        } catch (error) {
            console.error(error);
            localStorage.setItem("apidoc/response", "{}");
        }
    }

    /**
     * @description        缓存上一次选择的server
     * @author             shuxiaokai
     * @create             2021-11-09 21:37
     * @param {string}     projectId 项目id
     */
    setPreviousServer(projectId: string, server: string) {
        try {
            const localData = JSON.parse(localStorage.getItem("apidoc/previousServer") || "{}");
            localData[projectId] = server;
            localStorage.setItem("apidoc/previousServer", JSON.stringify(localData));
        } catch (error) {
            console.error(error);
            localStorage.setItem("apidoc/previousServer", "{}");
        }
    }

    /**
     * @description        获取上一次选择的server
     * @author             shuxiaokai
     * @create             2021-11-09 21:37
     * @param {string}     projectId 项目id
     */
    getPreviousServer(projectId: string): string | null {
        try {
            const localData: Record<string, string> = JSON.parse(localStorage.getItem("apidoc/previousServer") || "{}");
            if (localData[projectId] == null) {
                return null;
            }
            return localData[projectId];
        } catch (error) {
            console.error(error);
            localStorage.setItem("apidoc/previousServer", "{}")
            return null;
        }
    }

    /**
     * @description        获取返回参数状态
     * @author             shuxiaokai
     * @create             2021-11-09 21:37
     * @remark             true代表显示 false代表折叠
     */
    getAllResponseCollapseState(): Record<string, boolean> {
        try {
            const localData: Record<string, boolean> = JSON.parse(localStorage.getItem("apidoc/responseCollapse") || "{}");
            return localData;
        } catch (error) {
            console.error(error);
            return {};
        }
    }

    /**
     * @description        设置返回参数状态
     * @author             shuxiaokai
     * @create             2021-11-09 21:37
     * @param {string}     id 项目id
     * @param {string}     isShow 是否展示
     */
    setResponseCollapseState(id: string, isShow: boolean) {
        try {
            const localData = JSON.parse(localStorage.getItem("apidoc/responseCollapse") || "{}");
            localData[id] = isShow;
            localStorage.setItem("apidoc/responseCollapse", JSON.stringify(localData));
        } catch (error) {
            console.error(error);
            localStorage.setItem("apidoc/responseCollapse", "{}");
        }
    }

    /**
     * @description        获取缓存的代码钩子
     * @author             shuxiaokai
     * @param {string}     projectId 项目id
     * @create             2021-11-09 21:37
     * @remark
     */
    getHookCodeById(projectId: string): string | null {
        try {
            const localData: Record<string, string> = JSON.parse(localStorage.getItem("apidoc/hookCode") || "{}");
            if (localData[projectId] == null) {
                return null;
            }
            return localData[projectId];
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    /**
     * @description        设置缓存的代码钩子
     * @author             shuxiaokai
     * @create             2021-11-09 21:37
     * @param {string}     projectId 项目id
     * @param {string}     code 缓存代码
     */
    setHookCode(projectId: string, code: string) {
        try {
            const localData = JSON.parse(localStorage.getItem("apidoc/hookCode") || "{}");
            localData[projectId] = code;
            localStorage.setItem("apidoc/hookCode", JSON.stringify(localData));
        } catch (error) {
            console.error(error);
            localStorage.setItem("apidoc/hookCode", "{}");
        }
    }

    /**
     * @description        隐藏body参数提示信息
     * @author             shuxiaokai
     * @create             2021-11-09 21:37
     */
    hideJsonBodyTip() {
        try {
            localStorage.setItem("apidoc/hideJsonBodyTip", JSON.stringify(true));
        } catch (error) {
            console.error(error);
            localStorage.setItem("apidoc/hideJsonBodyTip", "false");
        }
    }

    /**
     * @description        获取是否显示body提示
     * @author             shuxiaokai
     * @create             2021-11-09 21:37
     */
    getCouldShowJsonBodyTip(): boolean {
        try {
            const isHidden = JSON.parse(localStorage.getItem("apidoc/hideJsonBodyTip") || "false");
            return !isHidden;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * 获取worker全局local状态
     */
    getApidocWorkerLocalStateById(projectId: string): null | Record<string, unknown> {
        try {
            const localData: Record<string, Record<string, unknown>> = JSON.parse(localStorage.getItem("apidoc/worker/localState") || "{}");
            if (localData[projectId] == null) {
                return null;
            }
            return localData[projectId];
        } catch (error) {
            console.error(error);
            return null
        }
    }

    /**
     * 设置worker全局local状态
     */
    setApidocWorkerLocalState(projectId: string, state: Record<string, unknown>) {
        try {
            const localData = JSON.parse(localStorage.getItem("apidoc/worker/localState") || "{}");
            localData[projectId] = state;
            localStorage.setItem("apidoc/worker/localState", JSON.stringify(localData));
        } catch (error) {
            console.error(error);
            localStorage.setItem("apidoc/worker/localState", "{}");
        }
    }

    /**
     * 获取mock编辑 json返回数据提示信息
     */
    getIsShowApidocMockParamsJsonTip(): boolean {
        try {
            const localData = JSON.parse(localStorage.getItem("apidoc/mock/isShowJsonTip") || "true");
            return localData;
        } catch (error) {
            console.error(error);
            return true
        }
    }

    /**
     * 设置 json返回数据提示信息
     */
    setIsShowApidocMockParamsJsonTip(isShow: boolean) {
        try {
            localStorage.setItem("apidoc/mock/isShowJsonTip", JSON.stringify(isShow));
        } catch (error) {
            console.error(error);
            localStorage.setItem("apidoc/mock/isShowJsonTip", "true");
        }
    }
}

export const apidocCache = new ApidocCache();
