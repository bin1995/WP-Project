import urllib.request
import json
import gzip
import pymysql
url = 'http://data.taipei/youbike'
#urllib.request.urlretrieve(url, "data.gz")
jdata = gzip.open('data.gz', 'r').read()
jdata = jdata.decode('UTF-8','strict')
data = json.loads(jdata)

conn = pymysql.connect(host="", user="", passwd="", db="")
c = conn.cursor()

for key,value in data["retVal"].items():
    sno = value["sno"]
    sna = value["sna"]
    tot = value["tot"]
    sbi = value["sbi"] 
    sarea = value["sarea"]
    mday = value["mday"]
    lat = value["lat"]
    lng = value["lng"]
    ar = value["ar"]
    sareaen = value["sareaen"]
    snaen = value["snaen"]
    aren = value["aren"]
    bemp = value["bemp"]
    act = value["act"]

    sql = "INSERT INTO `data`(`sno`, `tot`, `sbi`, `mday`, `lat`, `lng`,`sareaen`,`snaen`,`aren`, `bemp`, `act`) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    try:
        c.execute(sql,(sno,tot,sbi,mday,lat,lng,sareaen,snaen,aren,bemp,act) )
        conn.commit()
    except :
        conn.rollback()
conn.close()

