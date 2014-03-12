(ns timesheet-server.core
  (:gen-class :main true)
  (:use compojure.core)
  (:use clojure.java.io)
  ;; (:use clojure.java.jdbc)
  (:require [compojure.route :as route])
  (:require [timesheet-server.db :as db])
  (:require [cheshire.core :as cheshire])
  (:require [ring.middleware.jsonp :as jsonp])
  )

(try (db/load-text-file "/tmp/timesheet.txt")
     (catch java.io.FileNotFoundException e
       (prn "couldn't load timesheet from text file")))

;(jsonp/wrap-json-with-padding

(defroutes app
	(GET "/" [] "<h1>Hello World</h1>")
  (GET "/entries" []
       (cheshire/generate-string (db/get-entries))
       ;; {:status 200
       ;;  :headers {"Content-Type" "application/json"}
       ;;  :body (cheshire/generate-string (db/get-entries))}
       )
	(route/not-found "<h1>Page not found</h1>"))
