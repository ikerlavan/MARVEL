Ext.define('MarvelExt.store.Personaje', {
    extend          : 'Ext.data.BufferedStore',
    requires        :  ['MarvelExt.utils.Constants'],
    alias           : 'store.personaje',
    storeId         : 'strPersonaje',
    model           : 'MarvelExt.model.Personaje',
    leadingBufferZone : 100,
    pageSize        : 20,
    // remoteFilter : true,
    // remoteSort : true,
    sorters         : [ {
        property : 'name',
        direction : 'ASC'
    } ],
    proxy           : {
        type : 'ajax',
        url  : Constants.contextPath + 'CURL/curl.php',
        //url     : 'http://restiker.esy.es/CURL/curl.php',
        //method : 'POST',
        reader : {
            type            : 'json',
            rootProperty    : 'data.results',
            totalProperty   : 'data.total'
        }
    },
    autoLoad        : true
});
