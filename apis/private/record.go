package api

import(
	"fmt"
	"time"
	"os"
	"io"
	"errors"
	"path/filepath"
	"strings"
	
	"github.com/gin-gonic/gin"
	db "github.com/web/DBConnector"
	"net/http"

)

type Search struct {
	Name string `json:"name" form:"name"`
	StartTime string `json:"starttime" form:"starttime"`
	EndTime   string `json:"endtime" form:"endtime"`
	Category       string `json:"category" form:"category"`	
	Color       string `json:"color" form:"color"`	
	Site         string `json:"site" form:"site"`
	Licence         string `json:"licence" form:"licence"`	
	Success         string `json:"success" form:"success"`
}

type Record struct {
	ID         string `json:"id" form:"id"`
	Site       string `json:"site" form:"site"`	
	Licence         string `json:"licence" form:"licence"`	
	Category         string `json:"category" form:"category"`
	Color       string `json:"color" form:"color"`
	Time         string `json:"time" form:"time"`
	Path         string `json:"path" form:"path"`	
	Status         string `json:"status" form:"status"`
	Success         string `json:"success" form:"success"`
}
type Pass struct {
	ID         string `json:"id" form:"id"`
	Site       string `json:"site" form:"site"`	
	Licence    string `json:"licence" form:"licence"`	
}
type RecordLicnece struct {
	ID         string `json:"id" form:"id"`
	Site       string `json:"site" form:"site"`	
	Time       string `json:"time" form:"time"`	
	Licence    string `json:"licence" form:"licence"`	
	Category    string `json:"category" form:"category"`
	Color    string `json:"color" form:"color"`
}



func GetRecords(c *gin.Context){

	search := new(Search)
	c.BindQuery(&search)

	if search.StartTime == "" {
		search.StartTime = "1970-01-01 00:00:00"
	}
	if search.EndTime == "" {
		search.EndTime = time.Now().Format("2006-01-02 15:04:05")
	}

	sql:=""
	sql = fmt.Sprintf("SELECT ID, Site, Licence, Category, Color, Time, Path, status, success FROM records WHERE Time BETWEEN '%s' AND '%s'", search.StartTime, search.EndTime)

	if search.Site != "" {
		sql += fmt.Sprintf(" AND Site LIKE '%s'", search.Site)
	}
	if search.Category != "" {
		sql += fmt.Sprintf(" AND category LIKE '%s'", search.Category)
	}
	if search.Licence != "" {
		sql += fmt.Sprintf(" AND Licence LIKE '%s'", search.Licence)
	}
	if search.Color != "" {
		sql += fmt.Sprintf(" AND Color LIKE '%s'", search.Color)
	}
	if search.Success == "1" {
		sql += fmt.Sprintf(" AND success LIKE 0")
	}

	fmt.Println("record....")

	sql += " GROUP BY ID ORDER BY Time DESC"

	rows, err := db.SqlDB.Query(sql)
	defer rows.Close();

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
		rows.Scan(&record.ID, &record.Site, &record.Licence, &record.Category, &record.Color, &record.Time, &record.Path, &record.Status, &record.Success)
		records = append(records, record)
	}

	c.JSON(http.StatusOK, records)

	if search.Name != "" {
		path := "C:/log/使用網頁紀錄"
		message := "使用者:" + search.Name + " 搜尋了車牌紀錄 開始時間:"+search.StartTime+ " 結束時間:"+search.EndTime+" 地點:"+search.Site+" 種類:"+search.Category+" 車牌:"+search.Licence+" 時間:" + time.Now().Format("2006-01-02 15:04:05") + "\n"
		message += "====================================================================\n"
		write_log(path, message)
	}
}
func GetJpgName(c *gin.Context){
	id := c.PostForm("id")

	sql := ""
	sql = fmt.Sprintf("SELECT Site, Time, Licence FROM records WHERE ID LIKE '%s'", id)

	rows, err := db.SqlDB.Query(sql)
	defer rows.Close();

	if err != nil{
		fmt.Println("[ERROR]Del records:", err)
		c.JSON(http.StatusOK, gin.H{
			"status" :  -1,
			"message": "刪除失敗!",
		})
		return
	}

	type JpgNamedata struct {
		Site      string
		Time  string
		Licence  string

	}

	var JpgName JpgNamedata
	for rows.Next() {
		rows.Scan(&JpgName.Site, &JpgName.Time, &JpgName.Licence)
	}

	sql = ""
	sql = fmt.Sprintf("SELECT Name FROM site WHERE ID LIKE '%s'", JpgName.Site)

	rows, err = db.SqlDB.Query(sql)
	defer rows.Close();
	var Sitename = ""
	for rows.Next() {
		rows.Scan(&Sitename)
	}

	var Name = JpgName.Site + "_" + JpgName.Time + "_" + JpgName.Licence + "_" + Sitename
	
	c.JSON(http.StatusOK, gin.H{
		"name" : Name,
	})
}



func GetLicnece(c *gin.Context){
	sql := ""
	sql = fmt.Sprintf("SELECT * FROM webpage.records_formal order by ID desc LIMIT 20;")

	rows, err := db.SqlDB.Query(sql)
	defer rows.Close();

	if err != nil{
		fmt.Println("[ERROR]SELECT records_formal:", err)
		c.JSON(http.StatusOK, gin.H{
			"status" :  -1,
		})
		return
	}

	var licences []RecordLicnece
	for rows.Next() {
		var licence RecordLicnece
		rows.Scan(&licence.ID, &licence.Site, &licence.Time, &licence.Licence, &licence.Category, &licence.Color)
		licences = append(licences, licence)
	}
	
	c.JSON(http.StatusOK, licences)
}

func UpdateRecordShow(c *gin.Context){
	_, err := db.SqlDB.Exec("UPDATE records SET Showmenu=2")

	if err != nil {
		fmt.Println("[ERROR]Update heartbeat:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "更新失敗!",
		})
		return
	}
}

func DelRecord(c *gin.Context){
	id := c.PostForm("id")


	//fmt.Println("id=", id, "violationType=", violationType, "site = ", site)
	//Delete_violation_statistic(id)
	
	sql := ""
	sql = fmt.Sprintf("DELETE FROM records WHERE ID=%s", id)

	rows, err := db.SqlDB.Query(sql)
	defer rows.Close();

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
		})
}
func ModifyData(c *gin.Context){

	id := c.PostForm("id")
	Type := c.PostForm("type")
	licence := c.PostForm("licence")
	color := c.PostForm("color")
	category := c.PostForm("category")
	
	MoveDirectory(id, Type, licence, color, category)
	DelRecord(c)

}

type DirMessage struct {
	Type         string
	Site         string
	Licence      string
	Time         string
	Path         string
	ModifyLicence string
	ModifyType    string
}
func MoveDirectory(id string, Type string, licence string, color string, category string){

	sql:=""
	sql = fmt.Sprintf("SELECT Type, Site, Licence, Time, Path, ModifyLicence, ModifyType FROM records WHERE ID LIKE '%s'", id)
	
	fmt.Println("record....")

	rows, err := db.SqlDB.Query(sql)
	defer rows.Close();

	if err != nil {
		fmt.Println("[ERROR]Get records:", err)
		return
	}

	var record DirMessage
	for rows.Next() {
		rows.Scan(&record.Type, &record.Site, &record.Licence, &record.Time, &record.Path, &record.ModifyLicence, &record.ModifyType)
	}

	//時間_地點_類型_車牌_顏色
	time := strings.Replace(record.Time, "-", "", -1)
	time = strings.Replace(time, " ", "", -1)
	time = strings.Replace(time, ":", "", -1)
	//fmt.Println(time)

	//fmt.Println(color)
	newDir := ""
	if (strings.ToLower(Type) != strings.ToLower(record.Type) && strings.ToLower(licence) != strings.ToLower(record.Licence)) || (record.ModifyLicence == "1" && strings.ToLower(Type) != strings.ToLower(record.Type)) || (record.ModifyType == "1" && strings.ToLower(licence) != strings.ToLower(record.Licence)){
		//modify all
		newDir = "H:/violation_before/" + time + "_" + record.Site + "_" + Type + "_" + licence + "_" + color + "_3"
	}else if strings.ToLower(Type) != strings.ToLower(record.Type){
		//modify type
		newDir = "H:/violation_before/" + time + "_" + record.Site + "_" + Type + "_" + licence + "_" + color + "_2"
	}else if strings.ToLower(licence) != strings.ToLower(record.Licence){
		//modify licence
		newDir = "H:/violation_before/" + time + "_" + record.Site + "_" + Type + "_" + licence + "_" + color + "_1"
	}

	//newDir = "H:/violation_before/" + time + "_" + record.Site + "_" + Type + "_" + licence + "_" + color + "_1"
	err = os.Mkdir(newDir, os.ModePerm)

	oldDir := "D:/work/go/" + record.Path
	newDir = newDir + "/"
	CopyDir(oldDir, newDir)
	RemoveContents(oldDir)
	err = os.Mkdir(newDir + "/" + category, os.ModePerm)
	//fmt.Println(newDir)
}

func UpdateRecord(c *gin.Context){
	id := c.PostForm("id")
	site := c.PostForm("site")
	Type := c.PostForm("type")
	licnece := c.PostForm("licnece")
	color := c.PostForm("color")
	time := c.PostForm("time")

	_, err := db.SqlDB.Query("UPDATE records SET licence=?, category=?, color=?, success=? WHERE ID=?", licnece, Type, color, 1, id)
	

	if err != nil{
		fmt.Println("[ERROR]Update records:", err)
		c.JSON(http.StatusOK, gin.H{
			"status" :  -1,
			"message": "刪除失敗!",
		})
		return
	}

	_, err = db.SqlDB.Exec("INSERT INTO records_formal(Site,Time,Licence,category,color)VALUES(?,?,?,?,?)", site, time, licnece, Type, color)
	
	c.JSON(http.StatusOK, gin.H{
		"Status" : 1,
	})
}

func Addpass(c *gin.Context){
	licence := c.PostForm("licence")
	site := c.PostForm("site")

	exist, _ := check(site, licence)
 	if exist {
 		c.JSON(http.StatusOK, gin.H{
			"status":  2,
			"message": "黑名單已存在",
		})
		return
 	}
	
	_, err := db.SqlDB.Exec("INSERT INTO pass(Site,Licence)VALUES(?,?)", site, licence)

	if err != nil{
		fmt.Println("[ERROR]INSERT pass:", err)
		c.JSON(http.StatusOK, gin.H{
			"status" :  -1,
			"message": "新增失敗!",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  1,
		"message": "success",
	})
	return

}

func GetPass(c *gin.Context){
	site := c.PostForm("site")
	licence := c.PostForm("licence")

	sql := ""
	sql = fmt.Sprintf("SELECT ID, Site, Licence FROM pass WHERE Site LIKE '%s'", site)
	if licence != "" {
		sql += fmt.Sprintf(" AND Licence LIKE '%s'", licence)
	}

	rows, err := db.SqlDB.Query(sql)
	defer rows.Close()

	if err != nil{
		fmt.Println("[ERROR]SELECT pass:", err)
		c.JSON(http.StatusOK, gin.H{
			"status" :  -1,
			"message": "搜尋失敗!",
		})
		return
	}

	var pass []Pass
	for rows.Next() {
		var tmp Pass
		rows.Scan(&tmp.ID, &tmp.Site, &tmp.Licence)
		pass = append(pass, tmp)
	}

	c.JSON(http.StatusOK, pass)
}

func DelPass(c *gin.Context){
	id := c.PostForm("id")

	_, err := db.SqlDB.Exec("DELETE FROM pass WHERE ID LIKE ?", id)

	if err != nil{
		fmt.Println("[ERROR]DELETE pass:", err)
		c.JSON(http.StatusOK, gin.H{
			"status" :  -1,
			"message": "刪除失敗!",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  1,
		"message": "success!",
	})
}

func check(site string, licence string) (bool, error) {
	count := 0
	err := db.SqlDB.QueryRow("SELECT COUNT(*) FROM pass WHERE Site=? AND Licence=?", site, licence).Scan(&count)


	if err != nil {
		return false, err
	}

	if count >= 1 {
		return true, nil
	}
	return false, nil
}

func SearchImagePath(c *gin.Context){
	id := c.PostForm("id")
	sql:=""
	sql = fmt.Sprintf("SELECT Path FROM records WHERE ID LIKE %s", id)

	rows, err := db.SqlDB.Query(sql)
	defer rows.Close();

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

/**
 * 拷貝資料夾,同時拷貝資料夾中的檔案
 * @param srcPath  		需要拷貝的資料夾路徑: D:/test
 * @param destPath		拷貝到的位置: D/backup/
 */
func CopyDir(srcPath string, destPath string) error {
	//檢測目錄正確性
	if srcInfo, err := os.Stat(srcPath); err != nil {
		fmt.Println(err.Error())
		return err
	} else {
		if !srcInfo.IsDir() {
			e := errors.New("srcPath不是一個正確的目錄！")
			fmt.Println(e.Error())
			return e
		}
	}
	if destInfo, err := os.Stat(destPath); err != nil {
		fmt.Println(err.Error())
		return err
	} else {
		if !destInfo.IsDir() {
			e := errors.New("destInfo不是一個正確的目錄！")
			fmt.Println(e.Error())
			return e
		}
	}
	//加上拷貝時間:不用可以去掉
	//destPath = destPath + "_" + time.Now().Format("20060102150405")

	err := filepath.Walk(srcPath, func(path string, f os.FileInfo, err error) error {
		if f == nil {
			return err
		}
		if !f.IsDir() {
			path := strings.Replace(path, "\\", "/", -1)
			destPath := strings.Replace(destPath, "\\", "/", -1)
			filename := filepath.Base(path)
			if filename != "00.jpg" && (filename == "1.jpg" || filename == "2.jpg" || filename == "3.jpg" || filename == "4.jpg" || filename == "5.jpg" || filename == "6.jpg"){
				destNewPath := destPath + filename
				//destNewPath := strings.Replace(path, srcPath, destPath, -1)
				//fmt.Println(destPath)
				//fmt.Println(destNewPath)
				fmt.Println("複製檔案:" + path + " 到 " + destNewPath)
				copyFile(path, destNewPath)
			}

		}
		return nil
	})
	if err != nil {
		fmt.Printf(err.Error())
	}
	return err
}

//生成目錄並拷貝檔案
func copyFile(src, dest string) (w int64, err error) {
	srcFile, err := os.Open(src)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer srcFile.Close()
	//分割path目錄
	destSplitPathDirs := strings.Split(dest, "/")

	//檢測時候存在目錄
	destSplitPath := ""
	for index, dir := range destSplitPathDirs {
		if index < len(destSplitPathDirs)-1 {
			destSplitPath = destSplitPath + dir + "/"
			b, _ := pathExists(destSplitPath)
			if b == false {
				fmt.Println("建立目錄:" + destSplitPath)
				//建立目錄
				err := os.Mkdir(destSplitPath, os.ModePerm)
				if err != nil {
					fmt.Println(err)
				}
			}
		}
	}
	dstFile, err := os.Create(dest)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer dstFile.Close()

	return io.Copy(dstFile, srcFile)
}

//檢測資料夾路徑時候存在
func pathExists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
}
func RemoveContents(dir string) error {
    d, err := os.Open(dir)
    if err != nil {
        return err
    }
    defer d.Close()
    names, err := d.Readdirnames(-1)
    if err != nil {
        return err
    }
    for _, name := range names {
        err = os.RemoveAll(filepath.Join(dir, name))
        if err != nil {
            return err
        }
    }
    os.RemoveAll(dir)
    fmt.Println("刪除資料夾: " + dir)
    return nil
}