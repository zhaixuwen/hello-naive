<template>
    <div id="layoutOut">
        <n-layout has-sider>
            <n-layout-sider bordered collapse-mode="width" width="260px" position="static" :collapsed-width="60"
                :collapsed="collapsed" @collapse="collapsed = true" @expand="collapsed = false" show-trigger="bar">
                <n-avatar round :size="50" src="https://www.naiveui.com/assets/naivelogo-93278402.svg" />
                <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" />
            </n-layout-sider>
            <n-layout>
                <n-layout-header bordered>
                    <n-grid x-gap="12" :cols="12">
                        <n-gi></n-gi>
                        <n-gi></n-gi>
                        <n-gi></n-gi>
                        <n-gi></n-gi>
                        <n-gi></n-gi>
                        <n-gi></n-gi>
                        <n-gi></n-gi>
                        <n-gi></n-gi>
                        <n-gi></n-gi>
                        <n-gi></n-gi>
                        <n-gi></n-gi>
                        <n-gi>
                            <div id="headerOutFour">
                                <n-avatar round :size="50" src="https://s2.loli.net/2023/01/12/TmFl4SeRt8PjhQf.png" />
                            </div>
                        </n-gi>
                    </n-grid>
                </n-layout-header>

                <n-notification-provider>
                    <n-layout-content bordered>
                        <slot name="default"></slot>
                    </n-layout-content>
                </n-notification-provider>

                <n-layout-footer bordered position="absolute">
                    <p><span>Copyright ©2023 ZhaiXuwen</span></p>
                </n-layout-footer>
            </n-layout>
        </n-layout>
    </div>
</template>

<script setup lang="ts">

import { h, ref, Component } from 'vue'
import { RouterLink } from 'vue-router'
import { NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NLayoutFooter, NNotificationProvider } from 'naive-ui';
import { NIcon, MenuOption, NMenu, NAvatar, NGi, NGrid } from 'naive-ui'
import { AlbumsOutline, PodiumOutline, ReorderFourOutline, ConstructOutline, ManOutline, GlobeOutline } from '@vicons/ionicons5'
import { WifiOutline, TimerOutline } from '@vicons/ionicons5'

const collapsed = ref(false)

const menuOptions: MenuOption[] = [
    {
        label: '仪表盘',
        key: 'dashborad',
        icon: renderIcon(PodiumOutline),
        disabled: true
    },
    {
        label: () => h(
            RouterLink,
            {
                to: { name: 'testsuites' }
            },
            { default: () => '测试集' }
        ),
        key: 'testsuite',
        icon: renderIcon(AlbumsOutline),
    },
    {
        label: () => h(
            RouterLink,
            {
                to: { name: 'interfaces' }
            },
            { default: () => '接口管理' }
        ),
        key: 'interface',
        icon: renderIcon(GlobeOutline)
    },
    {
        label: () => h(
            RouterLink,
            {
                to: { name: 'testcases' }
            },
            { default: () => '用例管理' }
        ),
        key: 'testcase',
        icon: renderIcon(ReorderFourOutline)
    },
    {
        label: '接口配置',
        key: 'base-config',
        icon: renderIcon(ConstructOutline),
        children: [
            {
                label: () => h(
                    RouterLink,
                    {
                        to: { name: 'domains' }
                    },
                    { default: () => '域名管理' }
                ),
                key: 'domain',
                icon: renderIcon(WifiOutline),
            },
            {
                label: () => h(
                    RouterLink,
                    {
                        to: { name: 'execute-accounts' }
                    },
                    { default: () => '账户管理' }
                ),
                key: 'account',
                icon: renderIcon(ManOutline),
            }
        ]
    },
    {
        label: () => h(
            RouterLink,
            {
                to: { name: 'jobs' }
            },
            { default: () => '定时任务' }
        ),
        key: 'scheduler',
        icon: renderIcon(TimerOutline),
    }
]

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}

</script>

<style>
#layoutOut {
    height: 100vh;
}

#headerOutFour {
    height: 50px;
    margin: 0;
    text-align: center;
}

.n-layout {
    height: 100%;
}

.n-layout-header {
    height: 50px;
    width: 100%;
    position: absolute;
    top: 0;
    right: 0;
}

.n-layout-content {
    position: absolute;
    width: 100%;
    top: 50px;
}

.n-layout-footer {
    bottom: 0;
    text-align: center;
    vertical-align: middle;
    height: 50px;
}
</style>