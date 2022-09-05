package api

import (
	//. "github.com/Anchor/TruckSystem/middleware"
	"fmt"
	"net/http"
	"time"
	"strings"
	"strconv"

	db "github.com/web/DBConnector"

	"github.com/gin-gonic/gin"
)

type CountStatisticsSearch struct {
	Name string `json:"name" form:"name"`
	StartTime string `json:"starttime" form:"starttime"`
	EndTime   string `json:"endtime" form:"endtime"`
	Interval  string `json:"interval" form:"interval"`
}

type Result struct {
		Time                 string `json:"time" form:"time"`
		One_in_car           string `json:"one_in_car" form:"one_in_car"`
		One_out_car          string `json:"one_out_car" form:"one_out_car"`
		One_in_truck         string `json:"one_in_truck" form:"one_in_truck"`
		One_out_truck        string `json:"one_out_truck" form:"one_out_truck"`
		One_in_motorbike     string `json:"one_in_motorbike" form:"one_in_motorbike"`
		One_out_motorbike    string `json:"one_out_motorbike" form:"one_out_motorbike"`
		Two_in_car           string `json:"two_in_car" form:"two_in_car"`
		Two_out_car          string `json:"two_out_car" form:"two_out_car"`
		Two_in_truck         string `json:"two_in_truck" form:"two_in_truck"`
		Two_out_truck        string `json:"two_out_truck" form:"two_out_truck"`
		Two_in_motorbike     string `json:"two_in_motorbike" form:"two_in_motorbike"`
		Two_out_motorbike    string `json:"two_out_motorbike" form:"two_out_motorbike"`
		Three_in_car         string `json:"three_in_car" form:"three_in_car"`
		Three_out_car        string `json:"three_out_car" form:"three_out_car"`
		Three_in_truck       string `json:"three_in_truck" form:"three_in_truck"`
		Three_out_truck      string `json:"three_out_truck" form:"three_out_truck"`
		Three_in_motorbike   string `json:"three_in_motorbike" form:"three_in_motorbike"`
		Three_out_motorbike  string `json:"three_out_motorbike" form:"three_out_motorbike"`
		Four_in_person       string `json:"four_in_person" form:"four_in_person"`
		Four_out_person      string `json:"four_out_person" form:"four_out_person"`
		Five_in_person       string `json:"five_in_person" form:"five_in_person"`
		Five_out_person      string `json:"five_out_person" form:"five_out_person"`
		Six_in_person        string	`json:"six_in_person" form:"six_in_person"`
		Six_out_person       string `json:"six_out_person" form:"six_out_person"`
		Seven_in_person      string `json:"seven_in_person" form:"seven_in_person"`
		Seven_out_person     string `json:"seven_out_person" form:"seven_out_person"`
		Eight_in_person      string `json:"eight_in_person" form:"eight_in_person"`
		Eight_out_person     string `json:"eight_out_person" form:"eight_out_person"`	
		Nine_in_car         string `json:"nine_in_car" form:"nine_in_car"`
		Nine_out_car        string `json:"nine_out_car" form:"nine_out_car"`
		Nine_in_truck       string `json:"nine_in_truck" form:"nine_in_truck"`
		Nine_out_truck      string `json:"nine_out_truck" form:"nine_out_truck"`
		Nine_in_motorbike   string `json:"nine_in_motorbike" form:"nine_in_motorbike"`
		Nine_out_motorbike  string `json:"nine_out_motorbike" form:"nine_out_motorbike"`
	}

func GetCountStatistics(c *gin.Context) {
	search := new(CountStatisticsSearch)
	c.BindQuery(&search)

	if search.StartTime == "" {
		search.StartTime = "1970-01-01"
	}
	if search.EndTime == "" {
		search.EndTime = time.Now().Format("2006-01-02")
	}

	const layout = "2006-01-02T15:04"
	t, _ := time.Parse(layout, search.EndTime)

	search.EndTime = t.Add(-1 * time.Minute).Format(layout)
	fmt.Println(search.EndTime)


	sql := ""
	if search.Interval == "minute"{
		sql += "SELECT DATE_FORMAT(Time, '%Y-%m-%d %H:%i') AS inter,"
	} else if search.Interval == "fiveMinute"{
		sql += "SELECT concat( DATE_FORMAT( Time, '%Y-%m-%d %H:' ) , Floor( DATE_FORMAT( Time, '%i' ) /5 ) ) AS inter,"
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

	sql += " SUM(1_in_car), SUM(1_out_car), SUM(1_in_truck), SUM(1_out_truck), SUM(1_in_motorbike), SUM(1_out_motorbike),"
	sql += " SUM(2_in_car), SUM(2_out_car), SUM(2_in_truck), SUM(2_out_truck), SUM(2_in_motorbike), SUM(2_out_motorbike),"
	sql += " SUM(3_in_car), SUM(3_out_car), SUM(3_in_truck), SUM(3_out_truck), SUM(3_in_motorbike), SUM(3_out_motorbike),"
	sql += " SUM(4_in_person), SUM(4_out_person), SUM(5_in_person), SUM(5_out_person), SUM(6_in_person), SUM(6_out_person), SUM(7_in_person), SUM(7_out_person),"
	sql += " SUM(8_in_person), SUM(8_out_person), SUM(9_in_car), SUM(9_out_car), SUM(9_in_truck), SUM(9_out_truck), SUM(9_in_motorbike), SUM(9_out_motorbike) "
	sql += fmt.Sprintf("FROM count_statistics WHERE Time BETWEEN '%s' AND '%s'", search.StartTime, search.EndTime)
	sql += " GROUP BY inter ORDER BY Time ASC"

	rows, err := db.SqlDB.Query(sql)
	defer rows.Close()
	fmt.Println("statistics....")

	if err != nil {
		fmt.Println("[ERROR]Get records:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "獲取失敗!",
		})
		return
	}

	var resps []Result
	for rows.Next() {
		var row Result
		rows.Scan(&row.Time, &row.One_in_car, &row.One_out_car, &row.One_in_truck, &row.One_out_truck, &row.One_in_motorbike, &row.One_out_motorbike,
			 &row.Two_in_car, &row.Two_out_car, &row.Two_in_truck, &row.Two_out_truck, &row.Two_in_motorbike, &row.Two_out_motorbike, 
			 &row.Three_in_car, &row.Three_out_car, &row.Three_in_truck, &row.Three_out_truck, &row.Three_in_motorbike, &row.Three_out_motorbike, 
			 &row.Four_in_person, &row.Four_out_person, &row.Five_in_person, &row.Five_out_person, &row.Six_in_person, &row.Six_out_person, &row.Seven_in_person, &row.Seven_out_person,
			 &row.Eight_in_person, &row.Eight_out_person, &row.Nine_in_car, &row.Nine_out_car, &row.Nine_in_truck, &row.Nine_out_truck, &row.Nine_in_motorbike, &row.Nine_out_motorbike)

		resps = append(resps, row)
	}

	c.JSON(http.StatusOK, resps)

	if search.Name != "" {
		path := "C:/log/使用網頁紀錄"
		message := "使用者:" + search.Name + " 搜尋了統計資料 開始時間:"+search.StartTime+ " 結束時間:"+search.EndTime+" 時間間隔:"+search.Interval+" 時間:" + time.Now().Format("2006-01-02 15:04:05") + "\n"
		message += "====================================================================\n"
		write_log(path, message)
	}
}

func GetStatuslName() (statustotalName []string, err error) {
	sql :=""
	sql = fmt.Sprintf("SELECT Product, Name FROM site")

	rows, err := db.SqlDB.Query(sql)
	defer rows.Close()

	if err != nil {
		fmt.Println("[ERROR]Get sites:", err)
		return
	}

	for rows.Next() {
		product := ""
		name := ""
		rows.Scan(&product, &name)
		statustotalName = append(statustotalName, product+"_"+name)
	}
	return
}


func GetStatusCount(c *gin.Context) {
	search := new(CountStatisticsSearch)
	c.BindQuery(&search)

	if search.StartTime == "" {
		search.StartTime = "1970-01-01"
	}
	if search.EndTime == "" {
		search.EndTime = time.Now().Format("2006-01-02")
	}

	statustotalName, err := GetStatuslName()

	if err != nil {
		fmt.Println("[ERROR]Get status name:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "獲取失敗!",
		})
		return
	}

	//fmt.Println(statustotalName)

	sql := ""
	if search.Interval == "minute"{
		sql += "SELECT DATE_FORMAT(Time, '%Y-%m-%d %H:%i') AS inter"
	} else if search.Interval == "fiveMinute"{
		sql += "SELECT concat( DATE_FORMAT( Time, '%Y-%m-%d %H:' ) , Floor( DATE_FORMAT( Time, '%i' ) /5 ) ) AS inter"
	} else if search.Interval == "hours" {
		sql += "SELECT DATE_FORMAT(Time, '%Y-%m-%d %H') AS inter"
	} else if search.Interval == "days" {
		sql += "SELECT DATE_FORMAT(Time, '%Y-%m-%d') AS inter"
	} else if search.Interval == "weeks" {
		sql += "SELECT DATE_FORMAT(Time, '%Y-%u週') AS inter"
	} else if search.Interval == "months" {
		sql += "SELECT DATE_FORMAT(Time, '%Y-%m') AS inter"
	} else if search.Interval == "years" {
		sql += "SELECT DATE_FORMAT(Time, '%Y') AS inter"
	} else {
		sql += "SELECT DATE_FORMAT(Time, '%Y-%m-%d') AS inter"
	}

	sql += fmt.Sprintf(", SUM(")
	for i := 0; i < len(statustotalName) - 1; i++ {
     	sql += fmt.Sprintf("%s+", statustotalName[i])
    }
    sql += fmt.Sprintf("%s)", statustotalName[len(statustotalName) - 1])

	sql += fmt.Sprintf(" FROM status_count WHERE Time BETWEEN '%s' AND '%s'", search.StartTime, search.EndTime)

	sql += " GROUP BY inter ORDER BY Time ASC"
	
	//fmt.Println(sql)
	fmt.Println("statistics....")
	
	rows, err := db.SqlDB.Query(sql)
	defer rows.Close();

	if err != nil {
		fmt.Println("[ERROR]Get status_count:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "獲取失敗!",
		})
		return
	}

	type Result struct {
		Time string
		Total string
	}

	
	var resps []Result
	for rows.Next() {
		var resp Result
		rows.Scan(&resp.Time, &resp.Total)
		if search.Interval == "fiveMinute"{
			//fmt.Printf("%T", resp.Time)
			str1 := strings.Split(resp.Time, ":")
			//fmt.Println(str1[1])
			i, _ := strconv.Atoi(str1[1])
			resp.Time = str1[0] + ":" + strconv.Itoa(i * 5)
		}

		resps = append(resps, resp)
	}

	c.JSON(http.StatusOK, resps)
}

type CountRetetion struct {
	ID           string `json:"id" form:"id"`
	Name           string `json:"name" form:"name"`
	Retention           int `json:"retention" form:"retention"`
}

func GetRetention(c *gin.Context){
	sql :=""
	sql = fmt.Sprintf("SELECT ID, Name, retention FROM counter")

	rows, err := db.SqlDB.Query(sql)
	defer rows.Close()

	if err != nil {
		fmt.Println("[ERROR]Get counter:", err)
		return
	}

	var resps []CountRetetion
	for rows.Next() {
		var resp CountRetetion
		rows.Scan(&resp.ID, &resp.Name, &resp.Retention)
		resps = append(resps, resp)
	}

	c.JSON(http.StatusOK, resps)
}

type CounterRetetion struct {
	One_retention           string `json:"one_retention" form:"one_retention"`
	Two_retention           string `json:"two_retention" form:"two_retention"`
	Three_retention         string `json:"three_retention" form:"three_retention"`
	Four_retention       string `json:"four_retention" form:"four_retention"`
	Five_retention       string `json:"five_retention" form:"five_retention"`
	Six_retention        string	`json:"six_retention" form:"six_retention"`
	Seven_retention      string `json:"seven_retention" form:"seven_retention"`
	Eight_retention      string `json:"eight_retention" form:"eight_retention"`	
	Nine_retention         string `json:"nine_retention" form:"nine_retention"`
}

func UpdateRetention(c *gin.Context){
	search := new(CounterRetetion)
	c.BindQuery(&search)

	var langs [9]string
	langs[0] = search.One_retention
	langs[1] = search.Two_retention
	langs[2] = search.Three_retention
	langs[3] = search.Four_retention
	langs[4] = search.Five_retention
	langs[5] = search.Six_retention
	langs[6] = search.Seven_retention
	langs[7] = search.Eight_retention
	langs[8] = search.Nine_retention

	for i := 0; i < 9; i = i+1 {
        _, err := db.SqlDB.Query("UPDATE counter SET retention=? WHERE ID=?", langs[i], i+1)

        if err != nil {
			fmt.Println("[ERROR]UPDATE counter:", err)
			return
		}
    }

	c.JSON(http.StatusOK, gin.H{})
}