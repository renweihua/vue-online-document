import { getProjectDetail } from "@/api/project";

export default {
    methods: {
        //获取创建api的默认属性
        async getProjectById(id) {
            const {data, http_status, msg} = await getProjectDetail(this.$route.params.projectId);
            if (http_status === this.HTTP_SUCCESS) {
                this.project = data;
                this.$store.commit("saveProject", data);
            }
        },
    }
}