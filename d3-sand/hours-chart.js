define([
		'jquery',
		'underscore',
		'd3',
		'charts',
], function (
		$,
		_,
		d3,
		charts){

/**
 * firefox about:config should set
 * security.fileuri.strict_origin_policy
 * to false
 */
		function plot_chart() {
				var entries_url = 'http://localhost:3000/entries';
				var httpRequest;

				function reqListener () {
						console.log("got http response");
						console.log(this.responseText);
				}
				function onReadyStateChangeListener() {
						debugger;
				}
				httpRequest = new XMLHttpRequest();
				httpRequest.onload = reqListener;
				httpRequest.onreadstatechange = onReadyStateChangeListener;
				// httpRequest.open('GET', entries_url, true);
				httpRequest.open('GET', entries_url);
				// httpRequest.open('GET', 'test.html');
				// httpRequest.overrideMimeType("application/json");
				// httpRequest.send(null);
				httpRequest.send();

				// var entries_resp = $.getJSON(entries_url);
				// $(function() {
				// 		entries_resp.done( function (entries_resp_data) {
				// 				console.log("got entries response");
				// 				console.log(entries_resp_data);
				// 		})
				// });

				// $.ajax({
				// 		type: "GET",
				// 		url: entries_url,
				// 		dataType: "jsonp" ,
				// 		success: function (data) {
				// 				debugger;
				// 				console.log("got entries response");
				// 				console.log(data);
				// 		}
				// });

				console.log("plot_chart unimplemented");
		}

		return {
				plot_chart: plot_chart
		}

});