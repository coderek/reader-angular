import {async, AsyncAware} from './async';
import {fakeAsync, tick} from '@angular/core/testing';
fdescribe('Async decorator', function () {
	it('should call callbacks on simple tasks', fakeAsync(function () {
		class TestAsync extends AsyncAware {
			constructor() {
				super();
			}
			onTasksStart() {
			}
			onTasksComplete() {
			}

			@async
			gSimpleTask() {
				return Promise.resolve(100);
			}

			@async
			gAsyncTask() {
				const p = new Promise((res, rej) => {
					setTimeout(() => {
						res();
					}, 100);
				});
				return p;
			}
		}
		const target = new TestAsync();

		spyOn(target, 'onTasksStart');
		spyOn(target, 'onTasksComplete');

		target.gSimpleTask();
		target.gAsyncTask();
		expect(target.asyncTasks.size).toBe(2);
		tick(100);
		expect(target.asyncTasks.size).toBe(0);
		expect(target.onTasksStart).toHaveBeenCalledTimes(1);
		expect(target.onTasksComplete).toHaveBeenCalledTimes(1);
	}));

})
