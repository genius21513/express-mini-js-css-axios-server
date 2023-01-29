const app = {
    data() {
        return {
            email: '',
            password: '',
            notification: {
                message: ''
            },
            error: {
                title: '',
                message: ''
            },
            notice: false,
            alert: false
        };
    },

    created() {
        vm = this;
        if (localStorage.action !== undefined) {
            vm.notification.message = localStorage.action;
            localStorage.removeItem("action");
            localStorage.removeItem("token");
            Cookies.set('idx', '');
            vm.alert = false;
            vm.notice = true;
            setTimeout(() => vm.notice = false, 20000);
        }
        const currentUser = Cookies.get('defaultUsername');
        const currentToken = Cookies.get('idx');
        const defaultApp = Cookies.get('defaultApp');
        if (!!currentToken && !!defaultApp) {
            window.location.href = '/app/' + defaultApp + "?m=login";
        }
        else if (!!currentUser) {
            vm.email = currentUser;
        }
        else if (!!serverData.reason) {
            vm.notification.message = 'You need to login to access the application.';
            vm.alert = false;
            vm.notice = true;
            setTimeout(() => vm.notice = false, 20000);
        }
    },

    methods: {
        login() {
            vm = this;
            vm.alert = false;
            axios.post('/login', {
                username: vm.email,
                password: vm.password
            })
                .then(function (res) {
                    vm.notice = false;
                    vm.alert = false;
                    localStorage.token = res.data.token;
                    Cookies.set('idx', encodeURIComponent(res.data.token), {expires: 7});
                    if (res.data.apps.length === 0) {
                        vm.error.title = "Request failed";
                        vm.error.message = "Your user account does not yet have application permission set up.";
                        vm.alert = true;
                        vm.notice = false;
                        setTimeout(() => vm.alert = false, 20000);
                    } else {
                        Cookies.set('defaultUsername', vm.email, { expires: 60} );
                        Cookies.set('defaultApp', res.data.apps[0], { expires: 60 } );
                        window.location.href = '/app/' + res.data.apps[0];
                    }
                })
                .catch(function (err) {
                    vm.notice = false;
                    if (err.response !== undefined) {
                        vm.error.title = "Request failed";
                        vm.error.message = err.response.data.message;
                        console.log('aha');
                    } else {
                        vm.error.title = "Request failed";
                        vm.error.message = "Unable to login, please try again later.";
                    }
                    vm.alert = true;
                    setTimeout(() => vm.alert = false, 20000);
                })
        }
    }
};

Vue.createApp(app).mount("#login");