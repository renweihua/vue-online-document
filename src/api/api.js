import request from '@/utils/request'

export function lists(params) {
    return request({
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

export function create(data) {
    return request({
        url: `/doc-create`,
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: `/doc-update`,
        method: 'put',
        data
    })
}

export function deleteDoc(data) {
    return request({
        url: `/doc-delete`,
        method: 'delete',
        data
    })
}