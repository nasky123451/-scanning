package api

import (
	//. "github.com/Anchor/TruckSystem/middleware"
	"fmt"
	"net/http"
	"time"
	"strconv"
	db "github.com/web/DBConnector"

	"github.com/gin-gonic/gin"
)

type ViolationStatisticsSearch struct {
	Type      string `json:"type" form:"type"`
	SiteType  string `json:"sitetype" form:"sitetype"`
	Location  string `json:"location" form:"location"`
	Category  string `json:"category" form:"category"`
	StartTime string `json:"starttime" form:"starttime"`
	EndTime   string `json:"endtime" form:"endtime"`
	Interval  string `json:"interval" form:"interval"`
}

func GetViolationStatistics(c *gin.Context) {
	search := new(ViolationStatisticsSearch)
	c.BindQuery(&search)

	if search.StartTime == "" {
		search.StartTime = "1970-01-01"
	}
	if search.EndTime == "" {
		search.EndTime = time.Now().Format("2006-01-02")
	}

	sql := ""
	if search.Interval == "minute" {
		sql += "SELECT DATE_FORMAT(Time, '%Y-%m-%d %H:%i') AS inter,"
	} else if search.Interval == "hours" {
		sql += "SELECT DATE_FORMAT(Time, '%Y-%m-%d %H') AS inter,"
	} else if search.Interval == "days" {
		sql += "SELECT DATE_FORMAT(Time, '%Y-%m-%d') AS inter,"
	} else if search.Interval == "weeks" {
		sql += "SELECT DATE_FORMAT(Time, '%Y-%u週') AS inter,"
	} else if search.Interval == "months" {
		sql += "SELECT DATE_FORMAT(Time, '%Y-%m') AS inter,"
	} else if search.Interval == "years" {
		sql += "SELECT DATE_FORMAT(Time, '%Y') AS inter,"
	} else {
		sql += "SELECT DATE_FORMAT(Time, '%Y-%m-%d') AS inter,"
	}

	
	sql += fmt.Sprintf(" Site, SUM(Count), Type, category FROM violation_statistics WHERE Time BETWEEN '%s' AND '%s'", search.StartTime, search.EndTime)
	if search.Type != "" {
		sql += fmt.Sprintf(" AND Type ='%s'", search.Type)
	}
	if search.Location != "" {
		sql += fmt.Sprintf(" AND Site='%s'", search.Location)
	}
	if search.SiteType == "1" && search.Location == "" {
		sql += fmt.Sprintf(" AND Site BETWEEN 1 AND 12")
	}
	if search.SiteType == "2" && search.Location == "" {
		sql += fmt.Sprintf(" AND Site BETWEEN 13 AND 36")
	}
	if search.SiteType == "3" && search.Location == "" {
		sql += fmt.Sprintf(" AND Site BETWEEN 37 AND 52")
	}
	if search.SiteType == "4" && search.Location == "" {
		sql += fmt.Sprintf(" AND Site BETWEEN 53 AND 74")
	}
	if search.SiteType == "5" && search.Location == "" {
		sql += fmt.Sprintf(" AND Site BETWEEN 75 AND 82")
	}
	if search.Category != "" {
		sql += fmt.Sprintf(" AND category LIKE '%s'", search.Category)
	}

	sql += " GROUP BY inter ORDER BY Time ASC"

	fmt.Println("statistics....")
	
	rows, err := db.SqlDB.Query(sql)
	defer rows.Close();

	if err != nil {
		fmt.Println("[ERROR]Get statistics:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "獲取失敗!",
		})
		return
	}

	type Resp struct {
		Site     string `json:"site" form:"site"`
		Time     string `json:"time" form:"time"`
		Count    string `json:"count" form:"count"`
		Type     string `json:"type" form:"type"`
		Category string `json:"category" form:"category"`
	}
	var resps []Resp
	for rows.Next() {
		var resp Resp
		rows.Scan(&resp.Time, &resp.Site, &resp.Count, &resp.Type, &resp.Category)
		resps = append(resps, resp)
	}

	c.JSON(http.StatusOK, resps)
}

const TIME_LAYOUT = "2006-01-02 15:04:05"
func Delete_violation_statistic(id string){

	table_time, _ := db.SqlDB.Query("SELECT Time, Type, Site FROM records WHERE ID LIKE ?", id)
	type Resp struct {
		Site     string `json:"site" form:"site"`
		Time     string `json:"time" form:"time"`
		Type    string `json:"type" form:"type"`
	}
	var resp Resp
	for table_time.Next() {
		table_time.Scan(&resp.Time, &resp.Type, &resp.Site)
	}
	fmt.Println(resp.Time)

	t2, _ := time.Parse(TIME_LAYOUT, resp.Time)
	formatted := fmt.Sprintf("%d-%02d-%02d %02d:%02d:00",
        t2.Year(), t2.Month(), t2.Day(),
        t2.Hour(), t2.Minute())
	fmt.Println(formatted)

	var c = ""
	count, err := db.SqlDB.Query("SELECT Count FROM violation_statistics WHERE Type LIKE ? AND Site LIKE ? AND Time = ?", resp.Type, resp.Site, formatted)
	for count.Next() {
		count.Scan(&c)
	}
	intc, _ := strconv.Atoi(c)
	fmt.Println(intc)

	if intc-1 == 0{
		_, err = db.SqlDB.Exec("DELETE FROM violation_statistics WHERE Type LIKE ? AND Site LIKE ? AND Time LIKE ?", resp.Type, resp.Site, formatted)
	}else{
		_, err = db.SqlDB.Exec("UPDATE violation_statistics SET Count=? WHERE Type LIKE ? AND Site LIKE ? AND Time LIKE ?", intc-1, resp.Type, resp.Site, formatted)
	}
	if err != nil{
		fmt.Println("[ERROR]Delete violation_statistic:", err)
		return
	}
}

func Add_violation_statistic(id string){

	table_time, _ := db.SqlDB.Query("SELECT Time, Type, Site, category FROM records WHERE ID LIKE ?", id)
	type Resp struct {
		Site     string `json:"site" form:"site"`
		Time     string `json:"time" form:"time"`
		Type    string `json:"type" form:"type"`
		Category    string `json:"category" form:"category"`
	}
	var resp Resp
	for table_time.Next() {
		table_time.Scan(&resp.Time, &resp.Type, &resp.Site, &resp.Category)
	}
	fmt.Println("Time = ", resp.Time, " Type = " ,resp.Type, " Site = ", resp.Site)

	t2, _ := time.Parse(TIME_LAYOUT, resp.Time)
	formatted := fmt.Sprintf("%d-%02d-%02d %02d:%02d:00",
        t2.Year(), t2.Month(), t2.Day(),
        t2.Hour(), t2.Minute())
	fmt.Println(formatted)

	resultid, err := db.SqlDB.Query("SELECT ID FROM violation_statistics WHERE Time LIKE ? AND Type LIKE ? AND Site LIKE ? AND category Like ?", formatted, resp.Type, resp.Site, resp.Category)
	var Id = ""
	for resultid.Next() {
		resultid.Scan(Id)
	}
	fmt.Println("ID = ", Id)

	if Id == ""{
		_, err = db.SqlDB.Exec("INSERT INTO violation_statistics(Type,Site,category,Time,Count)VALUES(?,?,?,?,?)", resp.Type, resp.Site, resp.Category, formatted, "1")
	}else{
		_, err = db.SqlDB.Exec("UPDATE violation_statistics SET Count=Count+1 WHERE Type LIKE ? AND Site LIKE ? AND Time LIKE ? AND category = ?", resp.Type, resp.Site, formatted, resp.Category)
	}

	if err != nil{
		fmt.Println("[ERROR]UPDATE violation_statistic:", err)
		return
	}
}
