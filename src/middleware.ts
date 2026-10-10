import {defineMiddleware} from 'astro:middleware'

export const onRequest = defineMiddleware( (context, next)=>{
    const {url,cookies, redirect, locals} = context;
    const pathname = url.pathname;

    const sessionCokie = cookies.get('session_user');
    let user = null;

    if (sessionCokie?.value) {

        try {
            user = JSON.parse(sessionCokie.value)
        } catch (error) {
            cookies.delete('session_user', {path: '/'});
        }
    }

    locals.user = user;

    const isAuthenticaded = !!user
    const isLoginPage = pathname === '/login'

    const isPublicAsset = 
        pathname.startsWith('/_astro') ||
        pathname.startsWith('/favicon') ||
        pathname.startsWith('/_actions');

    if (isPublicAsset) {
        return next()
    }

    if (!isAuthenticaded && !isLoginPage) {
        return redirect('/login')
    }

    if (isAuthenticaded && isLoginPage) {
        return redirect('/')
    }

    return next()
})