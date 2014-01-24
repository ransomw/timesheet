#! /usr/bin/python

import sys
import re
import itertools
from datetime import (
    datetime,
    timedelta,
    time,
    )

from pdb import set_trace as st
import ConfigParser
from os import path

# config = ConfigParser.ConfigParser()
# config.readfp(open('timesheet.conf'))
# st()

def sti():
    import inspect as i
    from inspect import getmembers as gm

class ParseError(Exception):
    pass

PG_BRK='\x0c'
DAY_BRK=PG_BRK
ENTRY_BRK='\x11'

DATE_RE = '-'.join([
        '(?P<year>\d{4})',
        '(?P<month>\d{1,2})',
        '(?P<day>\d{1,2})',
        ])
TIME_RE = '-'.join([
        '(?P<hour>\d{1,2})',
        '(?P<min>\d{2})',
        ])

CATS = [
    'Customer Support',
    'Design',
    'Meeting',
    'Programming',
    'Quality Assurance',
    'Research',
    'Tech Assistance',
    'Training',
    'Standby',
    'Studying',
    'Documentation',
    'Scope',
    'Discovery',
    'Testing',
    ]

PROJS_LIST_FILE = path.join(path.dirname(path.abspath(__file__)), 'projects.list')

f = open(PROJS_LIST_FILE)
PROJS = filter(
    lambda line: line[0] != '#',
    filter(
        lambda line: line != '',
        [line.strip() for line in f.readlines()]))
f.close()

XLS_FILE_PATH=None

# parse cmd line args
TXT_FILE_PATH=sys.argv[1]
if len(sys.argv) > 2:
    XLS_FILE_PATH=sys.argv[2]

f = open(TXT_FILE_PATH)
txt_file_lines = f.readlines()
f.close()

# two page breaks seperate  todo section
timesheet_lines = [l.strip('\n') for l in
                   txt_file_lines[:txt_file_lines.index(PG_BRK+PG_BRK+'\n')] ]

def isplit(iterable,splitters):
    return [list(g) for
            k,g in
            itertools.groupby(iterable,lambda x:x in splitters) if not k]

# list of lists
date_lines_list = isplit(timesheet_lines, (DAY_BRK,))

def ps_entry(lines):
    try:
        hours = float(lines[0])
        time_lines = filter(
            lambda l:
                re.match('^'+TIME_RE+'$', l) is not None,
            lines[1:])
        if len(time_lines) != 0:
            raise ParseError(
                "unexpected time stamps in entry with num hours",
                lines)
        non_time_lines = lines[1:]
    except ValueError:
        non_time_lines = filter(
            lambda l:
                re.match('^'+TIME_RE+'$', l) is None,
            lines)
        time_matches = filter(
            lambda m:
                m is not None,
            map(
                lambda l:
                    re.match('^'+TIME_RE+'$', l),
                lines))
        times = map(
            lambda m:
                time(
                *map(lambda s: int(m.group(s)), [
                        'hour',
                        'min',
                        ])),
            time_matches)
        hours = ((times[-1].hour - times[0].hour) +
                       (times[-1].minute - times[0].minute)/60.)
    try:
        proj = non_time_lines[0]
        cat = non_time_lines[1]
        desc = '\n'.join(non_time_lines[2:])
    except IndexError as e:
        raise ParseError(
            "not enough lines for valid description", e)
    if proj not in PROJS:
        raise ParseError(
            ("invalid project name."
             " valid project names are: "
             ) + ', '.join(PROJS)
            ,
            proj)
    if cat not in CATS:
        raise ParseError(
            ("invalid category."
             " valid categories are: "
             ) + ', '.join(CATS)
            ,
            cat)
    return {
            'hours': hours,
            'proj': proj,
            'cat': cat,
            'desc': desc,
            }


def ps_date_lines_list(lines):
    date_line = lines[0]
    m = re.match('^'+DATE_RE+'$', date_line)
    if m is None:
        raise ParseError("not a valid date line",
                         date_line)
    date = datetime(
        *map(lambda s: int(m.group(s)), [
                    'year',
                    'month',
                    'day',
                    ])).date()
    try:
        entries = map(ps_entry, isplit(lines[1:],  (ENTRY_BRK,)))
    except ParseError as e:
        raise e
    return (date, entries)

date_entries = map(ps_date_lines_list, date_lines_list)

if XLS_FILE_PATH is None:
    week_entries = []
    curr_week = []
    for date_entry in date_entries:
        if (date_entry[0].weekday() == 0 and
            len(curr_week) != 0):
            week_entries.append(curr_week)
            curr_week = []
        curr_week.append(date_entry)
    if len(curr_week) != 0:
        week_entries.append(curr_week)
    for week_entry in week_entries:
        print ''.join([
                "total hours for the week with dates ",
                str(week_entry[0][0]),
                " to ",
                str(week_entry[-1][0]),
                ])
        print str(
            reduce(
                lambda x, y: x + y,
                map(
                    lambda de:
                        reduce(
                        lambda x, y: x + y,
                        map(lambda task:
                                task['hours'], # total hours for task entry
                            de[1])),
                    week_entry)))
else:
    import xlwt
    book = xlwt.Workbook()
    sheet = book.add_sheet('timelog')
    task_entries = []
    for date_entry in date_entries:
        for task_entry in date_entry[1]:
            task_entry['date'] = date_entry[0]
            task_entry['desc'] = task_entry['desc'].replace('\n', '; ')
            task_entries.append(task_entry)
    for tentry in task_entries:
        tentry['hours_f'] = "%.2f" % tentry['hours']
    COL_ORDER = [
        'date',
        'desc',
        'proj',
        'hours_f',
        'cat',
        ]
    for i in range(len(task_entries)):
        map(lambda x:
                sheet.write(i, x[0],
                            str(task_entries[i][x[1]])),
            zip(range(len(COL_ORDER)), COL_ORDER))
    book.save(XLS_FILE_PATH)
