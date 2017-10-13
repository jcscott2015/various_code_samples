/**
 * Created by jscott on 5/30/2017.
 */
(function() {
	'use strict';

	describe('directive: time-counter', function() {
		var element, attr, isolatedEl, isolatedAttr, scope, $compile, $interval;

		// TODO: Figure out how to connect constants to specs.
		var DATE_TIME_FORMAT = "MMMM Do YYYY, h:mm:ss A";

		beforeEach(function() {
			module('app.shared');

			inject(function(_$compile_, _$rootScope_, _$interval_) {
				$compile = _$compile_;
				$interval = _$interval_;
				scope = _$rootScope_.$new();
			});

			jasmine.clock().install();
		});

		afterEach(function() {
			jasmine.clock().uninstall();
		});

		function getCompiledElement(el) {
			var ngEl = angular.element(el);
			var compiledElement = $compile(ngEl)(scope);
			scope.$digest();
			return compiledElement;
		}

		function elapsedTime(startTime) {
			var d = moment().diff(moment(startTime));
			var t = {
				day: moment.duration(d).get('days'),
				hour: moment.duration(d).get('hours'),
				minute: moment.duration(d).get('minutes'),
				second: moment.duration(d).get('seconds')
			};
			return moment(t).toDate();
		}

		function testIncrement(startTime, format, toBe) {
			var baseTime = moment().toDate(); // baseTime is now.
			var elapsed = (startTime !== null) ? elapsedTime(startTime) : baseTime;
			jasmine.clock().mockDate(baseTime); // Set base time for comparison.
			jasmine.clock().tick(1000); // Increment time for comparison.

			$interval.flush(1000); // Increment interval for comparison.

			if (toBe) {
				expect(element.text()).toBe(moment(elapsed.valueOf() + 1000).format(format));
				expect(attr.text()).toBe(moment(elapsed.valueOf() + 1000).format(format));
			} else {
				expect(element.text()).not.toBe(moment(elapsed.valueOf() + 1000).format(format));
				expect(attr.text()).not.toBe(moment(elapsed.valueOf() + 1000).format(format));
			}
		}

		describe('directive: time-counter shows current time with default format', function() {
			beforeEach(function() {
				element = getCompiledElement('<time-counter></time-counter>');
				attr = getCompiledElement('<div time-counter></div>');
				isolatedEl = element.isolateScope();
				isolatedAttr = attr.isolateScope();
			});

			describe('with state and starttime attributes undefined', function() {
				var now = moment().format(DATE_TIME_FORMAT);

				it("should display current time with default format", function() {
					expect(isolatedEl.state).toBeUndefined();
					expect(isolatedEl.starttime).toBeUndefined();
					expect(element.text()).toBe(now);

					expect(isolatedAttr.state).toBeUndefined();
					expect(isolatedAttr.starttime).toBeUndefined();
					expect(attr.text()).toBe(now);
				});

				it("should display incremented current time with default format", function() {
					testIncrement(null, DATE_TIME_FORMAT, true);
				});
			});
		});

		describe('directive: time-counter shows current time with custom format', function() {
			beforeEach(function() {
				scope.format = "HH:mm:ss";
				element = getCompiledElement('<time-counter format="{{format}}"></time-counter>');
				attr = getCompiledElement('<div time-counter format="{{format}}"></div>');
				isolatedEl = element.isolateScope();
				isolatedAttr = attr.isolateScope();
			});

			describe('with format attribute defined; state and starttime attributes undefined', function() {
				it("should display current time with custom format", function() {
					var now = moment().format(isolatedEl.format);

					expect(isolatedEl.format).toBeDefined();
					expect(isolatedEl.state).toBeUndefined();
					expect(isolatedEl.starttime).toBeUndefined();
					expect(element.text()).toBe(now);

					expect(isolatedAttr.format).toBeDefined();
					expect(isolatedAttr.state).toBeUndefined();
					expect(isolatedAttr.starttime).toBeUndefined();
					expect(attr.text()).toBe(now);
				});

				it("should display incremented current time with custom format", function() {
					testIncrement(null, isolatedEl.format, true);
				});
			});
		});

		describe('directive: time-counter shows start time from device createdOn timestamp', function() {
			beforeEach(function() {
				scope.format = "HH:mm:ss";
				scope.starttime = "2017-06-06T07:19:57.597Z"; // Tue June 6 2017 17:19:57 GMT-0700 (Pacific Daylight Time)
				element = getCompiledElement('<time-counter format="{{format}}" starttime="starttime"></time-counter>');
				attr = getCompiledElement('<div time-counter format="{{format}}" starttime="starttime"></div>');
				isolatedEl = element.isolateScope();
				isolatedAttr = attr.isolateScope();
			});

			describe('with format and starttime attributes defined; state attribute undefined', function() {
				it("should display device createdOn timestamp with custom format", function() {
					expect(isolatedEl.format).toBeDefined();
					expect(isolatedEl.state).toBeUndefined();
					expect(isolatedEl.starttime).toBeDefined();
					expect(element.text()).toBe(moment(isolatedEl.starttime).format(isolatedEl.format));

					expect(isolatedAttr.format).toBeDefined();
					expect(isolatedAttr.state).toBeUndefined();
					expect(isolatedAttr.starttime).toBeDefined();
					expect(attr.text()).toBe(moment(isolatedAttr.starttime).format(isolatedAttr.format));
				});
			});
		});

		describe('directive: time-counter initializes elapsed time display', function() {
			beforeEach(function() {
				scope.format = "H [hours] m [mins] s [secs]";
				scope.state = "stop";
				scope.starttime = "2017-06-06T07:19:57.597Z"; // Tue June 6 2017 17:19:57 GMT-0700 (Pacific Daylight Time)
				element = getCompiledElement('<time-counter format="{{format}}" state="state" starttime="starttime"></time-counter>');
				attr = getCompiledElement('<div time-counter format="{{format}}" state="state" starttime="starttime"></div>');
				isolatedEl = element.isolateScope();
				isolatedAttr = attr.isolateScope();
			});

			describe('with state and starttime attributes defined', function() {
				it("should display elapsed timer with attribute values from scope", function() {
					expect(isolatedEl.format).toBe("H [hours] m [mins] s [secs]");
					expect(isolatedEl.state).toBe("stop");
					expect(isolatedEl.starttime).toBe("2017-06-06T07:19:57.597Z");

					expect(isolatedAttr.format).toBe("H [hours] m [mins] s [secs]");
					expect(isolatedAttr.state).toBe("stop");
					expect(isolatedAttr.starttime).toBe("2017-06-06T07:19:57.597Z");
				});
			});

			describe('when changing the state to start', function() {
				beforeEach(function() {
					scope.state = "start";
					scope.$digest();
				});

				it("timer should start", function() {
					expect(isolatedEl.state).toBe("start");
					expect(isolatedAttr.state).toBe("start");
				});

				it("timer should increment with custom format", function() {
					testIncrement(scope.starttime, isolatedEl.format, true);
				});
			});

			describe('when changing the state to stop', function() {
				beforeEach(function() {
					scope.state = "stop";
					scope.$digest();
				});

				it("timer should stop", function() {
					expect(isolatedEl.state).toBe("stop");
					expect(isolatedAttr.state).toBe("stop");
				});

				it("timer should not increment with custom format", function() {
					testIncrement(scope.starttime, isolatedEl.format, false);
				});
			});

			describe('when changing the state to pause', function() {
				beforeEach(function() {
					scope.state = "pause";
					scope.$digest();
				});

				it("timer should pause", function() {
					expect(isolatedEl.state).toBe("pause");
					expect(isolatedAttr.state).toBe("pause");
				});

				it("timer should not increment with custom format", function() {
					testIncrement(scope.starttime, isolatedEl.format, false);
				});
			});

			describe('when changing the state to reset', function() {
				beforeEach(function() {
					scope.state = "reset";
					scope.$digest();
				});

				it("timer should reset", function() {
					var isolatedEl = element.isolateScope();
					var isolatedAttr = attr.isolateScope();
					expect(isolatedEl.state).toBe("reset");
					expect(isolatedAttr.state).toBe("reset");
					expect(element.text()).toBe(moment().day(0).hour(0).minute(0).second(0).format(isolatedEl.format));
					expect(attr.text()).toBe(moment().day(0).hour(0).minute(0).second(0).format(isolatedAttr.format));
				});
			});
		});
	});
}());