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
import { getExecuteAccountListAPI, createExecuteAccountAPI, updateExecuteAccountAPI, deleteExecuteAccountAPI } from '@/requests/execute-account';
import { getEnvDomainListAPI } from '@/requests/env-domain';
import router from '@/router';

type RowData = {
    id: number
    code: string
    env_id: number
    username: string
    password: string
    client_id: string
    client_secret: string
}

type TempObj = {
    id: number
    code: string
}

const data = ref()
const envOptions = ref([{ label: null, value: null }])

getEnvDomainListAPI(0, 0, '').then((response) => {
    envOptions.value = response.data.data.map(
        (v: TempObj) => ({
            label: v.code,
            value: v.id
        })
    )
});

getExecuteAccountListAPI(0, 0, '').then((response) => {
    data.value = response.data.data
});


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
        title: '执行环境',
        key: 'env',
        render(row, index) {
            return h(NSelect, {
                value: row.env_id,
                options: envOptions.value,
                onUpdateValue(v: number) {
                    data.value[index].env_id = v
                }
            })
        }
    },
    {
        title: '用户名',
        key: 'username',
        render(row, index) {
            return h(NInput, {
                placeholder: '',
                value: row.username,
                onUpdateValue(v) {
                    data.value[index].username = v
                }
            })
        }
    },
    {
        title: '密码',
        key: 'password',
        render(row, index) {
            return h(NInput, {
                type: 'password',
                "show-password-on": "mousedown",
                value: row.password,
                onUpdateValue(v) {
                    data.value[index].password = v
                }
            })
        }
    },
    {
        title: 'TokenKey',
        key: 'client_id',
        render(row, index) {
            return h(NInput, {
                placeholder: '',
                value: row.client_id,
                onUpdateValue(v) {
                    data.value[index].client_id = v
                }
            })
        }
    },
    {
        title: 'TokenPass',
        key: 'client_secret',
        render(row, index) {
            return h(NInput, {
                type: 'password',
                "show-password-on": "mousedown",
                value: row.client_secret,
                onUpdateValue(v) {
                    data.value[index].client_secret = v
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
        "env_id": envOptions.value[0].value,
        "username": null,
        "password": null,
        "client_id": null,
        "client_secret": null
    })
}

function save(row: RowData) {
    if (row.id != 0) {
        updateExecuteAccountAPI(row.id, row).then(() => {
            console.log('Update execute account success!');
            router.go(0);
        });
    } else {
        createExecuteAccountAPI(row).then(() => {
            console.log('Create execute account success!');
            router.go(0);
        });
    }
}

function del(accountId: number) {
    deleteExecuteAccountAPI(accountId).then(() => {
        console.log('Delete execute account success!');
        router.go(0);
    });
}

</script>

<style>
.tableOut {
    padding: 20px;
    text-align: left;
}
</style>