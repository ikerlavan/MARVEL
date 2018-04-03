Ext.define('MarvelExt.model.Personaje', {
     extend: 'Ext.data.Model',
     
     fields: [
      	{name:'id'}, 
      	{name:'name'}, 
      	{name:'description'},
      	{name:'modified'},
      	{name:'resourceURI'},
      	{name:'urls'},
      	{name:'series'},
      	{name:'comics'},
      	{name:'thumbnail'}
      ],
      idProperty : 'id'
     


 });