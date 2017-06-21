export interface Feed {
	title: string;
	description: string;
	etag: string;
	url: string;
	last_modified: Date;
	last_pull: Date;
	unreadCount: number;
	loading?: boolean;
	category: string;
}
