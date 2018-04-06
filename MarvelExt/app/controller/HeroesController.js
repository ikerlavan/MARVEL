Ext.define('MarvelExt.controller.HeroesController',{
    extend : 'Ext.app.ViewController',
requires:['MarvelExt.utils.Constants'],
    alias : 'controller.heroes'
        
    /*
     * Usaremos esta variable para guardar y recuperar en el
     * localStorage los datos de consulta
     */
    ,userFilter         : null

    ,busquedaExacta    : false
    ,inicioPlaceHolder : 'Comienza por ...'
    ,exactoPlaceHolder : 'Nombre exacto'
    ,small             : 'portrait_small'
    ,medium            : 'portrait_medium'
    ,large             : 'portrait_xlarge'
    
        
    ,init : function (view) {
    	this.userFilter = Ext.create(
                'MarvelExt.utils.UserLocalSettings', {
                    idStorage : 'marvelLoad'
                });
    	this.getView().down('checkbox').setValue(this.userFilter.getItem('busquedaExacta')||'false');
        if(this.userFilter.getItem('filter') && this.userFilter.getItem('filter')[0])
            this.getView().down('textfield').setValue(this.userFilter.getItem('filter')[0].value||'');
        var store = this.getViewModel().getStore('Personaje');
        store.clearFilter(true);
        store.filter(this.userFilter.getItem('filter'));
        store.load();

    }
    ,applyTemplateComics(obj){
        var tpl = new Ext.XTemplate(
                '<tpl for=".">',
                '<tpl if="series!=null && series.items.length &gt; 0">',
                '<h4>Series<span class="badge badge-pill badge-info">{series.available}</h4>',
                '<tpl for="series.items">',
                '<div class="list-group">',
                '<a id="{[this.getLinkId()]}" href="{resourceURI}" class="list-group-item list-group-item-action">{name}</a>',
                '</div>', 
                '</tpl></tpl>',
                '<tpl if="comics!=null && comics.items.length &gt; 0">',
                '<h4>Comics<span class="badge badge-pill badge-info">{comics.available}</span></h4>',
                '<tpl for="comics.items">',
                '<div class="list-group">',
                '<a id="{[this.getLinkId()]}" href="{resourceURI}" class="list-group-item list-group-item-action">{name}</a>',
                '</div>',
                '</tpl></tpl>',
                '<tpl if="stories!=null && stories.items.length &gt; 0">',
                '<h4>Stories<span class="badge badge-pill badge-info">{stories.available}</span></h4>',
                '<tpl for="stories.items">',
                '<div class="list-group">',
                '<a id="{[this.getLinkId()]}" href="{resourceURI}" class="list-group-item list-group-item-action">{name}</a>',
                '</div>',
                '</tpl></tpl>',
                '</tpl>',{
                    getLinkId : function (values) {
                        var result = Ext.id();
                        Ext.Function.defer(this.addListener, 1,
                                this, [result]);
                        return result;
                    },
                    addListener : function (id) {
                        
//                        {
//                            'click':  function(e,obj){debugger;console.log('click')},
//                            'tap'  : function(e,obj){debugger;console.log('tap')},
//                            scope   : this
//                        });
                        Ext.get(id).on(
                                'click', 
                                function (e, obj) {
                                    e.stopEvent();
                                    if(e.parentEvent)
                                        e.parentEvent.stopEvent();
                                    Ext.Ajax.request({
                                        url    : Constants.contextPath + 'CURL/curl.php',
                                        method : 'POST',
                                        params : {
                                            url : obj.href
                                        },
                                        success: function(response){
                                            var tpl = new Ext.XTemplate(
                                                    '<tpl for=".">',
                                                    '<h3>{title}</h2>',
                                                    '<p>Desde {startYear} hasta {endYear}</p>',
                                                    '<div class="col-lg-12">',
                                                    '<img class="col-lg-3 img-responsive" src="{thumbnail.path}/portrait_xlarge.{thumbnail.extension}" alt="{title}"></img>',
                                                    '</div>',
                                                    '<tpl if="creators!=null && creators.items.length &gt; 0">',
                                                    '<ul class="list-group">',
                                                    '<h4>Creators<span class="badge badge-pill badge-info">{creators.available}</span></h4>',
                                                    '<tpl for="creators.items">',
                                                    '<li class="list-group-item">{name} - {role}</li>',
                                                    '</tpl></ul>', 
                                                    '</tpl></tpl>');
                                            var result = Ext.JSON.decode(response.responseText);
                                            if(result.code === 200){
                                                var panel = Ext.getCmp('cardDetail');
                                                var item = new Ext.container.Container({html:tpl.apply(result.data.results)});
                                                panel.add(item);
//                                              item.show();
                                                item.setVisible(true);
                                                panel.setActiveItem(item);
                                                return true;
                                            }
                                            return false;
                                            
                                        } 
                                    });

                                    
                                },{preventDefault: true, stopEvent : true, stopPropagation : true, delay : 100})
                    }
                });
        return tpl.apply(obj);
    }
    ,applyTemplateDescription(obj){
        var tpl = new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="col-lg-12"><p>{description}</p>',
                '<img class="col-lg-3 img-responsive" src="{img.path}/'+this.large+'.{img.extension}" alt="{name}"></img>',
                '</div>',
                '</tpl>');
        return tpl.apply(obj);
    }

    ,onItemSelected : function (sender, record) {
        var id      = record.get('id')
        , dataObj   = this.userFilter.getItem('data')
        , isItem    = dataObj.id === id
        , data      = dataObj.data
        , htm       = Ext.emptyString
        ,html1      = Ext.emptyString
        ,dataItem1  = {};
        
        if (data == null || !isItem) {
            delete this.userFilter['data'];
            
            var series  = record.get('series')
            , comics    = record.get('comics')
            , stories   = record.get('stories');

             if (series || comics || stories) {
                data            = {};
                data.series     = series;
                data.comics     = comics;
                data.stories    = stories;
                this.userFilter.setItem({'data' : {'id' : record.get('id'),'data' : data } });
            }
        }
        
        dataItem1 = {'img':record.get('thumbnail'),'description':record.get('description'), 'name': record.get('name')};
        html1 = this.applyTemplateDescription(dataItem1);
        
        var win = this.getWindowCharacter();
        if (win) {
            win.destroy();
        }

        if (data) {
            html    = this.applyTemplateComics(data);
            win     = this.createNewView(record.get('name'));
            var items = [];
            if(html1!==''){
                items.push({
                    xtype : 'container',
                    html  : html1
                });
                
            }
            if(html!==''){
                items.push({
                    xtype  : 'container',
                    html   : html
                });
            }
            
//            var p = Ext.create('MarvelExt.view.main.CardCharacters', {
//                items : items
//            });
//          win.add(p);
            
          win.add({xtype : 'panel', 
                     layout : 'card', 
                     cardSwitchAnimation: 'flip',
                     id          : 'cardDetail',
                     bodyPadding : 15,
                     autoScroll: true,
                     defaults:{
                       autoScroll   : true  
                     },
                     tbar: [
                         {
                             id: 'move-prev',
                             text: 'Back',
                             handler: function(btn) {
                                 var layout = btn.up("panel").getLayout();
                                 layout["prev"]();
                                 Ext.getCmp('move-prev').setDisabled(!layout.getPrev());
                                 Ext.getCmp('move-next').setDisabled(!layout.getNext());
                             },
                             disabled: true
                         },
                         '->',
                         {
                             id: 'move-next',
                             text: 'Next',
                             handler: function(btn) {
                                 //this.navigate(btn.up("panel"), "next");
                                 var layout = btn.up("panel").getLayout();
                                 layout["next"]();
                                 Ext.getCmp('move-prev').setDisabled(!layout.getPrev());
                                 Ext.getCmp('move-next').setDisabled(!layout.getNext());
                             },
                             disabled:items.length >1?false:true
                         }
                     ],
                     items : items
                    });
                           
        }
            
        win.show();
    }
    ,getWindowCharacter : function (){
        return Ext.ComponentQuery.query('#infoCharacter')[0];
    }
    ,createNewView   : function(name) {
        console.log("create new window");
        return Ext.create('Ext.window.Window', {
            itemId      : 'infoCharacter',
            title       : name,
            //autoScroll  : true,
            layout      :'fit',
            width       : this.getView().getWidth() / 1.3,
            height      : this.getView().getHeight() / 1.1
        })
    }
    ,onClickCharacter   : function (obj){
        var win = this.getWindowCharacter();
        if (win) {
            win.destroy();
        }
        var tplChar = new Ext.Template(
            '<div class="container-fluid">',
            '</div>',
            '</tpl>'
        );

    }
    /**/
    ,onRendererResource : function (value, metaData, record,
            rowIndex, colIndex, store, view) {
        var text = '<div>';
        value.forEach(function (obj) {
            text += '<a href="' + obj.url + '" target=_blank>'
                    + obj.type + '</a></br>';

        });
        text += '</div>';
        return text;
    }

    ,getImage : function (value, metaData, record, rowIndex,
            colIndex, store, view) {
        //.setConfig('width', viewport.getWidth()/2));
        //portrait_medium //portrait_small
        return this.getAbstractImage(value, this.small);
    }
    ,getAbstractImage : function(obj, medida){
        var img = medida==null||medida===''?this.large:medida;
        return '<img src="' + obj.path + '/' + img + '.' + obj.extension + '" />';
    }
    ,onFilterChange : function (field, newValue, oldValue, eOpts) {
        var store = this.getView().getStore();
        // debugger;
        if (newValue.length !== 0) {
            var filters = [], sorters = store
                    .getSorters().getRange();
            if (this.busquedaExacta) {
                console.log("busqueda exacta");
                filters.push({
                    property : 'name',
                    value : newValue
                });
            } else {
                console.log("comienza por ...");
                filters.push({
                    property : 'nameStartsWith',
                    value : newValue
                });
            }
            
            this.loadSorterStoreWithFilterAndSave(store,
                    filters, sorters);
        }
    },
    onCheckChange : function (field, newValue, oldValue, eOpts) {
        // debugger;
        var view = this.getView()
        parent = field.up('toolbar'), textField = parent
                .down('textfield'),
                this.busquedaExacta = field.checked;
        if(null == this.userFilter)
            this.userFilter = Ext.create(
                'MarvelExt.utils.UserLocalSettings', {
                    idStorage : 'marvelLoad'
                });
            
        this.userFilter.setItem({'busquedaExacta':this.busquedaExacta});
        
        textField.emptyText = this.busquedaExacta === true ? this.exactoPlaceHolder
                : this.inicioPlaceHolder;
        textField.applyEmptyText();
    }

    
    /**
     * Carga el store con los filtros pasados como parámetro
     */
    ,
    loadStoreWithFilter : function (store, filters) {
        this.loadSorterStoreWithFilter(store, filters, store
                .getSorters().getRange());
    }

    /**
     * Carga el store con los filtros parasados como parámetro y
     * la ordenación actual Guadar en localstorage las
     * preferencias
     */
    ,
    loadStoreWithFilterAndSave : function (store, filters) {
        this.loadSorterStoreWithFilterAndSave(store, filters,
                store.getSorters().getRange());
    }

    /**
     * Carga el store con los filtros parasados como parámetro y
     * la ordenación actual
     */
    ,
    loadSorterStoreWithFilter : function (store, filters,
            sorters) {
        console.log('cargo store');
        store.clearFilter(true);
        store.filter(filters);
        //store.sorters.clear();
        //store.sorter.add(sorters);
        store.load();
    }

    /**
     * Carga el store con los filtros parasados como parámetro y
     * la ordenación actual. Guadar las preferencias de filtrado
     * y ordenación en localStorage
     */
    ,
    loadSorterStoreWithFilterAndSave : function (store,
            filters, sorters) {
        console.log('loadSorterStoreWithFilterAndSave');
        this.saveFiltersAndSortersInLocalStorage(filters,
                sorters);
        console.log('saveFiltersAndSortersInLocalStorage');
        this.loadSorterStoreWithFilter(store, filters, sorters);
    }

    /**
     * Guadar las preferencias de filtrado y ordenación en
     * localStorage
     */
    ,
    saveFiltersAndSortersInLocalStorage : function (filters,
            sorters) {
        if(null == this.userFilter)
            this.userFilter = Ext.create(
                'MarvelExt.utils.UserLocalSettings', {
                    idStorage : 'marvelLoad'
                });
        delete this.userFilter['filter'];
        delete this.userFilter['sorter'];
        this.userFilter.setSettingsInLocalStorage({
            filter : filters,
            sorter : sorters
        });
    }

    ,onCardLayoutWindowBeforeShow    : function(view) {
//        debugger;
//
//        var newView = this.createNewView();
//        //Ext.suspendLayouts();
//        view.add(newView);
//        //Ext.resumeLayouts(true);
    }
    ,onCardLayoutWindowBeforeHide    : function(view) {
//        Ext.suspendLayouts();
//        view.removeAll(true);
//        Ext.resumeLayouts(true);
    }

    
});
