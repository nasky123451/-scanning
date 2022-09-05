package api

import(
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	db "github.com/web/DBConnector"

)

type Login struct {
	Login      string `json:"login" form:"login"`
	Password  string `json:"password" form:"password"`
	NewPassword  string `json:"newpassword" form:"newpassword"`
	CheckPassword   string `json:"checkpassword" form:"checkpassword"`
}


var id string
var pwd string
func GetPassword(c *gin.Context){
	id := c.PostForm("login")
	pwd := c.PostForm("password")
 	shaPWD := pwd	

	rows, err := db.SqlDB.Query("SELECT Password FROM auth where Username=?", id)
	defer rows.Close();

	if err != nil {
		fmt.Println("[ERROR]Get records:", err)
		c.JSON(http.StatusOK, gin.H{
			"status":  -1,
			"message": "獲取失敗!",
		})
		return
	}
	for rows.Next() {
		rows.Scan(&pwd)
	}
	if(shaPWD != pwd){
		return
	}
	c.JSON(http.StatusOK, pwd)
}
func UpdatePassword(c *gin.Context){
	id := c.PostForm("id")
	pwd := c.PostForm("password")
 	shaPWD := pwd

	//fmt.Println("id=", id)

	rows, err := db.SqlDB.Query("UPDATE auth SET Password=? WHERE Username=?", shaPWD, id)
	defer rows.Close();

	if err != nil {
		fmt.Println("[ERROR]Get records:", err)
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
}
func CheckAdmin(c *gin.Context){
	id := c.PostForm("id")
	pwd := c.PostForm("password")
 	shaPWD := pwd
 	resultid, err := db.SqlDB.Query("SELECT ID FROM auth where Username=? AND Password=? AND Permissions=?", id, shaPWD, "1")
	defer resultid.Close();
	var Id = ""
	for resultid.Next() {
		resultid.Scan(&Id)
	}

	if Id == "" {
		return
	}
	if err != nil {
		fmt.Println("[ERROR]Get records:", err)
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
}

func CheckUser(c *gin.Context){
	id := c.PostForm("id")
	pwd := c.PostForm("password")
 	shaPWD := pwd

 	resultid, err := db.SqlDB.Query("SELECT ID FROM auth where Username=? AND Password=?", id, shaPWD)
 	defer resultid.Close();
	var Id = ""
	for resultid.Next() {
		resultid.Scan(&Id)
	}

	if Id == "" {
		return
	}
	if err != nil {
		fmt.Println("[ERROR]Get records:", err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  1,
		"message": "success!",
	})
}

func ModifyUserPermissions(c *gin.Context){
	id := c.PostForm("id")
	pwd := c.PostForm("password")
 	shaPWD := pwd
 	userpermissions := c.PostForm("userpermissions")

	resultid, err := db.SqlDB.Query("UPDATE auth SET Permissions=? WHERE Username=? AND Password=?", userpermissions, id, shaPWD)
	defer resultid.Close();
	if err != nil {
		fmt.Println("[ERROR]Modify User Permissions:", err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  1,
		"message": "success!",
	})
}

func Forgotpwd(c *gin.Context){
	username := c.PostForm("username")
	//fmt.Println(username)

	name := ""
	err := db.SqlDB.QueryRow("SELECT Name FROM auth WHERE Username=?", username).Scan(&name)
	if err != nil {
		fmt.Println("[ERROR]SELECT auth :", err)
		return
	}

	//fmt.Println(name)
	message := "(通知)使用者:"+name+" 忘記密碼"
	lineNotify_non(message)
	//fmt.Println(message)
	c.JSON(http.StatusOK, gin.H{
		"status":  1,
		"message": "success!",
	})
}

/*func GetPicByID(c *gin.Context){
	fmt.Println("GetPicByID")
	type IDs struct {
		RecordIDs string `json:"ids" form:"ids"`
		Type 	  string `json:"type" form:"type"`
		FileName  string `json:"filename" form:"filename"`
	}
	
	var ids IDs

	c.Bind(&ids)

	if ((ids.RecordIDs == "") ||(ids.FileName == "")) {
		c.JSON(http.StatusOK, gin.H{
			"status" : -1,
			"msg" : "ids or filename can't be null.",
		})
 		return
	}
 	
	zipPath, err := createZip(ids.RecordIDs, "./public/download/", ids.FileName, ids.Type)
	if err != nil{
		fmt.Println("[ERROR]create ZIP:", err)
		c.JSON(http.StatusOK, gin.H{
			"status" : -1,
			"msg" : "Create zip fail!",
		})
		return
	}

	session := sessions.Default(c)
	token := session.Get("token").(string)
	claims, _ := ParseToken(token)
	username := claims.Username
	
	if (username == "police"){
		sql := ""
		if ids.Type == "1" {
			sql = fmt.Sprintf("UPDATE record_truck SET Downloaded=%d WHERE ID IN(%s)", 1, ids.RecordIDs)
		}else if ids.Type == "2" {
			sql = fmt.Sprintf("UPDATE record_clear SET Downloaded=%d WHERE ID IN(%s)", 1, ids.RecordIDs)
		}else if ids.Type == "3" {
			sql = fmt.Sprintf("UPDATE record_cross SET Downloaded=%d WHERE ID IN(%s)", 1, ids.RecordIDs)
		}
		
		_, err1 := db.SqlDB.Exec(sql)
		if err1 != nil{
			fmt.Println("update isDownload error: ", err1)
			c.JSON(http.StatusOK, gin.H{
				"status" : -1,
				"msg" : "Update downloaded fail!",
			})
			return
		}
	}
	
	
	zipPath = strings.Replace(zipPath, "./public", "", -1)
	
	c.Redirect(http.StatusFound, zipPath)
}*/
