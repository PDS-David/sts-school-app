#!/usr/bin/env python3
"""DEFERRED: compare non-SS1 row captures from designated base/candidate evidence.
Input arrays use ingestTopics Row keys. Does not query databases or run imports.
"""
import argparse
import json
if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--before', required=True)
    p.add_argument('--after', required=True)
    a = p.parse_args()
    before = json.load(open(a.before)); after = json.load(open(a.after))
    select = lambda rows: [r for r in rows if r['className'] != 'SS 1']
    if not select(before): raise SystemExit('No protected rows supplied; empty comparison is not preservation evidence')
    if select(before) != select(after): raise SystemExit('Protected row objects or relative order changed')
    print('Supplied non-SS1 row captures are exactly equal; this is not certification of an unknown baseline')
