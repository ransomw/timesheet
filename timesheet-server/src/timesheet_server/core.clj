(ns timesheet-server.core
		(:gen-class :main true)
		(:use compojure.core)
		(:use korma.core)
		(:use korma.db)
		;; (:use clojure.java.jdbc)
		(:require [compojure.route :as route])
		(:require [lobos.core :as lcore])
		(:require [lobos.connectivity :as lconn])
		(:require [lobos.schema :as ls])
		)

;; (def db
;;   {:classname   "org.sqlite.JDBC"
;;    :subprotocol "sqlite"
;;    :subname     "/tmp/timesheet.sqlite"
;;   })

(def db (sqlite3 {:db "/tmp/timesheet.sqlite"}))

;; (use '(lobos connectivity core schema))

(lconn/open-global db)

(lcore/create
 (ls/table :entry
	 (ls/integer :id :primary-key)
	 (ls/varchar :date 10)
	 (ls/varchar :time 10)
	 (ls/varchar :comment 100)))

(defdb korma-db db)

(declare entry)

(defentity entry
	;; (pk :id)
	;; (table :entry)
	;; (database db)
	(entity-fields :date :time :comment)
	)

(insert entry (values {:date "today" :time "now" :comment "this"}))

(defroutes app
	(GET "/" [] "<h1>Hello World</h1>")
	(route/not-found "<h1>Page not found</h1>"))
