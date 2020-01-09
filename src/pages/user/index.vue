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
                <el-form-item label="手机号码:">
                    <el-input v-model="searchObj.phonenumber" clearable></el-input>
                </el-form-item>
                <el-form-item label="用户名:">
                    <el-input v-model="searchObj.userName" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        class="searchBtn"
                        @click="search"
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
            <el-table-column label="状态" prop="status">
                <template slot-scope="scope">
                   {{getStatus(scope.row.status)}}
                </template>
            </el-table-column>
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
            :current-page="searchObj.pageNum"
            :page-size="searchObj.pageSize"
            :total="searchObj.total"
            :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>

        <!-- 新增用户 -->
    <el-dialog :title="title" :visible.sync="isDialog" :modal-append-to-body="false" :before-close="handleClose" append-to-body :close-on-click-modal="false">
      <el-form :model="userData"  ref="userData" :rules="rules">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="用户昵称" :label-width="formLabelWidth" prop="userName">
               <el-input v-model="userData.userName" placeholder="请输入用户昵称"></el-input>
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
            
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="用户名称" :label-width="formLabelWidth" prop="nickName">
               <el-input v-model.number="userData.nickName" placeholder="请输入用户名称" :disabled="isAdmin"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" :label-width="formLabelWidth" prop="password" v-if = !isAdmin>
               <el-input v-model.number="userData.password" placeholder="请输入密码" type='password'></el-input>
            </el-form-item>
          </el-col>
          
        </el-row>
        <el-row :gutter="24">
            <el-col :span="12">
            <el-form-item label="状态" :label-width="formLabelWidth" prop="sex">
                <el-radio v-model="userData.status" label="0" @change="change()">正常</el-radio>
                <el-radio v-model="userData.status" label="1" @change="change()">停用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="20">
            <el-form-item label="角色" :label-width="formLabelWidth" prop="roleIds">
               <el-checkbox-group v-model="checkedRoles" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="item in roleList" :label="item.roleId" :key="item.roleId">{{item.roleName}}</el-checkbox>
                </el-checkbox-group>
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
import { getUserLists ,addUser,deleteUsers,updateUsers} from '@/api/user.js'
import http from '@/config/httpConfig.js'
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
            type:'',
            roleList:[],
            checkedRoles:[],
            isAdmin:false,
            searchObj:{
                phonenumber:"",
                userName:"",
                pageNum:1,
                pageSize:10,
                total:0
            }
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
        this.search()
        this.getRoleList()
    },
    methods: {
        getStatus(row){
            if(row == '0') return "正常"
            else if(row == '1') return "停用"
        },
        handleCurrentChange(val) {
            this.searchObj.pageNum = val
            this.search()
        },
        handleSizeChange(val) {
            this.searchObj.pageSize = val
            this.search()
        },
        search(){
            getUserLists(this.searchObj).then(res => {
                this.tableData = res.data.rows
                this.searchObj.total = res.data.total
            })
        },
        searchByTypeAndStatus() {
            this.search()
        },
        update(row){
            if(row.nickName=="管理员"){
                this.isAdmin = true
            }else{
                this.isAdmin = false
            }
            this.userData=row
            http.get("system/user/"+this.userData.userId).then(res=>{
                this.checkedRoles = []
                for(let i=0;i<res.data.roleIds.length;i++){
                    this.checkedRoles.push(res.data.roleIds[i])
                }
                this.isDialog=true
                this.type='update'
            })
        },
        //获取角色列表
        getRoleList(){
            http.get("/system/role/optionselect",{}).then(res=>{
                this.roleList=res.data.data
            })
        },
        add(){
            this.userData={}
            this.checkedRoles=[]
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
                this.userData.userIds = ""
                for(let i=0;i<this.selectData.length;i++){
                    this.userData.userIds+=this.selectData[i].userId+","
                }
                http.delete("/system/user/"+this.userData.userIds).then(res=>{
                    if(res.status=='200'){
                        this.$message({type: 'success',message: '删除成功'});
                        this.search()
                    }else{
                        this.$message({type: 'warning',message: res.data.msg});    
                    }
                })
            }).catch(() => {
                this.$message({type: 'info',message: '已取消删除'});          
            });
        },
        change(){

        },
        selectSex(item){
                
        },
        confirm(){
            this.userData.roleIds=[]
            for(let i=0;i<this.checkedRoles.length;i++){
                this.userData.roleIds.push(this.checkedRoles[i])
            }
            if(this.type=='add'){
                addUser(this.userData).then(res=>{
                    if(res.status=='200'){
                        this.$message({type: 'success',message: '新增成功'});  
                        this.search()
                        this.isDialog=false
                    }else{
                        this.$message({type: 'warning',message: res.data.msg});  
                    }
                })
            }else{
                updateUsers(this.userData).then(res=>{
                    if(res.status=='200'){
                        this.$message({type: 'success',message: '修改成功'});  
                        this.search()
                        this.isDialog=false
                    }else{
                        this.$message({type: 'warning',message: res.data.msg});  
                    }
                })
            }
            
        },
        cancel(){
            this.isDialog=false
        },
        handleCheckedCitiesChange(){
            
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
