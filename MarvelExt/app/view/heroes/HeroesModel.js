/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('MarvelExt.view.heroes.HeroesModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.heroes',
	requires : [
    	'MarvelExt.store.Personaje'
    ],
    stores   : {
        Personaje : {
        	type         : 'personaje'
        }
    }
    ,data: {
        character   : {},
        info        : {},
        html        : ''
   }
   
});
