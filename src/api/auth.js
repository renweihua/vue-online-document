import request from '@/utils/request'

export async function login(data) {
    return await request({
        url: '/auth/login',
        method: 'post',
        data
    })
}