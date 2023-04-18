/*
|--------------------------------------------------------------------------
| Host相关处理
|--------------------------------------------------------------------------
|
*/
import { ref, Ref, computed, WritableComputedRef, ComputedRef } from "vue"
// import { handleFormatUrl } from "./url"
import type { ApidocProjectHost } from "@@/store"
import { useStore } from "@/store/index"
import globalConfig from "@/../config/config"
import { apidocCache } from "@/cache/apidoc"
import { router } from "@/router/index"

type HostReturn = {
    /**
     * mock服务器地址
     */
    mockServer: Ref<string>,
    /**
     * host弹窗
     */
    hostDialogVisible: Ref<boolean>,
    /**
     * host值
     */
    host: WritableComputedRef<string>,
    /**
     * host枚举值
     */
    hostEnum: ComputedRef<ApidocProjectHost[]>,
    /**
     * 改变host值
     */
    handleChangeHost: (host: string | number | boolean) => void,
}

export default (): HostReturn => {
    const store = useStore();
    //mock服务器地址
    const mockServer = computed(() => `http://${globalConfig.renderConfig.mock.ip}:${store.state["apidoc/mock"].mockServerPort}`);
    //host弹窗
    const hostDialogVisible = ref(false);
    //host值
    const host = computed<string>({
        get() {
            return store.state["apidoc/apidoc"].apidoc.item.url.host
        },
        set(val) {
            store.commit("apidoc/apidoc/changeApidocHost", val);
        },
    });
    //改变host的值
    const handleChangeHost = (server: string | number | boolean) => {
        const projectId = router.currentRoute.value.query.id as string;
        apidocCache.setPreviousServer(projectId, server as string);
    }
    //host枚举值
    const hostEnum = computed<ApidocProjectHost[]>(() => {
        const projectId = router.currentRoute.value.query.id as string;
        const localData: Ref<ApidocProjectHost[]> = ref([])
        localData.value = apidocCache.getApidocServer(projectId)
        return store.state["apidoc/baseInfo"].hosts.concat(localData.value)
    })
    return {
        mockServer,
        hostDialogVisible,
        host,
        hostEnum,
        handleChangeHost,
    }
}
