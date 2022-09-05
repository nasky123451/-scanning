package api

import(
    "time"

)

const TIME_LAYOUT = "2006-01-02 15:04:05"
const TIME_LAYOUT_MINUTE = "2006-01-02 15:04"

// 计算日期相差多少天
// 返回值day>0, t1晚于t2; day<0, t1早于t2
func SubDays(t1,t2 time.Time)(day int)  {
    swap := false
    if t1.Unix() < t2.Unix(){
        t_:= t1
        t1 = t2
        t2 = t_
        swap = true
    }

    day = int(t1.Sub(t2).Hours()/24)

    // 计算在被24整除外的时间是否存在跨自然日
    if int(t1.Sub(t2).Milliseconds())%86400000 > int(86400000-t2.Unix()%86400000) {
        day += 1
    }

    if swap {
        day = -day
    }

    return
}

// 计算日期相差多少月
func SubMonth(t1, t2 time.Time) (month int) {
    y1 := t1.Year()
    y2 := t2.Year()
    m1 := int(t1.Month())
    m2 := int(t2.Month())
    d1 := t1.Day()
    d2 := t2.Day()

    yearInterval := y1 - y2
    // 如果 d1的 月-日 小于 d2的 月-日 那么 yearInterval-- 这样就得到了相差的年数
    if m1 < m2 || m1 == m2 && d1 < d2 {
        yearInterval--
    }
    // 获取月数差值
    monthInterval := (m1 + 12) - m2
    if d1 < d2 {
        monthInterval--
    }
    monthInterval %= 12
    month = yearInterval*12 + monthInterval
    return
}