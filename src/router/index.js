import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import Category from "../components/Category.vue";
import Login from "../components/Login.vue";
import User from "../components/User.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      admin: true,
      grocer: true,
      seller: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      free: true,
    },
  },
  {
    path: "/category",
    name: "Category",
    component: Category,
    meta: {
      admin: true,
      gorcer: true,
    },
  },
  {
    path: "/user",
    name: "User",
    component: User,
    meta: {
      admin: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.free)) {
    next();
  } else if (store.state.user && store.state.user.rol === "Admin") {
    if (to.matched.some((record) => record.meta.admin)) {
      next();
    }
  } else if (store.state.user && store.state.user.rol === "Grocer") {
    if (to.matched.some((record) => record.meta.grocer)) {
      next();
    }
  } else if (store.state.user && store.state.user.rol === "Seller") {
    if (to.matched.some((record) => record.meta.seller)) {
      next();
    }
  } else {
    next({ name: "Login" });
  }
});

export default router;
