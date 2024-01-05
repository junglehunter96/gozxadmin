package v1

import (
	"github.com/gin-gonic/gin"
	"github.com/junglehunter96/gin-example/models"
	"github.com/junglehunter96/gin-example/pkg/e"
	"github.com/junglehunter96/gin-example/pkg/util"
	"net/http"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c *gin.Context) {

	var user User
	err := c.BindJSON(&user)

	data := make(map[string]interface{})
	code := e.INVALID_PARAMS
	if err == nil {
		user, err := models.Login(user.Username, user.Password)
		if err != nil {
			code = e.ERROR_AUTH
		} else {
			token, err := util.GenerateToken(user.Username, user.Password)
			if err != nil {
				code = e.ERROR_AUTH_TOKEN
			} else {
				data["token"] = token
				data["ID"] = user.ID
				data["Username"] = user.Username
				code = e.SUCCESS
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    code,
		"message": e.GetMessage(code),
		"data":    data,
	})
}
