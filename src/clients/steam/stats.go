package steam

type Achievement struct {
	APIName     string  `json:"name"`
	DisplayName string  `json:"displayName"`
	Description string  `json:"description"`
	Icon        string  `json:"icon"`
	IconGray    string  `json:"icongray"`
	Hidden      BoolInt `json:"hidden"`
}

type AchievementResponse struct {
	Game struct {
		AvailableGameStats struct {
			Achievements []Achievement `json:"achievements"`
		} `json:"availableGameStats"`
	} `json:"game"`
}

func (c *Client) GetAchievements(appID string) ([]Achievement, error) {
	var result AchievementResponse

	_, err := c.HTTP.R().
		SetQueryParams(map[string]string{
			"key":   c.Key,
			"appid": appID,
		}).
		SetResult(&result).
		Get("https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2")

	if err != nil {
		return nil, err
	}

	achievements := result.Game.AvailableGameStats.Achievements
	if len(achievements) == 0 {
		return []Achievement{}, nil
	}

	return achievements, nil
}
