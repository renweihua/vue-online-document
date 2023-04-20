import request from '@/utils/request'

export function getProjects(data) {
    return request({
        url: `/projects`,
        method: 'get',
        data
    })
}