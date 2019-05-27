package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/healthcheck", func(w http.ResponseWriter, r *http.Request) {

	})

	port := ":8181"

	log.Printf("Healthcheck Started on port %s", port)

	log.Fatal(http.ListenAndServe(port, nil))
}
