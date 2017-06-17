export abstract class AsyncAware {
	asyncTasks: Set<Promise<any>>;

	constructor() {
		this.asyncTasks = new Set<Promise<any>>();
	}

	addAsyncTask(p: Promise<any>) {
		if (this.asyncTasks.size === 0) {
			this.onTasksStart();
		}
		const that = this;
		this.asyncTasks.add(p);
		p.then(() => {
			that.checkComplete(p);
		}).catch(() => {
			that.checkComplete(p);
		});
	};

	checkComplete(p) {
		this.asyncTasks.delete(p);
		if (this.asyncTasks.size === 0) {
			this.onTasksComplete();
		}
	}

	abstract onTasksComplete(): void;
	abstract onTasksStart(): void;
}


export function async(target, prop, descriptor) {
	const ctr = target.constructor;
	if (!(target instanceof AsyncAware)) {
		console.warn('Async decorator must be used for AsyncAware class');
		return;
	}
	const fn = ctr.prototype[prop];
	descriptor.value = function () {
		let promise = fn.apply(this, arguments);
		if (!(promise instanceof Promise)) {
			promise = Promise.resolve(promise);
		}
		this.addAsyncTask.call(this, promise);
		return promise;
	};
}
