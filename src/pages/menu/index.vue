<template>
    <div class="user">
        <div class="search" align="right">
            <div></div>
            <el-form :inline="true" class="searchBar">
                <el-form-item label="托盘流转状态:">
                    <el-select v-model="rfidStatusVal" placeholder="请选择托盘流转状态">
                        <el-option
                            v-for="item in enum_rfidStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="托盘类型:">
                    <el-select v-model="rfidTypeVal" placeholder="请选择托盘类型">
                        <el-option
                            v-for="item in enum_rfidType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        class="searchBtn"
                        @click="handleList"
                    >搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" style="width: 100%" border>
            <el-table-column type="index" label="序号" width="70"></el-table-column>
            <el-table-column label="菜单名称" prop="menuName"></el-table-column>
            <el-table-column label="图标" prop="icon"></el-table-column>
            <el-table-column label="排序" prop="orderNum"></el-table-column>
            <el-table-column label="可见" prop="visible"></el-table-column>
        </el-table>
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
    </div>
</template>

<script>
import { getMenuList } from '@/api/menu.js'
import DIC from '@/api/dic.js'
export default {
    data() {
        return {
            tableData: [],
            enum_rfidStatus: DIC.rfidStatus,
            enum_rfidType: DIC.rfidType,
            rfidStatusVal: 0,
            rfidTypeVal: 0,
            pageNum: 1,
            pageSize: 10,
            total: 0
        }
    },
    components: {},
    created() {
        this.handleList()
    },
    methods: {
        handleCurrentChange(val) {
            this.pageNum = val
            this.handleList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.handleList()
        },
        handleList() {
            getMenuList({}).then(res => {
                console.log(res)
                this.tableData = res.data.rows
                this.total = res.data.total
            })
        },
        searchByTypeAndStatus() {
            this.handleList()
        }
    }
}
</script>

<style  lang="scss">
.user {
    .search {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}
</style>
