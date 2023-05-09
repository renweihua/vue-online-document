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
        url: `/group/detail`,
        method: 'get',
        params: {
            doc_id
        }
    })
}

export async function create(data) {
    return await request({
        url: `/group/create`,
        method: 'post',
        data
    })
}

export async function update(data) {
    return await request({
        url: `/group/update`,
        method: 'put',
        data
    })
}

export async function batchSave(data) {
    return await request({
        url: `/group/batch-save`,
        method: 'put',
        data
    })
}

// 是否默认打开子节点
export async function setDefaultExpand(data) {
    return await request({
        url: `/group/set-default-expand`,
        method: 'patch',
        data
    })
}

export async function deleteGroup(data) {
    return await request({
        url: `/group/delete`,
        method: 'delete',
        data
    })
}