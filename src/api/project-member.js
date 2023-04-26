import request from '@/utils/request'

export async function lists(params) {
    return await request({
        url: `/project-members`,
        method: 'get',
        params
    })
}

export async function detail(api_id) {
    return await request({
        url: `/project-member/detail`,
        method: 'get',
        params: {
            api_id
        }
    })
}

export async function create(data) {
    return await request({
        url: `/project-member/create`,
        method: 'post',
        data
    })
}

export async function update(data) {
    return await request({
        url: `/project-member/update`,
        method: 'put',
        data
    })
}

export async function deleteMember(data) {
    return await request({
        url: `/project-member/delete`,
        method: 'delete',
        data
    })
}

export async function setRolePower(data) {
    return await request({
        url: `/project-member/set-role-power`,
        method: 'patch',
        data
    })
}

