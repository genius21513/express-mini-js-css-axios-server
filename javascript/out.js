const app = {
    data() {
    },

    created() {
        vm = this;
        localStorage.removeItem("token");
        localStorage.action = 'Please enter your login credentials above.';
        Cookies.set('defaultApp', '');
        setTimeout(() => { window.location.href = '/login'; }, 12500);
    }

};

Vue.createApp(app).mount("#auth");