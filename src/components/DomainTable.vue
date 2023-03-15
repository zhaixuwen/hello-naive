<template>
    <div class="tableOut">
        <n-space vertical>
            <n-button @click="add">添加</n-button>
            <n-data-table :columns="columns" :data="data" :pagination="pagination" />
        </n-space>
    </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { DataTableColumns, NDataTable, NButton, NSpace, NInput } from 'naive-ui';
import { getEnvDomainListAPI, updateEnvDomainAPI, createEnvDomainAPI, deleteEnvDomainAPI } from '@/requests/env-domain';
import router from '../router/index';

type RowData = {
    id: number
    code: string
    domain: string
}

const data = ref()

getEnvDomainListAPI(0, 0, '').then((resp) => {
    data.value = resp.data.data
})


const createColumns = (): DataTableColumns<RowData> => [
    {
        title: '#',
        key: 'id',
        render(row) {
            return row.id
        }
    },
    {
        title: '名称',
        key: 'code',
        render(row, index) {
            return h(NInput, {
                placeholder: '',
                value: row.code,
                onUpdateValue(v) {
                    data.value[index].code = v
                }
            })
        }
    },
    {
        title: '域名',
        key: 'domain',
        render(row, index) {
            return h(NInput, {
                placeholder: '',
                value: row.domain,
                onUpdateValue(v) {
                    data.value[index].domain = v
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
                            onClick: () => save(row)
                        },
                        { default: () => '保存' }
                    ),
                    h(
                        NButton,
                        {
                            strong: true,
                            size: 'small',
                            type: 'error',
                            round: true,
                            secondary: true,
                            onClick: () => del(row.id)
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

function add() {
    data.value.push({
        "id": 0,
        "code": "",
        "domain": ""
    })
}

function save(row: RowData) {
    if (row.id != 0) {
        updateEnvDomainAPI(row.id, row).then(() => {
            console.log('Update domain success!');
            router.go(0);
        })

    } else {
        createEnvDomainAPI(row).then(() => {
            console.log('Create domain success!');
            router.go(0);
        })
    }
}

function del(domainId: number) {
    deleteEnvDomainAPI(domainId).then(() => {
        console.log('Delete domain success!');
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