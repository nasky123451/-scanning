package auth


import(
	"fmt"
	"log"
	"net/http"
	"time"
	"io/ioutil"
	"os"
	"bufio"
	 db "github.com/web/DBConnector"
	 ."github.com/web/middleware"
	 ."github.com/web/models"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"encoding/base64"
	"crypto/sha256"
)

func AddUser(c *gin.Context){
	user := c.PostForm("user")
	name := c.PostForm("name")
	id := c.PostForm("id")
	pwd := c.PostForm("password")
 	userpermissions := c.PostForm("userpermissions")

 	user_name, _ := base64.StdEncoding.DecodeString(id)
	id = string(user_name)
	decode_pwd, _ := base64.StdEncoding.DecodeString(pwd)
	pwd = string(decode_pwd)
	sum := sha256.Sum256([]byte(pwd))
 	shaPWD := fmt.Sprintf("%x", sum)

 	/*exist, _ := check_name(name)
 	if exist {
 		c.JSON(http.StatusOK, gin.H{
			"status":  2,
			"message": "名稱已存在",
		})
		return
 	}*/

 	/*exist, _ = check_username(id)
 	if exist {
 		c.JSON(http.StatusOK, gin.H{
			"status":  2,
			"message": "帳號已存在",
		})
		return
 	}*/

 	exist, _ := check_password(id, shaPWD)
 	if exist {
 		c.JSON(http.StatusOK, gin.H{
			"status":  2,
			"message": "帳號密碼已存在",
		})
		return
 	}


	_, err := db.SqlDB.Exec("INSERT INTO auth(Name,Username,Password,Permissions,Time)VALUES(?,?,?,?,?)", name, id, shaPWD, userpermissions, time.Now().Format("2006-01-02 15:04:05"))
	
	if err != nil {
		fmt.Println("[ERROR]INSERT auth:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "獲取失敗!",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  1,
		"message": "success!",
	})

	path := "C:/log/使用網頁紀錄"
	message := "使用者:" + user + " 新增了使用者帳號 時間:" + time.Now().Format("2006-01-02 15:04:05") + "\n"
	message += "====================================================================\n"
	Writelog(path, message)
}

func ModifyAuth(c *gin.Context){
	user := c.PostForm("user")
	id := c.PostForm("id")
	name := c.PostForm("name")
	username := c.PostForm("username")
	pwd := c.PostForm("password")
 	userpermissions := c.PostForm("userpermissions")

 	user_name, _ := base64.StdEncoding.DecodeString(username)
	username = string(user_name)
	decode_pwd, _ := base64.StdEncoding.DecodeString(pwd)
	pwd = string(decode_pwd)
	sum := sha256.Sum256([]byte(pwd))
 	shaPWD := fmt.Sprintf("%x", sum)

 	/*exist, _ := check_name(name)
 	if exist {
 		c.JSON(http.StatusOK, gin.H{
			"status":  2,
			"message": "名稱已存在",
		})
		return
 	}*/

 	/*exist, _ = check_username(username)
 	if exist {
 		c.JSON(http.StatusOK, gin.H{
			"status":  2,
			"message": "帳號已存在",
		})
		return
 	}*/

 	exist, _ := check_password(username, shaPWD)
 	if exist {
 		c.JSON(http.StatusOK, gin.H{
			"status":  2,
			"message": "帳號密碼已存在",
		})
		return
 	}

	_, err := db.SqlDB.Query("UPDATE auth SET Name=?, Username=?, Password=?, Permissions=?, Modify=0 WHERE ID=?",name ,username , shaPWD, userpermissions, id)
	
	if err != nil {
		fmt.Println("[ERROR]UPDATE auth:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "獲取失敗!",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  1,
		"message": "success!",
	})

	path := "C:/log/使用網頁紀錄"
	message := "使用者:" + user + " 修改了使用者帳號 時間:" + time.Now().Format("2006-01-02 15:04:05") + "\n"
	message += "====================================================================\n"
	Writelog(path, message)
}

func Checkpass(c *gin.Context){
	username := c.PostForm("username")
	pwd := c.PostForm("password")

	user_name, _ := base64.StdEncoding.DecodeString(username)
	username = string(user_name)
	decode_pwd, _ := base64.StdEncoding.DecodeString(pwd)
	pwd = string(decode_pwd)
	sum := sha256.Sum256([]byte(pwd))
 	shaPWD := fmt.Sprintf("%x", sum)

	exist, _ := check_password(username, shaPWD)
 	if !exist {
 		c.JSON(http.StatusOK, gin.H{
			"status":  2,
			"message": "密碼錯誤",
		})
		return
 	}
 	c.JSON(http.StatusOK, gin.H{
		"status":  1,
		"message": "success",
	})
}

func Modifypass(c *gin.Context){
	name := c.PostForm("name")
	username := c.PostForm("username")
	pwd := c.PostForm("password")

	user_name, _ := base64.StdEncoding.DecodeString(username)
	username = string(user_name)
	decode_pwd, _ := base64.StdEncoding.DecodeString(pwd)
	pwd = string(decode_pwd)
	sum := sha256.Sum256([]byte(pwd))
 	shaPWD := fmt.Sprintf("%x", sum)

 	exist, _ := check_password(username, shaPWD)
 	if exist {
 		c.JSON(http.StatusOK, gin.H{
			"status":  2,
			"message": "不可與舊密碼相同",
		})
		return
 	}

 	rows, err := db.SqlDB.Query("UPDATE auth SET Password=? WHERE Username=?", shaPWD, username)
	defer rows.Close();

	if err != nil {
		fmt.Println("[ERROR]Get records:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "獲取失敗!",
		})
		return
	}

	err = set_time(username)
	if err != nil {
		fmt.Println("[ERROR]UPDATE Time:", err)
		return
	}
	err = set_modify(username, shaPWD)
	if err != nil {
		fmt.Println("[ERROR]UPDATE Modify:", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  1,
		"message": "success!",
	})

	path := "C:/log/使用網頁紀錄"
	message := "使用者:" + name + " 修改了使用者密碼 時間:" + time.Now().Format("2006-01-02 15:04:05") + "\n"
	message += "====================================================================\n"
	Writelog(path, message)
}

func DeleteUser(c *gin.Context){
	name := c.PostForm("name")
	username := c.PostForm("username")
	pwd := c.PostForm("password")

	user_name, _ := base64.StdEncoding.DecodeString(username)
	username = string(user_name)
	decode_pwd, _ := base64.StdEncoding.DecodeString(pwd)
	pwd = string(decode_pwd)
	sum := sha256.Sum256([]byte(pwd))
 	shaPWD := fmt.Sprintf("%x", sum)

 	_, err := db.SqlDB.Exec("DELETE FROM auth WHERE Username LIKE ? AND Password LIKE ?", username, shaPWD)
	
	if err != nil {
		fmt.Println("[ERROR]DELETE User:", err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  1,
		"message": "success!",
	})

	path := "C:/log/使用網頁紀錄"
	message := "使用者:" + name + " 刪除了使用者帳號 時間:" + time.Now().Format("2006-01-02 15:04:05") + "\n"
	message += "====================================================================\n"
	Writelog(path, message)
}

func Delete_User(c *gin.Context){
	name := c.PostForm("name")
	id := c.PostForm("id")

 	_, err := db.SqlDB.Exec("DELETE FROM auth WHERE ID LIKE ?", id)
	
	if err != nil {
		fmt.Println("[ERROR]DELETE User:", err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  1,
		"message": "success!",
	})

	path := "C:/log/使用網頁紀錄"
	message := "使用者:" + name + " 刪除了使用者帳號 時間:" + time.Now().Format("2006-01-02 15:04:05") + "\n"
	message += "====================================================================\n"
	Writelog(path, message)
}

func check_name(name string) (bool, error) {
	count := 0
	err := db.SqlDB.QueryRow("SELECT COUNT(*) FROM auth WHERE Name=?", name).Scan(&count)

	if err != nil {
		return false, err
	}

	if count >= 1 {
		return true, nil
	}
	return false, nil
}

func check_username(username string) (bool, error) {
	count := 0
	err := db.SqlDB.QueryRow("SELECT COUNT(*) FROM auth WHERE Username=?", username).Scan(&count)

	if err != nil {
		return false, err
	}

	if count >= 1 {
		return true, nil
	}
	return false, nil
}

func check_password(username string, password string) (bool, error) {
	count := 0
	err := db.SqlDB.QueryRow("SELECT COUNT(*) FROM auth WHERE Username=? AND Password=?", username, password).Scan(&count)

	if err != nil {
		return false, err
	}

	if count >= 1 {
		return true, nil
	}
	return false, nil
}

func check_modify(username string, name string, password string) (string, error) {
	shaPWD := password
	count := ""
	err := db.SqlDB.QueryRow("SELECT Modify FROM auth WHERE Username=? AND Name=? AND Password=?", username, name, shaPWD).Scan(&count)

	return count, err
}

func set_time(username string) error{
	_, err := db.SqlDB.Query("UPDATE auth SET Time=?  WHERE Username=?", time.Now().Format("2006-01-02 15:04:05"), username)
	return err
}
func set_modify(username string, password string) error{
	_, err := db.SqlDB.Query("UPDATE auth SET Modify=1  WHERE Username=? AND Password=?", username, password)
	return err
}

var err_frequency float64 = 5.0
func GetAuth(c *gin.Context) {
	username := c.PostForm("hash_username")
	password := c.PostForm("hash_PD")

	user_name, _ := base64.StdEncoding.DecodeString(username)
	username = string(user_name)
	decode_pwd, _ := base64.StdEncoding.DecodeString(password)
	password = string(decode_pwd)
	sum := sha256.Sum256([]byte(password))
 	password = fmt.Sprintf("%x", sum)

	auth := Auth{Username: username, Password: password}
	uid, err := auth.CheckAuth()
	permission := Getpermissions(username)
	name := Getname(username)
	if err != nil {
		log.Fatalln(err)
	}

	if uid > 0 {
		counter, err := Getcounter(username)
		if err != nil {
			log.Fatalln(err)
		}
		timestr, err := get_time(username)
		if err != nil {
			log.Fatalln(err)
		}
		date, err := time.Parse("2006-01-02 15:04:05", timestr)
		subtime := time.Now().Add(time.Hour * 8).Sub(date)
		if float64(counter) >= err_frequency && subtime.Minutes() < err_frequency {
			c.HTML(http.StatusOK, "login.html", gin.H{
				"message": "", "counter": counter,
			})
			return
		}


		token, err := GenerateToken(uid, name, username, password, permission)
		if err != nil {
			log.Fatalln(err)
		} else {
			session := sessions.Default(c)
			session.Set("token", token)
			session.Save()
		}
		InsertUserLog(uid, "Login", c.ClientIP())
		Exist, _ := check_modify(username, name, password)
		set_counter(username)
		set_time(username)
		if Exist == "1"{
			c.Redirect(http.StatusMovedPermanently, "/overview")
		}else{
			c.Redirect(http.StatusMovedPermanently, "/overview?modify=_")
		}
		c.Abort()

		path := "C:/log/登入紀錄"
		message := "登入IP:" + get_ip() + " 時間:" + time.Now().Format("2006-01-02 15:04:05") + "\n"
		message += "====================================================================\n"
		Writelog(path, message)

	} else {
		exist, err := check_username(username)
		counter := 0
	 	if exist {
	 		err = update_counter(username)
	 		if err != nil {
				log.Fatalln(err)
			}
	 		counter, err = Getcounter(username)
			if err != nil {
				log.Fatalln(err)
			}
			if float64(counter) == err_frequency {
				set_time(username)
			}
			if float64(counter) >= err_frequency {
				timestr, err := get_time(username)
				if err != nil {
					log.Fatalln(err)
				}
				date, err := time.Parse("2006-01-02 15:04:05", timestr)
				subtime := time.Now().Add(time.Hour * 8).Sub(date)
				if subtime.Minutes() > err_frequency {
					set_counter(username)
					set_time(username)
					_ = update_counter(username)
					counter, err = Getcounter(username)
				}
			}
	 	}
		c.HTML(http.StatusOK, "login.html", gin.H{
			"message": "帳號或密碼錯誤！", "counter": counter,
		})
		path := "C:/log/登入異常"
		message := "(登入失敗)輸入帳號:" + username + "輸入密碼:" + password + "用戶IP:" + get_ip() + "時間:" + time.Now().Format("2006-01-02 15:04:05") + "\n"
		message += "====================================================================\n"
		Writelog(path, message)
	}
}

func GetAuthList(c *gin.Context){

	sql:=""
	sql = fmt.Sprintf("SELECT ID, Name, Username FROM auth WHERE Permissions=1 OR Permissions=0")

	rows, err := db.SqlDB.Query(sql)
	defer rows.Close();

	if err != nil {
		fmt.Println("[ERROR]Get Auth:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "獲取失敗!",
		})
		return
	}

	var auths []Auth
	for rows.Next() {
		var auth Auth
		rows.Scan(&auth.ID, &auth.Name, &auth.Username)
		auths = append(auths, auth)
	}
	c.JSON(http.StatusOK, auths)
}

type Search_Id struct {
	ID string `json:"id" form:"id"`
}

func GetAuthOnly(c *gin.Context){
	search := new(Search_Id)
	c.BindQuery(&search)

	name := ""
	username := ""
	err := db.SqlDB.QueryRow("SELECT Name, Username FROM auth WHERE ID=?", search.ID).Scan(&name, &username)

	if err != nil {
		fmt.Println("[ERROR]Get Auth:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "獲取失敗!",
		})
		return
	}

	var auth Auth
	auth.Name = name
	auth.Username = username
	c.JSON(http.StatusOK, auth)
}

func InsertUserLog(uid int, action string, ip string) {
	t := time.Now()
	time := t.Format("2006-01-02 15:04:05")
	_, err := db.SqlDB.Exec("INSERT INTO userlog(Uid, Time, Action, IP)VALUES(?, ?, ?, ?)", uid, time, action, ip)

	if err != nil {
		fmt.Println("[ERROR]Insert log:", err)
		return
	}
}

func Getpermissions(username string) string{
	sql:=""
	sql = fmt.Sprintf("SELECT Permissions FROM auth WHERE Username LIKE '%s'", username)

	rows, err := db.SqlDB.Query(sql)
	defer rows.Close();

	if err != nil {
		fmt.Println("[ERROR]Insert log:", err)
		return "0"
	}
	permission := ""
	for rows.Next() {
		rows.Scan(&permission)
	}
	return permission
	//fmt.Println(permission)
	//return permission
}

func Getname(username string) string{
	sql:=""
	sql = fmt.Sprintf("SELECT Name FROM auth WHERE Username LIKE '%s'", username)

	rows, err := db.SqlDB.Query(sql)
	defer rows.Close();

	if err != nil {
		fmt.Println("[ERROR]Insert log:", err)
		return "0"
	}
	permission := ""
	for rows.Next() {
		rows.Scan(&permission)
	}
	return permission
	//fmt.Println(permission)
	//return permission
}

func Getcounter(username string) (int, error) {
	count := 0
	err := db.SqlDB.QueryRow("SELECT Counter FROM auth WHERE Username=?", username).Scan(&count)
	return count, err
}

func get_time(username string) (string, error) {
	time := ""
	err := db.SqlDB.QueryRow("SELECT Time FROM auth WHERE Username=?", username).Scan(&time)
	return time, err
}

func set_counter(username string) (error){
	rows, err := db.SqlDB.Query("UPDATE auth SET Counter=0 WHERE Username=?", username)
	defer rows.Close();
	return err
}

func update_counter(username string) (error){
	rows, err := db.SqlDB.Query("UPDATE auth SET Counter=Counter+1 WHERE Username=?", username)
	defer rows.Close();
	return err
}

func get_ip() string {
	url := "https://api.ipify.org?format=text"
	resp, err := http.Get(url)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	ip, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}
	return string(ip)
}

func Writelog(path string, message string){
    err := os.MkdirAll(path, os.ModePerm)
    date := time.Now().Format("2006-01-02")
    filePath := path + "/" + date + ".txt"
    file, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0666)
    if err != nil {
        fmt.Println("文件打开失败", err)
    }
    //及时关闭file句柄
    defer file.Close()
    //写入文件时，使用带缓存的 *Writer
    write := bufio.NewWriter(file)
    write.WriteString(message)
    //Flush将缓存的文件真正写入到文件中
    write.Flush()
}