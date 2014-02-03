(defproject timesheet-server "1.0.0-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[org.clojure/clojure "1.4.0"]
	[compojure "1.1.6"]]
	:plugins [[lein-ring "0.7.1"]]
	:ring {:handler timesheet-server.core/app})