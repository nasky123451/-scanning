package api

import (
	"fmt"
	"net/http"

	db "github.com/web/DBConnector"
	"github.com/gin-gonic/gin"
)

type LogSearch struct {
	Start    string `json:"start" form:"start"`
	End      string `json:"end" form:"end"`
	UserName string `json:"username" form:"username"`
	IP       string `json:"ip" form:"ip"`
}

type Log struct {
	Username string `json:"username" form:"username"`
	Time     string `json:"time" form:"time"`
	IP       string `json:"ip" form:"ip"`
	Action   string `json:"action" form:"action"`
}

func GetUserLogs(c *gin.Context) {

	rows, err := db.SqlDB.Query("SELECT Username, Time, IP, Action FROM userlog LEFT JOIN auth ON userlog.UID=auth.ID WHERE Action=?", "Login")

	defer rows.Close()

	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"status": -1,
			"msg":    "SQL Failed!",
		})
		fmt.Println(err)
		return
	}

	var logs []Log

	for rows.Next() {
		var log Log
		rows.Scan(&log.Username, &log.Time, &log.IP, &log.Action)
		logs = append(logs, log)
	}

	c.JSON(http.StatusOK, logs)
}
