package api

import(
    "fmt"
    "time"
    "os"
    "bufio"
    "github.com/gin-gonic/gin"
)

func write_log(path string, message string){
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

func Write_log(c *gin.Context){
    path := c.PostForm("path")
    message := c.PostForm("message")

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