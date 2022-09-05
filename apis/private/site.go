package api

import (
	"fmt"
	"net/http"
	"strconv"
	"net"
	"log"
	"io"

	db "github.com/web/DBConnector"
	"github.com/gin-gonic/gin"
)

type Site struct {
	ID         string `json:"id" form:"id"`
	Site         string `json:"site" form:"site"`
	Lot        string `json:"lot" form:"lot"`
	Product    string `json:"product" form:"product"`
	Name       string `json:"name" form:"name"`
	LastTime   string `json:"lasttime" form:"lasttime"`
	Ping       string `json:"ping" form:"ping"`
	Port       string `json:"port" form:"port"`
	Temperature     string `json:"temperature" form:"temperature"`
	Status     string `json:"status" form:"status"`
	Show     string `json:"show" form:"show"`
}

var conn net.Conn
//GetSites is get sites
func GetSites(c *gin.Context) {
	sitetype := c.PostForm("type")

	sql:=""
	sql = fmt.Sprintf("SELECT ID, Site, Lot, Product, Name, LastTime, ping, port, temperature, status, showmenu FROM site")

	if sitetype != "" {
		sql += fmt.Sprintf(" WHERE Lot LIKE '%s'", sitetype)
	}

	rows, err := db.SqlDB.Query(sql)
	defer rows.Close();

	if err != nil {
		fmt.Println("[ERROR]Get sites:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "獲取失敗!",
		})
		return
	}
    
    
	var sites []Site
	for rows.Next() {
		var site Site
		rows.Scan(&site.ID, &site.Site, &site.Lot, &site.Product, &site.Name, &site.LastTime, &site.Ping, &site.Port, &site.Temperature, &site.Status, &site.Show)
		//HeartBeat_Update(site.ID, site.IP)
		sites = append(sites, site)
	}

	c.JSON(http.StatusOK, sites)
}

func UpdateSitesShow(c *gin.Context){
	_, err := db.SqlDB.Exec("UPDATE site SET showmenu=status")

	if err != nil {
		fmt.Println("[ERROR]Update heartbeat:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "更新失敗!",
		})
		return
	}
}

func HeartBeat(c *gin.Context) {
	//fmt.Println("Hello")
	site_int, err := strconv.Atoi(c.Query("site"))
	

	if err != nil {
		fmt.Println("[ERROR]site to int:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "site must be int!",
		})
		return
	}

	_, err = db.SqlDB.Exec("UPDATE site SET LastTime=NOW() WHERE ID=?", site_int + 1)

	if err != nil {
		fmt.Println("[ERROR]Update heartbeat:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "更新失敗!",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  1,
		"message": "success!",
	})
}

func TCPIP_connection() {
    li, err := net.Listen("tcp", ":11004")
    if err != nil {
        log.Fatalln(err)
    }
    defer li.Close()
    for {
   		conn, err = li.Accept()
   		fmt.Println("Client Connection.....");
    }
}

func SendMessage(c *gin.Context){
	id := c.PostForm("id")
	rows, err := db.SqlDB.Query("SELECT Name FROM site WHERE ID=?", id)
	defer rows.Close();

	if err != nil {
		fmt.Println("[ERROR]Get sites:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "獲取失敗!",
		})
		return
	}

	var sitesname = ""
	for rows.Next() {
		rows.Scan(&sitesname)
	}

	io.WriteString(conn, sitesname + " 設備異常\n")
	c.JSON(http.StatusOK,sitesname)
}
func UpdatePassList(c *gin.Context){
	id := c.PostForm("id")
	ip := c.PostForm("ip")
	deviceid := c.PostForm("deviceid")

	if(ip != ""){
		_, err := db.SqlDB.Exec("UPDATE site SET IP=? WHERE ID=?", ip, id)

		if err != nil {
			fmt.Println("[ERROR]Update show:", err)
			return
		}
	}
	if(deviceid != ""){
		_, err := db.SqlDB.Exec("UPDATE site SET deviceID=? WHERE ID=?", deviceid, id)

		if err != nil {
			fmt.Println("[ERROR]Update show:", err)
			return
		}	
	}

	c.JSON(http.StatusOK,deviceid)
}