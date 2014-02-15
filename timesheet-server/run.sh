#! /bin/sh

SQLITE_FILE=/tmp/timesheet.sqlite

if [ -f $SQLITE_FILE ]
then
		rm $SQLITE_FILE
fi

lein ring server-headless
