import request from '@/utils/request'

export async function lists(params) {
    return await request({
        url: `/groups`,
        method: 'get',
        params
    })
}

export async function detail(doc_id) {
    return await request({
        url: `/group-detail`,
        method: 'get',
        params: {
            doc_id
        }
    })
}

export async function create(data) {
    return await request({
        url: `/group-create`,
        method: 'post',
        data
    })
}

export async function update(data) {
    return await request({
        url: `/group-update`,
        method: 'put',
        data
    })
}

export async function deleteDoc(data) {
    return await request({
        url: `/group-delete`,
        method: 'delete',
        data
    })
}