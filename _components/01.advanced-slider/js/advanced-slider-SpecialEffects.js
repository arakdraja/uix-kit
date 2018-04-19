
/* 
 *************************************
 * <!-- Advanced Slider (Special Effects) -->
 *************************************
 */
theme = ( function ( theme, $, window, document ) {
    'use strict';
    
    var documentReady = function( $ ) {
		
	
		var $window            = $( window ),
			windowWidth        = $window.width(),
			windowHeight       = $window.height();
		
		
		
		advancedSliderInit();
		
		$window.on( 'resize', function() {
			// Check window width has actually changed and it's not just iOS triggering a resize event on scroll
			if ( $window.width() != windowWidth ) {

				// Update the window width for next time
				windowWidth = $window.width();

				advancedSliderInit();
				
			}
		});
		

		
		
		/*
		 * Initialize slideshow
		 *
		 * @return {void}                   - The constructor.
		 */
        function advancedSliderInit() {
			
			var $advSlider = $( '.custom-advanced-slider-sp' );
			$advSlider.each( function()  {

				var $this                    = $( this ),
					$items                   = $this.find( '.item' ),
					total                    = $items.length,
					timerEvtStop                 = null,
					dataControlsPagination   = $this.data( 'controls-pagination' ),
					dataControlsArrows       = $this.data( 'controls-arrows' ),
					dataLoop                 = $this.data( 'loop' ),
					dataAuto                 = $this.data( 'auto' ),
					dataTiming               = $this.data( 'timing' );


				if( typeof dataControlsPagination === typeof undefined ) dataControlsPagination = '.custom-advanced-slider-sp-pagination';
				if( typeof dataControlsArrows === typeof undefined ) dataControlsArrows = '.custom-advanced-slider-sp-arrows';
				if( typeof dataLoop === typeof undefined ) dataLoop = false;
				if( typeof dataAuto === typeof undefined ) dataAuto = false;	
				if( typeof dataTiming === typeof undefined ) dataTiming = 10000;



			
				//Initialize the slider style
				//-------------------------------------	
				$items.first().addClass( 'active' );
				
			
				var curImgH = null;
				//If the src is already set, then the event is firing in the cached case, 
				//before you even get the event handler bound. To fix this, you can loop 
				//through checking and triggering the event based off .complete
				$items.first().find( 'img' ).one( 'load', function() {
					curImgH = $( this ).height();
				}).each(function() {
					if( this.complete ) $( this ).load();
				});	


				if ( curImgH > 0 ) {
					$this.css( 'height', curImgH + 'px' );
				}

				

				//Load slides to canvas
				//-------------------------------------	
				$this.find( '.item' ).each( function( index )  {
					
					if ( $( '#custom-advanced-slider-sp-canvas-item-'+index ).length == 0 ) {
						$( this ).prepend( '<canvas id="custom-advanced-slider-sp-canvas-item-'+index+'" width="'+$this.width()+'" height="'+$this.height()+'"></canvas>' );
					}
					

					//Canvas Interactions
					canvasInteractions( index, $this )
					
				});
				
				
				//Autoplay Slider
				//-------------------------------------			
				if ( dataAuto && !isNaN( parseFloat( dataTiming ) ) && isFinite( dataTiming ) ) {
					
					var playTimes     = 0,
						timerEvtStop  = false;

					// change item
					setInterval( function() {
					
						if ( timerEvtStop ) return;

						setTimeout( function() {
							if ( playTimes == total ) playTimes = 0;
							if ( playTimes < 0 ) playTimes = total-1;	

							advancedSliderUpdates( playTimes, $advSlider );

							playTimes++;
							
						}, dataTiming );	
						
					}, dataTiming );
	
				}
				
				$this.on( 'mouseout', function() {
					timerEvtStop = false;
				} );



				//Pagination dots 
				//-------------------------------------	
				var _dot       = '',
					_dotActive = '';
				_dot += '<ul>';
				for ( var i = 0; i < total; i++ ) {

					_dotActive = ( i == 0 ) ? 'class="active"' : '';

					_dot += '<li><a '+_dotActive+' data-index="'+i+'" href="javascript:"></a></li>';
				}
				_dot += '</ul>';

				if ( $( dataControlsPagination ).html() == '' ) $( dataControlsPagination ).html( _dot );
				
				$( dataControlsPagination ).find( 'li a' ).on( 'click', function( e ) {
					e.preventDefault();
					
					if ( !$( this ).hasClass( 'active' ) ) {
						advancedSliderUpdates( $( this ).attr( 'data-index' ), $advSlider );

						//Pause the auto play event
						timerEvtStop = true;	
					}

	

				});
				
				//Next/Prev buttons
				//-------------------------------------		
				var _prev = $( dataControlsArrows ).find( '.prev' ),
					_next = $( dataControlsArrows ).find( '.next' );
					
				$( dataControlsArrows ).find( 'a' ).attr( 'href', 'javascript:' );
				
				$( dataControlsArrows ).find( 'a' ).removeClass( 'disabled' );
				if ( !dataLoop ) {
					_prev.addClass( 'disabled' );
				}
				
				_prev.on( 'click', function( e ) {
					e.preventDefault();
					
					advancedSliderUpdates( parseFloat( $items.filter( '.active' ).index() ) - 1, $advSlider );

					//Pause the auto play event
					timerEvtStop = true;

				});
				
				_next.on( 'click', function( e ) {
					e.preventDefault();
					
					advancedSliderUpdates( parseFloat( $items.filter( '.active' ).index() ) + 1, $advSlider );

					
					//Pause the auto play event
					timerEvtStop = true;
					
					
				});
				
				

			});


		}
		
	
		/*
		 * Transition Between Slides
		 *
		 * @param  {number} elementIndex     - Index of current slider.
		 * @param  {object} slider           - Selector of the slider .
		 * @return {void}                    - The constructor.
		 */
        function advancedSliderUpdates( elementIndex, slider ) {
			
			var total                    = slider.find( '.item' ).length,
				dataCountTotal           = slider.data( 'count-total' ),
				dataCountCur             = slider.data( 'count-now' ),
				dataControlsPagination   = slider.data( 'controls-pagination' ),
				dataControlsArrows       = slider.data( 'controls-arrows' ),	
				dataLoop                 = slider.data( 'loop' ),
				dataAuto                 = slider.data( 'auto' );
				
			
			if( typeof dataCountTotal === typeof undefined ) dataCountTotal = 'p.count em.count';
			if( typeof dataCountCur === typeof undefined ) dataCountCur = 'p.count em.current';
			if( typeof dataControlsPagination === typeof undefined ) dataControlsPagination = '.custom-advanced-slider-sp-pagination';
			if( typeof dataControlsArrows === typeof undefined ) dataControlsArrows = '.custom-advanced-slider-sp-arrows';
			if( typeof dataLoop === typeof undefined ) dataLoop = false;
			if( typeof dataAuto === typeof undefined ) dataAuto = false;			
		
			
			//Transition Interception
			//-------------------------------------
			if ( dataLoop ) {
				if ( elementIndex == total ) elementIndex = 0;
				if ( elementIndex < 0 ) elementIndex = total-1;	
			} else {
				$( dataControlsArrows ).find( 'a' ).removeClass( 'disabled' );
				if ( elementIndex == total - 1 ) $( dataControlsArrows ).find( '.next' ).addClass( 'disabled' );
				if ( elementIndex == 0 ) $( dataControlsArrows ).find( '.prev' ).addClass( 'disabled' );
			}

			$( dataControlsPagination ).find( 'li a' ).removeClass( 'leave' );
			$( dataControlsPagination ).find( 'li a.active' ).removeClass( 'active' ).addClass( 'leave' );
			$( dataControlsPagination ).find( 'li a[data-index="'+elementIndex+'"]' ).addClass( 'active' ).removeClass( 'leave' );
			
			
			slider.find( '.item' ).removeClass( 'leave' );
			slider.find( '.item.active' ).removeClass( 'active' ).addClass( 'leave' );
			slider.find( '.item' ).eq( elementIndex ).addClass( 'active' ).removeClass( 'leave' );

			

			//Display counter
			//-------------------------------------

			$( dataCountTotal ).text( total );
			$( dataCountCur ).text( parseFloat( elementIndex ) + 1 );		
			
			
			//Canvas Interactions
			//-------------------------------------
			canvasInteractions( elementIndex, slider )


			
		}
		
	
		/*
		 * Canvas Interactions
		 * @http://pixijs.download/dev/docs/index.html
		 *
		 * @param  {number} elementIndex     - Index of current slider.
		 * @param  {object} slider           - Selector of the slider .
		 * @return {void}                    - The constructor.
		 */
        function canvasInteractions( elementIndex, slider ) {
			
			if ( Modernizr.webgl ) {
				

				var curImgURL             = slider.find( '.item' ).eq( elementIndex ).find( '> img' ).attr( 'src' ),
					stageW                = slider.width(),
					stageH                = slider.height(),
					curSprite             = PIXI.Sprite.fromImage( curImgURL, true ),
					renderer              = new PIXI.Application( stageW, stageH, {
															backgroundColor : 0x000000, 
															autoResize      : true, 
															view            : document.getElementById( 'custom-advanced-slider-sp-canvas-item-'+elementIndex )
														});

				curSprite.width  = stageW;
				curSprite.height = stageH;


				//Brightness Effect
				//-------------------------------------		
				if ( slider.hasClass( 'eff-brightness' ) ) {

					// Add child container to the stage
					renderer.stage.addChild( curSprite );

					
					TweenLite.set( curSprite, {
						pixi: {
							brightness: 3
						}
					});	

					TweenLite.to( curSprite, 2, {
						pixi: {
							brightness: 1
						},
						delay: 0.6
					});		


				}


				//Liquid Distortion Effect
				//-------------------------------------		
				if ( slider.hasClass( 'eff-liquid' ) ) {

						var count       = 0,
							ropeLength  = stageW / 10,
							points      = [];

						for ( var i = 0; i < 10; i++ ) {
							points.push( new PIXI.Point( i * ropeLength, 0 ) );
						}

						// Set the filter to stage and set some default values for the animation
						var strip = new PIXI.mesh.Rope( PIXI.Texture.fromImage( curImgURL ), points );
						strip.x = 0;
					    strip.y = stageH/2 - 20;

						// Add child container to the stage
						renderer.stage.scale.set( 1 + stageH / stageW );
						renderer.stage.addChild( strip );


						renderer.ticker.add( function() {

							// speed
							count += 0.02; 

							// make the effect
							for ( var j = 0; j < points.length; j++ ) {
								points[j].y = Math.sin((j * 0.5) + count) * 15;
								points[j].x = j * ropeLength + Math.cos((j * 0.3) + count) * 15;
							}
						});

					

				}		
				
				
			} else {
				slider.find( '.item canvas' ).hide();
			}
	
			
		}



    };

	
    theme.advancedSlider_SpecialEffects = {
        documentReady : documentReady        
    };

    theme.components.documentReady.push( documentReady );
    return theme;

}( theme, jQuery, window, document ) );
