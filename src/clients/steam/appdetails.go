package steam

import "fmt"

type AppDetailsResponse map[string]AppDetailsWrapper

type AppDetailsWrapper struct {
	Success bool           `json:"success"`
	Data    AppDetailsData `json:"data"`
}

type AppDetailsData struct {
	SteamAppID int    `json:"steam_appid"`
	Name       string `json:"name"`

	RequiredAge int  `json:"required_age"`
	IsFree      bool `json:"is_free"`

	AboutTheGame string `json:"about_the_game"`
	ShortDesc    string `json:"short_description"`

	HeaderImage string `json:"header_image"`

	Developers []string `json:"developers"`
	Publishers []string `json:"publishers"`

	SupportedLanguages string `json:"supported_languages"`

	ReleaseDate ReleaseDate `json:"release_date"`
	Platforms   Platforms   `json:"platforms"`

	Categories []Category `json:"categories"`
	Genres     []Genre    `json:"genres"`

	PriceOverview *PriceOverview `json:"price_overview,omitempty"`
}

type ReleaseDate struct {
	ComingSoon bool   `json:"coming_soon"`
	Date       string `json:"date"`
}

type Platforms struct {
	Windows bool `json:"windows"`
	Mac     bool `json:"mac"`
	Linux   bool `json:"linux"`
}

type Category struct {
	ID          int    `json:"id"`
	Description string `json:"description"`
}

type Genre struct {
	ID          string `json:"id"`
	Description string `json:"description"`
}

type PriceOverview struct {
	Currency        string `json:"currency"`
	Initial         int    `json:"initial"`
	Final           int    `json:"final"`
	DiscountPercent int    `json:"discount_percent"`
}

func (c *Client) GetGameDetails(appID string) (*AppDetailsData, error) {
	var result AppDetailsResponse

	_, err := c.HTTP.R().
		SetQueryParams(map[string]string{
			"appids": appID,
		}).
		SetResult(&result).
		Get("https://store.steampowered.com/api/appdetails")

	if err != nil {
		return nil, err
	}

	game, ok := result[appID]
	if !ok || !game.Success {
		return nil, fmt.Errorf("game not found")
	}

	return &game.Data, nil
}
