package steam

type BoolInt bool

func (b *BoolInt) UnmarshalJSON(data []byte) error {
	s := string(data)

	if s == "1" || s == "true" || s == "\"1\"" || s == "\"true\"" {
		*b = true
		return nil
	}

	*b = false
	return nil
}

func (b BoolInt) Bool() bool {
	return bool(b)
}
