//判断按钮权限


export const isPermisson = type => {
    let arr = JSON.parse(localStorage.getItem("permission")) 
    if(arr[0] == "*:*:*"){
        return true
    }
    for(let i=0;i<arr.length;i++){
        if(type == arr[i]){
            return true
        }
    }
    return false
}
