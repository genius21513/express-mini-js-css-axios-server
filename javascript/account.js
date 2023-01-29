const account = {
    data() {
        return {
            user: {
                username: '',
                userid: '',
                organisation: '',
                orgs: ''
            }
        };
    },
    created () {
        this.loaded()
    },
    methods: {
        loaded () {
            if (serverData.user !== undefined) {
                this.user.userid = serverData.user.id;
                this.user.username = serverData.user.name;
                this.user.organisation = serverData.user.org;
            }
        },
        switchOrg(id) {
            let requestUrl = '/org/default?userId=' + this.user.userid + '&orgId=' + id;
            axios.put(requestUrl).then(function(res) {
                    setTimeout(() => { location.reload(); }, 200);
                })
                .catch(function(err) {
                    console.log("Unable to set org");
                })
        },
        logout() {
            localStorage.removeItem("token");
            Cookies.set('idx', '');
            localStorage.action = 'You have been logged out.';
            if (serverData.user === undefined) {
                localStorage.action = 'Please enter your login credentials above.';
            }
            window.location.href = '/login';
        }
    }

};

Vue.createApp(account).mount("#account");

