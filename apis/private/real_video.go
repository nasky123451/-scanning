package api

import(
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	db "github.com/web/DBConnector"

)

type SearchShowCamera struct {
	IP     string `json:"ip" form:"ip"`
	Port   string `json:"port" form:"port"`
}

type ShowCamera struct {
	ID         string `json:"id" form:"id"`
	IP         string `json:"ip" form:"ip"`
}

func UpdateShowCamera(c *gin.Context){

	search := new(SearchShowCamera)
	c.BindQuery(&search)

	rows, err := db.SqlDB.Query("UPDATE ShowCamera SET IP=? , port=? WHERE ID=?", search.IP, search.Port, 1)
	defer rows.Close();

	if err != nil {
		fmt.Println("[ERROR]Get camera", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "獲取失敗!",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}