(ns timesheet-server.core
  (:gen-class :main true)
  (:use compojure.core)
  (:use clojure.java.io)
  ;; (:use clojure.java.jdbc)
  (:require [compojure.route :as route])
  (:require [timesheet-server.db :as db])
  )

(db/load-text-file "/tmp/timesheet.txt")

(defroutes app
	(GET "/" [] "<h1>Hello World</h1>")
	(route/not-found "<h1>Page not found</h1>"))
