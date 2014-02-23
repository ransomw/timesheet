define([
		'underscore',
		'd3',
], function (
		_,
		d3){

		// as described at http://bost.ocks.org/mike/chart/
		function bar_chart() {
				var width = 500,
				height = 200,
				ticks = 0,
				y_label = ''
				bar_label_height = 0;

				function my(sel) {
						sel.each(function(chart_data) {
								data = _.map(chart_data, function(p) { return p.value; });
								bar_width = Math.round(width / data.length);
								var svg = d3.select(this).append("svg")
										.attr("class", "chart")
										.attr("width", width)
										.attr("height", height + bar_label_height);
								var x = d3.scale.linear()
										.domain([0, 1])
										.range([0, bar_width]);
								var y = d3.scale.linear()
										.domain([0, _.max(data)])
										.rangeRound([0, height]);

								var bars = svg.selectAll("g.bar")
										.data(chart_data)
										.enter().append("svg:g")
										.attr("class", "bar")
										.attr("transform", function(d, i) {
												return "translate("+
														(x(i) - .5)
														+','+
														(height - y(d.value) - .5)
														+')';
										});
								bars.append("svg:rect")
										.attr("width", bar_width)
										.attr("height", function(d) { return y(d.value); });
								if (bar_label_height > 0) {
										bars.append("svg:text")
												.attr("text-anchor", "end")
												.attr("dy", ".75em")
												.attr("y", bar_width/2)
												.attr("x", function(d) { return - y(d.value); })
												.attr("transform", "rotate(-90)")
												.text(function(d) { return d.label; });
								}
								// y-axis ticks
								if (ticks != 0) {
										var num_ticks;
										if (ticks > 0) {
												num_ticks = ticks;
										} else {
												num_ticks = Math.round(_.max(data)/Math.abs(ticks));
										}
										svg.selectAll("line")
												.data(y.ticks(num_ticks))
												.enter().append("line")
												.attr("x1", 0)
												.attr("x2", width)
												.attr("y1", y)
												.attr("y2", y)
												.style("stroke", "#ccc");
								}
								if (y_label != '') {
										svg.append("text")
												.attr("class", "y label")
												.attr("text-anchor", "end")
												.attr("y", 6)
												.attr("dy", ".75em")
												.attr("transform", "rotate(-90)")
												.text(y_label);
								}
								// horizontal line for the x-axis
								svg.append("line")
										.attr("x1", 0)
										.attr("x2", width)
										.attr("y1", height - .5)
										.attr("y2", height - .5)
										.style("stroke", "#000");

						});
				}

				my.width = function(val) {
						if (!arguments.length) return width;
						width = val;
						return my;
				};

				my.height = function(val) {
						if (!arguments.length) return height;
						height = val;
						return my;
				};

				my.ticks = function(val) {
						if (!arguments.length) return ticks;
						ticks = val;
						return my;
				};

				my.show_bar_labels = function() {
						bar_label_height = 100;
						return my;
				};

				// my.y_label = function(val) {
				// 		if (!arguments.length) return y_label;
				// 		y_label = val;
				// 		return my;
				// };

				return my;
		}

		function _interpolate_undef_elems(num_list) {
				while (_.contains(num_list, undefined)) {
						var idx_first = _.indexOf(num_list, undefined)
						var idx_last = idx_first;
						while (idx_last < num_list.length &&
									 num_list[idx_last+1] == undefined) {
								idx_last++;
						}
						if (idx_first == 0) {
								for (var i = idx_first; i <= idx_last; i++) {
										num_list[i] = num_list[idx_last+1];
								}
								continue;
						}
						if (idx_last == num_list.length) {
								for (var i = idx_first; i < num_list.length; i++) {
										num_list[i] = num_list[idx_first-1];
								}
								continue;
						}
						var scale = d3.scale.linear()
								.domain([idx_first - 1, idx_last + 1])
								.range([num_list[idx_first - 1], num_list[idx_last + 1]]);
						for (var i = idx_first; i <= idx_last; i++) {
								num_list[i] = scale(i);
						}
				}
				return num_list;
		}

		function line_chart() {
				var chart_width = 500,
				chart_height = 200,
				margin = {top: 10, right: 100, bottom: 30, left: 45},
				y_label = '';

				function my(sel) {
						sel.each(function(chart_data) {
								var plot_width = chart_width - margin.left - margin.right,
								plot_height = chart_height - margin.top -margin.bottom;

								var data_max = _.max(
										_.map(chart_data.data_series,
													function(line_data) {
															return _.max(d3.values(line_data.points))}));

								var points_per_series = chart_data.x_labels.length - 1;
								var x = d3.scale.linear()
										.domain([0, points_per_series])
										.range([0, plot_width]),
								// TODO: consider using ordinal scale
								y = d3.scale.linear()
										.domain([0, data_max])
										.range([plot_height, 0])
								;

								var color = d3.scale.category20()
										.domain(
												_.map(chart_data, function(line_data) {
														return line_data.label; }));

								var xAxis = d3.svg.axis()
										.scale(x)
										.orient('bottom')
										.tickValues(_.range(chart_data.x_labels.length))
										.tickFormat(function(i) { return chart_data.x_labels[i]; });
								var yAxis = d3.svg.axis()
										.scale(y)
										.orient('left');

								var svg = d3.select(this).append("svg")
										.attr("class", "chart")
										.attr("width", chart_width)
										.attr("height", chart_height)
										.append("g")
										.attr("transform", "translate("+
													margin.left+","+margin.top+")");
								svg.append("g")
										.attr("class", "x axis")
										.attr("transform", "translate(0,"+(plot_height)+")")
										.call(xAxis);
								svg.append("g")
										.attr("class", "y axis")
										.call(yAxis)
										.append("text")
										.attr("transform", "rotate(-90)")
										.attr("y", 6)
										.attr("dy", ".71em")
										.style("text-anchor", "end")
										.text(y_label);

								var line = d3.svg.line()
										.x(function(d, i) { return x(i); })
										.y(function(d) { return y(d); });

								var _data_series_data_list = _.map(
										chart_data.data_series,
										function (ds) {
												return { label: ds.label,
																 values: _interpolate_undef_elems(
																		 _.map(chart_data.x_labels,
																					 function (x_label) {
																							 return ds.points[x_label]; })
																 )
															 };
										})

								var data_series = svg.selectAll(".data-series")
										.data(_data_series_data_list)
										.enter().append("g")
										.attr("class", "data-series");

								data_series.append("path")
										.attr("class", "line")
										.attr("d", function (d) {
												return line(d.values); })
										.style("stroke", function (d) {
												return color(d.label); });

								data_series.append("text")
										.datum(function(d) { return {
												label: d.label,
												last_value: d.values[d.values.length - 1]
										}; })
										.attr("transform", function(d) {
												return "translate("+x(points_per_series)+","+
														y(d.last_value)+")"; })
										.attr("x", 3)
										.attr("dy", ".35em")
										.text(function (d) { return d.label; });
						});
				}

				return my;
		}

		function stacked_bar_chart() {
				var chart_width = 500,
				chart_height = 200,
				margin = {top: 10, right: 150, bottom: 30, left: 45},
				y_label = '';

				function my(sel) {
						sel.each(function(chart_data) {
								var plot_width = chart_width - margin.left - margin.right,
								plot_height = chart_height - margin.top -margin.bottom;

								var x = d3.scale.ordinal()
										.domain(_.map(chart_data.bar_data, function (d) {
												return d.label; }))
										.rangeRoundBands([0, plot_width], .1);

								var y = d3.scale.linear()
										.domain([0, d3.max(_.map(chart_data.bar_data, function (d) {
												return _.reduce(d3.values(d.data),
																				function (x, y) { return x + y; });
										}))])
										.rangeRound([plot_height, 0]);

								var color = d3.scale.category20()
										.domain(chart_data.bar_types);

								var xAxis = d3.svg.axis()
										.scale(x)
										.orient("bottom");

								var yAxis = d3.svg.axis()
										.scale(y)
										.orient("left")
										.tickFormat(d3.format(".2s"));

								var svg = d3.select(this).append("svg")
										.attr("class", "chart")
										.attr("width", chart_width)
										.attr("height", chart_height)
										.append("g")
										.attr("transform", "translate("+
													margin.left+","+margin.top+")");
								svg.append("g")
										.attr("class", "x axis")
										.attr("transform", "translate(0,"+(plot_height)+")")
										.call(xAxis);
								svg.append("g")
										.attr("class", "y axis")
										.call(yAxis)
										.append("text")
										.attr("transform", "rotate(-90)")
										.attr("y", 6)
										.attr("dy", ".71em")
										.style("text-anchor", "end")
										.text(y_label);

								var _bar_data = _.map(chart_data.bar_data, function (d) {
										var vals = _.map(color.domain(), function (bar_type) {
												return {bar_type: bar_type, y_val: d.data[bar_type]}; });
										var curr_y = 0;
										var y_vals = []
										for (var i = 0; i < vals.length; i++) {
												y_vals.push({y0: curr_y, y1: curr_y+vals[i].y_val,
																		 color: vals[i].bar_type});
												curr_y += vals[i].y_val;
										}
										return {
												bars_label: d.label,
												y_vals: y_vals
										};
								});

								var bar_stack = svg.selectAll(".bar-stack")
										.data(_bar_data)
										.enter().append("g")
										.attr("class", "g")
										.attr("transform", function(d) {
												return "translate("+x(d.bars_label)+",0)"; });
								bar_stack.selectAll("rect")
										.data(function(d) { return d.y_vals; })
										.enter().append("rect")
										.attr("width", x.rangeBand())
										.attr("y", function(d) { return y(d.y1); })
										.attr("height", function(d) {
												return y(d.y0) - y(d.y1); })
										.attr("fill", function(d) { return color(d.color); })

								var legend = svg.selectAll(".legend")
										.data(color.domain().slice().reverse())
										.enter().append("g")
										.attr("class", "legend")
										.attr("transform", function(d, i) {
												return "translate(0," + i * 20 + ")"; });

								legend.append("rect")
										.attr("x", chart_width - margin.right)
										.attr("width", 18)
										.attr("height", 18)
										.style("fill", color);

								legend.append("text")
										.attr("x", chart_width - margin.right + 20)
										.attr("y", 9)
										.attr("dy", ".35em")
										.style("text-anchor", "beginning")
										.text(function(d) { return d; });


						});
				}

				return my;
		}

		return {
				bar_chart: bar_chart,
				stacked_bar_chart: stacked_bar_chart,
				line_chart: line_chart
		}

});
