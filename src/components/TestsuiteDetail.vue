<template>
    <div class="detailOut">
        <div class="detailLeft">
            <n-space vertical>
                <n-form ref="formRef" :model="formValue" label-placement="left" require-mark-placement="right">
                    <n-form-item label="名称" path="name">
                        <n-input v-model:value="formValue.name" />
                    </n-form-item>
                    <n-form-item label="描述" path="description">
                        <n-input v-model:value="formValue.description" type="textarea" />
                    </n-form-item>
                    <n-form-item label="是否启用" path="is_active">
                        <n-switch v-model:value="formValue.is_active" />
                    </n-form-item>
                    <n-form-item label="成员" path="allUser">
                        <n-select multiple v-model:value="formValue.members" :options="userOptions" />
                    </n-form-item>
                </n-form>
                <n-cascader v-model:value="formValue.tempCases" multiple placeholder="请选择要添加的用例"
                    :options="interfaceOptions" :cascade="true" check-strategy="child" :show-path="true"
                    :allow-checking-not-loaded="true" remote :on-load="handleLoad" />
                <n-button @click="addCases" secondary type="success" size="medium">添加</n-button>
            </n-space>
        </div>

        <div class="detailRight">
            <n-space vertical>
                <div class="saveBtn">
                    <n-button @click="saveSuite" secondary type="info" size="medium">保存</n-button>
                </div>
                <n-scrollbar style="max-height: 600px">
                    <n-data-table remote :columns="columns" :data="showTestcases" />
                </n-scrollbar>
            </n-space>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { NForm, NFormItem, NInput, FormInst, NSwitch, NSelect, NCascader, CascaderOption, NButton, NSpace, NDataTable, NScrollbar, useNotification } from 'naive-ui';
import { getUserListAPI } from '@/requests/user';
import { getInterfaceListAPI } from '@/requests/interface';
import { getTestcaseListByInterfaceAPI, getTestcaseListAPI } from '@/requests/testcase';
import { getTestsuiteAPI, createTestsuiteAPI, updateTestsuiteAPI } from '@/requests/testsuite';
import router from '../router/index';
import { useRoute } from 'vue-router';


// 获取路由传的用例id
const uRoute = useRoute();
const testsuiteId = Number(uRoute.query.id);
console.log(testsuiteId);
// 如果是编辑执行集，则更新初始值
if (testsuiteId > 0) {
    getTestsuiteAPI(testsuiteId).then((resp) => {
        formValue.value.id = testsuiteId;
        formValue.value.name = resp.data.data.name;
        formValue.value.description = resp.data.data.description;
        formValue.value.last_execute_status = resp.data.data.last_execute_status;
        formValue.value.is_active = resp.data.data.is_active;
        formValue.value.members = resp.data.data.members;
        formValue.value.testcases = resp.data.data.testcases;
    })
}

const notification = useNotification();


// 获取成员下拉选项
const users = ref([{ id: 1, email: "abc@qq.com" }])
const userOptions = computed(() => users.value.map(
    (v) => ({
        label: v.email,
        value: v.id
    })
))
getUserListAPI().then((response) => {
    users.value = response.data;
});

// 执行集初始值
const formRef = ref<FormInst | null>(null)
const formValue = ref({
    id: 0,
    name: "",
    description: "",
    last_execute_status: 1,
    is_active: true,
    members: [],
    testcases: ref<Array<number>>([]),
    tempCases: ref<Array<string>>([])
})

// 获取全部用例信息
const testcaseList = ref([])
getTestcaseListAPI(0, 0, '').then((response) => {
    testcaseList.value = response.data.data;
    initShowTestcases();
});

// 获取全部接口信息
const interfaceOptions = ref()
getInterfaceListAPI(0, 0, '').then((resp) => {
    interfaceOptions.value = resp.data.data.map(
        (v) => ({
            label: `${v.name} ${v.method}`,
            value: v.id,
            depth: 1,
            isLeaf: false
        })
    )
});

// 选择用例添加到执行集用例中
function handleLoad(option: CascaderOption) {
    return new Promise<void>((resolve) => {
        var childrenOptions = ref()
        getTestcaseListByInterfaceAPI(option.value).then((resp) => {
            childrenOptions.value = resp.data.data.map(
                (v) => ({
                    label: v.title,
                    value: `${option.value}-${v.id}`,
                    depth: 2,
                    isLeaf: true
                })
            )
            option.children = childrenOptions.value;
            resolve();
        })
    })
}

const showTestcases = ref([])

function addCases() {
    for (let t of formValue.value.tempCases) {
        formValue.value.testcases.push(
            Number(t.split("-")[1])
        );
    }
    initShowTestcases();
    formValue.value.tempCases = [];
}

function initShowTestcases() {
    showTestcases.value = [];
    for (let t of formValue.value.testcases) {
        const result = testcaseList.value.filter(tc => tc.id === t);
        showTestcases.value.push(result[0]);
    }
}

const columns = [
    {
        title: '#',
        key: 'id',
        width: 50
    },
    {
        title: '标题',
        key: 'title'
    },
    {
        title: '操作',
        key: 'action',
        width: 100,
        render(row, index) {
            return h(
                NButton,
                {
                    strong: true,
                    size: 'small',
                    round: true,
                    secondary: true,
                    onClick: () => removeCase(index)
                },
                { default: () => '移除' }
            )
        }
    }
]

function removeCase(index: number) {
    showTestcases.value.splice(index, 1);
    formValue.value.testcases.splice(index, 1);
}

function saveSuite() {
    if (testsuiteId > 0) {
        updateTestsuiteAPI(testsuiteId, {
            name: formValue.value.name,
            description: formValue.value.description,
            is_active: formValue.value.is_active,
            members: formValue.value.members,
            testcases: formValue.value.testcases
        }).then(() => {
            notification['success']({
                content: '成功',
                meta: '执行集保存成功',
                duration: 2500,
                keepAliveOnHover: true
            })
            router.push('/testsuites')
        })
    } else {
        createTestsuiteAPI({
            name: formValue.value.name,
            description: formValue.value.description,
            is_active: formValue.value.is_active,
            members: formValue.value.members,
            testcases: formValue.value.testcases
        }).then(() => {
            notification['success']({
                content: '成功',
                meta: '执行集创建成功',
                duration: 2500,
                keepAliveOnHover: true
            })
            router.push('/testsuites')
        })
    }
}



</script>

<style>
.detailOut {
    padding: 20px;
    display: flex;
}

.detailLeft {
    width: 45%;
    text-align: left;
}

.detailRight {
    width: 50%;
    padding-left: 30px;
}

.saveBtn {
    text-align: right;
}
</style>