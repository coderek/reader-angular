import requests
from lxml.html.clean import Cleaner
import feedparser
import pytz

from datetime import datetime
from time import mktime, localtime
from datetime import datetime, timedelta

def test_feed(count):
    feed = """<?xml version="1.0" encoding="utf-8"?>
		<feed xmlns="http://www.w3.org/2005/Atom">
		
		<title>Example Feed</title>
		<link href="http://example.org/"/>
		<updated>2003-12-13T18:30:02Z</updated>
		<author>
		<name>John Doe</name>
		</author>
		<id>urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6</id>
    """
    entry = """
     <entry>
       <title>Atom-Powered Robots Run Amok</title>
       <link href="http://example.org/2003/12/13/atom03{id}"/>
       <id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a{id}</id>
       <updated>{updated}</updated>
       <etag>{id}</etag>
       <summary>Some text.{id}</summary>
     </entry>
    """
    print("Counter: " + str(count))
    for i in range(count):
        feed += entry.format(id=i, updated=(datetime.now() - timedelta(days=100-i)))
    return feed + "</feed>"


test_feed_url = "test_feed"


def fetch_feed(url, count):
    if url == test_feed_url:
        text = test_feed(count)
    else:
        text = requests.get(url, timeout=10).text
    
    d = feedparser.parse(text)
    
    feed = get_feed_obj(d)
    feed['entries'] = []
    feed['url'] = url
    
    for _, entry_item in enumerate(d['entries']):
        try:
            feed['entries'].append(get_entry_obj(entry_item))
        except:
            pass
    
    return feed


def get_feed_obj(source):
    f = source.feed
    published_parsed = (
        f.published_parsed
        if 'published_parsed' in f else (
            f.updated_parsed if 'updated_parsed' in f else localtime()
        )
    )
    last_modified = published_parsed
    
    return {
        'title': f.get('title'),
        'description': f.get('description'),
        'etag': source.get('etag', ''),
        'last_modified': last_modified,
    }


def get_entry_obj(source):
    published = (
        source.published_parsed
        if 'published_parsed' in source else (
            source.updated_parsed
            if 'updated_parsed' in source else localtime()
        )
    )
    try:
        content = source.content[0].get('value')
    except:
        content = '<p></p>'
    
    try:
        summary = source.description
    except:
        summary = '<p></p>'
    
    return {
        'title': source.title,
        'url': source.link,
        'author': source.author if 'author' in source else '',
        'summary': wash_html(summary),
        'content': wash_html(content),
        'published': published,
        'uuid': source.id + '+' + source.link if 'id' in source else source.title,
    }


def wash_html(html):
    attrs = Cleaner.safe_attrs
    Cleaner.safe_attrs = attrs - frozenset(['width', 'height'])
    c = Cleaner()
    cleaned = c.clean_html(html)
    return cleaned
