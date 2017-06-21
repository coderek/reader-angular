import {Injectable} from '@angular/core';
import {Feed} from '../../models/feed';
import {Entry} from '../../models/entry';

@Injectable()
export class StorageService {

	db: IDBDatabase = null;
	initPromise = null;

	constructor() {
		this.initPromise = this.initDb();
	}

	initDb() {
		return new Promise((res, rej) => {
			const openrequest = indexedDB.open('__reader__', 1);
			openrequest.onerror = (err) => {
				rej(err);
			};
			openrequest.onupgradeneeded = (ev) => {
				const db = openrequest.result;
				db.onerror = console.error;
				const entriesStore = db.createObjectStore('entries', {keyPath: 'url'});
				entriesStore.createIndex('read', 'read');
				entriesStore.createIndex('favorite', 'favorite');
				entriesStore.createIndex('feed_url', 'feed_url');
			};
			openrequest.onsuccess = (ev) => {
				this.db = openrequest.result;
				res();
			};
		});
	}

	async getFeeds(): Promise<Feed[]> {
		await this.initPromise;
		const feeds = [];
		const transaction = this.db.transaction(['feeds', 'entries']);
		return new Promise<Feed[]>((res, rej) => {
			const req = transaction.objectStore('feeds').openCursor();
			req.onsuccess = function () {
				const cursor = req.result;
				if (cursor) {
					const f = cursor.value;
					feeds.push(f);
					let count = 0;
					const entriesReq = transaction.objectStore('entries').index('feed_url').openCursor(IDBKeyRange.only(f.url));
					entriesReq.onsuccess = () => {
						const c = entriesReq.result;
						if (c) {
							if (!c.value.read) {
								count++;
							}
							c.continue();
						} else {
							f.unreadCount = count;
						}
					};
					cursor.continue();
				}
			};
			req.onerror = rej;
			transaction.oncomplete = () => {
				res(feeds);
			};
			transaction.onerror = console.error;
		})
	}

	async getEntries(conditions): Promise<Entry[]> {
		await this.initPromise;
		let entries = [];
		return new Promise<any[]>((res, rej) => {
			const req = this.db.transaction('entries').objectStore('entries').openCursor();
			req.onsuccess = (ev) => {
				const cursor = req.result;
				if (cursor) {
					if (matchConditions(cursor.value, conditions)) {
						entries.push(cursor.value);
					}
					cursor.continue();
				} else {
					entries = entries.sort((a, b) => {
						return b.published - a.published;
					});
					res(entries);
				}
			};
		})
	}

	async updateEntry(id, patch: {}): Promise<Entry> {
		await this.initPromise;
		const transaction = this.db.transaction('entries', 'readwrite');
		const req = transaction.objectStore('entries').get(id);
		let entry = null;
		req.onsuccess = (ev) => {
			entry = req.result;
			Object.assign(entry, patch);
			transaction.objectStore('entries').put(entry);
		};
		return new Promise<Entry>((res, rej) => {
			transaction.oncomplete = () => res(entry);
			transaction.onerror = rej;
		});
	}

	saveEntry(entry: Entry): Promise<Entry> {
		const transaction = this.db.transaction('entries', 'readwrite');
		transaction.objectStore('entries').put(entry);
		return new Promise((res, rej) => {
			transaction.oncomplete = () => res(entry);
			transaction.onerror = rej;
		});
	}

	/**
	 * Save feed and update unread count
	 * @param feed
	 * @returns {Promise<T>}
	 */
	async saveFeed(feed): Promise<Feed> {
		let unreadCount = await this.countUnreadEntries(feed.url);
		console.log(unreadCount);
		const transaction = this.db.transaction(['entries', 'feeds'], 'readwrite');
		const date = new Date();
		const entriesStore = transaction.objectStore('entries');
		const entrySaveProcesses = [];
		feed.entries.forEach(entry => {
			entry.feed_url = feed.url;
			if (entry.read === undefined) {
				entry.read = false;
			}
			if (entry.favorite === undefined) {
				entry.favorite = false;
			}
			if (Array.isArray(entry.published)) {
				const [y, m, d, h, M, s] = entry.published;
				entry.published = new Date(y, m - 1, d, h, M, s);
			}

			const req = entriesStore.get(entry.url);
			entrySaveProcesses.push(new Promise((res, rej) => {
				// add if absent
				req.onsuccess = (ev) => {
					if (!req.result) {
						console.log('Saved entry: ' + req.result);
						entry.last_pull = date;
						transaction.objectStore('entries').add(entry);
						unreadCount++;
					}
					res();
				};
				req.onerror = res;
			}));
		});

		Promise.all(entrySaveProcesses).then(() => {
			delete feed.entries;
			feed.last_pull = date;
			feed.unreadCount = unreadCount;

			transaction.objectStore('feeds').put(feed);
		});
		return await new Promise<Feed>((res, rej) => {
			transaction.oncomplete = () => {
				res(feed);
				console.log('Saved entries');
			};
			transaction.onerror = rej;
		})
	}

	countUnreadEntries(feedUrl): Promise<number> {
		const transaction = this.db.transaction('entries');
		const store = transaction.objectStore('entries');
		const idx = store.index('feed_url');
		const req = idx.openCursor(IDBKeyRange.only(feedUrl));
		let count = 0;
		req.onsuccess = () => {
			const cursor = req.result;
			if (cursor) {
				const entry: Entry = cursor.value;
				if (!entry.read) {
					count++;
				}
				cursor.continue();
			}
		};
		return new Promise((res, rej) => {
			transaction.oncomplete = () => {
				res(count);
			}
		});
	}

	countNewerEntries(feed: Feed, boundary: Number) {
		const transaction = this.db.transaction('entries');
		const store = transaction.objectStore('entries');
		const idx = store.index('feed_url');
		const req = idx.openCursor(IDBKeyRange.only(feed.url));
		let count = 0;
		req.onsuccess = () => {
			const cursor = req.result;
			if (cursor) {
				const entry: Entry = cursor.value;
				if (entry.last_pull && entry.last_pull.valueOf() > boundary && !entry.read) {
					count++;
				}
				cursor.continue();
			}
		};
		return new Promise((res, rej) => {
			transaction.oncomplete = () => {
				res(count);
			}
		});
	}

	async getFeed(url) {
		await this.initPromise;
		return new Promise((res, rej) => {
			const req = this.db.transaction('feeds').objectStore('feeds').get(url);
			req.onsuccess = (ev) => {
				res(req.result);
			}
		});

	}

	deleteFeed(feedUrl): Promise<string> {
		const transaction = this.db.transaction(['entries', 'feeds'], 'readwrite');
		const store = transaction.objectStore('entries');
		const idx = store.index('feed_url');
		const req = idx.openKeyCursor(IDBKeyRange.only(feedUrl));
		req.onsuccess = (ev) => {
			const cursor = req.result;
			if (cursor) {
				store.delete(cursor.primaryKey);
				cursor.continue();
			} else {

			}
		};
		transaction.objectStore('feeds').delete(feedUrl);
		return new Promise<string>((res, rej) => {
			transaction.oncomplete = () => {
				res(feedUrl);
				console.log('Deleted feedUrl and its entries');
			};
			transaction.onerror = rej;
		});
	}

	markAllRead(feedUrl): Promise<void> {
		const transaction = this.db.transaction('entries', 'readwrite');
		const entriesStore = transaction.objectStore('entries');
		const idx = entriesStore.index('feed_url');
		const req = idx.openCursor(IDBKeyRange.only(feedUrl));
		req.onsuccess = () => {
			const cursor = req.result;
			if (cursor) {
				const entry = cursor.value as Entry;
				entry.read = true;
				entriesStore.put(entry);
				cursor.continue();
			}
		}
		return new Promise<void>((res, rej) => {
			transaction.oncomplete = () => res();
			transaction.onerror = rej;
		});
	}
}


function matchConditions(target, conditions = {}) {
	for (const prop in conditions) {
		if (target[prop] !== conditions[prop]) {
			return false;
		}
	}
	return true;
}
