requirejs.config({

		paths: {
				jquery: 'lib/jquery-1.9.1.min',
				d3: 'lib/d3.v3.min',
				underscore: 'lib/underscore-min',
				backbone: 'lib/backbone'
		},
		shim: {
				underscore: {
						exports: '_'
				},
				backbone: {
						deps: ['underscore', 'jquery'],
						exports: 'Backbone'
				},
				d3: {
						exports: 'd3'
				}
		}
});
