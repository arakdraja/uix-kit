

/* 
 *************************************
 *  <!-- Sticky Elements -->
 *************************************
 */
App = ( function ( App, $, window, document ) {
    'use strict';
    
    var pageLoaded = function() {
		
		var $window      = $( window ),
			windowWidth  = $window.width(),
			windowHeight = $window.height(),
			topSpacing   = $( '.header-area' ).outerHeight( true ) + 10;
		
		
		$window.on( 'scroll touchmove', function() {

			var scrollTop   = $window.scrollTop(),
				dynamicTop  = parseFloat( scrollTop + $window.height() ),
				targetTop   = parseFloat( $( document ).height() - 200 );

			//Detecting when user scrolls to bottom of div
			if ( dynamicTop >= targetTop ) {
				
				
				$( '.stick-widget.sticky' )
					  .css( {
						  'top'  : parseFloat( topSpacing - (dynamicTop - targetTop) ) + 'px'
					  } );
				
			}


		});	

		var	waypoints = $( '.stick-widget' ).waypoint({

		  handler: function( direction ) {


			var $this      = $( this.element ),
				oWIdth     = $this.width();


			  $this
				  .toggleClass( 'sticky', direction === 'down' )
				  .css( {
					  'width': oWIdth + 'px',
					  'top'  : topSpacing + 'px'
				  } );



		  },

		  offset: topSpacing

		});	
		
	
			
//		var	navMinTop    = $( '.stick-widget' ).offset().top + $( window ).height()/3,
//			navMaxTop    = parseFloat( $( document ).height() - $( '.footer-main-container' ).height() ) - $( window ).height()/3;
//
//
//		$( window ).on( 'scroll touchmove', function() {
//			var scrollTop = $( this ).scrollTop(),
//				spyTop    = parseFloat( scrollTop + $( window ).height()/2 );
//
//			//Detecting when user scrolls to bottom of div
//			if ( spyTop > navMaxTop || spyTop < navMinTop ) {
//				$( '.stick-widget' ).removeClass( 'act' );
//			} else {
//				$( '.stick-widget' ).addClass( 'act' );
//			}	
//
//
//		});



		
    };

    App.stickyElements = {
        pageLoaded : pageLoaded        
    };

    App.components.pageLoaded.push( pageLoaded );
    return App;

}( App, jQuery, window, document ) );



