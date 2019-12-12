<template>
    <div class="trayManage">
        <h4>托盘管理报表</h4>
        <div class="search">
            <span></span>
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
        <el-table
            style="width:100%"
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            highlight-current-row
            @row-click="rowClick"
            border 
        >
            <!-- @current-change ="rowCheckedChange" -->
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="factoryCode" label="工厂编码"></el-table-column>
            <el-table-column prop="factoryName" label="工厂名称"></el-table-column>
            <el-table-column prop="rfid" label="托盘ID"></el-table-column>
            <el-table-column prop="rfidStatusName" label="托盘状态"></el-table-column>
            <el-table-column prop="rfidTypeName" label="托盘类型"></el-table-column>
            <el-table-column prop="currentCode" label="一次绑定(包装喷码)"></el-table-column>
            <el-table-column prop="orderNo" label="二次绑定(交货单号)"></el-table-column>
            <el-table-column prop="initTime" label="托盘进场时间"></el-table-column>
        </el-table>
        <div style="width:90%;">
            <el-pagination
                class="paginationStyle"
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
    </div>
</template>

<script>
import { getTrayLists, forzenRow, updateRow } from '@/api/trayManage'
import DIC from '@/api/dic.js'
export default {
    data() {
        return {
            tableData: [],
            checkedRow: {},
            dialogVisible: false,
            formObj: {},
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
            getTrayLists({
                rfidStatus: this.rfidStatusVal,
                rfidType: this.rfidTypeVal,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }).then(res => {
                if (res.data.code === 200) {
                    this.tableData = res.data.rows
                    this.total = res.data.total
                    this.tableData.forEach(item => {
                        this.$set(item, 'checked', false)
                    })
                }
            })
        },
    
        submitForm() {
            updateRow(this.formObj).then(res => {
                this.dialogVisible = false
                this.handleList()
            })
        },
        searchByTypeAndStatus() {
            this.handleList()
        },
  
     }
}
</script>

<style lang="scss">
.trayManage {
    .search {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .el-select {
            margin-right: 20px;
        }
    }
    form {
        .el-select {
            width: 100%;
        }
    }
    .paginationStyle {
        text-align: right;
    }
}
</style>
