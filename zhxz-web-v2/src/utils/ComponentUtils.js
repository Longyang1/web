export const destroy =  (curCompObj) => {
    
    // var index = activeMenuIds.indexOf(curCompObj.menuId, 'menuId');
    console.log(curCompObj.menuId + "  " + curCompObj.curRemoveMenuName);
    if(curCompObj.menuId == curCompObj.curRemoveMenuName.split("_")[0]){
        console.log('dstroy ' + curCompObj.$route.name);
        curCompObj.$destroy();
    }
}