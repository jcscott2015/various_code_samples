/**
 * Created by jscott on 5/25/2017.
 */
(function () {
	'use strict';

	angular
		.module('app.shared')
		.directive('timeCounter', ['$interval', function ($interval) {

			/**
			 * Directive that either displays a date time string or a countdown timer.
			 * The countdown timer uses start and stop controls from parent controller.
			 *
			 * @usage
			 * for clock with default formatting:
			 * <time-counter></time-counter>
			 * or <div time-counter></div>
			 *
			 * for clock with formatting:
			 * <time-counter format="h:mma"></time-counter>
			 * or <div time-counter format="h:mma"></div>
			 *
			 * for timer with formatting:
			 * <time-counter format="H [hours] m [mins] s [secs]" starttime="startTime" state="runState"></time-counter>
			 * or <div time-counter format="H [hours] m [mins] s [secs]" starttime="startTime" state="runState"></div>
			 *
			 * display static startTime (no state attribute):
			 * <time-counter format="h:mma" starttime="startTime"></time-counter>
			 * or <div time-counter format="h:mma" starttime="startTime"></div>
			 *
			 * @param scope       passed format string, startTime scope, and state scope: "start", "stop", "pause", or "reset".
			 * @param element     directive element
			 * @param attr        element attributes
			 */
			function link(scope, element, attr) {
				var format = scope.format || DATE_TIME_FORMAT;
				var startTime;
				var timeoutId;
				
				// If the state and starttime attributes are not defined, show the clock.
				if ((typeof attr.state === "undefined") && (typeof attr.starttime === "undefined")) {
					updateTime();
					timeoutId = $interval(updateTime, 1000);
				} else {
					scope.$watch("starttime", function (value) {
						startTime = value;
						if ((typeof startTime !== "undefined") && (startTime !== null)) {
							element.text(moment(startTime).format(format));
						}
					});

					scope.$watch("state", function (state) {
						if (state == "start") {
							start();
							timeoutId = $interval(start, 1000);
						} else if (state == "stop" || state == "pause") {
							element.text(elapsedTime());
							stop();
						} else if (state == "reset") {
							element.text(moment().day(0).hour(0).minute(0).second(0).format(format));
						}
					});
				}

				function updateTime() {
					element.text(moment().format(format));
				}

				function start() {
					element.text(elapsedTime());
				}

				function stop() {
					$interval.cancel(timeoutId);
				}

				function elapsedTime() {
					var d = moment().diff(moment(startTime));
					var t = {
						day: moment.duration(d).get('days'),
						hour: moment.duration(d).get('hours'),
						minute: moment.duration(d).get('minutes'),
						second: moment.duration(d).get('seconds')
					};
					return moment(t).format(format);
				}

				element.on('$destroy', stop);
			}

			return {
				link: link,
				scope: {
					format: "@",
					state: '=',
					starttime: "="
				}
			};
		}]);
}());