import {joinURL} from 'ufo'
import {H3Event} from 'h3'

export default defineEventHandler(async (event: H3Event) => {
    // Get the runtimeconfig proxy url
    const proxyUrl = useRuntimeConfig().myProxyUrl
    // check the path
    const path = event.path.replace(/^\/api\//, '') // /api/users -> users
    const target = joinURL(proxyUrl, path)
    console.log(':O Proxying to:', target);


    // proxy it!
    return proxyRequest(event, target)
})