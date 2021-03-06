// Import AuthType Enum
import AuthType from "./AuthType";

/** @notice Pre-Load all components for frequently used routes */

/**
 * @notice Some of these less frequented routes uses lazily loaded components
 *
 * route level code-splitting
 * this generates a separate chunk (about.[hash].js) for this route
 * which is lazy-loaded when the route is visited.
 */
const routes = [
  {
    name: "login",
    path: "/",
    component: () => import("@/views/login.vue"),
    meta: { Auth_requirements: AuthType.public_only },
  },
  {
    name: "signup",
    path: "/signup",
    component: () => import("@/views/signup.vue"),
    meta: { Auth_requirements: AuthType.public_only },
  },
];

export default routes;
