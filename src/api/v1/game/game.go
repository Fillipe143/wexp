package game

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Achievement struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type GameResponse struct {
	ID           int           `json:"id"`
	Name         string        `json:"name"`
	Achievements []Achievement `json:"achievements"`
}

const steamApiKey = "chave_aqui"

func GetGame(id string) (*GameResponse, error) {
	gameName, err := fetchGameName(id)
	if err != nil {
		return nil, err
	}

	achievements, err := fetchAchievements(id)
	if err != nil {
		return nil, err
	}

	return &GameResponse{
		Name:         gameName,
		Achievements: achievements,
	}, nil
}

func fetchGameName(id string) (string, error) {
	url := fmt.Sprintf(
		"https://store.steampowered.com/api/appdetails?appids=%s",
		id,
	)

	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var data map[string]interface{}

	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return "", err
	}

	rawGameData, ok := data[id]
	if !ok || rawGameData == nil {
		return "", fmt.Errorf("jogo não encontrado")
	}

	gameData, ok := rawGameData.(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("resposta inválida da Steam")
	}

	rawInnerData, ok := gameData["data"]
	if !ok || rawInnerData == nil {
		return "", fmt.Errorf("dados do jogo não encontrados")
	}

	innerData, ok := rawInnerData.(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("estrutura inválida")
	}

	name, ok := innerData["name"].(string)
	if !ok {
		return "", fmt.Errorf("nome do jogo não encontrado")
	}

	return name, nil
}

func fetchAchievements(id string) ([]Achievement, error) {
	url := fmt.Sprintf(
		"https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=%s&appid=%s",
		steamApiKey,
		id,
	)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var raw map[string]interface{}

	if err := json.NewDecoder(resp.Body).Decode(&raw); err != nil {
		return nil, err
	}

	rawGame, ok := raw["game"]
	if !ok || rawGame == nil {
		return []Achievement{}, nil
	}

	game, ok := rawGame.(map[string]interface{})
	if !ok {
		return []Achievement{}, nil
	}

	rawStats, ok := game["availableGameStats"]
	if !ok || rawStats == nil {
		return []Achievement{}, nil
	}

	stats, ok := rawStats.(map[string]interface{})
	if !ok {
		return []Achievement{}, nil
	}

	rawAchievements, ok := stats["achievements"]
	if !ok || rawAchievements == nil {
		return []Achievement{}, nil
	}

	achievementList, ok := rawAchievements.([]interface{})
	if !ok {
		return []Achievement{}, nil
	}

	achievements := []Achievement{}

	for _, item := range achievementList {
		achievementMap, ok := item.(map[string]interface{})
		if !ok {
			continue
		}

		name, _ := achievementMap["displayName"].(string)
		description, _ := achievementMap["description"].(string)

		achievements = append(achievements, Achievement{
			Name:        name,
			Description: description,
		})
	}

	return achievements, nil
}