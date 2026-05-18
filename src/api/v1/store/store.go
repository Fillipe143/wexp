package store

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Game struct {
	ID              int    `json:"appid"`
	Name            string `json:"name"`
	HeaderImage     string `json:"header_image"`
	DiscountPercent int    `json:"discount_percent"`
	FinalPrice      int    `json:"final_price"`
}

type HomeResponse struct {
	TopSellers []Game `json:"top_sellers"`
	NewReleases []Game `json:"new_releases"`
	Specials []Game `json:"specials"`
}

type featuredResponse struct {
	TopSellers struct {
		Items []steamGame `json:"items"`
	} `json:"top_sellers"`

	NewReleases struct {
		Items []steamGame `json:"items"`
	} `json:"new_releases"`

	Specials struct {
		Items []steamGame `json:"items"`
	} `json:"specials"`
}

type steamGame struct {
	ID              int    `json:"id"`
	Name            string `json:"name"`
	HeaderImage     string `json:"header_image"`
	DiscountPercent int    `json:"discount_percent"`
	FinalPrice      int    `json:"final_price"`
}

func GetHome() (*HomeResponse, error) {
	url := "https://store.steampowered.com/api/featuredcategories"

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	fmt.Println("Steam status:", resp.Status)

	var data featuredResponse

	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	return &HomeResponse{
		TopSellers: removeDuplicates(convertGames(data.TopSellers.Items)),
		NewReleases: removeDuplicates(convertGames(data.NewReleases.Items)),
		Specials: removeDuplicates(convertGames(data.Specials.Items)),
	}, nil
}

func convertGames(items []steamGame) []Game {
	games := []Game{}

	for _, item := range items {
		games = append(games, Game{
			ID: item.ID,
			Name: item.Name,
			HeaderImage: item.HeaderImage,
			DiscountPercent: item.DiscountPercent,
			FinalPrice: item.FinalPrice,
		})
	}

	return games
}

func removeDuplicates(games []Game) []Game {
	seen := make(map[int]bool)

	result := []Game{}

	for _, game := range games {
		if seen[game.ID] {
			continue
		}

		seen[game.ID] = true
		result = append(result, game)
	}

	return result
}