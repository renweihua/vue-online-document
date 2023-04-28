export default {
    methods: {
        controlShow() {
            return true;
            
            if (this.$store.state.userInfo.type == 3 || this.$store.state.userInfo.type == 2) {
                return true;
            }

            return (this.$store.state.projectPermission == 6 || this.$store.state.userInfo.type === 2);
        }
    }
}