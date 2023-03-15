<template>
    <div class="tableOut">
        <n-space vertical>
            <n-button @click="addCase">添加</n-button>
            <n-data-table :columns="columns" :data="data" :pagination="pagination" />
        </n-space>
    </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { DataTableColumns, NSelect, NDataTable, NButton, NSpace } from 'naive-ui'
import { getTestcaseListAPI, requestTestcaseAPI, deleteTestcaseAPI } from '@/requests/testcase'
import { getInterfaceListAPI } from '@/requests/interface'
import { getEnvDomainListAPI } from '@/requests/env-domain'
import { getExecuteAccountListAPI } from '@/requests/execute-account'
import router from '@/router'


type Testcase = {
    id: number
    title: string
    description: string
    env_id: number
    execute_account_id: number
    interface_id: number
    header: object
    params: object
    body: object
    post_assert_code: number
    post_assert_json: object
}

type TempObj = {
    id: number
    name: string
    code: string
}

const data = ref()  // TestcaseData
const envOptions = ref()
const accountOptions = ref()
const interfaceOptions = ref()


//获取接口数据
getInterfaceListAPI(0, 0, '').then((resp) => {
    interfaceOptions.value = resp.data.data.map(
        (v: TempObj) => ({
            label: v.name,
            value: v.id
        }))
});

//获取环境数据
getEnvDomainListAPI(0, 0, '').then((resp) => {
    envOptions.value = resp.data.data.map(
        (v: TempObj) => ({
            label: v.code,
            value: v.id
        }))
});

//获取账户数据
getExecuteAccountListAPI(0, 0, '').then((resp) => {
    accountOptions.value = resp.data.data.map(
        (v: TempObj) => ({
            label: v.code,
            value: v.id
        }))
});

// 获取测试用例数据
getTestcaseListAPI(0, 0, '').then((resp) => {
    data.value = resp.data.data;
});


const createColumns = (): DataTableColumns<Testcase> => [
    {
        title: '#',
        key: 'id',
        render(row) {
            return row.id
        }
    },
    {
        title: '标题',
        key: 'title',
        render(row) {
            return row.title
        }
    },
    {
        title: '环境',
        key: 'envDomain',
        render(row, index) {
            return h(NSelect, {
                disabled: true,
                options: envOptions.value,
                value: row.env_id,
                onUpdateValue(v) {
                    data.value[index].env_id = v
                }
            })
        }
    },
    {
        title: '执行账户',
        key: 'executeAccount',
        render(row, index) {
            return h(NSelect, {
                disabled: true,
                options: accountOptions.value,
                value: row.execute_account_id,
                onUpdateValue(v) {
                    data.value[index].execute_account_id = v
                }
            })
        }
    },
    {
        title: '接口',
        key: 'interface',
        render(row, index) {
            return h(NSelect, {
                disabled: true,
                options: interfaceOptions.value,
                value: row.interface_id,
                onUpdateValue(v) {
                    data.value[index].interface_id = v
                }
            })
        }
    },
    {
        title: '操作',
        key: '',
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
                            onClick: () => editCase(row)
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
                            onClick: () => requestCase(row)
                        },
                        { default: () => '请求' }
                    ),
                    h(
                        NButton,
                        {
                            strong: true,
                            size: 'small',
                            type: 'error',
                            round: true,
                            secondary: true,
                            onClick: () => delCase(row.id)
                        },
                        { default: () => '删除' }
                    )]
            )
        }
    }
]

const columns = createColumns()
const pagination = {
    pageSize: 10
}

function addCase() {
    router.push('/testcases/detail');
}

function editCase(testcase: Testcase) {
    router.push({
        path: '/testcases/detail',
        query: { id: testcase.id }
    });
}

function requestCase(testcase: Testcase) {
    requestTestcaseAPI(testcase.id).then(() => {
        alert('接口请求成功，请稍后在详情中查看结果。')
    })
}

function delCase(id: number) {
    deleteTestcaseAPI(id).then(() => {
        router.go(0);
    })
}

</script>

<style>
.tableOut {
    padding: 20px;
    text-align: left;
}
</style>