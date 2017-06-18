import {async, AsyncAware} from './async';
import {fakeAsync, tick} from '@angular/core/testing';

describe('Async decorator', function () {
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


	it('should call callbacks on simple tasks', fakeAsync(function () {

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

	it('should reuse the task queue', fakeAsync(function () {

		spyOn(target, 'onTasksStart');
		spyOn(target, 'onTasksComplete');

		target.gSimpleTask();
		target.gAsyncTask();
		target.gAsyncTask();

		expect(target.asyncTasks.size).toBe(3);
		tick(100);
		expect(target.asyncTasks.size).toBe(0);
		expect(target.onTasksStart).toHaveBeenCalledTimes(1);
		expect(target.onTasksComplete).toHaveBeenCalledTimes(1);
	}));
});
