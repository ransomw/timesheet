(ns timesheet-server.core
		(:gen-class :main true)
		(:use compojure.core)
		(:use korma.core)
		;; (:use clojure.java.jdbc)
		(:require [compojure.route :as route]))

;; (def db
;;   {:classname   "org.sqlite.JDBC"
;;    :subprotocol "sqlite"
;;    :subname     "/tmp/timesheet.sqlite"
;;   })

(use 'korma.db)

(def db (sqlite3 {:db "/tmp/timesheet.sqlite"}))

(defdb korma-db db)

(declare entry)

(defentity entry
	;; (pk :id)
	;; (table :entry)
	;; (database db)
	(entity-fields :date :time :comment)
	)

;; (insert entry (values {:date "today" :time "now" :comment "this"}))

(defroutes app
	(GET "/" [] "<h1>Hello World</h1>")
	(route/not-found "<h1>Page not found</h1>"))
