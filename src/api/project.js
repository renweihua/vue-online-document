import request from '@/utils/request'

export async function getProjects(data) {
    return await request({
        url: `/projects`,
        method: 'get',
        data
    })
}

export async function getProjectDetail(project_id) {
    return await request({
        url: `/project-detail`,
        method: 'get',
        params: {
            project_id
        }
    })
}

export async function create(data) {
    return await request({
        url: `/project-create`,
        method: 'post',
        data
    })
}

export async function update(data) {
    return await request({
        url: `/project-update`,
        method: 'put',
        data
    })
}

export async function deleteProject(data) {
    return await request({
        url: `/project-delete`,
        method: 'delete',
        data
    })
}