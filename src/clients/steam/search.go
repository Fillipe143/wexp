package steam

import "fmt"

type SearchResponse struct {
	Total int          `json:"total"`
	Items []SearchItem `json:"items"`
}

type SearchItem struct {
	Type  string `json:"type"`
	Name  string `json:"name"`
	AppID int    `json:"id"`

	TinyImage string `json:"tiny_image"`

	MetaScore string `json:"metascore"`

	Platforms Platforms `json:"platforms"`

	StreamingVideo bool `json:"streamingvideo"`

	ControllerSupport string `json:"controller_support,omitempty"`

	Price *SearchPrice `json:"price,omitempty"`
}

type SearchPrice struct {
	Currency string `json:"currency"`
	Initial  int    `json:"initial"`
	Final    int    `json:"final"`
}

func (c *Client) SearchGames(term string) ([]SearchItem, error) {
	var result SearchResponse

	url := fmt.Sprintf(
		"https://store.steampowered.com/api/storesearch/?term=%s&l=pt-BR&cc=BR",
		term,
	)

	_, err := c.HTTP.R().
		SetResult(&result).
		Get(url)

	if err != nil {
		return nil, err
	}

	if result.Items == nil {
		return []SearchItem{}, nil
	}

	return result.Items, nil
}
