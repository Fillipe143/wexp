package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Env struct {
	SteamAPIKey string
}

func LoadEnv() *Env {
	_ = godotenv.Load()

	return &Env{
		SteamAPIKey: os.Getenv("STEAM_API_KEY"),
	}
}
