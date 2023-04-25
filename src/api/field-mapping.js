import request from '@/utils/request'

export async function lists(params) {
    return await request({
        url: `/field-mappings`,
        method: 'get',
        params
    })
}

export async function detail(api_id) {
    return await request({
        url: `/field-mapping/detail`,
        method: 'get',
        params: {
            api_id
        }
    })
}

export async function create(data) {
    return await request({
        url: `/field-mapping/create`,
        method: 'post',
        data
    })
}

export async function update(data) {
    return await request({
        url: `/field-mapping/update`,
        method: 'put',
        data
    })
}

export async function deleteDoc(data) {
    return await request({
        url: `/field-mapping/delete`,
        method: 'delete',
        data
    })
}