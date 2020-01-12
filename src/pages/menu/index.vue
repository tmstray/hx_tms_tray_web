<template>
    <div class="user">
        <div class="search" align="right">
            <el-row :gutter="24" style="margin-top:29px;">
                <el-col :span="12">
                    <div style="margin-left:20px;display:flex;">
                    <el-button
                        style="margin-left:10px;width:80px;height:30px;"
                        @click="add"
                        v-if ='isShowAdd'
                    >新增</el-button>
                    <el-button
                        style="margin-left:10px;width:80px;height:30px;"
                        type="text"
                        @click="deleteMenu"
                        v-if='isShowRemove'
                    >删除</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-form :inline="true" class="searchBar">
                <el-form-item label="菜单名称:">
                    <el-input v-model="searchObj.menuName" clearable @clear="clear"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        class="searchBtn"
                        @click="search"
                        v-if ='isShowSearch'
                    >搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table 
        :data="tableData" 
        style="width: 100%" 
        border
        row-key="menuId"
        @selection-change="handleSelectionChange"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" label="序号" width="70"></el-table-column>
            <el-table-column label="菜单名称" prop="menuName"></el-table-column>
            <el-table-column label="图标" prop="icon"></el-table-column>
            <el-table-column label="排序" prop="orderNum"></el-table-column>
            <!-- <el-table-column label="可见" prop="visible"></el-table-column> -->
            <el-table-column label="操作" width="80" fixed='right'>
                <template slot-scope="scope">
                    <el-button type="text" @click="update(scope.row)" v-if='isShowUpdate'>修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <!-- 新增菜单 -->
        <el-dialog :title="title" :visible.sync="isDialog" :modal-append-to-body="false" :before-close="cancel" append-to-body :close-on-click-modal="false">
            <el-form :model="menuData"  ref="menuData" :rules="rules">
                <el-row :gutter="24">
                    <el-col :span="20">
                        <el-form-item label="上级菜单" :label-width="formLabelWidth" prop="parentName">
                            <el-input v-model="menuData.parentName" placeholder="请输入上级菜单" @focus="focus1()"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="20">
                        <el-form-item label="菜单类型" :label-width="formLabelWidth" prop="menuType">
                            <el-radio-group v-model="menuType">
                                <el-radio :label="'M'" @change="change()">目录</el-radio>
                                <el-radio :label="'C'" @change="change()">菜单</el-radio>
                                <el-radio :label="'F'" @change="change()">按钮</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="20">
                        <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="menuName">
                            <el-input v-model="menuData.menuName" placeholder="请输入菜单名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-if="menuType=='C'">
                    <el-col :span="20">
                        <el-form-item label="请求地址" :label-width="formLabelWidth" prop="path">
                            <el-input v-model="menuData.path" placeholder="请输入请求地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-if="menuType=='C'">
                    <el-col :span="20">
                        <el-form-item label="是否外链" :label-width="formLabelWidth" prop="isFrame">
                            <el-radio v-model="menuData.isFrame" label="0" @change="change2()">是</el-radio>
                            <el-radio v-model="menuData.isFrame" label="1" @change="change2()">否</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-if="menuType=='C' || menuType == 'F'">
                    <el-col :span="20">
                        <el-form-item label="权限标识" :label-width="formLabelWidth" prop="perms">
                            <el-input v-model="menuData.perms" placeholder="请输入权限标识"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter='24'>
                    <el-col :span="20">
                        <el-form-item label="显示排序" :label-width="formLabelWidth" prop="orderNum">
                            <el-input-number style="width:100%;" v-model="menuData.orderNum" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-if="menuType != 'F'">
                    <el-col :span="20">
                        <el-form-item label="图标" :label-width="formLabelWidth" prop="icon">
                            <el-input v-model="menuData.icon" placeholder="请选择图标"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row :gutter="24" v-if="menuType != 'F'">
                    <el-col :span="20">
                        <el-form-item label="菜单状态" :label-width="formLabelWidth" prop="visible">
                            <el-radio v-model="menuData.visible" label="0" @change="change1()">显示</el-radio>
                            <el-radio v-model="menuData.visible" label="1" @change="change1()">隐藏</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row> -->
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
         <!-- 所有菜单 -->
        <el-dialog class="selectDialog" title="选择部门" :visible.sync="menuDialog" width="50%"
        style="margin-top:3vh;z-index:100 !important;" @close="closeDialog" :close-on-click-modal="false">
            <div style="width:300px;margin-top:20px;margin-bottom:10px;">
                <el-input class="search-input" size="mini" placeholder="输入部门名称..." v-model="filterText" clearable>
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <el-tree 
                :data="tableData" 
                :props="defaultProps" 
                node-key="menuId" 
                @node-click="handleNodeClick"
                :default-expand-all="defaultexpand"
                :filter-node-method="filterNode"
                empty-text="暂无数据"
                ref="tree"
            >
                <span class="custom-tree-node" slot-scope="{ node, data }" :class='[data.orgCode==menuId?"custom-tree-node1":"custom-tree-node"]'>
                    <span>{{ node.label }}</span>
                </span>
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureParty()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getMenuList,addMenus,updateMenus } from '@/api/menu.js'
import DIC from '@/api/dic.js'
import http from '@/config/httpConfig.js'
import { mapActions } from 'vuex'
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
            selectData:[],
            isDialog:false,
            formLabelWidth:"150px",
            menuData:{
               
            },
            type:'',
            menuDialog:false,
            defaultexpand: false,
            defaultProps: {
                children: 'children',
                label: 'menuName'
            },
            menuId:"",
            filterText:"",
            selectMenu:{
                parentId:"",
                menuName:""
            },
            searchObj:{
                menuName:""
            },
            menuType:'M',
            isShowAdd:true,
            isShowRemove:true,
            isShowSearch:true,
            isShowUpdate:true,
        }
    },
    components: {
        
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
            if (val == "") {
                this.defaultexpand = false;
                for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
                this.$refs.tree.store._getAllNodes()[i].expanded = this.defaultexpand;
                }
            }
        }
    },
    computed:{
        title(){
            if(this.type=='add') return "新增菜单"
            else if(this.type=='update') return "修改菜单"
        }
    },
    created() {
        this.handleList()
        this.isShowAdd = isPermisson("system:menu:add")
        this.isShowRemove = isPermisson("system:menu:remove")
        this.isShowSearch = isPermisson("system:menu:query")
        this.isShowUpdate = isPermisson("system:menu:edit")
    },
    methods: {
        ...mapActions('tagsView', ['getAllMenus']),
        clear(){
            this.searchObj.menuName=""
            this.search()
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.menuName.indexOf(value) !== -1;
        },
        handleNodeClick(data){
            this.selectMenu.parentId = data.menuId
            this.selectMenu.menuName = data.menuName
        },
        focus1(){
            this.menuDialog=true
        },
        closeDialog(){
            this.menuDialog=false
        },
        sureParty(){
            this.menuData.parentName = this.selectMenu.menuName
            this.menuData.parentId = this.selectMenu.parentId
            this.menuDialog=false
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.handleList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.handleList()
        },
        //查询菜单数据
        search(){
            getMenuList(this.searchObj).then(res => {
                this.tableData = res.data.data
                this.total = res.data.total
            })
        },
        handleList() {
            getMenuList({}).then(res => {
                this.tableData = res.data.data
                this.total = res.data.total
            })
        },
        add(){
            this.menuType='M'
            this.menuData = {}
            this.menuData.menuType="M"
            this.type='add'
            this.isDialog=true
        },
        deleteMenu(){
            if(this.selectData.length!=1){
                this.$message({type: 'warning',message: '一次只能删除一条数据'});   
                return;
            }
            this.$confirm('确定要删除选定的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let menuId = this.selectData[0].menuId
                http.delete("/system/menu/"+menuId).then(res=>{
                    if(res.status=='200'){
                        this.$message({type: 'success',message: '删除成功'});
                        this.handleList()
                        this.getAllMenus()
                    }else{
                        this.$message({type: 'warning',message: res.data.msg});    
                    }
                })
            }).catch(() => {
                this.$message({type: 'info',message: '已取消删除'});          
            });
        },
        update(row){
            this.menuData = row
            this.menuType = row.menuType
            this.menuData.parentName = this.getParentName(row.menuId).parentName
            this.menuData.parentId = this.getParentName(row.menuId).parentId
            this.type="update"
            this.isDialog=true
        },
        handleSelectionChange(val){
            this.selectData=val
        },
        confirm(){
            if(this.type=='add'){
                addMenus(this.menuData).then(res=>{
                    if(res.status=='200'){
                        this.$message({type: 'success',message: '新增成功'});  
                        this.handleList()
                        this.getAllMenus()
                        this.isDialog=false
                    }else{
                        this.$message({type: 'warning',message: res.data.msg});  
                    }
                })
            }else if(this.type == "update"){
                updateMenus(this.menuData).then(res=>{
                    if(res.status=='200'){
                        this.$message({type: 'success',message: '修改成功'});  
                        this.handleList()
                        this.isDialog=false
                    }else{
                        this.$message({type: 'warning',message: res.data.msg});  
                    }
                })
            }
        },
        cancel(){
            this.$refs.menuData.resetFields()
            this.isDialog=false
        },
        change(){
            this.menuData.menuType=this.menuType
        },
        change1(){
            console.log(this.menuData.visible)
        },
        change2(){
            console.log(this.menuData.isFrame)
        },
        handleChange(){

        },
        //获取上级菜单名称
        getParentName(menuId){
            let treeObj ={
                parentName:"",
                parentId:0
            }
            for(let i=0;i<this.tableData.length;i++){
                if(menuId == this.tableData[i].menuId){
                    treeObj.parentName = "总目录"
                    treeObj.parentId = this.tableData[i].parentId
                    break;
                }
                
                for(let j=0;j<this.tableData[i].children.length;j++){
                    if(menuId == this.tableData[i].children[j].menuId){
                        treeObj.parentName = this.tableData[i].menuName
                        treeObj.parentId = this.tableData[i].children[j].parentId
                        break;
                    }

                    for(let k=0;k<this.tableData[i].children[j].children.length;k++){
                        if(menuId == this.tableData[i].children[j].children[k].menuId){
                            treeObj.parentName = this.tableData[i].children[j].menuName
                            treeObj.parentId = this.tableData[i].children[j].children[k].parentId
                            break;
                        }
                    }
                }
            }
            return treeObj
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
.el-input-number .el-input-number__decrease, .el-input-number .el-input-number__increase{
        height: 37px !important;
    }
</style>
