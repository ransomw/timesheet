(ns timesheet-client.core
  (:require [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]))

(enable-console-print!)

;; (println "Hello world!")

(def app-state (atom
                {:text "Hello world!"
                 :time-by-day
                 [
                  {:day "monday" :time 4}
                  {:day "tuesday" :time 2}
                  {:day "wednesday" :time 6}
                  ]
                 }))

(om/root
  (fn [app owner]
    ;; (dom/h1 nil (:text app))
    (apply dom/ul nil
           (map (fn [text] (dom/li nil text))
                (map (fn [entry] (:day entry))
                       (:time-by-day app))))
    )
  app-state
  {:target (. js/document (getElementById "app"))})
