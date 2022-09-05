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

type OpendataSearch struct {
	ApiKey string `json:"apikey" form:"apikey"`
	Secret string `json:"secret" form:"secret"`
}

type ResultCar struct {
	One           string
	Two           string
	Three         string
	Nine          string

}
type JsonCar struct {
	CctvTime           string `json:"cctvTime" form:"cctvTime"`
	CarClass           string `json:"carClass" form:"carClass"`
	CarAmount           int `json:"carAmount" form:"carAmount"`
	CCTVUID           string `json:"CCTVUID" form:"CCTVUID"`
}

func GetOpendataCar(c *gin.Context) {
	search := new(OpendataSearch)
	c.BindQuery(&search)

	if search.ApiKey != "c199bc3b090b5aae309d88f790067342798376c09c3c4b6c688ca1f52cafec38" || search.Secret != "cb4f894de7a1fad478f3f80878d57c7252ac4df8d30c35c3f63f8b32a30e67bc"{
		c.JSON(http.StatusOK, gin.H{
			"status":  401,
			"message": "介接金鑰或密碼錯誤",
		})
		return
	}

	res_timenow := time.Now().Format("2006-01-02T15:04:05.000Z")
	fmt.Println(res_timenow)
	EndTime := time.Now().Add(-1 * time.Second).Format("2006-01-02 15:04:05")
	StartTime := time.Now().Add(-5 * time.Minute).Format("2006-01-02 15:04:05")

	sql := ""

	sql += "SELECT SUM(1_in_car+1_in_truck+1_in_motorbike),"
	sql += " SUM(2_in_car+2_in_truck+2_in_motorbike),"
	sql += " SUM(3_in_car+3_in_truck+3_in_motorbike),"
	sql += " SUM(9_in_car+9_in_truck+9_in_motorbike) "
	sql += fmt.Sprintf("FROM count_statistics WHERE Time BETWEEN '%s' AND '%s'", StartTime, EndTime)

	var row ResultCar
	_ = db.SqlDB.QueryRow(sql).Scan(&row.One, &row.Two, &row.Three, &row.Nine)

	var resps []JsonCar
	var resp JsonCar
	resp.CctvTime = res_timenow
	resp.CarClass = "M"
	if row.One == ""{
		resp.CarAmount = 0
	} else {
		resp.CarAmount, _ = strconv.Atoi(row.One)
	}
	resp.CCTVUID = "SWC:CCTV:0006"
	resps = append(resps, resp)
	resp.CctvTime = res_timenow
	resp.CarClass = "M"
	if row.One == ""{
		resp.CarAmount = 0
	} else {
		resp.CarAmount, _ = strconv.Atoi(row.Two)
	}
	resp.CCTVUID = "SWC:CCTV:0007"
	resps = append(resps, resp)
	resp.CctvTime = res_timenow
	resp.CarClass = "M"
	if row.One == ""{
		resp.CarAmount = 0
	} else {
		resp.CarAmount, _ = strconv.Atoi(row.Nine)
	}
	resp.CCTVUID = "SWC:CCTV:0008"
	resps = append(resps, resp)
	resp.CctvTime = res_timenow
	resp.CarClass = "M"
	if row.One == ""{
		resp.CarAmount = 0
	} else {
		resp.CarAmount, _ = strconv.Atoi(row.Three)
	}
	resp.CCTVUID = "SWC:CCTV:0009"
	resps = append(resps, resp)

	c.JSON(http.StatusOK, resps)
}

type ResultPerson struct {
	Four_in           string
	Four_out           string
	Five_in           string
	Five_out           string
	Six_in         string
	Six_out         string
	Seven_in          string
	Seven_out          string

}
type JsonPerson struct {
	Density           int `json:"density" form:"density"`
	PeopleEnter           int `json:"peopleEnter" form:"peopleEnter"`
	PeopleExit           int `json:"peopleExit" form:"peopleExit"`
	CCTVUID           string `json:"CCTVUID" form:"CCTVUID"`
	CCTVTime           string `json:"CCTVTime" form:"CCTVTime"`
}

func GetOpendataPerson(c *gin.Context) {
	search := new(OpendataSearch)
	c.BindQuery(&search)

	if search.ApiKey != "c199bc3b090b5aae309d88f790067342798376c09c3c4b6c688ca1f52cafec38" || search.Secret != "cb4f894de7a1fad478f3f80878d57c7252ac4df8d30c35c3f63f8b32a30e67bc"{
		c.JSON(http.StatusOK, gin.H{
			"status":  401,
			"message": "介接金鑰或密碼錯誤",
		})
		return
	}

	res_timenow := time.Now().Format("2006-01-02T15:04:05.000Z")
	fmt.Println(res_timenow)
	EndTime := time.Now().Add(-1 * time.Second).Format("2006-01-02 15:04:05")
	StartTime := time.Now().Add(-5 * time.Minute).Format("2006-01-02 15:04:05")

	sql := ""

	sql += "SELECT SUM(4_in_person), SUM(4_out_person),"
	sql += " SUM(5_in_person), SUM(5_out_person), "
	sql += " SUM(6_in_person), SUM(6_out_person), "
	sql += " SUM(7_in_person), SUM(7_out_person) "
	sql += fmt.Sprintf("FROM count_statistics WHERE Time BETWEEN '%s' AND '%s'", StartTime, EndTime)

	var row ResultPerson
	_ = db.SqlDB.QueryRow(sql).Scan(&row.Four_in, &row.Four_out, &row.Five_in, &row.Five_out, &row.Six_in, &row.Six_out, &row.Seven_in, &row.Seven_out)

	var resps []JsonPerson
	var resp JsonPerson
	resp.Density = 0
	if row.Five_in == ""{
		resp.PeopleEnter = 0
	} else {
		resp.PeopleEnter, _ = strconv.Atoi(row.Five_in)
	}
	if row.Five_out == ""{
		resp.PeopleExit = 0
	} else {
		resp.PeopleExit, _ = strconv.Atoi(row.Five_out)
	}
	resp.CCTVUID = "SWC:CCTV:0001"
	resp.CCTVTime = res_timenow
	resps = append(resps, resp)
	resp.Density = 0
	if row.Six_in == ""{
		resp.PeopleEnter = 0
	} else {
		resp.PeopleEnter, _ = strconv.Atoi(row.Six_in)
	}
	if row.Six_out == ""{
		resp.PeopleExit = 0
	} else {
		resp.PeopleExit, _ = strconv.Atoi(row.Six_out)
	}
	resp.CCTVUID = "SWC:CCTV:0003"
	resp.CCTVTime = res_timenow
	resps = append(resps, resp)
	resp.Density = 0
	if row.Four_in == ""{
		resp.PeopleEnter = 0
	} else {
		resp.PeopleEnter, _ = strconv.Atoi(row.Four_in)
	}
	if row.Four_out == ""{
		resp.PeopleExit = 0
	} else {
		resp.PeopleExit, _ = strconv.Atoi(row.Four_out)
	}
	resp.CCTVUID = "SWC:CCTV:0004"
	resp.CCTVTime = res_timenow
	resps = append(resps, resp)
	resp.Density = 0
	if row.Seven_in == ""{
		resp.PeopleEnter = 0
	} else {
		resp.PeopleEnter, _ = strconv.Atoi(row.Seven_in)
	}
	if row.Seven_out == ""{
		resp.PeopleExit = 0
	} else {
		resp.PeopleExit, _ = strconv.Atoi(row.Seven_out)
	}
	resp.CCTVUID = "SWC:CCTV:0005"
	resp.CCTVTime = res_timenow
	resps = append(resps, resp)
	

	c.JSON(http.StatusOK, resps)
}