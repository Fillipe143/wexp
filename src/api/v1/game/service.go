package game

import "wexp/src/clients/steam"

type Service struct {
	steam *steam.Client
}

func NewService(client *steam.Client) *Service {
	return &Service{steam: client}
}

func (s *Service) GetGame(appID string) (*steam.AppDetailsData, error) {
	return s.steam.GetGameDetails(appID)
}

func (s *Service) GetAchievements(appID string) ([]steam.Achievement, error) {
	return s.steam.GetAchievements(appID)
}

func (s *Service) SearchGames(query string) ([]steam.SearchItem, error) {
	return s.steam.SearchGames(query)
}

func (s *Service) Home() (any, error) {
	return s.steam.GetFeaturedCategories()
}
