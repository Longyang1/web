const defaultConvertSuffixs = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']

export const needToConvert = (uploadFileInfo) => {
    if(uploadFileInfo && checkFileSuffix(uploadFileInfo)){
        return true;
    }
    return false;
    
}

export const checkFileSuffix = (uploadFileInfo, suffixs) => {
    var _suffixs = defaultConvertSuffixs;
    if(typeof suffixs == 'object' && suffixs.length > 0){
        _suffixs = suffixs; 
    }

    for(var i = 0; i < _suffixs.length; i++) {
        if(uploadFileInfo.endWith(_suffixs[i])){
            return true;
        }
    }

    return false;
}