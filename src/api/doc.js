import request from '@/utils/request'

export async function lists(params) {
    return await request({
        url: `/docs`,
        method: 'get',
        params
    })
}

export async function detail(doc_id) {
    return await request({
        url: `/doc-detail`,
        method: 'get',
        params: {
            doc_id
        }
    })
}

export async function create(data) {
    return await request({
        url: `/doc-create`,
        method: 'post',
        data
    })
}

export async function update(data) {
    return await request({
        url: `/doc-update`,
        method: 'put',
        data
    })
}

export async function setTop(data) {
    return await request({
        url: `/doc/set-top`,
        method: 'patch',
        data
    })
}


export async function deleteDoc(data) {
    return await request({
        url: `/doc/delete`,
        method: 'delete',
        data
    })
}