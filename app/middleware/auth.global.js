export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn } = useJwtAuth();

    if (to.fullPath != '/login' && to.fullPath != '/register' && to.fullPath != '/reset-password') {
        if (!loggedIn.value) {
            return navigateTo('/login');
        }
    }
});