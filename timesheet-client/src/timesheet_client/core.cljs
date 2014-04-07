 (ns timesheet-client.core
  (:require [cljs.reader :as reader]
            [goog.events :as events]
            [goog.dom :as gdom]
            [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true])
  (:import [goog.net XhrIo]
           goog.net.EventType
           [goog.events EventType]))

(enable-console-print!)

(defn get-entries-string [on-complete]
  (let [xhr (XhrIo.)
        url "entries"]
    (events/listen xhr goog.net.EventType.COMPLETE
      (fn [e]
        (on-complete (reader/read-string (.getResponseText xhr)))))
    (. xhr
      (send url "GET" nil
        #js {"Content-Type" "application/json"}))))

(println "getting entries string")
(get-entries-string (fn [entries-string] (println entries-string)))

;; (defn edn-xhr [{:keys [method url data on-complete]}]
;;   (let [xhr (XhrIo.)]
;;     (events/listen xhr goog.net.EventType.COMPLETE
;;       (fn [e]
;;         (on-complete (reader/read-string (.getResponseText xhr)))))
;;     (. xhr
;;       (send url (meths method) (when data (pr-str data))
;;         #js {"Content-Type" "application/edn"}))))

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
