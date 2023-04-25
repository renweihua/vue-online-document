import request from '@/utils/request'

// 操作日志
export async function operationLogs(params) {
    return await request({
        url: `/operation-logs`,
        method: 'get',
        params
    })
}