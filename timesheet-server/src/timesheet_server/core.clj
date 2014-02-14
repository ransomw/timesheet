(ns timesheet-server.core
		(:gen-class :main true)
		(:use compojure.core)
		(:use korma.core)
		(:use korma.db)
		(:use clojure.java.io)
		;; (:use clojure.java.jdbc)
		(:require [compojure.route :as route])
		(:require [lobos.core :as lcore])
		(:require [lobos.connectivity :as lconn])
		(:require [lobos.schema :as ls])
		(:require [clojure.string :as string])
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
	 (ls/varchar :project 20)
	 (ls/varchar :category 20)
	 (ls/varchar :comment 1000)))

(defdb korma-db db)

(declare entry)

(defentity entry
	;; (pk :id)
	;; (table :entry)
	;; (database db)
	(entity-fields :date :time :project :category :comment)
	)

;; (insert entry (values {:date "entry-date"
;; 											:time "entry-time"
;; 											:project "entry-project"
;; 											:category "entry-category"
;; 											:comment "entry-comment"}))

(def timesheet-text-file (slurp "/tmp/timesheet.txt"))

(def text-file-date-entries (filter (fn [entry] (not (= entry "")))
	(string/split (get (string/split timesheet-text-file #"\n\f\f\n") 0 nil) #"\f")))

(defn store-text-file-entry [entry-date text-file-entry]
	(let [split-entry (string/split text-file-entry #"\n")]
		(let [entry-time (first split-entry)
				 entry-project (first (rest split-entry))
				 entry-category (first (rest (rest split-entry)))
				 entry-comment (rest (rest (rest split-entry)))]
		(insert entry (values {:date entry-date
													:time entry-time
													:project entry-project
													:category entry-category
													:comment (format "%s" entry-comment) }))

)))

(defn store-text-file-date-entry [date-entry]
	(let [split-entry (string/split date-entry #"\n#\n")]
			 (let [entry-date (string/trim (first split-entry))
						text-file-entries (rest split-entry)]
						(doseq [text-file-entry text-file-entries]
									 (store-text-file-entry entry-date text-file-entry))
						)))

(doseq [text-file-date-entry text-file-date-entries]
			 (store-text-file-date-entry text-file-date-entry ))

(defroutes app
	(GET "/" [] "<h1>Hello World</h1>")
	(route/not-found "<h1>Page not found</h1>"))
