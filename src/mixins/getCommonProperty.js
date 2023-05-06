import { properties } from "@/api/commom";

export default {
    methods: {
        //获取创建api的默认属性
        async getProperty() {
            const {data, http_status, msg} = await properties();
            this.propertyList = data;
        },
    }
}