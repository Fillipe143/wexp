package steam

import (
	"time"

	"github.com/go-resty/resty/v2"
)

type Client struct {
	HTTP *resty.Client
	Key  string
}

func New(apiKey string) *Client {
	return &Client{
		HTTP: resty.New().
			SetTimeout(10 * time.Second),
		Key: apiKey,
	}
}
