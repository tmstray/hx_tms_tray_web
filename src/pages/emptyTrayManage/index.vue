<template>
    <div class="emptyTrayManage">
        <el-button type="primary" @click="openDialog3">初始化</el-button>
        <el-table :data="tableData" style="width: 100%" border>
            <el-table-column type="index" label="空托库存清单" align="center">
                <el-table-column type="index" label="序号" width="50" align="center" />
                <el-table-column label="入库时间" prop="initTime" align="center" />
                <el-table-column label="托盘ID" prop="rfid" align="center" />
                <el-table-column label="托盘流转状态" prop="rfidStatusName" align="center" />
                <el-table-column label="托盘健康状态" prop="rfidHealthName" align="center" />
                <el-table-column label="最后更新时间" prop="updateTime" align="center" />
                <el-table-column label="修改人" prop="updateBy" align="center" />
                <el-table-column label="操作" fixed="right" align="center" width="262">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="openDialog(scope.row)">报损</el-button>
                        <el-button type="primary" @click="openDialog2(scope.row)">报废</el-button>
                        <el-button type="primary" @click="forzenRowFun(scope.row)">冻结</el-button>
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
        <!-- 报损 -->
        <el-dialog title="报损" :visible.sync="dialogVisible" width="50%" center>
            <el-form ref="form" :model="formObj">
                <el-form-item label="报损原因" props="remarks" :rules="rules">
                    <el-input v-model="formObj.remarks" maxlength="50"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="reportLoss">保存</el-button>
            </span>
        </el-dialog>
        <!-- 报废 -->
        <el-dialog title="报废" :visible.sync="dialogVisible2" width="50%" center>
            <el-form ref="form" :model="formObj2">
                <el-form-item label="报废原因" props="remarks" :rules="rules">
                    <el-input v-model="formObj2.remarks" maxlength="50"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="reportFee">保存</el-button>
            </span>
        </el-dialog>

        <el-dialog title="初始化" :visible.sync="dialogVisible3" width="30%" center>
            <p>导入文件</p>
            <el-upload
                class="upload-demo"
                ref="upload"
                :action="url"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :limit="1"
                :file-list="fileList"
                :auto-upload="false"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            >
                <img src="@/assets/image/upload.png" alt />
                <div slot="tip" class="el-upload__tip">请点击从我的电脑中选择要导入的文件</div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible3 = false">取 消</el-button>
                <el-button type="primary" @click="uploadExcel">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getStockLists,
    scrapOrLossTrayInfo,
    forzenRow
} from '@/api/emptyTrayManage.js'
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
            dialogVisible2: false,
            url: '/trayInfo/importData',
            fileList: [],
            rules: [
                {
                    required: true,
                    message: '不能为空'
                }
            ],
            formObj: {
                rfid: ''
            },
            formObj2: {
                rfid: ''
            },
            dialogVisible3: false
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
        handleUpdate() {},
        submitForm() {
            this.dialogVisible = false
        },
        submitForm2() {
            this.dialogVisible2 = false
        },
        openDialog3() {
            this.dialogVisible3 = true
        },
        handleSuccess(response, file, fileList) {
            if (response.code !== 200) {
                this.$message.error(response.msg)

                return
            }
            this.$message.success(response.msg)
            this.dialogVisible3 = false
        },
        handleRemove(file, fileList) {
            this.fileList = []
        },
        uploadExcel() {
            this.$refs.upload.submit()
            this.handleList()
        },
        openDialog(row) {
            if (parseInt(row.rfidHealth) === 1) {
                this.$message({
                    message: '已经是报损状态，不能重复报损',
                    type: 'warning'
                })
            } else {
                this.dialogVisible = true
                this.formObj.rfid = row.rfid
            }
        },
        reportLoss() {
            scrapOrLossTrayInfo({
                rfid: this.formObj.rfid,
                rfidHealth: 1,
                remarks: this.formObj.remarks
            }).then(res => {
                this.$message.success('报损操作成功！')
                this.dialogVisible = false
            })
            this.handleList()
        },
        openDialog2(row) {
            if (parseInt(row.rfidHealth) === 2) {
                // this.$message.error('已经是报损状态，不能重复报损')
                this.$message({
                    message: '已经是报废状态，不能重复报废',
                    type: 'warning'
                })
            } else {
                this.dialogVisible2 = true
                this.formObj2.rfid = row.rfid
            }
        },
        reportFee() {
            scrapOrLossTrayInfo({
                rfid: this.formObj2.rfid,
                rfidHealth: 2,
                remarks: this.formObj.remarks
            }).then(res => {
                this.$message.success('报废操作成功！')
                this.dialogVisible2 = false
            })
            this.handleList()
        },
        forzenRowFun(row) {
            if (parseInt(row.rfidHealth) === 3) {
                this.$message.error('此托盘已被冻结，不能重复执行冻结操作！')
                return
            }
            this.$confirm('是否确认执行冻结操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                forzenRow({
                    rfid: row.rfid,
                    factoryCode: row.factoryCode
                }).then(res => {
                    this.$message.success('冻结托盘操作成功！')
                    this.handleList()
                })
            })
        }
    }
}
</script>

<style  lang="scss">
.emptyTrayManage {
    .search {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .el-select {
            margin-right: 20px;
        }
    }
    .el-upload {
        display: block;
    }
    .el-upload__tip {
        text-align: center;
    }
}
</style>
