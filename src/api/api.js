import request from '@/utils/request'

// 通用协议定义
export async function properties(params) {
    return await request({
        url: `/properties`,
        method: 'get',
        params
    })
}

export async function lists(params) {
    return await request({
        url: `/apis`,
        method: 'get',
        params
    })
}

export async function detail(api_id) {
    return await request({
        url: `/api-detail`,
        method: 'get',
        params: {
            api_id
        }
    })
}

export async function create(data) {
    return await request({
        url: `/api-create`,
        method: 'post',
        data
    })
}

export async function update(data) {
    return await request({
        url: `/api-update`,
        method: 'put',
        data
    })
}

export async function deleteDoc(data) {
    return await request({
        url: `/api-delete`,
        method: 'delete',
        data
    })
}