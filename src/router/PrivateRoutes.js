// Import AuthType Enum
import AuthType from "./AuthType";

const routes = [
  {
    name: "home",
    path: "/home",
    component: () => import("@/views/home.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
];

export default routes;
