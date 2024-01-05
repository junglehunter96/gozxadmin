package models

type Auth struct {
	ID       int    `gorm:"primary_key" json:"id"`
	Username string `json:"username"`
	Avatar   string `json:"avatar"`
	Password string `gorm:"-" json:"-"`
}

func Login(username, password string) (*Auth, error) {
	var auth Auth
	if err := db.Select("id, username").Where(Auth{Username: username, Password: password}).First(&auth).Error; err != nil {
		return nil, err
	}

	if auth.ID > 0 {
		return &auth, nil
	}

	return nil, nil
}
