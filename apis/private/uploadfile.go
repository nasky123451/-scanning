package api

import (
	"fmt"
	//"time"
	
	"github.com/gin-gonic/gin"
)

func ReceiveAjax(c *gin.Context){
	fmt.Println("File in....")

    form, _ := c.MultipartForm()
    files := form.File["the_file"]
    for _, file := range files {
        fmt.Println(file.Filename)
        c.SaveUploadedFile(file, "C:/work/go/src/github.com/web/apis/private/" + file.Filename)
	}

}


