;; (ns timesheet-server.core
;; 		(:use [clojure.java.jdbc])
		(defproject timesheet-server "1.0.0-SNAPSHOT"
			:description "timesheet webapp"
			:dependencies [[org.clojure/clojure "1.5.0"]
			[compojure "1.1.6"]
			[korma "0.3.0-RC5"
			]
			;; :exclusions [org.clojure/java.jdbc]]
			;; [org.clojure/java.jdbc "0.1.1"]
			[lobos "1.0.0-beta1"]
			[org.xerial/sqlite-jdbc "3.7.2"]
			[org.clojure/tools.nrepl "0.2.3"]
      [cheshire "5.3.1"]
			]
			:plugins [[lein-ring "0.8.10"]]
			:ring {:handler timesheet-server.core/app
			:port 3000
			:nrepl {:start? true, :port 9000}})
;; )