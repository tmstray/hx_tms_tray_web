<template>
    <div class="stockView">
        <h4>库存显示报表</h4>
        <div class="search">
            <div></div>
            <div>
                <el-select v-model="rfidStatusVal" placeholder="请选择托盘流转状态">
                    <el-option
                        v-for="item in enum_rfidStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-select v-model="rfidTypeVal" placeholder="请选择托盘类型">
                    <el-option
                        v-for="item in enum_rfidType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    class="searchBtn"
                    @click="searchByTypeAndStatus"
                >搜索</el-button>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%" border>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column label="工厂代码" prop="factoryCode"></el-table-column>
            <el-table-column label="工厂描述" prop="factoryName"></el-table-column>
            <el-table-column label="托盘状态" prop="rfidStatusName"></el-table-column>
            <el-table-column label="托盘类型" prop="rfidTypeName"></el-table-column>
            <el-table-column label="托盘数量" prop="rfidCount"></el-table-column>
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
import { getStockLists } from '@/api/stockView.js'
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
            getStockLists({
                rfidStatus: this.rfidStatusVal,
                rfidType: this.rfidTypeVal,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }).then(res => {
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
.stockView {
    .search {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .el-select {
            margin-right: 20px;
        }
    }
}
</style>
