;; (ns timesheet-server.core
;; 		(:use [clojure.java.jdbc])
		(defproject timesheet-server "1.0.0-SNAPSHOT"
			:description "timesheet webapp"
			:dependencies [[org.clojure/clojure "1.4.0"]
			[compojure "1.1.6"]
			[korma "0.3.0-RC5"
			]
			;; :exclusions [org.clojure/java.jdbc]]
			;; [org.clojure/java.jdbc "0.1.1"]
			[org.xerial/sqlite-jdbc "3.7.2"]
			]
			:plugins [[lein-ring "0.7.1"]]
			:ring {:handler timesheet-server.core/app})
;; )