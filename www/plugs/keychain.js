// 获取ios Keychain
var getKeyChain = {
        createEvent: function(successCallback, failureCallback, key, accessGroup){
            cordova.exec(successCallback, failureCallback, 'CDVKeychain', 'getForKey', [key, accessGroup]);
        }
};
// 写入ios Keychain
var setKeyChain = {
    createEvent: function(successCallback, failureCallback, key, value, accessGroup){
        cordova.exec(successCallback, failureCallback, 'CDVKeychain', 'setForKey', [key, value, accessGroup]);
    }
};
// 删除ios Keychain
var delKeyChain = {
    createEvent: function(successCallback, failureCallback, key, accessGroup){
        cordova.exec(successCallback, failureCallback, 'CDVKeychain', 'removeForKey', [key, accessGroup]);
    }
};