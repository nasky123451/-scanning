package api

import (
	"fmt"
	"net"
	"time"
	"os/exec"

	db "github.com/web/DBConnector"
	//."github.com/web/models"
	//"github.com/gin-gonic/gin"
)

func HeartBeat_Update(id string, ip string) {
    //fmt.Println("Hello, World!")
    //NetWorkStatus()
    //db.DBInit()
    /*rows, err := db.SqlDB.Query("SELECT ID, Type, IP, Name, LastTime FROM site")
   	if err != nil {
		fmt.Println("[ERROR]Get sites:", err)
		return
	}

	for rows.Next() {
		var site HeartBeat
		rows.Scan(&site.ID, &site.Type, &site.IP, &site.Name, &site.LastTime)
		if isping(site.IP) == true {
			_, err = db.SqlDB.Exec("UPDATE site SET LastTime=NOW() WHERE ID=?", site.ID)
		}
	}*/
   //test_ip := "192.168.0.1"
	if isping(ip) == true {
		_, err := db.SqlDB.Exec("UPDATE site SET LastTime=NOW() WHERE ID=?", id)

	   	if err != nil {
		fmt.Println("[ERROR]Get sites:", err)
		return
		}
	}

}


func CheckServer(){
	timeout := time.Duration(5 * time.Second)
	t1 := time.Now()
	_, err := net.DialTimeout("tcp","192.168.0.9:11003", timeout)
	fmt.Println("waist time :", time.Now().Sub(t1))
	if err != nil {
		fmt.Println("Site unreachable, error: ", err)
		return
	}
	fmt.Println("tcp server is ok")
}


func NetWorkStatus() bool {
	cmd := exec.Command("ping", "www.google.com", "-c", "4", "-W", "5")
	fmt.Println("NetWorkStatus Start:", time.Now().Unix())
	err := cmd.Run()
	fmt.Println("NetWorkStatus End  :", time.Now().Unix())
	if err != nil {
		fmt.Println(err.Error())
		return false
	} else {
		fmt.Println("Net Status , OK")
	}
	return true
}

func isping(ip string) (bool) {
	recvBuf1 := make([]byte, 2048)
	payload:=[]byte{0x08,0x00,0x4d,0x4b,0x00,0x01,0x00,0x10,0x61,0x62,0x63,0x64,0x65,0x66,0x67,0x68,0x69,0x6a,0x6b,0x6c,0x6d,0x6e,0x6f,0x70,0x71,0x72,0x73,0x74,0x75,0x76,0x77,0x61,0x62,0x63,0x64,0x65,0x66,0x67,0x68,0x69}
	Time, _ := time.ParseDuration("3s")
	conn, err := net.DialTimeout("ip4:icmp", ip,Time)
	if err !=nil {
		fmt.Println("bibi")
		return false
	}
	_,err=conn.Write(payload)
	if err !=nil {
		return false
	}
	conn.SetReadDeadline(time.Now().Add(time.Second * 2))
	num, err := conn.Read(recvBuf1[0:])
	if err !=nil {
		//check 80 3389 443 22 port
		Timetcp, _ := time.ParseDuration("1s")
		conn1, err := net.DialTimeout("tcp", ip+":80",Timetcp)
		if err == nil {
			defer conn1.Close()
			return true
		}

		conn2, err := net.DialTimeout("tcp", ip+":443",Timetcp)
		if err == nil {
			defer conn2.Close()
			return true
		}

		conn3, err := net.DialTimeout("tcp", ip+":3389",Timetcp)
		if err == nil {
			defer conn3.Close()
			return true
		}

		conn4, err := net.DialTimeout("tcp", ip+":22",Timetcp)
		if err == nil {
			defer conn4.Close()
			return true
		}

		return false
	}
	conn.SetReadDeadline(time.Time{})
	if string(recvBuf1[0:num]) !="" {
		return  true
	}
	return false

}
