<template>
    <div class="fullTrayManage">
        <el-form class="searchBar" :inline="true" :model="search">
            <el-form-item label="托盘ID:">
                <el-input v-model="search.rfid"></el-input>
            </el-form-item>
            <el-form-item label="包装喷码:">
                <el-input v-model="search.currentCode"></el-input>
            </el-form-item>
            <el-form-item label="交货单:">
                <el-input v-model="search.orderNo"></el-input>
            </el-form-item>
            <el-form-item label="入库时间:">
                <el-date-picker
                    v-model="search.startTime"
                    type="date"
                    placeholder="选择开始日期"
                    @change="validateEndTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                ></el-date-picker> 至
                <el-date-picker
                    v-model="search.endTime"
                    type="date"
                    placeholder="选择结束日期"
                    @change="validateStartTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    class="searchBtn"
                    @click="handleList"
                    v-if="isShowSearch"
                >搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%" border>
            <el-table-column type="index" label="满托库存清单" align="center">
                <el-table-column type="index" label="序号" width="50"/>
                <el-table-column fixed="left" label="入库时间" prop="initTime" width="200" center />
                <el-table-column label="托盘ID" prop="rfid" width="160" center />
                <el-table-column label="绑定包装喷码" prop="currentCode" width="250" center />
                <el-table-column label="绑定DL交货单" prop="orderNo" width="130" center />
                <el-table-column label="托盘流转状态" prop="rfidStatusName" center />
                <el-table-column label="托盘健康状态" prop="rfidHealthName" center />
                <el-table-column label="最后更新时间" prop="updateTime" width="200" center />
                <el-table-column label="修改人" prop="updateBy" />
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            v-if="isShowUpdate"
                            @click="handleUpdate(scope.row)"
                            :disabled="((parseInt(scope.row.rfidStatus))===3
                                    || (parseInt(scope.row.rfidStatus)===4))"
                        >修改</el-button>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="search.pageNum"
            :page-size="search.pageSize"
            :total="total"
            :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
        <!-- 修改包装喷码和交货单 -->
        <el-dialog title="修改" :visible.sync="dialogVisible" width="30%" center>
            <el-form :model="formObj" ref="formObj" label-width="130px">
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
import { isPermisson } from '@/utils/btnPermission'
export default {
    name:"fulltraymanage",
    data() {
        return {
            tableData: [],
            enum_rfidStatus: DIC.rfidStatus,
            enum_rfidType: DIC.rfidType,
            rfidStatusVal: 0,
            rfidTypeVal: 0,
            total: 0,
            search: {
                currentCode: '',
                rfid: '',
                startTime: '',
                endTime: '',
                pageNum: 1,
                pageSize: 10
            },
            checkedDate: [],
            dialogVisible: false,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },
            formObj: {
                currentCode: '',
                orderNo: ''
            },
            rules: [
                {
                    required: true,
                    message: '不能为空'
                }
            ],
            isShowSearch:true,
            isShowUpdate:true
        }
    },
    components: {},
    created() {
        this.handleList()
        this.isShowSearch = isPermisson("product:full:list")
        this.isShowUpdate = isPermisson("product:full:modify")
    },
    methods: {
        handleCurrentChange(val) {
            this.search.pageNum = val
            this.handleList()
        },
        handleSizeChange(val) {
            this.search.pageSize = val
            this.handleList()
        },
        handleList() {
            getStockLists(this.search).then(res => {
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
                factoryName: result.factoryName,
                bindingTime: result.bindingTime
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
                // ;(this.search.rfid = ''),
                //     (this.search.currentCode = ''),
                //     (this.search.startTime = ''),
                //     (this.search.endTime = ''),
                //     (this.search.pageNum = 1),
                //     (this.search.pageSize = 10)
                this.handleList()
            })
        },
        validateEndTime(val) {
            if (this.search.endTime) {
                if (val > this.search.endTime) {
                    this.$message.error('开始时间不能大于结束时间')
                    this.search.startTime = ''
                }
            }
        },
        validateStartTime(val) {
            if (this.search.startTime) {
                if (val < this.search.startTime) {
                    this.$message.error('结束时间不能小于开始时间')
                    this.search.endTime = ''
                }
            }
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
