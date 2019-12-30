<template>
    <div class="user">
        <div class="search" align="right">
            <el-row :gutter="24" style="margin-top:29px;">
                <el-col :span="12">
                    <div style="margin-left:20px;display:flex;">
                    <el-button
                        style="margin-left:10px;width:80px;height:30px;"
                        @click="add"
                    >新增</el-button>
                    <el-button
                        style="margin-left:10px;width:80px;height:30px;"
                        type="text"
                        @click="deleteUser"
                    >删除</el-button>
                    </div>
                </el-col>
            </el-row>
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
        <el-table :data="tableData" style="width: 100%" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" label="序号" width="70"></el-table-column>
            <el-table-column label="用户名" prop="userName"></el-table-column>
            <el-table-column label="昵称" prop="nickName"></el-table-column>
            <el-table-column label="用户邮箱" prop="email"></el-table-column>
            <el-table-column label="手机号码" prop="phonenumber"></el-table-column>
            <el-table-column label="状态" prop="status"></el-table-column>
            <el-table-column label="操作" width="80" fixed='right'>
                <template slot-scope="scope">
                    <el-button type="text" @click="update(scope.row)">修改</el-button>
                </template>
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

        <!-- 新增用户 -->
    <el-dialog :title="title" :visible.sync="isDialog" :modal-append-to-body="false" :before-close="handleClose" append-to-body :close-on-click-modal="false">
      <el-form :model="userData"  ref="userData" :rules="rules">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="用户昵称" :label-width="formLabelWidth" prop="nickName">
               <el-input v-model="userData.nickName" placeholder="请输入用户昵称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phonenumber"> 
                <el-input v-model="userData.phonenumber" placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
               <el-input v-model="userData.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
          </el-col>
        <el-col :span="12">
            <el-form-item label="用户名称" :label-width="formLabelWidth" prop="userName">
               <el-input v-model.number="userData.userName" placeholder="请输入用户名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
                <el-select
                    v-model="userData.sex"
                    placeholder="请选择性别"
                >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        @click.native="selectSex(item)"
                    ></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" :label-width="formLabelWidth" prop="sex">
                <el-radio v-model="userData.status" label="0" @change="change()">正常</el-radio>
                <el-radio v-model="userData.status" label="1" @change="change()">停用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="角色" :label-width="formLabelWidth" prop="roleIds">
               
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
               <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="userData.remarks">
                </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="margin-left:30%;">
            <el-row :gutter="24" style="margin-top:29px;">
                <el-col :span="12">
                    <div style="margin-left:20px;display:flex;">
                    <el-button
                        style="width:80px;height:30px;"
                        @click="confirm"
                    >确定</el-button>
                    <el-button
                        style="margin-left:100px;width:80px;height:30px;"
                        type="text"
                        @click="cancel"
                    >取消</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
      </el-form>
    </el-dialog>
    </div>
</template>

<script>
import { getUserLists } from '@/api/user.js'
import DIC from '@/api/dic.js'
export default {
    data() {
        return {
            rules:{

            },
            tableData: [],
            enum_rfidStatus: DIC.rfidStatus,
            enum_rfidType: DIC.rfidType,
            rfidStatusVal: 0,
            rfidTypeVal: 0,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            selectData:[],
            isDialog:false,
            formLabelWidth:"150px",
            userData:{

            },
            options:[
                {label:"男",value:"0"},
                {label:"女",value:"1"}
            ],
            type:''
        }
    },
    components: {},
    computed:{
        title(){
            if(this.type=='add') return "新增用户"
            else if(this.type=='update') return "修改用户"
        }
    },
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
            getUserLists({}).then(res => {
                console.log(res)
                this.tableData = res.data.rows
                this.total = res.data.total
            })
        },
        searchByTypeAndStatus() {
            this.handleList()
        },
        update(row){
            this.userData=row
            this.type='update'
            this.isDialog=true
        },
        add(){
            this.type='add'
            this.isDialog=true
        },
        handleSelectionChange(val){
            this.selectData=val
        },
        handleClose(){
            this.isDialog=false
        },
        deleteUser(){
            if(this.selectData.length<1){
                this.$message({type: 'warning',message: '请至少选择一条数据'});   
                return;
            }
            this.$confirm('确定要删除选定的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
            
            }).catch(() => {
                this.$message({type: 'info',message: '已取消删除'});          
            });
        },
        change(){

        },
        selectSex(item){
                
        },
        confirm(){
            this.isDialog=false
        },
        cancel(){
            this.isDialog=false
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
