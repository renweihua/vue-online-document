import request from '@/utils/request'

export function getProjects(data) {
    return request({
        url: `/projects`,
        method: 'get',
        data
    })
}

export function getProjectDetail(project_id) {
    return request({
        url: `/project-detail`,
        method: 'get',
        params: {
            project_id
        }
    })
}