package api

import(
	"fmt"
	//"time"
	"os"
	"strings"
	
	"github.com/gin-gonic/gin"
	db "github.com/web/DBConnector"
	//. "github.com/web/middleware"
	//"github.com/gin-contrib/sessions"
	"net/http"

)

type Record_admin struct {
	ID         string `json:"id" form:"id"`
	Site        string `json:"site" form:"site"`
	Name       string `json:"name" form:"name"`
	Type       string `json:"type" form:"type"`
	Category       string `json:"category" form:"category"`
	Licence       string `json:"licence" form:"licence"`
	LicenceColor       string `json:"licencecolor" form:"licencecolor"`
	Path         string `json:"path" form:"path"`
	Success         string `json:"success" form:"success"`
	Time         string `json:"time" form:"time"`

}

type Modify struct{
	ID       string `json:"id" form:"id"`
	Type       string `json:"type" form:"type"`
	Licence       string `json:"licence" form:"licence"`
	Color       string `json:"color" form:"color"`
}

type Swal_search struct{
	Swaldate         string `json:"swal_date" form:"swal_date"`
}

func GetRecords_admin(c *gin.Context){
	/*search := new(Search)
	c.BindQuery(&search)

	if search.StartTime == "" {
		search.StartTime = "1970-01-01 00:00:00"
	}
	if search.EndTime == "" {
		search.EndTime = time.Now().Format("2006-01-02 15:04:05")
	}

	sql:=""
	sql = fmt.Sprintf("SELECT ID, Site, Licence, Time, Path, ModifyLicence, ModifyType FROM records WHERE Time BETWEEN '%s' AND '%s'", search.StartTime, search.EndTime)
	if search.Type != "" {
		sql += fmt.Sprintf(" AND Type LIKE '%s'", search.Type)
	}
	if search.Location != "" {
		sql += fmt.Sprintf(" AND Site='%s'", search.Location)
	}
	if search.SiteType == "1" && search.Location == "" {
		sql += fmt.Sprintf(" AND Site BETWEEN 1 AND 82")
	}

	fmt.Println("record....")

	sql += " GROUP BY Time ORDER BY Time DESC"

	db.DBInit()
	rows, err := db.SqlDB.Query(sql)

	if err != nil {
		fmt.Println("[ERROR]Get records:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "獲取失敗!",
		})
		return
	}


	var records []Record
	for rows.Next() {
		var record Record
		rows.Scan(&record.ID, &record.Site, &record.Time, &record.Path, &record.ModifyLicence, &record.ModifyType)
		records = append(records, record)
	}

	c.JSON(http.StatusOK, records)
	//rows, err := db.SqlDB.Query("SELECT Password FROM auth WHERE Username='user01' ")
	/*
	rows,err:=db.SqlDB.Query();
	defer rows.Close()

	if err != nil {
		fmt.Println(err)
		return 
	}

	var name string
	for rows.Next() {
		rows.Scan(&name)
		fmt.Println(name)
	}

	if err = rows.Err(); err != nil {
		return 
	}
	

	c.JSON(http.StatusOK, name)
	*/
}

func UpdateRecords_admin(c *gin.Context){
	swal_search := new(Swal_search)
	c.BindQuery(&swal_search)
	swal_date := c.PostForm("swal_date")
	fmt.Println("swal: ", swal_search.Swaldate)
	fmt.Println("swal: ", swal_date)

	file, err := c.FormFile("swal_folder")

	if err != nil{
		fmt.Println("[ERROR]Get file from form:", err)
	}

	fmt.Println(file.Filename)

	// Upload the file to specific dst.
	/*filepath := ""
	filepath += "UpdateTruckList/File/"
	files = filepath + file.Filename
	c.SaveUploadedFile(file, filepath + file.Filename)*/
}

func DelRecord_admin(c *gin.Context){
	id := c.PostForm("id")
	violationType := c.PostForm("type")

	//fmt.Println("id=", id, "violationType=", violationType)

	
	sql := ""
	sql = fmt.Sprintf("DELETE FROM record_admin WHERE ID=%s", id)

	_, err := db.SqlDB.Query(sql)

	if err != nil{
		fmt.Println("[ERROR]Del records:", err)
		c.JSON(http.StatusOK, gin.H{
			"status" :  -1,
			"message": "刪除失敗!",
		})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"Status" : 1,
		"ID"     : id,
		"Type"   : violationType,
	})
}

func ModifyData_admin(c *gin.Context){
	id := c.PostForm("id")
	Type := c.PostForm("type")
	licence := c.PostForm("licence")
	color := c.PostForm("color")
	category := c.PostForm("category")

	_, err := db.SqlDB.Query("UPDATE record_admin SET Type=?, Licence=?, Color=?, category=? WHERE ID=?",Type, licence, color, category, id)

	if err != nil {
		fmt.Println("[ERROR]Get records_update:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "獲取失敗!",
		})
		return
	}

	c.JSON(http.StatusOK, err)
}

func SuccessUpdateData(c *gin.Context){
	id := c.PostForm("id")

	adminMoveDirectory(id)

	sql := ""
	sql = fmt.Sprintf("DELETE FROM record_admin WHERE ID=%s", id)

	_, err := db.SqlDB.Query(sql)

	if err != nil{
		fmt.Println("[ERROR]Del records:", err)
		c.JSON(http.StatusOK, gin.H{
			"status" :  -1,
			"message": "刪除失敗!",
		})
		return
	}

	c.JSON(http.StatusOK, err)
}

func SearchImagePath_admin(c *gin.Context){
	id := c.PostForm("id")
	sql:=""
	sql = fmt.Sprintf("SELECT Path FROM record_admin WHERE ID LIKE %s", id)

	db.DBInit()
	rows, err := db.SqlDB.Query(sql)

	if err != nil {
		fmt.Println("[ERROR]Get records_success:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "獲取失敗!",
		})
		return
	}

	type Path struct{
		Path       string `json:"path" form:"path"`
	}

	var records []Path
	for rows.Next() {
		var record Path
		rows.Scan(&record.Path)
		records = append(records, record)
	}

	c.JSON(http.StatusOK, records)
}

type adminDirMessage struct {
	Site         string
	Type         string
	Category     string
	Licence      string
	Color        string
	Path         string
	Time         string
}

func adminMoveDirectory(id string){

	sql:=""
	sql = fmt.Sprintf("SELECT Site, Type, category, Licence, Color, Path, Time FROM record_admin WHERE ID LIKE '%s'", id)
	
	fmt.Println("record....")

	db.DBInit()
	rows, err := db.SqlDB.Query(sql)

	if err != nil {
		fmt.Println("[ERROR]Get records:", err)
		return
	}

	var record adminDirMessage
	for rows.Next() {
		rows.Scan(&record.Site, &record.Type, &record.Category, &record.Licence, &record.Color, &record.Path, &record.Time)
	}

	//時間_地點_類型_車牌_顏色
	time := strings.Replace(record.Time, "-", "", -1)
	time = strings.Replace(time, " ", "", -1)
	time = strings.Replace(time, ":", "", -1)
	//fmt.Println(time)

	//fmt.Println(color)

	if record.Site == "" || record.Type == "" || record.Licence == "" || record.Color == ""{
		fmt.Println("[ERROR]Get records_admin")
		return
	}

	newDir := "H:/violation_before/" + time + "_" + record.Site + "_" + record.Type + "_" + record.Licence + "_" + record.Color
	err = os.Mkdir(newDir, os.ModePerm)
	err = os.Mkdir(newDir + "/" + record.Category, os.ModePerm)

	oldDir := "D:/work/go/" + record.Path
	newDir = newDir + "/"
	CopyDir(oldDir, newDir)
	RemoveContents(oldDir)
	//fmt.Println(newDir)
}

func PostDir(c *gin.Context){
	fmt.Println("File in....")

	swaldate := c.PostForm("swal_date")
	swalsite := c.PostForm("swal_site")
	swaltype := c.PostForm("swal_type")
	swalcategory := c.PostForm("swal_category")
	swallicence := c.PostForm("swal_licence")
	swalcolor := c.PostForm("swal_color")

    form, _ := c.MultipartForm()
    files := form.File["swal_folder"]

	time := strings.Replace(swaldate, "-", "", -1)
	time = strings.Replace(time, " ", "", -1)
	time = strings.Replace(time, ":", "", -1)
	time = strings.Replace(time, "T", "", -1)
	folderName := time + "_" + swalsite + "_" + swaltype + "_" + swallicence + "_" + swalcolor + "_0"
	//fmt.Println(folderName)
	path := "buffer/" + folderName


	sql:=""
	sql = fmt.Sprintf("SELECT ID FROM record_admin WHERE Name LIKE '%s' AND Site LIKE '%s' AND Type LIKE '%s' AND category LIKE '%s' AND Licence LIKE '%s' AND Color LIKE '%s' AND Path LIKE '%s'", folderName, swalsite, swaltype, swalcategory, swallicence, swalcolor, path)

	db.DBInit()
	row, err := db.SqlDB.Query(sql)
	
	if err != nil {
		fmt.Println("[ERROR]Get records_success:", err)
	}

	var id = ""
	for row.Next() {
		row.Scan(&id)
	}
	//fmt.Println(id)
	if id != ""{
		sql = fmt.Sprintf("DELETE FROM record_admin WHERE ID=%s", id)
		_, err = db.SqlDB.Query(sql)
	}
	_, err = db.SqlDB.Exec("INSERT INTO record_admin(Name,Site,Type,category,Licence,Color,Path,Time)VALUES(?,?,?,?,?,?,?,?)", folderName, swalsite, swaltype, swalcategory, swallicence, swalcolor, path, swaldate)

	if err != nil {
		fmt.Println("[ERROR]Get records_success:", err)
	}

	newDir := "../../../buffer/" + folderName
	_ = os.Mkdir(newDir, os.ModePerm)

    for _, file := range files {
        fmt.Println(file.Filename)

        c.SaveUploadedFile(file, newDir + "/" + file.Filename)
	}

	// Upload the file to specific dst.
	/*filepath := ""
	filepath += "UpdateTruckList/File/"
	files = filepath + file.Filename
	c.SaveUploadedFile(file, filepath + file.Filename)*/

	c.JSON(http.StatusOK, gin.H{})
	//c.HTML(http.StatusOK, "uploadDir.html", gin.H{})
}