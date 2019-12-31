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
                        @click="deleteMenu"
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
            <el-table-column label="可见" prop="visible"></el-table-column>
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
        <!-- 新增菜单 -->
        <el-dialog :title="title" :visible.sync="isDialog" :modal-append-to-body="false" :before-close="cancel" append-to-body :close-on-click-modal="false">
            <el-form :model="menuData"  ref="menuData" :rules="rules">
                <el-row :gutter="24">
                    <el-col :span="20">
                        <el-form-item label="上级菜单" :label-width="formLabelWidth" prop="parentId">
                        <el-input v-model="menuData.parentId" placeholder="请输入上级菜单"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="20">
                        <el-form-item label="菜单类型" :label-width="formLabelWidth" prop="menuType">
                            <el-radio v-model="menuData.menuType" label="0" @change="change()">目录</el-radio>
                            <el-radio v-model="menuData.menuType" label="1" @change="change()">菜单</el-radio>
                            <el-radio v-model="menuData.menuType" label="2" @change="change()">按钮</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="10">
                        <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="menuName">
                            <el-input v-model="menuData.menuName" placeholder="请输入菜单名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="显示排序" :label-width="formLabelWidth" prop="orderNum">
                            <el-input-number v-model="menuData.orderNum" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="10">
                        <el-form-item label="权限标识" :label-width="formLabelWidth" prop="perms">
                            <el-input v-model="menuData.perms" placeholder="请输入权限标识"></el-input>
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
import { getMenuList } from '@/api/menu.js'
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
            menuData:{

            },
            type:''
        }
    },
    components: {},
    computed:{
        title(){
            if(this.type=='add') return "新增菜单"
            else if(this.type=='update') return "修改菜单"
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
            getMenuList({}).then(res => {
                console.log(res)
                this.tableData = res.data.data
                this.total = res.data.total
            })
        },
        searchByTypeAndStatus() {
            this.handleList()
        },
        add(){
            this.type='add'
            this.isDialog=true
        },
        deleteMenu(){
            if(this.selectData.length<1){
                this.$message({type: 'warning',message: '请至少选择一条数据'});   
                return;
            }
            this.$confirm('确定要删除选定的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log("111")
            }).catch(() => {
                this.$message({type: 'info',message: '已取消删除'});          
            });
        },
        update(row){
            this.type="update"
            this.isDialog=true
        },
        handleSelectionChange(val){
            this.selectData=val
        },
        confirm(){
            this.isDialog=false
        },
        cancel(){
            this.isDialog=false
        },
        change(){
            console.log(this.menuData.menuType)
        },
        handleChange(){

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
