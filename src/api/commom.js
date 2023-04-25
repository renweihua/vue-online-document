import request from '@/utils/request'

// 通用协议定义
export async function properties(params) {
    return await request({
        url: `/properties`,
        method: 'get',
        params
    })
}

// 搜索会员
export async function searchUsers(params) {
    return await request({
        url: `/search-users`,
        method: 'get',
        params
    })
}

