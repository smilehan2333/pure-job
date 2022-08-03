import Vue from "vue";
import Router from "vue-router";
import Records from "@/components/Records";
import News from "@/components/News";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/news",
      name: "主页"
    },
    {
      path: "/records",
      name: "Records",
      component: Records
    },
    {
      path: "/news",
      name: "News",
      component: News
    }
  ]
});
