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
import { DataTableColumns, NDataTable, NButton, NSpace, NInput, NSelect } from 'naive-ui';
import { getInterfaceListAPI, updateInterfaceAPI, createInterfaceAPI, deleteInterfaceAPI } from '@/requests/interface';
import router from '../router/index';

type RowData = {
    id: number
    name: string
    description: string
    method: string
    path: string
}

const data = ref()
const methodOptions = ref([
    {
        label: 'GET',
        value: 'GET'
    },
    {
        label: 'POST',
        value: 'POST'
    },
    {
        label: 'PUT',
        value: 'PUT'
    },
    {
        label: 'DELETE',
        value: 'DELETE'
    }
])

getInterfaceListAPI(0, 0, '').then((response) => {
    data.value = response.data.data;
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
        key: 'name',
        render(row, index) {
            return h(NInput, {
                placeholder: '',
                value: row.name,
                onUpdateValue(v) {
                    data.value[index].name = v
                }
            })
        }
    },
    {
        title: '描述',
        key: 'description',
        render(row, index) {
            return h(NInput, {
                placeholder: '',
                value: row.description,
                onUpdateValue(v) {
                    data.value[index].description = v
                }
            })
        }
    },
    {
        title: '方法',
        key: 'method',
        render(row, index) {
            return h(NSelect, {
                options: methodOptions.value,
                value: row.method,
                onUpdateValue(v) {
                    data.value[index].method = v
                }
            })
        }
    },
    {
        title: '地址',
        key: 'path',
        render(row, index) {
            return h(NInput, {
                placeholder: '',
                value: row.path,
                onUpdateValue(v) {
                    data.value[index].path = v
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
        id: 0,
        name: "",
        description: "",
        method: "GET",
        path: ""
    })
}

function save(row: RowData) {
    if (row.id != 0) {
        updateInterfaceAPI(row.id, row).then(() => {
            console.log('Update interface success!');
            router.go(0);
        })
    } else {
        createInterfaceAPI(row).then(() => {
            console.log('Create interface success!');
            router.go(0);
        })
    }
}

function del(interfaceId: number) {
    deleteInterfaceAPI(interfaceId).then(() => {
        console.log('Delete interface success!');
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