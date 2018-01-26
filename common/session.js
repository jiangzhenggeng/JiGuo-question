

var Const = require('./const');

var Session = {
    get: function (key) {
        var data;
        if(key==Const.USER_INFO_KEY){
            data = wx.getStorageSync(key) || {};
        }else{
            data = wx.getStorageSync(key);
        }
        return data
    },

    set: function (key,session) {
        wx.setStorageSync(key, session);
    },

    clear: function (key) {
        wx.removeStorageSync(key);
    },
};

module.exports = Session;