Ext.define('MarvelExt.utils.UserLocalSettings',{
	alias : 'User',
	
	/**
	 * En options lo normal es que se envíe la matrícula, 
	 * sin ella no se puede recuperar el objeto del localStorage
	 * 
	 * var user = Ext.create('Entity.classes.UserLocalSettings',{id:matricula});
	 * 
	 */
	constructor: function(options) {
		Ext.apply( this, options || {} );
		this._loadLocalSettingsFromLocalStorage();
		Ext.apply( this.Settings, options || {} );
    },
    
   	type: null,
    
   	id  : 'marvelLoad',
    
	Settings: null,
	
	getItem: function(key){
		this._loadLocalSettingsFromLocalStorage();
		/* 
		 * Si el usuario es nuevo y no tiene datos guardados intentamos buscarlo 
		 * en el objeto
		 * */
		if(this.Settings != null){
			return this.Settings[key]||{};
		}
		if(this.Settings != null && !this.Settings[key]){
            return this.Settings[key];
        }
		return null;
    	
	},
	
	setItem: function(objeto){
		this.setSettingsInLocalStorage(objeto);
	},
	
	setSettingsInLocalStorage : function(options){
		this.save(options);
	},
	
	save : function(options) {
		this._loadLocalSettingsFromLocalStorage();
		Ext.apply( this.Settings, options || {} );
		localStorage.setItem(this.idStorage,Ext.JSON.encode(this.Settings));
	},
	
	_loadLocalSettingsFromLocalStorage : function(){
		if(this.idStorage==null || this.idStorage==''){
			//Recuperamos el id
			this._getIdStorage();
		}
		
		var options = Ext.JSON.decode( localStorage.getItem(this.idStorage) ) || {};
		
		if(this.Settings==null)
			this.Settings = options;
		else
			Ext.apply( this.Settings, options || {} );

	},
	
	_getIdStorage : function(){
		if(!this.idStorage){
			this.idStorage = sessionStorage.getItem(this.id);
		}
		
	}
	
});