package steam

import (
	"fmt"
)

type FeaturedCategoriesResponse struct {
	Specials    FeaturedCategory `json:"specials"`
	TopSellers  FeaturedCategory `json:"top_sellers"`
	NewReleases FeaturedCategory `json:"new_releases"`
	ComingSoon  FeaturedCategory `json:"coming_soon"`
}

type FeaturedCategory struct {
	ID    string         `json:"id"`
	Name  string         `json:"name"`
	Items []FeaturedItem `json:"items"`
}

type FeaturedItem struct {
	Name        string `json:"name"`
	AppID       int    `json:"id"`
	HeaderImage string `json:"header_image"`
}


func (c *Client) GetFeaturedCategories() (*FeaturedCategoriesResponse, error) {
	var result FeaturedCategoriesResponse

	url := "https://store.steampowered.com/api/featuredcategories"

	_, err := c.HTTP.R().
		SetQueryParams(map[string]string{
			"cc": "BR",
			"l":  "pt-BR",
		}).
		SetResult(&result).
		Get(url)

	if err != nil {
		return nil, fmt.Errorf("steam featured categories error: %w", err)
	}

	return &result, nil
}
