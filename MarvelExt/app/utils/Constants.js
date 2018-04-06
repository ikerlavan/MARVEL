Ext.define('MarvelExt.utils.Constants', {
    singleton: true,
    alternateClassName: ['Constants'],
    getBaseUrl : function() {
        var base;
        
        base = window.location;
        
        if (base && base.href && (base.href.length > 0)) {
            
            base = base.href;
        }
//        } else {
//            base = document.URL;
//        }
        
        if (base.length > 0 && base.charAt(base.length -1) !== '/') {
        
            base = base + "/";
        }
        this.baseURL = base;
        startIdx    = base.indexOf("/", base.indexOf("//") + 2) + 1;
        if(base.indexOf('localhost')>0){
            finishIndex = base.indexOf("/", startIdx)+1;
            contextPath = base.substr(0,finishIndex);
        }else{
            contextPath = base.substr(0,startIdx);
        }
        
        this.contextPath = contextPath;
    },
    baseURL : ' ',
    contextPath : ' ',
    constructor: function(config) {
        this.getBaseUrl();
        this.initConfig(config);
    }
        
});