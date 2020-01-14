<template>
    <div class>
        <el-form class="searchBar" :inline="true" :model="formObj">
            <el-form-item label="生产线:">
                <el-select v-model="formObj.lineId" placeholder="请选择" @change="getPrinterRules">
                    <el-option
                        v-for="item in productLineLists"
                        :key="item.Z_ID"
                        :label="item.Z_Stock"
                        :value="item.Z_ID"
                        @click.native="changeZ_ID(item)"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="品种:">
                <el-input v-model="formObj.type" readonly></el-input>
            </el-form-item>
            <el-form-item label="包装方式:">
                <el-input v-model="formObj.packageType" readonly></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    v-if="!isStart && isShowStart"
                    @click="startCreateCode"
                    type="danger"
                    icon="el-icon-video-play" 
                >开始计数</el-button>
                <el-button v-if="isStart && isShowEnd" @click="endCreateCode" icon="el-icon-video-pause">停止计数</el-button>
            </el-form-item>
        </el-form>

        <el-row>
            <el-col :span="8">
                <div class="machineStatus">
                    <p class="tip">喷码机状态</p>
                    <div>
                        <p>当前喷码</p>
                        <p>{{inkjetPrinter.currentCode}}</p>
                        <p>
                            <el-button type="danger" @click="openDialog" v-if="isShowCurrent">修改</el-button>
                        </p>
                    </div>
                    <div>
                        <p>已喷袋数</p>
                        <p>{{inkjetPrinter.currentNumber}}</p>
                        <p>
                            <el-button type="danger" @click="openDialog2" v-if="isShowUpdateNum">修改</el-button>
                        </p>
                    </div>
                    <div>
                        <p>喷码规则</p>
                        <p>{{rule|validateRule}}</p>
                        <p>
                            <el-button type="danger" @click="openDialog3" v-if="isupdateRule">更新</el-button>
                        </p>
                    </div>
                    <div>
                        <p>喷码更新</p>
                        <p>40</p>
                        <p></p>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="machineStatus">
                    <p class="tip">码垛机状态</p>
                    <div>
                        <p>当前码垛</p>
                        <p></p>
                        <p>
                            <el-button type="danger" disabled>修改</el-button>
                        </p>
                    </div>
                    <div>
                        <p>已生产</p>
                        <p></p>
                        <p></p>
                    </div>
                    <div>
                        <p>计划生产</p>
                        <p></p>
                        <p>
                            <el-button type="danger" disabled>停机</el-button>
                        </p>
                    </div>
                    <div>
                        <p>码垛规格</p>
                        <p></p>
                        <p>
                            <el-button type="danger" disabled>启动</el-button>
                        </p>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="bindStatus">
                    <p class="tip">一次绑定状态</p>
                    <div>
                        <p>绑定托盘</p>
                        <p>{{bindObj.rfid}}</p>
                    </div>
                    <div>
                        <p>绑定喷码</p>
                        <p>{{bindObj.currentCode}}</p>
                    </div>
                    <div>
                        <p>绑定结果</p>
                        <p>{{bindObj.total!==''?'成功':''}}</p>
                    </div>
                    <div>
                        <p>完成绑定</p>
                        <p>{{bindObj.total}}</p>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div class="searchTip">
            <p class="tip">今日托盘生产日志</p>
            <div>
                <el-date-picker
                    v-model="search.startTime"
                    type="date"
                    placeholder="选择开始日期"
                    @change="validateEndTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>至
                <el-date-picker
                    v-model="search.endTime"
                    type="date"
                    placeholder="选择结束日期"
                    @change="validateStartTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>
                <el-button type="danger" @click="handleLists" v-if="firstBindList">查询</el-button>
            </div>
        </div>
        <el-table :data="tableData" border style="width: 100%" height="550">
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="create_time" label="生产日期"></el-table-column>
            <el-table-column prop="rfid" label="托盘ID"></el-table-column>
            <el-table-column prop="current_code" label="包装喷码"></el-table-column>
            <el-table-column prop="rfid_status" label="状态" :formatter="formatter"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" @click="openDialog4(scope.row)">修改</el-button>
                    <el-button type="danger" @click="openDialog5(scope.row)">报废</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="search.pageNum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="search.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
        <!-- 喷码修改 -->
        <el-dialog title="当前喷码修改" :visible.sync="dialogVisible" width="30%" center>
            <el-form :model="formObj2" label-width="80px">
                <el-form-item label="当前喷码:">
                    <el-input v-model="formObj2.currentCode" maxlength="18"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updatePrinterCode">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 已喷袋数 -->
        <el-dialog title="当前已喷袋数" :visible.sync="dialogVisible2" width="30%" center>
            <el-form :model="formObj3" label-width="80px">
                <el-form-item label="已喷袋数:">
                    <el-input v-model="formObj3.currentNumber"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="updatePrinterNumber">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 喷码规则 -->
        <el-dialog title="更新喷码规则" :visible.sync="dialogVisible3" width="30%" center>
            <el-form :model="formObj4" label-width="100px">
                <el-form-item label="喷码规则:" prop="customRule" :rules="rules">
                    <el-row>
                        <el-col :span="5"><el-tag type="info">{{formObj4.rule.substring(0,6)}}</el-tag> +</el-col>
                        <el-col :span="4"><el-tag type="info">{{formObj4.rule.substring(6,10)}}</el-tag> +</el-col>
                        <el-col :span="12">
                            <el-input  v-model="formObj4.customRule"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible3 = false">取 消</el-button>
                <el-button type="primary" @click="updateRule">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改包装喷码 -->
        <el-dialog title="更新包装喷码" :visible.sync="dialogVisible4" width="30%" center>
            <el-form :model="formObj5">
                <el-form-item label="包装喷码:" label-width="80px">
                    <el-input v-model="formObj5.currentCode" maxlength="18"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible4 = false">取 消</el-button>
                <el-button type="primary" @click="updateCode">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 报废理由 -->
        <el-dialog title="托盘报废" :visible.sync="dialogVisible5" width="30%" center>
            <el-form :model="formObj6" ref="formObj6" label-width="140px">
                <el-form-item label="托盘报废理由:" prop="remark" :rules="rules2">
                    <el-input type="textarea" :rows="3" v-model="formObj6.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible5=false">取 消</el-button>
                <el-button type="primary" @click="addReason">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getProductLineLists,
    getInkjetPrinterInfo,
    getRules,
    getBindInfo,
    getLogs,
    updateCurrentCode,
    updateCurrentNumber,
    updateRule,
    updateBindInfo,
    addReason,
    startSchedule,
    endSchedule,
    getStatus
} from '@/api/index'
import { isPermisson } from '@/utils/btnPermission'
import { mapState } from 'vuex'
export default {
    components: {},
    data() {
        var validateRule = (rule, value, callback) => {
            var reg = /^[A-Za-z0-9]{1,5}$/
            if (!reg.test(value)) {
                callback(new Error('格式不正确'))
            } else {
                callback()
            }
        }
        return {
            productLineLists: [],
            formObj: {
                lineId: '',
                type: '',
                packageType: ''
            },
            inkjetPrinter: {
                currentCode: '',
                currentNumber: ''
            },
            bindObj: {
                total: '',
                currentCode: '',
                rfid: ''
            },
            rule: '',
            tableData: [],
            search: {
                pageNum: 1,
                pageSize: 10,
                startTime: '',
                endTime: ''
            },
            total: 0,
            time: [],
            dialogVisible: false,
            dialogVisible2: false,
            dialogVisible3: false,
            dialogVisible4: false,
            dialogVisible5: false,
            formObj2: { currentCode: '' },
            formObj3: { currentNumber: '' },
            formObj4: {
                rule: '',
                customRule: ''
            },
            rules: [
                {
                    required: true,
                    message: '规则不能为空'
                },
                {
                    min: 1,
                    max: 5,
                    message: '最短1位最多5位长度'
                },
                {
                    validator: validateRule
                }
            ],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },
            formObj5: { rfid: '', currentCode: '' },
            formObj6: { rfid: '', remark: '' },
            rules2: [
                {
                    required: true,
                    message: '规则不能为空'
                }
            ],
            isStart: false,
            timeInterval: '',
            isShowStart:true,
            isShowEnd:true,
            isShowCurrent:true,
            isupdateRule:true,
            firstBindList:true,
            isShowUpdateNum:true,
            z_id:"",
            flag:false
        }
    },
    computed: {
        isclear:{
            get(){
                return this.$store.state.tagsView.isclear
            },
            set(val){
                this.$store.state.tagsView.isclear = val
            }
        },

    },
    filters: {
        validateRule(value) {
            if (!value) {
                return
            }
            let year = value.substring(0, 6)
            let code = value.substring(6, 10)
            let myNum = value.substring(10)
            return `${year}+${code}+${myNum}+流水号`
        }
    },
    methods: {
        // 开始生成喷码
        startCreateCode() {
            startSchedule({
                zId: this.formObj.lineId
            }).then(res => {
                this.$message.success('开始喷码')
                this.isStart = true
                this.checkType()
            })
        },
        // 结束生成喷码
        endCreateCode() {
            endSchedule({}).then(res => {
                this.$message.success('结束喷码')
                this.isStart = false
                this.checkType()
            })
        },
        // 获取生产线
        getProductLine() {
            getProductLineLists().then(res => {
                this.productLineLists = res.data.data
                this.formObj = {
                    lineId: res.data.data[3].Z_ID,
                    type: res.data.data[3].Z_Stock,
                    packageType: res.data.data[3].Z_PeerWeight
                }
                if (this.formObj.packageType !== 0) {
                    this.formObj.packageType += 'kg包装'
                } else {
                    this.formObj.packageType = '散装'
                }
                this.getPrinterRules()
            })
        },
        // 获取喷码信息
        getInkjetPrinterInfo() {
            getInkjetPrinterInfo().then(res => {
                this.inkjetPrinter = res.data.data
            })
        },
        // 获取喷码规则
        getPrinterRules() {
            this.z_id=this.formObj.lineId
            getRules({
                zId: this.formObj.lineId
            }).then(res => {
                this.rule = res.data.data
            })
        },
        // 获取绑定信息
        getBindInfo() {
            getBindInfo().then(res => {
                if (
                    res.data.data.rfidBindSpurtcode !== null &&
                    res.data.data.total !== 0
                ) {
                    this.bindObj = {
                        total: res.data.data.total,
                        rfid: res.data.data.rfidBindSpurtcode.rfid,
                        currentCode: res.data.data.rfidBindSpurtcode.currentCode
                    }
                }
            })
        },
        handleLists() {
            // this.search.startTime = this.time[0]
            // this.search.endTime = this.time[1]
            // console.log(this.search)
            getLogs(this.search).then(res => {
                this.tableData = res.data.rows
                this.total = res.data.total
            })
        },
        openDialog() {
            this.formObj2 = JSON.parse(JSON.stringify(this.inkjetPrinter))
            this.dialogVisible = true
        },
        // 更新喷码
        updatePrinterCode() {
            updateCurrentCode({
                currentSpurtcode: this.formObj2.currentCode
            }).then(res => {
                this.dialogVisible = false
                this.getInkjetPrinterInfo()
                this.$message.success('修改成功')
            })
        },
        openDialog2() {
            this.formObj3 = JSON.parse(JSON.stringify(this.inkjetPrinter))
            this.dialogVisible2 = true
        },
        // 更新包数
        updatePrinterNumber() {
            updateCurrentNumber({
                currentNumber: this.formObj3.currentNumber
            }).then(res => {
                this.dialogVisible2 = false
                this.getInkjetPrinterInfo()
                this.$message.success('修改成功')
            })
        },
        openDialog3() {
            this.dialogVisible3 = true
            this.formObj4 = {
                rule: this.rule,
                customRule: this.rule.substring(10)
            }
            console.log(this.formObj4)
        },
        // 更新规则
        updateRule() {
            updateRule({
                prefixRule: this.formObj4.customRule,
                zId: this.formObj.lineId
            }).then(res => {
                this.rule = res.data.data
                // this.dialogVisible3 = true
                this.$message.success('修改成功')
                this.dialogVisible3 = false
            })
        },
        formatter(row, column) {
            return '满托'
        },
        openDialog4(row) {
            var result = JSON.parse(JSON.stringify(row))
            this.formObj5 = {
                rfid: result.rfid,
                currentCode: result.current_code
            }
            this.dialogVisible4 = true
        },
        // 更新已有的code
        updateCode() {
            updateBindInfo({
                rfid: this.formObj5.rfid,
                currentCode: this.formObj5.currentCode
            }).then(res => {
                this.$message.success('修改成功')
                this.handleLists()
                this.dialogVisible4 = false
            })
        },
        openDialog5(row) {
            this.dialogVisible5 = true
            this.formObj6.rfid = row.rfid
        },
        // 报废理由
        addReason() {
            this.$refs.formObj6.validate(valid => {
                if (valid) {
                    console.log(this.formObj6)
                    addReason(this.formObj6).then(res => {
                        this.$message.success('修改成功')
                        this.handleLists()
                        this.dialogVisible5 = false
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleSizeChange(val) {
            this.search.pageSize = val
            this.handleLists()
        },
        handleCurrentChange(val) {
            this.search.pageNum = val
            this.handleLists()
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
        },
        changeZ_ID(item){
            if(item.Z_ID == this.z_id){
                
            }else{
                this.endCreateCode()
            }
        },
        //查看喷码机状态
        checkType(){
            getStatus().then(res=>{
                this.flag = res.data.data
                console.log(this.flag)
                if(this.flag){
                    this.isStart=true
                }else{
                     this.isStart=false
                }
            })
        }
    },
    created() {
        this.getProductLine()
        this.getInkjetPrinterInfo()
        this.getBindInfo()
        var now = new Date()
        var year = now.getFullYear()
        var month = now.getMonth() + 1
        var day = now.getDate()
        month = month.toString().padStart(2, '0')
        day = day.toString().padStart(2, '0')
        this.search.startTime = `${year}-${month}-${day}`
        this.search.endTime = `${year}-${month}-${day}`
        this.handleLists()
        this.getInkjetPrinterInfo()
        this.getBindInfo()
    },
    watch: {
        isStart(val) {
            if (val) {
                var that = this
                this.isclear = setInterval(function() {
                    that.getInkjetPrinterInfo()
                    that.getBindInfo()
                }, 1000)
            } else {
                window.clearInterval(this.isclear)
            }
        }
    },
    mounted() {
        this.checkType()
        this.isShowStart = isPermisson("start")
        this.isShowEnd = isPermisson("end")
        this.isShowCurrent = isPermisson("updateCurrent")
        this.isShowUpdateNum = isPermisson("updateNum")
        this.isupdateRule = isPermisson("updateRule")
        this.firstBindList = isPermisson("firstBindList")
    }
}
</script>
<style lang='scss'>
.machineStatus,
.bindStatus {
    display: flex;
    flex-direction: column;
    .tip {
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-weight: bold;
        background-color: #f4f4f4;
        border: #bebebe 1px solid;
    }
    > div {
        display: flex;
        flex-direction: row;
        // flex-wrap: nowrap;
        align-items: center;
        height: 60px;
        line-height: 60px;
        border: #bebebe 1px solid;
        background-color: #f4f4f4;
        & > p:nth-child(1) {
            flex: 1;
            text-align: center;
        }
        & > p:nth-child(2) {
            flex: 2;
            height: 100%;
            text-align: center;
            background-color: white;
            border-color: #bebebe;
            border-width: 0 1px;
            border-style: solid;
        }
        & > p:nth-child(3) {
            flex: 1;
            text-align: center;
        }
    }
}
</style>
