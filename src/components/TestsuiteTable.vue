<template>
    <div class="tableOut">
        <n-space vertical>
            <n-button @click="toTestsuiteDetail">添加</n-button>
            <n-data-table :columns="columns" :data="data" striped />
        </n-space>
    </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { DataTableColumns, useNotification } from 'naive-ui'
import { NDataTable, NButton, NSpace, NTag, NSwitch } from 'naive-ui'
import router from '../router/index'
import { useRouter } from 'vue-router'
import { getTestsuiteListAPI, deleteTestsuiteAPI, runTestsuiteAPI } from '@/requests/testsuite';

const uRouter = useRouter();

interface TestSuite {
    id: number
    name: string
    description: string
    last_execute_status: number
    is_active: boolean
}

const createColumns = (): DataTableColumns<TestSuite> => {
    return [
        {
            title: '#',
            key: 'id'
        },
        {
            title: '名称',
            key: 'name'
        },
        {
            title: '描述',
            key: 'description'
        },
        {
            title: '最后执行结果',
            key: 'last_execute_status_show',
            render(row) { return showLastStatus(row) }
        },
        {
            title: '是否启用',
            key: 'is_active_show',
            render(row) { return showIsActive(row) }
        },
        {
            title: '最后更新人',
            key: 'last_updated_by_vo.email'
        },
        {
            title: '操作',
            key: 'action',
            render(row) {
                return h(
                    NSpace,
                    () => [
                        h(
                            NButton,
                            {
                                strong: true,
                                size: 'small',
                                round: true,
                                secondary: true,
                                onClick: () => edit(row)
                            },
                            { default: () => '编辑' }
                        ),
                        h(
                            NButton,
                            {
                                strong: true,
                                size: 'small',
                                type: 'success',
                                round: true,
                                secondary: true,
                                onClick: () => run(row)
                            },
                            { default: () => '执行' }
                        ),
                        h(
                            NButton,
                            {
                                strong: true,
                                size: 'small',
                                type: 'info',
                                round: true,
                                secondary: true,
                                onClick: () => toReport(row.id)
                            },
                            { default: () => '查看报告' }
                        ),
                        h(
                            NButton,
                            {
                                strong: true,
                                size: 'small',
                                type: 'error',
                                round: true,
                                secondary: true,
                                onClick: () => del(row)
                            },
                            { default: () => '删除' }
                        )
                    ]
                )
            }
        }
    ]
}

const data = ref<TestSuite[]>()
const columns = createColumns()

getTestsuiteListAPI().then((response) => {
    data.value = response.data.data
});

function edit(row: TestSuite) {
    router.push({
        path: '/testsuites/detail',
        query: { id: row.id }
    })
}

function del(row: TestSuite) {
    deleteTestsuiteAPI(row.id).then(() => {
        router.go(0);
    })
}

function toReport(suiteId: number) {
    const { href } = uRouter.resolve({
        path: '/testsuites/report',
        query: { id: suiteId }
    });
    window.open(href, "_blank");
}

const notification = useNotification()
function run(row: TestSuite) {
    runTestsuiteAPI({
        testsuite_id: row.id
    }).then(() => {
        notification['success']({
            content: '成功',
            meta: '执行集已在后台运行，请稍后查看报告。',
            duration: 2500,
            keepAliveOnHover: true
        })
    })
}

function showLastStatus(row: TestSuite) {
    const tagType = ref('success')
    const tagMsg = ref('成功')
    if (row.last_execute_status != 1) {
        tagType.value = 'error'
        tagMsg.value = '失败'
    }
    return h(
        NTag,
        {
            round: true,
            type: tagType.value,
        },
        { default: () => tagMsg.value }
    )
}

function showIsActive(row: TestSuite) {
    return h(
        NSwitch,
        {
            value: row.is_active,
            disabled: true
        }
    )

}

function toTestsuiteDetail() {
    router.push({
        path: '/testsuites/detail',
        query: { id: 0 }
    })
}

</script>

<style>
.tableOut {
    padding: 20px;
    text-align: left;
}
</style>