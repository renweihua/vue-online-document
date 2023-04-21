import request from '@/utils/request'

export function lists(params) {
    return request({
        url: `/docs`,
        method: 'get',
        params
    })
}

export function detail(doc_id) {
    return request({
        url: `/doc-detail`,
        method: 'get',
        params: {
            doc_id
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