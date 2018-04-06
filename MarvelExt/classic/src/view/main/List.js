/**
 * This view is an example list of people.
 */
Ext.define('MarvelExt.view.main.List', {
    extend			: 'Ext.grid.Panel',
    xtype			: 'mainlist',
    id  			: 'heroes',
    controller		: 'heroes',
    viewModel       : 'heroes',
    requires		: [
        'MarvelExt.controller.HeroesController',
        'MarvelExt.view.heroes.HeroesModel',
        'MarvelExt.view.main.CardCharacters'
    ],
    img:null,
    plugins     : 'responsive',
    responsiveConfig: {
        personalizedWide:{img:'portrait_medium'},
        personalizedTall:{img:'portrait_xlarge'}
    },
    responsiveFormulas: {
        personalizedTall: function (context) {
            if (context.tall || context.portrait){
            }
        },
        personalizedWide: function (context) {
            if (context.wide || context.landscape){

            }
        }
    },
    title			: 'Personajes',
    bind            : { store: '{Personaje}' },
    tbar			: [{
    	itemId		: 'txtSearch',
    	xtype		: 'textfield',
        emptyText	: 'Comienza por ...',
        listeners	: {
            change	: 'onFilterChange'
        }
    },{
        itemId		: 'checkTipo',
    	afectaA		: 'txtSearch',
    	xtype		: 'checkboxfield',
    	boxLabel	: 'Nombre exacto',
    	listeners	: {
    		change	: 'onCheckChange'
    	}
    	
    }], 
    loadMask		:true,
    //scrollable:true,
    bufferedRenderer: true,
    //autoScroll: true,
    columns			: [
        { 
    		text		: 'Id',
    		dataIndex	: 'id',
    		hidden		: true
        },
        {
			text		: 'image', 		
			dataIndex	: 'thumbnail', 	
			flex		: 1, 
			renderer	: 'getImage',
			cellWrap	: true
		},
        { 
        	text		: 'Name', 		
        	dataIndex	: 'name', 			
        	flex		: 1,
        	filter		: true
        },
        { 
    		text		: 'Descripcion', 	
    		dataIndex	: 'description', 	
    		flex		: 1 ,
    		cellWrap	: true,
    		plugins     : 'responsive',
    		responsiveConfig : {
                "width<height"  : { hidden : true },
                "width>=height" : { hidden : false }
            }
    	},
        {
			text		: 'modif', 		
			dataIndex	: 'modified', 		
			flex		: 1,
			plugins     : 'responsive',
			responsiveConfig : {
                "width<height"  : { hidden : true },
                "width>=height" : { hidden : false }
            },
			filter		: true
		},
        {
			text		: 'recurso', 		
			dataIndex	: 'resourceURI', 	
			flex		: 1,
			plugins     : 'responsive',
			responsiveConfig : {
                "width<height"  : { hidden : true },
                "width>=height" : { hidden : false }
            }
		},
        {
			text		: 'url', 			
			dataIndex	: 'urls', 			
			flex		: 1, 
			renderer	: 'onRendererResource',
			plugins     : 'responsive',
			responsiveConfig : {
                "width<height"  : { hidden : true },
                "width>=height" : { hidden : false }
            } 
		}
    ],

    listeners: {
        select: 'onItemSelected'
    }
});
