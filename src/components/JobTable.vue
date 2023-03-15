<template>
    <div class="tableOut">
        <n-space vertical>
            <n-button @click="addJob">添加</n-button>
            <n-data-table :columns="columns" :data="data" :pagination="pagination" />
        </n-space>
    </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { DataTableColumns, NSelect, NDataTable, NButton, NSpace, NInput } from 'naive-ui'
import router from '../router/index'
import { getTestsuiteListAPI } from '@/requests/testsuite'
import { getJobListAPI, createJobAPI, updateJobAPI, deleteJobAPI } from '@/requests/job'

type RowData = {
    id: string
    name: string
    testsuite_id: number
    trigger: string
    next_run_time: string
    is_new: boolean
}

type TempObj = {
    id: number
    name: string
}

const data = ref()
const selectOptions = ref([])
getTestsuiteListAPI().then((response) => {
    selectOptions.value = response.data.data.map(
        (v: TempObj) => ({
            label: v.name,
            value: v.id
        })
    )
});

getJobListAPI().then((response) => {
    data.value = response.data.data
    for (var index in data.value) {
        data.value[index]['is_new'] = false;
    }
});

const createColumns = (): DataTableColumns<RowData> => [
    {
        title: '#',
        key: 'id',
        render(row, index) {
            return h(NInput, {
                disabled: true,
                placeholder: '',
                value: row.id,
                onUpdateValue(v) {
                    data.value[index].id = v
                }
            })
        }
    },
    {
        title: '测试集',
        key: 'testsuite_id',
        render(row, index) {
            return h(NSelect, {
                disabled: !row.is_new,
                value: row.testsuite_id,
                options: selectOptions.value,
                onUpdateValue(v) {
                    data.value[index].testsuite_id = v
                }
            })
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
        title: 'Crontab表达式',
        key: 'trigger',
        render(row, index) {
            return h(NInput, {
                placeholder: '分 时 几号 月份 周几',
                value: row.trigger,
                onUpdateValue(v) {
                    data.value[index].trigger = v
                }
            })

        }
    },
    {
        title: '下次执行时间',
        key: 'next_run_time',
        render(row, index) {
            return h(NInput, {
                disabled: true,
                placeholder: '',
                value: row.next_run_time,
                onUpdateValue(v) {
                    data.value[index].next_run_time = v
                }
            })
        }
    },
    {
        title: '操作',
        key: 'next_run_time',
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

function addJob() {
    data.value.push({
        "id": "",
        "name": "",
        "testsuite_id": selectOptions.value[0].value,
        "trigger": "",
        "next_run_time": "",
        "is_new": true
    })
}


function save(row: RowData) {
    if (row.id != "") {
        updateJobAPI({
            "id": row.id,
            "job_name": row.name,
            "crontab": row.trigger
        }).then(() => {
            console.log('Update job success!');
            router.go(0);
        });
    } else {
        createJobAPI({
            "testsuite_id": row.testsuite_id,
            "job_name": row.name,
            "crontab": row.trigger
        }).then(() => {
            console.log('Create job success!');
            router.go(0);
        });
    }
}

function del(jobId: string) {
    deleteJobAPI(jobId).then(() => {
        console.log('Delete job success!');
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