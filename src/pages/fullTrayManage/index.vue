<template>
    <div class="fullTrayManage">
        <el-table :data="tableData" style="width: 100%" height="550">
            <el-table-column type="index" label="满托库存清单" align="center">
                <el-table-column type="index" label="序号" />
                <el-table-column label="入库时间" prop="initTime" width="160" center />
                <el-table-column label="托盘ID" prop="rfid" width="130" center />
                <el-table-column label="绑定包装喷码" prop="currentCode" width="170" center />
                <el-table-column label="绑定DL交货单" prop="orderNo" width="130" center />
                <el-table-column label="托盘流转状态" prop="rfidStatusName" center />
                <el-table-column label="托盘健康状态" prop="rfidHealthName" center />
                <el-table-column label="最后更新时间" prop="updateTime" width="160" center />
                <el-table-column label="修改人" prop="updateBy" />
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="handleUpdate(scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table-column>
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
        <!-- 修改包装喷码和交货单 -->
        <el-dialog title="修改" :visible.sync="dialogVisible" width="30%" center>
            <el-form :model="formObj" ref="formObj">
                <el-input v-model="formObj.oldCode" style="display:none;"></el-input>
                <el-form-item label="绑定包装喷码:" prop="currentCode" :rules="rules">
                    <el-input v-model="formObj.currentCode"></el-input>
                </el-form-item>
                <el-input v-model="formObj.oldOrderNo" style="display:none;"></el-input>
                <el-form-item label="绑定DL交货单:" prop="orderNo">
                    <el-input v-model="formObj.orderNo"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getStockLists, updateStockInfo } from '@/api/fullTrayManage.js'
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
            total: 0,
            dialogVisible: false,
            formObj: {
                currentCode: '',
                orderNo: ''
            },
            rules: [
                {
                    required: true,
                    message: '不能为空'
                }
            ]
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
        handleUpdate(row) {
            this.dialogVisible = true
            var result = JSON.parse(JSON.stringify(row))
            this.formObj = {
                rfid: result.rfid,
                currentCode: result.currentCode,
                orderNo: result.orderNo,
                oldCode: result.currentCode,
                oldOrderNo: result.orderNo,
                meterielCode: result.meterielCode,
                meterielDesc: result.meterielDesc,
                factoryCode: result.factoryCode,
                factoryName: result.factoryName
            }
        },
        submitForm() {
            if (
                (this.formObj.currentCode === '' ||
                    this.formObj.currentCode === null) &&
                (this.formObj.oldCode === '' ||
                    this.formObj.oldCode === null) &&
                (this.formObj.orderNo === '' ||
                    this.formObj.orderNo === null) &&
                (this.formObj.oldOrderNo === '' ||
                    this.formObj.oldOrderNo === null)
            ) {
                this.$message({
                    message: '未做任何修改不能保存！',
                    type: 'warning'
                })
                return
            }

            if (
                (this.formObj.currentCode === '' ||
                    this.formObj.currentCode == null) &&
                (this.formObj.orderNo !== '' && this.formObj.orderNo !== null)
            ) {
                this.$message({
                    message: '第一次喷码绑定不存在，不能绑定交货单号！',
                    type: 'warning'
                })
                return
            }
            updateStockInfo(this.formObj).then(res => {
                this.$message.success('修改成功')
                this.dialogVisible = false
                this.handleList()
            })
        }
    }
}
</script>

<style  lang="scss">
.fullTrayManage {
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
