<template>
    <div class="user">
        <div class="search" align="right">
            <el-row :gutter="24" style="margin-top:29px;">
                <el-col :span="12">
                    <div style="margin-left:20px;display:flex;">
                    <el-button
                        style="margin-left:10px;width:80px;height:30px;"
                        @click="add"
                        v-if='isShowAdd'
                    >新增</el-button>
                    <el-button
                        style="margin-left:10px;width:80px;height:30px;"
                        type="text"
                        @click="deleteRole"
                        v-if='isShowRemove'
                    >删除</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-form :inline="true" class="searchBar">
                <el-form-item label="角色名称:">
                    <el-input v-model="searchObj.roleName" clearable></el-input>
                </el-form-item>
                <el-form-item label="权限字符:">
                    <el-input v-model="searchObj.roleKey" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        class="searchBtn"
                        @click="search"
                        v-if='isShowSearch'
                    >搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" style="width: 100%" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" label="序号" width="70"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="权限字符" prop="roleKey"></el-table-column>
            <el-table-column label="显示顺序" prop="roleSort"></el-table-column>
            <el-table-column label="状态" prop="status">
                <template slot-scope="scope">
                   {{getStatus(scope.row.status)}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed='right'>
                <template slot-scope="scope">
                    <el-button type="text" @click="update(scope.row)" v-if='isShowUpdate'>修改</el-button>
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
        <!-- 新增角色 -->
        <el-dialog :title="title" :visible.sync="isDialog" :modal-append-to-body="false" :before-close="cancel" append-to-body :close-on-click-modal="false">
            <el-form :model="roleData"  ref="roleData" :rules="rules">
                <el-row :gutter="24">
                    <el-col :span="20">
                        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
                        <el-input v-model="roleData.roleName" placeholder="请输入用户昵称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="20">
                        <el-form-item label="权限字符" :label-width="formLabelWidth" prop="roleKey">
                            <el-input v-model="roleData.roleKey" placeholder="请输入权限字符"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="20">
                        <el-form-item label="角色顺序" :label-width="formLabelWidth" prop="roleSort">
                            <el-input-number v-model="roleSort" @change="handleChange" :min="1" :max="100" label="描述文字"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="20">
                        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
                            <el-radio v-model="status" label="0" @change="change()">正常</el-radio>
                            <el-radio v-model="status" label="1" @change="change()">停用</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="20">
                        <el-form-item label="菜单权限" :label-width="formLabelWidth" prop="menuIds">
                            <el-tree 
                            :data="menuList" 
                            show-checkbox
                            :props="defaultProps" 
                            :default-expanded-keys="expandedList"
                            :default-checked-keys="checkedList"
                            node-key="menuId" 
                            @node-click="handleNodeClick"
                            empty-text="暂无数据"
                            ref="tree"
                            >
                            <span class="custom-tree-node" slot-scope="{ node, data }" :class='[data.orgCode==menuId?"custom-tree-node1":"custom-tree-node"]'>
                                <span>{{ node.label }}</span>
                            </span>
                            </el-tree>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
                        <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="roleData.remarks">
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
import { getRoleList ,getMenuList,addRole,deleteRole,updateRole} from '@/api/role.js'
import http from '@/config/httpConfig.js'
import DIC from '@/api/dic.js'
import { isPermisson } from '@/utils/btnPermission'
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
            type:'',
            roleData:{
                
            },
            isDialog:false,
            formLabelWidth:"150px",
            type:"",
            menuList:[],
            defaultProps: {
                children: 'children',
                label: 'menuName'
            },
            treeData:{},
            menuId:"",
            expandedList:[],
            checkedList:[],
            selectData:[],
            searchObj:{
                roleName:"",
                roleKey:"",
                pageNum:1,
                pageSize:10,
                total:0
            },
            isShowAdd:true,
            isShowRemove:true,
            isShowSearch:true,
            isShowUpdate:true,
            status:"0",
            roleSort:1
        }
    },
    components: {},
    computed:{
        title(){
            if(this.type=='add') return "新增角色"
            else if(this.type=='update') return "修改角色"
        }
    },
    created() {
        this.search()
        this.getList()
        this.isShowAdd = isPermisson("system:role:add")
        this.isShowRemove = isPermisson("system:role:remove")
        this.isShowSearch = isPermisson("system:role:query")
        this.isShowUpdate = isPermisson("system:role:edit")
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
            getRoleList(this.searchObj).then(res => {
                this.tableData = res.data.rows
                this.searchObj.total = res.data.total
            })
        },
        searchByTypeAndStatus() {
            this.search()
        },
        add(){
            this.roleSort = 1
            this.roleData={}
            this.isDialog=true
            if(this.$refs.tree){
                this.$refs.tree.setCheckedKeys([])
            }
            this.type="add"
        },
        //获取菜单列表
        getList(){
            getMenuList().then(res=>{
                this.menuList=res.data.data
            })
        },
        deleteRole(){
            if(this.selectData.length<1){
                this.$message({type: 'warning',message: '请至少选择一条数据'});   
                return;
            }
            this.$confirm('确定要删除选定的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.roleData.roleIds = ""
                for(let i=0;i<this.selectData.length;i++){
                    this.roleData.roleIds+=this.selectData[i].roleId+","
                }
                http.delete("/system/role/"+this.roleData.roleIds).then(res=>{
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
        update(row){
            this.roleData=row
            this.status = row.status
            this.roleSort = row.roleSort
            http.get('system/menu/roleMenuTreeselect/'+row.roleId).then(res=>{
                this.checkedList = []
                if(this.$refs.tree){
                    this.$refs.tree.setCheckedKeys([])
                }
                for(let i=0;i<res.data.data.length;i++){
                    this.checkedList.push(res.data.data[i])
                }
                this.type="update"
                this.isDialog=true
            })
        },
        confirm(){
            this.roleData.roleSort = this.roleSort
            this.roleData.status = this.status
            this.roleData.menuIds = []
            for(let i=0;i<this.$refs.tree.getCheckedNodes(false,true).length;i++){
                 this.roleData.menuIds.push(this.$refs.tree.getCheckedNodes(false,true)[i].menuId)
            }
            if(this.type=='add'){
                addRole(this.roleData).then(res=>{
                    if(res.status=='200'){
                        this.$message({type: 'success',message: '新增成功'});  
                        this.search()
                        this.isDialog=false
                    }else{
                        this.$message({type: 'warning',message: res.data.msg});  
                    }
                })
            }else if(this.type == "update"){
                updateRole(this.roleData).then(res=>{
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
            // this.$refs.roleData.resetFields()
            this.search()
            this.isDialog=false
        },
        handleChange(){
            this.roleData.roleSort = this.roleSort
        },
        change(){
            this.roleData.status = this.status
        },
        handleNodeClick(data){
           
        },
        handleSelectionChange(val){
            this.selectData=val
        },
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

.el-input-number .el-input-number__decrease, .el-input-number .el-input-number__increase{
        height: 37px !important;
    }
</style>
