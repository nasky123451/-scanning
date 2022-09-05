package api

import (
	"fmt"
	"net/http"
	"time"
	"bytes"
	"io/ioutil"
	"net/url"
	"strings"

	db "github.com/web/DBConnector"
	//. "github.com/Anchor/TruckSystem/middleware"
	//."github.com/web/apis/private/heartbeat"
	"github.com/gin-gonic/gin"
)

type Switch struct {
	ID         string `json:"id" form:"id"`
	Stationname        string `json:"stationname" form:"stationname"`
	Enable    string `json:"enable" form:"enable"`
}

type Railing struct {
	ID         string `json:"id" form:"id"`
	Status        string `json:"status" form:"status"`
	Stationname    string `json:"stationname" form:"stationname"`
}

func GetSwitchStatus(c *gin.Context){
	sql:=""
	sql = fmt.Sprintf("SELECT ID, station_name, enable FROM railing_status")

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

	var switchs []Switch
	for rows.Next() {
		var switc Switch
		rows.Scan(&switc.ID, &switc.Stationname, &switc.Enable)
		switchs = append(switchs, switc)
	}

	c.JSON(http.StatusOK, switchs)
}

func GetRailingStatus(c *gin.Context){
	sql:=""
	sql = fmt.Sprintf("SELECT ID, status, station_name FROM railing_status")

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

	var railings []Railing
	for rows.Next() {
		var railing Railing
		rows.Scan(&railing.ID, &railing.Status, &railing.Stationname)
		railings = append(railings, railing)
	}

	c.JSON(http.StatusOK, railings)
}

func SetSwitchStatus(c *gin.Context){
	enable := c.PostForm("switch")
	name := c.PostForm("station_name")

	if enable == "true" {
		rows, err := db.SqlDB.Query("UPDATE railing_status SET enable=1 WHERE station_name=?", name)
		defer rows.Close();

		if err != nil {
			fmt.Println("[ERROR]Update switch:", err)
			c.JSON(http.StatusOK, gin.H{
				"status":  -1,
				"message": "獲取失敗!",
			})
			return
		}
	} else {
		rows, err := db.SqlDB.Query("UPDATE railing_status SET enable=0 WHERE station_name=?", name)
		defer rows.Close();

		if err != nil {
			fmt.Println("[ERROR]Update switch:", err)
			c.JSON(http.StatusOK, gin.H{
				"status":  -1,
				"message": "獲取失敗!",
			})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{})
}

func DelStatus(c *gin.Context){
	id := c.PostForm("id")
	//fmt.Println(id)

	_, err := db.SqlDB.Exec("UPDATE site SET ShowStatus=false WHERE ID=?", id)

	if err != nil {
		fmt.Println("[ERROR]Update show:", err)
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
func UpdateShowStatus(c *gin.Context){
	id := c.PostForm("id")

	rows, err := db.SqlDB.Query("SELECT ShowStatus FROM site WHERE ID=?", id)
	defer rows.Close();

	if err != nil {
		fmt.Println("[ERROR]Get sites:", err)
		return
	}

	var showstatus = "";
	for rows.Next() {
		rows.Scan(&showstatus)
	}
	//Confirm the existence
	if showstatus == "1"{
		return
	}

	_, err = db.SqlDB.Query("UPDATE site SET ShowStatus=true WHERE ID=?", id)

	if err != nil {
		fmt.Println("[ERROR]Update show:", err)
		return
	}

	c.JSON(http.StatusOK,showstatus)
}

func Set_Status(){
	ticker := time.NewTicker(3 * time.Second)
	for _ = range ticker.C {
		fmt.Println("Update Status.......")
		sql:=""
		sql = fmt.Sprintf("SELECT ID, Lot, Product, Name, LastTime, ping, status FROM site")

		rows, err := db.SqlDB.Query(sql)
		defer rows.Close();

		if err != nil {
			fmt.Println("[ERROR]Get sites:", err)
		}

		httppost := false
		for rows.Next() {
			var site Site
			rows.Scan(&site.ID, &site.Lot, &site.Product, &site.Name, &site.LastTime, &site.Ping, &site.Status)
			//HeartBeat_Update(site.ID, site.IP)
			now := time.Now().Format("2006-01-02 15:04:05")
		    layout := "2006-01-02 15:04:05"
		    t, _ := time.Parse(layout, site.LastTime)
		    nowt, _ := time.Parse(layout, now)
		    subS := nowt.Sub(t)
		    if subS.Minutes() > 5 {
		    	row, _ := db.SqlDB.Exec("UPDATE site SET status=? WHERE ID=?", "1", site.ID)
		    	rowsaffected, _ := row.RowsAffected()
		    	if rowsaffected == 1 {
		    		status_counter(site.Product, site.Name)
		    		linemessage := "地點：" + site.Name + " \n設備種類：" + site.Product + " \n狀態:\n異常\n"
		    		lineNotify_non(linemessage)
					lineNotify_non2(linemessage)
		    		httppost = true
				}
		    } else {
		    	row, _ := db.SqlDB.Exec("UPDATE site SET status=? WHERE ID=?", "0", site.ID)
		    	rowsaffected, _ := row.RowsAffected()
		    	if rowsaffected == 1 {
		    		linemessage := "地點：" + site.Name + " \n設備種類：" + site.Product + " \n狀態:\n恢復正常\n"
		    		lineNotify_non(linemessage)
					lineNotify_non2(linemessage)
		    		httppost = true
				}
		    }
		}
		if httppost == true {
			HttpPost()
		}
		rows.Close();
	}
}

func status_counter(Product string, Name string){
	sql := ""

	site := Product+"_"+Name

	t2 := time.Now()
	formatted := fmt.Sprintf("%d-%02d-%02d %02d:%02d:00",t2.Year(), t2.Month(), t2.Day(),t2.Hour(), t2.Minute())

	sql = fmt.Sprintf("UPDATE status_count SET %s=%s+1 WHERE Time='%s'",site,site, formatted)
	row, err := db.SqlDB.Exec(sql)
	if err != nil {
		fmt.Println("[ERROR]UPDATE status_count:", err)
	}
	rowsaffected, _ := row.RowsAffected()
	if err != nil {
		fmt.Println("[ERROR]Get RowsAffected:", err)
	}
	if rowsaffected == 0 {
		sql = fmt.Sprintf("INSERT INTO status_count(Time,%s)VALUES('%s',1)", site, formatted)
		_, err = db.SqlDB.Exec(sql)
		if err != nil {
			fmt.Println("[ERROR]INSERT status_count:", err)
		}
	}
	
}

type Line struct {
	Name         string `json:"name" form:"name"`
}

func LineInform(c *gin.Context){
	search := new(Line)
	c.BindQuery(&search)

	sql:=""
	sql = fmt.Sprintf("SELECT ID, Lot, Product, Name, LastTime, ping, status FROM site")

	rows, err := db.SqlDB.Query(sql)
	defer rows.Close();

	if err != nil {
		fmt.Println("[ERROR]Get sites:", err)
	}

	count := 0
	for rows.Next() {
		var site Site
		rows.Scan(&site.ID, &site.Lot, &site.Product, &site.Name, &site.LastTime, &site.Ping, &site.Status)
		if site.Status == "1"{
			if count == 0 {
				message := "發送人員：" + search.Name + "\n"
				lineNotify_non(message)
				count++
			}
			message := "地點：" + site.Name + " , 設備種類：" + site.Product + " , 狀態:異常, 時間:" + site.LastTime + "。\n"
			lineNotify_non(message)
		}
	}
	
	
}

func HttpPost() {
	url := "http://127.0.0.1:8080/messages"
	fmt.Println("URL:>", url)

	var jsonStr = []byte(`{"user_id": "statusmenu", "message": "test"}`)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
	req.Header.Set("X-Custom-Header", "myvalue")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	fmt.Println("response Status:", resp.Status)
	fmt.Println("response Headers:", resp.Header)
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println("response Body:", string(body))
}

func lineNotify_non(inputmessage string){
	var message string
	message ="\n" + inputmessage + "\n" 

	fmt.Println(message)


	token := "VtdWWiLUrd3qG3J9FFratmBSLfqYesGtE28B0TfehE3" 
	client := &http.Client{}
	
	data := url.Values{}
	
    data.Set("message", message)

    req, err := http.NewRequest("POST", "https://notify-api.line.me/api/notify", 
								strings.NewReader(data.Encode()))
    if err != nil {
        // handle error
        fmt.Println(err)
    }
 
    req.Header.Set("Content-Type", "application/x-www-form-urlencoded")	
	req.Header.Add("Authorization", "Bearer " + token)
	resp, err := client.Do(req)
	defer resp.Body.Close()
	
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(body))


}

func lineNotify_non2(inputmessage string){
	var message string
	message ="\n" + inputmessage + "\n" 

	fmt.Println(message)


	token := "HKWvAxTXQkkKa4lBvcO1q1EPAaPoyCsM4d2K9sC2iFA" 
	client := &http.Client{}
	
	data := url.Values{}
	
    data.Set("message", message)

    req, err := http.NewRequest("POST", "https://notify-api.line.me/api/notify", 
								strings.NewReader(data.Encode()))
    if err != nil {
        // handle error
        fmt.Println(err)
    }
 
    req.Header.Set("Content-Type", "application/x-www-form-urlencoded")	
	req.Header.Add("Authorization", "Bearer " + token)
	resp, err := client.Do(req)
	defer resp.Body.Close()
	
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(body))


}